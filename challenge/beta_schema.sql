-- ============================================================
-- 12차시 챌린지 베타 — Supabase 스키마
-- 공개 채점용 점수와 최종 채점용 점수를 함께 저장한다.
-- 최종 점수는 수업이 끝날 때 순위판에서 한 번만 공개한다.
-- SQL Editor에 전체 붙여넣고 Run. 기존 challenge_log는 그대로 둔다.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.challenge_beta (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  class_id      text not null check (class_id in ('월수금반', '화수목반')),
  team_name     text not null check (char_length(team_name) between 1 and 12),

  -- 팀이 고른 설정
  model         text not null check (char_length(model) between 1 and 30),
  features      text not null check (char_length(features) between 1 and 80),
  weighted      boolean not null,
  depth         integer not null check (depth between 0 and 15),
  threshold     numeric(4,2) not null check (threshold between 0 and 1),

  -- 공개 채점용 (지금 순위판에 쓰는 점수)
  public_sent   integer not null check (public_sent >= 0),
  public_found  integer not null check (public_found >= 0),
  public_recall numeric(6,4),
  public_f1     numeric(6,4),
  public_ok     boolean not null,

  -- 최종 채점용 (수업 끝에 한 번만 공개)
  final_sent    integer not null check (final_sent >= 0),
  final_found   integer not null check (final_found >= 0),
  final_recall  numeric(6,4),
  final_f1      numeric(6,4),
  final_ok      boolean not null
);

create index if not exists challenge_beta_class_idx   on public.challenge_beta (class_id);
create index if not exists challenge_beta_created_idx on public.challenge_beta (created_at);

alter table public.challenge_beta enable row level security;

create policy "beta_public_select" on public.challenge_beta
  for select using (true);

create policy "beta_public_insert" on public.challenge_beta
  for insert with check (true);

-- 수업이 끝난 뒤 정리할 때
--   delete from public.challenge_beta where created_at < now() - interval '7 days';
