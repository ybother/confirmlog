import { sql } from "./db"

/**
 * Finds and cleans up expired messages
 * @returns Object with count of cleaned messages and their IDs
 */
export async function cleanupExpiredMessages() {
  try {
    console.log("Starting cleanup of expired messages")

    // Find all expired messages that still have content
    const expiredMessages = await sql`
      SELECT id, url_hash as "urlHash" 
      FROM secure_drops 
      WHERE 
        expires_at < NOW() 
        AND (encrypted_text IS NOT NULL AND encrypted_text != '')
    `

    console.log(`Found ${expiredMessages.length} expired messages that need cleanup`)

    if (expiredMessages.length === 0) {
      return {
        success: true,
        count: 0,
        message: "No expired messages found that need cleanup",
      }
    }

    // Clear the encrypted content from all expired messages
    const result = await sql`
      UPDATE secure_drops 
      SET 
        encrypted_text = '',
        decrypted_at = NOW()
      WHERE 
        expires_at < NOW() 
        AND (encrypted_text IS NOT NULL AND encrypted_text != '')
      RETURNING id
    `

    console.log(`Successfully cleaned up ${result.length} expired messages`)

    return {
      success: true,
      count: result.length,
      clearedIds: result.map((row) => row.id),
      message: `Successfully cleaned up ${result.length} expired messages`,
    }
  } catch (error) {
    console.error("Error cleaning up expired messages:", error)
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets statistics about expired messages
 */
export async function getCleanupStats() {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE expires_at < NOW() AND (encrypted_text IS NOT NULL AND encrypted_text != '')) as pending_cleanup,
        COUNT(*) FILTER (WHERE expires_at < NOW() AND (encrypted_text IS NULL OR encrypted_text = '')) as already_cleaned,
        COUNT(*) FILTER (WHERE expires_at >= NOW()) as active,
        COUNT(*) as total
      FROM secure_drops
    `

    return {
      success: true,
      stats: stats[0],
    }
  } catch (error) {
    console.error("Error getting cleanup stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
