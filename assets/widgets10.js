// 10차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson10.html)와 교재(lesson10.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"HAND":{"A":{"label":"활동지 기본 문제 · 모델 A (영화 20편)","pos":"성공","neg":"실패","tp":6,"fp":6,"fn":2,"tn":6},"B":{"label":"활동지 기본 문제 · 모델 B (영화 20편)","pos":"성공","neg":"실패","tp":4,"fp":1,"fn":4,"tn":11},"all":{"label":"활동지 기본 문제 · 전부 성공이라고 예측 (기준)","pos":"성공","neg":"실패","tp":8,"fp":12,"fn":0,"tn":0}},"T66":[[0.6923,1],[0.4919,0],[0.3801,0],[0.371,0],[0.2568,0],[0.2556,0],[0.2467,0],[0.2368,1],[0.2173,0],[0.2167,0],[0.2146,0],[0.1805,0],[0.1631,0],[0.1323,0],[0.1322,0],[0.1263,0],[0.1251,0],[0.1095,0],[0.081,0],[0.0688,1],[0.0683,0],[0.0683,0],[0.0654,0],[0.0643,0],[0.0612,1],[0.0608,0],[0.0559,0],[0.0534,0],[0.0504,0],[0.0497,0],[0.0481,0],[0.0475,0],[0.0468,0],[0.0464,0],[0.0427,0],[0.0397,1],[0.0391,0],[0.0387,0],[0.0323,0],[0.0312,0],[0.0236,1],[0.0235,0],[0.0227,0],[0.0226,0],[0.0198,0],[0.0186,0],[0.0184,0],[0.0178,0],[0.0171,0],[0.0169,0],[0.0152,0],[0.0152,0],[0.0115,0],[0.0115,0],[0.0102,0],[0.0099,0],[0.0073,0],[0.0072,0],[0.0068,0],[0.0067,0],[0.0067,0],[0.006,0],[0.0031,0],[0.0027,0],[0.0019,0],[0.001,0]],"titles":["연지구 디 오리지널 4K","줄무늬 파자마를 입은 소년","석류의 빛깔","만남의 집","전력질주","슈가","얼굴","나혼자 프린스","어쩔수가없다","세계의 주인","신의악단","내 이름은","나쁜계집애: 달려라 하니","우리에게는 아직 내일이 있다","블루 아카이브 : 디 오케스트라 인 시네마","다이 마이 러브","센티멘탈 밸류","끝이 없는 스칼렛","하우스메이드","바다 탐험대 옥토넛 어보브 앤 비욘드 : 육지생물 구조작전","우리는 매일매일","프레디의 피자가게 2","트론: 아레스","여행과 나날","호퍼스","부고니아","아바타: 불과 재","바다 탐험대 옥토넛 어보브 앤 비욘드 : 콰지의 깜짝 어드벤처","건국전쟁2","명탐정 코난: 17년 전의 진상","8번 출구","2016 방탄소년단 라이브 화양연화 온 스테이지 : 에필로그 리마스터링","극장판 주술회전: 회옥·옥절","아르코","원 인 어 밀리언","만달로리안과 그로구","극장판 똘똘이: 아기공룡의 비밀","척의 일생","후지모토 타츠키 17-26 파트 2","에이티즈 에이 투 지 온 스크린","신세기 에반게리온 극장판 사도신생","케이팝 데몬 헌터스","시라트","파더 마더 시스터 브라더","초속 5센티미터","악마는 프라다를 입는다 2","화양연화 특별판","모아나","슬라이드 스트럼 뮤트","시크릿 에이전트","짝사랑 세계","미니언즈 & 몬스터즈","폭탄","명탐정 코난: 세기말의 마술사","오피셜히게단디즘 라이브 앳 스타디움 2025","노멀","런닝맨: 라이트&쉐도우","극장판 반짝반짝 달님이: 싱어롱 파티","고트: 더 레전드","모탈 컴뱃 2","사랑의 하츄핑 특별판","너바나 더 밴드 : 전설적 밴드 ‘너바나’와는 별 관련 없는 ‘너바나 더 밴드’의 콤비 맷과 제이. 어느 날 공연을 위해 타임머신을 만드는 황당한 작전을 세우고 처음 만났던 17년 전으로 돌","리마인더스 오브 힘","극장판 도라에몽: 신 진구의 해저비밀성","그린랜드 2: 마이그레이션","정동원 팬콘서트 필름 : 다시 만나는 길"],"y":"000000101010000000000000001000000000000000000101000000000000000000","p":{"logit":"000000000000000000000000001000000000000000000000000000000000000000","tree":"000000000000000000000000001000000000000000000001000000000000000000","week":"000000001000000000000000001000000000000000000100000000000000000000"}};
function initW_matrix(root, D) {
  // 혼동행렬 네 칸 + 정확도·정밀도·재현율. 분자는 TP 한 칸에 고정, 분모 범위만 열↔행으로 갈라진다.
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var numAttr = function (el, a) { return Number(el.getAttribute(a)) || 0; };
  var view = root.ownerDocument.defaultView;
  var raf = view && view.requestAnimationFrame ? view.requestAnimationFrame.bind(view) : null;

  // 지표별 분모 범위(테두리)
  var DEN = {
    acc: { x: 150, y: 46, w: 288, h: 124 },
    prec: { x: 150, y: 46, w: 144, h: 124 },
    rec: { x: 150, y: 46, w: 288, h: 62 }
  };
  var FORM = {
    acc: function (c) { return { num: c.tp + c.tn, den: c.tp + c.fp + c.fn + c.tn }; },
    prec: function (c) { return { num: c.tp, den: c.tp + c.fp }; },
    rec: function (c) { return { num: c.tp, den: c.tp + c.fn }; }
  };

  var caseBtns = qa('.wbtn[data-case]');
  var mBtns = qa('.wbtn[data-m]');
  var revealBtn = q('.wbtn[data-act="reveal"]');
  var den = q('.mx-den');
  var numTn = q('.mx-num[data-k="tn"]');
  var caseLab = q('.mx-case');
  var capLine = q('.mx-cap');
  var cells = { tp: q('.mx-v[data-k="tp"]'), fn: q('.mx-v[data-k="fn"]'), fp: q('.mx-v[data-k="fp"]'), tn: q('.mx-v[data-k="tn"]') };
  var heads = [q('.mx-h[data-k="0"]'), q('.mx-h[data-k="1"]')];
  var rows = [q('.mx-r[data-k="0"]'), q('.mx-r[data-k="1"]')];
  var rowSum = [q('.mx-rs[data-k="0"]'), q('.mx-rs[data-k="1"]')];
  var colSum = [q('.mx-cs[data-k="0"]'), q('.mx-cs[data-k="1"]')];
  var groups = {};
  qa('.mx-m').forEach(function (g) { groups[g.getAttribute('data-m')] = g; });

  var cur = 'A', metric = 'prec', shown = false;
  var denToken = 0, barToken = 0;

  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  function tween(ms, step) {
    if (!raf) { step(1); return; }
    var t0 = null;
    var run = function (ts) {
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / ms);
      step(ease(t));
      if (t < 1) raf(run);
    };
    raf(run);
  }

  function moveDen(to) {
    // 출발점은 목표가 아니라 사각의 현재 좌표다. 애니메이션 도중 다른 지표를 눌러도 튀지 않는다.
    var from = { x: numAttr(den, 'x'), y: numAttr(den, 'y'), w: numAttr(den, 'width'), h: numAttr(den, 'height') };
    var id = ++denToken;
    tween(220, function (k) {
      if (id !== denToken) return;
      den.setAttribute('x', (from.x + (to.x - from.x) * k).toFixed(1));
      den.setAttribute('y', (from.y + (to.y - from.y) * k).toFixed(1));
      den.setAttribute('width', (from.w + (to.w - from.w) * k).toFixed(1));
      den.setAttribute('height', (from.h + (to.h - from.h) * k).toFixed(1));
    });
  }

  function moveBars(target) {
    var id = ++barToken;
    var keys = ['acc', 'prec', 'rec'];
    var start = {};
    keys.forEach(function (k) { start[k] = numAttr(groups[k].querySelector('.mx-bar'), 'width'); });
    tween(260, function (t) {
      if (id !== barToken) return;
      keys.forEach(function (k) {
        var w = start[k] + (target[k] - start[k]) * t;
        groups[k].querySelector('.mx-bar').setAttribute('width', Math.max(0, w).toFixed(1));
      });
    });
  }

  function draw(animate) {
    var c = D.HAND[cur];
    var total = c.tp + c.fp + c.fn + c.tn;
    caseLab.textContent = c.label;
    heads[0].textContent = '예측: ' + c.pos;
    heads[1].textContent = '예측: ' + c.neg;
    rows[0].textContent = '실제: ' + c.pos;
    rows[1].textContent = '실제: ' + c.neg;
    rowSum[0].textContent = '합계 ' + (c.tp + c.fn);
    rowSum[1].textContent = '합계 ' + (c.fp + c.tn);
    colSum[0].textContent = '합계 ' + (c.tp + c.fp);
    colSum[1].textContent = '합계 ' + (c.fn + c.tn);
    cells.tp.textContent = c.tp;
    cells.fn.textContent = c.fn;
    cells.fp.textContent = c.fp;
    cells.tn.textContent = c.tn;

    numTn.setAttribute('opacity', metric === 'acc' ? '1' : '0');
    if (animate) moveDen(DEN[metric]);
    else {
      denToken++;
      var d = DEN[metric];
      den.setAttribute('x', d.x); den.setAttribute('y', d.y);
      den.setAttribute('width', d.w); den.setAttribute('height', d.h);
    }

    var bars = {};
    ['acc', 'prec', 'rec'].forEach(function (k) {
      var g = groups[k];
      var f = FORM[k](c);
      var ok = f.den > 0;
      var v = ok ? f.num / f.den : 0;
      g.setAttribute('opacity', k === metric ? '1' : '0.45');
      g.querySelector('.mx-sub').textContent = '= ' + (shown ? f.num : '?') + ' ÷ ' + f.den;
      var val = g.querySelector('.mx-val');
      if (!ok) { val.textContent = '계산 불가'; val.setAttribute('font-size', '14'); val.setAttribute('fill', '#9a8b6a'); }
      else { val.textContent = shown ? v.toFixed(3) : '?'; val.setAttribute('font-size', '20'); val.setAttribute('fill', '#b07a00'); }
      bars[k] = (shown && ok) ? v * 238 : 0;
    });
    if (animate) moveBars(bars);
    else { barToken++; ['acc', 'prec', 'rec'].forEach(function (k) { groups[k].querySelector('.mx-bar').setAttribute('width', bars[k].toFixed(1)); }); }

    if (metric === 'prec') capLine.textContent = '분자 TP ' + c.tp + ' · 분모 예측 ' + c.pos + ' ' + (c.tp + c.fp);
    else if (metric === 'rec') capLine.textContent = '분자 TP ' + c.tp + ' · 분모 실제 ' + c.pos + ' ' + (c.tp + c.fn);
    else capLine.textContent = '분자 TP+TN ' + (c.tp + c.tn) + ' · 분모 전체 ' + total;

    caseBtns.forEach(function (b) { var on = b.getAttribute('data-case') === cur; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    mBtns.forEach(function (b) { var on = b.getAttribute('data-m') === metric; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    revealBtn.textContent = shown ? '값 가리기' : '값 확인';
    revealBtn.classList.toggle('on', shown);
    revealBtn.setAttribute('aria-pressed', shown ? 'true' : 'false');
  }

  caseBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-case');
      if (k === cur) return;
      cur = k; shown = false;    // 사례를 바꾸면 손계산이 먼저이므로 값은 다시 가린다
      draw(true);
    });
  });
  mBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-m');
      if (k === metric) return;
      metric = k;
      draw(true);
    });
  });
  revealBtn.addEventListener('click', function () { shown = !shown; draw(true); });

  draw(false);
}

function initW_threshold(root, D) {
  // 시험용 66편 [확률, 실제라벨] — 확률 내림차순. 순위 등간격 축.
  var T = D.T66, N = T.length, X0 = 36, X1 = 700, STEP = 10.06, W = 230;
  var P = [], POS = 0, i;
  for (i = 0; i < N; i++) { P.push(Math.round(T[i][0] * 10000)); if (T[i][1] === 1) POS++; }
  var NEG = N - POS, BASE = NEG / N;

  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  // ── 색 ──
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function css(a, o) { return 'rgb(' + Math.round(a[o]) + ',' + Math.round(a[o + 1]) + ',' + Math.round(a[o + 2]) + ')'; }
  var GREEN = hex('#54a24b'), RED = hex('#e45756'), TEAL = hex('#3ba6a0'), WHITE = hex('#ffffff');
  var ST = {
    tp: GREEN.concat(GREEN, [0]),
    fp: RED.concat(RED, [0]),
    fn: WHITE.concat(RED, [1.6]),
    tn: WHITE.concat(TEAL, [1.6])
  };
  var CARD_OFF = hex('#f0e2bc').concat([1]), CARD_ON = hex('#e8930c').concat([2]);

  // ── 시간 기반 트윈(재클릭에 견딤, 반복·자동 재생 없음) ──
  var CH = [], raf = 0;
  function chan(dur, init, ap) {
    var c = { dur: dur, from: init.slice(), to: init.slice(), cv: init.slice(), t0: -1, done: true, ap: ap };
    CH.push(c); return c;
  }
  function jump(c, v) {
    c.from = v.slice(); c.to = v.slice(); c.cv = v.slice(); c.t0 = -1; c.done = true; c.ap(c.cv);
  }
  function aim(c, v) {
    var same = true, j;
    for (j = 0; j < v.length; j++) if (v[j] !== c.to[j]) same = false;
    if (same) return;
    c.from = c.cv.slice(); c.to = v.slice(); c.t0 = -1; c.done = false;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop(now) {
    var busy = false, j, m, c, p, e;
    for (j = 0; j < CH.length; j++) {
      c = CH[j];
      if (c.done) continue;
      if (c.t0 < 0) c.t0 = now;
      p = (now - c.t0) / c.dur;
      if (p >= 1) { p = 1; c.done = true; } else busy = true;
      e = 1 - Math.pow(1 - p, 3);
      for (m = 0; m < c.cv.length; m++) c.cv[m] = c.from[m] + (c.to[m] - c.from[m]) * e;
      c.ap(c.cv);
    }
    raf = busy ? requestAnimationFrame(loop) : 0;
  }

  // ── ① 띠그림 점 66개 ──
  var dotsG = q('.dots'), frag = '', cx;
  for (i = 0; i < N; i++) {
    cx = X0 + (i + 0.5) * STEP;
    frag += '<circle cx="' + cx.toFixed(2) + '" cy="' + (T[i][1] === 1 ? 64 : 116) +
      '" r="4.2" fill="#ffffff" stroke="#3ba6a0" stroke-width="1.6"/>';
  }
  dotsG.innerHTML = frag;
  var dotEls = qa('.dots circle'), dotCh = [];
  for (i = 0; i < N; i++) dotCh.push(chan(150, ST.tn.slice(), (function (el) {
    return function (v) {
      el.setAttribute('fill', css(v, 0));
      el.setAttribute('stroke', css(v, 3));
      el.setAttribute('stroke-width', v[6].toFixed(2));
    };
  })(dotEls[i])));

  // ── 축 눈금(순위 1·10·20·30·40·50·60) ──
  var TICK = [1, 10, 20, 30, 40, 50, 60], NARROW = [1, 20, 40, 60], tf = '', tx, tp;
  for (i = 0; i < TICK.length; i++) {
    tx = X0 + (TICK[i] - 0.5) * STEP; tp = T[TICK[i] - 1][0];
    tf += '<line x1="' + tx.toFixed(2) + '" y1="134" x2="' + tx.toFixed(2) + '" y2="139" stroke="#b9b3a5" stroke-width="1.2"/>';
    tf += '<text class="tlab" data-rank="' + TICK[i] + '" x="' + tx.toFixed(2) +
      '" y="156" text-anchor="middle" font-size="14" fill="#6b7385">' +
      (tp >= 0.01 ? tp.toFixed(2) : tp.toFixed(3)) + '</text>';
  }
  q('.ticks').innerHTML = tf;

  // ── 좁은 폭에서 눈금 라벨 축소(순위 1·20·40·60만) ──
  var narrow = null;
  function fitWidth() {
    var w = root.clientWidth, nw = w > 0 && w < 520, labs, j, r;
    if (nw === narrow) return;
    narrow = nw; labs = qa('.tlab');
    for (j = 0; j < labs.length; j++) {
      r = Number(labs[j].getAttribute('data-rank'));
      labs[j].setAttribute('opacity', (!narrow || NARROW.indexOf(r) >= 0) ? '1' : '0');
    }
  }

  // ── 글자 폭 어림(한글 1.0em, 숫자·기호 0.55em, 공백 0.3em) ──
  function tw(s, fs) {
    var w = 0, j, c;
    for (j = 0; j < s.length; j++) {
      c = s.charCodeAt(j);
      w += (c === 32) ? fs * 0.3 : (c > 4352 ? fs : fs * 0.55);
    }
    return w;
  }

  // ── 계산: 확률·문턱값을 정수 1/10000 단위로 비교 ──
  function calc(Ti) {
    var tp = 0, fp = 0, fn = 0, tn = 0, j, pred, y;
    for (j = 0; j < N; j++) {
      pred = P[j] >= Ti; y = T[j][1] === 1;
      if (pred && y) tp++; else if (pred && !y) fp++; else if (!pred && y) fn++; else tn++;
    }
    return {
      ok: (tp + fp + fn + tn) === N, tp: tp, fp: fp, fn: fn, tn: tn, k: tp + fp,
      acc: (tp + tn) / N, prec: (tp + fp) > 0 ? tp / (tp + fp) : null, rec: tp / POS
    };
  }

  // ── 요소 ──
  var thline = q('.thline'), thlab = q('.thlab'), zleft = q('.zleft'), zright = q('.zright');
  var nEl = { tp: q('.nTP'), fp: q('.nFP'), fn: q('.nFN'), tn: q('.nTN') };
  var vEl = [q('.val0'), q('.val1'), q('.val2')];
  var blab = q('.blab'), out = q('.wout'), slider = q('.thr');
  var cTxt = [q('.c0txt'), q('.c1txt')];
  var snap = qa('.wbtn[data-th]'), recBtn = qa('.wbtn[data-slot]'), clr = q('.wbtn[data-act="clear"]');

  function barAp(el) { return function (v) { el.setAttribute('width', Math.max(0, v[0]).toFixed(2)); }; }
  function cardAp(el) { return function (v) { el.setAttribute('stroke', css(v, 0)); el.setAttribute('stroke-width', v[3].toFixed(2)); }; }
  var barCh = [chan(260, [0], barAp(q('.bar0'))), chan(260, [0], barAp(q('.bar1'))), chan(260, [0], barAp(q('.bar2')))];
  var blineCh = chan(220, [1.2], (function (el) { return function (v) { el.setAttribute('stroke-width', v[0].toFixed(2)); }; })(q('.bline')));
  var cardCh = [chan(260, CARD_OFF.slice(), cardAp(q('.card0'))), chan(260, CARD_OFF.slice(), cardAp(q('.card1')))];

  // ── 상태: 정수 문턱값(×10000)과 기록 슬롯 두 개 ──
  var cur = 5000, rec = { inv: null, scout: null };
  function f2(t) { return (t / 10000).toFixed(2); }
  function pTxt(v) { return v === null ? '계산 불가' : v.toFixed(3); }
  function cardTxt(r) {
    return r ? '문턱값 ' + f2(r.t) + ' · 정밀도 ' + pTxt(r.prec) + ' · 재현율 ' + r.rec.toFixed(3) : '미기록';
  }

  function render(instant) {
    var m = calc(cur), j, st, put = instant ? jump : aim;
    if (!m.ok) return;

    for (j = 0; j < N; j++) {
      st = (P[j] >= cur) ? (T[j][1] === 1 ? ST.tp : ST.fp) : (T[j][1] === 1 ? ST.fn : ST.tn);
      put(dotCh[j], st);
    }

    // 문턱선
    var lx = X0 + m.k * STEP, s = lx.toFixed(2);
    thline.setAttribute('x1', s); thline.setAttribute('x2', s);

    // 문턱선 라벨을 먼저 배치하고 남은 폭으로 구역 라벨 판정
    var txt = '문턱값 ' + f2(cur), w = tw(txt, 14), tl, tr, ax, px;
    if (lx < 100) { ax = 'start'; px = lx + 6; tl = px; tr = px + w; }
    else if (lx > 620) { ax = 'end'; px = lx - 6; tr = px; tl = px - w; }
    else { ax = 'middle'; px = lx; tl = px - w / 2; tr = px + w / 2; }
    thlab.textContent = txt;
    thlab.setAttribute('x', px.toFixed(2));
    thlab.setAttribute('text-anchor', ax);

    var lw = tw('← 성공 예측', 14), rw = tw('기준 미달 예측 →', 14);
    var le = Math.min(lx - 10, tl - 10), rs = Math.max(lx + 10, tr + 10);
    var showL = (lx - X0) >= 100 && (le - lw) >= X0;
    var showR = (X1 - lx) >= 130 && (rs + rw) <= X1;
    zleft.setAttribute('opacity', showL ? '1' : '0');
    if (showL) zleft.setAttribute('x', le.toFixed(2));
    zright.setAttribute('opacity', showR ? '1' : '0');
    if (showR) zright.setAttribute('x', rs.toFixed(2));

    // 혼동행렬
    nEl.tp.textContent = m.tp; nEl.fp.textContent = m.fp;
    nEl.fn.textContent = m.fn; nEl.tn.textContent = m.tn;

    // 지표
    var vals = [m.acc, m.prec, m.rec];
    for (j = 0; j < 3; j++) {
      if (vals[j] === null) {
        vEl[j].textContent = '계산 불가';
        vEl[j].setAttribute('font-size', '14'); vEl[j].setAttribute('fill', '#9a8b6a');
      } else {
        vEl[j].textContent = vals[j].toFixed(3);
        vEl[j].setAttribute('font-size', '20'); vEl[j].setAttribute('fill', '#b07a00');
      }
      put(barCh[j], [(vals[j] === null ? 0 : vals[j]) * W]);
    }

    // 기준 모델 점선 — 정수 비교로 판정
    var same = (m.tp + m.tn) === NEG;
    put(blineCh, [same ? 2 : 1.2]);
    blab.textContent = same ? '기준 모델과 동일' : '기준 모델 ' + BASE.toFixed(3);

    // 기록 카드
    var split = !!(rec.inv && rec.scout && rec.inv.t !== rec.scout.t);
    cTxt[0].textContent = cardTxt(rec.inv);
    cTxt[1].textContent = cardTxt(rec.scout);
    put(cardCh[0], split ? CARD_ON : CARD_OFF);
    put(cardCh[1], split ? CARD_ON : CARD_OFF);

    out.textContent = '문턱값 ' + f2(cur) + (split ? ' · 같은 데이터 · 다른 문턱값' : '');

    for (j = 0; j < snap.length; j++) {
      var on = Math.round(parseFloat(snap[j].getAttribute('data-th')) * 10000) === cur;
      snap[j].classList.toggle('on', on);
      snap[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    for (j = 0; j < recBtn.length; j++) {
      var filled = !!rec[recBtn[j].getAttribute('data-slot')];
      recBtn[j].classList.toggle('on', filled);
      recBtn[j].setAttribute('aria-pressed', filled ? 'true' : 'false');
    }
  }

  // ── 조작 ──
  slider.addEventListener('input', function () {
    cur = Math.round(parseFloat(slider.value) * 10000);
    render(false);
  });
  for (i = 0; i < snap.length; i++) (function (b) {
    b.addEventListener('click', function () {
      cur = Math.round(parseFloat(b.getAttribute('data-th')) * 10000);
      slider.value = String(cur / 10000);
      render(false);
    });
  })(snap[i]);
  for (i = 0; i < recBtn.length; i++) (function (b) {
    b.addEventListener('click', function () {
      var m = calc(cur);
      rec[b.getAttribute('data-slot')] = { t: cur, prec: m.prec, rec: m.rec };
      render(false);
    });
  })(recBtn[i]);
  clr.addEventListener('click', function () { rec.inv = null; rec.scout = null; render(false); });

  fitWidth();
  if (typeof ResizeObserver === 'function') new ResizeObserver(fitWidth).observe(root);
  render(true);
}

function initW_walk(root, D) {
  // 시험용 66편을 한 편씩 넘기며 기준 모델(전부 기준 미달)과 선택 모델의 혼동행렬·점수판을 나란히 누적한다.
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  var N = 66;
  var MODELS = [
    { k: 'logit', t: '로지스틱 회귀' },
    { k: 'tree', t: '의사결정트리' },
    { k: 'week', t: '로지스틱 + 첫 주 관객' }
  ];
  var KEYS = ['tp', 'fn', 'fp', 'tn'];
  var y = D.y;
  var titles = D.titles;
  var basePred = new Array(N + 1).join('0');

  var panels = qa('.bw-panel').map(function (g) {
    var num = {}, cell = {};
    Array.prototype.slice.call(g.querySelectorAll('.bw-n')).forEach(function (t) { num[t.getAttribute('data-k')] = t; });
    Array.prototype.slice.call(g.querySelectorAll('.bw-cell')).forEach(function (c) { cell[c.getAttribute('data-k')] = c; });
    return {
      title: g.querySelector('.bw-pt'),
      warn: g.querySelector('.bw-warn'),
      num: num,
      cell: cell,
      hit: g.querySelector('.bw-hit'),
      acc: g.querySelector('.bw-acc'),
      rec: g.querySelector('.bw-rec'),
      fill: g.querySelector('.bw-fill'),
      under: g.querySelector('.bw-under')
    };
  });
  var head = q('.bw-head');
  var badge = q('.bw-badge');
  var badgeT = q('.bw-badget');
  var tiles = qa('.bw-tile');
  var range = q('.bw-range');
  var out = q('.wout');
  var mBtns = qa('.wbtn[data-m]');
  var axBtns = qa('.wbtn[data-ax]');
  var stepBtns = qa('.wbtn[data-step]');

  var n = N, mi = 0, ax = 'zero';
  var gaugeW = [126 * 60 / 66, 126 * 61 / 66], gToken = 0;

  function cut(s) {
    var a = Array.from(s);
    return a.length > 15 ? a.slice(0, 15).join('').replace(/\s+$/, '') + '…' : s;
  }
  function three(v) { return v === null ? '—' : v.toFixed(3); }

  function tally(pred, upto) {
    var c = { tp: 0, fn: 0, fp: 0, tn: 0 };
    for (var i = 0; i < upto; i++) {
      var a = y.charAt(i) === '1', b = pred.charAt(i) === '1';
      c[a ? (b ? 'tp' : 'fn') : (b ? 'fp' : 'tn')] += 1;
    }
    return c;
  }
  function landing(pred, i) {
    var a = y.charAt(i) === '1', b = pred.charAt(i) === '1';
    return a ? (b ? 'tp' : 'fn') : (b ? 'fp' : 'tn');
  }
  function acc(c, upto) { return upto ? (c.tp + c.tn) / upto : null; }
  function rec(c) { var d = c.tp + c.fn; return d ? c.tp / d : null; }
  function gauge(a) {
    if (a === null) return 0;
    if (ax === 'zero') return 126 * a;
    var w = 126 * (a - 0.9) / 0.06;
    return w < 0 ? 0 : (w > 126 ? 126 : w);
  }

  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function tweenGauge(to, ms) {
    var from = [gaugeW[0], gaugeW[1]];
    gaugeW = [to[0], to[1]];
    var id = ++gToken;
    if (!ms) {
      panels[0].fill.setAttribute('width', to[0].toFixed(1));
      panels[1].fill.setAttribute('width', to[1].toFixed(1));
      return;
    }
    var t0 = null;
    var run = function (ts) {
      if (id !== gToken) return;
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / ms), k = ease(t);
      panels[0].fill.setAttribute('width', (from[0] + (to[0] - from[0]) * k).toFixed(1));
      panels[1].fill.setAttribute('width', (from[1] + (to[1] - from[1]) * k).toFixed(1));
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  var fadeToken = 0;
  function clearFade() {
    fadeToken += 1;
    qa('.bw-cell').forEach(function (c) { c.removeAttribute('opacity'); });
  }
  function fade(nodes) {
    var id = ++fadeToken;
    nodes.forEach(function (el) { el.setAttribute('opacity', '0.45'); });
    var t0 = null;
    var run = function (ts) {
      if (id !== fadeToken) { nodes.forEach(function (el) { el.removeAttribute('opacity'); }); return; }
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / 260);
      nodes.forEach(function (el) { el.setAttribute('opacity', (0.45 + 0.55 * t).toFixed(3)); });
      if (t < 1) requestAnimationFrame(run); else nodes.forEach(function (el) { el.removeAttribute('opacity'); });
    };
    requestAnimationFrame(run);
  }

  function render(animate, gaugeMs) {
    var pred = D.p[MODELS[mi].k];
    var preds = [basePred, pred];
    var g = [0, 0], accs = [null, null], found = ['', ''];

    for (var s = 0; s < 2; s++) {
      var c = tally(preds[s], n);
      var P = panels[s];
      for (var j = 0; j < KEYS.length; j++) P.num[KEYS[j]].textContent = String(c[KEYS[j]]);
      P.hit.textContent = '맞힌 편수 ' + (c.tp + c.tn) + '/' + n;
      var a = acc(c, n), r = rec(c);
      accs[s] = a;
      found[s] = c.tp + '/' + (c.tp + c.fn);
      P.acc.textContent = '정확도 ' + three(a);
      P.rec.textContent = '찾아낸 성공작 ' + found[s] + ' · 재현율 ' + three(r);
      g[s] = gauge(a);
      P.under.setAttribute('opacity', (ax === 'zoom' && a !== null && a < 0.9) ? '1' : '0');
    }

    panels[1].title.textContent = MODELS[mi].t;
    panels[1].warn.textContent = MODELS[mi].k === 'week' ? '개봉 전 사용 불가' : '';

    if (n === 0) {
      head.textContent = '시작 전';
      badge.setAttribute('opacity', '0');
      badgeT.setAttribute('opacity', '0');
      badgeT.textContent = '';
    } else {
      var i = n - 1, ok = y.charAt(i) === '1';
      head.textContent = n + '번째 · ' + cut(titles[i]);
      badge.setAttribute('opacity', '1');
      badgeT.setAttribute('opacity', '1');
      badge.setAttribute('fill', ok ? '#f6efd9' : '#f1efe8');
      badge.setAttribute('stroke', ok ? '#b07a00' : '#d8d3c4');
      badgeT.textContent = ok ? '실제 성공' : '실제 기준 미달';
    }

    for (var t = 0; t < N; t++) {
      var el = tiles[t], f = '#f0eee6';
      if (t < n) f = y.charAt(t) === '0' ? '#d8d3c4' : (pred.charAt(t) === '1' ? '#54a24b' : '#e45756');
      el.setAttribute('fill', f);
      if (t === n - 1) { el.setAttribute('stroke', '#1c2230'); el.setAttribute('stroke-width', '1.6'); }
      else { el.removeAttribute('stroke'); el.removeAttribute('stroke-width'); }
    }

    out.textContent = '정확도 ' + three(accs[0]) + ' · ' + three(accs[1])
      + ' · 성공작 ' + found[0] + ' · ' + found[1];

    if (String(range.value) !== String(n)) range.value = String(n);
    tweenGauge(g, gaugeMs);

    if (animate && n > 0) {
      clearFade();
      fade([panels[0].cell[landing(basePred, n - 1)], panels[1].cell[landing(pred, n - 1)]]);
    } else {
      clearFade();
    }
  }

  function setN(v, animate) {
    var nv = v < 0 ? 0 : (v > N ? N : v);
    if (nv === n) return;
    n = nv;
    render(animate, 0);
  }

  stepBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var s = b.getAttribute('data-step');
      if (s === 'reset') setN(0, false);
      else if (s === 'end') setN(N, false);
      else setN(n + (s === '10' ? 10 : 1), true);
    });
  });
  mBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-m'), idx = 0;
      for (var i = 0; i < MODELS.length; i++) if (MODELS[i].k === k) idx = i;
      if (idx === mi) return;
      mi = idx;
      mBtns.forEach(function (o) {
        var on = o === b;
        o.classList.toggle('on', on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render(false, 0);
    });
  });
  axBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-ax');
      if (k === ax) return;
      ax = k;
      axBtns.forEach(function (o) {
        var on = o === b;
        o.classList.toggle('on', on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render(false, 400);
    });
  });
  range.addEventListener('input', function () {
    var v = parseInt(range.value, 10);
    if (isNaN(v) || v === n) return;
    n = v < 0 ? 0 : (v > N ? N : v);
    render(false, 0);
  });

  render(false, 0);
}

function initW_dial(root) {
  // 시험용 66편의 성공 편수 k만 바꾼다. 기준 모델은 다수 범주를 그대로 예측하므로
  // 성공작이 줄수록 정확도가 올라간다. 외부 데이터는 쓰지 않는다(상수 66과 정수 k만 사용).
  var N = 66, NS = 'http://www.w3.org/2000/svg';
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var doc = root.ownerDocument;
  var view = doc.defaultView;
  var raf = view && view.requestAnimationFrame ? view.requestAnimationFrame.bind(view) : null;

  var title = q('.dl-title');
  var grid = q('.dl-grid');
  var baseLab = q('.dl-base');
  var panel = q('.dl-panel');
  var capLine = q('.dl-cap');
  var range = q('.dl-range');
  var out = q('.wout');
  var btns = qa('.wbtn[data-k]');
  var groups = {};
  qa('.dl-m').forEach(function (g) { groups[g.getAttribute('data-m')] = g; });

  // 66칸 격자: 11열 6행, 한 칸 26×26, 간격 30 → x 40~366 · y 40~216
  var cells = [], cellOn = [], i;
  for (i = 0; i < N; i++) {
    var c = doc.createElementNS(NS, 'rect');
    c.setAttribute('x', String(40 + (i % 11) * 30));
    c.setAttribute('y', String(40 + Math.floor(i / 11) * 30));
    c.setAttribute('width', '26');
    c.setAttribute('height', '26');
    c.setAttribute('rx', '4');
    c.setAttribute('fill', '#ece7d8');
    c.setAttribute('stroke', '#ddd6c4');
    grid.appendChild(c);
    cells.push(c);
    cellOn.push(false);
  }

  var k = 6, prevMajor = null, flashToken = 0;

  // 기준 모델: 다수 범주 예측. 동률(k = 33)은 기준 미달 유지
  function stats(kk) {
    var neg = N - kk;
    if (kk > N / 2) {   // 전부 성공 예측 → TP = kk, FP = neg, FN = 0, TN = 0
      return { major: 'pos', acc: kk / N, rec: 1, prec: kk / N };
    }
    // 전부 기준 미달 예측 → TP = 0, FP = 0, FN = kk, TN = neg
    return { major: 'neg', acc: neg / N, rec: kk > 0 ? 0 : null, prec: null };
  }

  function fmt(v) { return v.toFixed(3); }

  function flash() {
    var id = ++flashToken;
    panel.setAttribute('stroke', '#b07a00');
    baseLab.setAttribute('opacity', '0.4');
    var done = function () {
      panel.setAttribute('stroke', '#e3ddcf');
      baseLab.setAttribute('opacity', '1');
    };
    if (!raf) { done(); return; }
    var t0 = null;
    var run = function (ts) {
      if (id !== flashToken) return;
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / 200);
      baseLab.setAttribute('opacity', (0.4 + 0.6 * t).toFixed(3));
      if (t < 1) raf(run); else done();
    };
    raf(run);
  }

  function setRow(name, v) {
    var g = groups[name];
    var val = g.querySelector('.dl-val');
    var bar = g.querySelector('.dl-bar');
    var note = g.querySelector('.dl-note');
    if (v === null) {                       // 분모 0 → 값을 정의할 수 없다
      val.textContent = '계산 불가';
      val.setAttribute('font-size', '16');
      val.setAttribute('font-weight', '700');
      val.setAttribute('fill', '#9a8b6a');
      bar.setAttribute('width', '0');
      note.textContent = '분모 0 · 예측 양성 0편';
    } else {
      val.textContent = fmt(v);
      val.setAttribute('font-size', '24');
      val.setAttribute('font-weight', '800');
      val.setAttribute('fill', '#b07a00');
      bar.setAttribute('width', (262 * v).toFixed(1));
      note.textContent = '';
    }
  }

  function draw(first) {
    var s = stats(k);
    var neg = N - k;

    for (var j = 0; j < N; j++) {
      var on = j < k;
      if (on === cellOn[j]) continue;
      cellOn[j] = on;
      var cell = cells[j];
      if (on) {
        cell.setAttribute('fill', '#b07a00');
        cell.setAttribute('fill-opacity', '0.85');
        cell.setAttribute('stroke', '#8a5f00');
      } else {
        cell.setAttribute('fill', '#ece7d8');
        cell.removeAttribute('fill-opacity');
        cell.setAttribute('stroke', '#ddd6c4');
      }
    }

    title.textContent = '시험용 ' + N + '편 · 성공 ' + k + '편 · 기준 미달 ' + neg + '편';
    baseLab.textContent = '기준 모델 · 다수 범주 예측 · ' + (s.major === 'pos' ? '전부 성공' : '전부 기준 미달');
    setRow('acc', s.acc);
    setRow('rec', s.rec);
    setRow('prec', s.prec);

    if (k === 0) capLine.textContent = '성공작 0편 · 재현율·정밀도 계산 불가 · 기준 모델 정확도 1.000';
    else if (s.major === 'pos') capLine.textContent = '다수 범주가 성공으로 역전 · 재현율 1.000 · 정밀도는 성공 비율';
    else capLine.textContent = '성공작이 적을수록 기준 모델 정확도 상승 · 재현율 0.000 유지';

    out.textContent = '성공 ' + k + '편 · 기준 모델 정확도 ' + fmt(s.acc) +
      ' · 재현율 ' + (s.rec === null ? '계산 불가' : fmt(s.rec));

    if (range.value !== String(k)) range.value = String(k);
    btns.forEach(function (b) {
      var on2 = Number(b.getAttribute('data-k')) === k;
      b.classList.toggle('on', on2);
      b.setAttribute('aria-pressed', on2 ? 'true' : 'false');
    });

    if (!first && prevMajor !== null && prevMajor !== s.major) flash();
    prevMajor = s.major;
  }

  function setK(v) {
    var nv = Math.max(0, Math.min(N, Math.round(v)));
    if (nv === k) { if (range.value !== String(k)) range.value = String(k); return; }
    k = nv;
    draw(false);
  }

  range.addEventListener('input', function () { setK(Number(range.value)); });
  btns.forEach(function (b) {
    b.addEventListener('click', function () { setK(Number(b.getAttribute('data-k'))); });
  });

  draw(true);
}
  const WIDGET_INIT = {matrix: initW_matrix, threshold: initW_threshold, walk: initW_walk, dial: initW_dial};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
