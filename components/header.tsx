"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCreateClick = () => {
    // Navigate to home page
    router.push("/")
    setMobileMenuOpen(false)
  }

  return (
    <header className="border-b bg-black">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="ConfirmLog" className="h-8 w-8" />
          <span className="text-xl font-bold text-white">ConfirmLog</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-gray-800">
            <Link href="/how-it-works">How It Works</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-gray-800">
            <Link href="/use-cases">Use Cases</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateClick}
            className="text-white hover:text-gray-300 hover:bg-gray-800"
          >
            Create
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <Link href="https://github.com/ybother/confirmlog" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
        </nav>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-black">
          <div className="flex flex-col p-4 space-y-3">
            <Button
              asChild
              variant="ghost"
              className="justify-start text-white hover:text-gray-300 hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start text-white hover:text-gray-300 hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/use-cases">Use Cases</Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-white hover:text-gray-300 hover:bg-gray-800"
              onClick={handleCreateClick}
            >
              Create
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start text-white border-white hover:bg-white hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="https://github.com/ybother/confirmlog" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
