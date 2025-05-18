import { neon } from "@neondatabase/serverless"

// Create a SQL client with the database URL
export const sql = neon(process.env.DATABASE_URL!)

// Update the SecureDrop interface to use camelCase consistently
export interface SecureDrop {
  id: number
  encrypted_text: string
  created_at: Date
  accessed: boolean
  access_count: number
  expires_at: Date | null
  urlHash: string // Changed from url_hash to urlHash
  decrypted_at: Date | null
  access_ip?: string | null
  access_city?: string | null
  access_country?: string | null
}

// Helper function to create a new secure drop with hash
export async function createSecureDrop(encrypted_text: string, urlHash: string, expires_in_days = 7) {
  try {
    const result = await sql`
      INSERT INTO secure_drops (
        encrypted_text, 
        url_hash,
        expires_at
      ) 
      VALUES (
        ${encrypted_text}, 
        ${urlHash},
        NOW() + (${expires_in_days} || ' days')::INTERVAL
      )
      RETURNING id, created_at, expires_at, url_hash as "urlHash"
    `

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error creating secure drop:", error)
    return { success: false, error: "Failed to create secure drop" }
  }
}

// Helper function to record when a message was decrypted
export async function recordDecryption(urlHash: string, geoData?: { ip?: string; city?: string; country?: string }) {
  try {
    let result

    if (geoData) {
      result = await sql`
        UPDATE secure_drops 
        SET decrypted_at = NOW(),
            access_ip = ${geoData.ip || null},
            access_city = ${geoData.city || null},
            access_country = ${geoData.country || null}
        WHERE url_hash = ${urlHash}
        RETURNING id, decrypted_at, access_ip, access_city, access_country
      `
    } else {
      result = await sql`
        UPDATE secure_drops 
        SET decrypted_at = NOW() 
        WHERE url_hash = ${urlHash}
        RETURNING id, decrypted_at
      `
    }

    if (result.length === 0) {
      return { success: false, error: "Secure drop not found" }
    }

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error recording decryption:", error)
    return { success: false, error: "Failed to record decryption" }
  }
}

// Helper function to clear a message after it's been viewed
export async function clearSecureDrop(urlHash: string) {
  try {
    const result = await sql`
      UPDATE secure_drops 
      SET encrypted_text = ''
      WHERE url_hash = ${urlHash}
      RETURNING id, decrypted_at
    `

    if (result.length === 0) {
      return { success: false, error: "Secure drop not found" }
    }

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error clearing secure drop:", error)
    return { success: false, error: "Failed to clear secure drop" }
  }
}

// Update the getSecureDropByHash function to delete encrypted content when expired
export async function getSecureDropByHash(urlHash: string, geoData?: { ip?: string; city?: string; country?: string }) {
  try {
    // First, check if the record exists and get its data
    const result = await sql`
      SELECT 
        id, 
        encrypted_text, 
        created_at, 
        accessed, 
        access_count, 
        expires_at, 
        url_hash as "urlHash", 
        decrypted_at, 
        access_ip, 
        access_city, 
        access_country
      FROM secure_drops 
      WHERE url_hash = ${urlHash}
    `

    if (result.length === 0) {
      return { success: false, error: "Secure drop not found" }
    }

    // Check if the drop has expired
    if (result[0].expires_at && new Date(result[0].expires_at) < new Date()) {
      // If expired, clear the encrypted text to save space and for security
      console.log(`Message with hash ${urlHash} has expired. Clearing encrypted content.`)

      await sql`
        UPDATE secure_drops 
        SET encrypted_text = '',
            accessed = true,
            access_count = access_count + 1
        WHERE url_hash = ${urlHash}
      `

      return { success: false, error: "Secure drop has expired" }
    }

    // Check if the encrypted text is empty (already viewed)
    if (!result[0].encrypted_text || result[0].encrypted_text.trim() === "") {
      return { success: false, error: "Secure drop has already been viewed" }
    }

    // Update access count only, without storing geolocation data
    await sql`
      UPDATE secure_drops 
      SET accessed = true, 
          access_count = access_count + 1
      WHERE url_hash = ${urlHash}
    `

    // Get the updated record
    const updatedResult = await sql`
      SELECT 
        id, 
        encrypted_text, 
        created_at, 
        accessed, 
        access_count, 
        expires_at, 
        url_hash as "urlHash", 
        decrypted_at, 
        access_ip, 
        access_city, 
        access_country
      FROM secure_drops 
      WHERE url_hash = ${urlHash}
    `

    return { success: true, data: updatedResult[0] as SecureDrop }
  } catch (error) {
    console.error("Error retrieving secure drop:", error)
    return { success: false, error: "Failed to retrieve secure drop" }
  }
}
