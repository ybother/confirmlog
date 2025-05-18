/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "",
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || "",
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_TIMESTAMP: process.env.VERCEL_GIT_COMMIT_TIMESTAMP || "",
  },
}

module.exports = nextConfig
