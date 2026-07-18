-- ============================================================
-- 당곡고 데이터 과학 팀 갤러리 — 좋아요 "계정당 1개 + 토글" 마이그레이션
-- ------------------------------------------------------------
-- ⚠️ 실행 전 반드시 읽어주세요
--
--   1) auth_migration.sql이 먼저 적용되어 있어야 합니다.
--      (학교 계정 Google 로그인 + apps/feedback의 authenticated 전용
--       insert 정책이 이미 존재해야 이 마이그레이션의 전제가 성립합니다.)
--
--   2) 이 SQL을 실행하는 즉시 기존 increment_likes RPC가 삭제되어
--      "반복 증가" 방식은 완전히 중단됩니다. 프런트엔드(web/gallery/app.js,
--      toggle_like RPC를 호출하도록 변경된 버전)를 같은 날 함께 배포하세요.
--      순서를 지키지 않으면(SQL만 먼저 실행) 아직 구버전 앱을 쓰는 학생은
--      좋아요 버튼을 눌러도 "increment_likes 함수를 찾을 수 없음" 오류를
--      보게 됩니다.
--
--   실행 순서: SQL Editor에서 이 파일 실행 → 프런트엔드 배포 확인.
-- ============================================================


-- ------------------------------------------------------------
-- 1. app_likes 테이블 — "누가 어떤 작품에 좋아요를 눌렀는지" 1행씩 기록
--    (app_id, user_email) 조합에 unique 제약을 걸어 "계정당 1개"를
--    데이터베이스 레벨에서 보장한다. 이 제약이 곧 위조 방지의 본체다.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (app_id, user_email)
);


-- ------------------------------------------------------------
-- 2. RLS 활성화 + 정책
--    ⚠️ 이메일 프라이버시: "누가 어떤 작품을 눌렀는지"는 같은 반 친구라도
--    공개하지 않는다. select는 본인 행만 볼 수 있고, 익명(anon)에게는
--    아예 열어주지 않는다. insert/delete는 정책을 만들지 않아 직접 접근을
--    차단하고, 모든 변경은 아래 toggle_like() RPC(SECURITY DEFINER)로만
--    이뤄지게 한다.
-- ------------------------------------------------------------
ALTER TABLE app_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_likes_select_own" ON app_likes;
CREATE POLICY "app_likes_select_own"
  ON app_likes
  FOR SELECT
  TO authenticated
  USING (user_email = (auth.jwt() ->> 'email'));

-- insert/update/delete 정책은 의도적으로 만들지 않는다(=기본 거부).
-- 모든 변경은 SECURITY DEFINER 함수인 toggle_like()를 통해서만 일어난다.


-- ------------------------------------------------------------
-- 3. toggle_like(p_app_id uuid) RETURNS integer — SECURITY DEFINER
--    - 학교 계정(@danggok.hs.kr)이 아니면 예외를 던진다.
--    - 이미 좋아요를 누른 상태면 delete(취소), 아니면 insert(등록).
--    - apps.likes를 "실제 app_likes 행 개수"로 다시 계산해 갱신한다
--      (비정규화 컬럼을 유지 — 프런트엔드가 likes 컬럼으로 그대로
--      렌더링·정렬하므로 하위 호환을 위해 집계값을 계속 채워 넣는다).
--    - 갱신된 좋아요 수를 반환한다.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION toggle_like(p_app_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_email text;
  already_liked boolean;
  new_likes integer;
BEGIN
  caller_email := auth.jwt() ->> 'email';

  IF caller_email IS NULL OR caller_email NOT LIKE '%@danggok.hs.kr' THEN
    RAISE EXCEPTION '학교 계정(@danggok.hs.kr)으로 로그인해야 좋아요를 누를 수 있어요.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM app_likes
    WHERE app_id = p_app_id AND user_email = caller_email
  ) INTO already_liked;

  IF already_liked THEN
    DELETE FROM app_likes
    WHERE app_id = p_app_id AND user_email = caller_email;
  ELSE
    INSERT INTO app_likes (app_id, user_email)
    VALUES (p_app_id, caller_email);
  END IF;

  UPDATE apps
  SET likes = (SELECT count(*) FROM app_likes WHERE app_id = p_app_id)
  WHERE id = p_app_id
  RETURNING likes INTO new_likes;

  RETURN new_likes;
END;
$$;

-- 실행 권한: 로그인 사용자만 호출 가능. 익명(anon)은 명시적으로 차단한다.
GRANT EXECUTE ON FUNCTION toggle_like(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION toggle_like(uuid) FROM anon, public;


-- ------------------------------------------------------------
-- 4. 기존 increment_likes RPC 제거 — 반복 증가 구멍을 완전히 닫는다.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS increment_likes(uuid);


-- ------------------------------------------------------------
-- 5. 기존 likes 값 초기화
--    지금까지의 likes는 전부 increment_likes로 쌓인 "테스트 데이터"이고
--    app_likes 테이블은 방금 새로 만들어 비어 있는 상태다. 두 값을
--    일치시키기 위해 apps.likes를 0으로 되돌린다(= app_likes 집계와
--    동일한 상태). 이후 좋아요는 toggle_like()가 app_likes 집계로
--    다시 채워 넣으므로 정합성이 유지된다.
-- ------------------------------------------------------------
UPDATE apps SET likes = 0;


-- ------------------------------------------------------------
-- 6. 실행 후 확인
-- ------------------------------------------------------------
-- Database → Tables에서 app_likes가 생성되었는지, RLS가 켜져 있는지 확인.
-- Authentication → Policies에서 app_likes에 select(authenticated, 본인 이메일
-- 조건) 정책 1개만 있고 insert/update/delete 정책은 없는지 확인.
-- Database → Functions에서 toggle_like가 SECURITY DEFINER로 표시되고,
-- increment_likes는 더 이상 목록에 없는지 확인.
-- apps 테이블의 likes 컬럼이 전부 0인지 확인.
