// 8차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson08.html)와 교재(lesson08.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"SEOUL_YEARLY_OBS":[[1907,5.103,92],[1908,10.427,366],[1909,10.609,365],[1910,10.412,365],[1911,10.655,365],[1912,10.124,366],[1913,10.086,365],[1914,12.029,365],[1915,10.898,365],[1916,10.911,366],[1917,9.859,365],[1918,10.54,365],[1919,11.151,365],[1920,11.408,366],[1921,10.969,365],[1922,10.873,365],[1923,10.699,365],[1924,11.07,366],[1925,10.787,365],[1926,10.557,365],[1927,11.068,365],[1928,11.126,366],[1929,11.49,365],[1930,11.794,365],[1931,10.956,365],[1932,11.676,366],[1933,10.586,365],[1934,10.2,365],[1935,11.269,365],[1936,9.778,366],[1937,11.455,365],[1938,11.013,365],[1939,11.781,365],[1940,10.772,366],[1941,11.223,365],[1942,10.973,365],[1943,11.723,365],[1944,10.892,366],[1945,10.438,365],[1946,11.388,365],[1947,9.656,365],[1948,11.758,366],[1949,11.7,365],[1950,13.478,243],[1953,0.642,31],[1954,11.488,365],[1955,11.513,365],[1956,10.113,366],[1957,10.516,365],[1958,11.637,365],[1959,12.08,365],[1960,12.105,366],[1961,12.455,365],[1962,11.757,365],[1963,11.313,365],[1964,12.221,366],[1965,11.396,365],[1966,11.578,365],[1967,11.676,365],[1968,11.788,366],[1969,10.928,365],[1970,11.422,365],[1971,11.551,365],[1972,11.917,366],[1973,12.097,365],[1974,11.155,365],[1975,12.52,365],[1976,11.48,366],[1977,12.373,365],[1978,12.45,365],[1979,12.507,365],[1980,10.824,366],[1981,11.227,365],[1982,12.559,365],[1983,12.454,365],[1984,11.597,366],[1985,11.618,365],[1986,11.306,365],[1987,11.986,365],[1988,12.121,366],[1989,13.011,365],[1990,12.839,365],[1991,12.398,365],[1992,12.501,366],[1993,12.085,365],[1994,13.612,365],[1995,12.267,365],[1996,12.258,366],[1997,12.957,365],[1998,13.836,365],[1999,13.257,365],[2000,12.714,366],[2001,12.86,365],[2002,12.914,365],[2003,12.87,365],[2004,13.352,366],[2005,12.139,365],[2006,13.062,365],[2007,13.283,365],[2008,12.964,366],[2009,12.953,365],[2010,12.141,365],[2011,12.082,365],[2012,12.269,366],[2013,12.564,365],[2014,13.4,365],[2015,13.622,365],[2016,13.593,366],[2017,13.073,365],[2018,13.002,365],[2019,13.599,365],[2020,13.272,366],[2021,13.752,365],[2022,13.296,365],[2023,14.109,365],[2024,14.875,366],[2025,14.15,365]],"SEOUL_POLY":{"1":[2.37988106,11.40355878],"2":[2.33890375,2.10360671,11.22066603],"3":[4.90152638,1.43516351,1.46667371,11.26414749],"4":[-2.33904775,5.45332529,1.86488875,1.4127803,11.25364381],"5":[39.03417703,-14.30365814,-3.29804002,3.68183865,1.81437816,11.22148225],"6":[-194.02061548,107.74587294,38.2526018,-17.20602359,-0.06854896,2.34326759,11.26726064],"7":[-1239.16635036,336.29145369,482.17218159,-97.16052545,-50.55480291,8.38939854,3.11836635,11.18705392],"8":[140.47188125,-1305.63519092,288.18161498,502.41114087,-91.80337655,-52.28551932,8.18284075,3.15428529,11.1886208],"9":[9699.95950441,-5179.33378784,-4847.83060574,2177.73977785,938.03250774,-300.94682163,-72.77377062,15.59622411,3.42954213,11.14387688]}};
function initW_r2denom(root, D) {
  // D는 받되 사용하지 않는다 — 활동지 문제 6의 고정 수치(영화 가·나·다)만 쓴다.
  const CX = [120, 243, 366];              // 슬롯 가로 위치
  const K = 1.98182;                       // 1만 명당 세로 픽셀 (0~110 → y 244~26)
  const MN = '−';                     // 빼기 기호
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const py = v => 244 - v * K;             // 값 → y
  const gx = r => 452 + (clamp(r, -2, 1) + 2) / 3 * 254;   // R² → 게이지 x

  let d = 30;                              // 퍼짐
  let off = [10, 0, -10];                  // 예측 − 실젯
  let area = 'both';                       // 넓이 보기

  const q = s => root.querySelector(s);
  const svg = q('svg');
  const gBase = q('[data-dyn="base"]'), gMine = q('[data-dyn="mine"]');
  const gErr = q('[data-dyn="errs"]'), gDot = q('[data-dyn="dots"]');
  const gRow = q('[data-dyn="rows"]');
  const mLine = q('[data-dyn="mean"]'), mLab = q('[data-t="mean"]');
  const tSse = q('[data-t="sse"]'), tSst = q('[data-t="sst"]');
  const tR2 = q('[data-t="r2"]'), tOut = q('[data-t="out"]');
  const ndl = q('.ndl'), rng = q('[data-k="d"]'), dv = q('[data-v="d"]');
  const hits = Array.from(root.querySelectorAll('.hit'));
  const btns = Array.from(root.querySelectorAll('.wbtn'));

  const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const sgn = v => (v === 0 ? '0' : (v < 0 ? MN : '+') + Math.abs(v));
  const f2 = v => { const s = v.toFixed(2); return s === '-0.00' ? '0.00' : s.replace('-', MN); };
  const acts = () => [60 - d, 60, 60 + d];

  // 예측값 0~110, |off| ≤ 40 을 함께 만족시킨다
  function normalize() {
    const a = acts();
    for (let i = 0; i < 3; i++) {
      const p = clamp(Math.round(a[i] + off[i]), 0, 110);
      off[i] = clamp(p - a[i], -40, 40);
    }
  }

  function stats() {
    const a = acts();
    const mean = (a[0] + a[1] + a[2]) / 3;          // 대칭이라 60이지만 계산으로 구한다
    let sse = 0, sst = 0;
    for (let i = 0; i < 3; i++) {
      sse += off[i] * off[i];
      sst += (a[i] - mean) * (a[i] - mean);
    }
    return { a: a, mean: mean, sse: sse, sst: sst, r2: sst > 0 ? 1 - sse / sst : 0 };
  }

  const sq = (x, y, s, fill, op, st) =>
    '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + s.toFixed(1) +
    '" height="' + s.toFixed(1) + '" fill="' + fill + '" opacity="' + op +
    '" stroke="' + st + '" stroke-width="1"/>';

  // 게이지 바늘
  let nowX = 0, seq = 0;
  function setNeedle(x) {
    ndl.setAttribute('x1', x.toFixed(1));
    ndl.setAttribute('x2', x.toFixed(1));
    nowX = x;
  }
  function tween(to) {
    const from = nowX, id = ++seq;
    let t0 = -1;
    const step = ts => {
      if (id !== seq) return;
      if (t0 < 0) t0 = ts;
      const k = Math.min(1, (ts - t0) / 200);
      setNeedle(from + (to - from) * (1 - (1 - k) * (1 - k)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const CT = [474, 534, 584, 634, 688], RY = [66, 88, 110];

  function render(anim) {
    const s = stats(), a = s.a, ym = py(s.mean);

    mLine.setAttribute('y1', ym.toFixed(1));
    mLine.setAttribute('y2', ym.toFixed(1));
    mLab.setAttribute('y', (ym - 7).toFixed(1));
    mLab.textContent = '평균 ' + (Math.round(s.mean * 10) / 10) + '만 명';

    let hb = '', hm = '', he = '', hd = '', hr = '';
    for (let i = 0; i < 3; i++) {
      const cx = CX[i], av = a[i], pv = av + off[i];
      const yA = py(av), yP = py(pv);
      const sb = Math.abs(av - s.mean) * K, sm = Math.abs(off[i]) * K;
      if (sb > 0.5) hb += sq(cx - sb / 2, Math.min(yA, ym), sb, '#9a9a9a', '0.18', '#aaaaaa');
      if (sm > 0.5) hm += sq(cx - sm / 2, Math.min(yA, yP), sm, '#f4b400', '0.35', '#e8930c');
      he += '<line x1="' + cx + '" y1="' + yA.toFixed(1) + '" x2="' + cx + '" y2="' + yP.toFixed(1) +
            '" stroke="#e45756" stroke-width="2"/>';
      hd += '<circle cx="' + cx + '" cy="' + yA.toFixed(1) + '" r="5" fill="#2b7fd6"/>' +
            '<circle cx="' + cx + '" cy="' + yP.toFixed(1) + '" r="6.5" fill="#f4b400" stroke="#e8930c" stroke-width="2"/>';
      const err = av - pv;
      const cells = [String(av), String(pv), sgn(err), String(err * err),
                     String(Math.round((av - s.mean) * (av - s.mean)))];
      for (let c = 0; c < 5; c++) {
        hr += '<text x="' + CT[c] + '" y="' + RY[i] + '" text-anchor="middle" font-size="12" fill="#1c2230">' +
              cells[c] + '</text>';
      }
    }
    gBase.innerHTML = hb; gMine.innerHTML = hm; gErr.innerHTML = he; gDot.innerHTML = hd; gRow.innerHTML = hr;
    gBase.setAttribute('visibility', area === 'mine' ? 'hidden' : 'visible');
    gMine.setAttribute('visibility', area === 'base' ? 'hidden' : 'visible');

    for (let i = 0; i < 3; i++) {
      const pv = a[i] + off[i];
      hits[i].setAttribute('x', String(CX[i] - 15));
      hits[i].setAttribute('y', (py(pv) - 10).toFixed(1));
      hits[i].setAttribute('aria-valuenow', String(pv));
    }

    tSse.textContent = String(Math.round(s.sse));
    tSst.textContent = String(Math.round(s.sst));
    tR2.textContent = f2(s.r2);
    tR2.setAttribute('fill', Number(s.r2.toFixed(2)) >= 0 ? '#a97a00' : '#e45756');
    dv.textContent = d + '만 명';
    tOut.textContent = '기준 제곱오차 합 ' + Math.round(s.sst) + ' · 내 제곱오차 합 ' +
                       Math.round(s.sse) + ' · R² ' + f2(s.r2);

    const nx = gx(s.r2);
    if (anim && !(mq && mq.matches)) tween(nx);
    else { seq++; setNeedle(nx); }
  }

  rng.addEventListener('input', () => { d = +rng.value; normalize(); render(false); });

  btns.forEach(b => b.addEventListener('click', () => {
    const k = b.getAttribute('data-act');
    if (k === 'mean') { off = [d, 0, -d]; normalize(); render(true); }
    else if (k === 'reset') { d = 30; rng.value = '30'; off = [10, 0, -10]; normalize(); render(true); }
    else if (k.indexOf('area-') === 0) {
      area = k.slice(5);
      btns.forEach(x => {
        const a2 = x.getAttribute('data-act');
        if (a2.indexOf('area-') === 0) x.classList.toggle('on', x === b);
      });
      render(false);
    }
  }));

  // viewBox 좌표로 변환 — CSS가 SVG를 늘이므로 clientY를 그대로 쓰지 않는다
  function vbY(e) {
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const m = svg.getScreenCTM();
    return m ? p.matrixTransform(m.inverse()).y : 0;
  }
  function setPred(i, v) {
    const a = acts();
    off[i] = clamp(clamp(Math.round(v), 0, 110) - a[i], -40, 40);
    render(false);
  }

  let drag = -1;
  hits.forEach((h, i) => {
    h.addEventListener('pointerdown', e => {
      drag = i; h.setPointerCapture(e.pointerId); e.preventDefault();
    });
    h.addEventListener('pointermove', e => {
      if (drag !== i) return;
      setPred(i, (244 - vbY(e)) / K);
      e.preventDefault();
    });
    const end = e => {
      if (drag !== i) return;
      drag = -1;
      if (h.hasPointerCapture(e.pointerId)) h.releasePointerCapture(e.pointerId);
    };
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
    h.addEventListener('keydown', e => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      setPred(i, acts()[i] + off[i] + (e.key === 'ArrowUp' ? 1 : -1));
      e.preventDefault();
    });
    h.addEventListener('focus', () => { h.style.outline = '2px solid #2b7fd6'; });
    h.addEventListener('blur', () => { h.style.outline = 'none'; });
  });

  normalize();
  render(false);
}

function initW_r2swap(root, D) {
  var q = function (s) { return root.querySelector(s); };
  var GX = function (yr) { return 56 + (yr - 1900) * 3.18462; };
  var GY = function (t) { return 240 - (t + 1) * 12.5882; };
  var YR0 = 1900, YR1 = 2030;

  // 자료 점검 — 비었거나 모양이 다르면 정적 초기 상태를 그대로 두고 종료
  var SRC = (D && D.SEOUL_YEARLY_OBS) || (Array.isArray(D) ? D : []);
  var rows = SRC.filter(function (r) {
    return r && r.length >= 3 && isFinite(r[0]) && isFinite(r[1]) && isFinite(r[2]);
  });
  var keep = rows.filter(function (r) { return r[2] >= 300; });
  var drop = rows.filter(function (r) { return r[2] < 300; });
  if (keep.length < 2 || drop.length < 1) return;

  // 최소제곱 직선(기울기·편향)
  function fit(a) {
    var n = a.length, mx = 0, my = 0, i;
    for (i = 0; i < n; i++) { mx += a[i][0]; my += a[i][1]; }
    mx /= n; my /= n;
    var sxy = 0, sxx = 0, dx, dy;
    for (i = 0; i < n; i++) {
      dx = a[i][0] - mx; dy = a[i][1] - my;
      sxy += dx * dy; sxx += dx * dx;
    }
    var s = sxy / sxx;
    return [s, my - s * mx];
  }
  // 평가 자료에서 제곱오차 합·기준 제곱오차 합·결정계수
  function score(a, f) {
    var n = a.length, my = 0, i;
    for (i = 0; i < n; i++) my += a[i][1];
    my /= n;
    var sse = 0, sst = 0, e, d;
    for (i = 0; i < n; i++) {
      e = a[i][1] - (f[0] * a[i][0] + f[1]); sse += e * e;
      d = a[i][1] - my; sst += d * d;
    }
    return { sse: sse, sst: sst, r2: 1 - sse / sst };
  }

  var fKeep = fit(keep), fAll = fit(rows);
  var kLab = keep.length + '개 연도', aLab = rows.length + '개 연도';
  var ST = {
    's-a': { tr: kLab, ev: kLab, f: fKeep, e: keep, dot: 2, full: false, ghost: false },
    's-b': { tr: aLab, ev: aLab, f: fAll, e: rows, dot: 0, full: true, ghost: false },
    's-c': { tr: aLab, ev: kLab, f: fAll, e: keep, dot: 1, full: false, ghost: true }
  };

  var fitEl = q('.fit'), ghostEl = q('.ghost');
  var lead = q('.exlead'), extx = q('.extx');
  var vTr = q('.v-train'), vEv = q('.v-eval'), vSse = q('.v-sse'), vSst = q('.v-sst'), vR2 = q('.v-r2');
  var out = q('.wout');
  var dots = [q('.d0'), q('.d1'), q('.d2')];
  var btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));

  // 관측일 300일 이상 연도의 점
  q('.pts').innerHTML = keep.map(function (r) {
    return '<circle cx="' + GX(r[0]).toFixed(1) + '" cy="' + GY(r[1]).toFixed(1) + '" r="3.2"/>';
  }).join('');

  // 제외 후보 연도 — 링 + 원
  q('.exg').innerHTML = drop.map(function (r) {
    var cx = GX(r[0]).toFixed(1), cy = GY(r[1]).toFixed(1);
    return '<circle class="exring" cx="' + cx + '" cy="' + cy + '" r="8" fill="none" stroke="#e45756" stroke-width="1.5" opacity="0"/>' +
      '<circle class="exdot" cx="' + cx + '" cy="' + cy + '" r="4.5" fill="none" stroke="#e45756" stroke-width="1.5" stroke-dasharray="2 2"/>';
  }).join('');
  var rings = Array.prototype.slice.call(root.querySelectorAll('.exring'));
  var exds = Array.prototype.slice.call(root.querySelectorAll('.exdot'));

  // 관측일이 가장 짧은 연도의 상시 라벨
  var worst = drop.reduce(function (m, r) { return r[2] < m[2] ? r : m; }, drop[0]);
  var wx = GX(worst[0]), wy = GY(worst[1]);
  lead.setAttribute('points', wx.toFixed(1) + ',' + wy.toFixed(1) + ' ' + (wx + 11.2).toFixed(1) + ',' + (wy - 9.4).toFixed(1));
  extx.setAttribute('x', (wx + 15.2).toFixed(1));
  extx.setAttribute('y', (wy - 13.4).toFixed(1));
  extx.textContent = worst[0] + '년 · ' + worst[1].toFixed(2) + '℃ · ' + worst[2] + '일';

  // 직선의 두 끝점(1900 · 2030)을 화면 좌표로
  function ends(f) { return [GY(f[0] * YR0 + f[1]), GY(f[0] * YR1 + f[1])]; }
  var gKeep = ends(fKeep);
  ghostEl.setAttribute('y1', gKeep[0].toFixed(1));
  ghostEl.setAttribute('y2', gKeep[1].toFixed(1));

  // 동작 최소화 설정 확인 — 전역 이름 대신 root에서 거슬러 올라간다
  var reduce = false;
  try {
    var view = root.ownerDocument && root.ownerDocument.defaultView;
    reduce = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (err) { reduce = false; }

  var curLine = ends(fKeep), curR = [5, 5, 7], gen = 0, first = true;

  function paint(line, radii) {
    curLine = line; curR = radii;
    fitEl.setAttribute('y1', line[0].toFixed(1));
    fitEl.setAttribute('y2', line[1].toFixed(1));
    for (var i = 0; i < dots.length; i++) dots[i].setAttribute('r', radii[i].toFixed(2));
  }

  function animate(lt, dt) {
    var lf = [curLine[0], curLine[1]], df = [curR[0], curR[1], curR[2]];
    gen++;
    var mine = gen, t0 = -1;
    if (reduce || first) { paint(lt, dt); return; }
    function frame(ts) {
      if (mine !== gen) return;
      if (t0 < 0) t0 = ts;
      var el = ts - t0;
      var k1 = Math.min(1, el / 260), k2 = Math.min(1, el / 160);
      var e1 = 1 - Math.pow(1 - k1, 3), e2 = 1 - Math.pow(1 - k2, 3);
      paint([lf[0] + (lt[0] - lf[0]) * e1, lf[1] + (lt[1] - lf[1]) * e1],
        [df[0] + (dt[0] - df[0]) * e2, df[1] + (dt[1] - df[1]) * e2, df[2] + (dt[2] - df[2]) * e2]);
      if (k1 < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setState(key) {
    var s = ST[key];
    if (!s) return;
    btns.forEach(function (b) {
      b.className = b.getAttribute('data-act') === key ? 'wbtn on' : 'wbtn';
    });

    // 제외 후보 표시
    exds.forEach(function (c) {
      c.setAttribute('fill', s.full ? '#e45756' : 'none');
      c.setAttribute('stroke-dasharray', s.full ? 'none' : '2 2');
    });
    rings.forEach(function (c) { c.setAttribute('opacity', s.full ? '0.5' : '0'); });
    ghostEl.setAttribute('opacity', s.ghost ? '1' : '0');

    // 수치
    var v = score(s.e, s.f);
    vTr.textContent = s.tr;
    vEv.textContent = s.ev;
    vSse.textContent = v.sse.toFixed(2);
    vSst.textContent = v.sst.toFixed(2);
    vR2.textContent = v.r2.toFixed(2);
    out.textContent = 'SSE ' + v.sse.toFixed(2) + ' · SST ' + v.sst.toFixed(2) + ' · R² ' + v.r2.toFixed(2);

    var dt = [5, 5, 5];
    dt[s.dot] = 7;
    for (var i = 0; i < dots.length; i++) {
      if (i === s.dot) { dots[i].setAttribute('stroke', '#1c2230'); dots[i].setAttribute('stroke-width', '2'); }
      else { dots[i].setAttribute('stroke', 'none'); dots[i].setAttribute('stroke-width', '0'); }
    }
    animate(ends(s.f), dt);
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { setState(b.getAttribute('data-act')); });
  });

  setState('s-a');    // 최초 그리기는 애니메이션 없이
  first = false;
}

function initW_degsplit(root, D) {
  // 데이터: D.SEOUL_YEARLY_OBS = [[연도, 연평균기온, 관측일수], …] 117개 · D.SEOUL_POLY = {1..9: 내림차순 계수}
  var OBS = (D && D.SEOUL_YEARLY_OBS) || [];
  var C = (D && D.SEOUL_POLY) || {};
  var q = function (s) { return root.querySelector(s); };
  var f1 = function (n) { return n.toFixed(1); };

  // 좌표계 고정(슬라이더와 무관)
  var sx = function (yr) { return 56 + (yr - 1908) / 142 * 640; };
  var sy = function (t) { return 250 - (t - 8) / 8 * 230; };
  var dx = function (k) { return 420 + (k - 1) * 32; };          // 궤적 패널 x
  var sy2 = function (v) { return 410 - v / 1.2 * 110; };        // 궤적 패널 y

  // 학습·평가 분할(차수와 무관하게 고정)
  var USE = OBS.filter(function (r) { return r[2] >= 300; });
  var TR = USE.filter(function (r) { return r[0] < 2005; });
  var EV = USE.filter(function (r) { return r[0] >= 2005; });

  // 다항식은 실시간 적합 없이 저장 계수만 호너법으로 평가
  var XS = function (yr) { return (yr - 1950) / 100; };
  var poly = function (c, yr) {
    var x = XS(yr), v = 0;
    for (var i = 0; i < c.length; i++) v = v * x + c[i];
    return v;
  };
  var mae = function (c, rows) {
    var s = 0;
    for (var i = 0; i < rows.length; i++) s += Math.abs(poly(c, rows[i][0]) - rows[i][1]);
    return rows.length ? s / rows.length : 0;
  };

  var f3 = function (v) { return v.toFixed(3); };
  var f50 = function (v) {
    var sgn = v < 0 ? '−' : '', a = Math.abs(v);
    if (a < 100) return sgn + f1(a);
    return sgn + String(Math.round(a)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  var HALO = ' stroke="#fff" stroke-width="3" paint-order="stroke"';

  // 산점도 점(한 번만 그린다)
  q('.train').innerHTML = TR.map(function (r) {
    return '<circle cx="' + f1(sx(r[0])) + '" cy="' + f1(sy(r[1])) + '" r="3"/>';
  }).join('');
  q('.test').innerHTML = EV.map(function (r) {
    return '<circle cx="' + f1(sx(r[0])) + '" cy="' + f1(sy(r[1])) + '" r="3.2"/>';
  }).join('');
  q('.nTr').textContent = '학습 ' + TR.length + '개';
  q('.nEv').textContent = '평가 ' + EV.length + '개';

  // 곡선: 1908~2050을 0.5년 간격으로 285점 표본, 상자 밖 구간은 잘라 낸다
  var LO = 8, HI = 16;
  var outs = [];                                   // 상자를 벗어나는 위치
  function cross(y0, t0, y1, t1, bnd) {            // 경계 통과 지점의 연도
    return y0 + (bnd - t0) * (y1 - y0) / (t1 - t0);
  }
  function seg(c, ya, yb) {
    var d = '', pen = false, py = null, pt = null;
    for (var yr = ya; yr <= yb + 1e-9; yr += 0.5) {
      var t = poly(c, yr), inb = t >= LO && t <= HI;
      if (inb) {
        if (!pen) {
          if (py !== null) {
            var b = pt > HI ? HI : LO;
            var cy = cross(py, pt, yr, t, b);
            d += 'M' + f1(sx(cy)) + ' ' + f1(sy(b));
            d += 'L' + f1(sx(yr)) + ' ' + f1(sy(t));
          } else {
            d += 'M' + f1(sx(yr)) + ' ' + f1(sy(t));
          }
        } else {
          d += 'L' + f1(sx(yr)) + ' ' + f1(sy(t));
        }
        pen = true;
      } else {
        if (pen) {
          var b2 = t > HI ? HI : LO;
          var cy2 = cross(py, pt, yr, t, b2);
          d += 'L' + f1(sx(cy2)) + ' ' + f1(sy(b2));
          outs.push([sx(cy2), t > HI ? 1 : -1]);
          pen = false;
        }
      }
      py = yr; pt = t;
    }
    return d;
  }

  // 상자 밖 표식 · 2050년 예측 표식
  function marks(c) {
    var s = '', up = null, dn = null;
    for (var i = 0; i < outs.length; i++) {
      if (outs[i][1] > 0 && up === null) up = outs[i][0];
      if (outs[i][1] < 0 && dn === null) dn = outs[i][0];
    }
    function one(x, glyph, ty) {                      // 상·하단 테두리 안쪽, 구역 이름 줄과 겹치지 않는 높이
      var end = x > 600;
      return '<text x="' + f1(x) + '" y="' + ty + '" font-size="13" fill="#b07a00" text-anchor="middle"' + HALO + '>' + glyph + '</text>'
        + '<text x="' + f1(end ? x - 10 : x + 10) + '" y="' + ty + '" font-size="13" fill="#b07a00" text-anchor="' + (end ? 'end' : 'start') + '"' + HALO + '>축 밖</text>';
    }
    if (up !== null) s += one(up, '▲', 58);
    if (dn !== null) s += one(dn, '▼', 244);
    var p = poly(c, 2050);
    if (p >= LO && p <= HI) {
      // ◆는 sx(2050) 자리, 값 라벨은 바로 위. 상자 위쪽에 붙는 경우만 구역 이름 줄을 피해 아래로 내린다
      var yd = sy(p), ly = yd < 62 ? yd + 24 : yd - 10;
      s += '<text x="693" y="' + f1(yd + 5) + '" font-size="14" fill="#b07a00" text-anchor="middle"' + HALO + '>◆</text>';
      s += '<text x="684" y="' + f1(ly) + '" font-size="13" fill="#b07a00" text-anchor="end"' + HALO + '>2050년 예측 ' + f50(p) + '℃</text>';
    }
    return s;
  }

  // 막대(폭만 전환) · 궤적(즉시)
  var bar1 = q('.bar1'), bar2 = q('.bar2'), v1 = q('.v1'), v2 = q('.v2');
  function setBar(rect, txt, val, y) {
    var over = val > 2, w = Math.min(val, 2) / 2 * 200;
    rect.setAttribute('width', f1(w));
    rect.style.width = f1(w) + 'px';
    txt.setAttribute('x', over ? '262' : f1(56 + w + 8));
    txt.textContent = (over ? '▶ ' : '') + f3(val) + '℃';
    txt.setAttribute('y', y);
  }

  var seen = {}, curve = q('.cvA'), spare = q('.cvB'), first = true;
  var motion = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  function trace(kNow) {
    var ks = Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
    var pts = ks.map(function (k) {
      var v = seen[k], y = v > 1.2 ? 285 : sy2(v);
      return [dx(k), y, v, k];
    });
    q('.trace').setAttribute('points', pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '));
    q('.tdots').innerHTML = pts.map(function (p) {
      var on = p[3] === kNow;
      if (p[2] > 1.2) {
        // 1.2℃ 위는 285에 ▲로 고정. 값은 현재 차수만 표기(이웃 차수와 32px 간격이라 셋째 자리 라벨이 겹친다)
        return '<text x="' + f1(p[0]) + '" y="292" font-size="13" fill="#d64545" text-anchor="middle" opacity="' + (on ? 1 : 0.6) + '">▲</text>'
          + (on ? '<text x="' + f1(p[0]) + '" y="277" font-size="12" fill="#d64545" text-anchor="middle"' + HALO + '>' + f3(p[2]) + '</text>' : '');
      }
      return '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (on ? 4 : 3) + '" fill="#d64545" opacity="' + (on ? 1 : 0.6) + '"/>';
    }).join('');
  }

  var out = q('[data-t="out"]');
  var slider = q('input[data-k="deg"]');

  function render(k) {
    var c = C[k];
    if (!c) { out.textContent = '차수 1'; return; }
    var eTr = mae(c, TR), eEv = mae(c, EV), p50 = poly(c, 2050);

    outs = [];
    var ds = seg(c, 1908, 2005), dd = seg(c, 2005, 2050);
    spare.querySelector('.cs').setAttribute('d', ds);
    spare.querySelector('.cd').setAttribute('d', dd);
    spare.style.opacity = '1';
    curve.style.opacity = '0';
    var tmp = curve; curve = spare; spare = tmp;

    q('.marks').innerHTML = marks(c);
    setBar(bar1, v1, eTr, '317');
    setBar(bar2, v2, eEv, '365');
    seen[k] = eEv;
    trace(k);

    out.textContent = (k === 1 ? '1차(직선)' : k + '차')
      + ' · 학습 오차 ' + f3(eTr) + '℃'
      + ' · 평가 오차 ' + f3(eEv) + '℃'
      + ' · 2050년 예측 ' + f50(p50) + '℃'
      + (k === 2 ? ' · 직선보다 평가 오차 작음' : '');

    // 첫 그림은 전환 없이 완성 상태로 두고, 그다음부터 막대 폭·곡선 크로스페이드에만 시간을 쓴다
    if (first) {
      first = false;
      if (motion) {
        bar1.style.transition = 'width .3s ease';
        bar2.style.transition = 'width .3s ease';
        curve.style.transition = 'opacity .2s linear';
        spare.style.transition = 'opacity .2s linear';
      }
    }
  }

  slider.addEventListener('input', function () {
    var k = parseInt(slider.value, 10);
    if (!(k >= 1 && k <= 9) || !C[k]) { k = 1; slider.value = '1'; }
    render(k);
  });
  render(1);
}

function initW_nearfar(root, D) {
  // 좌표: x 연도 1995~2050 → 52~420, y 기온 8~20℃ → 215~18
  const sx = yr => 52 + (yr - 1995) / 55 * 368;
  const sy = t => 215 - (t - 8) / 12 * 197;
  const xx = yr => (yr - 1950) / 100;                       // degsplit과 같은 변환
  const hz = (c, x) => { let a = 0; for (let i = 0; i < c.length; i++) a = a * x + c[i]; return a; };

  const OBS = (D && D.SEOUL_YEARLY_OBS) || (Array.isArray(D) ? D : []);
  const C = (D && D.SEOUL_POLY) || {};
  const ACT = new Map();                                    // 관측일 300일 이상만
  for (const r of OBS) if (r[2] >= 300) ACT.set(r[0], r[1]);

  const q = s => root.querySelector(s);
  const g1 = q('.ptr1'), g2 = q('.ptr2');
  const hl = q('.hl'), hlab = q('.hlab');
  const vs = { 0: q('.v0'), 1: q('.v1'), 9: q('.v9'), a: q('.va'), d: q('.vd') };
  const out = q('[data-t="out"]');
  const sl = q('input[type="range"]');

  // ① 산점도: 학습 1995~2004, 평가 2005~2025
  const dots = (lo, hi) => {
    let s = '';
    for (let y = lo; y <= hi; y++) {
      const v = ACT.get(y);
      if (v === undefined) continue;
      s += '<circle cx="' + sx(y).toFixed(1) + '" cy="' + sy(v).toFixed(1) + '" r="3.5"/>';
    }
    return s;
  };
  g1.innerHTML = dots(1995, 2004);
  g2.innerHTML = dots(2005, 2025);

  // ② 곡선: 플롯 상자 안쪽만 그린다(clipPath는 참조에 id가 필요해 계약상 쓸 수 없으므로 경계에서 선형 보간으로 자른다)
  const TOP = 18, BOT = 215;
  const edge = (o, i) => {                                   // o 바깥, i 안쪽
    const b = o[1] < TOP ? TOP : BOT;
    const t = (b - o[1]) / (i[1] - o[1]);
    return [o[0] + t * (i[0] - o[0]), b];
  };
  const P = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
  const curve = (c, ya, yb) => {
    const n = Math.round((yb - ya) / 0.2);
    let d = '', pen = false, pp = null;
    for (let i = 0; i <= n; i++) {
      const yr = ya + i * 0.2;
      const p = [sx(yr), sy(hz(c, xx(yr)))];
      const inside = p[1] >= TOP && p[1] <= BOT;
      if (inside) {
        if (!pen && pp) d += 'M' + P(edge(pp, p)) + 'L' + P(p);
        else d += (pen ? 'L' : 'M') + P(p);
        pen = true;
      } else {
        if (pen && pp) d += 'L' + P(edge(p, pp));
        pen = false;
      }
      pp = p;
    }
    return d;
  };
  q('.c1s').setAttribute('d', curve(C[1], 1995, 2005));
  q('.c1d').setAttribute('d', curve(C[1], 2005, 2050));
  q('.c9s').setAttribute('d', curve(C[9], 1995, 2005));
  q('.c9d').setAttribute('d', curve(C[9], 2005, 2050));

  // ③ ▲ 축 밖: 9차 곡선이 20℃ 위로 벗어나는 지점
  let ex = null;
  for (let y = 2005; y <= 2050; y += 0.01) { if (hz(C[9], xx(y)) > 20) { ex = y; break; } }
  if (ex === null) q('.ptr').setAttribute('opacity', '0');
  else {
    const cx = Math.min(sx(ex) + 9, 360);                    // 글자까지 플롯 상자 안에 남는 한계
    q('.ptri').setAttribute('d', 'M' + cx.toFixed(1) + ' 40 L' + (cx + 5.5).toFixed(1) + ' 50 L' + (cx - 5.5).toFixed(1) + ' 50 Z');
    q('.ptxt').setAttribute('x', (cx + 11.5).toFixed(1));
  }

  // ④ 표시 자릿수: 소수 둘째 자리, |값| 1000 이상은 세 자리 구분 쉼표 + 소수 첫째 자리
  const num = v => {
    const a = Math.abs(v);
    let s;
    if (a >= 1000) {
      const p = a.toFixed(1).split('.');
      s = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1];
    } else s = a.toFixed(2);
    return (v < 0 ? '−' : '') + s;
  };
  const sgn = v => (v < 0 ? '−' : '+') + num(Math.abs(v));

  // 값 칸 폭 134 안에 들어오도록 글꼴 자동 축소(최소 13)
  const wid = (s, fs) => {
    let w = 0;
    for (const ch of s) w += ch.charCodeAt(0) < 256 ? 0.58 : 1;
    return w * fs;
  };
  const put = (el, s) => {
    let fs = 20;
    while (fs > 13 && wid(s, fs) > 134) fs -= 0.5;
    el.textContent = s;
    el.setAttribute('font-size', fs.toFixed(1));
  };

  // ⑤ 갱신(슬라이더 추적이므로 즉시 반영)
  function draw(yr) {
    const p1 = hz(C[1], xx(yr)), p9 = hz(C[9], xx(yr));
    const a = ACT.get(yr);
    const x = sx(yr);
    hl.setAttribute('x1', x.toFixed(1)); hl.setAttribute('x2', x.toFixed(1));
    if (x > 396) { hlab.setAttribute('x', (x - 5).toFixed(1)); hlab.setAttribute('text-anchor', 'end'); }
    else if (x < 76) { hlab.setAttribute('x', (x + 5).toFixed(1)); hlab.setAttribute('text-anchor', 'start'); }
    else { hlab.setAttribute('x', x.toFixed(1)); hlab.setAttribute('text-anchor', 'middle'); }
    hlab.textContent = yr + '년';
    put(vs[0], String(yr));
    put(vs[1], num(p1) + '℃');
    put(vs[9], num(p9) + '℃');
    if (a === undefined) {
      put(vs.a, '실제값 없음');
      vs.a.setAttribute('fill', '#6b7385');
      vs.d.textContent = '';
      vs.d.setAttribute('fill', '#1c2230');
      out.textContent = yr + '년 · 1차 ' + num(p1) + '℃ · 9차 ' + num(p9) + '℃ · 실제값 없음';
    } else {
      const d = p9 - a;
      put(vs.a, num(a) + '℃');
      vs.a.setAttribute('fill', '#1c2230');
      put(vs.d, sgn(d) + '℃');
      vs.d.setAttribute('fill', d >= 10 ? '#d64545' : '#1c2230');
      out.textContent = yr + '년 · 1차 ' + num(p1) + '℃ · 9차 ' + num(p9) + '℃ · 실제 ' + num(a)
        + '℃ · 9차 − 실제 ' + sgn(d) + '℃';
    }
  }

  sl.addEventListener('input', () => draw(Number(sl.value)));
  draw(Number(sl.value));
}
  const WIDGET_INIT = {r2denom: initW_r2denom, r2swap: initW_r2swap, degsplit: initW_degsplit, nearfar: initW_nearfar};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
