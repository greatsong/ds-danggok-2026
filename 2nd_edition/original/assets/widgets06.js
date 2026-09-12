// 6차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson06.html)와 교재(lesson06.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = 서울 연평균기온 [[연도, 기온], …] 114개.
// 조립 규칙(id 금지·전역 금지·rAF 600ms 이내)은 제작 브리프를 따른다. 이 파일은 <body> 끝에서 로드한다.
  // 서울 연평균기온(관측일 300일 이상, 1908~2025) — 교재 6차시와 같은 기준
  window.SEOUL_YEARLY = [[1908,10.427],[1909,10.609],[1910,10.412],[1911,10.655],[1912,10.124],[1913,10.086],[1914,12.029],[1915,10.898],[1916,10.911],[1917,9.859],[1918,10.54],[1919,11.151],[1920,11.408],[1921,10.969],[1922,10.873],[1923,10.699],[1924,11.07],[1925,10.787],[1926,10.557],[1927,11.068],[1928,11.126],[1929,11.49],[1930,11.794],[1931,10.956],[1932,11.676],[1933,10.586],[1934,10.2],[1935,11.269],[1936,9.778],[1937,11.455],[1938,11.013],[1939,11.781],[1940,10.772],[1941,11.223],[1942,10.973],[1943,11.723],[1944,10.892],[1945,10.438],[1946,11.388],[1947,9.656],[1948,11.758],[1949,11.7],[1954,11.488],[1955,11.513],[1956,10.113],[1957,10.516],[1958,11.637],[1959,12.08],[1960,12.105],[1961,12.455],[1962,11.757],[1963,11.313],[1964,12.221],[1965,11.396],[1966,11.578],[1967,11.676],[1968,11.788],[1969,10.928],[1970,11.422],[1971,11.551],[1972,11.917],[1973,12.097],[1974,11.155],[1975,12.52],[1976,11.48],[1977,12.373],[1978,12.45],[1979,12.507],[1980,10.824],[1981,11.227],[1982,12.559],[1983,12.454],[1984,11.597],[1985,11.618],[1986,11.306],[1987,11.986],[1988,12.121],[1989,13.011],[1990,12.839],[1991,12.398],[1992,12.501],[1993,12.085],[1994,13.612],[1995,12.267],[1996,12.258],[1997,12.957],[1998,13.836],[1999,13.257],[2000,12.714],[2001,12.86],[2002,12.914],[2003,12.87],[2004,13.352],[2005,12.139],[2006,13.062],[2007,13.283],[2008,12.964],[2009,12.953],[2010,12.141],[2011,12.082],[2012,12.269],[2013,12.564],[2014,13.4],[2015,13.622],[2016,13.593],[2017,13.073],[2018,13.002],[2019,13.599],[2020,13.272],[2021,13.752],[2022,13.296],[2023,14.109],[2024,14.875],[2025,14.15]];
function initW_procedure(root, D) {
  // 좌표 변환: x 연도 1905~2028 → 56~470, y 기온 9~16℃ → 20~264
  const X0 = 56, X1 = 470, Y0 = 20, Y1 = 264;
  const sx = yr => X0 + (yr - 1905) / (2028 - 1905) * (X1 - X0);
  const sy = t => Y0 + (16 - t) / (16 - 9) * (Y1 - Y0);

  // 통계: 최소제곱 기울기 a, 편향 b, 피어슨 상관계수 r
  const n = D.length;
  let mx = 0, my = 0;
  for (const [x, y] of D) { mx += x; my += y; }
  mx /= n; my /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of D) {
    const dx = x - mx, dy = y - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  const a = sxy / sxx, b = my - a * mx;
  const r = sxy / Math.sqrt(sxx * syy);
  const signed = v => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(2);

  // 요소
  const q = s => root.querySelector(s);
  const pts = q('.pts'), cap = q('.cap');
  const g2 = q('.st2'), g3 = q('.st3');
  const rfill = q('.rfill'), rdot = q('.rdot');
  const rline = q('.rline');
  const steps = Array.from(root.querySelectorAll('.pstep'));
  const btns = Array.from(root.querySelectorAll('.wbtn'));
  const CAP = { 1: '함께 움직이는 모양?', 2: '얼마나 강한가, 방향은?', 3: '새 값을 예측하면?' };

  // ① 산점도(114개 점)
  pts.innerHTML = D.map(([x, y]) =>
    '<circle cx="' + sx(x).toFixed(1) + '" cy="' + sy(y).toFixed(1) + '" r="3.5"/>').join('');

  // ② 상관계수: 값과 눈금 막대(−1 → 536, 0 → 612, +1 → 688)
  q('.rval').textContent = 'r = ' + signed(r);
  const RX = 612 + r * 76;

  // ③ 회귀선(전체 114개 해): 1908~2025 구간
  const yr0 = D[0][0], yr1 = D[n - 1][0];
  const lx1 = sx(yr0), ly1 = sy(a * yr0 + b), lx2 = sx(yr1), ly2 = sy(a * yr1 + b);
  const L = Math.hypot(lx2 - lx1, ly2 - ly1);
  rline.setAttribute('x1', lx1.toFixed(1)); rline.setAttribute('y1', ly1.toFixed(1));
  rline.setAttribute('x2', lx2.toFixed(1)); rline.setAttribute('y2', ly2.toFixed(1));
  rline.setAttribute('stroke-dasharray', L + ' ' + L);
  q('.slope').textContent = signed(a * 100) + '℃/100년';

  // 단계 전환 상태
  let cur = 0, seq = 0;
  const ease = t => 1 - (1 - t) * (1 - t);

  function setGauge(k) {            // k: 0~1 진행률
    rfill.setAttribute('x2', (612 + (RX - 612) * k).toFixed(1));
    rdot.setAttribute('cx', (612 + (RX - 612) * k).toFixed(1));
  }
  function setLine(k) {
    rline.setAttribute('stroke-dashoffset', (L * (1 - k)).toFixed(1));
  }

  function setStage(s) {
    if (s === cur) return;
    const prev = cur;
    cur = s;
    btns.forEach(bt => bt.classList.toggle('on', +bt.dataset.s === s));
    steps.forEach(t => {
      const k = +t.dataset.s;
      t.setAttribute('fill', k <= s ? '#1c2230' : '#b9b3a5');
      t.setAttribute('font-weight', k === s ? '700' : '400');
    });
    cap.textContent = CAP[s];
    g2.setAttribute('visibility', s >= 2 ? 'visible' : 'hidden');
    g3.setAttribute('visibility', s >= 3 ? 'visible' : 'hidden');

    // 새로 켜진 단계만 애니메이션, 이미 켜진 단계는 완성 상태로 고정
    const new2 = s >= 2 && prev < 2, new3 = s >= 3 && prev < 3;
    if (s >= 2 && !new2) { g2.setAttribute('opacity', '1'); setGauge(1); }
    if (s >= 3 && !new3) { g3.setAttribute('opacity', '1'); setLine(1); }
    if (!new2 && !new3) { seq++; return; }

    const token = ++seq;
    const DUR = 500;
    let t0 = 0;
    if (new2) { g2.setAttribute('opacity', '0'); setGauge(0); }
    if (new3) { g3.setAttribute('opacity', '0'); setLine(0); }
    const frame = ts => {
      if (token !== seq) return;
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / DUR), e = ease(k);
      if (new2) { g2.setAttribute('opacity', Math.min(1, k * 2).toFixed(2)); setGauge(e); }
      if (new3) { g3.setAttribute('opacity', Math.min(1, k * 2).toFixed(2)); setLine(e); }
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  btns.forEach(bt => bt.addEventListener('click', () => setStage(+bt.dataset.s)));
  setStage(1);
}

function initW_galton(root, D) {
  var NS = 'http://www.w3.org/2000/svg';
  var X0 = 56, X1 = 346, Y0 = 20, Y1 = 296, LO = 155, HI = 190;
  var SL = (Y1 - Y0) / (X1 - X0); // '부모와 같은 키' 점선의 화면 기울기(px/px)
  function X(v) { return X0 + (v - LO) / (HI - LO) * (X1 - X0); }
  function Y(v) { return Y1 - (v - LO) / (HI - LO) * (Y1 - Y0); }
  function f1(n) { return n.toFixed(1); }
  function r1(n) { return Math.round(n * 10) / 10; }

  // 배경 점 70개 — 결정적 수열(소수 곱셈 나머지 3개 합으로 종 모양 근사), 기울기 0.65 근방 산포
  // html에 같은 좌표가 이미 들어 있으면 건너뜀(초기 화면이 스크립트 없이도 완성되도록)
  var g = root.querySelector('.pts');
  if (g && !g.firstElementChild) {
    var u = function (i, m, p) { return (((i + 1) * m + 20) % p) / (p - 1); };
    for (var i = 0; i < 70; i++) {
      var nx = u(i, 7919, 97) + u(i, 104729, 89) + u(i, 15485863, 83) - 1.5;
      var ny = u(i, 32452843, 79) + u(i, 49979687, 73) + u(i, 67867967, 71) - 1.5;
      var px = Math.max(156, Math.min(189, 173 + 14 * nx));
      var py = Math.max(156, Math.min(189, 173 + 0.65 * (px - 173) + 9 * ny));
      var c = root.ownerDocument.createElementNS(NS, 'circle');
      c.setAttribute('cx', X(r1(px)).toFixed(1));
      c.setAttribute('cy', Y(r1(py)).toFixed(1));
      c.setAttribute('r', '3.5');
      g.appendChild(c);
    }
  }

  var sl = root.querySelector('input[type=range]');
  var out = root.querySelector('.wout');
  var btns = root.querySelectorAll('.wbtn');
  var guide = root.querySelector('.guide');
  var pSame = root.querySelector('.p-same');
  var pPred = root.querySelector('.p-pred');
  var arr = root.querySelector('.arr');
  var arrh = root.querySelector('.arrh');
  var lbl = root.querySelector('.lbl');
  var vParent = root.querySelector('.v-parent');
  var vSame = root.querySelector('.v-same');
  var vPred = root.querySelector('.v-pred');
  var vDiff = root.querySelector('.v-diff');
  var ym = Y(173); // 전체 평균 수평선

  function render() {
    var x = +sl.value;
    // 회귀선 y = 173 + 0.65(x − 173). 0.1 cm 단위 정수로 계산해 표시값끼리 어긋나지 않게 함
    var pred10 = Math.round(1730 + 6.5 * (x - 173));
    var diff10 = Math.abs(x * 10 - pred10);
    var pred = pred10 / 10, diff = diff10 / 10;
    var gx = X(x), ys = Y(x), ye = Y(pred);
    guide.setAttribute('x1', gx); guide.setAttribute('x2', gx);
    pSame.setAttribute('cx', gx); pSame.setAttribute('cy', ys);
    pPred.setAttribute('cx', gx); pPred.setAttribute('cy', ye);
    var d = ye - ys; // 양수면 아래(자녀 키가 부모보다 작음)
    // 화살표: 회색 점 중심 → 파랑 점 가장자리. 두 점이 가까우면(24px 미만) 머리를 그릴 자리가 없어 생략
    var show = Math.abs(d) >= 24;
    if (show) {
      var s = d > 0 ? 1 : -1;
      var tip = ye - s * 7, base = tip - s * 7;
      arr.setAttribute('x1', gx); arr.setAttribute('x2', gx);
      arr.setAttribute('y1', ys); arr.setAttribute('y2', base);
      arrh.setAttribute('points', gx + ',' + tip + ' ' + (gx - 5) + ',' + base + ' ' + (gx + 5) + ',' + base);
    }
    arr.setAttribute('visibility', show ? 'visible' : 'hidden');
    arrh.setAttribute('visibility', show ? 'visible' : 'hidden');
    // 라벨: 173 이상이면 안내선 왼쪽, 미만이면 오른쪽. 점선(y=x)이 글자 상자를 지나지 않도록
    // 안내선과의 간격 t를 두 점 간격에서 계산하고, 전체 평균선과 겹치면 선 밖으로 옮김
    var half = Math.abs(d) / 2, mid = (ys + ye) / 2;
    var t = Math.max(12, (half + 13) / SL);
    var left = x >= 173;
    var b = mid + 5;
    if (left) b = Math.min(b, ym - 7); else b = Math.max(b, ym + 18);
    lbl.setAttribute('x', (left ? gx - t : gx + t).toFixed(1));
    lbl.setAttribute('text-anchor', left ? 'end' : 'start');
    lbl.setAttribute('y', b.toFixed(1));
    lbl.textContent = diff10 === 0 ? '평균과 같음' : '평균 쪽으로 ' + f1(diff) + ' cm';
    vParent.textContent = x;
    vSame.textContent = f1(x);
    vPred.textContent = f1(pred);
    vDiff.textContent = diff10 === 0 ? '0 → 평균과 같음' : f1(diff) + ' → 평균 쪽';
    out.textContent = x + ' cm';
    for (var k = 0; k < btns.length; k++) {
      if (+btns[k].getAttribute('data-v') === x) btns[k].classList.add('on');
      else btns[k].classList.remove('on');
    }
  }
  sl.addEventListener('input', render);
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener('click', function () {
      sl.value = this.getAttribute('data-v');
      render();
    });
  }
  render();
}

function initW_error(root, D) {
  // 최근 20년(2006~2025)만 사용
  var P = D.slice(-20);
  var X0 = P[0][0], X1 = P[P.length - 1][0];
  var YMIN = 11, YMAX = 15;
  var L = 56, R = 500, T = 26, B = 200;

  function sx(x) { return L + (x - X0) / (X1 - X0) * (R - L); }
  function sy(y) { return B - (y - YMIN) / (YMAX - YMIN) * (B - T); }
  function f1(v) { return v.toFixed(1); }

  // 최소제곱: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄
  function fit(pts) {
    var n = pts.length, mx = 0, my = 0, sxy = 0, sxx = 0, i;
    for (i = 0; i < n; i++) { mx += pts[i][0]; my += pts[i][1]; }
    mx /= n; my /= n;
    for (i = 0; i < n; i++) {
      sxy += (pts[i][0] - mx) * (pts[i][1] - my);
      sxx += (pts[i][0] - mx) * (pts[i][0] - mx);
    }
    var a = sxy / sxx;
    return { a: a, b: my - a * mx };
  }

  // 제곱오차 합: a100 = 기울기(℃/100년), h = 2006년 위치의 직선 높이
  function sse(a100, h) {
    var a = a100 / 100, s = 0, e, i;
    for (i = 0; i < P.length; i++) {
      e = P[i][1] - (h + a * (P[i][0] - X0));
      s += e * e;
    }
    return s;
  }

  function fmtA(a100) {
    var v = Math.abs(a100).toFixed(2);
    return (a100 < 0 && v !== '0.00' ? '−' : '+') + v;
  }

  var full = fit(D), best = fit(P);
  // 초기값: 전체 114개 해 직선(+2.60)을 최근 20년에 얹은 상태
  var init = { a: Math.round(full.a * 100 * 100) / 100, h: Math.round((full.b + full.a * X0) * 10) / 10 };
  // 최적: 20점 최소제곱 직선(+8.14)
  var opt = { a: best.a * 100, h: best.b + best.a * X0 };
  var minS = sse(opt.a, opt.h);
  var st = { a: init.a, h: init.h };

  var dyn = root.querySelector('svg [data-dyn]');
  var tSse = root.querySelector('[data-t="sse"]');
  var tMin = root.querySelector('[data-t="min"]');
  var tA = root.querySelector('[data-t="a"]');
  var tH = root.querySelector('[data-t="h"]');
  var vA = root.querySelector('[data-v="a"]');
  var vH = root.querySelector('[data-v="h"]');
  var sA = root.querySelector('input[data-k="a"]');
  var sH = root.querySelector('input[data-k="h"]');
  var btn = root.querySelector('.wbtn[data-act="best"]');
  var out = root.querySelector('.wout');

  function atBest() { return st.a === opt.a && st.h === opt.h; }

  function render() {
    var a = st.a / 100, i, x, y, yp, ypc, s = '';
    // 예측 직선(그림 범위 안으로 자름)
    var xs = X0, xe = X1, lo, hi, xa, xb;
    if (a === 0) {
      if (st.h < YMIN || st.h > YMAX) xs = xe = null;
    } else {
      xa = X0 + (YMIN - st.h) / a; xb = X0 + (YMAX - st.h) / a;
      lo = Math.min(xa, xb); hi = Math.max(xa, xb);
      xs = Math.max(X0, lo); xe = Math.min(X1, hi);
      if (!(xs < xe)) xs = xe = null;
    }
    if (xs !== null) {
      s += '<line x1="' + f1(sx(xs)) + '" y1="' + f1(sy(st.h + a * (xs - X0))) +
           '" x2="' + f1(sx(xe)) + '" y2="' + f1(sy(st.h + a * (xe - X0))) +
           '" stroke="#2b7fd6" stroke-width="2.5" stroke-linecap="round"/>';
    }
    // 오차 선분(실젯값 → 예측값, 세로)
    for (i = 0; i < P.length; i++) {
      x = P[i][0]; y = P[i][1];
      yp = st.h + a * (x - X0);
      ypc = Math.max(YMIN, Math.min(YMAX, yp));
      s += '<line x1="' + f1(sx(x)) + '" y1="' + f1(sy(y)) + '" x2="' + f1(sx(x)) + '" y2="' + f1(sy(ypc)) +
           '" stroke="#d64545" stroke-width="2" opacity=".85"/>';
    }
    // 실젯값(점)
    for (i = 0; i < P.length; i++) {
      s += '<circle cx="' + f1(sx(P[i][0])) + '" cy="' + f1(sy(P[i][1])) + '" r="3.5" fill="#2b7fd6" opacity=".55"/>';
    }
    dyn.innerHTML = s;

    var S = sse(st.a, st.h), isBest = atBest();
    var sTxt = S.toFixed(2), mTxt = minS.toFixed(2);
    tSse.textContent = sTxt;
    tSse.setAttribute('fill', isBest ? '#2f9e5f' : '#d64545');
    tMin.textContent = mTxt;
    tA.textContent = fmtA(st.a);
    tH.textContent = f1(st.h);
    vA.textContent = fmtA(st.a) + ' ℃/100년';
    vH.textContent = f1(st.h) + '℃';
    out.textContent = '제곱오차 합 ' + sTxt + ' · 최소 ' + mTxt;
    if (isBest) btn.classList.add('on'); else btn.classList.remove('on');
  }

  function syncSliders() {
    sA.value = String(Math.round(st.a * 10) / 10);
    sH.value = String(Math.round(st.h * 10) / 10);
  }

  var anim = null;
  function stopAnim() { if (anim !== null) { cancelAnimationFrame(anim); anim = null; } }

  function onSlide() {
    stopAnim();
    st.a = parseFloat(sA.value);
    st.h = parseFloat(sH.value);
    render();
  }
  sA.addEventListener('input', onSlide);
  sH.addEventListener('input', onSlide);

  // 최적 직선: 현재 직선에서 20점 최소제곱 직선으로 500ms 이동
  btn.addEventListener('click', function () {
    stopAnim();
    if (atBest()) { render(); return; }
    var from = { a: st.a, h: st.h }, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / 500), e = 1 - Math.pow(1 - k, 3);
      if (k >= 1) {
        st.a = opt.a; st.h = opt.h; anim = null;
      } else {
        st.a = from.a + (opt.a - from.a) * e;
        st.h = from.h + (opt.h - from.h) * e;
        anim = requestAnimationFrame(step);
      }
      syncSliders();
      render();
    }
    anim = requestAnimationFrame(step);
  });

  syncSliders();
  render();
}

function initW_modeling3(root, D) {
  // 좌표계 — 산점도 폭 480(x 56~456), 설명 패널 x 496~712
  const X0 = 1908, X1 = 2025, Y0 = 9, Y1 = 16;
  const PX0 = 56, PX1 = 456, PY0 = 20, PY1 = 264;
  const sx = x => PX0 + (x - X0) / (X1 - X0) * (PX1 - PX0);
  const sy = y => PY1 - (y - Y0) / (Y1 - Y0) * (PY1 - PY0);
  const f1 = v => v.toFixed(1);
  const signed = (v, d) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(d);

  // --calc-start
  // 최소제곱: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄
  function fit(P) {
    const n = P.length;
    let sxx = 0, syy = 0;
    for (const [x, y] of P) { sxx += x; syy += y; }
    const mx = sxx / n, my = syy / n;
    let num = 0, den = 0;
    for (const [x, y] of P) { num += (x - mx) * (y - my); den += (x - mx) * (x - mx); }
    const a = num / den;
    return { a, b: my - a * mx, mx, my };
  }
  // 제곱오차 합 Σ(실젯값 − 예측값)²
  function sse(P, a, b) {
    let s = 0;
    for (const [x, y] of P) { const e = y - (a * x + b); s += e * e; }
    return s;
  }
  // 완만한 곡선 후보 — 2차식 최소제곱(u = x − 1967), 3×3 정규방정식을 크래머 공식으로 풂
  function quadFit(P) {
    const c = 1967;
    let S0 = 0, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0;
    for (const [x, y] of P) {
      const u = x - c, u2 = u * u;
      S0 += 1; S1 += u; S2 += u2; S3 += u2 * u; S4 += u2 * u2;
      T0 += y; T1 += u * y; T2 += u2 * y;
    }
    const det = (m) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
    const M = [S0, S1, S2, S1, S2, S3, S2, S3, S4];
    const d = det(M);
    const p0 = det([T0, S1, S2, T1, S2, S3, T2, S3, S4]) / d;
    const p1 = det([S0, T0, S2, S1, T1, S3, S2, T2, S4]) / d;
    const p2 = det([S0, S1, T0, S1, S2, T1, S2, S3, T2]) / d;
    return x => { const u = x - c; return p0 + p1 * u + p2 * u * u; };
  }
  // 계단 후보 — 구간별 평균
  function stairs(P, cuts) {
    const lo = [X0, ...cuts], hi = [...cuts, X1 + 1];
    return lo.map((l, i) => {
      const seg = P.filter(([x]) => x >= l && x < hi[i]);
      const m = seg.reduce((s, [, y]) => s + y, 0) / seg.length;
      return [l, Math.min(hi[i], X1), m];
    });
  }
  // 직선을 그림 범위(x 1908~2025, y 9~16) 안으로 자르기
  function clip(a, b) {
    const y1 = a * X0 + b, y2 = a * X1 + b;
    let t0 = 0, t1 = 1;
    if (y2 !== y1) {
      const tA = (Y0 - y1) / (y2 - y1), tB = (Y1 - y1) / (y2 - y1);
      t0 = Math.max(0, Math.min(tA, tB)); t1 = Math.min(1, Math.max(tA, tB));
    }
    if (t0 >= t1) return null;
    return [X0 + (X1 - X0) * t0, y1 + (y2 - y1) * t0, X0 + (X1 - X0) * t1, y1 + (y2 - y1) * t1];
  }
  // --calc-end

  const F = fit(D);
  const S_LS = sse(D, F.a, F.b);
  // ② 후보 8개 — [기울기(℃/년), x̄에서의 높이 − ȳ]. 편향은 b = c − a·x̄
  const CAND = [[0, 0], [0.008, 0.7], [0.015, -0.6], [0.02, 0.35], [0.033, -0.3], [0.04, 0.45], [0.048, 0.1], [0.03, -0.9]]
    .map(([a, dc]) => { const b = (F.my + dc) - a * F.mx; return { a, b, s: sse(D, a, b) }; })
    .sort((p, q) => q.s - p.s);

  // 직선(a, b) → 화면 좌표 [x1, y1, x2, y2]
  const lineXY = (a, b) => {
    const c = clip(a, b);
    if (!c) return ['0', '0', '0', '0'];
    return [sx(c[0]).toFixed(1), sy(c[1]).toFixed(1), sx(c[2]).toFixed(1), sy(c[3]).toFixed(1)];
  };
  const lineAttr = (a, b) => {
    const [x1, y1, x2, y2] = lineXY(a, b);
    return `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`;
  };

  // 산점도
  root.querySelector('.pts').innerHTML = D.map(([x, y]) =>
    `<circle cx="${sx(x).toFixed(1)}" cy="${sy(y).toFixed(1)}" r="3.5" fill="#2b7fd6" opacity=".55"/>`).join('');

  // ① 후보 형태 — 곡선·계단(흐리게)
  const q = quadFit(D);
  let curve = '';
  for (let x = X0; x <= X1; x += 1) curve += (x === X0 ? 'M' : 'L') + sx(x).toFixed(1) + ',' + sy(q(x)).toFixed(1);
  root.querySelector('.shape-curve').setAttribute('d', curve);
  const st = stairs(D, [1950, 1990]);
  let stair = '';
  st.forEach(([l, h, m], i) => {
    stair += (i === 0 ? 'M' : 'L') + sx(l).toFixed(1) + ',' + sy(m).toFixed(1) + 'L' + sx(h).toFixed(1) + ',' + sy(m).toFixed(1);
  });
  root.querySelector('.shape-stair').setAttribute('d', stair);

  // 회귀선(최소제곱) — 단계에 따라 색만 바뀜
  const fitEl = root.querySelector('.fitline');
  lineXY(F.a, F.b).forEach((v, i) => fitEl.setAttribute(['x1', 'y1', 'x2', 'y2'][i], v));

  // ② 회색 후보 직선 8개
  const candG = root.querySelector('.cands');
  candG.innerHTML = CAND.map(c => `<line ${lineAttr(c.a, c.b)} stroke="#b9b3a5" stroke-width="1.5" opacity="1"/>`).join('');
  const candEls = Array.from(candG.querySelectorAll('line'));

  // ③ 2023·2024·2025 오차 선분 + 표
  // 차이는 표에 보이는 소수 1자리 값끼리 뺀 값(표 안에서 실젯값 − 예측값 = 차이가 그대로 성립)
  const EVAL = [2023, 2024, 2025].map(yr => {
    const y = D.find(d => d[0] === yr)[1];
    const p = F.a * yr + F.b;
    return { yr, y, p, d: Math.round((+f1(y) - +f1(p)) * 10) / 10 };
  });
  root.querySelector('.resid').innerHTML = EVAL.map(e =>
    `<line x1="${sx(e.yr).toFixed(1)}" y1="${sy(e.y).toFixed(1)}" x2="${sx(e.yr).toFixed(1)}" y2="${sy(e.p).toFixed(1)}" stroke="#d64545" stroke-width="2"/>`
  ).join('') + EVAL.map(e =>
    `<circle cx="${sx(e.yr).toFixed(1)}" cy="${sy(e.y).toFixed(1)}" r="4" fill="#d64545" stroke="#f7f3e8" stroke-width="1.2"/>`
  ).join('') + '<text x="440" y="72" font-size="14" fill="#d64545" text-anchor="end">2023~2025</text>';
  root.querySelector('.tbl').innerHTML = EVAL.map((e, i) =>
    `<text y="${142 + i * 22}" font-size="15" fill="#1c2230"><tspan x="496">${e.yr}</tspan><tspan x="590" text-anchor="end">${f1(e.y)}</tspan><tspan x="652" text-anchor="end">${f1(e.p)}</tspan><tspan x="712" text-anchor="end" fill="#d64545" font-weight="700">${signed(e.d, 1)}</tspan></text>`
  ).join('');

  // ② 패널 숫자
  const sseEl = root.querySelector('.sse');
  const resEls = Array.from(root.querySelectorAll('.learned'));
  root.querySelector('.slope').textContent = '기울기 ' + signed(F.a * 100, 2) + ' ℃/100년';
  root.querySelector('.bias').textContent = '편향 ' + signed(F.b, 1).replace('+', '');

  const groups = {
    shapes: root.querySelector('.shapes'),
    cands: candG,
    resid: root.querySelector('.resid')
  };
  const panels = Array.from(root.querySelectorAll('[data-pnl]'));
  const btns = Array.from(root.querySelectorAll('.wbtn'));
  const showG = (el, on) => el.setAttribute('display', on ? 'inline' : 'none');

  let raf = 0;
  function stopAnim() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function setFit(color, w) { fitEl.setAttribute('stroke', color); fitEl.setAttribute('stroke-width', w); }

  // ② 학습 — 후보가 차례로 사라지고 제곱오차 합이 최솟값으로 내려감(600ms)
  function runLearn() {
    stopAnim();
    const n = CAND.length, DUR = 600, step = DUR / (n + 1);
    const V = CAND.map(c => c.s).concat([S_LS]);
    candEls.forEach(el => el.setAttribute('opacity', '1'));
    setFit('#b9b3a5', 1.5);
    resEls.forEach(el => el.setAttribute('opacity', '0'));
    sseEl.textContent = f1(V[0]);
    let t0 = 0;
    const frame = ts => {
      if (!t0) t0 = ts;
      const t = Math.min(DUR, ts - t0);
      candEls.forEach((el, i) => {
        const o = Math.max(0, Math.min(1, ((i + 1) * step - t) / step));
        el.setAttribute('opacity', o.toFixed(2));
      });
      const k = Math.min(n, Math.floor(t / step));
      const u = Math.max(0, Math.min(1, (t - k * step) / step));
      const v = k >= n ? S_LS : V[k] + (V[k + 1] - V[k]) * u;
      sseEl.textContent = f1(v);
      if (t >= n * step) {
        setFit('#2b7fd6', 2.5);
        const o = Math.min(1, (t - n * step) / step);
        resEls.forEach(el => el.setAttribute('opacity', o.toFixed(2)));
      }
      if (t < DUR) raf = requestAnimationFrame(frame); else raf = 0;
    };
    raf = requestAnimationFrame(frame);
  }

  function setStep(s) {
    stopAnim();
    btns.forEach(b => b.classList.toggle('on', +b.dataset.step === s));
    panels.forEach(p => showG(p, +p.dataset.pnl === s));
    showG(groups.shapes, s === 1);
    showG(groups.cands, s === 2);
    showG(groups.resid, s === 3);
    if (s === 1) { setFit('#1c2230', 2.5); }
    else if (s === 2) { runLearn(); }
    else {
      setFit('#2b7fd6', 2.5);
      sseEl.textContent = f1(S_LS);
      resEls.forEach(el => el.setAttribute('opacity', '1'));
    }
  }

  btns.forEach(b => b.addEventListener('click', () => setStep(+b.dataset.step)));
  setStep(1);
}

function initW_mlLayers(root, D) {
  var BLUE = '#2b7fd6', GRAY = '#b9b3a5', SUB = '#6b7385', TEXT = '#1c2230';
  var INFO = {
    ml:    { name: '기계학습', what: ['데이터에서 규칙을 찾는', '방법 전체'],   today: ['직선의 숫자를 계산이', '찾게 한 방식'] },
    learn: { name: '학습',     what: ['모델을 이루는 숫자를', '찾는 계산'],     today: ['제곱오차 합이 가장 작은', '기울기와 편향'] },
    model: { name: '모델',     what: ['학습이 끝나고 남는', '결과물'],         today: ['기울기와 편향으로 정해진', '직선'] }
  };

  // 최소제곱 회귀선: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄
  function fit(data) {
    var n = data.length, sx = 0, sy = 0, i;
    for (i = 0; i < n; i++) { sx += data[i][0]; sy += data[i][1]; }
    var mx = sx / n, my = sy / n, num = 0, den = 0;
    for (i = 0; i < n; i++) {
      num += (data[i][0] - mx) * (data[i][1] - my);
      den += (data[i][0] - mx) * (data[i][0] - mx);
    }
    var a = num / den;
    return { a: a, b: my - a * mx };
  }

  // '모델' 상자 안 미니 산점도 + 회귀선 (폭 120: x 140~260, y 144~222)
  var PX0 = 140, PX1 = 260, PY0 = 222, PY1 = 144;
  var X0 = 1908, X1 = 2025, Y0 = 9, Y1 = 16;
  function px(x) { return PX0 + (x - X0) / (X1 - X0) * (PX1 - PX0); }
  function py(y) { return PY0 - (y - Y0) / (Y1 - Y0) * (PY0 - PY1); }
  var f = fit(D), dots = '', i;
  for (i = 0; i < D.length; i++) {
    dots += '<circle cx="' + px(D[i][0]).toFixed(1) + '" cy="' + py(D[i][1]).toFixed(1) + '" r="1.6" fill="#2b7fd6" opacity=".55"/>';
  }
  root.querySelector('.dots').innerHTML = dots;
  var ln = root.querySelector('.mline');
  ln.setAttribute('x1', px(X0).toFixed(1)); ln.setAttribute('y1', py(f.a * X0 + f.b).toFixed(1));
  ln.setAttribute('x2', px(X1).toFixed(1)); ln.setAttribute('y2', py(f.a * X1 + f.b).toFixed(1));
  var s100 = f.a * 100;
  root.querySelector('.mcap').textContent = '기울기 ' + (s100 >= 0 ? '+' : '') + s100.toFixed(2) + ' ℃/100년';

  // 선택 상태: 층 테두리·낱말 색 + 오른쪽 설명 패널 + 조작 버튼
  var layers = root.querySelectorAll('.layer');
  var btns = root.querySelectorAll('.wbtn');
  var pTitle = root.querySelector('.p-title');
  var pWhat = root.querySelector('.p-what').querySelectorAll('tspan');
  var pToday = root.querySelector('.p-today').querySelectorAll('tspan');
  function select(k) {
    var info = INFO[k] || INFO.model, j, on, box, name, tag;
    if (!INFO[k]) k = 'model';
    for (j = 0; j < layers.length; j++) {
      on = layers[j].getAttribute('data-k') === k;
      box = layers[j].querySelector('.lbox');
      name = layers[j].querySelector('.lname');
      tag = layers[j].querySelector('.ltag');
      box.style.stroke = on ? BLUE : GRAY;
      box.style.strokeWidth = on ? '3' : '1.5';
      name.style.fill = on ? BLUE : SUB;
      name.style.fontWeight = on ? '700' : '400';
      tag.style.fill = on ? TEXT : GRAY;
    }
    for (j = 0; j < btns.length; j++) {
      btns[j].classList.toggle('on', btns[j].getAttribute('data-k') === k);
    }
    pTitle.textContent = info.name;
    pWhat[0].textContent = info.what[0];  pWhat[1].textContent = info.what[1];
    pToday[0].textContent = info.today[0]; pToday[1].textContent = info.today[1];
  }
  function bind(list) {
    for (var j = 0; j < list.length; j++) {
      (function (el) {
        el.addEventListener('click', function () { select(el.getAttribute('data-k')); });
      })(list[j]);
    }
  }
  bind(layers);
  bind(btns);
  select('model');
}

function initW_range(root, D) {
  // 좌표계: x 1908~2045 → 56~696, y 9~16℃ → 264~20
  const X0 = 56, X1 = 696, Y0 = 20, Y1 = 264;
  const YR0 = 1908, YR1 = 2045, T0 = 9, T1 = 16;
  const LAST = 2025, TARGET = 2045;
  const sx = yr => X0 + (yr - YR0) / (YR1 - YR0) * (X1 - X0);
  const sy = t => Y1 - (t - T0) / (T1 - T0) * (Y1 - Y0);

  // 최소제곱: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄
  function fit(pts) {
    const n = pts.length;
    let sumX = 0, sumY = 0;
    for (const p of pts) { sumX += p[0]; sumY += p[1]; }
    const mx = sumX / n, my = sumY / n;
    let sxy = 0, sxx = 0;
    for (const p of pts) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); }
    const a = sxy / sxx;
    return { a: a, b: my - a * mx, n: n };
  }
  function fmtSlope(a) {
    const s = (a * 100).toFixed(2);
    return (s.charAt(0) === '-' ? '' : '+') + s + '℃/100년';
  }

  const q = sel => root.querySelector(sel);
  const slider = q('input[type=range]');
  const wout = q('.wout');
  const btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-start]'));
  const band = q('.band');
  const solid = q('.fit-solid');
  const dash = q('.fit-dash');
  const mark = q('.mark');
  const markLabel = q('.mark-label');
  const boxN = q('.box-n');
  const boxSlope = q('.box-slope');
  const boxPred = q('.box-pred');
  const ptsG = q('.pts');

  // 산점도 점 114개 생성 (D 순서 그대로)
  ptsG.innerHTML = D.map(d =>
    '<circle cx="' + sx(d[0]).toFixed(1) + '" cy="' + sy(d[1]).toFixed(1) + '" r="3.5" fill="#2b7fd6" opacity=".55"/>'
  ).join('');
  const circles = Array.prototype.slice.call(ptsG.querySelectorAll('circle'));

  function setLine(el, f, yrA, yrB) {
    el.setAttribute('x1', sx(yrA).toFixed(1));
    el.setAttribute('y1', sy(f.a * yrA + f.b).toFixed(1));
    el.setAttribute('x2', sx(yrB).toFixed(1));
    el.setAttribute('y2', sy(f.a * yrB + f.b).toFixed(1));
  }

  function update(start) {
    const pts = D.filter(d => d[0] >= start);
    const f = fit(pts);
    const pred = f.a * TARGET + f.b;

    // 학습 구간 띠
    band.setAttribute('x', sx(start).toFixed(1));
    band.setAttribute('width', (sx(LAST) - sx(start)).toFixed(1));

    // 점: 학습 구간 진하게, 이전 회색 흐림
    circles.forEach((c, i) => {
      const on = D[i][0] >= start;
      c.setAttribute('fill', on ? '#2b7fd6' : '#b9b3a5');
      c.setAttribute('opacity', on ? '.55' : '.45');
    });

    // 회귀선 실선(학습 구간) + 점선(2045년까지 외삽)
    setLine(solid, f, start, LAST);
    setLine(dash, f, LAST, TARGET);

    // 2045년 예측값 표지
    const my = sy(pred);
    mark.setAttribute('cx', sx(TARGET).toFixed(1));
    mark.setAttribute('cy', my.toFixed(1));
    markLabel.setAttribute('y', (my - 9).toFixed(1));
    markLabel.textContent = pred.toFixed(1) + '℃';

    // 결과 상자 · 조작 줄
    boxN.textContent = '학습 ' + f.n + '개 해(' + start + '~' + LAST + ')';
    boxSlope.textContent = fmtSlope(f.a);
    boxPred.textContent = pred.toFixed(1) + '℃';
    wout.textContent = '학습 ' + start + '~' + LAST + ' · 기울기 ' + fmtSlope(f.a);

    btns.forEach(b => b.classList.toggle('on', Number(b.getAttribute('data-start')) === start));
  }

  slider.addEventListener('input', () => update(Number(slider.value)));
  btns.forEach(b => b.addEventListener('click', () => {
    const s = Number(b.getAttribute('data-start'));
    slider.value = String(s);
    update(s);
  }));

  update(Number(slider.value));
}

function initW_predict2045(root, D) {
  var NS = 'http://www.w3.org/2000/svg';
  var PL = 56, PR = 596, PT = 20, PB = 238;
  var X0 = 1908, X1 = 2050, Y0 = 9, Y1 = 17, LAST = 2025, TARGET = 2045, GAP = 18;
  var RANGES = [
    { key: 'all', name: '전체', from: 1908, color: '#2b7fd6', on: true },
    { key: '50', name: '최근 50년', from: 1976, color: '#2f9e5f', on: false },
    { key: '30', name: '최근 30년', from: 1996, color: '#b07a00', on: false },
    { key: '20', name: '최근 20년', from: 2006, color: '#d64545', on: true }
  ];
  var svg = root.querySelector('svg');
  var doc = svg.ownerDocument;
  var gPts = root.querySelector('.pts');
  var gLines = root.querySelector('.lines');
  var gLabels = root.querySelector('.labels');
  var gLegend = root.querySelector('.legend');
  var buttons = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));

  function sx(yr) { return PL + (yr - X0) / (X1 - X0) * (PR - PL); }
  function sy(t) { return PB - (t - Y0) / (Y1 - Y0) * (PB - PT); }
  function r1(v) { return Math.round(v * 10) / 10; }
  function el(tag, attrs, text) {
    var e = doc.createElementNS(NS, tag), k;
    for (k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }

  // 최소제곱: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄  (from 이후 연도만 학습 데이터)
  function fit(from) {
    var n = 0, mx = 0, my = 0, sxy = 0, sxx = 0, i, x, y;
    for (i = 0; i < D.length; i++) if (D[i][0] >= from) { n++; mx += D[i][0]; my += D[i][1]; }
    mx /= n; my /= n;
    for (i = 0; i < D.length; i++) if (D[i][0] >= from) {
      x = D[i][0] - mx; y = D[i][1] - my;
      sxy += x * y; sxx += x * x;
    }
    var a = sxy / sxx;
    return { a: a, b: my - a * mx, n: n };
  }
  function fmtSlope(a) { var s = (a * 100).toFixed(2); return (a >= 0 ? '+' : '') + s + '℃/100년'; }

  // 라벨 세로 간격 벌리기(오름차순 입력, 최소 간격 gap, 범위 lo~hi)
  function spread(ys, gap, lo, hi) {
    var out = ys.slice(), n = out.length, k, i, d;
    for (k = 0; k < 60; k++) {
      for (i = 1; i < n; i++) {
        d = gap - (out[i] - out[i - 1]);
        if (d > 0) { out[i - 1] -= d / 2; out[i] += d / 2; }
      }
      for (i = 0; i < n; i++) out[i] = Math.min(hi, Math.max(lo, out[i]));
    }
    return out;
  }

  RANGES.forEach(function (r) { var f = fit(r.from); r.a = f.a; r.b = f.b; r.n = f.n; r.pred = f.b + f.a * TARGET; });

  // 산점도(114개 점, 회색 옅게) — 한 번만 그림
  D.forEach(function (d) {
    gPts.appendChild(el('circle', { cx: r1(sx(d[0])), cy: r1(sy(d[1])), r: 3.5, fill: '#b9b3a5', opacity: 0.7 }));
  });

  // 범례(범위 · 학습 연도 · 기울기) — 플롯 오른쪽 상단. 상자 x 190~486: 2023·2024·2025년 점(x≥493)과 켜진 직선(y>96)을 피함
  var LX = 190, LW = 296, LY0 = 22, ROW = 18;
  gLegend.appendChild(el('rect', { x: LX, y: LY0, width: LW, height: ROW * RANGES.length + 2, rx: 6, fill: '#f7f3e8', 'fill-opacity': 0.92, stroke: '#e3ddcf', 'stroke-width': 1 }));
  RANGES.forEach(function (r, i) {
    var base = LY0 + 14 + ROW * i;
    r.legSwatch = el('line', { x1: LX + 8, y1: base - 5, x2: LX + 24, y2: base - 5, 'stroke-width': 3, 'stroke-linecap': 'round' });
    r.legName = el('text', { x: LX + 30, y: base, 'font-size': 14 }, r.name);
    r.legYears = el('text', { x: LX + 104, y: base, 'font-size': 14 }, r.from + '~' + LAST);
    r.legSlope = el('text', { x: LX + LW - 6, y: base, 'font-size': 14, 'text-anchor': 'end' }, fmtSlope(r.a));
    gLegend.appendChild(r.legSwatch); gLegend.appendChild(r.legName); gLegend.appendChild(r.legYears); gLegend.appendChild(r.legSlope);
  });

  function render() {
    clear(gLines); clear(gLabels);
    var on = RANGES.filter(function (r) { return r.on; });
    var xe = sx(TARGET), xl = sx(LAST);

    // 직선: 학습 범위(실선) → 2025~2045 연장(파선)
    on.forEach(function (r) {
      var y0 = sy(r.b + r.a * r.from), y1 = sy(r.b + r.a * LAST), y2 = sy(r.pred);
      gLines.appendChild(el('line', { x1: r1(sx(r.from)), y1: r1(y0), x2: r1(xl), y2: r1(y1), stroke: r.color, 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
      gLines.appendChild(el('line', { x1: r1(xl), y1: r1(y1), x2: r1(xe), y2: r1(y2), stroke: r.color, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }));
    });

    // 2045년 값 라벨: 선 끝 오른쪽, 18 미만으로 가까우면 위아래로 벌림
    var items = on.map(function (r) { return { r: r, y: sy(r.pred) }; })
      .sort(function (p, q) { return p.y - q.y; });
    var ys = spread(items.map(function (it) { return it.y; }), GAP, PT + 10, PB - 10);
    items.forEach(function (it, i) {
      var ly = ys[i];
      if (Math.abs(ly - it.y) > 3) {
        gLabels.appendChild(el('line', { x1: r1(xe + 5), y1: r1(it.y), x2: r1(xe + 10), y2: r1(ly), stroke: it.r.color, 'stroke-width': 1.2, opacity: 0.7 }));
      }
      gLabels.appendChild(el('circle', { cx: r1(xe), cy: r1(it.y), r: 4.5, fill: it.r.color, stroke: '#ffffff', 'stroke-width': 1.5 }));
      gLabels.appendChild(el('text', { x: r1(xe + 12), y: r1(ly + 5), 'font-size': 15, 'font-weight': 700, fill: it.r.color }, it.r.name + ' ' + it.r.pred.toFixed(1) + '℃'));
    });

    // 범례·버튼 켜짐 상태
    RANGES.forEach(function (r) {
      var c = r.on ? r.color : '#b9b3a5';
      r.legSwatch.setAttribute('stroke', c);
      r.legName.setAttribute('fill', c);
      r.legYears.setAttribute('fill', r.on ? '#6b7385' : '#b9b3a5');
      r.legSlope.setAttribute('fill', r.on ? '#1c2230' : '#b9b3a5');
    });
    buttons.forEach(function (btn) {
      var r = byKey(btn.getAttribute('data-range'));
      if (!r) return;
      btn.classList.toggle('on', r.on);
      btn.setAttribute('aria-pressed', r.on ? 'true' : 'false');
    });
  }
  function byKey(key) { for (var i = 0; i < RANGES.length; i++) if (RANGES[i].key === key) return RANGES[i]; return null; }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var r = byKey(btn.getAttribute('data-range'));
      if (!r) return;
      r.on = !r.on;
      render();
    });
  });

  render();
}

function initW_extrapolation(root, D) {
  // 좌표계: x 1908~2100, y 9~18℃ / 여백 왼 56·오 24·위 20·아래 36
  var X0 = 1908, X1 = 2100, T0 = 9, T1 = 18;
  var L = 56, R = 696, TOP = 20, BOT = 244;
  var TRAIN_END = 2025;                       // 학습 범위 끝
  var SHADE_L = 446, SHADE_R = 696;           // 음영 구간(2025~2100)의 화면 x
  var BADGE_R = 696, BADGE_Y = 22, BADGE_H = 22;

  function X(year) { return L + (year - X0) / (X1 - X0) * (R - L); }
  function Y(t) { return BOT - (t - T0) / (T1 - T0) * (BOT - TOP); }
  function r1(v) { return v.toFixed(1); }
  function r2(v) { return v.toFixed(2); }
  function fit(rows) {                         // 최소제곱: a = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)², b = ȳ − a·x̄
    var n = rows.length, sx = 0, sy = 0, i;
    for (i = 0; i < n; i++) { sx += rows[i][0]; sy += rows[i][1]; }
    var mx = sx / n, my = sy / n, num = 0, den = 0;
    for (i = 0; i < n; i++) { num += (rows[i][0] - mx) * (rows[i][1] - my); den += (rows[i][0] - mx) * (rows[i][0] - mx); }
    var a = num / den;
    return { a: a, b: my - a * mx };
  }
  function estW(s, fs) {                       // 글자 폭 추정(겹침 회피용): 한글·기호 1em, 숫자·영문 0.6em
    var w = 0, c;
    for (var i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c === 32 || c === 46) w += 0.28;
      else if (c === 183) w += 0.4;
      else if (c >= 0x1100) w += 1.0;
      else w += 0.6;
    }
    return w * fs;
  }
  function q(sel) { return root.querySelector(sel); }
  function setA(el, name, v) { el.setAttribute(name, v); }

  var f = fit(D);
  var byYear = {};
  for (var k = 0; k < D.length; k++) byYear[D[k][0]] = D[k][1];
  function pred(year) { return f.a * year + f.b; }

  // 산점도 114개 점(정적 초기값과 같은 좌표로 다시 채움)
  var pts = '';
  for (var j = 0; j < D.length; j++) {
    pts += '<circle cx="' + r2(X(D[j][0])) + '" cy="' + r2(Y(D[j][1])) + '" r="3.5"/>';
  }
  q('.pts').innerHTML = pts;

  // 전체 직선: 1908~2025 실선, 2025~2100 점선
  var solid = q('.fit-solid'), dash = q('.fit-dash');
  setA(solid, 'x1', r2(X(X0))); setA(solid, 'y1', r2(Y(pred(X0))));
  setA(solid, 'x2', r2(X(TRAIN_END))); setA(solid, 'y2', r2(Y(pred(TRAIN_END))));
  setA(dash, 'x1', r2(X(TRAIN_END))); setA(dash, 'y1', r2(Y(pred(TRAIN_END))));
  setA(dash, 'x2', r2(X(X1))); setA(dash, 'y2', r2(Y(pred(X1))));
  var slope = f.a * 100;
  q('.legend').textContent = '회귀선 · 학습 데이터 ' + X0 + '~' + TRAIN_END + ' · 기울기 ' + (slope >= 0 ? '+' : '') + r2(slope) + '℃/100년';

  var shade = q('.shade'), shadeEdge = q('.shade-edge'), shadeTxt = q('.shade-txt');
  var shadeSpans = shadeTxt.querySelectorAll('tspan');
  var vline = q('.vline'), ppt = q('.ppt'), apt = q('.apt'), lab = q('.lab');
  var badgeR = q('.badge-r'), badgeT = q('.badge-t');
  var slider = q('input[type=range]'), out = q('.wout');
  var btns = root.querySelectorAll('.wbtn[data-year]');

  function render(year) {
    var outside = year > TRAIN_END;
    var xs = X(year), p = pred(year), ys = Y(p);
    var actual = byYear[year];
    var hasActual = !outside && actual !== undefined;

    // 세로선 + 직선 위 점
    setA(vline, 'x1', r2(xs)); setA(vline, 'x2', r2(xs));
    setA(ppt, 'cx', r2(xs)); setA(ppt, 'cy', r2(ys));
    setA(ppt, 'fill', outside ? '#d64545' : '#2f9e5f');
    if (hasActual) {
      setA(apt, 'cx', r2(xs)); setA(apt, 'cy', r2(Y(actual)));
      setA(apt, 'visibility', 'visible');
    } else {
      setA(apt, 'visibility', 'hidden');
    }

    // 음영 + '확인할 데이터 없음'(세로선 반대편에 배치)
    var vis = outside ? 'visible' : 'hidden';
    setA(shade, 'visibility', vis); setA(shadeEdge, 'visibility', vis); setA(shadeTxt, 'visibility', vis);
    if (outside) {
      var mid = (SHADE_L + SHADE_R) / 2;
      var cx = xs <= mid ? (xs + 8 + SHADE_R) / 2 : (SHADE_L + xs - 8) / 2;
      for (var s = 0; s < shadeSpans.length; s++) setA(shadeSpans[s], 'x', r2(cx));
    }

    // 배지
    var badgeText = outside ? '외삽' : '학습 범위 안';
    var badgeW = Math.round(estW(badgeText, 14) + 22);
    var badgeX = BADGE_R - badgeW;
    badgeT.textContent = badgeText;
    setA(badgeR, 'x', badgeX); setA(badgeR, 'width', badgeW);
    setA(badgeR, 'fill', outside ? '#d64545' : '#2f9e5f');
    setA(badgeT, 'x', r2(badgeX + badgeW / 2));

    // 라벨(위쪽 띠, 세로선 옆·배지와 겹치지 않게)
    var text;
    if (outside) text = year + '년 예측 ' + r1(p) + '℃';
    else if (hasActual) text = year + '년 실젯값 ' + r1(actual) + ' · 예측값 ' + r1(p);
    else text = year + '년 예측값 ' + r1(p);            // 결측 연도(1950~1953): 예측값만
    var w = estW(text, 16);
    var limitR = badgeX - 12;
    if (xs + 8 + w <= limitR) {
      setA(lab, 'text-anchor', 'start'); setA(lab, 'x', r2(xs + 8));
    } else {
      setA(lab, 'text-anchor', 'end'); setA(lab, 'x', r2(Math.min(xs - 8, limitR)));
    }
    lab.textContent = text;

    // 조작 줄
    out.textContent = year + '년 → 예측값 ' + r1(p) + '℃';
    for (var b = 0; b < btns.length; b++) {
      btns[b].classList.toggle('on', Number(btns[b].getAttribute('data-year')) === year);
    }
  }

  slider.addEventListener('input', function () { render(Number(slider.value)); });
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function (ev) {
      var y = Number(ev.currentTarget.getAttribute('data-year'));
      slider.value = y;
      render(y);
    });
  }
  render(Number(slider.value));
}

function initW_causation(root, D) {
  var HEAD = ['', '① 관찰', '② 원인', '③ 결론'];
  var LINE = ['', '두 값이 함께 변함', '기온이 둘 다 끌어올림', '상관 ≠ 인과'];
  var COLOR = ['', '#1c2230', '#2b7fd6', '#d64545'];
  var layers = [null,
    root.querySelector('[data-layer="1"]'),
    root.querySelector('[data-layer="2"]'),
    root.querySelector('[data-layer="3"]')];
  var topBox = root.querySelector('[data-el="top-box"]');
  var topText = root.querySelector('[data-el="top-text"]');
  var pHead = root.querySelector('[data-el="p-head"]');
  var pLine = root.querySelector('[data-el="p-line"]');
  var btns = root.querySelectorAll('.wbtn[data-step]');
  var cur = 1;
  var raf = 0;
  var tmr = 0;
  var active = [];

  // 진행 중인 페이드를 즉시 완료 처리(재클릭·타이머 보호용)
  function settle() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (tmr) { clearTimeout(tmr); tmr = 0; }
    for (var i = 0; i < active.length; i++) {
      if (active[i].style.visibility !== 'hidden') active[i].style.opacity = '1';
    }
    active = [];
  }

  function fadeIn(els) {
    settle();
    if (!els.length) return;
    active = els;
    for (var j = 0; j < els.length; j++) {
      els[j].style.opacity = '0';
      els[j].style.visibility = 'visible';
    }
    var t0 = null;
    function tick(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / 300);
      for (var i = 0; i < els.length; i++) els[i].style.opacity = String(p);
      if (p < 1) raf = requestAnimationFrame(tick); else settle();
    }
    raf = requestAnimationFrame(tick);
    tmr = setTimeout(settle, 400);
  }

  function show(step) {
    var fresh = [];
    for (var k = 1; k <= 3; k++) {
      if (k <= step) {
        if (k > cur || layers[k].style.visibility === 'hidden') fresh.push(layers[k]);
      } else {
        layers[k].style.visibility = 'hidden';
        layers[k].style.opacity = '0';
      }
    }
    fadeIn(fresh);
    var lit = step >= 2;
    topBox.setAttribute('stroke', lit ? '#b07a00' : '#b9b3a5');
    topText.setAttribute('fill', lit ? '#1c2230' : '#6b7385');
    pHead.textContent = HEAD[step];
    pLine.textContent = LINE[step];
    pLine.setAttribute('fill', COLOR[step]);
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', Number(btns[i].getAttribute('data-step')) === step);
    }
    cur = step;
  }

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function (e) {
      show(Number(e.currentTarget.getAttribute('data-step')));
    });
  }
  show(1);
}
function initW_slopebias(root, D) {
  // 좌표계: viewBox 720×300, x 1908~2025 → 56~696, y 8~16℃ → 264~20
  var X0 = 1908, X1 = 2025, Y0 = 8, Y1 = 16;
  var L = 56, R = 696, T = 20, B = 264;
  var PLOT = { x: L, y: T, w: R - L, h: B - T };
  var BOX = { x: 430, y: 22, w: 210, h: 46 };            // 오른쪽 상단 상자(html과 일치)
  var UNIT = { x: 61, y: 2, w: 18, h: 16 };                // y축 끝 '℃'
  var TICKS = { x: 28, y: 0, w: 22, h: 272 };              // y축 눈금 글자 열
  var AVOID = [BOX, UNIT, TICKS];
  function px(x) { return L + (x - X0) / (X1 - X0) * (R - L); }
  function py(y) { return B - (y - Y0) / (Y1 - Y0) * (B - T); }
  function q(sel) { return root.querySelector(sel); }
  function f1(v) { return Math.round(v * 10) / 10; }

  // 최소제곱 학습 결과(전체 114개 해)
  var n = D.length, i, sx = 0, sy = 0;
  for (i = 0; i < n; i++) { sx += D[i][0]; sy += D[i][1]; }
  var mx = sx / n, my = sy / n, sxy = 0, sxx = 0;
  for (i = 0; i < n; i++) { sxy += (D[i][0] - mx) * (D[i][1] - my); sxx += (D[i][0] - mx) * (D[i][0] - mx); }
  var aLS = sxy / sxx, bLS = my - aLS * mx;
  var slopeLS = Math.round(aLS * 1000) / 10;              // ℃/100년, 슬라이더 단계 0.1
  var biasLS = Math.round((aLS * X0 + bLS) * 10) / 10;    // 1908년(왼쪽 끝) 직선 높이

  // 산점도(학습 데이터)
  var pts = '';
  for (i = 0; i < n; i++) {
    pts += '<circle cx="' + f1(px(D[i][0])) + '" cy="' + f1(py(D[i][1])) + '" r="3.5" fill="#2b7fd6" opacity=".55"/>';
  }
  q('.pts').innerHTML = pts;

  // 요소
  var inS = q('input[data-k="slope"]'), inB = q('input[data-k="bias"]');
  var btn = q('[data-act="reset"]'), out = q('.wout');
  var line = q('.fit'), dot = q('.bdot'), bl = q('.blbl'), sl = q('.slbl');
  var box1 = q('.box1'), box2 = q('.box2');

  // 숫자 표기: 양수 '+', 음수 '−'
  function sgn(v, d) {
    if (Math.abs(v) < 0.5 * Math.pow(10, -d)) v = 0;
    var s = v.toFixed(d);
    return v < 0 ? '−' + s.slice(1) : '+' + s;
  }
  // 글자 폭 추정(한글·℃·→ ≈ 1em, 숫자 ≈ .58em)
  function tw(s, fs) {
    var w = 0, k, c;
    for (k = 0; k < s.length; k++) {
      c = s.charCodeAt(k);
      if (c === 32) w += 0.28;
      else if (c === 46) w += 0.3;
      else if (c === 47) w += 0.36;
      else if (c >= 48 && c <= 57) w += 0.58;
      else if (c === 43 || c === 8722) w += 0.62;
      else if (c === 8451 || c === 8594 || c > 255) w += 1;
      else w += 0.6;
    }
    return w * fs;
  }
  // 선분을 사각형에 맞춰 자르기(리앙–바스키). 지나지 않으면 null
  function clip(r, x1, y1, x2, y2) {
    var t0 = 0, t1 = 1, dx = x2 - x1, dy = y2 - y1, k, t;
    var p = [-dx, dx, -dy, dy], qv = [x1 - r.x, r.x + r.w - x1, y1 - r.y, r.y + r.h - y1];
    for (k = 0; k < 4; k++) {
      if (p[k] === 0) { if (qv[k] < 0) return null; }
      else {
        t = qv[k] / p[k];
        if (p[k] < 0) { if (t > t1) return null; if (t > t0) t0 = t; }
        else { if (t < t0) return null; if (t < t1) t1 = t; }
      }
    }
    return [t0, t1];
  }
  function hit(r, s) { return !(r.x + r.w < s.x || s.x + s.w < r.x || r.y + r.h < s.y || s.y + s.h < r.y); }
  // 산점도 점 좌표(라벨이 점을 피하도록)
  var PX = [], PY = [];
  for (i = 0; i < n; i++) { PX.push(px(D[i][0])); PY.push(py(D[i][1])); }
  function nPts(r) {
    var c = 0, k;
    for (k = 0; k < n; k++) if (PX[k] >= r.x && PX[k] <= r.x + r.w && PY[k] >= r.y && PY[k] <= r.y + r.h) c++;
    return c;
  }
  // 라벨 자리 고르기: 그림 안(여백 8, 눈금 글자 영역 제외) · 상자·단위·다른 라벨과 겹치지 않음 · 직선과 겹치지 않음
  // 조건을 통과한 첫 후보와 같은 줄(row)의 후보 가운데 '산점도 점 수 + 거리 벌점(pen)'이 가장 작은 자리를 고른다(같으면 앞 후보)
  function place(el, txt, fs, cands, seg, extra) {
    var w = tw(txt, fs), k, j, c, r, ok, best = null, bestR = null, bestN = 1e9, row = null, av = AVOID.concat(extra || []);
    for (k = 0; k < cands.length; k++) {
      c = cands[k];
      if (row !== null && c.row !== row) break;
      r = { x: (c.a === 'end' ? c.x - w : c.x) - 5, y: c.y - fs * 0.85 - 4, w: w + 10, h: fs + 8 };
      ok = r.x >= 8 && r.x + r.w <= 710 && r.y >= 1 && r.y + r.h <= 267;
      for (j = 0; ok && j < av.length; j++) if (hit(r, av[j])) ok = false;
      if (ok && seg && clip(r, seg[0], seg[1], seg[2], seg[3])) ok = false;
      if (ok) {
        if (row === null) { row = c.row; }
        j = nPts(r) + (c.pen || 0);
        if (j < bestN) { best = c; bestR = r; bestN = j; }
        if (j === 0) break;
      }
    }
    if (!best) { c = cands[0]; best = c; bestR = { x: (c.a === 'end' ? c.x - w : c.x) - 5, y: c.y - fs * 0.85 - 4, w: w + 10, h: fs + 8 }; }
    var y = Math.min(Math.max(best.y, 2 + fs * 0.85), 263);
    el.setAttribute('x', f1(best.x));
    el.setAttribute('y', f1(y));
    el.setAttribute('text-anchor', best.a);
    el.textContent = txt;
    return bestR;
  }

  function read() {
    var s = parseFloat(inS.value), b = parseFloat(inB.value);
    if (isNaN(s)) s = slopeLS;
    if (isNaN(b)) b = biasLS;
    return { s: s, b: b };
  }

  function render() {
    var v = read(), s = v.s, b = v.b, a = s / 100;
    var x1 = px(X0), y1 = py(b), x2 = px(X1), y2 = py(b + a * (X1 - X0));
    var t = clip(PLOT, x1, y1, x2, y2), seg = null;
    if (t && t[1] - t[0] > 1e-6) {
      seg = [x1 + (x2 - x1) * t[0], y1 + (y2 - y1) * t[0], x1 + (x2 - x1) * t[1], y1 + (y2 - y1) * t[1]];
      line.setAttribute('x1', f1(seg[0])); line.setAttribute('y1', f1(seg[1]));
      line.setAttribute('x2', f1(seg[2])); line.setAttribute('y2', f1(seg[3]));
      line.setAttribute('visibility', 'visible');
    } else {
      line.setAttribute('visibility', 'hidden');
    }
    // 편향: 왼쪽 끝 노랑 점 + 라벨(직선 반대쪽 줄에서 점이 적고 가까운 자리)
    dot.setAttribute('cy', f1(y1));
    var bc = [], d, row, k, pxk, pyk;
    for (row = 0; row < 2; row++) {
      for (d = 0; d <= 135; d += 45) {
        if (a >= 0) bc.push({ x: L + 11 + d, y: y1 + 25 + row * 20, a: 'start', row: row, pen: d / 60 });
        else bc.push({ x: L + 11 + d, y: y1 - 11 - row * 20, a: 'start', row: row, pen: d / 60 });
      }
    }
    for (row = 0; row < 2; row++) {
      for (d = 0; d <= 135; d += 45) {
        if (a >= 0) bc.push({ x: L + 11 + d, y: y1 - 11 - row * 20, a: 'start', row: 2 + row, pen: d / 60 });
        else bc.push({ x: L + 11 + d, y: y1 + 25 + row * 20, a: 'start', row: 2 + row, pen: d / 60 });
      }
    }
    var bRect = place(bl, '편향 ' + b.toFixed(1) + '℃', 15, bc, seg);
    // 기울기: 직선 끝의 빈 쪽(오르는 직선은 위, 내리는 직선은 아래), 안 되면 직선을 따라 왼쪽으로
    var st = '기울기 ' + sgn(s, 2) + '℃/100년', c = [], xe, ye, up;
    if (seg) {
      xe = seg[2]; ye = seg[3]; up = a >= 0;
      c.push({ x: xe - 2, y: up ? ye - 12 : ye + 26, a: 'end' });
      for (d = 0; d <= 180; d += 90) {
        c.push({ x: xe + 10 + d, y: ye + 6, a: 'start' });
        c.push({ x: xe + 10 + d, y: ye - 6, a: 'start' });
      }
      c.push({ x: xe - 2, y: up ? ye + 26 : ye - 12, a: 'end' });
      for (k = 0.8; k > 0.15; k -= 0.15) {
        pxk = seg[0] + (seg[2] - seg[0]) * k; pyk = seg[1] + (seg[3] - seg[1]) * k;
        c.push({ x: pxk, y: up ? pyk - 12 : pyk + 26, a: 'end' });
        c.push({ x: pxk + 8, y: up ? pyk + 22 : pyk - 8, a: 'start' });
      }
    } else {
      // 직선이 그림 밖(편향이 축의 끝값이고 기울기가 밖으로 향함): 노랑 점 옆, 편향 라벨 다음 자리
      for (k = 0; k < bc.length; k++) c.push({ x: bc[k].x, y: bc[k].y, a: 'start' });
    }
    for (k = 0; k < c.length; k++) c[k].row = k;
    place(sl, st, 15, c, seg, [bRect]);
    // 오른쪽 상단 상자 · 조작 줄 결과
    box1.textContent = '연도 1 증가 → 기온 ' + sgn(a, 3) + '℃';
    box2.textContent = '100년 → ' + sgn(s, 2) + '℃';
    out.textContent = '기울기 ' + sgn(s, 2) + ' · 편향 ' + b.toFixed(1);
    var atLS = Math.abs(s - slopeLS) < 1e-6 && Math.abs(b - biasLS) < 1e-6;
    if (atLS) btn.classList.add('on'); else btn.classList.remove('on');
  }

  // '학습 결과로': 두 슬라이더를 최소제곱 값으로 되돌리기(450ms 이내, 다시 눌러도 이어짐)
  var anim = null;
  function stopAnim() { if (anim !== null) { cancelAnimationFrame(anim); anim = null; } }
  function toLS() {
    stopAnim();
    var v = read(), s0 = v.s, b0 = v.b, t0 = null;
    if (Math.abs(s0 - slopeLS) < 1e-6 && Math.abs(b0 - biasLS) < 1e-6) { render(); return; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / 450), e = 1 - (1 - k) * (1 - k);
      inS.value = f1(s0 + (slopeLS - s0) * e);
      inB.value = f1(b0 + (biasLS - b0) * e);
      if (k < 1) { render(); anim = requestAnimationFrame(step); }
      else { anim = null; inS.value = slopeLS; inB.value = biasLS; render(); }
    }
    anim = requestAnimationFrame(step);
  }

  inS.addEventListener('input', function () { stopAnim(); render(); });
  inB.addEventListener('input', function () { stopAnim(); render(); });
  btn.addEventListener('click', toLS);

  inS.value = slopeLS;
  inB.value = biasLS;
  render();
}
function initW_corr(root, D) {
  // 서울 데이터 D는 사용하지 않음(시그니처 통일). 점 60개는 고정 시드 의사난수로 생성
  var N = 60;
  var CX = 168, CY = 110, RX = 120, RY = 80;   // 산점도 중심과 반폭(축 40~296 · 22~198 안쪽)
  var BY0 = 110, BS = 78;                       // 눈금 막대: r → y = 110 − 78·r

  // 선형 합동 생성기(시드 고정): 결정적 의사난수, 매번 같은 점
  var seed = 20260906;
  function rnd() { seed = (seed * 48271) % 2147483647; return seed / 2147483647; }
  function stdz(v) {                            // 평균 0 · 표준편차 1로 정규화
    var n = v.length, m = 0, s = 0, i;
    for (i = 0; i < n; i++) m += v[i];
    m /= n;
    for (i = 0; i < n; i++) { v[i] -= m; s += v[i] * v[i]; }
    s = Math.sqrt(s / n);
    for (i = 0; i < n; i++) v[i] /= s;
    return v;
  }

  // x̂, ẑ: 평균 0·표준편차 1·서로 직교 → y = r·x̂ + √(1−r²)·ẑ 의 표본 상관계수가 정확히 r
  var xs = [], zs = [], i, c = 0, R = 0;
  for (i = 0; i < N; i++) { xs.push(rnd() + rnd() + rnd()); zs.push(rnd() + rnd() + rnd()); }
  stdz(xs);
  stdz(zs);
  for (i = 0; i < N; i++) c += zs[i] * xs[i];   // ẑ에 남은 x̂ 방향 성분
  c /= N;
  for (i = 0; i < N; i++) zs[i] -= c * xs[i];   // 직교화
  stdz(zs);
  var MX = 0;
  for (i = 0; i < N; i++) {
    R = Math.max(R, Math.hypot(xs[i], zs[i]));   // 어떤 r에서도 |y| ≤ R (코시·슈바르츠)
    MX = Math.max(MX, Math.abs(xs[i]));          // x는 고정이므로 축 폭에 맞춰 따로 배율
  }
  var sx = RX / MX, sy = RY / R;                 // 축마다 배율이 달라도 상관계수는 그대로

  // 요소
  var q = function (s) { return root.querySelector(s); };
  var pts = q('.pts'), rdot = q('.rdot'), rfill = q('.rfill'), rval = q('.rval'), out = q('.wout');
  var slider = q('input[type=range]');
  var zones = Array.prototype.slice.call(root.querySelectorAll('.zone'));
  var btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));

  // 점 60개: x는 고정, r에 따라 y만 이동
  var html = '';
  for (i = 0; i < N; i++) html += '<circle cx="' + (CX + xs[i] * sx).toFixed(2) + '" cy="' + CY + '" r="3.5"/>';
  pts.innerHTML = html;
  var dots = Array.prototype.slice.call(pts.querySelectorAll('circle'));

  function fmt(r) { return 'r = ' + (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r).toFixed(2); }
  function zoneOf(r) { return r > 0.2 ? 'pos' : r < -0.2 ? 'neg' : 'zero'; }

  function render() {
    var r = Math.round(parseFloat(slider.value) * 100) / 100;
    var s = Math.sqrt(Math.max(0, 1 - r * r)), k;
    for (k = 0; k < N; k++) dots[k].setAttribute('cy', (CY - (r * xs[k] + s * zs[k]) * sy).toFixed(2));
    var y = BY0 - BS * r;
    rdot.setAttribute('cy', y.toFixed(1));
    rfill.setAttribute('y2', y.toFixed(1));
    rval.setAttribute('y', (y + 8).toFixed(1));
    rval.textContent = fmt(r);
    out.textContent = fmt(r);
    var z = zoneOf(r);
    zones.forEach(function (t) {
      var on = t.getAttribute('data-z') === z;
      t.setAttribute('fill', on ? '#1c2230' : '#b9b3a5');
      t.setAttribute('font-weight', on ? '700' : '400');
    });
    btns.forEach(function (b) {
      b.classList.toggle('on', Math.abs(parseFloat(b.getAttribute('data-r')) - r) < 1e-9);
    });
  }

  slider.addEventListener('input', render);
  btns.forEach(function (b) {
    b.addEventListener('click', function () { slider.value = b.getAttribute('data-r'); render(); });
  });
  render();
}
function initW_model(root, D) {
  // 연도별 일평균기온의 최솟값·최댓값 [[연도, 최솟값, 최댓값], …] 114개 — 단계 ①의 세로 띠
  var RANGE = [
    [1908,-10.4,27.5],[1909,-10.7,29.7],[1910,-15.4,28.4],[1911,-15.6,28.7],[1912,-12.7,28.4],[1913,-15.9,27.0],
    [1914,-10.3,30.2],[1915,-19.2,28.9],[1916,-16.1,27.4],[1917,-15.8,28.2],[1918,-14.4,29.6],[1919,-13.7,30.3],
    [1920,-14.7,28.1],[1921,-8.8,29.6],[1922,-15.0,29.6],[1923,-16.1,29.1],[1924,-13.0,30.6],[1925,-12.4,28.5],
    [1926,-13.4,28.4],[1927,-15.3,29.1],[1928,-15.1,28.4],[1929,-11.6,30.4],[1930,-12.2,30.7],[1931,-18.9,29.2],
    [1932,-9.9,30.8],[1933,-14.2,29.8],[1934,-13.9,28.5],[1935,-13.1,28.2],[1936,-16.4,27.7],[1937,-11.7,29.7],
    [1938,-14.5,29.0],[1939,-14.3,31.0],[1940,-14.0,28.6],[1941,-15.9,27.6],[1942,-13.9,30.0],[1943,-14.0,30.1],
    [1944,-10.7,30.6],[1945,-13.5,29.5],[1946,-12.3,29.2],[1947,-13.8,27.1],[1948,-12.9,27.5],[1949,-11.1,30.4],
    [1954,-8.4,28.4],[1955,-12.4,27.9],[1956,-12.0,30.3],[1957,-13.6,27.0],[1958,-15.7,28.3],[1959,-16.4,29.5],
    [1960,-13.1,28.6],[1961,-12.9,30.0],[1962,-8.6,29.6],[1963,-15.5,28.5],[1964,-12.4,29.8],[1965,-15.3,27.6],
    [1966,-13.3,29.7],[1967,-15.2,30.2],[1968,-12.2,28.0],[1969,-12.8,27.8],[1970,-14.9,29.5],[1971,-12.9,28.4],
    [1972,-8.3,31.1],[1973,-13.5,30.6],[1974,-11.2,28.9],[1975,-8.6,29.7],[1976,-14.7,27.1],[1977,-12.8,29.6],
    [1978,-12.4,31.6],[1979,-10.5,28.2],[1980,-12.9,25.5],[1981,-12.2,30.5],[1982,-10.3,29.6],[1983,-10.0,28.9],
    [1984,-12.1,29.5],[1985,-13.0,29.7],[1986,-16.4,27.9],[1987,-11.5,26.5],[1988,-8.9,30.5],[1989,-7.7,29.9],
    [1990,-14.0,29.9],[1991,-11.1,29.1],[1992,-6.7,28.4],[1993,-7.9,26.6],[1994,-8.7,33.1],[1995,-7.6,29.3],
    [1996,-9.5,29.8],[1997,-9.7,30.4],[1998,-11.9,27.7],[1999,-9.3,29.9],[2000,-8.7,29.1],[2001,-15.5,30.0],
    [2002,-9.9,30.4],[2003,-12.8,27.0],[2004,-14.3,30.4],[2005,-10.2,30.2],[2006,-11.7,29.5],[2007,-6.4,28.7],
    [2008,-9.0,30.1],[2009,-10.8,29.1],[2010,-13.2,29.2],[2011,-14.5,28.9],[2012,-13.7,31.8],[2013,-13.2,29.3],
    [2014,-9.0,31.4],[2015,-9.8,30.4],[2016,-14.4,31.2],[2017,-9.4,31.4],[2018,-14.8,33.7],[2019,-7.9,31.6],
    [2020,-10.9,30.2],[2021,-14.9,31.7],[2022,-11.8,30.9],[2023,-14.7,30.9],[2024,-11.7,31.8],[2025,-9.7,32.8]
  ];

  // 좌표계 — 오른쪽 패널 그림 영역 x 376~696(연도 1908~2025), y 36~218
  var X0 = 1908, X1 = 2025, PX0 = 376, PX1 = 696, PY1 = 36, PY0 = 218;
  function px(x) { return PX0 + (x - X0) / (X1 - X0) * (PX1 - PX0); }
  function pyA(y) { return PY0 - (y + 20) / 55 * (PY0 - PY1); }   // 단계 ① 축 −20~35℃
  function pyB(y) { return PY0 - (y - 9) / 7 * (PY0 - PY1); }      // 단계 ②~④ 축 9~16℃

  // 최소제곱: a = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)², b = ȳ − a·x̄
  function fit(P) {
    var n = P.length, sx = 0, sy = 0, i;
    for (i = 0; i < n; i++) { sx += P[i][0]; sy += P[i][1]; }
    var mx = sx / n, my = sy / n, num = 0, den = 0;
    for (i = 0; i < n; i++) {
      num += (P[i][0] - mx) * (P[i][1] - my);
      den += (P[i][0] - mx) * (P[i][0] - mx);
    }
    var a = num / den;
    return { a: a, b: my - a * mx };
  }
  var f = fit(D);
  var slopeTxt = (f.a >= 0 ? '+' : '') + (f.a * 100).toFixed(2);   // 기울기 ℃/100년
  var bias1908 = f.a * X0 + f.b;                                     // 편향 = 직선의 1908년 높이

  // 그리기 — 세로 띠(①), 연평균 점(① 축 · ②~④ 축), 회귀선, 숫자 두 개
  var i, x, s = '';
  for (i = 0; i < RANGE.length; i++) {
    x = px(RANGE[i][0]).toFixed(1);
    s += '<line x1="' + x + '" y1="' + pyA(RANGE[i][2]).toFixed(1) + '" x2="' + x + '" y2="' + pyA(RANGE[i][1]).toFixed(1) + '" stroke="#b9b3a5" stroke-width="2" opacity=".6"/>';
  }
  root.querySelector('.bands').innerHTML = s;
  function dots(py) {
    var d = '', j;
    for (j = 0; j < D.length; j++) {
      d += '<circle cx="' + px(D[j][0]).toFixed(1) + '" cy="' + py(D[j][1]).toFixed(1) + '" r="3.5" fill="#2b7fd6" opacity=".55"/>';
    }
    return d;
  }
  root.querySelector('.pts1').innerHTML = dots(pyA);
  root.querySelector('.pts2').innerHTML = dots(pyB);
  var ln = root.querySelector('.fitline');
  ln.setAttribute('x1', px(X0).toFixed(1)); ln.setAttribute('y1', pyB(f.a * X0 + f.b).toFixed(1));
  ln.setAttribute('x2', px(X1).toFixed(1)); ln.setAttribute('y2', pyB(f.a * X1 + f.b).toFixed(1));
  root.querySelector('.nb-slope').textContent = slopeTxt + '℃/100년';
  root.querySelector('.nb-bias').textContent = bias1908.toFixed(1) + '℃';

  // 단계별 표시 요소 — 새로 나타나는 요소만 300ms 페이드, 사라지는 요소는 즉시
  var G = {}, NAMES = ['extra', 'base', 'outline', 'dims', 'yax1', 'yax2', 'bands', 'pts1', 'pts2', 'fitline', 'numbox'];
  var SEL = { extra: '.bd-extra', base: '.bd-base', outline: '.bd-outline', dims: '.bd-dims', yax1: '.yax1', yax2: '.yax2',
              bands: '.bands', pts1: '.pts1', pts2: '.pts2', fitline: '.fitline', numbox: '.numbox' };
  for (i = 0; i < NAMES.length; i++) G[NAMES[i]] = root.querySelector(SEL[NAMES[i]]);
  var VIS = {
    1: ['extra', 'base', 'yax1', 'bands', 'pts1'],
    2: ['base', 'yax2', 'pts2'],
    3: ['outline', 'yax2', 'pts2', 'fitline'],
    4: ['outline', 'dims', 'yax2', 'pts2', 'fitline', 'numbox']
  };
  var LABEL = {
    1: ['실물: 벽돌·배관·간판·나무까지 전부', '하루하루의 기록 41,639일: 날씨·계절·관측 사정 전부'],
    2: ['목적과 무관한 것부터 뺌', '한 해를 값 하나로: 연평균 114개'],
    3: ['형태와 비례만 남음', '관계의 형태: 직선 하나'],
    4: ['모형 = 비례를 담은 숫자 몇 개', '모델 = 관계를 담은 숫자 두 개']
  };
  var lLabel = root.querySelector('.llabel'), rLabel = root.querySelector('.rlabel');
  var btns = root.querySelectorAll('.wbtn');
  var pts2Circles = G.pts2.querySelectorAll('circle');
  function setDotOpacity(v) { for (var j = 0; j < pts2Circles.length; j++) pts2Circles[j].setAttribute('opacity', v); }

  // 페이드 — 이름별 진행 상태를 한 rAF 루프에서 같이 진행. 도중에 다시 눌러도 깨지지 않음
  var anims = {}, raf = 0, DUR = 300;
  function loop(ts) {
    var k, a, p, any = false;
    for (k in anims) {
      a = anims[k];
      if (a.t0 === null) a.t0 = ts;
      p = Math.min(1, (ts - a.t0) / DUR);
      G[k].style.opacity = String(p);
      if (p >= 1) delete anims[k]; else any = true;
    }
    raf = any ? requestAnimationFrame(loop) : 0;
  }
  function show(name, fade) {
    G[name].style.display = '';
    if (fade) {
      G[name].style.opacity = '0';
      anims[name] = { t0: null };
      if (!raf) raf = requestAnimationFrame(loop);
    } else {
      delete anims[name];
      G[name].style.opacity = '1';
    }
  }
  function hide(name) {
    G[name].style.display = 'none';
    delete anims[name];
  }

  var cur = 0;
  function has(list, name) { return list.indexOf(name) >= 0; }
  function setStep(st, instant) {
    if (st === cur || !VIS[st]) return;   // 같은 버튼 재클릭 → 아무 일도 없음
    var prev = VIS[cur] || [], next = VIS[st], j, name, was, now;
    for (j = 0; j < NAMES.length; j++) {
      name = NAMES[j]; was = has(prev, name); now = has(next, name);
      if (now && !was) show(name, !instant);
      else if (!now && was) hide(name);
    }
    setDotOpacity(st >= 3 ? '.25' : '.55');
    lLabel.textContent = LABEL[st][0];
    rLabel.textContent = LABEL[st][1];
    for (j = 0; j < btns.length; j++) btns[j].classList.toggle('on', Number(btns[j].getAttribute('data-step')) === st);
    cur = st;
  }
  for (i = 0; i < NAMES.length; i++) if (!has(VIS[1], NAMES[i])) hide(NAMES[i]);
  for (i = 0; i < btns.length; i++) {
    (function (b) {
      b.addEventListener('click', function () { setStep(Number(b.getAttribute('data-step')), false); });
    })(btns[i]);
  }
  setStep(1, true);
}
  const WIDGET_INIT = {model: initW_model, corr: initW_corr, slopebias: initW_slopebias, procedure: initW_procedure, galton: initW_galton, error: initW_error, modeling3: initW_modeling3, mlLayers: initW_mlLayers, range: initW_range, predict2045: initW_predict2045, extrapolation: initW_extrapolation, causation: initW_causation};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.SEOUL_YEARLY); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
