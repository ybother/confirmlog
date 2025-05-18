import { NextResponse } from "next/server"
import { BUILD_TIMESTAMP } from "@/lib/build-constants"

export async function GET() {
  return NextResponse.json({
    buildTime: BUILD_TIMESTAMP,
    currentTime: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
  })
}
