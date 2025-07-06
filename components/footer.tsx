import Link from "next/link";
import { Sparkles, Globe,MessageCircle, HelpCircle, Download } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-purple-900 text-white py-16 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{siteConfig.name}</h3>
            </div>
            <p className="text-purple-200 text-sm italic">"{siteConfig.slogan}"</p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Холбоосууд</h4>
            <div className="space-y-2">
              <Link
                href="/courses"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Сургалтын хөтөлбөрүүд
              </Link>
              <Link
                href="/#contact"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Холбоо барих
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Асуудал мэдэгдэх
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Хамтын нийгэмлэг</h4>
            <p className="text-gray-300 text-sm mb-3">
              Хичээлийн талаар тусламж хэрэгтэй юу?
            </p>
            <Link
              href={siteConfig.links.discord}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              target="_blank"
            >
              <MessageCircle className="w-4 h-4" />
              Discord-т нэгдэх
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-6"></div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            © {new Date().getFullYear()} {siteConfig.name} by{" "}
            <Link
              href="https://github.com/enkhbold470"
              target="_blank"
              className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <Globe className="w-3 h-3 group-hover:scale-110 transition-transform" />
              enk.icu
            </Link>
          </p>
          <p className="text-gray-400 text-xs">
            {siteConfig.description}
          </p>
        </div>
      </div>
    </footer>
  );
}
