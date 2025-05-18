"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ServerInfoDebug() {
  const [serverInfo, setServerInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServerInfo() {
      try {
        setLoading(true)
        const response = await fetch("/api/server-info")
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        const data = await response.json()
        setServerInfo(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching server info:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchServerInfo()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Information</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading server information...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="space-y-2">
            <div>
              <strong>Server Start Time:</strong>{" "}
              {serverInfo.serverStartTime ? new Date(serverInfo.serverStartTime).toLocaleString() : "Unknown"}
            </div>
            <div>
              <strong>Current Time:</strong>{" "}
              {serverInfo.currentTime ? new Date(serverInfo.currentTime).toLocaleString() : "Unknown"}
            </div>
            <div>
              <strong>Environment:</strong> {serverInfo.environment || "Unknown"}
            </div>
            <div>
              <strong>Git Commit SHA:</strong> {serverInfo.gitCommitSha || "Unknown"}
            </div>
            <div>
              <strong>Git Commit Timestamp:</strong>{" "}
              {serverInfo.gitCommitTimestamp ? new Date(serverInfo.gitCommitTimestamp).toLocaleString() : "Unknown"}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Note: This information is for debugging purposes. The server start time represents when the server was
                last restarted, which is typically when the application was deployed.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
