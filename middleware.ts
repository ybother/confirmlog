import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add the IP address if it's not already set
  if (!requestHeaders.has("x-real-ip") && request.ip) {
    requestHeaders.set("x-real-ip", request.ip)
  }

  // Add geolocation data if available from Vercel
  if (request.geo) {
    if (request.geo.city) {
      // Decode the city name to handle URL encoding
      const decodedCity = decodeURIComponent(request.geo.city)
      requestHeaders.set("x-vercel-ip-city", decodedCity)
    }
    if (request.geo.country) {
      // Decode the country name to handle URL encoding
      const decodedCountry = decodeURIComponent(request.geo.country)
      requestHeaders.set("x-vercel-ip-country", decodedCountry)
    }
  }

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/secure/:path*"],
}
