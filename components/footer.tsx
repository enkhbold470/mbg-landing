import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 border-t bg-gray-50/50 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
            <Link
              href="/install"
              className="hover:text-blue-600 transition-colors"
            >
              Install App
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact Support
            </Link>
            <span className="hidden md:inline">•</span>
            <Link
              href="https://github.com/enkhbold470/mbg-cargo/issues"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              Report Issues
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Need help with your application? Join our{" "}
              <Link
                href="https://discord.gg/bJWTS7qem6"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                target="_blank"
              >
                Discord community
              </Link>
              {" "}for support!
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>
            © 2024 MBG Scholarship Services by{" "}
            <Link
              href="https://github.com/enkhbold470"
              target="_blank"
              className="hover:text-gray-600 transition-colors"
            >
              Enkhbold Ganbold
            </Link>
            . Helping Mongolian students achieve their Chinese education dreams.
          </p>
        </div>
      </div>
    </footer>
  );
}
