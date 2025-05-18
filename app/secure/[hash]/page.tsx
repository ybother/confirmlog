import { getSecureDropByHash } from "@/lib/db"
import { notFound } from "next/navigation"
import DecryptForm from "@/components/decrypt-form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, Clock, Globe, LockOpen, Plus } from "lucide-react"
import { sql } from "@/lib/db"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SecureMessagePage({ params }: { params: { hash: string } }) {
  const urlHash = params.hash

  if (!urlHash || urlHash.length !== 32) {
    notFound()
  }

  // Get IP and geolocation data from headers
  const headersList = headers()
  const ip = headersList.get("x-real-ip") || headersList.get("x-forwarded-for") || "Unknown"

  // Get geolocation data from Vercel's geo object in the headers
  const geoCity = headersList.get("x-vercel-ip-city") || undefined
  const geoCountry = headersList.get("x-vercel-ip-country") || undefined

  const geoData = {
    ip,
    city: geoCity,
    country: geoCountry,
  }

  const result = await getSecureDropByHash(urlHash, geoData)

  // If not successful, check if it's because it's expired/viewed or not found
  if (!result.success) {
    // Try to get the record anyway to check if it exists but is expired/viewed
    const checkRecord = await sql`
      SELECT id, created_at, expires_at, access_count, encrypted_text, decrypted_at,
             access_ip, access_city, access_country
      FROM secure_drops 
      WHERE url_hash = ${urlHash}
    `

    if (checkRecord.length > 0) {
      const record = checkRecord[0]
      const isExpired = record.expires_at && new Date(record.expires_at) < new Date()
      const isViewed = !record.encrypted_text || record.encrypted_text.trim() === ""

      // Format date in a prettier way
      const formatDate = (date: string | Date | null) => {
        if (!date) return null

        const d = new Date(date)

        // Format: "May 17, 2023 at 2:30 PM"
        return (
          d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }) +
          " at " +
          d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        )
      }

      // Format location information
      const formatLocation = () => {
        if (!record.access_ip && !record.access_city && !record.access_country) {
          return "Location information not available"
        }

        const parts = []

        // Ensure city and country are properly decoded
        const city = record.access_city ? decodeURIComponent(record.access_city) : null
        const country = record.access_country ? decodeURIComponent(record.access_country) : null

        if (city) parts.push(city)
        if (country) parts.push(country)

        const locationStr = parts.length > 0 ? parts.join(", ") : "Unknown location"
        return `${record.access_ip || "Unknown IP"} (${locationStr})`
      }

      return (
        <div className="container flex flex-col items-center justify-center p-4 py-12 md:py-24">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Message Unavailable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-amber-50 rounded-md text-amber-800">
                  <p className="font-medium">
                    {isExpired
                      ? "This secure message has expired."
                      : isViewed
                        ? "This secure message has already been viewed."
                        : "This secure message is no longer available."}
                  </p>
                  <p className="text-sm mt-2">
                    Secure messages can only be viewed once and have a limited lifetime for security reasons.
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm border-t pt-4">
                  <h4 className="font-medium text-gray-700">Message Timeline</h4>

                  {/* Created timestamp */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Created: </span>
                    <span className="font-medium">{formatDate(record.created_at)}</span>
                  </div>

                  {/* Decrypted timestamp (if available) */}
                  {record.decrypted_at && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <LockOpen className="h-4 w-4 text-gray-400" />
                      <span>Decrypted: </span>
                      <span className="font-medium">{formatDate(record.decrypted_at)}</span>
                    </div>
                  )}

                  {/* Expiry timestamp (if available) */}
                  {record.expires_at && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Expires: </span>
                      <span className="font-medium">{formatDate(record.expires_at)}</span>
                    </div>
                  )}

                  {/* Access location (if available) */}
                  {record.access_ip && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>Accessed from: </span>
                      <span className="font-medium">{formatLocation()}</span>
                    </div>
                  )}

                  {/* Access count */}
                  <div className="mt-2 text-gray-600">
                    <p>Total access attempts: {record.access_count || 0}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Secure Drop
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )
    }

    notFound()
  }

  const secureDrop = result.data

  return (
    <div className="container flex flex-col items-center justify-center p-4 py-12 md:py-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Secure Message</h1>
        <p className="mb-8 text-center text-gray-600">Enter the decryption key to view this message</p>

        <DecryptForm
          encryptedText={secureDrop.encrypted_text}
          createdAt={secureDrop.created_at}
          expiresAt={secureDrop.expires_at}
          accessCount={secureDrop.access_count}
          urlHash={urlHash}
          accessIp={ip}
          accessCity={geoCity}
          accessCountry={geoCountry}
        />
      </div>
    </div>
  )
}
