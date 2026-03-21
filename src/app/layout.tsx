import type { Metadata } from "next";
import { Comfortaa, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
/**
 * Comfortaa — Primary body font (variable weight 300–700)
 * Used for all body text, inputs, and general UI elements.
 */
const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

/**
 * Bebas Neue — Display / heading font (single weight 400)
 * Used for large headings and decorative titles.
 */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

/**
 * SEO metadata — uses NEXT_PUBLIC_APP_TITLE env var with fallback.
 * Favicon is served from /public/favicon.ico automatically by Next.js.
 */
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE ?? "Calendar Todo",
  description:
    "A modern calendar and todo application built with Next.js, TypeScript, and Tailwind CSS — a beginner-friendly React/Next.js tutorial project.",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * RootLayout — Server Component (SSR)
 * - Wraps the entire app with font variables and global styles
 * - suppressHydrationWarning on <html> to avoid hydration mismatch warnings
 *   (e.g., from browser extensions injecting attributes)
 * - Body uses glassmorphism background from UI_STYLING_GUIDE.md
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${comfortaa.variable} ${bebasNeue.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#0a0a0f] font-[family-name:var(--font-comfortaa)] text-white antialiased"
      >
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors={false}
          closeButton
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "flex items-start gap-3 w-[22rem] rounded-2xl border p-4 shadow-2xl font-[family-name:var(--font-comfortaa)] text-sm",
              closeButton: "!text-white/50 hover:!text-white",
            },
          }}
        />
      </body>
    </html>
  );
}
