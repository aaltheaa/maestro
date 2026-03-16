# Maestro

**AI-powered learning platform for MIT OpenCourseWare.**

Maestro turns MIT OCW's raw course pages into structured, navigable learning dashboards — with an AI tutor grounded in course materials, a discovery agent that recommends courses from your learning goals, and a roadmap that sequences everything into a coherent path.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Scraping | Playwright + Cheerio |
| Fonts | Fraunces (serif) + DM Sans |

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd maestro
npm install
```

### 2. Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) → sign up → create a new project
2. In your project dashboard go to **SQL Editor** → paste the contents of `supabase/schema.sql` → click **Run**
3. Go to **Settings → API** → copy your **Project URL** and **anon public** key

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```
ANTHROPIC_API_KEY=sk-ant-...        # Only used for /api/validate-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> **Note:** Users bring their own Anthropic API key via the in-app setup screen. `ANTHROPIC_API_KEY` in `.env.local` is only used server-side to validate keys on first login — you can use your own key for this.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first visit users will be prompted to enter their Anthropic API key, which is stored only in their browser.

---

## Project structure

```
maestro/
├── app/
│   ├── page.tsx                    # Homepage — discovery + enrolled courses
│   ├── add-course/
│   │   └── page.tsx                # 3-step course onboarding flow
│   ├── roadmap/
│   │   └── page.tsx                # Sequenced learning path
│   ├── course/
│   │   └── [slug]/
│   │       └── page.tsx            # Course dashboard (lectures, readings, assignments)
│   └── api/
│       ├── chat/route.ts           # Maestro tutor — grounded Q&A
│       ├── discover/route.ts       # Course discovery agent
│       └── parse-course/route.ts  # OCW scraper + structurer
├── components/
│   └── Nav.tsx                     # Shared navigation bar
└── lib/
    ├── types.ts                    # Shared TypeScript types
    ├── anthropic.ts                # Claude client + system prompts
    ├── ocw-parser.ts               # MIT OCW scraper (Cheerio)
    └── mock-data.ts                # Dev mock courses + roadmap
```

---

## Screen map

```
Homepage  →  Add Course (URL → parse → preview → confirm)
          →  Roadmap (sequenced courses, Maestro adjust)
          →  Course Dashboard (lectures / readings / assignments / Maestro chat)
```

---

## Key design decisions

**OCW-only.** Maestro is scoped exclusively to MIT OpenCourseWare. This keeps the data source consistent, the parsing logic simple, and the product identity clear.

**Transcript labels.** Lectures without transcripts are explicitly labeled — Maestro never hides a gap in the material.

**RAG-grounded tutor.** The Maestro chat passes the full course content as a system prompt and instructs Claude to cite outside sources explicitly when going beyond course materials.

**Mock-first dev.** All API routes fall back to mock data in development so you can build without live scraping. Swap `getMockParsedCourse` for `parseOCWCourse` in `/api/parse-course/route.ts` to go live.

---

## Production checklist

- [ ] Add a database (Supabase / Postgres) to persist user courses and progress
- [ ] Move course state from React `useState` to a database-backed store
- [ ] Enable the live OCW parser in `/api/parse-course/route.ts`
- [ ] Add auth (Clerk recommended) to scope courses per user
- [ ] Set up a background job queue (Inngest / Trigger.dev) for slow OCW scraping jobs
- [ ] Add Whisper transcription for lectures missing transcripts
- [ ] Deploy to Vercel — connect `ANTHROPIC_API_KEY` in project settings

---

## Credits

Built with [Claude](https://anthropic.com) · Course content from [MIT OpenCourseWare](https://ocw.mit.edu)
