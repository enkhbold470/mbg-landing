import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { ProfileIcon } from "./profile-icon";
import { GraduationCap, FileText, Home as HomeIcon, Building2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold text-primary flex items-center gap-2"
        >
          <GraduationCap className="h-6 w-6" />
          <span className="hidden sm:inline">{siteConfig.name}</span>
          <span className="sm:hidden">MBG</span>
          <span className="uppercase text-xs border border-primary rounded-full px-2 py-1">
            туршилт
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
          
          <SignedIn>
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/scholarships" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Scholarships
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/universities" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Universities
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/applications" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Applications
                </Link>
              </Button>
            </nav>
            
            <ProfileIcon />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
