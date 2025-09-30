"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Globe ,
  Menu,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
const navigation = [
  { href: "/#about", text: "MBG-ийн тухай" },
  { href: "/#features", text: "Онцлог" },
  { href: "/courses", text: "Сургалт" },
  { href: "https://apply.mbg.mn", text: "Тэтгэлэгт" },
  { href: "https://medium.com/@mbgedumn", text: "MBG News" },
  // { href: "https://apply.mbg.mn", text: "MBG Apply" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex shadow-xl rounded-full bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 justify-center items-center">
              {/* <Globe className="w-5 h-5 text-white" /> */}
              <Image src="https://raw.githubusercontent.com/enkhbold470/mbg-landing/refs/heads/main/public/logo.png" alt="logo" width={40} height={40} />
            </div>
            <span className="text-xl font-semibold text-gray-900">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-8">
                {navigation.map((link, index) => (
                  <NavigationMenuLink key={index} asChild>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 hover:text-purple-600 transition-colors px-3 py-2 text-sm font-medium"
                    >
                      {link.text}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <Button asChild className="bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              <Link href="/#contact">
                Холбоо барих
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex shadow-xl rounded-full bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 justify-center items-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900">{siteConfig.name}</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors py-2 text-lg font-medium border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
                
                <div className="pt-4">
                  <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                    <Link
                      href="/#contact"
                      onClick={() => setIsOpen(false)}
                    >
                      Холбоо барих
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
