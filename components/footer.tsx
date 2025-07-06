import Link from "next/link";
import { Sparkles, Github, MessageCircle, HelpCircle, Download } from "lucide-react";

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
              <h3 className="text-2xl font-bold">MBG Education</h3>
            </div>
            <p className="text-purple-200 text-sm italic">"Тэгээс тэтгэлэгт тэнцэх нь"</p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/install"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Install App
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Contact Support
              </Link>
              <Link
                href="https://github.com/enkhbold470/mbg-cargo/issues"
                target="_blank"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-purple-300 transition-colors group"
              >
                <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Report Issues
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Community</h4>
            <p className="text-gray-300 text-sm mb-3">
              Need help with your application?
            </p>
            <Link
              href="https://discord.gg/bJWTS7qem6"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              target="_blank"
            >
              <MessageCircle className="w-4 h-4" />
              Join Discord
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-6"></div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            © 2024 MBG Scholarship Services by{" "}
            <Link
              href="https://github.com/enkhbold470"
              target="_blank"
              className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Enkhbold Ganbold
            </Link>
          </p>
          <p className="text-gray-400 text-xs">
            Helping Mongolian students achieve their Chinese education dreams.
          </p>
        </div>
      </div>
    </footer>
  );
}
