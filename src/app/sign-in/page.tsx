"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// React Icons
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("Login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    provider: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <Card className="w-[90%] sm:w-[420px] p-6 sm:p-8 shadow-lg bg-gray-900 rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm text-center text-gray-400">
            Use your email or a provider to sign in
          </CardDescription>
        </CardHeader>

        {/* Error Message */}
        {!!error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-md flex items-center gap-x-2 text-sm mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              disabled={pending}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-700 bg-gray-800 text-white focus:border-gray-500 focus:ring focus:ring-gray-600 transition-all duration-300 rounded-md"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-700 bg-gray-800 text-white focus:border-gray-500 focus:ring focus:ring-gray-600 transition-all duration-300 rounded-md"
            />
            <Button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold text-lg py-3 rounded-md transition-all duration-300"
              size="lg"
              disabled={pending}
            >
              Continue
            </Button>
          </form>

          <Separator className="my-4 bg-gray-700" />

          {/* Social Login Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-all duration-300"
            >
              <FcGoogle className="size-6 mr-2" />
              Sign in with Google
            </Button>

            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-all duration-300"
            >
              <FaGithub className="size-6 mr-2" />
              Sign in with GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-4 text-gray-400">
            Dont have an account?{" "}
            <Link
              className="text-gray-300 hover:underline cursor-pointer"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
