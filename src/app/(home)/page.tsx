"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Home from "./Home";
import Landing from "./Landing";
import Loader from "@/components/Loader"; // Import the Loader component

const Page = () => {
  const { data: session, status } = useSession();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false); // Hide loader after 1 second
    }, 1000);

    return () => clearTimeout(loaderTimeout); // Clean up the timeout
  }, []);

  if (status === "loading" || showLoader) {
    return <Loader />;
  }

  return (
    <div className="bg-primary h-full">{session ? <Home /> : <Landing />}</div>
  );
};

export default Page;
