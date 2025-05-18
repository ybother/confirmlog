import { NextResponse } from "next/server"
import { clearSecureDrop } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { hash: string } }) {
  try {
    const urlHash = params.hash
    console.log(`Received request to clear message with hash: ${urlHash}`)

    if (!urlHash || urlHash.length !== 32) {
      console.error(`Invalid hash format: ${urlHash}`)
      return NextResponse.json({ success: false, error: "Invalid hash format" }, { status: 400 })
    }

    // Clear the encrypted text
    const result = await clearSecureDrop(urlHash)

    if (!result.success) {
      console.error(`Failed to clear message: ${result.error}`)
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    console.log(`Successfully cleared message with hash: ${urlHash}`)

    return NextResponse.json({
      success: true,
      message: "Secure drop content cleared successfully",
      decryptedAt: result.data.decrypted_at,
    })
  } catch (error) {
    console.error("Error clearing secure drop:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
