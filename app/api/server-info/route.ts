import { NextResponse } from "next/server"

// Store the server start time when this module is first loaded
const SERVER_START_TIME = new Date().toISOString()

export async function GET() {
  return NextResponse.json({
    serverStartTime: SERVER_START_TIME,
    currentTime: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    gitCommitTimestamp: process.env.VERCEL_GIT_COMMIT_TIMESTAMP || null,
  })
}
