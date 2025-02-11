import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import FullLogo from "../../public/icons/FullLogo.svg";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Compute the fallback letter for the avatar (first letter of the user's name)
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo and navigation links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image
                  src={FullLogo}
                  alt="Your Company"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            {/* Navigation links are visible only if the user is signed in */}
            {session && (
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    href="/"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/team"
                    className="rounded-md px-3 py-2 text-sm font-medium black hover:bg-gray-700 hover:text-white"
                  >
                    Team
                  </Link>
                  <Link
                    href="/projects"
                    className="rounded-md px-3 py-2 text-sm font-medium black hover:bg-gray-700 hover:text-white"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/calendar"
                    className="rounded-md px-3 py-2 text-sm font-medium black hover:bg-gray-700 hover:text-white"
                  >
                    Calendar
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right side: user controls */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {status === "loading" ? (
              <Loader className="h-6 mr-4 mt-4 float-right animate-spin" />
            ) : session ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none relative p-4 md:p-8">
                  <div className="flex gap-4 items-center">
                    <Avatar className="h-10 w-10 hover:opacity-75 transition">
                      <AvatarImage
                        className="h-10 w-10 hover:opacity-75 transition"
                        src={session.user?.image || undefined}
                      />
                      <AvatarFallback className="bg-sky-900 text-white">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="bottom"
                  className="w-50"
                >
                  <DropdownMenuItem className="h-10" onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex justify-end p-4 gap-4">
                <Button>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu for signed in users */}
      {mobileMenuOpen && session && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
              href="/"
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Dashboard
            </Link>
            <Link
              href="/team"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Team
            </Link>
            <Link
              href="/projects"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </Link>
            <Link
              href="/calendar"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
