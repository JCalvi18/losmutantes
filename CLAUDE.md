# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** website for Los Mutantes, a Spanish theater group based in Germany. TypeScript throughout, styled with Tailwind CSS v4, UI components from HeroUI v3.

---

## Pages & Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` → `app/home.tsx` | Season intro, play description, show dates with map links |
| `/about` | `app/about/page.tsx` | Team history, mission cards, aspirations |
| `/archivo` | `app/archivo/page.tsx` | Archive landing with past play posters |
| `/archivo/lamalditacomedia` | `app/archivo/lamalditacomedia/page.tsx` | Play details: synopsis, technical sheet, cast, gallery |
| `/tickets` | `app/tickets/page.tsx` → `app/tickets/tickets.tsx` | Full ticket booking with PayPal integration |
| `GET /api/getMCimages` | `app/api/getMCimages/route.ts` | Returns sorted gallery images from `/public/maldita_comedia_galery/` |
| `POST /api/reservations` | `app/api/reservations/route.ts` | Saves reservation to MongoDB, sends confirmation email |

---

## Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `RootLayout` | `app/layout.tsx` | Root container; applies Geist fonts, header, footer |
| `Home` | `app/home.tsx` | Hero + `PlaceDate` sub-component for each show entry |
| `SiteHeader` | `app/site-header.tsx` | Nav bar with logo, nav links, ES/EN/DE language buttons |
| `SiteFooter` | `app/site-footer.tsx` | Email link + FB/IG/TikTok social icons |
| `Providers` | `app/providers.tsx` | Wraps `PayPalScriptProvider` + `LanguageProvider` |
| `Carrousel` | `app/carrousel.tsx` | Auto-play image slider (4 s), prev/next buttons, dot indicators, keyboard arrows |
| `IntroSeen` | `app/animation.tsx` | Machine-UI button with explosion particle animation on click |
| `Tickets` | `app/tickets/tickets.tsx` | Show selector, ticket count, student checkbox, name/email, PayPal buttons, confirmation modal |

---

## Internationalisation (i18n)

- All UI strings live in `app/i18n/translations.json`, organised by language (`es`, `en`, `de`) and then by page/section key.
- `app/i18n/LanguageContext.tsx` exposes a `useLanguage()` hook returning `{ language, setLanguage, t }`. `t` is the full translations object for the active language.
- `LanguageProvider` is mounted in `app/providers.tsx`. Every client component that needs translated text must call `useLanguage()`.
- The selected language is persisted to `localStorage`; the `<html lang>` attribute is kept in sync automatically.
- To add a new string: add it under all three language keys in `translations.json`, then reference it as `t.<section>.<key>` in the component.

**Translation sections:** `nav`, `home`, `footer`, `about`, `lamalditacomedia`, `carrousel`, `animation`, `tickets`.

---

## Ticket Booking System

### Flow
1. User selects a show (filtered to future dates), enters ticket count (1–10), student status, name, and email.
2. Price is calculated via `getTicketPrice(isStudent, isDayOf)` from `lib/shows.ts`.
3. PayPal buttons (enabled only when form is valid) create an order in USD.
4. On PayPal approval, `POST /api/reservations` is called with `{ name, email, show, tickets, isStudent, paypalOrderId }`.
5. API validates, saves to MongoDB (`reservations` collection), and sends a confirmation email.
6. A confirmation modal displays show, date, booking ID, and total; "Book another" resets the form.

### Show data (`lib/shows.ts`)
- `SHOWS` array — each entry: `{ city, theater, date, isoDate, link }`.
- `TICKET_PRICES` — `{ student: { early: 8, dayOf: 10 }, standard: { early: 12, dayOf: 15 } }`.
- `getTicketPrice(isStudent, isDayOf)` — returns the correct euro price.
- `isDayOf` is determined at API time by comparing `show.isoDate` to today's ISO date string.

### Database (`lib/mongodb.ts`)
- `getMongoClient()` — singleton pattern; in dev uses `global._mongoClientPromise` to survive HMR.
- Requires env var `MONGODB_URI`.

### Email (`lib/mailer.ts`)
- nodemailer transporter configured for IONOS SMTP (`smtp.ionos.de:465`).
- `sendConfirmation(email, name, show, tickets, amount, reservationId)` sends an HTML receipt.
- Requires env vars: `EMAIL_USER`, `EMAIL_PASS`.

### PayPal
- `@paypal/react-paypal-js` — `PayPalScriptProvider` is in `app/providers.tsx`.
- Requires env var `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.

---

## Data & API

- `GET /api/getMCimages` reads filenames from `/public/maldita_comedia_galery/` and returns them sorted numerically.
- `POST /api/reservations` validates input, calculates price tier, writes to MongoDB, and fires a confirmation email.
- No global state management — only local `useState`. Data fetching is done in `useEffect` when needed.

---

## Key Conventions

- Pages are defined in `app/[route]/page.tsx` and re-export a sibling component file (e.g., `page.tsx` renders `home.tsx`). Keep page logic in the sibling, not in `page.tsx`.
- Page component functions must be **PascalCase** (e.g. `Page`, not `page`) so React hooks work correctly.
- All interactive components are explicitly marked `"use client"`.
- HeroUI v3 uses compound component API (`<Modal><Modal.Header>...`); no `<HeroUIProvider>` wrapper is required in v3.
- `@paypal/react-paypal-js` requires `PayPalScriptProvider` (handled in `app/providers.tsx`).
- The root layout (`app/layout.tsx`) includes `SiteHeader` and `SiteFooter` on every page.

---

## Styling

- Tailwind v4 is configured inline via `app/globals.css` (no `tailwind.config.js`).
- Custom CSS animations (wave, fire/flame effects) live in `globals.css`.
- Color accents: orange-700, red-600, blue-100.

---

## Static Assets

- `/public/maldita_comedia_galery/` — gallery images served dynamically via the API route.
- `/public/logo.png`, `nosotros.jpg`, `nosotros2.jpg` — static images referenced directly.

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15 | Framework (App Router) |
| `react` / `react-dom` | 19 | UI library |
| `@heroui/react` | 3 | Component library (Tailwind v4) |
| `@paypal/react-paypal-js` | 9 | PayPal checkout |
| `mongodb` | 7 | Database client |
| `nodemailer` | 8 | Transactional email |
| `country-flag-icons` | 1.5 | Unicode flag emojis for cast nationalities |
| `@heroicons/react` | 2 | Icon set |
| `lodash` | 4 | General utilities |

---

## Path Alias

`@/*` resolves to the project root (defined in `tsconfig.json`).

## Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `EMAIL_USER` | IONOS SMTP login |
| `EMAIL_PASS` | IONOS SMTP password |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID (exposed to browser) |
