-- ============================================================
-- 당곡고 데이터 과학 팀 갤러리 — Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 전체 붙여넣고 Run 하면 끝.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- 팀 작품 (apps) ----------
create table if not exists public.apps (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  class_id     text not null check (class_id in ('B', 'E')),
  assignment   text not null check (assignment in ('회귀', '분류', '군집', '팀프로젝트')),
  team_name    text not null check (char_length(team_name) between 1 and 30),
  members      text not null check (char_length(members) between 1 and 100),
  url          text not null check (url ~ '^https://'),
  description  text not null check (char_length(description) between 1 and 100),
  likes        integer not null default 0 check (likes >= 0)
);

create index if not exists apps_class_id_idx on public.apps (class_id);
create index if not exists apps_assignment_idx on public.apps (assignment);

-- ---------- 한 줄 피드백 (feedback) ----------
create table if not exists public.feedback (
  id           uuid primary key default gen_random_uuid(),
  app_id       uuid not null references public.apps (id) on delete cascade,
  created_at   timestamptz not null default now(),
  nickname     text not null check (char_length(nickname) between 1 and 16),
  content      text not null check (char_length(content) between 1 and 80)
);

create index if not exists feedback_app_id_idx on public.feedback (app_id);

-- ============================================================
-- RLS (Row Level Security)
-- 원칙: 누구나 읽고(select) 새로 쓸(insert) 수 있지만,
--       수정(update)·삭제(delete)는 전면 차단.
--       좋아요 증가만 아래 RPC 함수를 통해서만 허용.
-- ============================================================

alter table public.apps enable row level security;
alter table public.feedback enable row level security;

-- apps: 공개 조회 + 공개 등록만 허용 (update/delete 정책 없음 = 전면 차단)
create policy "apps_public_select" on public.apps
  for select using (true);

create policy "apps_public_insert" on public.apps
  for insert with check (true);

-- feedback: 공개 조회 + 공개 등록만 허용 (update/delete 정책 없음 = 전면 차단)
create policy "feedback_public_select" on public.feedback
  for select using (true);

create policy "feedback_public_insert" on public.feedback
  for insert with check (true);

-- ============================================================
-- 좋아요 증가 RPC
-- - 원자적 UPDATE 한 줄로 처리 → 동시에 여러 명이 눌러도 카운트 안전(레이스 컨디션 없음)
-- - SECURITY DEFINER: 이 함수를 만든 소유자(postgres) 권한으로 실행되어
--   apps 테이블에 update 정책이 없어도 likes 컬럼만 안전하게 증가시킬 수 있음
--   → 클라이언트는 이 함수 호출(rpc) 외에는 절대 likes를 직접 update 할 수 없음
-- ============================================================

create or replace function public.increment_likes(p_app_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  update public.apps
     set likes = likes + 1
   where id = p_app_id
  returning likes into new_likes;

  if new_likes is null then
    raise exception 'app not found: %', p_app_id;
  end if;

  return new_likes;
end;
$$;

-- anon(공개) 롤과 authenticated 롤 모두 이 함수만 실행 가능 (테이블 직접 update는 여전히 불가)
revoke all on function public.increment_likes(uuid) from public;
grant execute on function public.increment_likes(uuid) to anon, authenticated;

-- ============================================================
-- (선택) 실시간 구독을 쓰고 싶다면 아래 주석 해제
-- ============================================================
-- alter publication supabase_realtime add table public.apps;
-- alter publication supabase_realtime add table public.feedback;

-- 좋아요 위조 방지 (확실판 · 2026-07-18)
-- REVOKE 방식은 테이블 전체 INSERT 권한에 무시되므로, 트리거로 강제한다.
-- insert 시 likes 값을 무엇으로 보내든 항상 0으로 덮어씀. 증가는 increment_likes RPC로만.
create or replace function public.force_likes_zero()
returns trigger language plpgsql as $$
begin
  new.likes := 0;
  return new;
end;
$$;

drop trigger if exists trg_force_likes_zero on public.apps;
create trigger trg_force_likes_zero
  before insert on public.apps
  for each row execute function public.force_likes_zero();
