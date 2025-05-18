"use client"

// This file contains client-side encryption/decryption utilities
// We're using the Web Crypto API which is available in all modern browsers

/**
 * Derives a key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, ["deriveKey"])

  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

/**
 * Encrypts a message using AES-GCM
 */
export async function encryptMessage(message: string, password: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)

    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16))

    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    // Derive the key from the password
    const key = await deriveKey(password, salt)

    // Encrypt the message
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data,
    )

    // Convert the encrypted data to base64
    const encryptedBase64 = arrayBufferToBase64(ciphertext)
    const ivBase64 = arrayBufferToBase64(iv)
    const saltBase64 = arrayBufferToBase64(salt)

    // Return the encrypted data in format: base64(iv):base64(salt):base64(ciphertext)
    return `${ivBase64}:${saltBase64}:${encryptedBase64}`
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt message")
  }
}

/**
 * Decrypts a message using AES-GCM
 */
export async function decryptMessage(encryptedData: string, password: string): Promise<string> {
  try {
    // The encrypted data is in format: base64(iv):base64(salt):base64(ciphertext)
    const parts = encryptedData.split(":")
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format")
    }

    const iv = base64ToArrayBuffer(parts[0])
    const salt = base64ToArrayBuffer(parts[1])
    const ciphertext = base64ToArrayBuffer(parts[2])

    // Derive the key from the password
    const key = await deriveKey(password, salt)

    // Decrypt the message
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext,
    )

    // Convert the decrypted buffer to a string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt message. Please check your decryption key and try again.")
  }
}

// Helper function to convert ArrayBuffer to base64 string for storage and transmission
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

// Helper function to convert base64 string back to ArrayBuffer for decryption
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

// Helper function to validate if a string is in the expected encrypted format (base64 parts)
export function isValidEncryptedFormat(str: string): boolean {
  try {
    const parts = str.split(":")
    if (parts.length !== 3) return false

    // Check if each part is valid base64
    for (const part of parts) {
      if (!/^[A-Za-z0-9+/=]+$/.test(part)) return false
    }

    return true
  } catch {
    return false
  }
}
