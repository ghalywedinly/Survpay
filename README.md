# Survpay

**Your Opinion Has Value.**

Survpay is a Saudi Arabia–focused survey rewards marketplace: companies create
targeted surveys, participants answer them and get paid in SAR, and an
internal admin team runs the platform. This repo is a full-stack MVP built
with Next.js (App Router) and TypeScript — Arabic-first, fully bilingual
(Arabic/English) with proper RTL support, and backed by a realistic seeded
mock data layer.

## Tech stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **TypeScript** end-to-end
- **Tailwind CSS** for styling, with a small custom design system
  (`src/components/ui`)
- **next-intl** for i18n/routing — `ar` (default) and `en`, with proper RTL
  (`dir="rtl"`, logical CSS properties, mirrored layout/icons)
- **Recharts** for analytics charts
- **lucide-react** for icons
- No external database: a typed, in-memory "mock backend" (see below) that's
  designed to be swapped for a real database without touching the UI layer

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/ar` by default.

`npm run build && npm run start` runs the production build.

## Demo accounts

All demo accounts use the password `Survpay2026!`. The login page also has
one-click demo login buttons that sign you in instantly.

| Role        | Email                     | What you'll see                                   |
| ----------- | -------------------------- | -------------------------------------------------- |
| Participant | `participant@survpay.com`  | A participant with real earnings/withdrawal history |
| Company     | `company@survpay.com`      | "Nova Retail Group" with active surveys & analytics |
| Admin       | `admin@survpay.com`        | Full platform overview, users, fraud queue, etc.    |

Signing up as a new participant or company also works end-to-end (the account
is created in the in-memory store for the life of the server process).

## Architecture

### Mock data / service layer

Since there's no external database in this environment, `src/lib/data`
implements a realistic in-memory "database":

- `types.ts` — every entity (`User`, `ParticipantProfile`, `Company`,
  `Survey`, `SurveyQuestion`, `SurveyResponse`, `Transaction`, `Withdrawal`,
  `Notification`, `FraudFlag`, etc.)
- `data/seed.ts` — builds realistic seed data (companies, surveys with
  bilingual questions, ~35 participants with demographics, transaction/
  withdrawal history, fraud flags) using a deterministic PRNG so the data is
  stable across restarts
- `data/store.ts` — a singleton pinned to `globalThis` (so it survives dev
  hot-reload) exposing the seeded data; this is the one module you'd replace
  with real DB calls (Prisma/Drizzle/etc.) to go to production
- `services/*.ts` — business logic on top of the store: eligibility
  matching, survey completion + reward payout, withdrawals, fraud scoring,
  company analytics, admin operations. These are the functions to keep when
  swapping the storage layer.

All mutations happen through **Server Actions** (`src/app/actions/*.ts`),
which call the service layer and `revalidatePath` the affected routes —
there's no separate REST API, but the service functions are already
structured so wrapping them in route handlers later is trivial.

### Auth

`src/lib/session.ts` implements a small signed-cookie session (HMAC-SHA256
via Web Crypto, so it works identically in Edge middleware and the Node
server-action runtime) and demo-grade password hashing. **This is
intentionally a lightweight, demo-appropriate auth layer** — swap it for
NextAuth/Clerk/Auth.js + real password hashing (bcrypt/argon2) before any
production use. `src/middleware.ts` combines next-intl's locale middleware
with role-based route protection (`/participant`, `/company`, `/admin`).

### Business logic implemented

- **Survey eligibility**: participants only see surveys whose target
  audience (age range, gender, city, income, employment, interests) matches
  their profile (`services/eligibility.ts`).
- **Survey completion**: validates answers, computes the reward, credits the
  participant's balance, logs a transaction, increments the survey's
  response count, and auto-completes the survey once it hits its target.
  Unusually fast completions or a failed attention-check question route the
  reward to "pending" and raise a fraud flag instead of releasing funds
  immediately — a simple but real quality-control loop.
- **Withdrawals**: minimum SAR 50, validated against available balance,
  reserved immediately, then approved/paid or rejected (with refund) by an
  admin.
- **Company billing**: cost-per-response accrues to the company's wallet as
  responses come in, matching the "estimated cost" shown in the survey
  creation wizard.

### Internationalization

Routes are locale-prefixed (`/ar/...`, `/en/...`) via `next-intl`. Arabic is
the default locale. RTL is implemented properly, not just visually flipped:
`dir="rtl"` on `<html>`, Tailwind logical properties (`ps-`, `pe-`, `start-`,
`end-`) throughout instead of `pl-`/`pr-`/`left-`/`right-`, and the Cairo
font for Arabic vs. Archivo for English. Survey/company content (titles,
descriptions, questions, answer options) is stored bilingually; UI chrome is
translated via `messages/ar.json` and `messages/en.json`.

### Visual identity

The UI follows Survpay's Visual Identity v1.0 (`tailwind.config.ts`,
`src/app/globals.css`): three brand colours — Survpay Purple `#AA52F7`,
Signal Blue `#054CF6`, Panel Aqua `#65E8E5` — plus Ink `#14121C`, Ground
`#F3F2F2` and Paper `#FFFFFF`. The capsule (full radius) is the only rounded
shape in the system — buttons, tags, avatars, and survey-answer options;
every other surface is square with a hard 2px ink rule instead of a shadow.
Typography is Archivo (Latin) and Cairo (Arabic), numerals render in Western
Arabic digits even under the Arabic locale (`lib/format.ts`), and the S-mark
(`components/brand/logo.tsx`) is built from three solid capsule segments —
never a gradient.

## Project structure

```
src/
  app/
    actions/                 Server Actions (auth, survey, withdraw, company, admin, profile, notifications)
    [locale]/
      page.tsx                Marketing landing page
      (auth)/                 Login / signup / forgot-password
      participant/            Participant dashboard, survey marketplace, survey-taking flow, earnings, withdraw, profile…
      company/                Company dashboard, survey management, create-survey wizard, analytics, billing, team…
      admin/                  Platform overview, users, companies, surveys, transactions, withdrawals, fraud, support…
  components/
    ui/                       Design system primitives (Button, Input, Card, Badge, Modal, Table, Tabs, Toast…)
    dashboard/                Shared dashboard chrome (Sidebar, Topbar, charts, stat cards, notifications)
    marketing/, brand/        Landing page + logo
    participant/, company/, admin/   Role-specific composite components
  lib/
    types.ts, constants.ts    Domain types & shared constants
    data/                     Seed data + in-memory store
    services/                 Business logic
    session.ts, auth.ts       Auth
    format.ts, i18n-utils.ts  Formatting & localization helpers
messages/
  ar.json, en.json             Translation dictionaries
```

## Known limitations (by design, for an MVP prototype)

- **No real database or payment rails.** Data resets when the server process
  restarts. Withdrawals are simulated — no real bank/STC Pay integration.
- **Auth is demo-grade.** Good enough to demonstrate role-based access
  control end-to-end; not hardened for production (see `session.ts`).
- **Email verification / password reset are stubbed** (the UI flow is real,
  the email never actually sends).
