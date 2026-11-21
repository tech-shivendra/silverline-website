# SilverLine Studio — Official Website & Lead Engine

> **"We don't just build products. We build what comes next."**

SilverLine Studio is a premium product development company focused on designing, engineering, and launching digital products. This repository contains the complete, production-ready website, interactive laboratory, and lead-generation engine.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **UI & Runtime:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Dark Futuristic Design Tokens
- **Motion & Dynamics:** [Framer Motion](https://www.framer.com/motion/) & Custom Canvas WebGL Ribbons
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) with Row Level Security (RLS)
- **Transactional Email:** [Resend](https://resend.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/), React Testing Library, JSDOM

---

## 🚀 Key Features

### 1. Dark Futuristic Editorial Experience
- Bespoke typography hierarchy (Space Grotesk headings, Inter body, JetBrains Mono technical labels).
- Custom continuous geometric SilverLine SVG identity and animated logo.
- Interactive Canvas-based metallic silver-line hero visual responding to cursor inertia and touch.
- Sticky blurred navigation with mobile drawer and accessibility controls.
- Reusable component primitives (Button, Card, Badge, Accordion, Tabs, SectionHeading, Container).

### 2. Comprehensive Routes & Case Studies
- `/` — Master Homepage (Hero, Philosophy, Selected Work, Services, Tech Ecosystem, Process, Studio, FAQ, Final CTA, Footer).
- `/work` — Project portfolio with live search and category filtering (Web, Mobile, SaaS, AI, Experiments).
- `/work/[slug]` — Deep-dive case studies (Problem statement, Objectives, Solution, Design Approach, Architecture, Major Features, Gallery, Measured Outcomes).
- `/services` — Detailed breakdown of 8 core studio capabilities.
- `/studio` — Company philosophy, engineering standards, and team profiles.
- `/privacy` & `/terms` — Compliant legal policies.
- Custom `/not-found`, `error.tsx`, and `loading.tsx` states.

### 3. Interactive Playground (`/playground`)
- **Product Architect (P1):** Live product configurator calculating complexity, suggested tech stack, sprint stages, and budget. Seamlessly transfers configurations directly to the inquiry form.
- **Interactive Terminal (P1):** Developer command-line interface with allowlisted registry (`help`, `whoami`, `services`, `stack`, `projects`, `studio`, `contact`, `clear`), command history (Up/Down arrow), and Tab autocomplete.
- **Pixel Rush Micro-Arcade (P2):** High-frame-rate canvas starship game harvesting silver energy particles with collision detection, local storage high scores, mobile touch controls, and web audio synthesis.

### 4. Resilient Lead Management & Backend API
- 5-step interactive inquiry experience (`/contact`) with pre-fill support and local storage draft safety.
- `POST /api/contact` API with token-bucket rate limiting (5 req/min/IP), Zod validation, and input sanitization.
- Generates unique reference codes (e.g. `SL-XXXXXX`).
- Inserts leads into Supabase `inquiries` table.
- Dispatches internal notifications and visitor acknowledgement emails via Resend.
- Logs delivery telemetry in `email_logs` table with graceful fallbacks.

---

## 🛠️ Environment Configuration

Copy the example environment template:

```bash
cp .env.example .env.local
```

Populate the required credentials:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Credentials (from Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Transactional Email (from Resend Dashboard)
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=studio@silverline.design
EMAIL_FROM=SilverLine Studio <inquiries@silverline.design>

# Optional Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 🗄️ Database Setup & Migrations

The database migration file is located at `supabase/migrations/20260301000000_initial_schema.sql` and seed data at `supabase/seed.sql`.

### Tables Created:
1. `projects` — Case studies and portfolio records.
2. `inquiries` — Lead capture records with status tracking.
3. `team_members` — Leadership and collective team.
4. `services` — Core studio capabilities and deliverables.
5. `testimonials` — Client testimonials (RLS enabled).
6. `email_logs` — Transactional email delivery audit trail.

### Row Level Security (RLS):
- Public `SELECT` allowed on published `projects`, `services`, `team_members`, and `testimonials`.
- Public `INSERT` allowed on `inquiries`.
- Public `SELECT`/`UPDATE`/`DELETE` blocked on `inquiries` and `email_logs` (accessible only via server-side service role key).

To apply via the Supabase SQL editor:
1. Copy contents of `supabase/migrations/20260301000000_initial_schema.sql` and run.
2. Run `supabase/seed.sql` to populate baseline case studies and capabilities.

---

## 🧪 Testing & Quality Assurance

Run the automated test suite:

```bash
# Run unit & integration tests
npm run test

# Run TypeScript compilation check
npm run typecheck

# Run production build
npm run build
```

---

## 🌐 Production Deployment (Vercel)

1. Import the repository into [Vercel](https://vercel.com).
2. Configure the production environment variables from `.env.example`.
3. Ensure domain DNS records point to Vercel edge network.
4. Verify SSL certificate generation and test live inquiry flow at `/contact`.
