// 13차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson13.html)와 교재(lesson13.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"menus":["제육볶음","간장찜닭","가자미순살튀김","돈육불백","미트볼데리야끼볶음","수육","진미채고추장볶음","치즈떡닭갈비"],"days":[10,7,6,6,5,5,5,5],"pairA":[[0,1,1,1,0,1,1,0],[0,0,1,1,1,0,0,0],[0,0,0,0,1,1,1,0],[0,0,1,0,0,0,1,1],[1,0,0,1,0,1,0,1],[0,1,0,1,0,0,0,1],[0,1,0,0,1,1,0,0],[1,1,1,0,0,0,1,0]],"days49":[["배추김치", 102, "김치"], ["깍두기", 32, "김치"], ["친환경현미밥", 30, "밥"], ["칼슘강화기장밥", 25, "밥"], ["석박지", 20, "김치"], ["총각김치", 17, "김치"], ["친환경칼슘기장밥", 17, "밥"], ["추가밥", 14, "밥"], ["친환경잡곡밥", 14, "밥"], ["친환경흑미밥", 12, "밥"], ["조각파인애플", 11, "후식"], ["매콤콩나물무침", 10, "곁"], ["제육볶음", 10, "주"], ["참치김치찌개", 9, "국"], ["친환경보리밥", 9, "밥"], ["고명장국", 8, "국"], ["브로콜리무침", 8, "곁"], ["숙주나물무침", 8, "곁"], ["시금치나물", 8, "곁"], ["간장찜닭", 7, "주"], ["도토리묵무침", 7, "곁"], ["떡볶이", 7, "주"], ["쇠고기미역국", 7, "국"], ["파송송달걀국", 7, "국"], ["가자미순살튀김", 6, "주"], ["고명유부국", 6, "국"], ["돈육감자탕", 6, "국"], ["돈육불백", 6, "주"], ["배식용김", 6, "곁"], ["부추무침", 6, "곁"], ["야채달걀말이", 6, "주"], ["양배추샐러드사우전D", 6, "곁"], ["얼큰콩나물국", 6, "국"], ["오징어무국", 6, "국"], ["초코우유", 6, "후식"], ["카레라이스", 6, "밥"], ["닭볶음탕", 5, "국"], ["미트볼데리야끼볶음", 5, "주"], ["북어국", 5, "국"], ["소고기무국", 5, "국"], ["수육", 5, "주"], ["순대국", 5, "국"], ["아이스망고", 5, "후식"], ["오렌지", 5, "후식"], ["진미채고추장볶음", 5, "주"], ["치즈떡닭갈비", 5, "주"], ["치즈불닭", 5, "주"]]};
function initW_menu8pick(root, D) {
  // 급식 중식 184일 등장 일수 상위 49종 → 제외 기준 5종을 켜고 끄며 후보 선정 과정을 본다.
  const ITEMS = D.days49;            // [이름, 중식 등장 일수, 분류] 49행
  const MENUS = D.menus;             // 수업 후보 여덟
  const CAT = { '밥': '밥류', '김치': '김치류', '국': '국·찌개류', '곁': '곁반찬', '후식': '후식·음료' };
  const MAXROW = 14, X_NAME = 34, X_BAR = 220, W_BAR = 300, X_CAT_MAX = 214;
  const rowY = i => 46 + i * 19;

  // 글자 폭 추정: 한글은 전각 1.0em, 숫자·로마자·가운뎃점은 0.55em
  function textW(s, size, sp) {
    let w = 0;
    for (let k = 0; k < s.length; k++) w += (s.charCodeAt(k) > 0x2000 ? 1 : 0.55) * size;
    return w + (sp || 0) * (s.length - 1);
  }

  const q = s => root.querySelector(s);
  const rowsG = q('.rows'), hright = q('.hright'), legend = q('.legend');
  const cutG = q('.cut'), out = q('.wout');
  const chips = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-cat]'));
  const pickBtn = q('.wbtn[data-pick]');

  const isMenu = ITEMS.map(it => MENUS.indexOf(it[0]) >= 0);
  // 이름 폭에서 분류 라벨의 x를 미리 정한다(막대 시작 220과 겹치지 않게 214에서 자른다)
  const catX = ITEMS.map(it => {
    const lab = CAT[it[2]] || '';
    const after = X_NAME + textW(it[0], 11, -0.2) + 8;
    const capped = X_CAT_MAX - textW(lab, 9, 0);
    return (after < capped ? after : capped).toFixed(1);
  });

  // 행 49개를 미리 만든다(표시 순서·색은 갱신 때 정한다)
  rowsG.innerHTML = ITEMS.map((it, i) =>
    '<g class="row" display="none" transform="translate(0,' + rowY(MAXROW) + ')">' +
    '<circle class="dot" cx="30" cy="-3.5" r="3" fill="#2b7fd6" display="none"/>' +
    '<text class="rk" x="26" y="0" text-anchor="end" font-size="11" fill="#6b7385"></text>' +
    '<text class="nm" x="' + X_NAME + '" y="0" font-size="11" letter-spacing="-0.2" fill="#1c2230" style="transition:fill .2s">' + it[0] + '</text>' +
    '<text class="cg" x="' + catX[i] + '" y="0" font-size="9" fill="#6b7385"></text>' +
    '<rect class="br" x="' + X_BAR + '" y="-9.5" height="12" rx="2" width="0" fill="#2b7fd6" opacity="0.55" style="transition:opacity .2s"/>' +
    '<text class="dv" x="' + (X_BAR + 6) + '" y="0" font-size="11" fill="#1c2230"></text></g>').join('');

  const rows = Array.prototype.slice.call(rowsG.querySelectorAll('.row')).map(g => ({
    g: g,
    dot: g.querySelector('.dot'), rk: g.querySelector('.rk'), nm: g.querySelector('.nm'),
    cg: g.querySelector('.cg'), br: g.querySelector('.br'), dv: g.querySelector('.dv')
  }));
  const curY = rows.map(() => rowY(MAXROW));
  let raf = 0;

  // 정렬: 회색이 아닌 항목 먼저 → 등장 일수 내림차순 → 원본 배열 순서
  function order() {
    const off = {};
    let n = 0;
    chips.forEach(b => { if (b.classList.contains('on')) { off[b.getAttribute('data-cat')] = 1; n++; } });
    const ex = ITEMS.map(it => off[it[2]] === 1);
    const idx = ITEMS.map((_, i) => i).sort((a, b) => {
      if (ex[a] !== ex[b]) return ex[a] ? 1 : -1;
      if (ITEMS[b][1] !== ITEMS[a][1]) return ITEMS[b][1] - ITEMS[a][1];
      return a - b;
    });
    return { ex: ex, idx: idx, chipsOn: n };
  }

  function draw(animate) {
    const st = order(), ex = st.ex, idx = st.idx;
    const base = ITEMS[idx[0]][1];               // 현재 1위(회색이 아닌 항목)의 등장 일수
    const pick = pickBtn.classList.contains('on');
    const target = new Array(rows.length);
    const keep = [];                             // 회색이 아닌 항목의 순서
    let rank = 0;

    for (let p = 0; p < idx.length; p++) {
      const i = idx[p], r = rows[i], d = ITEMS[i], gray = ex[i];
      if (!gray) { rank++; keep.push(i); }
      if (p >= MAXROW) { target[i] = rowY(MAXROW); r.g.setAttribute('display', 'none'); continue; }
      target[i] = rowY(p);
      r.g.removeAttribute('display');
      const w = Math.min(W_BAR, d[1] / base * W_BAR);
      r.rk.textContent = gray ? '' : String(rank);
      r.nm.setAttribute('fill', gray ? '#b9b3a5' : '#1c2230');
      r.cg.textContent = gray ? CAT[d[2]] : '';
      r.br.setAttribute('width', w.toFixed(1));
      r.br.setAttribute('opacity', gray ? '0.18' : '0.55');
      r.dv.setAttribute('x', (X_BAR + w + 6).toFixed(1));
      r.dv.setAttribute('fill', gray ? '#b9b3a5' : '#1c2230');
      r.dv.textContent = String(d[1]);
      if (pick && isMenu[i]) r.dot.removeAttribute('display'); else r.dot.setAttribute('display', 'none');
    }

    // 머리줄 · 범례
    const left = keep.length;
    hright.textContent = '남은 항목 ' + left + '종 · 걸러 낸 항목 ' + (ITEMS.length - left) + '종';
    legend.setAttribute('display', pick ? 'inline' : 'none');

    // 여덟 번째 아래 점선(회색이 아닌 항목 기준 · 항상 여덟째 자리)
    cutG.setAttribute('display', left >= 8 ? 'inline' : 'none');

    // 결과 문장
    let s = st.chipsOn === 0 ? '제외 기준 없음' : '제외 기준 ' + st.chipsOn + '종 적용';
    s += ' · 남은 항목 ' + left + '종';
    if (left >= 8) {
      const cnt = v => keep.filter(i => ITEMS[i][1] === v).length;
      const dc = ITEMS[keep[7]][1];              // 여덟 번째 자리의 등장 일수
      let above = null;
      for (let k = 0; k < keep.length; k++) { const v = ITEMS[keep[k]][1]; if (v > dc) above = v; }
      if (cnt(dc) >= 2) {                        // 동점일 때만 묶음 수를 덧붙인다
        if (above !== null && cnt(above) >= 2) s += ' · ' + above + '일 ' + cnt(above) + '종';
        s += ' · ' + dc + '일 ' + cnt(dc) + '종';
      }
      if (pick) {
        const top8 = keep.slice(0, 8).map(i => ITEMS[i][0]);
        const diff = MENUS.filter(m => top8.indexOf(m) < 0).length;
        s += ' · 등장 일수 순 여덟과 수업 후보 여덟은 ' + diff + '종이 다름';
      }
    }
    out.textContent = s;

    // 행 재정렬
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!animate) {
      for (let i = 0; i < rows.length; i++) {
        curY[i] = target[i];
        rows[i].g.setAttribute('transform', 'translate(0,' + curY[i] + ')');
      }
      return;
    }
    const from = curY.slice();
    let t0 = 0;
    const step = ts => {
      if (!t0) t0 = ts;
      let k = (ts - t0) / 300; if (k > 1) k = 1;
      const e = 1 - (1 - k) * (1 - k);
      for (let i = 0; i < rows.length; i++) {
        curY[i] = from[i] + (target[i] - from[i]) * e;
        rows[i].g.setAttribute('transform', 'translate(0,' + curY[i].toFixed(1) + ')');
      }
      raf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  }

  function toggle(b) {
    b.classList.toggle('on');
    b.setAttribute('aria-pressed', b.classList.contains('on') ? 'true' : 'false');
    draw(true);
  }
  chips.forEach(b => b.addEventListener('click', () => toggle(b)));
  pickBtn.addEventListener('click', () => toggle(pickBtn));
  draw(false);
}

function initW_duel28(root, D) {
  if (!D || !D.menus || D.menus.length < 8) return;
  var MENUS = D.menus.slice(0, 8);
  var DAYS = (D.days || []).slice(0, 8);
  var CIRC = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
  var KOR = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
  var GUIDE = '한 판 진행 · 일곱 번 선택';
  var i, j, k, s;

  var q = function (sel) { return root.querySelector(sel); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var CX = function (col) { return 112 + (col - 1) * 30; };
  var CY = function (rw) { return 64 + rw * 30; };
  var key = function (a, b) { return (a < b ? a : b) * 8 + (a < b ? b : a); };

  // ── 격자 라벨 ──────────────────────────────────────────────
  s = '';
  for (j = 1; j < 8; j++) {
    s += '<text x="' + (CX(j) + 15) + '" y="56" text-anchor="middle" font-size="10" font-weight="700" fill="#6b7385">' + CIRC[j] + '</text>';
  }
  q('.collab').innerHTML = s;

  s = '';
  for (i = 0; i < 7; i++) {
    var nm = CIRC[i] + MENUS[i];
    var fit = nm.length * 10.2 > 94 ? ' textLength="94" lengthAdjust="spacingAndGlyphs"' : '';
    s += '<text x="104" y="' + (CY(i) + 20) + '" text-anchor="end" font-size="10" letter-spacing="-0.2" fill="#1c2230"' + fit + '>' + esc(nm) + '</text>';
  }
  q('.rowlab').innerHTML = s;

  // ── 격자 28칸 ──────────────────────────────────────────────
  var keys = [];
  s = '';
  for (i = 0; i < 7; i++) {
    for (j = i + 1; j < 8; j++) {
      var x = CX(j), y = CY(i);
      s += '<g class="cell" style="transition:opacity 180ms ease">'
        + '<rect x="' + x + '" y="' + y + '" width="30" height="30" rx="3" fill="#efece4" fill-opacity="1" stroke="#d8d3c6" stroke-width="1" style="transition:fill 180ms ease,fill-opacity 180ms ease"/>'
        + '<text class="cw" x="' + (x + 15) + '" y="' + (y + 20) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#1c2230" opacity="0">' + CIRC[0] + '</text>'
        + '<text class="cn" x="' + (x + 27) + '" y="' + (y + 28) + '" text-anchor="end" font-size="8" font-weight="700" fill="#1c2230" opacity="0">2</text>'
        + '</g>';
      keys.push(i * 8 + j);
    }
  }
  q('.cells').innerHTML = s;

  var cellG = {}, cellR = {}, cellW = {}, cellN = {};
  var nodes = root.querySelectorAll('.cells > .cell');
  for (k = 0; k < keys.length; k++) {
    cellG[keys[k]] = nodes[k];
    cellR[keys[k]] = nodes[k].querySelector('rect');
    cellW[keys[k]] = nodes[k].querySelector('.cw');
    cellN[keys[k]] = nodes[k].querySelector('.cn');
  }

  // ── 오른쪽 표 8행 ──────────────────────────────────────────
  s = '';
  for (i = 0; i < 8; i++) {
    s += '<g class="trow" style="transition:transform 300ms ease;transform:translate(0px,' + (72 + i * 30) + 'px)">'
      + '<text x="368" y="0" font-size="11" fill="#1c2230">' + esc(CIRC[i] + MENUS[i]) + '</text>'
      + '<text class="tg" x="566" y="0" text-anchor="end" font-size="11" fill="#1c2230" style="font-variant-numeric:tabular-nums">—</text>'
      + '<text class="tw" x="618" y="0" text-anchor="end" font-size="11" fill="#1c2230" style="font-variant-numeric:tabular-nums">—</text>'
      + '<text class="tr" x="676" y="0" text-anchor="end" font-size="11" font-weight="700" fill="#2b7fd6" style="font-variant-numeric:tabular-nums">—</text>'
      + '<text class="tl" x="712" y="0" text-anchor="end" font-size="11" fill="#b9b3a5" style="font-variant-numeric:tabular-nums">—</text>'
      + '</g>';
  }
  q('.tbl').innerHTML = s;
  var trow = root.querySelectorAll('.tbl > .trow');

  // ── 상태 ───────────────────────────────────────────────────
  var ans = {};      // 쌍 번호 → 승자 후보 번호(학생이 고른 값)
  var occ = {};      // 쌍 번호 → 대결 등장 횟수
  var duels = [];    // [a, b, 승자] 대결 행
  var roundNo = 1, champ = -1;
  var seq = null, step = 0, fillQ = null, fillPos = 0;
  var blinkT = null, champT = null, wasFull = false;

  // ── 고정 시드 의사난수 ─────────────────────────────────────
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function bracket(no) {
    var r = rng(1309 + no), arr = [0, 1, 2, 3, 4, 5, 6, 7], p, m, t;
    for (p = 7; p > 0; p--) {
      m = Math.floor(r() * (p + 1));
      t = arr[p]; arr[p] = arr[m]; arr[m] = t;
    }
    return arr;
  }

  // ── 집계 ───────────────────────────────────────────────────
  function counts() {
    var g = [0, 0, 0, 0, 0, 0, 0, 0], w = [0, 0, 0, 0, 0, 0, 0, 0];
    var lt = [0, 0, 0, 0, 0, 0, 0, 0], lw = [0, 0, 0, 0, 0, 0, 0, 0];
    var t, a, b, r;
    for (t = 0; t < duels.length; t++) {
      r = duels[t]; g[r[0]]++; g[r[1]]++; w[r[2]]++;
    }
    for (a = 0; a < 7; a++) {
      for (b = a + 1; b < 8; b++) {
        if (ans[a * 8 + b] !== undefined) { lt[a]++; lt[b]++; lw[ans[a * 8 + b]]++; }
      }
    }
    return { g: g, w: w, lt: lt, lw: lw };
  }
  function answered() {
    var n = 0, kk;
    for (kk in ans) { if (Object.prototype.hasOwnProperty.call(ans, kk)) n++; }
    return n;
  }
  function gridOf() {
    var G = [], a, b;
    for (a = 0; a < 8; a++) { G.push([0, 0, 0, 0, 0, 0, 0, 0]); }
    for (a = 0; a < 7; a++) {
      for (b = a + 1; b < 8; b++) {
        var w2 = ans[a * 8 + b];
        if (w2 !== undefined) { G[w2][w2 === a ? b : a] = 1; }
      }
    }
    return G;
  }
  function emit(grid) {
    root.dispatchEvent(new CustomEvent('w13:grid', { detail: { grid: grid }, bubbles: true }));
  }

  function render() {
    var n = answered(), c = counts(), full = n === 28, a, b, kk, o, w2;
    q('.obs').textContent = '관측 ' + n + ' / 28';

    for (a = 0; a < 7; a++) {
      for (b = a + 1; b < 8; b++) {
        kk = a * 8 + b; w2 = ans[kk]; o = occ[kk] || 0;
        if (w2 === undefined) {
          cellR[kk].setAttribute('fill', '#efece4');
          cellR[kk].setAttribute('fill-opacity', '1');
          cellW[kk].setAttribute('opacity', '0');
          cellN[kk].setAttribute('opacity', '0');
        } else {
          cellR[kk].setAttribute('fill', '#2b7fd6');
          cellR[kk].setAttribute('fill-opacity', o >= 3 ? '0.75' : (o === 2 ? '0.55' : '0.35'));
          cellW[kk].textContent = CIRC[w2];
          cellW[kk].setAttribute('opacity', '1');
          if (o >= 2) { cellN[kk].textContent = String(o); cellN[kk].setAttribute('opacity', '0.9'); }
          else { cellN[kk].setAttribute('opacity', '0'); }
        }
      }
    }

    var idx = [0, 1, 2, 3, 4, 5, 6, 7];
    idx.sort(function (p, r) {
      var gp = c.g[p], gr = c.g[r];
      if ((gp > 0) !== (gr > 0)) { return gp > 0 ? -1 : 1; }
      if (gp > 0) {
        var rp = c.w[p] / gp, rr = c.w[r] / gr;
        if (rp !== rr) { return rr - rp; }
        if (gp !== gr) { return gr - gp; }
      }
      if (DAYS[p] !== DAYS[r]) { return DAYS[r] - DAYS[p]; }
      return p - r;
    });
    var p2;
    for (p2 = 0; p2 < 8; p2++) {
      var m2 = idx[p2], row = trow[m2], gg = c.g[m2];
      row.style.transform = 'translate(0px,' + (72 + p2 * 30) + 'px)';
      row.querySelector('.tg').textContent = gg > 0 ? String(gg) : '—';
      row.querySelector('.tw').textContent = gg > 0 ? String(c.w[m2]) : '—';
      row.querySelector('.tr').textContent = gg > 0 ? (c.w[m2] / gg).toFixed(2) : '—';
      var tl = row.querySelector('.tl');
      tl.textContent = c.lt[m2] > 0 ? (full ? (c.lw[m2] / 7).toFixed(2) : c.lw[m2] + ' / ' + c.lt[m2]) : '—';
      tl.setAttribute('fill', full ? '#1c2230' : '#b9b3a5');
    }

    var txt = '관측 ' + n + ' / 28 · 미관측 ' + (28 - n) + '칸';
    if (duels.length > 0) {
      var mx = 0, mn = 99, seen = {}, kinds = 0, v;
      for (a = 0; a < 8; a++) {
        if (c.g[a] > 0) {
          if (c.g[a] > mx) { mx = c.g[a]; }
          if (c.g[a] < mn) { mn = c.g[a]; }
          v = (c.w[a] / c.g[a]).toFixed(2);
          if (!seen[v]) { seen[v] = 1; kinds++; }
        }
      }
      txt += ' · 대결 수 최대 ' + mx + ' · 최소 ' + mn + ' · 승률 값 ' + KOR[kinds] + ' 가지';
    }
    q('.wout').textContent = txt;

    if (full && !wasFull) { wasFull = true; emit(gridOf()); }
    else if (!full && wasFull) { wasFull = false; emit(null); }
  }

  // ── 표시 효과 ──────────────────────────────────────────────
  function clearBlink() {
    if (blinkT) { clearTimeout(blinkT); blinkT = null; }
    var t;
    for (t = 0; t < keys.length; t++) { cellG[keys[t]].style.opacity = '1'; }
  }
  function blink(list) {
    clearBlink();
    if (!list.length) { return; }
    var snap = list.slice(), t;
    for (t = 0; t < snap.length; t++) { cellG[snap[t]].style.opacity = '0.3'; }
    blinkT = setTimeout(function () {
      var u;
      for (u = 0; u < snap.length; u++) { cellG[snap[u]].style.opacity = '1'; }
      blinkT = null;
    }, 180);
  }
  function flashChamp() {
    var bg = q('.champbg');
    bg.setAttribute('opacity', '1');
    if (champT) { clearTimeout(champT); }
    champT = setTimeout(function () { bg.setAttribute('opacity', '0'); champT = null; }, 300);
  }
  function focusCell(kk) {
    var f = q('.foc');
    f.setAttribute('x', String(CX(kk % 8)));
    f.setAttribute('y', String(CY(Math.floor(kk / 8))));
    f.setAttribute('opacity', '1');
  }
  function clearFocus() { q('.foc').setAttribute('opacity', '0'); }

  // ── 선택 줄 ────────────────────────────────────────────────
  function pickMsg(t) {
    q('.pick').innerHTML = '<span class="pmsg">' + esc(t) + '</span>';
  }
  function pickAsk(label, a, b, cb) {
    var pick = q('.pick');
    pick.innerHTML = '<span class="pmsg">' + esc(label) + '</span>'
      + '<button class="wbtn" type="button" data-m="' + a + '">' + esc(CIRC[a] + MENUS[a]) + '</button>'
      + '<button class="wbtn" type="button" data-m="' + b + '">' + esc(CIRC[b] + MENUS[b]) + '</button>';
    var bs = pick.querySelectorAll('button'), t;
    for (t = 0; t < bs.length; t++) {
      (function (btn) {
        var used = false;
        btn.addEventListener('click', function () {
          if (used) { return; }
          used = true;
          cb(Number(btn.getAttribute('data-m')));
        });
      })(bs[t]);
    }
  }

  // ── 한 판 진행 ─────────────────────────────────────────────
  function record(m, kk) {
    m.w = ans[kk];
    occ[kk] = (occ[kk] || 0) + 1;
    duels.push([m.a, m.b, m.w]);
  }
  function startRound() {
    var o = bracket(roundNo);
    seq = [
      { a: o[0], b: o[1], r: '8강 1' }, { a: o[2], b: o[3], r: '8강 2' },
      { a: o[4], b: o[5], r: '8강 3' }, { a: o[6], b: o[7], r: '8강 4' }
    ];
    step = 0;
    advance();
  }
  function advance() {
    var again = [], done = false, m, kk;
    while (true) {
      if (step >= seq.length) {
        if (seq.length === 4) {
          seq.push({ a: seq[0].w, b: seq[1].w, r: '4강 1' });
          seq.push({ a: seq[2].w, b: seq[3].w, r: '4강 2' });
          continue;
        }
        if (seq.length === 6) {
          seq.push({ a: seq[4].w, b: seq[5].w, r: '결승' });
          continue;
        }
        done = true;
        break;
      }
      m = seq[step]; kk = key(m.a, m.b);
      if (ans[kk] === undefined) {
        focusCell(kk);
        pickAsk(m.r + ' · 선택', m.a, m.b, (function (mm, k2) {
          return function (w) {
            ans[k2] = w; record(mm, k2); step++;
            clearFocus(); advance();
          };
        })(m, kk));
        break;
      }
      record(m, kk); again.push(kk); step++;
    }
    render();
    blink(again);
    if (done) {
      var prev = champ;
      champ = seq[6].w;
      clearFocus();
      pickMsg(GUIDE);
      q('.champ').textContent = '이번 판 우승 · ' + MENUS[champ];
      if (prev >= 0 && prev !== champ) { flashChamp(); }
    }
  }

  // ── 남은 칸 채우기 ─────────────────────────────────────────
  function startFill() {
    var a, b;
    fillQ = []; fillPos = 0;
    for (a = 0; a < 7; a++) {
      for (b = a + 1; b < 8; b++) { if (ans[a * 8 + b] === undefined) { fillQ.push(a * 8 + b); } }
    }
    if (!fillQ.length) { pickMsg('미답 0칸 · 관측 28 / 28'); return; }
    askFill();
  }
  function askFill() {
    if (fillPos >= fillQ.length) {
      clearFocus(); pickMsg(GUIDE); render();
      return;
    }
    var kk = fillQ[fillPos];
    focusCell(kk);
    pickAsk('남은 칸 ' + (fillPos + 1) + ' / ' + fillQ.length, Math.floor(kk / 8), kk % 8, function (w) {
      ans[kk] = w; fillPos++;
      clearFocus(); render(); askFill();
    });
  }

  // ── 단추 ───────────────────────────────────────────────────
  function reset() {
    ans = {}; occ = {}; duels = []; roundNo = 1; champ = -1;
    seq = null; fillQ = null; fillPos = 0; wasFull = false;
    if (champT) { clearTimeout(champT); champT = null; }
    clearBlink(); clearFocus(); pickMsg(GUIDE);
    q('.champ').textContent = '이번 판 우승 · —';
    q('.champbg').setAttribute('opacity', '0');
    render();
    emit(null);
  }
  var acts = {
    play: function () { startRound(); },
    redraw: function () { roundNo++; startRound(); },
    fill: function () { startFill(); },
    reset: function () { reset(); }
  };
  var btns = root.querySelectorAll('.wctl .wbtn[data-act]'), bi;
  for (bi = 0; bi < btns.length; bi++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var act = acts[btn.getAttribute('data-act')];
        if (!act) { return; }
        if (btn.getAttribute('data-act') !== 'reset') { clearFocus(); pickMsg(GUIDE); }
        act();
      });
    })(btns[bi]);
  }

  render();
}

function initW_rankcross13(root, D) {
  // 13차시 위젯 — rankcross13. 답 한 묶음을 고정한 채 대진 315가지를 훑어
  // 한 판 지표 순위와 리그 승률 순위(분모 7)가 어긋나는 자리를 교차선으로 보인다.
  // D = window.LESSON_DATA { menus[8], days[8], pairA[8][8] }. pairB는 저장하지 않고 코드에서 만든다.
  //
  // [수업 뒤 실측 교체 절차]
  //   SELECT left_menu, right_menu, winner FROM menu_duels;
  //   쌍별 다수결로 8×8 행렬을 만들어 data.json의 pairA 한 곳만 덮어쓴다.
  //   동수인 쌍을 미관측으로 남기면 315 전수 열거가 성립하지 않으므로 교사가 한쪽으로 확정한다.
  //   교체 뒤 확인: 대각 0 · 역방향 배타 · 전수 우승 합 315.
  // pairA는 실측 기록이 아니라 예시 학급 답이다.
  var i, j;
  var MENUS = D.menus, DAYS = D.days;
  var N = 8, ROW_Y0 = 48, ROW_H = 30, LX = 254, RX = 466, CY = -4;

  // 예시 답 B — 완전 이행적 순서
  var PB = [];
  for (i = 0; i < N; i++) { PB.push([]); for (j = 0; j < N; j++) PB[i].push(i < j ? 1 : 0); }

  // ── 대진 315가지 열거(사전순 순열 → 정규화 키로 중복 제거) ──────────────
  function nextPerm(a) {
    var p = a.length - 2;
    while (p >= 0 && a[p] >= a[p + 1]) p--;
    if (p < 0) return false;
    var qq = a.length - 1;
    while (a[qq] <= a[p]) qq--;
    var t = a[p]; a[p] = a[qq]; a[qq] = t;
    for (var l = p + 1, r = a.length - 1; l < r; l++, r--) { var s = a[l]; a[l] = a[r]; a[r] = s; }
    return true;
  }
  function brKey(q) {
    var pr = [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]], [q[6], q[7]]], m;
    for (m = 0; m < 4; m++) pr[m].sort(function (a, b) { return a - b; });
    var b1 = [pr[0], pr[1]].sort(function (a, b) { return a[0] - b[0]; });
    var b2 = [pr[2], pr[3]].sort(function (a, b) { return a[0] - b[0]; });
    var bs = [b1, b2].sort(function (a, b) { return a[0][0] - b[0][0]; });
    return bs[0][0].join('-') + '|' + bs[0][1].join('-') + '/' + bs[1][0].join('-') + '|' + bs[1][1].join('-');
  }
  var BR = [], seenBr = Object.create(null), perm = [0, 1, 2, 3, 4, 5, 6, 7];
  do {
    var kk = brKey(perm);
    if (!seenBr[kk]) { seenBr[kk] = 1; BR.push(perm.slice()); }
  } while (nextPerm(perm));

  // ── 한 대진 진행: 8강 → 4강 → 결승 ─────────────────────────────────────
  function play(P, br) {
    var w = new Array(N), m = new Array(N);
    for (var t = 0; t < N; t++) { w[t] = 0; m[t] = 0; }
    function duel(x, y) { m[x]++; m[y]++; if (P[x][y] === 1) { w[x]++; return x; } w[y]++; return y; }
    var q0 = duel(br[0], br[1]), q1 = duel(br[2], br[3]);
    var q2 = duel(br[4], br[5]), q3 = duel(br[6], br[7]);
    var s0 = duel(q0, q1), s1 = duel(q2, q3);
    var ch = duel(s0, s1);
    return { w: w, m: m, ch: ch, ru: ch === s0 ? s1 : s0 };
  }
  // ── 답 한 묶음의 315판 캐시(초기 1회, 315×7 = 2,205 대결) ────────────────
  function build(P) {
    var per = [], champ = new Array(N), runner = new Array(N), tm = new Array(N), t, u;
    for (t = 0; t < N; t++) { champ[t] = 0; runner[t] = 0; tm[t] = 0; }
    for (t = 0; t < BR.length; t++) {
      var r = play(P, BR[t]);
      per.push(r); champ[r.ch]++; runner[r.ru]++;
      for (u = 0; u < N; u++) tm[u] += r.m[u];
    }
    var lg = [];
    for (t = 0; t < N; t++) { var s = 0; for (u = 0; u < N; u++) s += P[t][u]; lg.push(s / (N - 1)); }
    var nz = 0; for (t = 0; t < N; t++) if (runner[t] > 0) nz++;
    var fixed = 0; for (t = 0; t < N; t++) if (champ[t] === BR.length) fixed = 1;
    return { per: per, champ: champ, runner: runner, tm: tm, lg: lg, ruKinds: nz, chFixed: fixed };
  }
  var CACHE = { A: build(D.pairA), B: build(PB), M: null };

  // ── 순위(값 내림차순 → 대결 수 → 등장 일수 → 후보 번호) ────────────────
  var SEVEN = []; for (i = 0; i < N; i++) SEVEN.push(N - 1);
  function rankOf(vals, mts) {
    var ix = []; for (var t = 0; t < N; t++) ix.push(t);
    ix.sort(function (a, b) {
      return (vals[b] - vals[a]) || (mts[b] - mts[a]) || (DAYS[b] - DAYS[a]) || (a - b);
    });
    var r = new Array(N);
    for (t = 0; t < N; t++) r[ix[t]] = t;
    return r;
  }
  function okGrid(g) {
    if (!g || g.length !== N) return false;
    for (var a = 0; a < N; a++) {
      if (!g[a] || g[a].length !== N || g[a][a] !== 0) return false;
      for (var b = 0; b < N; b++) if (a !== b && g[a][b] + g[b][a] !== 1) return false;
    }
    return true;
  }

  // ── 요소 ────────────────────────────────────────────────────────────────
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { var out = [], nl = root.querySelectorAll(s); for (var t = 0; t < nl.length; t++) out.push(nl[t]); return out; };
  var rowsL = qa('.rowL'), rowsR = qa('.rowR'), links = qa('.lnk');
  var rkT = [], vLT = [], vRT = [];
  for (i = 0; i < N; i++) {
    rkT.push(rowsL[i].querySelector('.rk'));
    vLT.push(rowsL[i].querySelector('.vL'));
    vRT.push(rowsR[i].querySelector('.vR'));
  }
  var ttlR = q('.ttlR'), out = q('.wout'), slider = q('.wslider');
  var mBtns = qa('.wmetric'), aBtns = qa('.wans'), mineBtn = q('.wmine');

  // 이름·등장 일수는 D를 원본으로 다시 쓴다(팩 교체 때 정적 마크업과 어긋나지 않게).
  function fill(nodes, sel, text, budget) {
    for (var t = 0; t < N; t++) {
      var e = nodes[t].querySelector(sel);
      if (!e) continue;
      e.textContent = text[t];
      if (String(text[t]).length * 9.8 > budget) {
        e.setAttribute('textLength', String(budget));
        e.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      } else {
        e.removeAttribute('textLength');
        e.removeAttribute('lengthAdjust');
      }
    }
  }
  var dayTxt = []; for (i = 0; i < N; i++) dayTxt.push(String(DAYS[i]));
  fill(rowsL, '.nmL', MENUS, 160);
  fill(rowsR, '.nmR', MENUS, 138);
  fill(rowsL, '.dyL', dayTxt, 14);
  fill(rowsR, '.dyR', dayTxt, 14);

  var METRIC_LABEL = { wins: '한 판 승리 수', rate: '한 판 승률', champ: '우승 횟수 · ' + BR.length + '판 합계' };
  var metric = 'wins', answer = 'A', brIdx = 0;
  var curYL = [], curYR = [], seq = 0, raf = 0;
  for (i = 0; i < N; i++) { curYL.push(ROW_Y0); curYR.push(ROW_Y0); }

  function pack() {
    if (answer === 'M' && CACHE.M) return CACHE.M;
    return answer === 'B' ? CACHE.B : CACHE.A;
  }
  var fmt = function (v) { return String(Math.round(v * 10) / 10); };
  function pathOf(yl, yr) {
    var a = fmt(yl + CY), b = fmt(yr + CY);
    return 'M' + LX + ',' + a + ' C330,' + a + ' 390,' + b + ' ' + RX + ',' + b;
  }
  function draw() {
    for (var t = 0; t < N; t++) {
      var yl = curYL[t], yr = curYR[t];
      rowsL[t].setAttribute('transform', 'translate(0,' + fmt(yl) + ')');
      rowsR[t].setAttribute('transform', 'translate(0,' + fmt(yr) + ')');
      links[t].setAttribute('d', pathOf(yl, yr));
    }
  }

  // ── 갱신 ────────────────────────────────────────────────────────────────
  function apply(instant) {
    var C = pack(), t;
    var rL = rankOf(C.lg, SEVEN);
    var cur = C.per[brIdx];
    var vals, mts, txt, tail, head;

    if (metric === 'champ') {
      vals = C.champ; mts = C.tm;
      txt = function (m) { return C.champ[m] + '회 / ' + BR.length + '판'; };
      head = BR.length + '판 합계';
      if (C.chFixed) {
        tail = '우승 고정 · 준우승 ' + C.ruKinds + '종으로 갈림';
      } else {
        // 동률을 단독 1위로 적지 않는다(예시 답 A는 90회 동률 2종).
        var top = 0, tie = 0;
        for (t = 1; t < N; t++) if (C.champ[t] > C.champ[top]) top = t;
        for (t = 0; t < N; t++) if (C.champ[t] === C.champ[top]) tie++;
        tail = tie > 1
          ? '우승 최다 ' + C.champ[top] + '회 동률 ' + tie + '종'
          : '우승 최다 ' + MENUS[top];
      }
    } else {
      mts = cur.m;
      if (metric === 'wins') {
        vals = cur.w;
        txt = function (m) { return cur.w[m] + ' / ' + cur.m[m]; };
      } else {
        vals = []; for (t = 0; t < N; t++) vals.push(cur.w[t] / cur.m[t]);
        txt = function (m) { return vals[m].toFixed(2) + ' · 대결 ' + cur.m[m]; };
      }
      head = '대진 ' + (brIdx + 1);
      tail = '이번 판 우승 ' + MENUS[cur.ch];
    }
    var rR = rankOf(vals, mts);

    var moved = 0, maxd = 0;
    for (t = 0; t < N; t++) {
      var d = Math.abs(rL[t] - rR[t]);
      if (d > 0) moved++;
      if (d > maxd) maxd = d;
      rkT[t].textContent = String(rL[t] + 1);
      vLT[t].textContent = C.lg[t].toFixed(2);
      vRT[t].textContent = txt(t);
      links[t].setAttribute('stroke', d >= 2 ? '#d64545' : '#b9b3a5');
      links[t].setAttribute('stroke-width', d >= 2 ? '2.2' : '1.2');
    }
    out.textContent = head + ' · 순위가 바뀐 반찬 ' + moved + '종 · 최대 순위차 ' + maxd + ' · ' + tail;

    var tL = [], tR = [];
    for (t = 0; t < N; t++) { tL.push(ROW_Y0 + rL[t] * ROW_H); tR.push(ROW_Y0 + rR[t] * ROW_H); }
    move(tL, tR, instant);
  }

  var ease = function (u) { return u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u); };
  function move(tL, tR, instant) {
    seq++;
    var mine = seq, t;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (instant) {
      for (t = 0; t < N; t++) { curYL[t] = tL[t]; curYR[t] = tR[t]; }
      draw(); return;
    }
    var fL = curYL.slice(), fR = curYR.slice(), t0 = -1;
    var same = true;
    for (t = 0; t < N; t++) if (fL[t] !== tL[t] || fR[t] !== tR[t]) same = false;
    if (same) { draw(); return; }
    function step(now) {
      if (mine !== seq) return;
      if (t0 < 0) t0 = now;
      var u = Math.min(1, (now - t0) / 300), e = ease(u);
      for (var s = 0; s < N; s++) {
        curYL[s] = fL[s] + (tL[s] - fL[s]) * e;
        curYR[s] = fR[s] + (tR[s] - fR[s]) * e;
      }
      draw();
      if (u < 1) raf = requestAnimationFrame(step); else raf = 0;
    }
    raf = requestAnimationFrame(step);
  }

  // 오른쪽 제목 크로스페이드 200ms.
  // 목표 라벨을 ttlNow에 따로 들고 비교한다 — 화면 글자로 비교하면 200ms 안에
  // 두 번 눌렀을 때 앞선 애니메이션이 뒤늦게 옛 라벨을 써 넣어 제목과 값이 어긋난다.
  var tSeq = 0, tRaf = 0, ttlNow = METRIC_LABEL.wins;
  function setTitle(label) {
    if (ttlNow === label) return;
    ttlNow = label;
    tSeq++;
    var mine = tSeq, t0 = -1, swapped = false;
    if (tRaf) { cancelAnimationFrame(tRaf); tRaf = 0; }
    function step(now) {
      if (mine !== tSeq) return;
      if (t0 < 0) t0 = now;
      var u = Math.min(1, (now - t0) / 200);
      if (u >= 0.5 && !swapped) { ttlR.textContent = label; swapped = true; }
      ttlR.setAttribute('opacity', (u < 0.5 ? 1 - 2 * u : 2 * u - 1).toFixed(3));
      if (u < 1) { tRaf = requestAnimationFrame(step); }
      else { ttlR.textContent = label; ttlR.setAttribute('opacity', '1'); tRaf = 0; }
    }
    tRaf = requestAnimationFrame(step);
  }

  function markOn(list, attr, val) {
    for (var t = 0; t < list.length; t++) list[t].classList.toggle('on', list[t].getAttribute(attr) === val);
  }

  // ── 리스너 ──────────────────────────────────────────────────────────────
  slider.addEventListener('input', function () {
    var v = Math.round(Number(slider.value));
    if (!(v >= 1)) v = 1;
    if (v > BR.length) v = BR.length;
    if (v - 1 === brIdx) return;
    brIdx = v - 1;
    apply(true);
  });
  for (i = 0; i < mBtns.length; i++) (function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-m');
      if (m === metric) return;
      metric = m;
      markOn(mBtns, 'data-m', m);
      setTitle(METRIC_LABEL[m]);
      apply(false);
    });
  })(mBtns[i]);
  for (i = 0; i < aBtns.length; i++) (function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-a');
      if (a === answer || b.disabled) return;
      answer = a;
      markOn(aBtns, 'data-a', a);
      apply(false);
    });
  })(aBtns[i]);

  // duel28의 28칸 완성 신호(w13:grid). detail.grid가 배열이면 열고, null이면 닫는다.
  // duel28은 자기 root에서 bubbles로 올려 보내므로 문서 층에서 받는다.
  root.ownerDocument.addEventListener('w13:grid', function (ev) {
    var g = ev && ev.detail ? ev.detail.grid : null;
    if (okGrid(g)) {
      CACHE.M = build(g);
      mineBtn.disabled = false;
      mineBtn.textContent = '내 격자 답';
      if (answer === 'M') apply(false);
    } else {
      CACHE.M = null;
      mineBtn.disabled = true;
      mineBtn.textContent = '내 격자 답 (28칸 완성 후)';
      if (answer === 'M') {
        answer = 'A';
        markOn(aBtns, 'data-a', 'A');
        apply(false);
      }
    }
  });

  apply(true);
}
  const WIDGET_INIT = {menu8pick: initW_menu8pick, duel28: initW_duel28, rankcross13: initW_rankcross13};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
