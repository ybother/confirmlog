/**
 * Formats a date in a consistent format across the application
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Formats a timestamp from Vercel environment variables
 * @param timestamp Timestamp from Vercel environment
 * @returns Formatted date string or fallback
 */
export function formatVercelTimestamp(timestamp: string | undefined, fallback = "development"): string {
  if (!timestamp || timestamp === "") return fallback

  try {
    const date = new Date(timestamp)
    return formatDate(date)
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return fallback
  }
}
