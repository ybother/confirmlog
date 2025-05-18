"use server"

import { z } from "zod"
import { createSecureDrop } from "@/lib/db"
import { generateSecureHash } from "@/lib/hash-utils"
import { headers } from "next/headers"

// Define validation schema
const SecureDropSchema = z.object({
  encryptedText: z.string().min(1, "Encrypted text is required"),
  expiresInDays: z.number().int().positive().default(7),
})

export async function createSecureDropAction(formData: FormData) {
  try {
    // Extract and validate form data
    const rawData = {
      encryptedText: formData.get("encryptedText") as string,
      expiresInDays: Number.parseInt((formData.get("expiresInDays") as string) || "7"),
    }

    // Validate the data
    const validatedData = SecureDropSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors.map((e) => e.message).join(", "),
      }
    }

    // Generate a secure hash for the URL
    const { encryptedText, expiresInDays } = validatedData.data
    const timestamp = new Date()
    const urlHash = generateSecureHash(encryptedText, timestamp)

    // Store in database with the hash
    const result = await createSecureDrop(encryptedText, urlHash, expiresInDays)

    if (!result.success) {
      return result
    }

    // Get the base URL for the application
    // In development, we'll use a hardcoded localhost URL
    const headersList = headers()
    const host = headersList.get("host") || "localhost:3000"
    // Use https if we're on Vercel or if the x-forwarded-proto header is set to https
    const protocol = process.env.VERCEL || headersList.get("x-forwarded-proto") === "https" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`

    console.log(`Generated base URL: ${baseUrl} (NODE_ENV: ${process.env.NODE_ENV})`)

    // Return success with the URL hash
    return {
      success: true,
      data: {
        ...result.data,
        urlHash,
        secureUrl: `${baseUrl}/secure/${urlHash}`,
      },
    }
  } catch (error) {
    console.error("Error in createSecureDropAction:", error)
    return {
      success: false,
      error: "An unexpected error occurred while processing your request",
    }
  }
}
