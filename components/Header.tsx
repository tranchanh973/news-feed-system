import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessagesSquare,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        className="rounded-lg"
        src="/logo.jpg"
        width={40}
        height={40}
        alt="logo"
      />
      <div className="flex-1 min-w-10">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600 " />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>
      <div className="flex items-center space-x-4 px-6">
        <Link href="/" className="icon">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>

        <Link href="/" className="icon">
          <MessagesSquare className="h-5" />
          <p>Message</p>
        </Link>

        {/* User Button  if signed in*/}
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* Sign in Button if not signed in*/}
        <SignedOut>
          <Button asChild className="bg-[#0B63C4] text-white">
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
