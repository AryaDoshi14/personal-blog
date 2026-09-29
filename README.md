# શ્રીજી બાબાની કૃપા (Shreeji Baba Ni Krupa)
### A Production-Quality, Mobile-First Gujarati Devotional & Blog Platform

A devotional web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth & Storage)**. Designed faithfully according to traditional Gujarati Vaishnav heritage aesthetics featuring warm ivory/cream tones, deep maroon/burgundy (`#501518`), muted gold, delicate floral & lotus motifs, and authentic Gujarati typography (`Noto Serif Gujarati` & `Noto Sans Gujarati`).

---

## Features

- **Mobile-First Responsive Design**: Tailored for smartphones, tablets, and desktop displays with smooth navigation drawers and fluid typography.
- **Bilingual Support (Gujarati Default + English Secondary)**: URL-based routing (`/gu` and `/en`) with graceful fallbacks.
- **Dynamic Content (`site_settings` & `prayers`)**: Texts, hero headings, mantras, and tradition narratives are database-driven and admin-editable.
- **Dedicated Public Pages**:
  - **Homepage (`/[lang]`)**: Hero with Shrinathji portrait & dual CTAs, Sacred Prayers with circular medallions, Tradition haveli section, and 4-card Blog grid.
  - **Blog Listing (`/[lang]/blog`)**: Instant category filter tabs, live search bar, and responsive article grid.
  - **Article Detail (`/[lang]/blog/[slug]`)**: Sanitized rich-text rendering (`isomorphic-dompurify`), cover image, category badge, date, tags, and related articles.
  - **Prayers Index (`/[lang]/prayers`)** & **Detail (`/[lang]/prayers/[slug]`)**: Sacred recitation lyrics in Gujarati script with English translations.
  - **Tradition Page (`/[lang]/tradition`)**: In-depth history of Vaishnav Vaniya Samaj and Pushtimarg principles.
  - **Contact Page (`/[lang]/contact`)**: Contact details + interactive message form saving to `messages` table.
- **Default Assets in `public/images/defaults/`**: High-fidelity devotional illustrations for instant out-of-the-box presentation.

---

## Supabase Setup Guide

Follow these steps to connect your own Supabase project:

### 1. Create a Supabase Project
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**, select your organization, name your project (e.g. `shreeji-bawa-blog`), set a database password, and choose a region.

### 2. Run the Schema (Fresh Installs vs Upgrades)
- **Fresh Installs (`supabase/schema.sql`)**: In your Supabase project dashboard, open the **SQL Editor**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**. This sets up the complete database schema from scratch including all tables, views (`public_profiles`), functions (`get_approved_comments`), RLS policies, and storage bucket definitions.
- **Upgrades & Existing Deployments (`supabase/migrations/`)**: If upgrading an existing deployment, execute the timestamped migration files in [`supabase/migrations/`](supabase/migrations/) sequentially in chronological order. Each migration is idempotent and applies specific structural or security enhancements (e.g. locking rate limits and safeguarding public profile data).

### 3. Run the Seed Data
1. In the **SQL Editor**, open another query, paste the contents of [`supabase/seed.sql`](supabase/seed.sql), and click **Run**.
2. This pre-populates:
   - Default Categories (ભક્તિ અને સાધના, પુષ્ટિમાર્ગીય સંસ્કાર, etc.)
   - 3 Sacred Prayers (અધરમ મધુરમ, શ્રી ચિંતામણિ પ્રાર્થના, યમુનાષ્ટકમ)
   - 4 Featured Articles with complete Gujarati and English text
   - Configurable Site Settings (Headings, Taglines, Tradition text, Contact details)

### 4. Create the First Admin User
1. In Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Enter your admin email and a secure password.
4. Once created, run this SQL query in the **SQL Editor** to grant admin privileges:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-admin@email.com';
   ```
5. *(Optional)* Under **Authentication** -> **Providers** -> **Email**, disable "Enable Sign up" so public visitors cannot register.

### 5. Configure Local Environment Variables
Create a file named `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
- Find your `API URL` and `anon key` in **Project Settings** -> **API**.
- The `SUPABASE_SERVICE_ROLE_KEY` is kept server-side only and never exposed to the client browser.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## Project Structure

```
├── app/
│   ├── [lang]/              # Bilingual dynamic routing (/gu, /en)
│   │   ├── blog/            # Blog archive & article detail pages
│   │   ├── prayers/         # Sacred prayers index & recitation pages
│   │   ├── tradition/       # Tradition & heritage narrative
│   │   ├── contact/         # Contact info & interactive form
│   │   ├── layout.tsx       # Language layout with Header & Footer
│   │   └── page.tsx         # Homepage matching visual reference
│   ├── fonts.ts             # Google Fonts (Noto Serif/Sans Gujarati)
│   ├── globals.css          # Devotional theme tokens & utilities
│   ├── layout.tsx           # Root HTML layout
│   └── page.tsx             # Redirects / -> /gu
├── components/
│   ├── blog/                # BlogCard, BlogSection, BlogListClient
│   ├── contact/             # ContactForm
│   ├── footer/              # Deep maroon footer with social links
│   ├── header/              # Header, MobileMenu, LanguageSwitcher
│   ├── hero/                # Shrinathji hero section with CTAs
│   ├── prayers/             # PrayerCard, PrayerSection
│   ├── tradition/           # TraditionSection
│   └── ui/                  # OrnamentalDivider, MedallionIcon, etc.
├── lib/
│   ├── data/defaults.ts     # Fallback default seed content
│   ├── db/index.ts          # Unified data access layer
│   └── supabase/            # Client, Server, and Admin instances
├── public/images/defaults/  # Devotional artwork & SVG icons
├── supabase/
│   ├── schema.sql           # Complete PostgreSQL schema & RLS
│   └── seed.sql             # Rich initial Gujarati seed data
└── types/index.ts           # TypeScript type definitions
```
