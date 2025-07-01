import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { ProfileIcon } from "./profile-icon";
import { Package, FileText, Home as HomeIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-border bg-white">
      <Link
        href="/"
        className="text-xl font-bold text-primary hover:scale-110 transition-all duration-300 flex items-center gap-2"
      >
        <Package className="h-6 w-6" />
        {siteConfig.name}
        <span className="uppercase text-xs border border-primary rounded-full px-2 py-1">
          delivery
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/orders" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Orders
              </Link>
            </Button>
            
            <ProfileIcon />
          </nav>
        </SignedIn>
      </div>
    </header>
  );
}
