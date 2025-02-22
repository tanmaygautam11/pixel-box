import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User, { IUser } from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = (await User.findOne({
          email: credentials?.email,
        })) as IUser | null;

        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(
          credentials?.password ?? "",
          user.password as string
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      await connectToDatabase();

      if (user) {
        let dbUser = await User.findOne({ email: user.email });

        // ✅ If the user doesn't exist, create a new user in MongoDB
        if (!dbUser) {
          dbUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        }

        token.id = dbUser._id.toString();
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.picture = dbUser.image ?? "";

        // ✅ Store OAuth access token
        if (account) {
          token.accessToken = account.access_token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.picture;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
