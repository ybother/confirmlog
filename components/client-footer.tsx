"use client"

import Link from "next/link"
import { LockKeyhole, Code, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export function ClientFooter() {
  // Get the Vercel deployment commit hash from environment variables
  const commitHash = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development"

  // Get the Git commit timestamp
  const commitTimestamp = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_TIMESTAMP || ""

  // State for formatted date
  const [formattedDate, setFormattedDate] = useState<string>("development")

  // Format the commit hash to show only the first 7 characters (standard short hash format)
  const shortCommitHash = commitHash === "development" ? "development" : commitHash.substring(0, 7)

  // Format the deployment date
  useEffect(() => {
    if (commitTimestamp && commitTimestamp !== "development") {
      try {
        // Convert ISO timestamp to Date object
        const date = new Date(commitTimestamp)

        // Format the date: "May 18, 2023 at 10:30 AM"
        const formatted = date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })

        setFormattedDate(formatted)
      } catch (error) {
        console.error("Error formatting deployment date:", error)
        setFormattedDate("unknown")
      }
    }
  }, [commitTimestamp])

  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-bold">ConfirmLog</span>
            </div>
            <p className="text-sm text-gray-500">
              Secure, end-to-end encrypted message sharing with access logs and automatic deletion after viewing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-gray-900">
                    New Message
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-500 hover:text-gray-900">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases" className="text-gray-500 hover:text-gray-900">
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-500 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://github.com/ybother/confirmlog"
                    className="text-gray-500 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ConfirmLog. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span>Commit:</span>
              <Link
                href={`https://github.com/ybother/confirmlog/commit/${commitHash}`}
                className="font-mono hover:text-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortCommitHash}
              </Link>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Deployed:</span>
              <span className="font-mono">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
