import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  try {
    const urlHash = params.hash
    console.log(`Verifying if message with hash ${urlHash} has been cleared`)

    if (!urlHash || urlHash.length !== 32) {
      return NextResponse.json({ success: false, error: "Invalid hash format" }, { status: 400 })
    }

    // Check if the message exists and if it has been cleared
    const result = await sql`
      SELECT id, encrypted_text, decrypted_at 
      FROM secure_drops 
      WHERE url_hash = ${urlHash}
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Secure drop not found" }, { status: 404 })
    }

    const isCleared = !result[0].encrypted_text || result[0].encrypted_text.trim() === ""

    return NextResponse.json({
      success: true,
      isCleared,
      decryptedAt: result[0].decrypted_at,
    })
  } catch (error) {
    console.error("Error verifying secure drop:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
