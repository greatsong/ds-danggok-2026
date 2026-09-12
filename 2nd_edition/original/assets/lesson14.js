// 14차시 데이터 윤리 — 페이지 상호작용 (lesson14.html · lesson14-deep.html 공용)
//   ① 카드 스크롤 등장  ② 장면 2 동선 그림 재생  ③ 장면 3 되먹임 고리 단계 재생  ④ 셀프 점검 진행 바
// main.eth 가 없으면 조용히 끝난다. 다른 스크립트(quiz.js·check.js·copy.js)와 겹치는 셀렉터는 쓰지 않는다.
(function () {
  var main = document.querySelector('main.eth');
  if (!main) return;
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var hasIO = 'IntersectionObserver' in window;
  main.classList.add('l14-js');

  // ① 스크롤 등장 — 세 문제 카드 · 네 장면 카드
  var targets = [].slice.call(main.querySelectorAll('.l14-probs tbody tr, .l14-scene'));
  if (reduce || !hasIO) {
    targets.forEach(function (el) { el.classList.add('l14-reveal', 'in'); });
  } else {
    targets.forEach(function (el) { el.classList.add('l14-reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // ② 장면 2 — 위치 기록 네 점이 차례로 이어진다 (등장 시 1회 자동 재생, 그림·버튼 클릭으로 반복)
  var route = main.querySelector('.l14-route');
  if (route) {
    var rsvg = route.querySelector('svg');
    var replay = route.querySelector('.l14-replay');
    var playRoute = function () {
      route.classList.remove('play');
      void rsvg.getBoundingClientRect(); // 리플로우로 애니메이션을 처음부터 다시
      route.classList.add('play');
    };
    if (reduce) {
      if (replay) replay.hidden = true;
    } else {
      route.classList.add('l14-anim');
      if (hasIO) {
        var io2 = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { playRoute(); io2.disconnect(); } });
        }, { threshold: 0.5 });
        io2.observe(rsvg);
      } else { playRoute(); }
      rsvg.addEventListener('click', playRoute);
      rsvg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playRoute(); } });
      if (replay) replay.addEventListener('click', playRoute);
    }
  }

  // ③ 장면 3 — 네 상자가 순서대로 켜지고 화살표가 돈다 (자동 재생 + 정지, 그림·버튼 클릭으로 한 단계씩)
  var loop = main.querySelector('.l14-loop');
  if (loop) {
    var nodes = [].slice.call(loop.querySelectorAll('.l14-node'));
    var arrows = [].slice.call(loop.querySelectorAll('.l14-arrow'));
    var warn = loop.querySelector('.l14-warn');
    var core = loop.querySelector('.l14-core');
    var lsvg = loop.querySelector('svg');
    var playBtn = loop.querySelector('.l14-play');
    var stepBtn = loop.querySelector('.l14-step');
    var step = 0;      // 0 전부 꺼짐 · 1~4 ①~④까지 켜짐 · 5 고리가 닫힘(④→①)
    var timer = null;
    var userStopped = false;
    loop.classList.add('l14-anim');
    loop.classList.add('paused');

    var render = function () {
      nodes.forEach(function (n, i) {
        n.classList.toggle('on', step >= i + 1 || step === 5);
        n.classList.toggle('cur', step === i + 1 || (step === 5 && i === 0));
      });
      arrows.forEach(function (a, i) {
        // 화살표 1~3은 다음 상자가 켜질 때, 고리를 닫는 4번은 마지막 단계에서 켜진다
        a.classList.toggle('on', i < 3 ? step >= i + 2 : step === 5);
      });
      if (warn) warn.classList.toggle('on', step === 5);
      if (core) core.classList.toggle('on', step === 5);
    };
    var next = function () { step = step >= 5 ? 1 : step + 1; render(); };
    var setPlaying = function (on) {
      if (on && !timer) {
        timer = setInterval(next, 1100);
        loop.classList.remove('paused');
      } else if (!on && timer) {
        clearInterval(timer); timer = null;
        loop.classList.add('paused');
      }
      if (playBtn) playBtn.setAttribute('aria-label', timer ? '되먹임 고리 애니메이션 정지' : '되먹임 고리 애니메이션 재생');
    };
    render();
    if (playBtn) playBtn.addEventListener('click', function () {
      if (timer) { userStopped = true; setPlaying(false); }
      else { userStopped = false; if (step === 0) next(); setPlaying(true); }
    });
    var manual = function () { userStopped = true; setPlaying(false); next(); };
    if (stepBtn) stepBtn.addEventListener('click', manual);
    lsvg.addEventListener('click', manual);
    lsvg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manual(); } });
    if (!reduce && hasIO) {
      // 화면에 들어오면 자동 재생, 나가면 멈춘다(학생이 직접 멈춘 뒤에는 다시 켜지 않는다)
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { if (!userStopped) { if (step === 0) next(); setPlaying(true); } }
          else setPlaying(false);
        });
      }, { threshold: 0.35 });
      io3.observe(lsvg);
    }
  }

  // ④ 셀프 점검 — 항목을 누르면 체크, 진행 바가 차고 3/3에서 완료 배지
  var self = main.querySelector('.l14-self');
  if (self) {
    var items = [].slice.call(self.querySelectorAll('.l14-items li'));
    var bar = self.querySelector('.l14-bar i');
    var cnt = self.querySelector('.l14-cnt');
    var done = self.querySelector('.l14-done');
    var prog = self.querySelector('.l14-prog');
    var KEY = 'dsdg_l14_self_' + location.pathname;
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
    var update = function () {
      var n = 0, doneIdx = [];
      items.forEach(function (li, i) { if (li.classList.contains('done')) { n++; doneIdx.push(i); } });
      if (bar) bar.style.width = (items.length ? n / items.length * 100 : 0) + '%';
      if (cnt) cnt.textContent = n + '/' + items.length;
      if (prog) prog.setAttribute('aria-valuenow', String(n));
      var all = items.length > 0 && n === items.length;
      if (done) done.hidden = !all;
      self.classList.toggle('l14-complete', all);
      try { localStorage.setItem(KEY, JSON.stringify(doneIdx)); } catch (e) {}
    };
    items.forEach(function (li, i) {
      if (saved.indexOf(i) !== -1) li.classList.add('done');
      li.setAttribute('role', 'checkbox');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-checked', li.classList.contains('done') ? 'true' : 'false');
      var toggle = function () {
        li.classList.toggle('done');
        li.setAttribute('aria-checked', li.classList.contains('done') ? 'true' : 'false');
        update();
      };
      li.addEventListener('click', toggle);
      li.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
    });
    update();
  }

  // 인쇄: 접힌 상자를 열어 내용을 전부 보이고, 끝나면 원래대로
  var opened = [];
  window.addEventListener('beforeprint', function () {
    opened = [];
    main.querySelectorAll('details:not([open])').forEach(function (d) { d.open = true; opened.push(d); });
  });
  window.addEventListener('afterprint', function () {
    opened.forEach(function (d) { d.open = false; });
    opened = [];
  });
})();
