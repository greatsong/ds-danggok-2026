-- ============================================================
-- 당곡고 데이터 과학 팀 갤러리 — 학교 계정(Google OAuth) 인증 마이그레이션
-- ------------------------------------------------------------
-- ⚠️ 실행 전 반드시 읽어주세요
--
--   이 SQL을 실행하는 순간, 지금까지 "누구나 쓰기 가능"했던 정책이
--   사라지고 danggok.hs.kr 학교 계정으로 로그인한 사용자만 쓰기(작품 제출,
--   좋아요, 피드백)가 가능해집니다. 아직 Google 로그인 자체가 설정되지
--   않았다면, 이 SQL을 실행하는 즉시 학생 전원이 아무것도 제출할 수 없는
--   상태가 됩니다.
--
--   반드시 아래 순서를 지켜서 진행하세요. (자세한 절차는 AUTH_SETUP.md 참고)
--     ① Google Cloud Console에서 OAuth 클라이언트 생성
--     ② Supabase 대시보드 → Authentication → Providers → Google 설정 완료
--     ③ Authentication → URL Configuration에 배포 URL(및 로컬 테스트 URL) 등록
--     ④ (지금 이 파일) SQL Editor에서 실행
--     ⑤ 프런트엔드(web/gallery/) 재배포
--
--   ①~③을 먼저 끝내고 ④를 실행해야 무중단으로 전환됩니다.
-- ============================================================


-- ------------------------------------------------------------
-- 1. 제출자 이메일을 기록할 컬럼 추가
--    누가 제출/피드백했는지 서버에서 검증하고 기록하기 위한 컬럼이다.
--    이미 있으면 아무 일도 일어나지 않는다 (IF NOT EXISTS).
-- ------------------------------------------------------------
ALTER TABLE apps ADD COLUMN IF NOT EXISTS submitted_by text;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS submitted_by text;


-- ------------------------------------------------------------
-- 2. apps 테이블 — 정책 재설정
--    ⚠️ 기존 정책 이름은 프로젝트마다 다를 수 있다. 아래 DROP 구문은
--    흔히 쓰이는 이름들을 시도하도록 여러 개를 나열해뒀다. 만약 대시보드
--    (Authentication → Policies)에서 확인한 실제 이름이 다르다면, 그
--    이름으로 DROP POLICY 구문을 추가/수정한 뒤 실행하세요.
--    (DROP POLICY IF EXISTS는 이름이 없어도 오류 없이 넘어간다)
-- ------------------------------------------------------------

-- 기존의 "누구나 등록 가능" insert 정책 제거
DROP POLICY IF EXISTS "apps_insert_public" ON apps;
DROP POLICY IF EXISTS "Enable insert for everyone" ON apps;
DROP POLICY IF EXISTS "Enable insert for all users" ON apps;
DROP POLICY IF EXISTS "apps_public_insert" ON apps;

-- 새 insert 정책: 로그인(authenticated) + 학교 이메일(@danggok.hs.kr) +
-- submitted_by 위조 방지(자기 로그인 이메일과 일치해야 함)를 모두 만족해야
-- 삽입이 허용된다.
CREATE POLICY "apps_insert_school_only"
  ON apps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'email') LIKE '%@danggok.hs.kr'
    AND submitted_by = (auth.jwt() ->> 'email')
  );

-- select(읽기)는 로그인 여부와 무관하게 계속 공개 — 갤러리 구경은 누구나.
-- 기존에 select 정책이 이미 있다면 이 DROP+CREATE로 이름만 통일된다.
DROP POLICY IF EXISTS "apps_select_public" ON apps;
CREATE POLICY "apps_select_public"
  ON apps
  FOR SELECT
  TO public
  USING (true);

-- update/delete는 기존 정책대로 계속 차단(정책을 만들지 않음 = 기본 거부).


-- ------------------------------------------------------------
-- 3. feedback 테이블 — apps와 동일한 방식 적용
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "feedback_insert_public" ON feedback;
DROP POLICY IF EXISTS "Enable insert for everyone" ON feedback;
DROP POLICY IF EXISTS "Enable insert for all users" ON feedback;
DROP POLICY IF EXISTS "feedback_public_insert" ON feedback;

CREATE POLICY "feedback_insert_school_only"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'email') LIKE '%@danggok.hs.kr'
    AND submitted_by = (auth.jwt() ->> 'email')
  );

DROP POLICY IF EXISTS "feedback_select_public" ON feedback;
CREATE POLICY "feedback_select_public"
  ON feedback
  FOR SELECT
  TO public
  USING (true);


-- ------------------------------------------------------------
-- 4. increment_likes RPC — 로그인한 학교 계정만 호출 가능하도록 재정의
--    ⚠️ 함수명·파라미터명(p_app_id)·apps.id 컬럼 타입(uuid로 가정)은
--    현재 app.js가 호출하는 형태
--      supabaseClient.rpc("increment_likes", { p_app_id: appId })
--    를 기준으로 작성한 "일반형"이다. 실행 전에 Supabase 대시보드
--    (Database → Functions)에서 기존 increment_likes의 실제 파라미터
--    이름/타입과 apps.id 컬럼 타입을 확인하고, 다르면 아래 시그니처를
--    맞게 수정한 뒤 실행하세요.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_likes(p_app_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes integer;
  caller_email text;
BEGIN
  -- 호출자의 로그인 이메일을 JWT에서 꺼내 학교 도메인인지 확인한다.
  -- SECURITY DEFINER 함수라 RLS를 우회하므로, 이 검증이 곧 실질적인 보안이다.
  caller_email := auth.jwt() ->> 'email';

  IF caller_email IS NULL OR caller_email NOT LIKE '%@danggok.hs.kr' THEN
    RAISE EXCEPTION '학교 계정(@danggok.hs.kr)으로 로그인해야 좋아요를 누를 수 있어요.';
  END IF;

  UPDATE apps
  SET likes = likes + 1
  WHERE id = p_app_id
  RETURNING likes INTO new_likes;

  RETURN new_likes;
END;
$$;

-- (선택) RPC 실행 권한 자체도 로그인 사용자로 제한하고 싶다면 아래 주석을
-- 해제해서 실행하세요. 함수 내부 검증만으로도 비로그인/비학교 계정은
-- 예외가 발생해 막히지만, 실행 권한까지 좁히면 한 겹 더 방어할 수 있다.
-- REVOKE EXECUTE ON FUNCTION increment_likes(uuid) FROM public, anon;
-- GRANT EXECUTE ON FUNCTION increment_likes(uuid) TO authenticated;


-- ------------------------------------------------------------
-- 5. 실행 후 확인
-- ------------------------------------------------------------
-- Authentication → Policies에서 apps/feedback 각각에
--   - select: public, 조건 없음(누구나 읽기 가능)
--   - insert: authenticated, danggok.hs.kr + submitted_by 일치 조건
-- 두 개씩만 남아 있는지 확인하세요. update/delete 정책은 없는 상태(=거부)여야
-- 합니다. increment_likes는 Database → Functions에서 SECURITY DEFINER로
-- 표시되는지 확인하세요.
