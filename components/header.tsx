'use client'

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { siteConfig } from "@/config/site"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { href: "/#features", text: "Онцлогууд" },
    { href: "/#testimonials", text: "Сэтгэгдэлүүд" },
    { href: "/#about", text: "Бидний тухай" },
    { href: "/#faq", text: "Асуулт" },
    { href: "/courses", text: "Сургалтууд" },
  ]

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href} 
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                {link.text}
              </Link>
            ))}
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Link href="/#contact">
                Холбоо барих
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-gray-600 hover:text-purple-600 transition-colors py-2 border-b border-gray-100 last:border-b-0"
                  onClick={closeMenu}
                >
                  {link.text}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/#contact"
                  className="block w-full text-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={closeMenu}
                >
                  Холбоо барих
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Background Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}
