"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
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
import Logo from "../../public/icons/Logo.svg"; // The smaller logo used when not logged in

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Fallback for the user's avatar (first letter of their name)
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  // A helper function to return active/inactive link classes.
  const navLinkClasses = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      pathname === href
        ? "border-b-2 border-zinc-300 text-black-100" // Active: underline in secondary color & primary text
        : "text-gray-100 hover:text-zinc-600 hover:border-b-2 border-secondary" // Inactive: light text, hover to primary
    }`;

  return (
    <nav className="border-[1.8px] border-secondary-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu toggle – only when logged in */}
          {session && (
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-[6px] p-2 text-gray-100 hover:bg-secondary-100 hover:text-black-200 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
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
          )}

          {/* Logo and navigation links */}
          <div
            className={`flex flex-1 items-center ${
              session ? "justify-evenly sm:justify-start" : "justify-start"
            }`}
          >
            <div className="flex shrink-0 items-center">
              <Link href="/">
                {session ? (
                  // If logged in, always use the full logo even on small devices.
                  <div className="relative w-36 h-16">
                    <Image src={FullLogo} alt="logo" fill />
                  </div>
                ) : (
                  <>
                    {/* When logged out, show the small logo on mobile, full logo on larger screens */}
                    <div className="block sm:hidden relative w-12 h-12">
                      <Image src={Logo} alt="logo" fill />
                    </div>
                    <div className="hidden sm:block relative w-36 h-16">
                      <Image src={FullLogo} alt="logo" fill />
                    </div>
                  </>
                )}
              </Link>
            </div>
            {/* Navigation links – visible only when logged in */}
            {session && (
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link href="/" className={navLinkClasses("/")}>
                    Home
                  </Link>
                  <Link
                    href="/collections"
                    className={navLinkClasses("/collections")}
                  >
                    Collections
                  </Link>
                  <Link
                    href="/trending"
                    className={navLinkClasses("/trending")}
                  >
                    Trending
                  </Link>
                  <Link href="/latest" className={navLinkClasses("/latest")}>
                    Latest
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right side: User controls (logged in) or Sign in/Sign up (logged out) */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {status === "loading" ? (
              <Loader className="h-6 mr-4 mt-4 float-right animate-spin" />
            ) : session ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none relative md:p-8">
                  <div className="flex gap-4 items-center">
                    <Avatar className="h-10 w-10 hover:opacity-75 transition">
                      <AvatarImage
                        className="h-10 w-10 hover:opacity-75 transition"
                        src={session.user?.image || undefined}
                      />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="bottom"
                  className="w-50 bg-primary rounded-[6px] border-2 border-secondary-100 hover:bg-secondary-100"
                >
                  <DropdownMenuItem
                    className="h-10 text-gray-100 hover:text-black-100"
                    onClick={handleSignOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex justify-end p-0 gap-2 sm:p-4 sm:gap-4">
                <Button className="group relative overflow-hidden rounded-[6px] bg-secondary-100 border-2 border-secondary-100 h-8 px-3 py-1 sm:px-4 sm:h-9">
                  <Link
                    href="/sign-in"
                    className="relative z-10 block transition-colors duration-200 text-black-100 group-hover:text-secondary text-xs font-semibold sm:text-sm"
                  >
                    Sign in
                  </Link>
                  <span className="absolute left-0 top-0 h-full w-0 bg-black-100 transition-all duration-200 ease-out group-hover:w-full" />
                </Button>
                <Button className="group relative overflow-hidden rounded-[6px] border-2 border-secondary-100 px-3 py-1 h-8 sm:px-4 sm:h-9">
                  <Link
                    href="/sign-up"
                    className="relative z-10 block transition-colors duration-200 text-black-100 group-hover:text-secondary font-semibold text-xs sm:text-sm"
                  >
                    Sign up
                  </Link>
                  <span className="absolute left-0 top-0 h-full w-0 bg-black-100 transition-all duration-200 ease-out group-hover:w-full" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu for logged in users */}
      {mobileMenuOpen && session && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
              href="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/"
                  ? "border-b-2 border-zinc-300 text-black-100"
                  : "text-gray-100 hover:text-zinc-600 hover:border-b-2 border-secondary"
              }`}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href="/collections"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/collections"
                  ? "border-b-2 border-zinc-300 text-black-100"
                  : "text-gray-100 hover:text-zinc-600 hover:border-b-2 border-secondary"
              }`}
              aria-current={pathname === "/collections" ? "page" : undefined}
            >
              Collections
            </Link>
            <Link
              href="/trending"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/trending"
                  ? "border-b-2 border-zinc-300 text-black-100"
                  : "text-gray-100 hover:text-zinc-600 hover:border-b-2 border-secondary"
              }`}
              aria-current={pathname === "/trending" ? "page" : undefined}
            >
              Trending
            </Link>
            <Link
              href="/latest"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === "/latest"
                  ? "border-b-2 border-zinc-300 text-black-100"
                  : "text-gray-100 hover:text-zinc-600 hover:border-b-2 border-secondary"
              }`}
              aria-current={pathname === "/latest" ? "page" : undefined}
            >
              Latest
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
