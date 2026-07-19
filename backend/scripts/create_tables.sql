-- Thittam AI — schema. Run once in the Supabase SQL editor.
-- RLS is ON for every table with ZERO anon policies: only the backend
-- (service role key) can read/write. The frontend never touches Supabase.

create extension if not exists pgcrypto;

create table if not exists schemes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ta text not null,
  level text not null check (level in ('central', 'tn')),
  category text not null check (category in (
    'education', 'agriculture', 'women_child', 'health', 'housing',
    'employment', 'pension', 'business', 'social_security'
  )),
  benefit_en text not null,
  benefit_ta text not null,
  eligibility_rules text not null,
  min_age int,
  max_age int,
  gender text not null default 'all' check (gender in ('all', 'female', 'male')),
  states text not null default 'ALL' check (states in ('ALL', 'TN')),
  max_income int,
  social_category text not null default 'all' check (social_category in (
    'all', 'sc_st', 'obc', 'ews', 'minority'
  )),
  documents_en jsonb not null default '[]'::jsonb,
  documents_ta jsonb not null default '[]'::jsonb,
  how_to_apply_en text not null,
  how_to_apply_ta text not null,
  official_link text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_schemes_category on schemes (category);
create index if not exists idx_schemes_level on schemes (level);

create table if not exists match_requests (
  id uuid primary key default gen_random_uuid(),
  profile jsonb not null,          -- the 8 answers only; no names, no PII
  matched_ids jsonb not null default '[]'::jsonb,
  match_count int not null default 0,
  latency_ms int,
  created_at timestamptz not null default now()
);

create table if not exists chat_logs (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid references schemes (id) on delete set null,
  language text not null check (language in ('ta', 'en')),
  question text not null,
  answer text not null,
  grounded boolean not null default true,
  latency_ms int,
  created_at timestamptz not null default now()
);

-- RLS on, no policies => anon/authenticated roles get nothing.
alter table schemes enable row level security;
alter table match_requests enable row level security;
alter table chat_logs enable row level security;
