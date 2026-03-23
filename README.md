# Calendar Event Scheduler — Next.js, React, TypeScript, TailwindCSS, Framer Motion Fundamental Project 12

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF)](https://www.framer.com/motion/)

A modern, responsive web app that merges a **monthly calendar** with a **timed event / to-do list**. Pick future (or today’s) dates, set hours and minutes, write a short note, then **add**, **edit**, or **delete** events. The UI uses a dark **glassmorphism** style, subtle **Framer Motion** transitions, and **Sonner** toasts for feedback. All event data lives in the browser via **`localStorage`**—there is **no server database** and **no REST API** in this repo.

**Live demo:** [https://taskmate-calendar.vercel.app/](https://taskmate-calendar.vercel.app/)

![Image](https://github.com/user-attachments/assets/44443874-b415-4b24-97b5-51a2b351dc53)

## Table of contents

1. [Project summary](#project-summary)
2. [Features & functionality](#features--functionality)
3. [Technology stack](#technology-stack)
4. [Dependencies & what they do](#dependencies--what-they-do)
5. [How the app works (architecture)](#how-the-app-works-architecture)
6. [Routes & API](#routes--api)
7. [Project structure](#project-structure)
8. [Environment variables (`.env`)](#environment-variables-env)
9. [Installation & how to run](#installation--how-to-run)
10. [NPM scripts](#npm-scripts)
11. [User walkthrough](#user-walkthrough)
12. [Components & reuse in other projects](#components--reuse-in-other-projects)
13. [Data model & persistence](#data-model--persistence)
14. [Code snippets (learning examples)](#code-snippets-learning-examples)
15. [Learning keywords](#learning-keywords)
16. [Extending the project (backend, API, auth)](#extending-the-project-backend-api-auth)
17. [Conclusion](#conclusion)
18. [License](#license)
19. [Happy coding! 🎉](#happy-coding-)

---

## Project summary

This repository is an **educational / portfolio** project aimed at beginners and intermediate developers who want to see a **realistic Next.js App Router** setup: **Server Components** at the entry (`app/page.tsx`), **Client Components** for all interactivity, **React Context** to avoid prop drilling, **custom hooks** for calendar math and event CRUD, and **careful handling of `localStorage`** with `useSyncExternalStore` to avoid **hydration mismatches** between server HTML and the browser.

You can **clone**, **run locally**, **deploy to Vercel**, or **copy individual components** (e.g. `RippleButton`, `ConfirmDialog`) into other apps as long as you respect the [MIT License](#license).

---

## Features & functionality

| Area            | What you get                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| **Calendar**    | Month/year navigation, grid of days, highlights for “today”, click a valid day to open the event form.      |
| **Events**      | Create, edit, delete; each event has `id`, `date`, `time` (`HH:mm`), and `text`.                            |
| **Validation**  | Past-only days are not used for new events (today and future allowed).                                      |
| **List**        | Scrollable schedule list beside (or below) the calendar; edit/delete with confirmation-style dialogs.       |
| **Persistence** | JSON in `localStorage` under key `calendar-todo-events`; survives refresh until cleared.                    |
| **UX**          | Toasts for add/edit/delete/errors; ripple buttons; animated containers; loading skeleton inside `Suspense`. |
| **SEO**         | Root `layout.tsx` exports rich **metadata** (title, description, Open Graph, etc.); optional env overrides. |

---

## Technology stack

- **Next.js 15** — App Router, `app/` directory, static generation for `/`.
- **React 19** — Client components, hooks, Context.
- **TypeScript** — Typed components, hooks, and shared types in `src/types/`.
- **Tailwind CSS v4** — Utility classes + PostCSS pipeline.
- **Framer Motion** — Layout and entrance animations.
- **Lucide React** — Icons (calendar, arrows, edit, trash, etc.).
- **Sonner** — Toast notifications (configured in `layout.tsx`).
- **class-variance-authority (CVA)** + **clsx** + **tailwind-merge** — Composable, conflict-safe class names (see `src/lib/utils.ts`).

---

## Dependencies & what they do

**Runtime (`dependencies`)**

- **`next`** — Framework: routing, SSR/SSG, image/font helpers, `Metadata` API.
- **`react` / `react-dom`** — UI library and DOM renderer.
- **`framer-motion`** — `motion` components, `AnimatePresence`, transitions.
- **`lucide-react`** — Tree-shakeable SVG icons as React components.
- **`sonner`** — `<Toaster />` + `toast()` / `toast.custom()` for feedback.
- **`class-variance-authority`** — Define variant props for UI components (e.g. button styles).
- **`clsx`** — Conditionally join class strings.
- **`tailwind-merge`** — Merge Tailwind classes without duplicate conflicts (`cn()` helper).

**Development (`devDependencies`)**

- **`typescript`** — Type-checking.
- **`tailwindcss`**, **`@tailwindcss/postcss`**, **`postcss`** — CSS pipeline.
- **`eslint`**, **`eslint-config-next`**, **`@eslint/eslintrc`** — Linting (flat config in `eslint.config.mjs`).
- **`@types/*`** — Type definitions for Node and React.

_Example:_ merging classes safely in your own project:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage: cn("px-4", isActive && "bg-sky-500", className)
```

---

## How the app works (architecture)

1. **`src/app/page.tsx`** (Server Component) renders **`HomePage`**.
2. **`HomePage`** wraps the UI in **`EventProvider`** and **`Suspense`** (fallback: `CalendarSkeleton`).
3. **`EventProvider`** (`src/context/EventContext.tsx`) calls **`useCalendar()`** and **`useEvents(month, year)`**, then exposes one object via Context.
4. **`CalendarApp`** composes **`CalendarHeader`**, **`CalendarGrid`**, **`EventList`**, **`EventPopup`**—all consume **`useEventContext()`**.
5. **`useEvents`** syncs the event list with **`localStorage`** using **`useSyncExternalStore`**, so the server and the first hydration pass agree on an empty list; the browser then shows stored events after hydration.

```bash
app/page.tsx (Server)
    └── HomePage (Client)
            └── EventProvider
                    └── CalendarApp
                            ├── CalendarHeader / CalendarGrid / EventPopup
                            └── EventList
```

---

## Routes & API

| Route             | File               | Role                         |
| ----------------- | ------------------ | ---------------------------- |
| **`/`**           | `src/app/page.tsx` | Home — calendar + events UI. |
| **`/_not-found`** | Next.js built-in   | 404 page.                    |

**API routes:** **None.** This app does not define `app/api/*`. There is **no backend** in the repository: no database, no serverless functions for CRUD. If you need multi-device sync or accounts, you would add something like **Next.js Route Handlers**, **tRPC**, or an external **REST/GraphQL** API (see [Extending the project](#extending-the-project-backend-api-auth)).

---

## Project structure

```bash
calendar-todo/
├── LICENSE
├── README.md
├── components.json          # shadcn-style component config (if used)
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── vercel.json
├── .env.example             # Optional SEO / title overrides (documented below)
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx       # Fonts, metadata, Sonner Toaster
    │   └── page.tsx         # Server entry → HomePage
    ├── components/
    │   ├── calendar/        # Feature UI
    │   │   ├── CalendarApp.tsx
    │   │   ├── CalendarGrid.tsx
    │   │   ├── CalendarHeader.tsx
    │   │   ├── EventList.tsx
    │   │   └── EventPopup.tsx
    │   ├── pages/
    │   │   └── HomePage.tsx
    │   └── shared/          # Reusable pieces
    │       ├── AnimatedContainer.tsx
    │       ├── CalendarSkeleton.tsx
    │       ├── ConfirmDialog.tsx
    │       ├── CTAShineButton.tsx
    │       ├── EventStatusBadge.tsx
    │       └── RippleButton.tsx
    ├── context/
    │   └── EventContext.tsx
    ├── hooks/
    │   ├── useCalendar.ts
    │   ├── useEvents.ts
    │   └── useRipple.ts
    ├── lib/
    │   ├── constants.ts
    │   └── utils.ts
    └── types/
        ├── global.d.ts
        └── index.ts
```

---

## Environment variables (`.env`)

**You do not need any `.env` file to run or build this project.** Everything works with sensible defaults (see `src/app/layout.tsx`).

**Optional** variables (for **branding** and **SEO** only):

| Variable                | Purpose                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_TITLE` | Browser tab title + Open Graph / Twitter title override.                                     |
| `NEXT_PUBLIC_SITE_URL`  | Canonical origin for metadata (`metadataBase`), e.g. `https://taskmate-calendar.vercel.app`. |

**How to set them**

1. Copy **`.env.example`** → **`.env.local`** (recommended for Next.js secrets; `.env.local` is gitignored).
2. Adjust values; restart `npm run dev`.

**Production (e.g. Vercel):** add the same keys in the project **Environment Variables** dashboard if you want a custom title or domain for metadata.

**Security note:** Only `NEXT_PUBLIC_*` variables are exposed to the browser. This project does not use secret server-only keys.

---

## Installation & how to run

**Prerequisites:** [Node.js](https://nodejs.org/) **18.18+** (or 20+ recommended) and npm.

```bash
# Clone your fork or this repository (update the URL if yours differs)
git clone https://github.com/arnobt78/Calendar-To-Do--ReactVite.git
cd <repository-folder>        # e.g. calendar-todo

# Install
npm install

# Optional: copy env template
cp .env.example .env.local

# Development (Turbopack)
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

```bash
# Production build + local serve
npm run build
npm start
```

---

## NPM scripts

| Script     | Command                                  | Purpose                                |
| ---------- | ---------------------------------------- | -------------------------------------- |
| `dev`      | `next dev --turbopack`                   | Fast local development.                |
| `build`    | `next build`                             | Optimized production build.            |
| `start`    | `next start`                             | Run production server (after `build`). |
| `lint`     | `next lint && eslint . --max-warnings 0` | Next + ESLint checks.                  |
| `lint:fix` | `next lint --fix && eslint . --fix …`    | Auto-fix where possible.               |

---

## User walkthrough

1. **Open the app** — You see the calendar card and the **Schedules** panel.
2. **Change month** — Use the header arrows (`prevMonth` / `nextMonth`).
3. **Add an event** — Click a **today or future** day → popup opens → set time and text → save → toast confirms; list updates.
4. **Edit** — Pencil icon on a row → confirm if prompted → adjust in popup → save.
5. **Delete** — Trash icon → confirm → event removed and toast shown.
6. **Refresh** — Data remains (from `localStorage`) unless you clear site data.

---

## Components & reuse in other projects

Many pieces are **portable** if you copy files and install the same dependencies (or strip Motion/Ripple if you prefer).

| Piece                       | Path                                          | Reuse idea                                         |
| --------------------------- | --------------------------------------------- | -------------------------------------------------- |
| **`cn` utility**            | `src/lib/utils.ts`                            | Drop into any Tailwind + React app.                |
| **`RippleButton`**          | `src/components/shared/RippleButton.tsx`      | Material-style tap feedback on buttons.            |
| **`ConfirmDialog`**         | `src/components/shared/ConfirmDialog.tsx`     | Accessible confirm/cancel for destructive actions. |
| **`AnimatedContainer`**     | `src/components/shared/AnimatedContainer.tsx` | Wrapper for directional `framer-motion` entrance.  |
| **`EventProvider` + hooks** | `context/`, `hooks/`                          | Template for **Context + custom hooks** pattern.   |

**Minimal reuse pattern:** wrap your tree with providers and use hooks:

```tsx
import { EventProvider } from "@/context/EventContext";
import CalendarApp from "@/components/calendar/CalendarApp";

export default function Page() {
  return (
    <EventProvider>
      <CalendarApp />
    </EventProvider>
  );
}
```

To use only **UI** without this app’s state, copy the **presentational** parts and replace `useEventContext()` with your own props or a different store (Zustand, Redux, etc.).

---

## Data model & persistence

**Type** (from `src/types/index.ts`):

```ts
export interface CalendarEvent {
  id: number;
  date: Date;
  time: string; // "HH:mm"
  text: string;
}
```

**Storage:** `localStorage` key **`calendar-todo-events`**. Dates are serialized as ISO strings in JSON and rehydrated as `Date` in `useEvents`.

**Limitations (learning points):**

- Data is **per browser, per origin** (not synced across devices).
- **Private browsing** may clear storage when the session ends.
- No encryption—do not store sensitive secrets in event text.

---

## Code snippets (learning examples)

**Month navigation (conceptually):**

```ts
const prevMonth = () => {
  setCurrentMonth((prev) => {
    if (prev === 0) {
      setCurrentYear((y) => y - 1);
      return 11;
    }
    return prev - 1;
  });
};
```

**Functional update when saving events** (avoids stale state with external store):

```ts
setEvents((prev) => {
  const next = [...prev, newEvent];
  next.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return next;
});
```

---

## Learning keywords

Next.js App Router · React Server vs Client Components · React Context API · Custom hooks (`useCalendar`, `useEvents`) · `useSyncExternalStore` · Hydration · TypeScript interfaces · Tailwind CSS · Framer Motion · `localStorage` persistence · Component composition · Accessibility (labels, dialogs) · ESLint flat config · Vercel deployment

---

## Extending the project (backend, API, auth)

Ideas for learners:

- Add **`app/api/events/route.ts`** with **GET/POST** backed by a database (**Prisma + PostgreSQL**, **Supabase**, etc.).
- Replace `localStorage` with **SWR** or **TanStack Query** fetching your API.
- Add **NextAuth.js** or **Clerk** for user-scoped calendars.
- Generate **`opengraph-image.tsx`** for richer social previews.

---

## Conclusion

**Calendar To-Do / TaskMate Calendar** is a self-contained front-end that teaches **modern React patterns** inside **Next.js 15** without forcing a backend. Use it as a **starter**, a **portfolio piece**, or a **reference** for Context, hooks, and persistence-aware SSR. Extend it when you are ready for real APIs and databases.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

---

## Happy coding! 🎉

This is an **open-source project** — feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
