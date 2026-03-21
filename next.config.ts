import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - App Router is the default in Next.js 15+
 * - Turbopack is enabled via `next dev --turbopack` in scripts
 */
const nextConfig: NextConfig = {
  /* React strict mode helps catch common bugs early */
  reactStrictMode: true,
};

export default nextConfig;
