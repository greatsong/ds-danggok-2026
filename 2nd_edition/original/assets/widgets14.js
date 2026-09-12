// 14차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson14.html)와 교재(lesson14.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"scr":[2582,2084,1699,1374,1331,1261,1166,1072,952,940,883,851,843,842,829,809,779,749,738,694,688,654,648,601,597,571,568,560,557,538,536,535,533,524,518,505,502,498,487,485,484,467,440,439,428,413,409,406,399,385,381,379,378,368,368,365,358,355,353,349,339,314,309,306,305,295,272,269,267,262,260,253,251,247,245,244,240,225,222,222,221,220,214,208,198,196,191,188,182,180,180,176,175,174,174,173,170,167,165,164,162,158,157,155,155,155,153,150,145,145,143,142,141,141,141,136,134,133,130,130,129,127,123,119,118,117,116,115,115,103,102,102,100,95,90,88,87,86,84,84,83,80,78,78,76,74,63,62,62,61,58,55,54,50,47,46,45,43,40,39,38,35,34,34,32,30,30,29,27,26,26,23,21,20,19,19,19,17,17,16,16,16,13,13,13,13,12,12,11,10,10,10,9,9,9,8,8,8,8,7,7,7,6,6,6,5,5,4,4,4,4,4,3,2,1,1],"mv":[[4,8,9,1],[4,9,9,0],[20,19,9,0],[20,15,9,0],[16,47,9,0],[20,22,9,1],[20,15,9,0],[20,8,9,0],[20,13,9,0],[20,29,9,2],[20,8,9,0],[20,13,9,0],[20,6,9,0],[14,42,9,0],[20,6,9,0],[20,41,9,2],[14,44,9,3],[12,19,9,0],[20,42,9,1],[9,44,9,0],[20,42,10,1],[4,34,10,1],[5,55,10,0],[11,53,10,0],[20,66,10,2],[4,59,10,1],[20,43,10,0],[20,42,10,0],[20,15,10,0],[4,4,10,1],[20,49,10,0],[4,10,10,0],[20,15,10,0],[14,42,10,1],[20,14,10,0],[14,38,10,1],[20,15,10,1],[20,6,10,0],[14,42,10,0],[14,42,10,0],[20,63,10,1],[4,39,10,0],[20,6,10,0],[20,37,10,0],[14,26,10,0],[14,42,10,0],[17,42,10,0],[4,4,11,1],[4,41,11,0],[20,29,11,0],[16,15,11,0],[21,15,11,0],[20,42,11,0],[4,34,11,2],[3,42,11,0],[4,71,11,1],[14,15,11,1],[20,64,11,0],[20,6,11,0],[4,8,11,0],[4,42,11,3],[20,15,11,0],[7,15,11,0],[20,24,12,1],[20,65,12,1],[20,15,12,0],[14,42,12,1],[4,11,12,1],[9,49,12,0],[14,15,12,0],[20,42,12,1],[20,6,12,0],[4,5,12,3],[14,42,12,1],[20,26,12,1],[4,25,12,0],[20,1,12,0],[20,26,12,2],[20,15,12,2],[22,15,12,0],[18,15,12,0],[18,15,12,0],[4,42,1,0],[4,42,1,0],[4,68,1,0],[20,15,1,0],[14,15,1,0],[4,42,1,0],[4,15,1,0],[20,61,1,1],[20,42,1,1],[14,42,1,0],[20,33,1,0],[20,42,1,0],[20,31,1,1],[20,17,1,0],[16,15,1,0],[8,15,1,0],[20,37,1,0],[4,37,1,0],[4,40,1,0],[4,11,1,0],[14,42,1,0],[9,42,1,0],[20,36,2,3],[20,13,2,1],[4,37,2,0],[14,42,2,0],[4,6,2,0],[14,42,2,0],[20,15,2,1],[20,51,2,2],[4,19,2,0],[9,44,2,0],[20,11,2,0],[13,42,2,0],[1,15,2,0],[20,22,2,0],[16,42,2,0],[14,19,2,0],[4,15,2,0],[20,20,2,0],[4,11,2,0],[20,6,2,0],[20,24,3,0],[4,42,3,1],[4,52,3,0],[20,26,3,0],[4,22,3,0],[20,18,3,0],[12,15,3,0],[18,42,3,0],[20,30,3,0],[14,66,3,0],[20,24,3,0],[4,0,3,2],[14,37,3,0],[14,42,3,0],[20,49,3,0],[22,70,3,0],[20,28,3,0],[14,42,3,0],[18,42,3,0],[14,26,4,0],[4,49,4,0],[19,12,4,0],[20,34,4,0],[14,6,4,0],[20,11,4,3],[18,27,4,0],[4,32,4,0],[20,42,4,0],[20,15,4,1],[4,54,4,0],[18,15,4,0],[14,13,4,0],[14,42,4,0],[4,45,4,0],[4,35,4,0],[20,15,4,1],[20,13,4,1],[4,8,4,0],[14,42,4,0],[15,15,4,0],[10,23,4,0],[4,15,4,2],[4,42,4,2],[20,42,5,0],[20,42,5,0],[4,57,5,0],[14,21,5,0],[4,15,5,2],[20,62,5,0],[14,42,5,0],[17,67,5,0],[20,13,5,0],[20,54,5,3],[14,42,5,0],[14,42,5,0],[4,19,5,0],[4,11,5,2],[4,56,5,1],[9,15,5,0],[14,6,5,0],[14,42,5,0],[20,69,5,1],[20,61,6,2],[20,6,6,0],[3,42,6,0],[2,42,6,0],[20,42,6,0],[4,58,6,0],[14,16,6,0],[4,2,6,1],[20,10,6,0],[4,48,6,2],[20,37,6,2],[16,26,6,0],[4,56,6,1],[14,19,6,0],[20,6,6,0],[20,15,6,0],[4,7,7,0],[4,15,7,1],[9,50,7,0],[14,42,7,0],[14,42,7,0],[14,46,7,0],[4,60,7,2],[20,15,7,0],[17,8,7,0],[6,21,7,0],[0,42,7,1],[20,3,7,3],[4,42,7,1],[9,15,7,0]]};
function initW_screenSkew(root, D) {
  var s = (D && D.scr) ? D.scr : [];
  var n = s.length;
  if (!n) { return; }
  var total = 0, cum = new Array(n + 1);
  cum[0] = 0;
  for (var i = 0; i < n; i++) { total += s[i]; cum[i + 1] = total; }

  var bars = root.querySelectorAll('.bars rect');
  var cut = root.querySelector('.cut');
  var cutlab = root.querySelector('.cutlab');
  var out = root.querySelector('.wout');
  var pin = root.querySelector('.pin');
  if (!pin || !cut || !cutlab || !out) { return; }

  var X0 = 56, STEP = 640 / n;

  function draw() {
    var p = parseInt(pin.value, 10);
    if (!(p >= 5)) { p = 5; }
    var k = Math.round(n * p / 100);
    if (k < 1) { k = 1; }
    if (k > n) { k = n; }

    for (var i = 0; i < bars.length; i++) {
      bars[i].setAttribute('fill', i < k ? '#2b7fd6' : '#b9b3a5');
    }

    var bx = X0 + k * STEP - 0.3;
    var bxr = Math.round(bx * 100) / 100;
    cut.setAttribute('x1', bxr);
    cut.setAttribute('x2', bxr);

    var end = bx > 620;
    var lx = end ? bx - 4 : Math.max(bx + 4, 128);
    cutlab.setAttribute('text-anchor', end ? 'end' : 'start');
    cutlab.setAttribute('x', Math.round(lx * 100) / 100);
    cutlab.textContent = '상위 ' + p + '%';

    var share = (cum[k] / total * 100).toFixed(1);
    out.textContent = '상위 ' + p + '% · ' + k + '편 → 전체 스크린 수의 ' + share + '%';
  }

  pin.addEventListener('input', draw);
  pin.addEventListener('change', draw);
  draw();
}

function initW_reidNarrow(root, D) {
  var mv = (D && D.mv) ? D.mv : [];
  var n = mv.length;
  if (!n) { return; }

  var NAMES = ['국가', '장르', '개봉월', '관객 규모'];
  var BINS = '관객 규모 구간 · 10만 미만 · 100만 미만 · 300만 미만 · 300만 이상';
  var on = [true, false, false, false];

  var btns = root.querySelectorAll('.wbtn');
  var dots = root.querySelectorAll('.dots circle');
  var sub = root.querySelector('.sub');
  var bins = root.querySelector('.bins');
  var out = root.querySelector('.wout');
  if (!btns.length || dots.length !== n || !sub || !bins || !out) { return; }

  function draw() {
    var keys = [], i;
    for (i = 0; i < 4; i++) { if (on[i]) { keys.push(i); } }

    var counts = {}, sig = new Array(n), k, j;
    for (i = 0; i < n; i++) {
      k = '';
      for (j = 0; j < keys.length; j++) { k += mv[i][keys[j]] + '|'; }
      sig[i] = k;
      counts[k] = (counts[k] || 0) + 1;
    }

    var uniq = 0, max = 0;
    for (k in counts) {
      if (Object.prototype.hasOwnProperty.call(counts, k)) {
        if (counts[k] === 1) { uniq++; }
        if (counts[k] > max) { max = counts[k]; }
      }
    }

    for (i = 0; i < n; i++) {
      if (counts[sig[i]] === 1) {
        dots[i].setAttribute('fill', '#d64545');
        dots[i].setAttribute('opacity', '1');
      } else {
        dots[i].setAttribute('fill', '#b9b3a5');
        dots[i].setAttribute('opacity', '.5');
      }
    }

    var label = [];
    for (j = 0; j < keys.length; j++) { label.push(NAMES[keys[j]]); }
    var joined = label.join(' + ');
    var pct = (uniq / n * 100).toFixed(1);

    if (!keys.length) {
      sub.textContent = '켠 특징 없음';
      out.textContent = '켠 특징 없음 → 0편(0.0%) · 가장 큰 묶음 ' + n + '편';
    } else {
      sub.textContent = '켠 특징 · ' + joined;
      out.textContent = joined + ' → ' + uniq + '편(' + pct + '%) 한 편으로 좁혀짐 · 가장 큰 묶음 ' + max + '편';
    }
    bins.textContent = on[3] ? BINS : '';

    for (i = 0; i < btns.length; i++) {
      var bk = +btns[i].getAttribute('data-k');
      btns[i].className = on[bk] ? 'wbtn on' : 'wbtn';
      btns[i].setAttribute('aria-pressed', on[bk] ? 'true' : 'false');
    }
  }

  for (var b = 0; b < btns.length; b++) {
    (function (el) {
      el.addEventListener('click', function () {
        var k = +el.getAttribute('data-k');
        on[k] = !on[k];
        draw();
      });
    })(btns[b]);
  }

  draw();
}

function initW_openCheck(root, D) {
  var Q = [
    '비공개용 키를 분리했는가',
    '출처·수집 시점·이용 조건을 밝혔는가',
    '다른 자료와 합치면 개인이 드러나는가'
  ];
  var B = {
    chk: ['확인 필요', '#b07a00'],
    low: ['위험 낮음', '#2f9e5f'],
    care: ['조심', '#d64545']
  };
  var J = [
    [['low', '인증키는 비밀 금고에 보관'], ['chk', '조회 기간·제공 기관 표기'], ['low', '개인별 섭취 기록 없음']],
    [['low', '인증키 없이 수집'], ['chk', '수집 목적·동의 여부 확인'], ['care', '자유 서술에 이름 노출 가능']],
    [['chk', '공개 키에도 접근 권한 설정'], ['chk', '수집 목적·보관 기간 안내'], ['chk', '반복 참여·참여자 구성 확인']],
    [['chk', '제공 앱의 권한 범위 확인'], ['care', '이용 조건에 재사용 제한'], ['care', '이어 붙이면 동선 확인 가능']]
  ];

  var cards = root.querySelectorAll('.ocCard');
  var rows = root.querySelectorAll('.ocRow');
  var btns = root.querySelectorAll('.wbtn');
  var out = root.querySelector('.wout');
  if (!rows.length || !out) { return; }

  var NAME = [];
  for (var n = 0; n < rows.length; n++) { NAME.push(rows[n].getAttribute('aria-label') || ''); }

  var sel = 0;
  var stage = [1, 1, 1];
  var tick = [0, 0, 0];
  var focused = -1;

  function paintCards() {
    for (var i = 0; i < cards.length; i++) {
      var box = cards[i].querySelector('rect');
      box.setAttribute('stroke', i === sel ? '#2b7fd6' : '#e3ddcf');
      box.setAttribute('stroke-width', i === sel ? '2' : '1.5');
    }
    for (var j = 0; j < btns.length; j++) { btns[j].classList.toggle('on', j === sel); }
  }

  function fade(badge, row, id) {
    var t0 = -1;
    function step(ts) {
      if (tick[row] !== id) { return; }
      if (t0 < 0) { t0 = ts; }
      var p = (ts - t0) / 300;
      if (p > 1) { p = 1; }
      badge.setAttribute('opacity', String(p));
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  function paintRow(i, animate) {
    var row = rows[i];
    var line = row.querySelector('.rowLine');
    var badge = row.querySelector('.rowBadge');
    var box = row.querySelector('.rowBox');
    var st = stage[i];
    tick[i] = tick[i] + 1;

    box.setAttribute('stroke', focused === i ? '#2b7fd6' : '#e3ddcf');
    box.setAttribute('stroke-width', focused === i ? '2' : '1.5');

    if (st < 3) {
      line.textContent = (st === 1) ? '?' : Q[i];
      row.setAttribute('aria-label', (st === 1) ? NAME[i] : NAME[i] + '. ' + Q[i]);
      badge.setAttribute('opacity', '0');
      return;
    }
    var v = J[sel][i];
    var b = B[v[0]];
    line.textContent = v[1];
    row.setAttribute('aria-label', NAME[i] + '. ' + b[0] + '. ' + v[1]);
    badge.querySelector('rect').setAttribute('fill', b[1]);
    badge.querySelector('text').textContent = b[0];
    if (animate) {
      badge.setAttribute('opacity', '0');
      fade(badge, i, tick[i]);
    } else {
      badge.setAttribute('opacity', '1');
    }
  }

  function paintOut() {
    var n2 = 0;
    for (var i = 0; i < stage.length; i++) { if (stage[i] === 3) { n2++; } }
    out.textContent = '열어 본 항목 ' + n2 + '/3';
  }

  function openRow(i) {
    var was = stage[i];
    if (stage[i] < 3) { stage[i] = stage[i] + 1; }
    paintRow(i, stage[i] === 3 && was < 3);
    paintOut();
  }

  function pickSource(s) {
    sel = s;
    stage = [1, 1, 1];
    paintCards();
    for (var i = 0; i < rows.length; i++) { paintRow(i, false); }
    paintOut();
  }

  for (var i = 0; i < rows.length; i++) {
    (function (idx) {
      var g = rows[idx];
      g.addEventListener('click', function () { openRow(idx); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openRow(idx);
        }
      });
      g.addEventListener('focus', function () { focused = idx; paintRow(idx, false); });
      g.addEventListener('blur', function () { if (focused === idx) { focused = -1; } paintRow(idx, false); });
    })(i);
  }
  for (var k = 0; k < btns.length; k++) {
    (function (idx) {
      btns[idx].addEventListener('click', function () { pickSource(idx); });
    })(k);
  }

  pickSource(0);
}
  const WIDGET_INIT = {screenSkew: initW_screenSkew, reidNarrow: initW_reidNarrow, openCheck: initW_openCheck};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
