# 팀 갤러리 — 학교 계정 로그인 설정 가이드 (교사용)

이 문서는 당곡고 데이터 과학 팀 갤러리에서 "쓰기(작품 제출·좋아요·피드백)는
`@danggok.hs.kr` 학교 Google 계정 로그인 필수" 기능을 켜기 위해 **교사가
Supabase/Google 대시보드에서 직접 해야 하는 작업**을 순서대로 정리한 것입니다.
프런트엔드 코드(`web/gallery/`)와 SQL 마이그레이션(`auth_migration.sql`)은
이미 준비되어 있으며, 아래 ①~⑤ 순서를 반드시 지켜야 서비스가 중단 없이
전환됩니다.

읽기(카드 구경·필터·피드백 열람)는 이 설정과 무관하게 로그인 없이 계속
동작합니다. 아래 절차는 오직 "쓰기"에만 영향을 줍니다.

---

## 순서 요약

① Google OAuth 클라이언트 생성 → ② Supabase에 Google 로그인 연결 →
③ Supabase에 사이트 URL 등록 → ④ `auth_migration.sql` 실행 →
⑤ 프런트엔드 배포

**반드시 ①~③을 먼저 끝내고 ④를 실행하세요.** ④(SQL)를 먼저 실행하면
그 순간부터 기존의 "누구나 쓰기 가능" 정책이 사라지는데, 아직 Google
로그인이 연결되지 않은 상태라 학생이 로그인 자체를 할 수 없어 갤러리
쓰기 기능이 완전히 멈춥니다.

---

## ① Google Cloud Console에서 OAuth 클라이언트 만들기

1. https://console.cloud.google.com/ 접속 → 프로젝트 선택(또는 새로 생성)
2. **API 및 서비스 → 사용자 인증 정보(Credentials)** 이동
3. **사용자 인증 정보 만들기 → OAuth 클라이언트 ID** 선택
   - 애플리케이션 유형: **웹 애플리케이션**
   - 이름: 예) `danggok-gallery`
4. **승인된 리디렉션 URI**에 아래 주소를 정확히 추가:
   ```
   https://upkakhnpvepqhsbwdyjb.supabase.co/auth/v1/callback
   ```
5. 만들기를 누르면 **클라이언트 ID**와 **클라이언트 보안 비밀(secret)**이
   발급됩니다. 다음 단계에서 필요하니 안전한 곳에 잠깐 복사해두세요.

> OAuth 동의 화면(consent screen)을 아직 설정하지 않았다면 먼저
> 설정해야 합니다. 사용자 유형은 "외부(External)"로 두고, 테스트 단계에서는
> 게시(Publish) 전 상태로도 학교 계정 로그인을 시험해볼 수 있습니다(단,
> 테스트 사용자 목록에 등록된 계정만 로그인 가능할 수 있음 — 필요하면 앱을
> "게시" 상태로 전환하세요).

---

## ② Supabase 대시보드에서 Google 로그인 연결하기

1. https://supabase.com/dashboard 접속 → 이 프로젝트(`upkakhnpvepqhsbwdyjb`) 선택
2. 왼쪽 메뉴 **Authentication → Providers** 이동
3. 목록에서 **Google**을 찾아 활성화(Enable)
4. ①에서 발급받은 **클라이언트 ID**와 **클라이언트 보안 비밀**을 붙여넣고 저장

---

## ③ Supabase에 사이트 URL 등록하기

1. **Authentication → URL Configuration** 이동
2. **Site URL**에 배포 주소 입력:
   ```
   https://greatsong.github.io/ds-danggok-2026/gallery/
   ```
3. **Redirect URLs**에 아래 두 개를 추가:
   ```
   https://greatsong.github.io/ds-danggok-2026/gallery/
   http://localhost:4027/gallery/
   ```
   (두 번째는 교사가 로컬에서 미리 테스트할 때 쓰는 주소입니다. 로컬 테스트
   포트를 다르게 쓴다면 그 주소로 바꿔서 추가하세요.)

---

## ④ SQL 마이그레이션 실행하기

1. **SQL Editor** 이동 → 새 쿼리
2. `web/gallery/auth_migration.sql` 파일 내용을 전체 복사해서 붙여넣기
3. 파일 상단의 주의사항을 다시 한번 확인 (①~③이 끝났는지)
4. 실행(Run)

실행 후 **Authentication → Policies**에서 `apps`, `feedback` 테이블에
- select 정책: 공개(누구나) 유지
- insert 정책: `authenticated` + 학교 이메일 + `submitted_by` 일치 조건

이 있는지 확인하세요. `increment_likes` 함수는 **Database → Functions**에서
재정의됐는지 확인합니다.

> SQL 파일 안의 `DROP POLICY` 구문은 흔히 쓰는 정책 이름 몇 가지를 시도합니다.
> 만약 기존 정책 이름이 달라서 새 정책과 중복 이름 오류가 나거나 기존 정책이
> 남아 있다면, **Authentication → Policies**에서 해당 테이블의 기존 insert
> 정책 이름을 확인해 SQL의 `DROP POLICY IF EXISTS "..."` 줄에 그 이름을
> 추가한 뒤 다시 실행하세요.

---

## ⑤ 프런트엔드 배포

`web/gallery/` 이하 파일(`index.html`, `app.js`, `style.css`, `config.js`)을
평소처럼 GitHub Pages로 배포합니다. `config.js`의 키는 이미 publishable
키로 설정되어 있어 추가로 바꿀 것은 없습니다.

배포 후 실제로 학교 Google 계정으로 로그인해 다음을 확인하세요.
- 로그인 버튼 클릭 → 구글 로그인 화면 → 로그인 후 이메일이 화면에 표시되는지
- 제출 탭의 폼이 로그인 전에는 잠겨 있다가 로그인 후 활성화되는지
- 좋아요·피드백이 로그인 후에는 정상 동작하는지
- 학교 계정이 아닌 개인 Gmail로 로그인을 시도하면 즉시 로그아웃되고
  안내 문구가 뜨는지

---

## 반드시 확인할 것 — Google Workspace 관리 콘솔

학교 Google Workspace(danggok.hs.kr) 관리 콘솔에서 **서드파티 앱/타사 앱
접근이 허용**되어 있어야 학생 계정이 이 갤러리(Supabase를 경유한 Google
로그인)에 로그인할 수 있습니다. 관리 콘솔 → 보안 → API 제어 → 앱 액세스
제어에서 다음을 확인하세요.
- "타사 앱 액세스"가 전면 차단되어 있지 않은지
- 필요하다면 이 OAuth 클라이언트를 신뢰할 수 있는 앱으로 등록

이 설정은 학교 IT 담당자/관리자 권한이 필요할 수 있습니다. 막혀 있으면
학생이 로그인 화면에서 "관리자가 이 앱을 차단했습니다" 같은 오류를 보게
됩니다.

---

## 문제가 생기면

- **로그인 버튼을 눌러도 반응이 없다**: 브라우저 콘솔에서 오류를 확인하세요.
  ②(Provider 설정)가 안 되어 있으면 로그인 시도 자체가 실패합니다.
- **로그인은 되는데 바로 로그아웃되며 "학교 계정으로만 참여할 수 있어요"가
  뜬다**: 정상입니다 — 개인 Gmail 등 `@danggok.hs.kr`이 아닌 계정으로
  로그인한 경우입니다.
- **로그인 후에도 제출/좋아요/피드백이 안 된다(권한 오류)**: ④(SQL)이 아직
  실행되지 않았거나, 정책 이름이 겹쳐 새 정책이 만들어지지 않았을 수 있습니다.
  **Authentication → Policies**에서 다시 확인하세요.
- **리디렉션 후 흰 화면 또는 주소가 이상하다**: ③(Redirect URLs)에 정확한
  배포 주소가 등록되어 있는지 확인하세요. 끝의 슬래시(`/`) 유무까지
  정확히 일치해야 합니다.
