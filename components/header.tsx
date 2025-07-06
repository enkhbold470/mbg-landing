import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { ProfileIcon } from "./profile-icon";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">{siteConfig.name}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Онцлогууд
            </a>
            <a href="/#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
              Сэтгэгдэлүүд
            </a>
            <a href="/#about" className="text-gray-600 hover:text-purple-600 transition-colors">
              Бидний тухай
            </a>
            <a href="/#faq" className="text-gray-600 hover:text-purple-600 transition-colors">
              Асуулт
            </a>
            <a href="/#contact" className="text-gray-600 hover:text-purple-600 transition-colors">
              Холбоо барих
            </a>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button variant="outline" size="sm">Нэвтрэх</Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">Бүртгүүлэх</Button>
                </SignUpButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <ProfileIcon />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
