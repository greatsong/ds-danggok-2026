// 열람 게이트 — 진도가 나가지 않은 차시와 교사용 영역을 학생 화면에서 가린다.
//
// 규칙
//   · lessonNN.html  : NN > RELEASED_LESSON(release.js) 이면 잠금
//   · glossary.html  : 잠금 (전 차시 용어가 들어 있어 진도보다 앞서감)
//   · /teacher/ 이하 : 항상 잠금
//   · index.html·gallery : 열어 둔다
//
// 교사 열람
//   주소 끝에 ?teacher=<열람키> 를 붙여 한 번 열면 그 브라우저에 기억되어
//   이후로는 모든 페이지가 그냥 열린다. 해제는 ?teacher=off.
//
// 한계(정직하게 적어 둔다): 이 게이트는 브라우저 안에서만 도는 잠금이라
// 개발자 도구를 열거나 소스를 뜯어보는 학생은 우회할 수 있다. 시험 보안이
// 아니라 "진도보다 앞서 훑어보기"를 막는 용도다. 정말 감춰야 할 내용은
// 애초에 이 저장소에 올리지 않는 편이 맞다.
(function () {
  var KEY_HASH = 0xce215c56;         // 열람키의 해시 (평문은 코드에 두지 않는다)
  var STORE = 'dsdg_teacher_v1';

  function hash(s) {
    var v = 5381;
    for (var i = 0; i < s.length; i++) { v = ((v * 33) ^ s.charCodeAt(i)) >>> 0; }
    return v;
  }

  // 1) ?teacher= 처리
  var q = null;
  try { q = new URLSearchParams(location.search); } catch (e) {}
  var passed = q ? q.get('teacher') : null;
  if (passed !== null) {
    try {
      if (passed === 'off') { localStorage.removeItem(STORE); }
      else if (hash(passed) === KEY_HASH) { localStorage.setItem(STORE, String(KEY_HASH)); }
    } catch (e) {}
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
  }

  var teacher = false;
  try { teacher = localStorage.getItem(STORE) === String(KEY_HASH); } catch (e) {}
  window.__TEACHER_MODE__ = teacher;

  // 2) 이 페이지를 잠글지 판정
  var path = location.pathname;
  var released = (typeof window.RELEASED_LESSON === 'number') ? window.RELEASED_LESSON : 1;
  var m = path.match(/lesson(\d{2})\.html$/);
  var locked = false;
  if (!teacher) {
    if (path.indexOf('/teacher/') !== -1) locked = true;
    else if (/(glossary|concepts)\.html$/.test(path)) locked = released < 15; // 시험 대비 시점(15차시)에 공개
    else if (/extra-movie\.html$/.test(path)) locked = released < 4;          // 영화 심화 — 도감(4차시) 공개와 함께
    else if (/project\.html$/.test(path)) locked = released < 14;             // 팀 프로젝트 안내 — 14차시(팀 구성)와 함께
    else if (m && parseInt(m[1], 10) > released) locked = true;
  }

  // 3) 잠긴 페이지: 본문이 그려지기 전에 감추고 안내 화면으로 갈아 끼운다
  if (locked) {
    var s = document.createElement('style');
    s.textContent = 'body{visibility:hidden}';
    document.head.appendChild(s);
    document.addEventListener('DOMContentLoaded', function () {
      var toIndex = (path.indexOf('/teacher/') !== -1) ? '../index.html' : 'index.html';
      document.title = '아직 열리지 않은 페이지 · 데이터 과학 당곡고';
      document.body.innerHTML =
        '<div style="max-width:520px;margin:18vh auto;padding:0 24px;text-align:center;' +
        'font-family:system-ui,-apple-system,\'Apple SD Gothic Neo\',sans-serif;color:#334155;line-height:1.7">' +
        '<div style="font-size:56px">🔒</div>' +
        '<h1 style="font-size:20px;margin:12px 0 8px;color:#0f172a">아직 열리지 않았어요</h1>' +
        '<p style="margin:0 0 20px">이 페이지는 수업 진도에 맞춰 차례로 열립니다. 지금은 <b>1차시</b>까지 볼 수 있어요.</p>' +
        '<a href="' + toIndex + '" style="display:inline-block;padding:10px 18px;border-radius:10px;' +
        'background:#2563eb;color:#fff;text-decoration:none;font-weight:700">교재 첫 화면으로</a>' +
        '</div>';
      document.body.style.visibility = 'visible';
    });
    return;
  }

  // 4) 열린 페이지: 잠긴 차시로 가는 링크를 눌리지 않게 하고, 교사 모드면 배지를 단다
  document.addEventListener('DOMContentLoaded', function () {
    if (!teacher) {
      var links = document.querySelectorAll('a[href*="lesson"], a[href*="glossary"], a[href*="teacher/"], a[href*="extra-movie"]');
      Array.prototype.forEach.call(links, function (a) {
        var href = a.getAttribute('href') || '';
        var lm = href.match(/lesson(\d{2})\.html/);
        var blocked =
          (lm && parseInt(lm[1], 10) > released) ||
          (/(glossary|concepts)\.html/.test(href) && released < 15) ||
          (/extra-movie\.html/.test(href) && released < 4) ||
          (/project\.html/.test(href) && released < 14) ||
          /(^|\/)teacher\//.test(href);
        if (!blocked) return;
        if (a.classList.contains('linkcard')) return; // 목록 카드는 index.html이 따로 처리
        a.removeAttribute('href');
        a.setAttribute('aria-disabled', 'true');
        a.style.opacity = '0.45';
        a.style.pointerEvents = 'none';
      });
    } else {
      var b = document.createElement('div');
      b.style.cssText =
        'position:fixed;right:12px;bottom:12px;z-index:9999;background:#0f172a;color:#fff;' +
        'font:600 12px/1.4 system-ui,-apple-system,sans-serif;padding:7px 11px;border-radius:999px;' +
        'box-shadow:0 4px 14px rgba(0,0,0,.25)';
      b.innerHTML = '👩‍🏫 교사 열람 모드 <a href="?teacher=off" style="color:#93c5fd;text-decoration:none">해제</a>';
      document.body.appendChild(b);
    }
  });
})();
