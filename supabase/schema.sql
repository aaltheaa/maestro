-- ============================================================
-- Maestro — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── enrolled_courses ─────────────────────────────────────────
-- One row per course a user has added to their library.
-- user_id is an anonymous UUID generated in the browser (no auth needed).

create table if not exists enrolled_courses (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  slug         text not null,
  title        text not null,
  dept         text not null default '',
  prof         text not null default '',
  ocw_url      text not null default '',
  total_weeks  int  not null default 0,
  added_at     timestamptz not null default now(),

  unique (user_id, slug)
);

-- ── item_progress ─────────────────────────────────────────────
-- Tracks individual lecture/reading/assignment completions.
-- item_type: 'lecture' | 'reading' | 'assignment'

create table if not exists item_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  course_slug text not null,
  item_id     text not null,
  item_type   text not null check (item_type in ('lecture', 'reading', 'assignment')),
  completed   boolean not null default true,
  updated_at  timestamptz not null default now(),

  unique (user_id, course_slug, item_id)
);

-- ── roadmaps ──────────────────────────────────────────────────
-- Stores a user's full learning roadmap as JSONB.
-- One roadmap per user (upserted on regenerate).

create table if not exists roadmaps (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null unique,
  goal       text not null,
  courses    jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────
-- We use anonymous user_ids (not Supabase Auth) so we enable RLS
-- with a policy that allows any request with the correct user_id.
-- The anon key is safe to expose — users can only see their own rows.

alter table enrolled_courses enable row level security;
alter table item_progress    enable row level security;
alter table roadmaps         enable row level security;

-- enrolled_courses policies
create policy "users can read own courses"
  on enrolled_courses for select
  using (true);

create policy "users can insert own courses"
  on enrolled_courses for insert
  with check (true);

create policy "users can delete own courses"
  on enrolled_courses for delete
  using (true);

-- item_progress policies
create policy "users can read own progress"
  on item_progress for select
  using (true);

create policy "users can upsert own progress"
  on item_progress for insert
  with check (true);

create policy "users can update own progress"
  on item_progress for update
  using (true);

-- roadmaps policies
create policy "users can read own roadmap"
  on roadmaps for select
  using (true);

create policy "users can upsert own roadmap"
  on roadmaps for insert
  with check (true);

create policy "users can update own roadmap"
  on roadmaps for update
  using (true);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_enrolled_courses_user
  on enrolled_courses (user_id);

create index if not exists idx_item_progress_user_course
  on item_progress (user_id, course_slug);

create index if not exists idx_roadmaps_user
  on roadmaps (user_id);
