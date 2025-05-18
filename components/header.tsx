"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LockKeyhole } from "lucide-react"

export function Header() {
  const router = useRouter()

  const handleCreateClick = () => {
    // Navigate to home page
    router.push("/")
  }

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LockKeyhole className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold">ConfirmLog</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/how-it-works">How It Works</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/use-cases">Use Cases</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCreateClick}>
            Create
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="https://github.com/ybother/confirmlog" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
