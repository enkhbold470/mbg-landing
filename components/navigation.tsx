"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle, GraduationCap, Home, FileText, Building2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/scholarships",
      label: "Scholarships",
      icon: GraduationCap,
      active: pathname === "/scholarships" || pathname.startsWith("/scholarships"),
    },
    {
      href: "/universities",
      label: "Universities",
      icon: Building2,
      active: pathname === "/universities" || pathname.startsWith("/universities"),
    },
    {
      href: "/applications",
      label: "My Apps",
      icon: FileText,
      active: pathname === "/applications" || pathname.startsWith("/applications"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle,
      active: pathname === "/profile",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-2 md:hidden">
      <div className="flex justify-around items-center">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0",
              route.active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs mt-1 truncate">{route.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
