"use client";
import { useSession } from "next-auth/react";
import Home from "./Home";
import Landing from "./Landing";

const Page = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-primary h-full">{session ? <Home /> : <Landing />}</div>
  );
};

export default Page;
