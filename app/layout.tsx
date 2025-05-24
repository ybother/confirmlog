import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GoogleAnalytics } from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Secure One-Time Secret Sharing with Access Logs – ConfirmLog",
  description:
    "Send secrets that self-destruct after viewing. End-to-end encrypted in the browser with IP and timestamp logging. Know exactly when and where your secret was seen.",
  generator: "v0.dev",
  keywords: [
    "secure messaging",
    "one-time secrets",
    "end-to-end encryption",
    "self-destructing messages",
    "access logs",
    "IP logging",
    "secure sharing",
    "encrypted messages",
    "burn after reading",
    "secret sharing",
  ],
  authors: [{ name: "ConfirmLog" }],
  creator: "ConfirmLog",
  publisher: "ConfirmLog",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Secure One-Time Secret Sharing with Access Logs – ConfirmLog",
    description:
      "Send secrets that self-destruct after viewing. End-to-end encrypted in the browser with IP and timestamp logging. Know exactly when and where your secret was seen.",
    siteName: "ConfirmLog",
    images: [
      {
        url: "/images/og-image.png",
        width: 1024,
        height: 1024,
        alt: "ConfirmLog - Secure One-Time Secret Sharing",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure One-Time Secret Sharing with Access Logs – ConfirmLog",
    description:
      "Send secrets that self-destruct after viewing. End-to-end encrypted in the browser with IP and timestamp logging. Know exactly when and where your secret was seen.",
    images: ["/images/og-image.png"],
    creator: "@confirmlog",
    site: "@confirmlog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ConfirmLog" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ConfirmLog",
              description:
                "Send secrets that self-destruct after viewing. End-to-end encrypted in the browser with IP and timestamp logging. Know exactly when and where your secret was seen.",
              url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "ConfirmLog",
              },
              featureList: [
                "End-to-end encryption",
                "Self-destructing messages",
                "Access logging with IP and timestamp",
                "One-time secret sharing",
                "No registration required",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Suspense fallback={<div>Loading...</div>}>
          <GoogleAnalytics />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Header />
            <main className="flex-1 security-wallpaper">{children}</main>
            <Footer />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
