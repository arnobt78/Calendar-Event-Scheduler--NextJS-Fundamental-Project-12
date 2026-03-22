/**
 * Root App Router layout (Server Component).
 * - Loads global CSS and Google fonts (Comfortaa + Bebas Neue).
 * - Exports static `metadata` for SEO (title, Open Graph, icons, robots).
 * - Renders Sonner toasts for client notifications from anywhere under this tree.
 */
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

/** Production / canonical site origin (see README live demo). */
const SITE_URL_FALLBACK = "https://taskmate-calendar.vercel.app";

/** Builds a valid origin for `metadataBase` so Open Graph URLs resolve even if `.env` is mistyped. */
function getMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_URL_FALLBACK;
  try {
    return new URL(raw);
  } catch {
    return new URL(SITE_URL_FALLBACK);
  }
}

const DEFAULT_PAGE_TITLE =
  "Calendar To-Do — Next.js calendar, events & todos (TypeScript, Tailwind CSS, Framer Motion)";

const META_DESCRIPTION =
  "TaskMate Calendar: a responsive monthly calendar and event scheduler. Add, edit, and delete timed tasks with local persistence. Built with Next.js, React 19, TypeScript, Tailwind CSS, and Framer Motion. Portfolio project by Arnob Mahmud — contact@arnobmahmud.com.";

const META_KEYWORDS: string[] = [
  "calendar",
  "to-do",
  "todo",
  "task planner",
  "event scheduler",
  "schedule",
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "TaskMate Calendar",
  "Arnob Mahmud",
];

/**
 * SEO metadata — title override via NEXT_PUBLIC_APP_TITLE; canonical URL via NEXT_PUBLIC_SITE_URL.
 * Icons: /public/favicon.ico (add opengraph-image.png later for richer social previews).
 */
export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: process.env.NEXT_PUBLIC_APP_TITLE?.trim() || DEFAULT_PAGE_TITLE,
    template: "%s | TaskMate Calendar",
  },
  description: META_DESCRIPTION,
  applicationName: "TaskMate Calendar",
  authors: [{ name: "Arnob Mahmud", url: "https://www.arnobmahmud.com" }],
  creator: "Arnob Mahmud",
  publisher: "Arnob Mahmud",
  keywords: META_KEYWORDS,
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TaskMate Calendar",
    title:
      process.env.NEXT_PUBLIC_APP_TITLE?.trim() || DEFAULT_PAGE_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title:
      process.env.NEXT_PUBLIC_APP_TITLE?.trim() || DEFAULT_PAGE_TITLE,
    description: META_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "productivity",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
        {/* Route segments render here (e.g. app/page.tsx → HomePage). */}
        {children}
        {/* Global toast host: `toast()` / `toast.custom()` from client code appears here. */}
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
