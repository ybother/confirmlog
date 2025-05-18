import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { ClientFooter } from "@/components/client-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConfirmLog - Secure Message Sharing",
  description: "Share encrypted messages securely with automatic deletion after viewing",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <ClientFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
