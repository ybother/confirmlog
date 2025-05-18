/**
 * This file contains constants that are generated at build time
 */

// Generate a timestamp for when the build occurred
export const BUILD_TIMESTAMP = new Date().toISOString()

// Format the build timestamp in a human-readable format
export const FORMATTED_BUILD_TIME = new Date().toLocaleString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
})
