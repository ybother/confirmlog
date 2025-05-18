"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Copy, Key, Share2 } from "lucide-react"
import { encryptMessage } from "@/lib/crypto-client"
import { EncryptionIndicator } from "@/components/encryption-indicator"

interface SubmitFormProps {
  createSecureDropAction: (formData: FormData) => Promise<{
    success: boolean
    data?: any
    error?: string
  }>
}

export default function SubmitForm({ createSecureDropAction }: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [decryptionKey, setDecryptionKey] = useState("")
  const [expiresInDays, setExpiresInDays] = useState("7")
  const [keyError, setKeyError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    id?: number
    created_at?: string
    urlHash?: string
    secureUrl?: string
  } | null>(null)
  const { toast } = useToast()

  // Generate a random decryption key
  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let result = ""
    const length = 16 // Generate a longer key by default
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setDecryptionKey(result)
    setKeyError(null) // Clear any previous errors
  }

  // Copy text to clipboard
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description,
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

    // Only show validation error if the user has started typing
    if (newKey.length > 0) {
      validateDecryptionKey(newKey)
    } else {
      setKeyError(null)
    }
  }

  // Helper function to log FormData contents
  const logFormData = (formData: FormData) => {
    console.log("FormData contents:")
    for (const [key, value] of formData.entries()) {
      if (key === "encryptedText") {
        console.log(`- ${key}: [ENCRYPTED DATA] (${value.toString().length} characters)`)
      } else {
        console.log(`- ${key}: ${value}`)
      }
    }
  }

  // Create a wrapper around the server action to log the API call
  const loggedCreateSecureDropAction = async (formData: FormData) => {
    // Create a timestamp for the request
    const requestTime = new Date().toISOString()

    console.group(`API Call: createSecureDropAction (${requestTime})`)
    console.log("Request Method: POST (Server Action)")

    // Log the form data being sent
    logFormData(formData)

    try {
      console.log("\nSending request to server...")
      const startTime = performance.now()

      // Call the actual server action
      const response = await createSecureDropAction(formData)

      const endTime = performance.now()
      const responseTime = new Date().toISOString()

      console.log(`\nResponse received (${Math.round(endTime - startTime)}ms`)
      console.log("Response Time:", responseTime)
      console.log("Response Status: " + (response.success ? "Success" : "Error"))
      console.log("Response Data:", response)

      console.groupEnd()
      return response
    } catch (error) {
      console.error("\nAPI Call Error:", error)
      console.groupEnd()
      throw error
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message) return

    // Validate decryption key before submission
    if (!validateDecryptionKey(decryptionKey)) {
      return
    }

    setIsSubmitting(true)

    try {
      console.group("Secure Drop - Encryption Process")
      console.log("Starting client-side encryption...")
      console.log("Original message (never sent to server):", message)

      // Encrypt the message client-side
      const encryptionStart = performance.now()
      const encryptedText = await encryptMessage(message, decryptionKey)
      const encryptionEnd = performance.now()

      console.log(`Encryption completed in ${Math.round(encryptionEnd - encryptionStart)}ms`)
      console.log("Encrypted message (sent to server):", encryptedText)
      console.log("Message length - Original:", message.length, "characters")
      console.log("Message length - Encrypted:", encryptedText.length, "characters")
      console.log("Only the encrypted version is sent to the server. The server cannot decrypt this message.")
      console.groupEnd()

      // Create a FormData object to submit
      const formData = new FormData()
      formData.append("encryptedText", encryptedText)
      formData.append("expiresInDays", expiresInDays)

      // Submit the encrypted data to the server with logging
      const response = await loggedCreateSecureDropAction(formData)

      if (response.success) {
        setResult(response.data)

        toast({
          title: "Success!",
          description: "Your secure message has been stored",
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to store your message",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Encryption error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during encryption",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={result ? "bg-green-50" : ""}>
      <CardHeader>
        <CardTitle>{result ? "Drop Created" : "Create Secure Drop"}</CardTitle>
      </CardHeader>

      {!result ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message. It will be encrypted and then stored securely."
                required
                className="min-h-[100px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="decryptionKey">Decryption Key</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  id="decryptionKey"
                  type="text"
                  placeholder="Enter or generate a decryption key"
                  required
                  value={decryptionKey}
                  onChange={handleKeyChange}
                  className={`flex-grow ${keyError ? "border-red-500" : ""}`}
                />
                {decryptionKey ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(decryptionKey, "Decryption key copied to clipboard")}
                    className="flex-shrink-0"
                    title="Copy key"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateRandomKey}
                    className="flex-shrink-0"
                    title="Generate random key"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {keyError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {keyError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !!keyError}>
              {isSubmitting ? "Encrypting & Creating..." : "Create Secure Drop"}
            </Button>

            <EncryptionIndicator />
          </CardContent>
        </form>
      ) : (
        <CardContent className="pt-0">
          <div>
            <p className="text-sm text-gray-600 mb-4">Created: {new Date(result.created_at!).toLocaleString()}</p>

            <div>
              <div className="bg-white p-4 rounded-md border border-green-200">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <Share2 className="h-4 w-4" />
                  Share with Recipient
                </h4>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">1. Send this secure link:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-grow overflow-x-auto">
                        {result.secureUrl}
                      </code>
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.secureUrl!, "Secure link copied to clipboard")}
                          className="flex-shrink-0 h-8"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.secureUrl!, "_blank")}
                          className="flex-shrink-0 h-8"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">2. Share this decryption key separately:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-grow overflow-x-auto">
                        {decryptionKey}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(decryptionKey, "Decryption key copied to clipboard")}
                        className="flex-shrink-0 h-8"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-amber-600 flex items-start gap-2 bg-amber-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    For security, send the link and decryption key through different channels. For example, send the
                    link via email and the key via text message.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              setResult(null)
              setMessage("")
              setDecryptionKey("")
              // Ensure we're on the home page
              if (window.location.pathname !== "/") {
                window.location.href = "/"
              }
            }}
          >
            Create Another Secure Drop
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
