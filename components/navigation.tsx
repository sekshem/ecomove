"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Leaf, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    { name: "Home", path: "/home" },
    { name: "Compare Routes", path: "/route-comparison" },
    { name: "Join a Carpool", path: "/carpool" },
    { name: "Leave a Review", path: "/review" },
    { name: "Profile", path: "/profile" },
  ]

  return (
    <header className="bg-white border-b border-green-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="flex items-center space-x-2">
            <div className="bg-green-600 text-white p-1.5 rounded-full">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold text-green-800 text-xl">ECOMOVE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === route.path
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:text-green-800 hover:bg-green-50"
                }`}
              >
                {route.name}
              </Link>
            ))}

            <Button asChild variant="outline" className="border-green-300 text-green-800">
              <Link href="/">Logout</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-800 hover:bg-green-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    pathname === route.path
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:text-green-800 hover:bg-green-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}

              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:text-green-800 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
