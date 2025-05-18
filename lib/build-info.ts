import fs from "fs"
import path from "path"

// Generate a build info file
export function generateBuildInfo() {
  const buildInfo = {
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
  }

  // Create the public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), "public")
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Write the build info to a JSON file
  fs.writeFileSync(path.join(publicDir, "build-info.json"), JSON.stringify(buildInfo, null, 2))

  console.log("Build info generated:", buildInfo)
}

// If this file is executed directly (e.g., during the build process)
if (require.main === module) {
  generateBuildInfo()
}
