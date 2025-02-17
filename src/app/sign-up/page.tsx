"use client";

// shadcn ui

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
import { toast } from "sonner";

//react icons
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      router.push("/sign-in");
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setError(data.message);
      setPending(false);
    }
  }
  
  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 sm:px-0">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 shadow-lg bg-secondary rounded-[6px] border border-zinc-400">
        <CardHeader>
          <CardTitle className="text-center text-black-100 text-2xl font-bold">
            Sign Up
          </CardTitle>
          <CardDescription className="text-sm text-center text-gray-100">
            Use email or a provider to create an account
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-[6px] flex items-center gap-x-2 text-sm mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              disabled={pending}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border-zinc-400 bg-primary focus:border-gray-500 focus:ring focus:ring-zinc-300 transition-all duration-200 rounded-[6px]"
            />
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border-zinc-400 bg-primary focus:border-gray-500 focus:ring focus:ring-zinc-300 transition-all duration-200 rounded-[6px]"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border-zinc-400 bg-primary focus:border-gray-500 focus:ring focus:ring-zinc-300 transition-all duration-300 rounded-[6px]"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className="border-zinc-400 bg-primary focus:border-gray-500 focus:ring focus:ring-zinc-300 transition-all duration-300 rounded-[6px]"
            />
            <Button
              className="w-full bg-black-100 hover:bg-gray-200 text-white font-semibold text-lg py-3 rounded-3xl transition-all duration-300"
              size="lg"
              disabled={pending}
            >
              Continue
            </Button>
          </form>

          <Separator className="my-4 bg-black-100" />

          <div className="flex justify-evenly flex-col space-y-3">
            <Button
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="lg"
              className="bg-primary hover:bg-zinc-200 text-black-100 py-2 rounded-[6px] transition-all duration-300 border-zinc-400"
            >
              <FcGoogle className="size-6" />
              Sign up with Google
            </Button>
            <Button
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="lg"
              className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-[6px] transition-all duration-300 border-zinc-400"
            >
              <FaGithub className="size-6" />
              Sign up with GitHub
            </Button>
          </div>
          <p className="text-center text-sm mt-4 text-gray-100">
            Already have an account?{" "}
            <Link
              className="text-black-100 hover:underline cursor-pointer"
              href="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
