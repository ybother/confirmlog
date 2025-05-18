import crypto from "crypto"

/**
 * Generates a secure hash based on message content and timestamp
 */
export function generateSecureHash(encryptedText: string, timestamp: Date = new Date()): string {
  // Create a string combining the elements
  const dataToHash = `${encryptedText}|${timestamp.toISOString()}|${crypto.randomBytes(16).toString("hex")}`

  // Create a SHA-256 hash
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex")

  // Return a shorter version of the hash (first 32 characters)
  return hash.substring(0, 32)
}
