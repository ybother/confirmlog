"use client"

import { Shield, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function EncryptionIndicator() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
      <div className="flex items-start gap-2">
        <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">End-to-end encryption</p>
          <p className="text-sm">
            Your message is encrypted in your browser before being sent to our servers. Only someone with the decryption
            key can read it.
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-blue-600 mt-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide technical details" : "Show technical details"}
          </Button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 text-xs border-t border-blue-200 pt-3">
          <p className="font-medium mb-1">How it works:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Your message is encrypted in your browser using AES-256-GCM encryption</li>
            <li>A unique salt and initialization vector are generated for each message</li>
            <li>Your decryption key is used with PBKDF2 to derive a secure encryption key</li>
            <li>Only the encrypted message is sent to our servers, never the original text or key</li>
            <li>When the recipient enters the key, decryption happens in their browser</li>
          </ol>
          <div className="mt-2 p-2 bg-blue-100 rounded flex items-start gap-2">
            <Terminal className="h-3 w-3 mt-0.5" />
            <div>
              <p className="font-medium">Verify encryption transparency:</p>
              <p>Open your browser console (F12 &gt; Console) to see the complete API call logs, including:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Original message (never sent to server)</li>
                <li>Encrypted message (what's actually sent)</li>
                <li>Complete API request and response details</li>
                <li>Timing information for encryption and API calls</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
