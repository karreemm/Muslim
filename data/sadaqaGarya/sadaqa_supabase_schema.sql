create table if not exists public.sadaqa_garya_records (
  id text primary key,
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  message_en text not null default '',
  message_ar text not null default '',
  delete_token_hash text,
  created_at timestamptz not null default now()
);

alter table public.sadaqa_garya_records
  add column if not exists delete_token_hash text;

create index if not exists idx_sadaqa_garya_records_slug
  on public.sadaqa_garya_records (slug);

alter table public.sadaqa_garya_records enable row level security;

revoke all on table public.sadaqa_garya_records from anon;
revoke all on table public.sadaqa_garya_records from authenticated;
