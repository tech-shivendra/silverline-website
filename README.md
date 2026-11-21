# SilverLine Studio — Official Website, Admin CMS & Lead Engine

> **"We don't just build products. We build what comes next."**

SilverLine Studio is a premium product development company focused on designing, engineering, and launching digital products. This repository contains the complete, production-ready website, interactive laboratory, dynamic owner-controlled Admin CMS, role management system, creative theme engine, and lead-generation platform.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions & API Routes)
- **UI & Runtime:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Theme & Styling:** [Tailwind CSS](https://tailwindcss.com/) with dual-token Light & Dark futuristic architecture
- **Motion & Dynamics:** [Framer Motion](https://www.framer.com/motion/) & Custom Canvas WebGL Ribbons
- **Database & Auth:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) (`@supabase/ssr`) with Row Level Security (RLS)
- **Transactional Email:** [Resend](https://resend.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/), React Testing Library, JSDOM

---

## 🚀 Key Features

### 1. Dual Creative Theme System (Light / Dark / System)
- **Zero Theme Flash (FOUC):** Inlined vanilla JavaScript execution in `<head>` inspecting `localStorage` and `prefers-color-scheme` before DOM rendering.
- **Architectural Light & Dark Futuristic Tokens:** Dual `:root` and `.dark` CSS variable mappings with seamless background, text, and border transitions.
- **Accessible `<ThemeToggle />`:** One-click toggle between Light, Dark, and System modes on public navigation (desktop & mobile drawer) and admin header.

### 2. Owner-Controlled Admin CMS & Role Management
- **Designated Super Admin Bootstrap:** Automatically bootstraps `techshivendraa@gmail.com` as active `super_admin` upon authentication. No hardcoded passwords and no public admin registration.
- **Role Hierarchy & Server-Side Security:**
  - `super_admin`: Full system control, role assignment, admin invitations, audit logs, and settings.
  - `admin`: Full content CRUD (Projects, Services, Tech, Team, FAQs, Media, Inquiries).
  - `editor`: Draft creation and edits without deletion or role management permissions.
- **Admin Modules (`/admin`):**
  - **Overview Analytics (`/admin`):** Live CRM inquiry pipeline, CMS record counts, quick action triggers, and security audit stream.
  - **Project Management (`/admin/projects`):** Case study editor (overview, architecture, metrics, tech stack, gallery, live links) with instant publish/draft toggling.
  - **Services Management (`/admin/services`):** Full lifecycle capabilities and deliverables.
  - **Technology Ecosystem (`/admin/technologies`):** Manage stack items, categories, and associated project links.
  - **Studio Core Team (`/admin/team`):** Manage leadership and engineer profiles.
  - **Client Testimonials (`/admin/testimonials`):** Client testimonials and quotes.
  - **FAQ Editor (`/admin/faqs`):** Frequently asked questions with display order management.
  - **CRM Pipeline (`/admin/inquiries`):** Real-time inquiry manager with status filters (`New`, `In Review`, `Contacted`, `Converted`, `Archived`), internal notes, and secure deletion.
  - **Media Asset Library (`/admin/media`):** File asset catalog with CDN registration and instant clipboard URL copy.
  - **Site Settings & SEO (`/admin/settings`):** Dynamic brand positioning, contact links, and meta tags.
  - **Administrator Team (`/admin/admins`):** Invite administrators via secure tokens, toggle active status, and promote/demote roles.
  - **Security Audit Logs (`/admin/activity`):** Real-time audit log of all administrative actions with metadata inspector.

### 3. Dynamic Public Data Layer with Zero-Downtime Fallback
- `src/lib/cms/content.ts` dynamically queries published database rows for `/`, `/work`, `/work/[slug]`, `/services`, and `/studio`.
- Draft content (`published = false`) is strictly hidden from public visitors.
- If Supabase tables are unpopulated or temporarily offline, the platform automatically falls back to typed seed data without breaking page renders.

### 4. Interactive Playground (`/playground`)
- **Product Architect (P1):** Live product configurator calculating complexity, suggested tech stack, sprint stages, and budget. Pre-fills `/contact` automatically.
- **Interactive Terminal (P1):** Command-line interface with allowlisted registry (`help`, `whoami`, `services`, `stack`, `projects`, `studio`, `contact`, `clear`), command history, and Tab autocomplete.
- **Pixel Rush Micro-Arcade (P2):** High-frame-rate canvas starship game harvesting silver energy particles with collision detection, local storage high scores, mobile touch controls, and web audio synthesis.

### 5. Resilient Lead Management & Backend API
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

Populate the required credentials in `.env.local`:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Credentials (from Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://fgzocgkxsvwhcczeuywv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_6Znmtikufss7OqfxZAMQ7w_NRrAeMiz
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Transactional Email (from Resend Dashboard)
RESEND_API_KEY=re_your_resend_api_key
CONTACT_NOTIFICATION_EMAIL=techshivendraa@gmail.com
EMAIL_FROM=SilverLine Studio <inquiries@silverline.design>

# Optional Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 🗄️ Database Setup & Migrations

To configure the Supabase database:

1. Open your Supabase Dashboard **SQL Editor**.
2. Run migration 1: `supabase/migrations/20260301000000_initial_schema.sql` (Initial core tables and RLS).
3. Run migration 2: `supabase/migrations/20260302000000_admin_cms_and_theme.sql` (Admin CMS tables, audit logs, RLS functions, and owner bootstrap trigger).
4. Run seed data: `supabase/seed.sql` (Initial projects, services, technologies, FAQs, and site settings).

### Super Admin First-Time Login:
1. Ensure a user exists in Supabase Auth with email `techshivendraa@gmail.com` (create via Supabase Dashboard -> Authentication -> Users if not already present).
2. Navigate to `http://localhost:3000/admin/login`.
3. Sign in with `techshivendraa@gmail.com`.
4. The server-side bootstrap hook automatically provisions your profile as active `super_admin` in `admin_users` and grants full access to the Admin CMS!

---

## 🧪 Testing & Quality Assurance

Run the automated test suite:

```bash
# Run unit & integration tests (38/38 passing across 8 test suites)
npm run test

# Run TypeScript strict compilation check (0 errors)
npm run typecheck

# Run production build (all static, SSR, and dynamic routes compiled)
npm run build
```

---

## 🌐 Production Deployment (Vercel)

1. Import the repository into [Vercel](https://vercel.com).
2. Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
3. Deploy to production.
