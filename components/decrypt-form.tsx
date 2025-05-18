"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { decryptMessage, isValidEncryptedFormat } from "@/lib/crypto-client"
import { AlertCircle, Calendar, Clock, Copy, Eye, Globe, Lock, LockOpen, Shield, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DecryptFormProps {
  encryptedText: string
  createdAt: string | Date
  expiresAt: string | Date | null
  accessCount: number
  urlHash?: string
  accessIp?: string | null
  accessCity?: string | null
  accessCountry?: string | null
}

export default function DecryptForm({
  encryptedText,
  createdAt,
  expiresAt,
  accessCount,
  urlHash,
  accessIp,
  accessCity,
  accessCountry,
}: DecryptFormProps) {
  const [decryptionKey, setDecryptionKey] = useState("")
  const [keyError, setKeyError] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCleared, setIsCleared] = useState(false)
  const [decryptedAt, setDecryptedAt] = useState<string | null>(null)
  const { toast } = useToast()

  // Validate if the encrypted text is in the correct format
  const isValidFormat = isValidEncryptedFormat(encryptedText)

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  // Validate decryption key
  const validateDecryptionKey = (key: string): boolean => {
    if (key.length < 8) {
      setKeyError("Decryption key must be at least 8 characters long")
      return false
    }
    setKeyError(null)
    return true
  }

  // Handle decryption key change
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value
    setDecryptionKey(newKey)

    // Only show validation error if the user has started typing and entered at least a few characters
    if (newKey.length > 0 && newKey.length < 8) {
      validateDecryptionKey(newKey)
    } else {
      setKeyError(null)
    }
  }

  // Format date in a prettier way with error handling
  const formatDate = (date: string | Date | null) => {
    if (!date) return null

    try {
      const d = new Date(date)

      // Check if date is valid
      if (isNaN(d.getTime())) {
        return "Invalid date"
      }

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
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date error"
    }
  }

  // Format location information
  const formatLocation = () => {
    if (!accessIp && !accessCity && !accessCountry) {
      return "Location information not available"
    }

    const parts = []

    // Ensure city and country are properly decoded
    const city = accessCity ? decodeURIComponent(accessCity) : null
    const country = accessCountry ? decodeURIComponent(accessCountry) : null

    if (city) parts.push(city)
    if (country) parts.push(country)

    const locationStr = parts.length > 0 ? parts.join(", ") : "Unknown location"
    return `${accessIp || "Unknown IP"} (${locationStr})`
  }

  async function handleDecrypt() {
    if (!decryptionKey.trim()) return

    // Validate decryption key before attempting decryption
    if (!validateDecryptionKey(decryptionKey)) {
      return
    }

    setIsDecrypting(true)
    setError(null)

    try {
      // Decrypt the message
      const decrypted = await decryptMessage(encryptedText, decryptionKey)
      setDecryptedContent(decrypted)

      // Record the decryption time
      if (urlHash) {
        await recordDecryption()
      }

      // After successful decryption, clear the message content from the server
      if (urlHash) {
        await clearMessageContent()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decrypt message")
    } finally {
      setIsDecrypting(false)
    }
  }

  async function recordDecryption() {
    if (!urlHash) return

    try {
      console.log(`Recording decryption for message with hash: ${urlHash}`)

      // Get geolocation data from the browser
      const geoData = {
        ip: accessIp,
        city: accessCity,
        country: accessCountry,
      }

      const response = await fetch(`/api/secure-drop/record-decryption/${urlHash}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ geoData }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setDecryptedAt(data.decryptedAt)
        console.log(`Decryption recorded successfully at: ${data.decryptedAt}`)
      } else {
        console.error("Failed to record decryption:", data.error)
      }
    } catch (error) {
      console.error("Error recording decryption:", error)
    }
  }

  async function clearMessageContent() {
    if (isCleared || !urlHash) return

    setIsClearing(true)
    try {
      console.log(`Attempting to clear message with hash: ${urlHash}`)
      const response = await fetch(`/api/secure-drop/clear/${urlHash}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setIsCleared(true)
        if (data.decryptedAt && !decryptedAt) {
          setDecryptedAt(data.decryptedAt)
        }
        toast({
          title: "Message secured",
          description: "This message has been cleared from the server and can no longer be accessed.",
        })
        console.log(`Message cleared successfully.`)

        // Verify the message was actually cleared
        verifyMessageCleared()
      } else {
        console.error("Failed to clear message:", data.error)
        toast({
          title: "Warning",
          description: "Failed to clear message from server. The content may still be accessible.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error clearing message:", error)
      toast({
        title: "Warning",
        description: "An error occurred while clearing the message.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  async function verifyMessageCleared() {
    if (!urlHash || !isCleared) return

    try {
      // Wait a moment to ensure the database has been updated
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch(`/api/secure-drop/verify-cleared/${urlHash}`)
      const data = await response.json()

      if (data.success && !data.isCleared) {
        console.warn("Message verification failed: Message was not properly cleared")
        toast({
          title: "Warning",
          description: "The message may not have been properly cleared from the server.",
          variant: "destructive",
        })
        setIsCleared(false)
      } else if (data.success) {
        console.log("Message verification successful: Message was properly cleared")
      }
    } catch (error) {
      console.error("Error verifying message cleared status:", error)
    }
  }

  // Format the access count message
  const getAccessMessage = () => {
    // Current view is already counted in the accessCount
    const previousViews = Math.max(0, accessCount - 1)

    if (previousViews === 0) {
      return "This is the first time this message has been accessed."
    } else if (previousViews === 1) {
      return "This message has been accessed 1 time before."
    } else {
      return `This message has been accessed ${previousViews} times before.`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Encrypted Message
        </CardTitle>
        <CardDescription>Enter the decryption key to view this message</CardDescription>
      </CardHeader>

      <CardContent>
        {!isValidFormat && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-800 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Invalid message format</p>
              <p className="text-sm">This message doesn't appear to be in the correct encrypted format.</p>
            </div>
          </div>
        )}

        {!decryptedContent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decryptionKey">Decryption Key</Label>
              <Input
                id="decryptionKey"
                type="password"
                placeholder="Enter the decryption key"
                value={decryptionKey}
                onChange={handleKeyChange}
                disabled={isDecrypting || !isValidFormat}
                className={keyError ? "border-red-500" : ""}
              />
              {keyError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {keyError}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Display timestamps even before decryption */}
            <div className="mt-4 space-y-2 text-sm border-t pt-4">
              <h4 className="font-medium text-gray-700">Message Timeline</h4>

              {/* Created timestamp */}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Created: </span>
                <span className="font-medium">{formatDate(createdAt)}</span>
              </div>

              {/* Decrypted timestamp (if available) */}
              {decryptedAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <LockOpen className="h-4 w-4 text-gray-400" />
                  <span>Decrypted: </span>
                  <span className="font-medium">{formatDate(decryptedAt)}</span>
                </div>
              )}

              {/* Expiry timestamp (if available) */}
              {expiresAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Expires: </span>
                  <span className="font-medium">{formatDate(expiresAt)}</span>
                </div>
              )}

              {/* Access location (if available) */}
              {accessIp && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span>Accessed from: </span>
                  <span className="font-medium">{formatLocation()}</span>
                </div>
              )}

              {/* Access count */}
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-4 w-4 text-gray-400" />
                <span>Access attempts: </span>
                <span className="font-medium">{accessCount}</span>
                <span className="text-xs text-amber-600 ml-1">({getAccessMessage()})</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <LockOpen className="h-5 w-5" />
              <span className="font-medium">Message decrypted successfully</span>
            </div>

            <div className="relative p-4 bg-white border rounded-md whitespace-pre-wrap">
              <div className="pr-10 break-words">{decryptedContent}</div>
              <Button
                onClick={() => copyToClipboard(decryptedContent)}
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Display timestamps after decryption */}
            <div className="mt-4 space-y-2 text-sm border-t pt-4">
              <h4 className="font-medium text-gray-700">Message Timeline</h4>

              {/* Created timestamp */}
              <div className="flex flex-wrap items-center gap-x-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Created: </span>
                <span className="font-medium">{formatDate(createdAt)}</span>
              </div>

              {/* Decrypted timestamp (if available) */}
              {decryptedAt && (
                <div className="flex flex-wrap items-center gap-x-2 mb-1">
                  <LockOpen className="h-4 w-4 text-gray-400" />
                  <span>Decrypted: </span>
                  <span className="font-medium">{formatDate(decryptedAt)}</span>
                </div>
              )}

              {/* Expiry timestamp (if available) */}
              {expiresAt && (
                <div className="flex flex-wrap items-center gap-x-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Expires: </span>
                  <span className="font-medium">{formatDate(expiresAt)}</span>
                </div>
              )}

              {/* Access location (if available) */}
              {accessIp && (
                <div className="flex flex-wrap items-start gap-x-2">
                  <Globe className="h-4 w-4 text-gray-400 mt-1" />
                  <span className="mt-0.5">Accessed from: </span>
                  <span className="font-medium">{formatLocation()}</span>
                </div>
              )}

              {/* Access count */}
              <div className="flex flex-wrap items-center gap-x-2 mb-1">
                <Eye className="h-4 w-4 text-gray-400" />
                <span>Access attempts: </span>
                <span className="font-medium">{accessCount}</span>
                <span className="text-xs text-amber-600 ml-1">({getAccessMessage()})</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>This message was decrypted in your browser. The key was never sent to our servers.</span>
              </div>

              {urlHash &&
                (isCleared ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Trash2 className="h-4 w-4" />
                      <span>
                        This message has been cleared from the server and can no longer be accessed by anyone else.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Clearing message from server{isClearing ? "..." : "."}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>

      {!decryptedContent && (
        <CardFooter>
          <Button
            onClick={handleDecrypt}
            disabled={!decryptionKey.trim() || isDecrypting || !isValidFormat || !!keyError}
            className="w-full"
          >
            {isDecrypting ? "Decrypting..." : "Decrypt Message"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
