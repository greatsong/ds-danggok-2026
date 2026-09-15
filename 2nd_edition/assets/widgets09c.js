// 9차시(군집) 인터랙티브 위젯 — lesson09.html과 lesson09-lab.html이 함께 사용한다.
// 데이터는 assets/soccer_data.js 의 window.SOCCER_DATA 하나뿐이며 scripts/lesson09_soccer_widgets.py 가 만든다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.SOCCER_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.

var S09 = {
  NS: 'http://www.w3.org/2000/svg',
  CLU: ['#f4b400', '#54a24b', '#3ba6a0', '#2b7fd6'],          // 묶음 ㉮ ㉯ ㉰ ㉱
  CLUT: ['#c28f00', '#3f7a38', '#2b7a75', '#1f5f9e'],         // 같은 색의 글자용(노랑은 어둡게)
  POS: { FW: '#d97757', MF: '#6b8fb5', DF: '#8e7cc3' },
  POSN: { FW: '공격수', MF: '미드필더', DF: '수비수' },
  SYM: ['㉮', '㉯', '㉰', '㉱'],
  GRAY: '#b6b0a2'
};

S09.ticks = function (lo, hi, n) {
  var span = hi - lo, step = Math.pow(10, Math.floor(Math.log(span / n) / Math.LN10));
  var best = step;
  [1, 2, 2.5, 5, 10].forEach(function (m) { if (span / (step * m) >= n - 1) best = step * m; });
  var out = [], v = Math.ceil(lo / best) * best;
  for (; v <= hi + best * 1e-6 && out.length < 12; v += best) out.push(Math.round(v / best) * best);
  return out;
};
S09.num = function (v) {
  var a = Math.abs(v), t = a >= 100 ? Math.round(a).toLocaleString('en-US')
    : a >= 10 ? (Math.round(a * 10) / 10).toString() : (Math.round(a * 100) / 100).toString();
  return (v < 0 ? '−' : '') + t;
};
S09.el = function (doc, tag, attrs, text) {
  var e = doc.createElementNS(S09.NS, tag);
  Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
  if (text !== undefined) e.textContent = text;
  return e;
};

// ─────────────────────────────────────────────────────────────────────────
// 1. ruler — 단위 바꾸기: 슈팅(0~100)과 시장 가치(만 유로)
// ─────────────────────────────────────────────────────────────────────────
function initW_ruler(root, D) {
  var R = D.ruler, NM = D.n, N = NM.length;
  var q = function (s) { return root.querySelector(s); };
  var doc = root.ownerDocument, view = doc && doc.defaultView;
  var reduce = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var raf = (view && view.requestAnimationFrame) ? function (f) { return view.requestAnimationFrame(f); } : null;

  var A = R.sh, B = R.va, zA = R.zsh, zB = R.zva;     // A 슈팅 · B 시장 가치(만 유로)
  var PX0 = 76, PX1 = 452, PY0 = 48, PY1 = 300;
  var aLo = Math.min.apply(null, A), aHi = Math.max.apply(null, A);
  var bLo = 0, bHi = Math.max.apply(null, B);
  var pad = (aHi - aLo) * 0.06;
  aLo -= pad; aHi += pad;
  bHi *= 1.06;

  function gx(v, m) { return m === 'raw' ? PX0 + (v - aLo) / (aHi - aLo) * (PX1 - PX0) : PX0 + (v + 3.4) / 6.8 * (PX1 - PX0); }
  function gy(v, m) { return m === 'raw' ? PY1 - (v - bLo) / (bHi - bLo) * (PY1 - PY0) : PY1 - (v + 3.4) / 6.8 * (PY1 - PY0); }
  function pos(k, m) {
    var x = m === 'raw' ? gx(A[k], 'raw') : gx(zA[k], 'std');
    var y = m === 'raw' ? gy(B[k], 'raw') : gy(zB[k], 'std');
    var cx = Math.min(PX1, Math.max(PX0, x)), cy = Math.min(PY1, Math.max(PY0, y));
    return [cx, cy, (cx !== x || cy !== y) ? 1 : 0];
  }

  var TX = { raw: S09.ticks(aLo, aHi, 5), std: [-3, -2, -1, 0, 1, 2, 3] };
  var TY = { raw: S09.ticks(bLo, bHi, 5), std: [-3, -2, -1, 0, 1, 2, 3] };
  function lab(v, m) { return m === 'std' ? (v < 0 ? '−' : '') + Math.abs(v) : S09.num(v); }
  function grid(g, m) {
    var s = '', k, x, y;
    for (k = 0; k < TX[m].length; k++) {
      x = gx(TX[m][k], m); if (x < PX0 - 0.5 || x > PX1 + 0.5) continue;
      s += '<line x1="' + x.toFixed(1) + '" y1="48" x2="' + x.toFixed(1) + '" y2="300" stroke="#e3ddcf" stroke-width="1"/>';
      s += '<text x="' + x.toFixed(1) + '" y="314" font-size="12" fill="#6b7385" text-anchor="middle">' + lab(TX[m][k], m) + '</text>';
    }
    for (k = 0; k < TY[m].length; k++) {
      y = gy(TY[m][k], m); if (y < PY0 - 0.5 || y > PY1 + 0.5) continue;
      s += '<line x1="76" y1="' + y.toFixed(1) + '" x2="452" y2="' + y.toFixed(1) + '" stroke="#e3ddcf" stroke-width="1"/>';
      s += '<text x="70" y="' + (y + 4.5).toFixed(1) + '" font-size="12" fill="#6b7385" text-anchor="end">' + lab(TY[m][k], m) + '</text>';
    }
    g.innerHTML = s;
  }
  var gRaw = q('.gr-raw'), gStd = q('.gr-std');
  grid(gRaw, 'raw'); grid(gStd, 'std');

  var pts = q('.pts'), s0 = '', i;
  for (i = 0; i < N; i++) {
    var p0 = pos(i, 'raw');
    s0 += '<circle data-i="' + i + '" tabindex="0" aria-label="' + NM[i] + '" cx="' + p0[0].toFixed(1) + '" cy="' + p0[1].toFixed(1)
      + '" r="5" fill="#b9b3a5" fill-opacity="0.85" stroke="' + (p0[2] ? '#d64545' : '#fff') + '" stroke-width="0.8"/>';
  }
  pts.innerHTML = s0;
  var dots = pts.querySelectorAll('circle');

  var svg = root.querySelector('svg');
  var labs = q('.labs'), line = q('.link'), bar = q('.bar');
  var dSel = q('.dot-sel'), dNear = q('.dot-near');
  var mode = 'raw', link = true, busy = false, seq = 0;
  var sel = 0, cur = [];
  for (i = 0; i < N; i++) { var p1 = pos(i, 'raw'); cur.push([p1[0], p1[1]]); }
  function near() { return mode === 'raw' ? R.nRaw[sel] : R.nStd[sel]; }

  var BAR_W = 156;
  function nameW(t) { return t.length * 7.4 + 4; }
  function box(k, ty) {
    var x = cur[k][0], w = nameW(NM[k]);
    var right = x + 9 + w <= 462;
    var lx = right ? x + 9 : x - 9;
    return { x: lx, y: ty, a: right ? 'start' : 'end', x0: right ? lx : lx - w, x1: right ? lx + w : lx };
  }
  function svgText(b, t) {
    return '<text x="' + b.x.toFixed(1) + '" y="' + b.y.toFixed(1)
      + '" font-size="12" fill="#1c2230" text-anchor="' + b.a + '">' + t + '</text>';
  }
  function paint() {
    for (var t = 0; t < N; t++) {
      dots[t].setAttribute('cx', cur[t][0].toFixed(1));
      dots[t].setAttribute('cy', cur[t][1].toFixed(1));
    }
    var nb = near();
    dSel.setAttribute('cx', cur[sel][0].toFixed(1)); dSel.setAttribute('cy', cur[sel][1].toFixed(1));
    dNear.setAttribute('cx', cur[nb][0].toFixed(1)); dNear.setAttribute('cy', cur[nb][1].toFixed(1));
    var clampY = function (v) { return Math.min(PY1 - 2, Math.max(PY0 + 11, v)); };
    var bs = box(sel, clampY(cur[sel][1] - 9));
    var bn = box(nb, clampY(cur[nb][1] + 15));
    if (Math.abs(bs.y - bn.y) < 14 && bn.x0 < bs.x1 && bs.x0 < bn.x1) {
      bn.y = clampY(bs.y + (bn.y >= bs.y ? 15 : -15));
    }
    labs.innerHTML = svgText(bs, NM[sel]) + svgText(bn, NM[nb]);
    var on = link && !busy;
    line.setAttribute('opacity', on ? '1' : '0');
    if (on) {
      line.setAttribute('x1', cur[sel][0].toFixed(1)); line.setAttribute('y1', cur[sel][1].toFixed(1));
      line.setAttribute('x2', cur[nb][0].toFixed(1)); line.setAttribute('y2', cur[nb][1].toFixed(1));
    }
  }
  function panel() {
    var nb = near();
    var dA = Math.abs(A[sel] - A[nb]), dB = Math.abs(B[sel] - B[nb]);
    var za = Math.abs(zA[sel] - zA[nb]), zb = Math.abs(zB[sel] - zB[nb]);
    var a = mode === 'raw' ? dA : za, b = mode === 'raw' ? dB : zb;
    var den = a * a + b * b;
    q('.p-sel').textContent = '선택 ' + NM[sel];
    q('.p-near').textContent = '가장 가까운 선수 ' + NM[nb];
    q('.v-k').textContent = mode === 'raw' ? S09.num(dA) : S09.num(dA) + ' (z ' + za.toFixed(2) + ')';
    q('.v-o').textContent = mode === 'raw' ? S09.num(dB) : S09.num(dB) + ' (z ' + zb.toFixed(2) + ')';
    q('.v-d').textContent = S09.num(Math.sqrt(den));
    var sh = den > 0 ? b * b / den * 100 : 0;
    q('.v-s').textContent = sh.toFixed(1) + '%';
    bar.setAttribute('width', (BAR_W * sh / 100).toFixed(1));
  }

  function jump(to) {
    for (var t = 0; t < N; t++) { cur[t][0] = to[t][0]; cur[t][1] = to[t][1]; }
    gRaw.setAttribute('opacity', mode === 'raw' ? '1' : '0');
    gStd.setAttribute('opacity', mode === 'std' ? '1' : '0');
    busy = false; paint();
  }
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    var bs = root.querySelectorAll('.wbtn[data-mode]'), t;
    for (t = 0; t < bs.length; t++) {
      var onb = bs[t].getAttribute('data-mode') === m;
      bs[t].classList.toggle('on', onb);
      bs[t].setAttribute('aria-pressed', onb ? 'true' : 'false');
    }
    q('.axx').textContent = m === 'raw' ? '슈팅 능력치' : '슈팅(표준화)';
    q('.axy').textContent = m === 'raw' ? '시장 가치(만 유로)' : '시장 가치(표준화)';
    var to = [], clamped = [];
    for (t = 0; t < N; t++) { var p = pos(t, m); to.push([p[0], p[1]]); clamped.push(p[2]); }
    for (t = 0; t < N; t++) dots[t].setAttribute('stroke', clamped[t] ? '#d64545' : '#fff');
    panel();
    var token = ++seq;
    if (reduce || !raf || (doc && doc.visibilityState === 'hidden')) { jump(to); return; }
    var from = [];
    for (t = 0; t < N; t++) from.push([cur[t][0], cur[t][1]]);
    busy = true;
    var t0 = -1;
    var frame = function (ts) {
      if (token !== seq) return;
      if (t0 < 0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 600);
      if (k >= 1) { jump(to); return; }
      var e = k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k);
      for (var u = 0; u < N; u++) {
        cur[u][0] = from[u][0] + (to[u][0] - from[u][0]) * e;
        cur[u][1] = from[u][1] + (to[u][1] - from[u][1]) * e;
      }
      gRaw.setAttribute('opacity', (m === 'raw' ? 1 - k : k).toFixed(2));
      gStd.setAttribute('opacity', (m === 'std' ? k : 1 - k).toFixed(2));
      paint();
      raf(frame);
    };
    paint();
    raf(frame);
  }

  function select(k) { if (k === sel || k < 0 || k >= N) return; sel = k; paint(); panel(); }
  svg.addEventListener('click', function (e) {
    var r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var ux = (e.clientX - r.left) * 720 / r.width, uy = (e.clientY - r.top) * 360 / r.height;
    var best = -1, bd = 14;
    for (var t = 0; t < N; t++) {
      var d = Math.sqrt((ux - cur[t][0]) * (ux - cur[t][0]) + (uy - cur[t][1]) * (uy - cur[t][1]));
      if (d < bd) { bd = d; best = t; }
    }
    if (best >= 0) select(best);
  });
  pts.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var el = e.target, a = el && el.getAttribute && el.getAttribute('data-i');
    if (a === null || a === undefined) return;
    e.preventDefault(); select(+a);
  });
  var mb = root.querySelectorAll('.wbtn[data-mode]');
  for (i = 0; i < mb.length; i++) {
    (function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); })(mb[i]);
  }
  var lb = root.querySelector('.wbtn[data-link]');
  lb.addEventListener('click', function () {
    link = !link;
    lb.classList.toggle('on', link);
    lb.setAttribute('aria-pressed', link ? 'true' : 'false');
    paint();
  });
  q('.wout').textContent = '가장 가까운 선수가 바뀜 ' + R.changed + ' / ' + N + '명';
  paint(); panel();
}

// ─────────────────────────────────────────────────────────────────────────
// 2. km2d — k-평균을 실제로 돌린 기록을 한 단계씩 재생한다(슈팅×수비, 표준화)
// ─────────────────────────────────────────────────────────────────────────
function initW_km2d(root, D) {
  var doc = root.ownerDocument;
  var q = function (s) { return root.querySelector(s); };
  var X = D.km2d.x, Y = D.km2d.y, NM = D.n, GP = D.grp, N = NM.length;
  var PX0 = 62, PX1 = 700, PY0 = 56, PY1 = 336;
  var xLo = -3.5, xHi = 2.2, yLo = -2.3, yHi = 1.9;
  function gx(v) { return PX0 + (v - xLo) / (xHi - xLo) * (PX1 - PX0); }
  function gy(v) { return PY1 - (v - yLo) / (yHi - yLo) * (PY1 - PY0); }

  var g = '';
  S09.ticks(xLo, xHi, 7).forEach(function (v) {
    var x = gx(v);
    g += '<line x1="' + x.toFixed(1) + '" y1="' + PY0 + '" x2="' + x.toFixed(1) + '" y2="' + PY1 + '" stroke="#e3ddcf"/>';
    g += '<text x="' + x.toFixed(1) + '" y="' + (PY1 + 16) + '" font-size="12" fill="#6b7385" text-anchor="middle">' + S09.num(v) + '</text>';
  });
  S09.ticks(yLo, yHi, 4).forEach(function (v) {
    var y = gy(v);
    g += '<line x1="' + PX0 + '" y1="' + y.toFixed(1) + '" x2="' + PX1 + '" y2="' + y.toFixed(1) + '" stroke="#e3ddcf"/>';
    g += '<text x="' + (PX0 - 6) + '" y="' + (y + 4).toFixed(1) + '" font-size="12" fill="#6b7385" text-anchor="end">' + S09.num(v) + '</text>';
  });
  q('.gr').innerHTML = g;

  var pts = q('.pts'), s = '', i;
  for (i = 0; i < N; i++) {
    s += '<circle data-i="' + i + '" cx="' + gx(X[i]).toFixed(1) + '" cy="' + gy(Y[i]).toFixed(1)
      + '" r="4.6" fill="' + S09.GRAY + '" fill-opacity="0.9" stroke="#fff" stroke-width="0.7"><title>' + NM[i] + '</title></circle>';
  }
  pts.innerHTML = s;
  var dots = pts.querySelectorAll('circle');
  var gCen = q('.cents');

  var k = 3, stage = 0, colorBy = 'clu';
  function run() { return D.km2d.runs[String(k)]; }
  function remapped(a) { return run().remap[a]; }
  function maxStage() { return run().steps.length * 2 - 2; }   // 0=중심 놓기, 이후 배정·이동이 번갈아

  // stage 0: 중심 놓기(steps[0].c, 배정 없음)
  // stage 2j-1: j번째 배정 (중심 steps[j-1].c, 색 steps[j].a)
  // stage 2j  : j번째 중심 이동 (중심 steps[j].c, 색 steps[j].a)
  function state() {
    var st = run().steps;
    if (stage === 0) return { c: st[0].c, a: null, it: 0, kind: 'init', shift: null };
    var j = Math.ceil(stage / 2);
    var assign = stage % 2 === 1;
    return { c: assign ? st[j - 1].c : st[j].c, a: st[j].a, it: j,
             kind: assign ? 'assign' : 'move', shift: st[j].s };
  }

  function colorOf(i, a) {
    if (colorBy === 'pos') return S09.POS[GP[i]];
    if (!a) return S09.GRAY;
    return S09.CLU[remapped(a[i])];
  }
  function render() {
    var s2 = state(), t;
    for (t = 0; t < N; t++) dots[t].setAttribute('fill', colorOf(t, s2.a));
    var html = '';
    for (t = 0; t < s2.c.length; t++) {
      var cx = gx(s2.c[t][0]), cy = gy(s2.c[t][1]);
      html += '<text x="' + cx.toFixed(1) + '" y="' + (cy + 11).toFixed(1) + '" text-anchor="middle" font-size="30" fill="'
        + S09.CLU[remapped(t)] + '" stroke="' + S09.CLUT[remapped(t)] + '" stroke-width="0.9">★</text>';
    }
    gCen.innerHTML = html;

    var TXT = {
      init: '① 중심점 ' + k + '개를 임의로 놓는다',
      assign: '② 각 선수를 가장 가까운 중심점의 묶음에 넣는다',
      move: '③ 묶음에 든 선수의 평균 자리로 중심점을 옮긴다'
    };
    q('.st-now').textContent = TXT[s2.kind];
    q('.st-it').textContent = s2.kind === 'init' ? '시작 전' : s2.it + '회째';
    q('.st-shift').textContent = s2.shift === null || s2.shift === undefined ? '—'
      : (s2.kind === 'assign' ? '—' : S09.num(s2.shift));
    var sizes = [];
    if (s2.a) {
      var cnt = [];
      for (t = 0; t < k; t++) cnt.push(0);
      for (t = 0; t < N; t++) cnt[remapped(s2.a[t])]++;
      for (t = 0; t < k; t++) sizes.push(S09.SYM[t] + ' ' + cnt[t] + '명');
    }
    q('.st-size').textContent = sizes.length ? sizes.join(' · ') : '아직 배정 전';
    q('.st-done').textContent = stage >= maxStage()
      ? '중심점이 더 움직이지 않습니다. ' + run().iters + '번째 반복에서 멈췄습니다.'
      : '';
    q('.wout').textContent = 'k=' + k + ' · 전체 ' + run().iters + '회 반복으로 수렴 · '
      + (stage === 0 ? '시작 전' : Math.ceil(stage / 2) + '회째');
  }

  function setK(nk) {
    k = nk; stage = 0;
    var bs = root.querySelectorAll('.wbtn[data-k]'), t;
    for (t = 0; t < bs.length; t++) {
      var on = +bs[t].getAttribute('data-k') === k;
      bs[t].classList.toggle('on', on);
      bs[t].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    render();
  }
  root.querySelectorAll('.wbtn[data-k]').forEach(function (b) {
    b.addEventListener('click', function () { setK(+b.getAttribute('data-k')); });
  });
  q('[data-act="next"]').addEventListener('click', function () {
    stage = stage >= maxStage() ? 0 : stage + 1;
    render();
  });
  q('[data-act="reset"]').addEventListener('click', function () { stage = 0; render(); });
  q('[data-act="end"]').addEventListener('click', function () { stage = maxStage(); render(); });
  root.querySelectorAll('.wbtn[data-color]').forEach(function (b) {
    b.addEventListener('click', function () {
      colorBy = b.getAttribute('data-color');
      root.querySelectorAll('.wbtn[data-color]').forEach(function (x) {
        var on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      q('.st-legend').textContent = colorBy === 'pos'
        ? '색 = 포지션 · 공격수 · 미드필더 · 수비수'
        : '색 = k-평균이 만든 묶음';
      render();
    });
  });
  setK(3);
}

// ─────────────────────────────────────────────────────────────────────────
// 3. km3d — 세 능력치를 축으로 한 3차원 산점도(plotly)
// ─────────────────────────────────────────────────────────────────────────
function initW_km3d(root, D) {
  var T = D.d3;
  var host = root.querySelector('.plot');
  var out = root.querySelector('.wout');
  var btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-color]'));
  var FONT = { family: 'inherit', size: 12, color: '#3a2e1a' };
  var BASE = { displayModeBar: false, responsive: true };
  var mode = 'clu';

  function traces() {
    var groups = mode === 'clu'
      ? [0, 1, 2].map(function (c) { return { key: c, name: S09.SYM[c] + ' 묶음', color: S09.CLU[c] }; })
      : ['FW', 'MF', 'DF'].map(function (g) { return { key: g, name: S09.POSN[g], color: S09.POS[g] }; });
    var src = mode === 'clu' ? T.c : T.grp;
    return groups.map(function (g) {
      var x = [], y = [], z = [], t = [];
      for (var i = 0; i < src.length; i++) {
        if (src[i] !== g.key) continue;
        x.push(T.x[i]); y.push(T.y[i]); z.push(T.z[i]); t.push(T.n[i]);
      }
      return { x: x, y: y, z: z, text: t, name: g.name + ' ' + x.length + '명',
        type: 'scatter3d', mode: 'markers',
        marker: { size: 3.2, color: g.color, opacity: 0.85 },
        hovertemplate: '%{text}<br>슈팅 %{x} · 수비 %{y} · 패스 %{z}<extra></extra>' };
    });
  }
  function draw() {
    if (typeof Plotly === 'undefined') { out.textContent = '그래프를 불러오지 못했습니다'; return; }
    Plotly.newPlot(host, traces(), {
      margin: { l: 0, r: 0, t: 8, b: 8 }, showlegend: true,
      legend: { orientation: 'h', y: 0.02, x: 0.5, xanchor: 'center' },
      font: FONT, paper_bgcolor: 'rgba(0,0,0,0)',
      scene: { aspectmode: 'manual', aspectratio: { x: 1.5, y: 1.2, z: 1 }, domain: { x: [0, 1], y: [0.08, 1] },
               xaxis: { title: { text: '슈팅' } },
               yaxis: { title: { text: '수비' } },
               zaxis: { title: { text: '패스' } },
               camera: { eye: { x: 1.25, y: -1.25, z: 0.72 } } }
    }, BASE);
    out.textContent = mode === 'clu'
      ? '묶음 크기 ' + T.sizes.map(function (v, i) { return S09.SYM[i] + ' ' + v + '명'; }).join(' · ')
      : '포지션 · 공격수 ' + T.grp.filter(function (g) { return g === 'FW'; }).length
        + '명 · 미드필더 ' + T.grp.filter(function (g) { return g === 'MF'; }).length
        + '명 · 수비수 ' + T.grp.filter(function (g) { return g === 'DF'; }).length + '명';
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-color');
      btns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      draw();
    });
  });
  (function wait(n) {
    if (typeof Plotly !== 'undefined') { draw(); return; }
    if (n > 60) { draw(); return; }
    setTimeout(function () { wait(n + 1); }, 100);
  })(0);
}

// ─────────────────────────────────────────────────────────────────────────
// 4. kpick — 엘보우 꺾은선과 실루엣 점수로 k를 고른다(전체 선수·여섯 능력치)
// ─────────────────────────────────────────────────────────────────────────
function initW_kpick(root, D) {
  var E = D.elbow, q = function (s) { return root.querySelector(s); };
  var KS = E.k, W = E.wcss, SIL = E.sil;
  var LX0 = 66, LX1 = 356, LY0 = 60, LY1 = 300;
  var RX0 = 420, RX1 = 700, RY0 = 60, RY1 = 300;
  var wHi = Math.max.apply(null, W) * 1.05;
  var sHi = 0.4;
  function lx(kk) { return LX0 + (kk - 1) / 6 * (LX1 - LX0); }
  function ly(v) { return LY1 - v / wHi * (LY1 - LY0); }
  function rx(kk) { return RX0 + (kk - 2) / 5 * (RX1 - RX0 - 34) + 17; }
  function ry(v) { return RY1 - v / sHi * (RY1 - RY0); }

  var g = '', i;
  [0, 1000, 2000, 3000, 4000].forEach(function (v) {
    g += '<line x1="' + LX0 + '" y1="' + ly(v).toFixed(1) + '" x2="' + LX1 + '" y2="' + ly(v).toFixed(1) + '" stroke="#e3ddcf"/>'
      + '<text x="' + (LX0 - 6) + '" y="' + (ly(v) + 4).toFixed(1) + '" font-size="11" fill="#6b7385" text-anchor="end">' + v.toLocaleString('en-US') + '</text>';
  });
  [0, 0.1, 0.2, 0.3, 0.4].forEach(function (v) {
    g += '<line x1="' + RX0 + '" y1="' + ry(v).toFixed(1) + '" x2="' + RX1 + '" y2="' + ry(v).toFixed(1) + '" stroke="#e3ddcf"/>'
      + '<text x="' + (RX0 - 6) + '" y="' + (ry(v) + 4).toFixed(1) + '" font-size="11" fill="#6b7385" text-anchor="end">' + v.toFixed(1) + '</text>';
  });
  for (i = 0; i < KS.length; i++) {
    g += '<text x="' + lx(KS[i]).toFixed(1) + '" y="' + (LY1 + 16) + '" font-size="11" fill="#6b7385" text-anchor="middle">' + KS[i] + '</text>';
  }
  for (i = 2; i <= 7; i++) {
    g += '<text x="' + rx(i).toFixed(1) + '" y="' + (RY1 + 16) + '" font-size="11" fill="#6b7385" text-anchor="middle">' + i + '</text>';
  }
  q('.gr').innerHTML = g;

  var line = '', dotsHtml = '';
  for (i = 0; i < KS.length; i++) {
    line += (i ? ' L' : 'M') + lx(KS[i]).toFixed(1) + ' ' + ly(W[i]).toFixed(1);
    dotsHtml += '<circle data-k="' + KS[i] + '" cx="' + lx(KS[i]).toFixed(1) + '" cy="' + ly(W[i]).toFixed(1)
      + '" r="4.5" fill="#b07a00" stroke="#fff" stroke-width="1"/>';
  }
  q('.elbowline').setAttribute('d', line);
  q('.elbowdots').innerHTML = dotsHtml;

  var bars = '';
  for (i = 2; i <= 7; i++) {
    var v = SIL[KS.indexOf(i)], y = ry(v);
    bars += '<rect data-k="' + i + '" x="' + (rx(i) - 15).toFixed(1) + '" y="' + y.toFixed(1)
      + '" width="30" height="' + (RY1 - y).toFixed(1) + '" fill="#6b8fb5" opacity="0.55"/>'
      + '<text x="' + rx(i).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" font-size="11" fill="#1c2230" text-anchor="middle">' + v.toFixed(3) + '</text>';
  }
  q('.silbars').innerHTML = bars;

  var k = 3;
  var mark = q('.kmark'), markR = q('.kmarkR');
  function render() {
    var idx = KS.indexOf(k);
    mark.setAttribute('x1', lx(k).toFixed(1)); mark.setAttribute('x2', lx(k).toFixed(1));
    markR.setAttribute('x', (rx(k) - 17).toFixed(1));
    root.querySelectorAll('.wbtn[data-k]').forEach(function (b) {
      var on = +b.getAttribute('data-k') === k;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var drop = idx > 0 ? W[idx - 1] - W[idx] : null;
    q('.v-w').textContent = S09.num(W[idx]);
    q('.v-drop').textContent = drop === null ? '—' : S09.num(drop);
    q('.v-sil').textContent = SIL[idx] === null ? '—' : SIL[idx].toFixed(3);
    q('.wout').textContent = 'k=' + k + ' · 군집 내 제곱합 ' + S09.num(W[idx])
      + (SIL[idx] === null ? '' : ' · 실루엣 ' + SIL[idx].toFixed(3));
    q('.v-size').textContent = k === 3
      ? '묶음 인원 ' + E.sizes3.map(function (v, t) { return S09.SYM[t] + ' ' + v + '명'; }).join(' · ')
      : '묶음별 인원과 대표 선수는 아래 표에 k=3만 적어 두었습니다';
  }
  root.querySelectorAll('.wbtn[data-k]').forEach(function (b) {
    b.addEventListener('click', function () { k = +b.getAttribute('data-k'); render(); });
  });
  render();
}

// ─────────────────────────────────────────────────────────────────────────
// 5. stdswitch — 여섯 능력치를 원래 값으로 묶었을 때와 표준화해 묶었을 때
// ─────────────────────────────────────────────────────────────────────────
function initW_stdswitch(root, D) {
  var X0 = 68, X1 = 438, Y0 = 48, Y1 = 272;
  var XI = 1, YI = 4;                                  // x 슈팅 · y 수비
  var NS = S09.NS;
  var ITEM = D.ab;
  var ITEMC = ['#b07a00', '#d97757', '#6b8fb5', '#54a24b', '#8e7cc3', '#3ba6a0'];
  var STDC = S09.CLU, STDT = S09.CLUT;
  var STDS = ['#c28f00', '#ffffff', '#ffffff'];
  var RAWC = ['#8e7cc3', '#d97757', '#6b8fb5'];      // ①②③ — 표준화 묶음과 다른 색군
  var SYM_S = S09.SYM, SYM_R = ['①', '②', '③'];

  var raw = D.abv, names = D.n, N = raw.length;
  var labS = D.std.stdl, labR = D.std.raw;
  var share = { rawA: D.std.shareA.raw, stdA: D.std.shareA.std, rawB: D.std.shareB.raw, stdB: D.std.shareB.std };
  var gs = labS, gr = labR, i;

  var movedName = D.std.moved || [];
  var isMoved = [], movedCount = 0;
  for (i = 0; i < N; i++) {
    isMoved.push(movedName.indexOf(names[i]) >= 0);
    if (isMoved[i]) movedCount++;
  }

  var MEAN = [], SD = [], j;
  for (j = 0; j < 6; j++) {
    var s = 0, t0;
    for (t0 = 0; t0 < N; t0++) s += raw[t0][j];
    var m = s / N, v = 0;
    for (t0 = 0; t0 < N; t0++) v += (raw[t0][j] - m) * (raw[t0][j] - m);
    MEAN.push(m); SD.push(Math.sqrt(v / N));
  }
  function zval(a, b) { return (raw[a][b] - MEAN[b]) / SD[b]; }
  function f2(x) {
    var sg = x < 0 ? -1 : 1, ab = Math.abs(x);
    var rr = Math.round(ab * 100 + 1e-9) / 100;
    return (sg < 0 && rr !== 0 ? '−' : '') + rr.toFixed(2);
  }
  function f1(x) { return (Math.round(Math.abs(x) * 10 + 1e-9) / 10).toFixed(1); }

  var xs = raw.map(function (r) { return r[XI]; }), ys = raw.map(function (r) { return r[YI]; });
  var XMIN = Math.floor(Math.min.apply(null, xs) / 10) * 10, XMAX = Math.ceil(Math.max.apply(null, xs) / 10) * 10;
  var YMIN = Math.floor(Math.min.apply(null, ys) / 10) * 10, YMAX = Math.ceil(Math.max.apply(null, ys) / 10) * 10;

  var px = [], py = [], clamped = [];
  for (i = 0; i < N; i++) {
    var xv = raw[i][XI], yv = raw[i][YI];
    var out = xv < XMIN || xv > XMAX || yv < YMIN || yv > YMAX;
    var xc = Math.min(XMAX, Math.max(XMIN, xv)), yc = Math.min(YMAX, Math.max(YMIN, yv));
    px.push(X0 + (xc - XMIN) / (XMAX - XMIN) * (X1 - X0));
    py.push(Y1 - (yc - YMIN) / (YMAX - YMIN) * (Y1 - Y0));
    clamped.push(out);
  }

  var q = function (sel) { return root.querySelector(sel); };
  var doc = root.ownerDocument;
  var svg = q('svg');
  var gPts = q('.pts'), gRings = q('.rings'), selring = q('.selring');
  var lgRaw = q('.lgRaw'), lgStd = q('.lgStd');
  var pname = q('.pname'), passign = q('.passign');
  var pv = root.querySelectorAll('.pv'), pz = root.querySelectorAll('.pz');
  var gA = q('.barA'), gB = q('.barB');
  var ovA = q('.ovA'), ovB = q('.ovB');
  var wout = q('.wout');
  var mbtn = root.querySelectorAll('[data-m]');
  var tbtn = q('[data-t]');

  // 격자·눈금
  var gridHtml = '';
  S09.ticks(XMIN, XMAX, 5).forEach(function (v) {
    var x = X0 + (v - XMIN) / (XMAX - XMIN) * (X1 - X0);
    gridHtml += '<line x1="' + x.toFixed(1) + '" y1="' + Y0 + '" x2="' + x.toFixed(1) + '" y2="' + Y1 + '" stroke="#e3ddcf"/>'
      + '<text x="' + x.toFixed(1) + '" y="' + (Y1 + 18) + '" font-size="12" fill="#6b7385" text-anchor="middle">' + v + '</text>';
  });
  S09.ticks(YMIN, YMAX, 5).forEach(function (v) {
    var y = Y1 - (v - YMIN) / (YMAX - YMIN) * (Y1 - Y0);
    gridHtml += '<line x1="' + X0 + '" y1="' + y.toFixed(1) + '" x2="' + X1 + '" y2="' + y.toFixed(1) + '" stroke="#e3ddcf"/>'
      + '<text x="' + (X0 - 8) + '" y="' + (y + 4).toFixed(1) + '" font-size="12" fill="#6b7385" text-anchor="end">' + v + '</text>';
  });
  q('.gr').innerHTML = gridHtml;

  var reduced = false;
  try {
    var view = doc && doc.defaultView;
    reduced = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { reduced = false; }

  var dots = [];
  for (i = 0; i < N; i++) {
    var c = S09.el(doc, 'circle', { cx: px[i].toFixed(1), cy: py[i].toFixed(1), r: '5',
      'fill-opacity': '0.85', 'stroke-width': '0.8', tabindex: '0', 'data-i': String(i), style: 'cursor:pointer' });
    c.appendChild(S09.el(doc, 'title', {}, names[i]));
    gPts.appendChild(c); dots.push(c);
  }
  for (i = 0; i < N; i++) {
    if (!isMoved[i]) continue;
    gRings.appendChild(S09.el(doc, 'circle', { cx: px[i].toFixed(1), cy: py[i].toFixed(1), r: '7.5' }));
  }

  function makeBar(g, y, h) {
    var segs = [], labs = [], t;
    for (t = 0; t < 6; t++) {
      segs.push(g.appendChild(S09.el(doc, 'rect', { y: String(y), height: String(h), x: String(X0), width: '0', fill: ITEMC[t] })));
    }
    for (t = 0; t < 6; t++) {
      labs.push(g.appendChild(S09.el(doc, 'text', { y: String(y + h / 2 + 4), 'font-size': '12', fill: '#ffffff', 'text-anchor': 'middle' })));
    }
    return { segs: segs, labs: labs };
  }
  var barA = makeBar(gA, 338, 26), barB = makeBar(gB, 398, 26);

  var BW = 704 - X0;
  function layout(bar, vals) {
    var sum = 0, t;
    for (t = 0; t < 6; t++) sum += vals[t];
    if (sum <= 0) sum = 1;
    var x = X0;
    for (t = 0; t < 6; t++) {
      var w = vals[t] / sum * BW;
      bar.segs[t].setAttribute('x', x.toFixed(2));
      bar.segs[t].setAttribute('width', Math.max(0, w).toFixed(2));
      bar.labs[t].setAttribute('x', (x + w / 2).toFixed(2));
      x += w;
    }
  }
  function setBarText(bar, vals, ov) {
    var small = [], t;
    for (t = 0; t < 6; t++) {
      if (vals[t] >= 10) bar.labs[t].textContent = ITEM[t] + ' ' + f1(vals[t]);
      else { bar.labs[t].textContent = ''; small.push(ITEM[t] + ' ' + f1(vals[t])); }
    }
    ov.textContent = small.join(' · ');
  }

  function fillLegend(node, parts) {
    while (node.firstChild) node.removeChild(node.firstChild);
    for (var t = 0; t < parts.length; t++) {
      var sp = S09.el(doc, 'tspan', parts[t][1] ? { fill: parts[t][1], 'font-weight': '700' } : {}, parts[t][0]);
      node.appendChild(sp);
    }
  }
  function legendRaw() {
    var cnt = [0, 0, 0], so = [0, 0, 0], t, out = [];
    for (t = 0; t < N; t++) { cnt[gr[t]]++; so[gr[t]] += raw[t][XI]; }
    for (t = 0; t < 3; t++) {
      out.push([SYM_R[t], RAWC[t]]);
      out.push([' ' + cnt[t] + '명 ' + (t === 0 ? '슈팅 ' : '') + f1(so[t] / cnt[t]) + (t < 2 ? ' · ' : ''), null]);
    }
    return out;
  }
  function legendStd() {
    var cnt = [0, 0, 0], t, out = [];
    for (t = 0; t < N; t++) cnt[gs[t]]++;
    for (t = 0; t < 3; t++) {
      out.push([SYM_S[t], STDT[t]]);
      out.push([' ' + cnt[t] + '명' + (t < 2 ? ' · ' : ''), null]);
    }
    return out;
  }
  fillLegend(lgRaw, legendRaw());
  fillLegend(lgStd, legendStd());

  var mode = 'raw', onlyMoved = false, sel = 0, seq = 0;
  if (movedName.length) { var mi = names.indexOf(movedName[0]); if (mi >= 0) sel = mi; }

  function colorOf(a, m) { return m === 'raw' ? RAWC[gr[a]] : STDC[gs[a]]; }
  function strokeOf(a, m) {
    if (clamped[a]) return '#d64545';
    return m === 'raw' ? '#ffffff' : STDS[gs[a]];
  }
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) {
    var A = hex(a), B = hex(b);
    return 'rgb(' + Math.round(A[0] + (B[0] - A[0]) * t) + ',' +
      Math.round(A[1] + (B[1] - A[1]) * t) + ',' + Math.round(A[2] + (B[2] - A[2]) * t) + ')';
  }

  function paintDots() {
    for (var t = 0; t < N; t++) {
      dots[t].setAttribute('fill', colorOf(t, mode));
      dots[t].setAttribute('stroke', strokeOf(t, mode));
      dots[t].setAttribute('opacity', onlyMoved && !isMoved[t] ? '0.2' : '1');
    }
  }
  function paintPanel() {
    pname.textContent = names[sel];
    for (var t = 0; t < 6; t++) {
      pv[t].textContent = f1(raw[sel][t]);
      pz[t].textContent = f2(zval(sel, t));
    }
    var ch = isMoved[sel];
    passign.textContent = '원래 값 ' + SYM_R[gr[sel]] + ' → 표준화 ' + SYM_S[gs[sel]] + ' · ' + (ch ? '바뀜' : '그대로');
    passign.setAttribute('fill', ch ? '#b07a00' : '#6b7385');
    selring.setAttribute('cx', px[sel].toFixed(1));
    selring.setAttribute('cy', py[sel].toFixed(1));
  }
  function paintBars(m) {
    var a = m === 'raw' ? share.rawA : share.stdA;
    var b = m === 'raw' ? share.rawB : share.stdB;
    layout(barA, a); layout(barB, b);
    setBarText(barA, a, ovA); setBarText(barB, b, ovB);
  }

  function setMode(m) {
    if (m === mode) return;
    var from = mode;
    mode = m;
    for (var t = 0; t < mbtn.length; t++) mbtn[t].classList.toggle('on', mbtn[t].getAttribute('data-m') === m);
    var my = ++seq;
    if (reduced) {
      paintDots(); paintBars(m); paintPanel();
      lgRaw.setAttribute('opacity', m === 'raw' ? '1' : '0');
      lgStd.setAttribute('opacity', m === 'std' ? '1' : '0');
      gRings.setAttribute('opacity', '0');
      return;
    }
    var vA0 = from === 'raw' ? share.rawA : share.stdA;
    var vA1 = m === 'raw' ? share.rawA : share.stdA;
    var vB0 = from === 'raw' ? share.rawB : share.stdB;
    var vB1 = m === 'raw' ? share.rawB : share.stdB;
    var c0 = [], c1 = [], t2;
    for (t2 = 0; t2 < N; t2++) { c0.push(colorOf(t2, from)); c1.push(colorOf(t2, m)); }
    var swapped = false, t0 = 0;
    function lerpArr(a, b, u) {
      var out = [];
      for (var t3 = 0; t3 < 6; t3++) out.push(a[t3] + (b[t3] - a[t3]) * u);
      return out;
    }
    function stepMorph(ts) {
      if (my !== seq) return;
      if (!t0) t0 = ts;
      var t = Math.min(1, (ts - t0) / 400);
      var e = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      var t3;
      for (t3 = 0; t3 < N; t3++) dots[t3].setAttribute('fill', mix(c0[t3], c1[t3], e));
      layout(barA, lerpArr(vA0, vA1, e));
      layout(barB, lerpArr(vB0, vB1, e));
      var fade = Math.abs(2 * t - 1);
      for (t3 = 0; t3 < 6; t3++) {
        barA.labs[t3].setAttribute('opacity', fade.toFixed(3));
        barB.labs[t3].setAttribute('opacity', fade.toFixed(3));
      }
      ovA.setAttribute('opacity', fade.toFixed(3));
      ovB.setAttribute('opacity', fade.toFixed(3));
      if (t >= 0.5 && !swapped) {
        swapped = true;
        setBarText(barA, vA1, ovA);
        setBarText(barB, vB1, ovB);
      }
      lgRaw.setAttribute('opacity', (m === 'raw' ? e : 1 - e).toFixed(3));
      lgStd.setAttribute('opacity', (m === 'std' ? e : 1 - e).toFixed(3));
      if (t < 1) { requestAnimationFrame(stepMorph); return; }
      paintDots(); paintBars(m); paintPanel();
      for (t3 = 0; t3 < 6; t3++) { barA.labs[t3].setAttribute('opacity', '1'); barB.labs[t3].setAttribute('opacity', '1'); }
      ovA.setAttribute('opacity', '1'); ovB.setAttribute('opacity', '1');
      gRings.setAttribute('opacity', '1');
      var r0 = 0;
      function stepRing(ts2) {
        if (my !== seq) return;
        if (!r0) r0 = ts2;
        var u = Math.min(1, (ts2 - r0) / 600);
        gRings.setAttribute('opacity', (1 - u * u).toFixed(3));
        if (u < 1) requestAnimationFrame(stepRing);
        else gRings.setAttribute('opacity', '0');
      }
      requestAnimationFrame(stepRing);
    }
    requestAnimationFrame(stepMorph);
  }

  function pick(ex, ey) {
    var best = -1, bd = 14 * 14;
    for (var t = 0; t < N; t++) {
      if (onlyMoved && !isMoved[t]) continue;
      var dx = px[t] - ex, dy = py[t] - ey, d = dx * dx + dy * dy;
      if (d <= bd) { bd = d; best = t; }
    }
    return best;
  }
  svg.addEventListener('click', function (ev) {
    var p;
    try {
      p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
      p = p.matrixTransform(svg.getScreenCTM().inverse());
    } catch (e2) { return; }
    var hit = pick(p.x, p.y);
    if (hit >= 0 && hit !== sel) { sel = hit; paintPanel(); }
  });
  gPts.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var tg = ev.target, a = tg && tg.getAttribute && tg.getAttribute('data-i');
    if (a === null || a === undefined) return;
    ev.preventDefault();
    sel = +a; paintPanel();
  });
  for (var b2 = 0; b2 < mbtn.length; b2++) {
    mbtn[b2].addEventListener('click', function (ev) { setMode(ev.currentTarget.getAttribute('data-m')); });
  }
  tbtn.addEventListener('click', function () {
    onlyMoved = !onlyMoved;
    tbtn.classList.toggle('on', onlyMoved);
    paintDots();
  });

  wout.textContent = '묶음 바뀐 선수 ' + movedCount + ' / ' + N + '명';
  paintDots(); paintBars('raw'); paintPanel();
  lgRaw.setAttribute('opacity', '1');
  lgStd.setAttribute('opacity', '0');
}

  var WIDGET_INIT = { ruler: initW_ruler, km2d: initW_km2d, km3d: initW_km3d, kpick: initW_kpick, stdswitch: initW_stdswitch };
  function initWidgets(scope) {
    (scope || document).querySelectorAll('.widget[data-w]').forEach(function (el) {
      if (el.dataset.ready) return;
      var f = WIDGET_INIT[el.dataset.w];
      if (f) { f(el, window.SOCCER_DATA); el.dataset.ready = '1'; }
    });
  }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initWidgets(); });
  else initWidgets();
