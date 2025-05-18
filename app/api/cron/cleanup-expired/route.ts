import { NextResponse } from "next/server"
import { cleanupExpiredMessages } from "@/lib/cleanup"

// This function will be called by the daily cron job
export async function GET(request: Request) {
  try {
    // Verify the request is coming from an authorized source
    const authHeader = request.headers.get("authorization")

    // Check if this is a Vercel cron job or if it has the correct secret
    const isVercelCron = request.headers.get("x-vercel-cron") === "true"
    const hasValidSecret = authHeader === `Bearer ${process.env.CRON_SECRET_KEY}`

    if (!isVercelCron && !hasValidSecret) {
      console.error("Unauthorized attempt to access cron job")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Use the cleanup utility function
    const result = await cleanupExpiredMessages()

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    console.log(`Daily cleanup completed: ${result.count} messages cleaned`)

    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count,
      clearedIds: result.clearedIds,
    })
  } catch (error) {
    console.error("Error in cleanup cron job:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to clean up expired messages",
      },
      { status: 500 },
    )
  }
}
