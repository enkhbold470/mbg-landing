
import Link from "next/link";

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
            <Link href="/#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Онцлогууд
            </Link>
            <Link href="/#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
              Сэтгэгдэлүүд
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-purple-600 transition-colors">
              Бидний тухай
            </Link>
            <Link href="/#faq" className="text-gray-600 hover:text-purple-600 transition-colors">
              Асуулт
            </Link>
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
    
            <Link href="/#contact">
              Холбоо барих
            </Link>
            </div>
          </div>

         
        </div>
      </div>
    </header>
  );
}
