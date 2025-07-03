"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const scrolled = useScroll();

  return (
    <nav
      className={cn(
        "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
        scrolled && " backdrop-blur-2xl border-white/30 shadow-lg"
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.png"
           alt="logo" 
           width={200} 
           height={200} 
           priority
           className="w-10 h-10  object-cover hover:animate-spin hover:transition-transform hover:duration-500 hover:ease-in-out"
           />
          <span className="font-bold text-2xl">Velo</span>
        </Link>
        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link href="/how-it-works" className="font-medium text-white/90 hover:text-white transition-colors">How it works</Link>
          <Link href="/enterprise" className="font-medium text-white/90 hover:text-white transition-colors">Enterprise</Link>
          <Link href="/pricing" className="font-medium text-white/90 hover:text-white transition-colors">Pricing</Link>
          <Link href="/learn" className="font-medium text-white/90 hover:text-white transition-colors">Learn</Link>
        </div>
        {/* Auth Buttons */}
        <SignedOut>
          <div className="flex gap-2">
            <Link href="/auth/get-started">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
};

export { Navbar };
