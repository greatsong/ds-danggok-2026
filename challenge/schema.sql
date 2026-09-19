-- ============================================================
-- 12차시 성능 높이기 챌린지 — Supabase 스키마
-- 갤러리와 같은 프로젝트를 사용한다. SQL Editor에 전체 붙여넣고 Run.
-- 원칙: 누구나 읽고(select) 새로 쓸(insert) 수 있지만 수정·삭제는 전면 차단.
-- 이름·학번은 받지 않는다. 별명과 반(월수금반·화수목반)만 받는다.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.challenge_log (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  class_id      text not null check (class_id in ('월수금반', '화수목반')),
  nickname      text not null check (char_length(nickname) between 1 and 12),

  -- 학생이 고른 설정
  model         text not null check (char_length(model) between 1 and 40),
  inputs        text not null check (char_length(inputs) between 1 and 80),
  missing       text not null check (missing in ('그대로 둔다', '지운다')),
  weighted      boolean not null,
  depth         integer not null check (depth between 1 and 10),
  threshold     numeric(4,2) not null check (threshold between 0 and 1),

  -- 테스트 데이터에서의 결과
  sent          integer not null check (sent >= 0),      -- 안내 인원 (TP + FP)
  found         integer not null check (found >= 0),     -- 찾아낸 환자 (TP)
  recall        numeric(6,4),
  precision     numeric(6,4),
  f1            numeric(6,4),
  within_quota  boolean not null                          -- 안내 인원이 정원 500명 이하인가
);

create index if not exists challenge_log_class_idx   on public.challenge_log (class_id);
create index if not exists challenge_log_created_idx on public.challenge_log (created_at);

alter table public.challenge_log enable row level security;

create policy "challenge_public_select" on public.challenge_log
  for select using (true);

create policy "challenge_public_insert" on public.challenge_log
  for insert with check (true);

-- 수업이 끝난 뒤 정리할 때 (SQL Editor에서 교사가 직접 실행)
--   delete from public.challenge_log where created_at < now() - interval '7 days';
