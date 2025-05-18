import { NextResponse } from "next/server"
import { recordDecryption } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { hash: string } }) {
  try {
    const urlHash = params.hash
    console.log(`Recording decryption for message with hash: ${urlHash}`)

    if (!urlHash || urlHash.length !== 32) {
      console.error(`Invalid hash format: ${urlHash}`)
      return NextResponse.json({ success: false, error: "Invalid hash format" }, { status: 400 })
    }

    // Get geolocation data from the request body
    const body = await request.json().catch(() => ({}))
    const geoData = body.geoData || undefined

    const result = await recordDecryption(urlHash, geoData)

    if (!result.success) {
      console.error(`Failed to record decryption: ${result.error}`)
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    console.log(`Successfully recorded decryption for hash: ${urlHash}, at: ${result.data.decrypted_at}`)

    return NextResponse.json({
      success: true,
      message: "Decryption recorded successfully",
      decryptedAt: result.data.decrypted_at,
    })
  } catch (error) {
    console.error("Error recording decryption:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
