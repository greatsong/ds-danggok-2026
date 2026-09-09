// 7차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson07.html)와 교재(lesson07.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = [[130,175,0,1402,2777,3,8624,8624,0],[153,213,0,3270,3270,1,3604,3604,0],[55,68,0,2983,6764,4,11982,11982,0],[648,1563,0,13957,72247,12,85189,85189,0],[306,395,0,1329,3076,2,17563,17563,5],[8,8,0,1431,1727977,34,2424803,2424803,-8],[225,819,0,11184,64868,16,92271,92271,0],[10,10,0,1892,226316,20,360799,360799,-2],[27,27,1,5096,2401055,41,4536211,4500029,-4],[8,8,1,2095,117681,20,164664,164664,-5],[78,99,0,1341,1341,1,10894,10894,6],[5,7,0,1813,7504,3,9175,9175,-5],[10,10,1,2084,2084,1,2302,2302,-2],[13,14,0,2792,192829,29,407791,407791,-6],[16,17,0,4087,1094809,38,1979498,1979498,-7],[7,8,0,1542,31907,14,45429,45429,-8],[6,7,0,1866,48165,12,59984,59984,-5],[262,345,0,3458,17202,7,18305,18305,0],[13,13,0,2879,382443,43,1540233,1540233,-9],[29,29,0,5943,1171238,117,16916280,16916280,-8],[940,3368,0,35018,433246,29,1067555,1067555,0],[535,1099,0,6090,42387,11,52636,52636,0],[40,48,0,8261,1234173,44,2925401,2925401,-2],[6,10,0,1452,113759,22,210768,210768,-16],[80,93,0,1181,1181,1,10816,10816,6],[84,91,0,6081,6081,1,7370,7370,0],[4,5,0,1017,63231,8,63425,63425,-8],[62,82,0,720,1760,2,9312,9312,5],[145,193,1,2765,8466,4,12783,12783,0],[260,894,0,13306,70240,7,71643,71643,0],[358,501,0,4241,37963,39,166061,166061,0],[5,5,1,1005,139947,77,1438794,1438794,-2],[4,5,0,1209,114214,30,206709,206709,-13],[4,5,1,1071,57270,10,69076,69076,-16],[8,9,0,2440,603704,50,1344042,1344042,-16],[4,5,0,1114,37344,10,45711,45711,-9],[74,85,0,1268,1268,1,8207,8207,6],[19,19,1,2907,591868,62,2594460,2594460,-15],[11,12,1,2837,223997,31,545602,545602,-8],[9,9,1,2153,116465,8,116465,116465,-13],[487,755,0,14612,44033,8,54826,54826,0],[84,104,0,1183,1183,1,9319,9319,6],[47,62,1,3774,3774,1,3924,3924,0],[130,245,1,5344,5344,2,14097,14097,0],[353,496,1,6072,23626,7,24026,24026,0],[16,18,1,2605,178166,15,235159,235159,-4],[240,343,1,6976,14550,4,33774,33774,3],[7,7,0,1259,1259,1,4001,4001,-2],[381,495,0,5633,27181,16,56231,56231,0],[78,96,0,798,798,1,6091,6091,6],[115,212,0,2164,3683,2,3683,3683,0],[188,221,0,2546,17587,15,61616,61616,1],[165,322,1,3762,3762,1,3762,3762,0],[39,69,1,2888,6285,3,7888,7888,0],[597,1033,1,23430,166398,21,319083,319083,0],[883,2916,0,34938,123387,11,135798,135798,0],[309,353,1,4359,4359,1,12813,12813,3],[247,492,0,10039,20150,6,46280,46280,0],[654,1547,1,13400,61877,7,63443,63443,0],[1072,2962,0,56083,214165,15,250842,250842,0],[533,915,1,9297,53095,10,67329,67329,0],[141,169,0,1463,16307,5,21127,21127,0],[142,168,0,2523,7986,4,11794,11794,0],[538,1413,0,10152,65791,15,98458,98458,0],[17,17,0,3516,152546,25,278409,278409,-8],[9,9,0,1941,2378091,72,5951761,5951761,-3],[2084,8027,0,309168,2399114,74,8604180,8604180,0],[253,394,0,3707,19928,5,22022,22022,0],[498,982,0,5939,18114,6,29806,29806,0],[30,30,0,4678,413610,34,737835,737835,-9],[571,1288,1,13096,97993,24,230625,230625,0],[779,2174,0,55680,149442,10,158573,158573,0],[136,163,1,3786,14979,10,38611,38611,0],[13,15,0,2784,861294,55,3232828,3232828,-15],[12,13,1,2588,435406,29,843211,843211,-2],[952,3456,0,34746,254118,21,415690,415690,0],[1699,5740,0,108146,595554,40,964710,964710,0],[557,1224,1,7260,32797,6,34000,34000,0],[251,646,0,7925,30694,7,33273,33273,0],[505,642,1,25204,62086,10,81767,81767,0],[536,1172,0,22185,335960,39,754046,754046,-3],[518,1143,0,9092,43225,14,65526,65526,0],[2582,8143,1,265031,2042076,56,6731026,6731026,0],[601,1195,0,21492,214575,31,521262,521262,0],[368,725,0,26349,98696,19,276229,276229,0],[524,1283,0,12011,62043,8,73110,73110,0],[843,2219,0,39581,266613,19,410827,410827,0],[267,302,0,4613,9779,2,13824,13824,2],[829,2557,0,108722,579237,81,3453440,3453440,0],[19,82,0,4789,31003,9,50640,50640,0],[269,401,0,4909,12175,2,14103,14103,0],[379,693,0,3405,25657,8,43913,43913,0],[245,752,0,16193,60232,12,74368,74368,0],[484,802,0,9569,67401,27,191245,191245,0],[409,527,0,18734,64222,9,101413,101413,0],[50,53,0,1228,2770,2,7534,7534,0],[102,112,0,2061,2061,2,25580,25580,0],[272,358,0,4585,12834,6,28800,28800,0],[158,310,0,3606,3606,1,3845,3845,0],[413,595,0,5409,22571,7,22785,22785,0],[749,2639,0,31965,211707,30,441742,441742,0],[95,157,0,1082,1082,1,1232,1232,1],[694,2206,0,32333,142874,16,217899,217899,0],[173,408,0,4459,7210,2,7210,7210,0],[7,9,0,1782,19342,6,24964,24964,-2],[385,463,0,6864,6864,1,7214,7214,0],[467,807,0,6209,28983,5,29175,29175,0],[157,450,0,5865,5865,1,6419,6419,0],[428,816,0,10479,42772,9,57770,57770,0],[86,305,0,4859,4859,1,5059,5059,0],[8,8,0,1043,6012,4,15533,15533,-8],[35,74,0,6166,6166,1,6166,6166,0],[809,2103,0,26242,137215,22,221481,221481,0],[406,484,1,13003,26035,4,26491,26491,0],[155,308,0,3401,8056,3,17612,17612,0],[314,492,1,6084,10172,2,10172,10172,0],[180,242,1,3605,7109,2,7145,7145,0],[1261,5132,0,82300,688408,35,1367031,1367031,0],[349,406,0,5307,10659,2,15309,15309,2],[399,676,0,7478,22187,7,22455,22455,0],[222,405,0,8053,16757,6,36194,36194,1],[167,193,1,3524,15833,7,17436,17436,0],[102,155,0,2423,0,1,14862,14862,63],[20,36,0,2596,2596,2,14867,14867,0],[45,47,0,1573,0,1,9645,9645,8],[26,26,1,1286,218117,24,357540,357540,-1],[439,631,1,6510,90871,29,249736,249736,0],[155,201,0,2045,5394,4,15323,15323,0],[502,911,1,7922,23060,5,34694,34694,0],[6,6,0,1320,9902,5,15968,15968,-8],[12,24,0,1953,1953,1,1953,1953,0],[180,349,0,7066,7066,1,7066,7066,0],[123,498,0,7013,39175,3,39175,39175,0],[23,33,0,2025,2025,1,2025,2025,0],[198,239,1,3304,10606,5,17124,17124,0],[141,222,1,4051,4051,1,4597,4597,0],[116,145,0,1742,4991,4,12346,12346,0],[76,76,1,5360,308411,29,476133,476133,-4],[16,16,0,2614,2614,1,2614,2614,-1],[30,32,1,590,942,2,3736,3736,1],[191,233,1,3003,17651,5,28422,28422,1],[63,68,1,3216,3216,5,27131,27131,0],[568,1257,0,17947,70220,13,87040,87040,0],[244,312,1,3012,3012,1,4084,4084,0],[46,52,0,941,941,2,10800,10800,6],[4,7,1,1233,20664,7,21784,21784,-2],[34,34,0,6378,726988,45,1615847,1615847,-13],[19,19,1,4567,7199,2,7199,7199,-9],[1166,4173,0,60433,1107652,34,1633044,1633044,0],[2,3,0,1537,991572,57,2942352,2942352,-6],[3,4,0,1001,959115,36,1590300,1590300,-2],[174,197,1,9292,25024,6,30151,30151,0],[1374,5260,1,67025,565882,33,1022927,1022927,0],[103,184,0,3029,7990,3,16881,16881,0],[355,453,0,12648,41115,6,45106,45106,0],[9,9,0,1160,41579,14,59179,59179,-2],[176,357,0,18263,68847,13,91031,91031,0],[119,194,1,1948,3439,2,3439,3439,0],[305,469,0,1548,8133,6,8133,8133,0],[145,229,0,16132,138998,18,207669,207669,0],[117,126,0,3119,7889,2,9942,9942,0],[83,93,1,1742,1742,1,2779,2779,0],[150,275,0,3562,12228,7,23203,23203,0],[118,160,0,7064,14489,11,75777,75777,0],[61,117,0,2897,2897,1,2897,2897,0],[220,437,0,5337,22181,10,28430,28430,0],[560,1408,0,11414,60284,14,78787,78787,0],[1,8,0,1165,1165,6,34104,34104,5],[32,32,0,5408,46067,16,67801,67801,-13],[1331,4086,0,76003,642028,72,2896778,2896778,0],[851,2448,1,31725,406423,31,773600,773600,0],[175,312,0,3783,19013,8,23192,23192,0],[13,15,0,2186,63925,17,92744,92744,-6],[38,46,0,2032,2032,1,3673,3673,2],[133,201,0,2194,3976,3,7695,7695,0],[88,119,0,2923,9261,5,13170,13170,0],[182,324,0,6012,11559,4,18567,18567,0],[134,197,0,2622,5649,2,7932,7932,2],[208,436,0,3513,17234,7,17746,17746,0],[174,298,0,3789,17896,7,17896,17896,0],[58,84,0,3178,4619,2,4619,4619,0],[129,246,0,2366,11651,7,15602,15602,0],[196,345,0,6701,12552,2,13055,13055,0],[170,228,1,2500,7768,4,12896,12896,0],[368,610,0,6378,32417,7,33691,33691,0],[842,2156,0,37037,147897,21,234543,234543,0],[90,149,0,5076,21189,14,41274,41274,0],[127,239,0,3468,5410,2,13670,13670,0],[100,136,0,2920,2920,1,2920,2920,0],[87,87,1,4968,82372,37,306439,299942,-5],[164,235,0,1833,4175,2,9515,9515,2],[339,423,0,2472,20628,7,30056,30056,0],[365,592,0,2543,14267,7,14433,14433,0],[54,64,0,706,706,1,4761,4761,6],[440,901,0,11687,50274,11,70388,70388,0],[688,1609,0,54103,458110,49,1211546,1211546,0],[221,372,0,6708,18745,5,30336,30336,0],[115,205,0,3895,15740,4,15740,15740,0],[34,34,0,1166,1166,1,6125,6125,6],[222,242,0,5419,11807,3,13617,13617,0],[295,352,0,3321,10572,4,12323,12323,0],[155,273,0,3635,27877,21,81338,81338,0],[17,17,0,3000,3000,1,3000,3000,-6],[485,738,0,6683,95761,14,159163,159163,0],[162,238,0,4456,4456,1,4456,4456,0],[738,1625,1,19984,79893,27,131844,131844,0],[21,21,0,1279,1279,1,1279,1279,0],[62,112,0,11499,20480,5,28218,28218,0],[214,281,0,4615,12842,5,12968,12968,0],[26,26,1,4947,9865,2,9991,9991,-13],[141,538,1,6619,42241,13,69574,69574,0],[378,733,1,8165,40781,10,53889,53889,0],[43,79,0,3353,10316,5,10316,10316,0],[1,8,0,1041,0,1,8609,8609,10],[143,214,1,4845,19877,7,19877,19877,0],[10,12,1,1302,0,3,13980,13980,13]];
function initW_wplane(root, D) {
  // 축소판 5편: kobis_movies.csv를 movieCd 오름차순 정렬한 뒤 인덱스 3·44·48·93·205(모두 학습 150편 소속)
  // [제목, 스크린(100관), 성수기, 실제 총 관객(만명)]
  const MINI = [['끝장수사', 6.48, 0, 8.5], ['굿 포츈', 3.53, 1, 2.4], ['햄넷', 3.81, 0, 5.6], ['국보', 4.84, 0, 19.1], ['마티 슈프림', 7.38, 1, 13.2]];

  // 가우스 소거로 정규방정식을 푼다(정답 수치 하드코딩 없음)
  function solveOLS(A, b) {
    const n = A.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      const t = M[c]; M[c] = M[p]; M[p] = t;
      const pv = M[c][c];
      for (let j = c; j <= n; j++) M[c][j] /= pv;
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = M[r][c];
        if (!f) continue;
        for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j];
      }
    }
    return M.map(r => r[n]);
  }
  function fit(cols) {
    const k = cols.length, A = [], bv = [];
    for (let i = 0; i < k; i++) { A.push(new Array(k).fill(0)); bv.push(0); }
    for (const m of MINI) {
      const f = cols.map(c => c(m)), y = m[3];
      for (let i = 0; i < k; i++) { for (let j = 0; j < k; j++) A[i][j] += f[i] * f[j]; bv[i] += f[i] * y; }
    }
    return solveOLS(A, bv);
  }
  const sse = (w1, w2, b) => MINI.reduce((s, m) => { const e = w1 * m[1] + w2 * m[2] + b - m[3]; return s + e * e; }, 0);

  const BEST = fit([m => m[1], m => m[2], () => 1]);        // 2.0123 · −4.0951 · 0.9179
  const BSSE = sse(BEST[0], BEST[1], BEST[2]);              // 114.631
  const FIXB = fit([m => m[1], () => 1]);                   // 1.8324 · 0.2171
  const FSSE = sse(FIXB[0], 0, FIXB[1]);                    // 134.390

  // 좌표: x 스크린 3~8 → 470~700, y 총 관객 0~22 → 290~70
  const sx = v => 470 + (v - 3) / 5 * 230;
  const sy = v => 290 - v / 22 * 220;

  const q = s => root.querySelector(s);
  const eq = q('.eq'), rows = q('.rows'), bar = q('.bar'), saw = q('.saw'), sseT = q('.sse');
  const l0 = q('.l0'), l1 = q('.l1'), ref = q('.ref'), reflab = q('.reflab'), marks = q('.marks');
  const s1 = q('.s1'), s2 = q('.s2'), s3 = q('.s3');
  const v1 = q('.v1'), v2 = q('.v2'), v3 = q('.v3');
  const bfix = q('.bfix'), bbest = q('.bbest'), bref = q('.bref'), fixnote = q('.fixnote');

  // 표기는 반올림한 값 기준(−0.0·−0.00 방지). 색 판정도 표기값을 따른다
  const r2 = v => { const t = Math.round(v * 100) / 100; return t === 0 ? 0 : t; };
  const r1 = v => { const t = Math.round(v * 10) / 10; return t === 0 ? 0 : t; };
  const num2 = v => { const t = r2(v); return (t < 0 ? '−' : '') + Math.abs(t).toFixed(2); };
  const num1 = v => { const t = r1(v); return (t < 0 ? '−' : '') + Math.abs(t).toFixed(1); };
  const sgn2 = v => { const t = r2(v); return (t < 0 ? ' − ' : ' + ') + Math.abs(t).toFixed(2); };

  q('.refsse').textContent = '최소제곱 정답 ' + BSSE.toFixed(2);
  reflab.textContent = '성수기 빼고 구한 직선 ' + FIXB[0].toFixed(2);
  const FIXNOTE = '고정 상태 최선 w₁ ' + FIXB[0].toFixed(2) + ' · b ' + FIXB[1].toFixed(2) + ' · 오차 제곱합 ' + FSSE.toFixed(2);

  // 표 다섯 행(정적 칸은 한 번만 그린다)
  const RY = [112, 144, 176, 208, 240];
  rows.innerHTML = MINI.map((m, i) => {
    const y = RY[i];
    return '<text x="20" y="' + y + '">' + m[0] + '</text>' +
      '<text x="200" y="' + y + '" text-anchor="end">' + m[1].toFixed(2) + '</text>' +
      '<text x="258" y="' + y + '" text-anchor="end">' + m[2] + '</text>' +
      '<text x="322" y="' + y + '" text-anchor="end">' + m[3].toFixed(1) + '</text>' +
      '<text class="pv" x="380" y="' + y + '" text-anchor="end">0.0</text>' +
      '<text class="ev" x="428" y="' + y + '" text-anchor="end">0.0</text>';
  }).join('');
  const pvs = Array.prototype.slice.call(root.querySelectorAll('.pv'));
  const evs = Array.prototype.slice.call(root.querySelectorAll('.ev'));

  // 점 다섯 개: 성수기 0은 파란 원, 성수기 1은 흰 원에 노란 테두리
  q('.dots').innerHTML = MINI.map(m => m[2] === 0
    ? '<circle cx="' + sx(m[1]).toFixed(1) + '" cy="' + sy(m[3]).toFixed(1) + '" r="4" fill="#2b7fd6" opacity=".8"/>'
    : '<circle cx="' + sx(m[1]).toFixed(1) + '" cy="' + sy(m[3]).toFixed(1) + '" r="4" fill="#fff" stroke="#b07a00" stroke-width="2"/>').join('');

  // 직선을 패널 안으로 잘라 그린다(clipPath는 id가 필요하므로 사용하지 않는다)
  function clip(m, c) {
    let lo = 3, hi = 8;
    if (Math.abs(m) < 1e-9) return (c < 0 || c > 22) ? null : { lo: lo, hi: hi, a: false, b: false };
    const xa = (0 - c) / m, xb = (22 - c) / m;
    lo = Math.max(3, Math.min(xa, xb));
    hi = Math.min(8, Math.max(xa, xb));
    if (hi - lo < 1e-6) return null;
    return { lo: lo, hi: hi, a: lo > 3 + 1e-6, b: hi < 8 - 1e-6 };
  }
  function tri(x, y, up, fill) {
    const p = up ? (x + ',' + (y - 1) + ' ' + (x - 5) + ',' + (y + 7) + ' ' + (x + 5) + ',' + (y + 7))
      : (x + ',' + (y + 1) + ' ' + (x - 5) + ',' + (y - 7) + ' ' + (x + 5) + ',' + (y - 7));
    return '<polygon points="' + p + '" fill="' + fill + '"/>';
  }
  function drawLine(el, m, c, fill, out) {
    const s = clip(m, c);
    if (!s) { el.setAttribute('visibility', 'hidden'); return; }
    el.setAttribute('visibility', 'visible');
    el.setAttribute('x1', sx(s.lo).toFixed(1)); el.setAttribute('y1', sy(m * s.lo + c).toFixed(1));
    el.setAttribute('x2', sx(s.hi).toFixed(1)); el.setAttribute('y2', sy(m * s.hi + c).toFixed(1));
    if (s.a) out.push(tri(+sx(s.lo).toFixed(1), +sy(m * s.lo + c).toFixed(1), m < 0, fill));
    if (s.b) out.push(tri(+sx(s.hi).toFixed(1), +sy(m * s.hi + c).toFixed(1), m > 0, fill));
  }

  let w1 = 1, w2 = 0, b = 0, refOn = false, fixOn = false, savedW2 = 0, seq = 0;

  function render() {
    eq.textContent = '예측 = ' + num2(w1) + '×스크린' + sgn2(w2) + '×성수기' + sgn2(b);
    let tot = 0;
    MINI.forEach((m, i) => {
      const p = w1 * m[1] + w2 * m[2] + b, e = (p - m[3]) * (p - m[3]);
      tot += e;
      pvs[i].textContent = num1(p);
      pvs[i].setAttribute('fill', r1(p) < 0 ? '#d64545' : '#1c2230');
      evs[i].textContent = num1(e);
    });
    bar.setAttribute('width', Math.max(0, Math.min(tot, 300)).toFixed(1));
    saw.setAttribute('visibility', tot > 300 ? 'visible' : 'hidden');
    sseT.textContent = num1(tot);
    v1.textContent = num2(w1); v2.textContent = num2(w2); v3.textContent = num2(b);

    const out = [];
    drawLine(l0, w1, b, '#2b7fd6', out);
    drawLine(l1, w1, b + w2, '#b07a00', out);
    if (refOn) drawLine(ref, FIXB[0], FIXB[1], '#b9b3a5', out);
    else ref.setAttribute('visibility', 'hidden');
    reflab.setAttribute('visibility', refOn ? 'visible' : 'hidden');
    marks.innerHTML = out.join('');
  }

  function syncSliders() { s1.value = w1.toFixed(2); s2.value = w2.toFixed(2); s3.value = b.toFixed(2); }

  function run(dur, step) {
    const token = ++seq;
    let t0 = -1;
    const frame = ts => {
      if (token !== seq) return;
      if (t0 < 0) t0 = ts;
      const t = Math.min(1, (ts - t0) / dur);
      step(1 - (1 - t) * (1 - t));
      syncSliders(); render();
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  s1.addEventListener('input', () => { seq++; w1 = +s1.value; render(); });
  s2.addEventListener('input', () => { seq++; w2 = +s2.value; render(); });
  s3.addEventListener('input', () => { seq++; b = +s3.value; render(); });

  bfix.addEventListener('click', () => {
    seq++;
    fixOn = !fixOn;
    bfix.classList.toggle('on', fixOn);
    bfix.setAttribute('aria-pressed', fixOn ? 'true' : 'false');
    if (fixOn) {
      savedW2 = w2; w2 = 0; s2.disabled = true;
      fixnote.textContent = FIXNOTE;
      syncSliders(); render();
    } else {
      s2.disabled = false;
      fixnote.textContent = '';
      const to = savedW2;
      run(300, k => { w2 = to * k; });
    }
  });

  bbest.addEventListener('click', () => {
    seq++;
    if (fixOn) {
      fixOn = false; bfix.classList.remove('on');
      bfix.setAttribute('aria-pressed', 'false');
      s2.disabled = false; fixnote.textContent = '';
    }
    const a0 = w1, b0 = w2, c0 = b;
    run(500, k => { w1 = a0 + (BEST[0] - a0) * k; w2 = b0 + (BEST[1] - b0) * k; b = c0 + (BEST[2] - c0) * k; });
  });

  bref.addEventListener('click', () => {
    refOn = !refOn;
    bref.classList.toggle('on', refOn);
    bref.setAttribute('aria-pressed', refOn ? 'true' : 'false');
    render();
  });

  syncSliders();
  render();
}

function initW_leakname(root, D) {
  // D = 이 차시의 내장 데이터(216행 × 9열 정수 배열)
  // 열 순서: 0 first_scrn, 1 first_show, 2 peak, 3 first_day_audi, 4 first_week_audi,
  //          5 days_in_top10, 6 last_cum, 7 total_audi, 8 dDays(10위권 첫 등장일 − 개봉일)
  const q = s => root.querySelector(s);
  const all = s => Array.from(root.querySelectorAll(s));
  const col = j => D.map(r => r[j]);

  // ① 상관계수 — 목표 열은 총 관객(7번 열), 216편 전체로 계산
  function corr(a, b) {
    const n = a.length;
    let ma = 0, mb = 0;
    for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    let sab = 0, sa = 0, sb = 0;
    for (let i = 0; i < n; i++) {
      const dx = a[i] - ma, dy = b[i] - mb;
      sab += dx * dy; sa += dx * dx; sb += dy * dy;
    }
    return sab / Math.sqrt(sa * sb);
  }
  const target = col(7);
  const COLS = [
    { j: 0, key: 'first_scrn' },
    { j: 4, key: 'first_week_audi' },
    { j: 5, key: 'days_in_top10' },
    { j: 6, key: '누적관객' }
  ];
  const R = COLS.map(c => corr(col(c.j), target));

  // ② 10위권 첫 등장일 − 개봉일(8번 열)
  const dd = col(8);
  let same = 0, early = 0, late = 0, maxEarly = 0, maxLate = 0;
  for (let i = 0; i < dd.length; i++) {
    const v = dd[i];
    if (v === 0) same++;
    else if (v < 0) { early++; if (-v > maxEarly) maxEarly = -v; }
    else { late++; if (v > maxLate) maxLate = v; }
  }

  // ③ 상관계수 값·막대
  const rv = all('.rv'), rb = all('.rb');
  for (let i = 0; i < 4; i++) {
    rv[i].textContent = 'r ' + R[i].toFixed(2);
    rb[i].setAttribute('width', (110 * Math.abs(R[i])).toFixed(1));
  }

  // ④ 오른쪽 패널 막대 — 길이 = 편수 ÷ 같은 날 편수 × 118
  const pb = all('.pb'), pn = all('.pn');
  const COUNT = [same, early, late];
  const base = Math.max(1, same);
  for (let i = 0; i < 3; i++) {
    const w = COUNT[i] / base * 118;
    pb[i].setAttribute('width', w.toFixed(1));
    pn[i].setAttribute('x', (464 + w + 6).toFixed(1));
    pn[i].textContent = COUNT[i] + '편';
  }
  q('.fn1').textContent = '이른 최대 ' + maxEarly + '일 · 늦은 최대 ' + maxLate + '일';

  // ⑤ 상관계수 순위 — 절댓값 내림차순
  const rank = COLS.map((c, i) => [c.key, Math.abs(R[i])])
    .sort((a, b) => b[1] - a[1]).map(p => p[0]).join(' > ');

  const BADGE = [
    ['첫 관측일 집계 후', '개봉 전 사용 불가'],
    ['첫 주 집계 후', '개봉 전 사용 불가'],
    ['종영 후', '개봉 전 사용 불가'],
    ['종영 후', '정답 열과 사실상 동일']
  ];
  const CY = [40, 94, 148, 202];
  const USABLE = 0;   // 개봉 전 사용 가능한 열 — 네 열 모두 불가, 이것이 정답

  function cards(m) {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const y = CY[i];
      if (m === 0) {
        s += '<rect x="272" y="' + y + '" width="168" height="46" rx="8" fill="#ffffff" stroke="#e3ddcf" stroke-dasharray="4 3"/>'
          + '<text x="356" y="' + (y + 32) + '" font-size="24" font-weight="800" fill="#6b7385" text-anchor="middle">?</text>';
      } else {
        s += '<rect x="272" y="' + y + '" width="168" height="46" rx="8" fill="#fdeeee" stroke="#d64545" stroke-width="' + (i === 3 ? 2 : 1) + '"/>'
          + '<text x="356" y="' + (y + 20) + '" font-size="14" fill="#d64545" text-anchor="middle">' + BADGE[i][0] + '</text>'
          + '<text x="356" y="' + (y + 38) + '" font-size="14" fill="#d64545" text-anchor="middle">' + BADGE[i][1] + '</text>';
      }
    }
    return s;
  }

  const jg = q('.jg'), cap = q('.cap'), out = q('.wout');
  const btns = all('.wbtn');
  let seq = 0;

  function setMode(m, fade) {
    jg.innerHTML = cards(m);
    cap.textContent = m === 0
      ? '상관계수 순위 = ' + rank + ' · 사용 가능 여부와 무관'
      : '시점 정보는 파일에 없음 · 자료 설명서 확인 후 사람이 표시';
    cap.setAttribute('fill', m === 0 ? '#6b7385' : '#d64545');
    out.textContent = m === 0
      ? '판정 근거 없음 · 물음표 4개'
      : '개봉 전 사용 가능 ' + USABLE + '개 / 4개';
    for (let i = 0; i < btns.length; i++) {
      const on = Number(btns[i].getAttribute('data-m')) === m;
      btns[i].classList.toggle('on', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    // 판정 열 4장만 250ms 크로스페이드. 초기 호출은 페이드 없이 완성 상태로 둔다
    const my = ++seq;
    if (!fade || typeof requestAnimationFrame !== 'function') {
      jg.setAttribute('opacity', '1');
      return;
    }
    jg.setAttribute('opacity', '0');
    let t0 = 0;
    const step = ts => {
      if (my !== seq) return;                      // 연타 시 이전 루프 무시
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / 250);
      jg.setAttribute('opacity', k.toFixed(3));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  for (let i = 0; i < btns.length; i++) {
    (function (b) {
      b.addEventListener('click', function () { setMode(Number(b.getAttribute('data-m')), true); });
    })(btns[i]);
  }
  setMode(0, false);
}

function initW_leaktime(root, D) {
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  // 카드 순서대로 변수 정의: 값 함수·이름·확보 시점
  var GET = [
    function (r) { return r[2]; },          // 성수기 개봉
    function (r) { return r[0]; },          // 첫 관측일 스크린 수
    function (r) { return r[1]; },          // 첫 관측일 상영 횟수
    function (r) { return r[3] / r[1]; },   // 상영당 관객 수
    function (r) { return r[4]; },          // 첫 주 관객 수
    function (r) { return r[5]; },          // 10위권 등장 일수
    function (r) { return r[6]; }           // 마지막 누적 관객
  ];
  var NAME = ['성수기 개봉', '첫 관측일 스크린 수', '첫 관측일 상영 횟수', '상영당 관객 수', '첫 주 관객 수', '10위권 등장 일수', '마지막 누적 관객'];
  var CT = [0, 1, 1, 1, 2, 3, 3];
  var TNAME = ['개봉 전', '첫 관측일 집계 후', '첫 주 집계 후', '종영 후'];
  var BX = [187, 367, 537];
  var NV = 7, i, j, m;

  // 분할: 배열 순서 그대로 10편마다 앞 3편이 테스트
  var tr = [], te = [];
  for (i = 0; i < D.length; i++) { if (i % 10 < 3) te.push(D[i]); else tr.push(D[i]); }
  var NT = te.length;

  // 표기 도우미
  function fx(x, d) { var s = Math.abs(x).toFixed(d); return (x < 0 ? '−' : '') + s; }
  function comma(v) {
    var s = String(Math.round(v)), out = '', c = 0, p;
    for (p = s.length - 1; p >= 0; p--) { out = s.charAt(p) + out; c++; if (c % 3 === 0 && p > 0) out = ',' + out; }
    return out;
  }

  // 216편 전체 상관계수
  function corr(f) {
    var n = D.length, mx = 0, my = 0, sxy = 0, sxx = 0, syy = 0, dx, dy, p;
    for (p = 0; p < n; p++) { mx += f(D[p]); my += D[p][7]; }
    mx /= n; my /= n;
    for (p = 0; p < n; p++) { dx = f(D[p]) - mx; dy = D[p][7] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
    return sxy / Math.sqrt(sxx * syy);
  }
  var RV = [];
  for (i = 0; i < NV; i++) RV.push(corr(GET[i]));

  // 최소제곱: 부분 피벗 가우스 소거(최대 8×8)
  function solveOLS(A, b) {
    var n = b.length, c, r, kk, p, t, f, x = [];
    for (c = 0; c < n; c++) {
      p = c;
      for (r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      t = A[c]; A[c] = A[p]; A[p] = t; t = b[c]; b[c] = b[p]; b[p] = t;
      if (Math.abs(A[c][c]) < 1e-12) continue;
      for (r = 0; r < n; r++) {
        if (r === c) continue;
        f = A[r][c] / A[c][c];
        if (!f) continue;
        for (kk = c; kk < n; kk++) A[r][kk] -= f * A[c][kk];
        b[r] -= f * b[c];
      }
    }
    for (c = 0; c < n; c++) x.push(Math.abs(A[c][c]) < 1e-12 ? 0 : b[c] / A[c][c]);
    return x;
  }

  // 학습 세트 평균·표준편차로 표준화한 뒤 절편 포함 정규방정식을 푼다
  function fitOLS(cols) {
    var kc = cols.length, n = kc + 1, a, c, r, v, mu = [], sd = [], A = [], b = [], z, s, j;
    for (j = 0; j < kc; j++) {
      v = 0;
      for (r = 0; r < tr.length; r++) v += GET[cols[j]](tr[r]);
      v /= tr.length;
      s = 0;
      for (r = 0; r < tr.length; r++) s += Math.pow(GET[cols[j]](tr[r]) - v, 2);
      s = Math.sqrt(s / tr.length);
      if (!(s > 0)) s = 1;
      mu.push(v); sd.push(s);
    }
    for (a = 0; a < n; a++) { A.push([]); b.push(0); for (c = 0; c < n; c++) A[a].push(0); }
    for (r = 0; r < tr.length; r++) {
      z = [1];
      for (j = 0; j < kc; j++) z.push((GET[cols[j]](tr[r]) - mu[j]) / sd[j]);
      for (a = 0; a < n; a++) { for (c = 0; c < n; c++) A[a][c] += z[a] * z[c]; b[a] += z[a] * tr[r][7]; }
    }
    var w = solveOLS(A, b), pred = [];
    for (r = 0; r < NT; r++) {
      s = w[0];
      for (j = 0; j < kc; j++) s += w[j + 1] * ((GET[cols[j]](te[r]) - mu[j]) / sd[j]);
      pred.push(s);
    }
    return pred;
  }

  // 산점도 좌표: 두 축 모두 log10, 범위 3.0부터 7.3까지 고정
  var PX0 = 448, PX1 = 696, PY0 = 302, PY1 = 374, L0 = 3, L1 = 7.3;
  function lg2y(v) { return PY1 - (Math.max(L0, Math.min(L1, v)) - L0) / (L1 - L0) * (PY1 - PY0); }
  var XS = [], YT = [];
  for (i = 0; i < NT; i++) {
    XS.push(PX0 + (Math.max(L0, Math.min(L1, Math.log10(te[i][7]))) - L0) / (L1 - L0) * (PX1 - PX0));
    YT.push(te[i][7]);
  }

  // 127개 조합을 미리 계산해 둔다
  var CACHE = [], my = 0;
  for (i = 0; i < NT; i++) my += YT[i];
  my /= NT;
  var cols, pred, ss, st, mae, low, py, tri;
  for (m = 1; m < 128; m++) {
    cols = [];
    for (j = 0; j < NV; j++) if (m & (1 << j)) cols.push(j);
    pred = fitOLS(cols); ss = 0; st = 0; mae = 0; low = 0; py = []; tri = [];
    for (i = 0; i < NT; i++) {
      ss += Math.pow(YT[i] - pred[i], 2);
      st += Math.pow(YT[i] - my, 2);
      mae += Math.abs(YT[i] - pred[i]);
      if (pred[i] < 1000) { low++; tri.push(1); py.push(PY1); }
      else { tri.push(0); py.push(lg2y(Math.log10(pred[i]))); }
    }
    CACHE[m] = { r2: 1 - ss / st, mae: mae / NT, low: low, py: py, tri: tri };
  }

  // 요소
  var cards = qa('.card'), bline = q('.bline'), blab = q('.blab');
  var big = q('.big'), neg = q('.neg'), maeT = q('.mae'), warn = q('.warn'), gfill = q('.gfill');
  var dotsG = q('.dots'), trisG = q('.tris'), lowcap = q('.lowcap');
  var out = q('.wout'), slider = q('input'), btns = qa('.wbtn');

  var sd1 = '', sd2 = '';
  for (i = 0; i < NT; i++) {
    sd1 += '<circle class="pdot" r="3.5" transform="translate(' + XS[i].toFixed(1) + ' ' + PY1 + ')"/>';
    sd2 += '<path class="ptri" d="M0 -9 L-5.5 0 L5.5 0 Z" transform="translate(' + XS[i].toFixed(1) + ' ' + PY1 + ')"/>';
  }
  dotsG.innerHTML = sd1;
  trisG.innerHTML = sd2;
  var dots = qa('.pdot'), tris = qa('.ptri');

  for (i = 0; i < NV; i++) {
    cards[i].querySelector('.cbadge').textContent = 'r ' + fx(RV[i], 2);
    cards[i].setAttribute('aria-label', NAME[i] + ', ' + TNAME[CT[i]] + ' 확보, 상관계수 ' + fx(RV[i], 2));
  }

  // 상태
  var on = [true, true, true, false, false, false, false], tIdx = 0;
  var curY = [], startY = [], tgtY = [], curBX = BX[0], startBX = BX[0], tgtBX = BX[0];
  for (i = 0; i < NT; i++) { curY.push(PY1); startY.push(PY1); tgtY.push(PY1); }
  var animOn = false, animT0 = 0;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function place(idx, y) {
    var s = 'translate(' + XS[idx].toFixed(1) + ' ' + y.toFixed(1) + ')';
    dots[idx].setAttribute('transform', s);
    tris[idx].setAttribute('transform', s);
  }
  function paintFrame() {
    bline.setAttribute('x1', curBX.toFixed(1));
    bline.setAttribute('x2', curBX.toFixed(1));
    blab.setAttribute('x', (curBX - 6).toFixed(1));
    for (var p = 0; p < NT; p++) place(p, curY[p]);
  }
  function frame(ts) {
    if (!animT0) animT0 = ts;
    var e = ts - animT0, kb = ease(Math.min(1, e / 250)), kp = ease(Math.min(1, e / 400)), p;
    curBX = startBX + (tgtBX - startBX) * kb;
    for (p = 0; p < NT; p++) curY[p] = startY[p] + (tgtY[p] - startY[p]) * kp;
    paintFrame();
    if (e < 400) requestAnimationFrame(frame);
    else { animOn = false; curBX = tgtBX; for (p = 0; p < NT; p++) curY[p] = tgtY[p]; paintFrame(); }
  }
  function runAnim() {
    for (var p = 0; p < NT; p++) startY[p] = curY[p];
    startBX = curBX;
    animT0 = 0;
    if (!animOn) { animOn = true; requestAnimationFrame(frame); }
  }

  function paintCard(idx) {
    var c = cards[idx], box = c.querySelector('.cbox'), n1 = c.querySelector('.cn1'), n2 = c.querySelector('.cn2');
    var hatch = c.querySelector('.chatch'), lock = c.querySelector('.clock');
    var locked = CT[idx] > tIdx, lit = on[idx], nc = '#1c2230';
    if (locked && lit) { box.setAttribute('fill', '#fdeeee'); box.setAttribute('stroke', '#d64545'); box.setAttribute('stroke-width', '2'); box.removeAttribute('stroke-dasharray'); }
    else if (locked) { box.setAttribute('fill', '#ffffff'); box.setAttribute('stroke', '#e3ddcf'); box.setAttribute('stroke-width', '1.5'); box.setAttribute('stroke-dasharray', '4 3'); nc = '#6b7385'; }
    else if (lit) { box.setAttribute('fill', '#f6c445'); box.setAttribute('stroke', '#b07a00'); box.setAttribute('stroke-width', '1.5'); box.removeAttribute('stroke-dasharray'); }
    else { box.setAttribute('fill', '#ffffff'); box.setAttribute('stroke', '#e3ddcf'); box.setAttribute('stroke-width', '1.5'); box.removeAttribute('stroke-dasharray'); }
    n1.setAttribute('fill', nc);
    if (n2) n2.setAttribute('fill', nc);
    hatch.setAttribute('display', locked && lit ? 'inline' : 'none');
    lock.setAttribute('display', locked ? 'inline' : 'none');
    lock.setAttribute('stroke', locked && lit ? '#d64545' : '#6b7385');
    c.setAttribute('aria-pressed', lit ? 'true' : 'false');
  }

  function render(animate) {
    var mask = 0, cnt = 0, bad = [], p;
    for (p = 0; p < NV; p++) {
      paintCard(p);
      if (on[p]) { mask |= (1 << p); cnt++; if (CT[p] > tIdx) bad.push(NAME[p]); }
    }
    tgtBX = BX[tIdx];
    for (p = 0; p < btns.length; p++) {
      if (btns[p].getAttribute('data-t') === null) continue;
      var sel = Number(btns[p].getAttribute('data-t')) === tIdx;
      btns[p].classList.toggle('on', sel);
      btns[p].setAttribute('aria-pressed', sel ? 'true' : 'false');
    }
    slider.value = String(tIdx);

    if (cnt === 0) {
      big.textContent = '변수 없음';
      big.setAttribute('font-size', '20');
      big.setAttribute('fill', '#6b7385');
      neg.setAttribute('display', 'none');
      maeT.setAttribute('display', 'none');
      warn.setAttribute('display', 'none');
      gfill.setAttribute('width', '0');
      dotsG.setAttribute('display', 'none');
      trisG.setAttribute('display', 'none');
      lowcap.setAttribute('display', 'none');
      out.textContent = '변수 하나 이상 선택 필요';
      for (p = 0; p < NT; p++) tgtY[p] = curY[p];
      if (animate) runAnim(); else { curBX = tgtBX; paintFrame(); }
      return;
    }

    var o = CACHE[mask], col = bad.length ? '#d64545' : '#1c2230';
    big.textContent = fx(o.r2, 3);
    big.setAttribute('font-size', '28');
    big.setAttribute('fill', col);
    neg.setAttribute('display', o.r2 < 0 ? 'inline' : 'none');
    maeT.setAttribute('display', 'inline');
    maeT.textContent = '평균 오차 ' + comma(o.mae) + '명';
    warn.setAttribute('display', bad.length ? 'inline' : 'none');
    gfill.setAttribute('width', String((290 * Math.max(0, Math.min(1, o.r2))).toFixed(1)));
    gfill.setAttribute('fill', col);
    dotsG.setAttribute('fill', bad.length ? '#d64545' : '#2b7fd6');
    lowcap.setAttribute('display', o.low ? 'inline' : 'none');
    if (o.low) lowcap.textContent = '1천 미만 예측 ' + o.low + '편';
    dotsG.setAttribute('display', 'inline');
    trisG.setAttribute('display', 'inline');
    for (p = 0; p < NT; p++) {
      tgtY[p] = o.py[p];
      dots[p].setAttribute('display', o.tri[p] ? 'none' : 'inline');
      tris[p].setAttribute('display', o.tri[p] ? 'inline' : 'none');
    }
    out.textContent = TNAME[tIdx] + ' 시점 · R² ' + fx(o.r2, 3) + (bad.length ? ' · 사용 불가: ' + bad.join(', ') : '');
    if (animate) runAnim();
    else { curBX = tgtBX; for (p = 0; p < NT; p++) curY[p] = tgtY[p]; paintFrame(); }
  }

  // 조작
  for (i = 0; i < NV; i++) {
    (function (idx) {
      var c = cards[idx];
      c.addEventListener('click', function () { on[idx] = !on[idx]; render(true); });
      c.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); on[idx] = !on[idx]; render(true); }
      });
    })(i);
  }
  slider.addEventListener('input', function () { tIdx = Number(slider.value); render(true); });
  for (i = 0; i < btns.length; i++) {
    (function (b) {
      if (b.getAttribute('data-reset') !== null) {
        b.addEventListener('click', function () {
          tIdx = 0;
          on = [true, true, true, false, false, false, false];
          render(true);
        });
      } else {
        b.addEventListener('click', function () { tIdx = Number(b.getAttribute('data-t')); render(true); });
      }
    })(btns[i]);
  }

  render(false);
}

function initW_wmix(root, D) {
  // D = 내장 데이터 KOBIS216. 216행 × 9정수. 열: 0 스크린, 1 상영, 2 성수기, 3 첫날 관객,
  // 4 첫 주 관객, 5 10위권 일수, 6 마지막 누적, 7 총 관객(정답), 8 개봉 대비 일수.
  var NS = 'http://www.w3.org/2000/svg';
  var doc = root.ownerDocument;
  var q = function (s) { return root.querySelector(s); };

  var NAME = ['스크린 수', '상영 횟수', '성수기', '첫 주 관객 · 개봉 후', '상영당 관객 · 개봉 후'];
  var VAL = [
    function (r) { return r[0]; },
    function (r) { return r[1]; },
    function (r) { return r[2]; },
    function (r) { return r[4]; },
    function (r) { return r[3] / r[1]; }
  ];

  // 분할: 배열 순서 그대로 i%10<3이 테스트 66편, 나머지 150편이 학습
  var TR = [], TE = [];
  for (var i = 0; i < D.length; i++) { (i % 10 < 3 ? TE : TR).push(D[i]); }

  // 가우스 소거(부분 피벗)
  function solveOLS(A, b) {
    var n = b.length, c, r, k, p, t, f;
    for (c = 0; c < n; c++) {
      p = c;
      for (r = c + 1; r < n; r++) { if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; }
      t = A[c]; A[c] = A[p]; A[p] = t;
      t = b[c]; b[c] = b[p]; b[p] = t;
      if (Math.abs(A[c][c]) < 1e-12) continue;
      for (r = 0; r < n; r++) {
        if (r === c) continue;
        f = A[r][c] / A[c][c];
        if (!f) continue;
        for (k = c; k < n; k++) A[r][k] -= f * A[c][k];
        b[r] -= f * b[c];
      }
    }
    var x = new Array(n);
    for (c = 0; c < n; c++) x[c] = Math.abs(A[c][c]) < 1e-12 ? 0 : b[c] / A[c][c];
    return x;
  }

  // 학습 150편 표준화 후 최소제곱. 표시용 가중치는 원래 단위로 되돌린 값
  function fitOLS(cols) {
    var k = cols.length, i, j, a, c;
    var X = [], y = [];
    for (i = 0; i < TR.length; i++) {
      var row = [];
      for (j = 0; j < k; j++) row.push(VAL[cols[j]](TR[i]));
      X.push(row); y.push(TR[i][7]);
    }
    var mu = [], sd = [];
    for (j = 0; j < k; j++) {
      var m = 0;
      for (i = 0; i < X.length; i++) m += X[i][j];
      m /= X.length;
      var v = 0;
      for (i = 0; i < X.length; i++) v += (X[i][j] - m) * (X[i][j] - m);
      v = Math.sqrt(v / (X.length - 1));
      if (!(v > 0)) v = 1;
      mu.push(m); sd.push(v);
    }
    var n = k + 1, A = [], b = [];
    for (i = 0; i < n; i++) { A.push(new Array(n).fill(0)); b.push(0); }
    for (i = 0; i < X.length; i++) {
      var z = [1];
      for (j = 0; j < k; j++) z.push((X[i][j] - mu[j]) / sd[j]);
      for (a = 0; a < n; a++) {
        for (c = 0; c < n; c++) A[a][c] += z[a] * z[c];
        b[a] += z[a] * y[i];
      }
    }
    var w = solveOLS(A, b);
    var raw = [], std = [], icp = w[0];
    for (j = 0; j < k; j++) { raw.push(w[j + 1] / sd[j]); std.push(w[j + 1]); icp -= raw[j] * mu[j]; }
    var score = function (set) {
      var s, ss = 0, st = 0, mv = 0, ii, jj;
      for (ii = 0; ii < set.length; ii++) mv += set[ii][7];
      mv /= set.length;
      for (ii = 0; ii < set.length; ii++) {
        s = icp;
        for (jj = 0; jj < k; jj++) s += raw[jj] * VAL[cols[jj]](set[ii]);
        ss += (set[ii][7] - s) * (set[ii][7] - s);
        st += (set[ii][7] - mv) * (set[ii][7] - mv);
      }
      return 1 - ss / st;
    };
    return { cols: cols, raw: raw, std: std, tr: score(TR), te: score(TE) };
  }

  // 31개 조합을 한 번에 계산해 캐시한다. 이후 클릭은 조회만 한다
  var CACHE = {};
  for (var m = 1; m < 32; m++) {
    var s = [];
    for (var j = 0; j < 5; j++) { if (m & (1 << j)) s.push(j); }
    CACHE[m] = fitOLS(s);
  }
  var SOLO = [CACHE[1], CACHE[2], CACHE[4], CACHE[8], CACHE[16]];

  // 표기
  function comma(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtW(v) {
    var a = Math.abs(v);
    var s = a >= 100 ? comma(Math.round(a)) : a.toFixed(2);
    return (v < 0 ? '−' : '+') + s;
  }
  function fmtR(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(3); }

  // 요소
  var bTest = q('.btest'), bTrain = q('.btrain'), ghost = q('.ghost');
  var vTest = q('.vtest'), vTrain = q('.vtrain');
  var sawT = q('.sawtest'), sawR = q('.sawtrain');
  var delta = q('.delta'), rows = q('.rows'), unitlab = q('.unitlab');
  var boxfull = q('.boxfull'), boxempty = q('.boxempty');
  var kcnt = q('.kcnt'), warn = q('.leakwarn');
  var btns = root.querySelectorAll('.wbtn');

  var mask = 1, unit = 0, prevMask = 0, prevTe = 0, kdown = 0;
  var curT = 0, curR = 0, curTx = 258, curRx = 258, raf = 0;

  function barLen(r2) { return Math.max(0, Math.min(r2, 1)) * 400; }
  function txtX(r2) { return r2 <= 0 ? 258 : 250 + barLen(r2) + 8; }

  function paintBars(tw, rw, tx, rx) {
    bTest.setAttribute('width', tw.toFixed(2));
    bTrain.setAttribute('width', rw.toFixed(2));
    vTest.setAttribute('x', tx.toFixed(2));
    vTrain.setAttribute('x', rx.toFixed(2));
  }

  function stopAnim() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function animate(tw, rw, tx, rx) {
    var t0 = -1, sT = curT, sR = curR, sTx = curTx, sRx = curRx;
    stopAnim();
    var step = function (ts) {
      if (t0 < 0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 300);
      var e = 1 - Math.pow(1 - p, 3);
      curT = sT + (tw - sT) * e; curR = sR + (rw - sR) * e;
      curTx = sTx + (tx - sTx) * e; curRx = sRx + (rx - sRx) * e;
      paintBars(curT, curR, curTx, curRx);
      if (p < 1) raf = requestAnimationFrame(step); else raf = 0;
    };
    raf = requestAnimationFrame(step);
  }

  function clearRows() { while (rows.firstChild) rows.removeChild(rows.firstChild); }

  function addText(x, y, str, anchor, fill, weight) {
    var t = doc.createElementNS(NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.setAttribute('fill', fill);
    if (weight) t.setAttribute('font-weight', weight);
    t.textContent = str;
    rows.appendChild(t);
  }

  function render(animated) {
    var fit = mask ? CACHE[mask] : null;
    var tr = fit ? fit.tr : 0, te = fit ? fit.te : 0;

    // 막대
    var tw = fit ? barLen(te) : 0, rw = fit ? barLen(tr) : 0;
    var tx = fit ? txtX(te) : 258, rx = fit ? txtX(tr) : 258;
    if (animated) animate(tw, rw, tx, rx);
    else { stopAnim(); curT = tw; curR = rw; curTx = tx; curRx = rx; paintBars(tw, rw, tx, rx); }

    if (!fit) {
      vTest.textContent = ''; vTrain.textContent = '';
    } else {
      vTest.textContent = te < 0 ? fmtR(te) + ' · 평균보다 나쁨' : fmtR(te);
      vTrain.textContent = tr < 0 ? fmtR(tr) + ' · 평균보다 나쁨' : fmtR(tr);
    }
    vTest.setAttribute('fill', fit && te < 0 ? '#d64545' : '#1c2230');
    vTrain.setAttribute('fill', fit && tr < 0 ? '#d64545' : '#1c2230');
    sawT.setAttribute('visibility', fit && te > 1 ? 'visible' : 'hidden');
    sawR.setAttribute('visibility', fit && tr > 1 ? 'visible' : 'hidden');

    // 고스트와 증감
    if (prevMask) {
      ghost.setAttribute('visibility', 'visible');
      ghost.setAttribute('width', barLen(prevTe).toFixed(2));
      var d = (fit ? te : 0) - prevTe;
      if (!mask) { delta.textContent = ''; }
      else if (d > 0) { delta.textContent = '↑ +' + d.toFixed(3); delta.setAttribute('fill', '#2f9e5f'); }
      else if (d < 0) { delta.textContent = '↓ −' + Math.abs(d).toFixed(3); delta.setAttribute('fill', '#d64545'); }
      else { delta.textContent = ''; }
    } else {
      ghost.setAttribute('visibility', 'hidden');
      delta.textContent = '';
    }

    // 가중치 표
    clearRows();
    unitlab.textContent = unit ? '(명 / 1 표준편차)' : '(명 / 1단위)';
    if (fit) {
      for (var i = 0; i < fit.cols.length; i++) {
        var c = fit.cols[i], y = 222 + i * 26;
        var wv = unit ? fit.std[i] : fit.raw[i];
        var sv = unit ? SOLO[c].std[0] : SOLO[c].raw[0];
        var bad = (wv < 0) !== (sv < 0);
        addText(20, y, NAME[c], null, '#1c2230');
        addText(315, y, fmtW(wv), 'end', bad ? '#d64545' : '#1c2230', '800');
        addText(430, y, fmtW(sv), 'end', '#6b7385');
      }
    }

    // 우측 상자
    boxfull.setAttribute('visibility', mask ? 'visible' : 'hidden');
    boxempty.setAttribute('visibility', mask ? 'hidden' : 'visible');
    kcnt.textContent = '지금까지 ' + kdown + '회';
    warn.setAttribute('visibility', (mask & 8) || (mask & 16) ? 'visible' : 'hidden');

    // 버튼 상태
    for (var b = 0; b < btns.length; b++) {
      var el = btns[b], on = false, has = true;
      if (el.hasAttribute('data-v')) on = !!(mask & (1 << (+el.getAttribute('data-v'))));
      else if (el.hasAttribute('data-u')) on = !!unit;
      else has = false;
      if (!has) continue;
      el.className = on ? (el.hasAttribute('data-v') && +el.getAttribute('data-v') > 2 ? 'wbtn leak on' : 'wbtn on')
                        : (el.hasAttribute('data-v') && +el.getAttribute('data-v') > 2 ? 'wbtn leak' : 'wbtn');
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function toggleVar(v) {
    var before = mask, beforeTe = mask ? CACHE[mask].te : 0;
    var next = mask ^ (1 << v);
    // 변수를 하나 더한 경로에서만 하락 횟수를 센다
    var added = before && (next & before) === before;
    var afterTe = next ? CACHE[next].te : 0;
    if (added && next && afterTe < beforeTe) kdown++;
    prevMask = before; prevTe = beforeTe;
    mask = next;
    render(true);
  }

  for (var b2 = 0; b2 < btns.length; b2++) {
    (function (el) {
      el.addEventListener('click', function () {
        if (el.hasAttribute('data-v')) { toggleVar(+el.getAttribute('data-v')); return; }
        if (el.hasAttribute('data-u')) { unit = unit ? 0 : 1; render(false); return; }
        mask = 1; unit = 0; prevMask = 0; prevTe = 0; kdown = 0;
        render(true);
      });
    })(btns[b2]);
  }

  render(false);
}
  const WIDGET_INIT = {wplane: initW_wplane, leakname: initW_leakname, leaktime: initW_leaktime, wmix: initW_wmix};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
