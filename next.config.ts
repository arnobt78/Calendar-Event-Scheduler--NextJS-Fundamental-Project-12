import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - App Router is the default in Next.js 15+ (`src/app`).
 * - Turbopack is enabled via `next dev --turbopack` in package.json (faster HMR).
 * - No `rewrites` / `headers` here — static metadata lives in `src/app/layout.tsx`.
 */
const nextConfig: NextConfig = {
  /* Double-invokes certain lifecycles in dev to surface impure side effects. */
  reactStrictMode: true,
};

export default nextConfig;
