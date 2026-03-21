import HomePage from "@/components/pages/HomePage";

/**
 * Home Page — Server Component (SSR shell)
 *
 * This is the Next.js App Router entry point for the "/" route.
 * It's a server component that simply renders the client-side HomePage.
 *
 * Best practice: Keep server components thin — only SSR-related code here.
 * All interactive/client-side logic lives in components/pages/HomePage.tsx.
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/server-components
 */
export default function Home() {
  return <HomePage />;
}
