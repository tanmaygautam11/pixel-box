"use client";
import { useSession } from "next-auth/react";
import Home from "./home/page";
import Navbar from "@/components/Navbar";

const Page = () => {
    const { data: session } = useSession();
  
  return (
    <div>
      <Navbar />
        {session ? <Home /> : <p>Not signed in</p>}
    </div>
  );
};

export default Page;
