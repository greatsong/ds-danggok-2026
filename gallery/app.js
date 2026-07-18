// ============================================================
// 당곡고 데이터 과학 팀 갤러리 — app.js
// 빌드 없는 정적 SPA. config.js 에 SUPABASE_URL/KEY 가 비어 있으면
// 자동으로 데모 모드(메모리 내 샘플 데이터)로 동작한다.
// ============================================================

(function () {
  "use strict";

  // ---------------------------------------------------------
  // 0. 금지어 필터 — 한국어 비속어 기본 목록 + 쉽게 추가 가능한 배열
  //    필요하면 아래 BANNED_WORDS 배열에 단어만 추가하면 된다.
  // ---------------------------------------------------------
  const BANNED_WORDS = [
    "시발", "씨발", "씨팔", "시팔", "쓰발", "ㅅㅂ", "ㅆㅂ",
    "개새끼", "개새", "새끼", "병신", "ㅄ", "지랄", "좆", "좃",
    "존나", "존나게", "졸라", "닥쳐", "미친놈", "미친년", "쳐죽",
    "죽어", "꺼져", "걸레", "창녀", "년아", "놈아", "fuck", "shit",
    "bitch", "asshole", "damn", "faggot", "니미", "느그", "애미",
    "애비", "썅", "씹", "좇", "간나", "빙신", "새꺄", "새키",
  ];

  function findBannedWord(text) {
    if (!text) return null;
    const normalized = String(text).toLowerCase().replace(/\s+/g, "");
    for (const word of BANNED_WORDS) {
      if (normalized.includes(word.toLowerCase())) return word;
    }
    return null;
  }

  // ---------------------------------------------------------
  // 1. 모드 판별 (데모 vs 실제)
  // ---------------------------------------------------------
  const cfg = window.APP_CONFIG || {};
  const hasRealConfig = !!(cfg.SUPABASE_URL && cfg.SUPABASE_KEY &&
    cfg.SUPABASE_URL.trim() && cfg.SUPABASE_KEY.trim());

  const DEMO_MODE = !hasRealConfig;

  let supabaseClient = null;
  if (!DEMO_MODE) {
    try {
      supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
    } catch (e) {
      console.error("Supabase 클라이언트 생성 실패, 데모 모드로 대체:", e);
    }
  }
  const useSupabase = !DEMO_MODE && !!supabaseClient;

  // ---------------------------------------------------------
  // 2. 데모 데이터 (메모리 전용, 새로고침 시 초기화)
  // ---------------------------------------------------------
  let demoIdSeq = 1000;
  function nextDemoId() { return "demo-" + (demoIdSeq++); }

  const demoApps = [
    {
      id: nextDemoId(), class_id: "B", assignment: "회귀", team_name: "기온탐정단",
      members: "별사탕, 라면왕, 코딩요정", url: "https://example.com/demo-regression-seoul",
      description: "서울 기온 데이터로 8월 평균기온을 예측해봤어요", likes: 7,
      feedback: [
        { nickname: "물결", content: "그래프가 한눈에 들어와서 좋아요!" },
        { nickname: "구름빵", content: "R² 값 설명이 이해하기 쉬웠어요" },
      ],
    },
    {
      id: nextDemoId(), class_id: "B", assignment: "분류", team_name: "붓꽃수사대",
      members: "초코송이, 민트초코", url: "https://example.com/demo-classification-iris",
      description: "붓꽃 데이터로 품종을 분류하는 모델을 만들었어요", likes: 4,
      feedback: [{ nickname: "은하수", content: "혼동행렬 시각화가 인상적이에요" }],
    },
    {
      id: nextDemoId(), class_id: "E", assignment: "군집", team_name: "군집돌이들",
      members: "파도소리, 하늘색, 딸기라떼", url: "https://example.com/demo-clustering-customer",
      description: "고객 데이터를 k=4로 군집화해 유형을 나눠봤어요", likes: 11,
      feedback: [
        { nickname: "산들바람", content: "k를 4로 정한 이유 설명 좋았어요" },
        { nickname: "별똥별", content: "실루엣 점수 비교가 인상 깊었어요" },
      ],
    },
    {
      id: nextDemoId(), class_id: "E", assignment: "팀프로젝트", team_name: "데이터 놀이터",
      members: "고구마, 감자, 옥수수", url: "https://example.com/demo-team-project",
      description: "우리 학교 급식 만족도를 조사하고 분석했어요", likes: 15,
      feedback: [{ nickname: "무지개", content: "설문 설계부터 꼼꼼해서 좋아요" }],
    },
    {
      id: nextDemoId(), class_id: "B", assignment: "팀프로젝트", team_name: "픽셀단",
      members: "레몬에이드, 자몽차", url: "https://example.com/demo-team-pixel",
      description: "동네 상권 데이터로 카페 입지를 추천하는 앱이에요", likes: 3,
      feedback: [],
    },
    {
      id: nextDemoId(), class_id: "E", assignment: "회귀", team_name: "숫자요정",
      members: "바닐라라떼, 아이스티, 자두맛", url: "https://example.com/demo-regression-house",
      description: "주택 데이터로 가격을 예측하는 회귀 모델이에요", likes: 9,
      feedback: [{ nickname: "메아리", content: "이상치 처리 과정 설명이 좋아요" }],
    },
  ];

  // ---------------------------------------------------------
  // 3. 데이터 레이어 (데모 / 실제 공통 인터페이스)
  // ---------------------------------------------------------
  let appsCache = []; // 실제 모드에서 feedback을 합쳐 캐싱

  async function loadApps() {
    if (!useSupabase) {
      // 데모: likes 내림차순 정렬은 하지 않고 등록순 유지(참신함)
      appsCache = demoApps;
      return demoApps;
    }
    const { data: apps, error: appsErr } = await supabaseClient
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });
    if (appsErr) throw appsErr;

    const { data: fbRows, error: fbErr } = await supabaseClient
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: true });
    if (fbErr) throw fbErr;

    const fbByApp = {};
    (fbRows || []).forEach((row) => {
      if (!fbByApp[row.app_id]) fbByApp[row.app_id] = [];
      fbByApp[row.app_id].push({ nickname: row.nickname, content: row.content });
    });

    appsCache = (apps || []).map((a) => ({ ...a, feedback: fbByApp[a.id] || [] }));
    return appsCache;
  }

  async function insertApp(payload) {
    if (!useSupabase) {
      const newApp = {
        id: nextDemoId(),
        class_id: payload.class_id,
        assignment: payload.assignment,
        team_name: payload.team_name,
        members: payload.members,
        url: payload.url,
        description: payload.description,
        likes: 0,
        feedback: [],
      };
      demoApps.unshift(newApp);
      return newApp;
    }
    const { data, error } = await supabaseClient
      .from("apps")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    data.feedback = [];
    appsCache.unshift(data);
    return data;
  }

  async function likeApp(appId) {
    if (!useSupabase) {
      const app = demoApps.find((a) => a.id === appId);
      if (!app) throw new Error("app not found");
      app.likes += 1;
      return app.likes;
    }
    const { data, error } = await supabaseClient.rpc("increment_likes", { p_app_id: appId });
    if (error) throw error;
    const app = appsCache.find((a) => a.id === appId);
    if (app) app.likes = data;
    return data;
  }

  async function insertFeedback(appId, nickname, content) {
    if (!useSupabase) {
      const app = demoApps.find((a) => a.id === appId);
      if (!app) throw new Error("app not found");
      app.feedback.push({ nickname, content });
      return;
    }
    const { error } = await supabaseClient
      .from("feedback")
      .insert([{ app_id: appId, nickname, content }]);
    if (error) throw error;
    const app = appsCache.find((a) => a.id === appId);
    if (app) app.feedback.push({ nickname, content });
  }

  // ---------------------------------------------------------
  // 4. 좋아요 중복 방지 (같은 브라우저에서 같은 카드 재클릭 방지)
  // ---------------------------------------------------------
  const LIKED_KEY = "danggok_gallery_liked_ids";
  function getLikedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }
  function saveLiked(id) {
    const s = getLikedSet();
    s.add(id);
    try { localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------
  // 5. 상태 & 필터
  // ---------------------------------------------------------
  let filterClass = "all";
  let filterAssignment = "all";

  // ---------------------------------------------------------
  // 6. DOM 유틸
  // ---------------------------------------------------------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function isHttpsUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  // ---------------------------------------------------------
  // 7. 렌더링
  // ---------------------------------------------------------
  const gridEl = $("#galleryGrid");
  const emptyEl = $("#galleryEmpty");
  const countEl = $("#galleryCount");
  const cardTemplate = $("#cardTemplate");
  const likedSet = getLikedSet();

  function renderGallery() {
    const filtered = appsCache.filter((a) => {
      if (filterClass !== "all" && a.class_id !== filterClass) return false;
      if (filterAssignment !== "all" && a.assignment !== filterAssignment) return false;
      return true;
    });

    gridEl.innerHTML = "";
    countEl.textContent = `총 ${filtered.length}개 팀 작품`;
    emptyEl.hidden = filtered.length > 0;

    filtered.forEach((app) => {
      const node = cardTemplate.content.cloneNode(true);
      const classBadge = node.querySelector(".class-badge");
      classBadge.textContent = app.class_id + "반";
      classBadge.classList.add(app.class_id);

      node.querySelector(".assignment-badge").textContent = app.assignment;
      node.querySelector(".card-team").textContent = app.team_name;
      node.querySelector(".card-members").textContent = "팀원: " + app.members;
      node.querySelector(".card-desc").textContent = app.description;

      const goBtn = node.querySelector(".btn-go");
      goBtn.href = app.url;

      const likeBtn = node.querySelector(".btn-like");
      const likeCountEl = node.querySelector(".like-count");
      likeCountEl.textContent = app.likes;
      if (likedSet.has(app.id)) {
        likeBtn.classList.add("liked");
        likeBtn.disabled = true;
      }
      likeBtn.addEventListener("click", async () => {
        if (likedSet.has(app.id)) return;
        likeBtn.disabled = true;
        try {
          const newCount = await likeApp(app.id);
          likeCountEl.textContent = newCount;
          likeBtn.classList.add("liked");
          likedSet.add(app.id);
          saveLiked(app.id);
        } catch (e) {
          console.error(e);
          likeBtn.disabled = false;
          alert("좋아요 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
        }
      });

      const fbCountEl = node.querySelector(".fb-count");
      const fbListEl = node.querySelector(".fb-list");
      fbCountEl.textContent = `(${app.feedback.length})`;
      renderFeedbackList(fbListEl, app.feedback);

      const fbForm = node.querySelector(".fb-form");
      const fbMsg = node.querySelector(".fb-msg");
      fbForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nickInput = fbForm.querySelector(".fb-nickname");
        const contentInput = fbForm.querySelector(".fb-content");
        const nickname = nickInput.value.trim();
        const content = contentInput.value.trim();

        fbMsg.hidden = true;
        fbMsg.className = "fb-msg";

        if (!nickname || !content) {
          showFbMsg(fbMsg, "닉네임과 피드백을 모두 입력해주세요.", "error");
          return;
        }
        const banned = findBannedWord(nickname) || findBannedWord(content);
        if (banned) {
          showFbMsg(fbMsg, "부적절한 표현이 포함되어 있어 등록할 수 없어요.", "error");
          return;
        }

        const submitBtn = fbForm.querySelector("button[type=submit]");
        submitBtn.disabled = true;
        try {
          await insertFeedback(app.id, nickname, content);
          // insertFeedback()이 이미 app.feedback에 반영하므로 여기서 다시 push하지 않는다.
          fbCountEl.textContent = `(${app.feedback.length})`;
          renderFeedbackList(fbListEl, app.feedback);
          nickInput.value = "";
          contentInput.value = "";
          showFbMsg(fbMsg, "피드백을 남겼어요. 고마워요!", "ok");
        } catch (err) {
          console.error(err);
          showFbMsg(fbMsg, "등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.", "error");
        } finally {
          submitBtn.disabled = false;
        }
      });

      gridEl.appendChild(node);
    });
  }

  function showFbMsg(el, text, type) {
    el.textContent = text;
    el.hidden = false;
    el.className = "fb-msg " + type;
  }

  function renderFeedbackList(listEl, feedback) {
    listEl.innerHTML = "";
    if (!feedback.length) {
      const li = document.createElement("li");
      li.className = "fb-empty";
      li.textContent = "아직 피드백이 없어요. 첫 피드백을 남겨보세요!";
      listEl.appendChild(li);
      return;
    }
    feedback.forEach((f) => {
      const li = document.createElement("li");
      const nickSpan = document.createElement("span");
      nickSpan.className = "fb-nick";
      nickSpan.textContent = f.nickname;
      li.appendChild(nickSpan);
      li.appendChild(document.createTextNode(f.content));
      listEl.appendChild(li);
    });
  }

  // ---------------------------------------------------------
  // 8. 탭 & 필터 이벤트
  // ---------------------------------------------------------
  function initTabs() {
    $all(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        $all(".tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const view = btn.dataset.view;
        $all(".view").forEach((v) => v.classList.remove("active"));
        $("#view-" + view).classList.add("active");
      });
    });
  }

  function initFilters() {
    $all("#classFilter .chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $all("#classFilter .chip-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filterClass = btn.dataset.class;
        renderGallery();
      });
    });
    $all("#assignmentFilter .chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $all("#assignmentFilter .chip-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filterAssignment = btn.dataset.assignment;
        renderGallery();
      });
    });
  }

  // ---------------------------------------------------------
  // 9. 제출 폼
  // ---------------------------------------------------------
  function initSubmitForm() {
    const form = $("#submitForm");
    const msgEl = $("#formMsg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgEl.hidden = true;
      msgEl.className = "form-msg";

      const classId = $("#f-class").value;
      const assignment = $("#f-assignment").value;
      const teamName = $("#f-team").value.trim();
      const members = $("#f-members").value.trim();
      const url = $("#f-url").value.trim();
      const description = $("#f-desc").value.trim();
      const consent = $("#f-consent").checked;

      if (!classId || !assignment || !teamName || !members || !url || !description) {
        return showFormMsg("모든 필수 항목(*)을 입력해주세요.", "error");
      }
      if (!consent) {
        return showFormMsg("팀원 전체의 작품 공개 동의 체크가 필요해요.", "error");
      }
      if (!isHttpsUrl(url)) {
        return showFormMsg("배포 URL은 https:// 로 시작하는 올바른 주소여야 해요.", "error");
      }
      if (teamName.length > 30 || description.length > 80 || members.length > 100) {
        return showFormMsg("입력 길이가 너무 길어요. 조금 줄여주세요.", "error");
      }

      const bannedHit = findBannedWord(teamName) || findBannedWord(members) || findBannedWord(description);
      if (bannedHit) {
        return showFormMsg("팀명·팀원 닉네임·소개 중 부적절한 표현이 포함되어 있어요. 확인 후 다시 제출해주세요.", "error");
      }

      const submitBtn = form.querySelector(".btn-primary");
      submitBtn.disabled = true;
      try {
        await insertApp({
          class_id: classId,
          assignment,
          team_name: teamName,
          members,
          url,
          description,
        });
        form.reset();
        showFormMsg("게시 완료! 갤러리 탭에서 확인해보세요.", "ok");
        renderGallery();
      } catch (err) {
        console.error(err);
        showFormMsg("게시 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.", "error");
      } finally {
        submitBtn.disabled = false;
      }
    });

    function showFormMsg(text, type) {
      msgEl.textContent = text;
      msgEl.hidden = false;
      msgEl.className = "form-msg " + type;
    }
  }

  // ---------------------------------------------------------
  // 10. 모드 배지
  // ---------------------------------------------------------
  function renderModeBadge() {
    const badge = $("#modeBadge");
    if (useSupabase) {
      badge.textContent = "실제 모드 (Supabase 연동)";
      badge.classList.add("live");
    } else {
      badge.textContent = "데모 모드 (샘플 데이터)";
      badge.classList.add("demo");
    }
  }

  // ---------------------------------------------------------
  // 11. 시작
  // ---------------------------------------------------------
  async function init() {
    initTabs();
    initFilters();
    initSubmitForm();
    renderModeBadge();
    try {
      await loadApps();
    } catch (e) {
      console.error("데이터 로딩 실패:", e);
      countEl.textContent = "데이터를 불러오지 못했어요. Supabase 설정(config.js)을 확인해주세요.";
    }
    renderGallery();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
