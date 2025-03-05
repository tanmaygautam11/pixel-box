"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Home from "./Home";
import Landing from "./Landing";
import Loader from "@/components/Loader";

const Page = () => {
  const { data: session, status } = useSession();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(loaderTimeout);
  }, []);

  if (status === "loading" || showLoader) {
    return <Loader />;
  }

  return (
    <div className="bg-primary h-full">{session ? <Home /> : <Landing />}</div>
  );
};

export default Page;
