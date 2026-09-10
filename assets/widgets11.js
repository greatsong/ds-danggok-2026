// 11차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson11.html)와 교재(lesson11.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"n":["양의지","안현민","김성윤","레이예스","문현빈","구자욱","송성문","디아즈","신민재","오스틴","최형우","문성주","박민우","케이브","김현수","전준우","김주원","채은성","박찬호","최지훈","허경민","류지혁","고명준","박해민","문보경","최주환","박성한","한유섬","고승민","강민호","오선우","노시환","정수빈","이재현","오지환","박동원","김휘집","김영웅","장성우","권희동","최원준","이주형","위즈덤"],"raw":[[20,4,50,63,0.406,0.533],[22,7,75,72,0.448,0.57],[6,26,65,54,0.419,0.474],[13,7,58,66,0.386,0.475],[12,17,38,82,0.37,0.453],[19,4,73,91,0.402,0.516],[26,25,68,96,0.387,0.53],[50,1,60,100,0.381,0.644],[1,15,62,57,0.395,0.382],[31,3,61,62,0.393,0.595],[24,1,67,98,0.399,0.529],[3,4,54,59,0.375,0.375],[3,28,44,64,0.384,0.426],[16,17,43,116,0.351,0.463],[12,4,64,73,0.384,0.422],[8,2,44,71,0.369,0.42],[15,44,63,111,0.379,0.451],[19,1,31,96,0.347,0.467],[5,27,62,69,0.363,0.359],[7,28,43,87,0.342,0.371],[4,4,39,35,0.362,0.355],[1,11,33,73,0.351,0.323],[17,2,20,99,0.306,0.433],[3,49,68,94,0.379,0.346],[24,3,79,108,0.371,0.46],[12,0,36,66,0.33,0.425],[7,5,79,93,0.384,0.381],[15,1,46,120,0.347,0.424],[4,5,56,83,0.35,0.35],[12,2,38,69,0.336,0.417],[18,0,34,158,0.323,0.432],[32,14,70,125,0.354,0.497],[6,26,61,57,0.355,0.348],[16,6,69,119,0.36,0.427],[16,9,37,115,0.314,0.43],[22,4,62,124,0.342,0.455],[17,10,40,89,0.349,0.42],[22,6,48,143,0.323,0.455],[14,0,55,96,0.333,0.38],[6,5,77,80,0.393,0.363],[6,26,23,71,0.289,0.332],[11,0,37,115,0.337,0.368],[35,3,52,142,0.321,0.535]],"z":[[0.524,-0.553,-0.203,-1.0,1.373,1.313],[0.722,-0.302,1.426,-0.664,2.7,1.822],[-0.86,1.289,0.775,-1.336,1.784,0.502],[-0.168,-0.302,0.318,-0.888,0.741,0.516],[-0.267,0.535,-0.985,-0.291,0.236,0.214],[0.425,-0.553,1.296,0.045,1.247,1.08],[1.118,1.205,0.97,0.232,0.773,1.272],[3.491,-0.804,0.449,0.381,0.583,2.839],[-1.355,0.368,0.579,-1.224,1.026,-0.762],[1.612,-0.637,0.514,-1.037,0.962,2.166],[0.92,-0.804,0.905,0.306,1.152,1.258],[-1.157,-0.553,0.058,-1.149,0.394,-0.859],[-1.157,1.456,-0.594,-0.963,0.678,-0.158],[0.129,0.535,-0.659,0.978,-0.364,0.351],[-0.267,-0.553,0.709,-0.627,0.678,-0.213],[-0.662,-0.72,-0.594,-0.701,0.204,-0.24],[0.03,2.796,0.644,0.792,0.52,0.186],[0.425,-0.804,-1.441,0.232,-0.491,0.406],[-0.959,1.372,0.579,-0.776,0.015,-1.079],[-0.761,1.456,-0.659,-0.104,-0.649,-0.914],[-1.058,-0.553,-0.92,-2.045,-0.017,-1.134],[-1.355,0.033,-1.311,-0.627,-0.364,-1.573],[0.228,-0.72,-2.158,0.344,-1.786,-0.061],[-1.157,3.214,0.97,0.157,0.52,-1.257],[0.92,-0.637,1.687,0.68,0.267,0.31],[-0.267,-0.888,-1.116,-0.888,-1.028,-0.171],[-0.761,-0.469,1.687,0.12,0.678,-0.776],[0.03,-0.804,-0.464,1.128,-0.491,-0.185],[-1.058,-0.469,0.188,-0.253,-0.396,-1.202],[-0.267,-0.72,-0.985,-0.776,-0.838,-0.281],[0.327,-0.888,-1.246,2.546,-1.249,-0.075],[1.711,0.284,1.1,1.314,-0.27,0.818],[-0.86,1.289,0.514,-1.224,-0.238,-1.23],[0.129,-0.385,1.035,1.09,-0.08,-0.144],[0.129,-0.134,-1.05,0.941,-1.533,-0.103],[0.722,-0.553,0.579,1.277,-0.649,0.241],[0.228,-0.051,-0.855,-0.03,-0.428,-0.24],[0.722,-0.385,-0.333,1.986,-1.249,0.241],[-0.069,-0.888,0.123,0.232,-0.933,-0.79],[-0.86,-0.469,1.557,-0.365,0.962,-1.024],[-0.86,1.289,-1.963,-0.701,-2.323,-1.45],[-0.366,-0.888,-1.05,0.941,-0.807,-0.955],[2.008,-0.637,-0.073,1.949,-1.312,1.341]],"lab":{"2":[0,0,1,1,1,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],"3":[1,1,2,2,2,1,1,1,2,1,1,2,2,0,2,2,2,0,2,2,2,2,0,2,1,0,2,0,2,0,0,1,2,0,0,0,0,0,0,2,0,0,0],"4":[2,2,3,2,1,2,2,2,3,2,2,1,3,0,3,1,3,0,3,1,1,1,0,3,2,1,3,0,1,1,0,2,3,0,0,0,0,0,0,3,1,0,0],"5":[3,3,4,4,2,3,3,3,4,3,3,4,4,1,4,2,0,2,4,2,2,2,2,0,1,2,4,1,2,2,1,1,4,1,2,1,2,1,2,4,2,2,1],"6":[3,3,5,5,4,3,3,3,5,3,3,5,0,2,5,4,0,4,0,0,4,4,4,0,1,4,5,2,4,4,2,1,0,1,2,1,4,2,4,5,4,4,2]},"labRaw3":[1,1,1,1,1,2,2,2,1,1,2,1,1,0,1,1,2,0,1,1,1,1,0,2,2,1,2,0,1,1,0,2,1,2,0,0,1,0,2,2,1,0,0],"ord":{"2":[0,1],"3":[1,2,0],"4":[2,0,3,1],"5":[3,1,4,0,2],"6":[3,1,2,5,4,0]},"ordRaw3":[0,2,1],"rep":{"2":[["최형우","오스틴","디아즈"],["류지혁","고승민","최지훈"]],"3":[["양의지","구자욱","디아즈"],["박해민","정수빈","신민재"],["오지환","박동원"]],"4":[["오스틴","최형우","구자욱"],["김영웅","오선우","한유섬"],["박해민","김성윤","권희동"],["류지혁","허경민","전준우"]],"5":[["오스틴","안현민","최형우"],["박동원","김영웅","위즈덤"],["신민재","권희동","박성한"],["김주원","박해민"],["최주환","강민호","최원준"]],"6":[["오스틴","안현민","양의지"],["문보경","이재현","노시환"],["오선우","김영웅","오지환"],["권희동","김현수","신민재"],["강민호","최주환","류지혁"],["박해민","박찬호","김주원"]]},"moved":["양의지","안현민","오스틴","김주원","박해민","최주환","박성한","강민호","이재현","김휘집","장성우","권희동","최원준"],"share":{"rawA":[8.5,11.9,19.7,59.9,0.0,0.0],"stdA":[16.7,16.7,16.7,16.7,16.7,16.7],"rawB":[3.5,1.8,16.4,78.3,0.0,0.0],"stdB":[22.7,7.6,13.8,12.8,21.9,21.2]},"alt3":{"b":{"lab":[1,1,2,2,2,1,1,1,2,1,1,2,2,0,2,2,2,0,2,2,2,2,0,2,1,0,2,0,2,0,0,1,2,0,0,0,0,0,0,2,2,0,0],"score":0.26,"sizes":[9,19,15],"moved":["최원준"],"neg":["문현빈","최원준"],"freq":77},"c":{"lab":[1,1,2,2,0,1,1,1,2,1,1,2,2,0,2,0,2,0,2,2,0,0,0,2,1,0,2,0,0,0,0,1,2,1,0,1,0,0,0,2,0,0,1],"score":0.242,"sizes":[12,13,18],"moved":["문현빈","전준우","허경민","류지혁","고승민","이재현","박동원","위즈덤"],"neg":["최지훈","허경민"],"freq":38}},"km12":{"n":["디아즈","양의지","구자욱","오스틴","최형우","박동원","오지환","한유섬","박해민","정수빈","신민재","김주원"],"px":[[320.0,63.636],[135.0,145.455],[275.0,148.182],[130.0,115.455],[310.0,134.545],[440.0,140.0],[395.0,156.364],[420.0,159.091],[290.0,191.818],[105.0,183.636],[105.0,197.273],[375.0,159.091]],"a1":[1,0,0,0,1,1,1,1,0,0,0,1],"a2":[1,0,1,0,1,1,1,1,1,0,0,1],"c0":[[200.0,48.0],[410.0,48.0]],"c1":[[173.333,163.636],[376.667,135.455]],"c2":[[118.75,160.455],[353.125,144.091]]}};
function initW_stdswitch(root, D) {
  // 11차시 · 표준화 스위치 — KBO 타자 43명의 여섯 항목(홈런·도루·볼넷·삼진·출루율·장타율).
  // 좌표: x 삼진 30~165 → 68~438, y 홈런 0~52 → 272~48. 두 모드 공통(축 고정, 움직이는 것은 색뿐)
  var X0 = 68, X1 = 438, Y0 = 48, Y1 = 272;
  var XMIN = 30, XMAX = 165, YMIN = 0, YMAX = 52;
  var NS = 'http://www.w3.org/2000/svg';

  var ITEM = ['홈런', '도루', '볼넷', '삼진', '출루율', '장타율'];
  var ITEMC = ['#b07a00', '#54a24b', '#6b8fb5', '#d97757', '#8e7cc3', '#3ba6a0'];
  var STDC = ['#f4b400', '#54a24b', '#3ba6a0'];      // ㉮ ㉯ ㉰ — 교재 3절과 같은 색
  var STDS = ['#c28f00', '#ffffff', '#ffffff'];      // ㉮ 테두리만 진하게
  var STDT = ['#c28f00', '#54a24b', '#3ba6a0'];      // 범례 글자용(노랑은 어둡게)
  var RAWC = ['#8e7cc3', '#d97757', '#6b8fb5'];      // ① ② ③ — 표준화 묶음과 다른 색군
  var SYM_S = ['㉮', '㉯', '㉰'], SYM_R = ['①', '②', '③'];
  var SHARE0 = {
    rawA: [8.5, 11.9, 19.7, 59.9, 0, 0], stdA: [16.7, 16.7, 16.7, 16.7, 16.7, 16.7],
    rawB: [3.5, 1.8, 16.4, 78.3, 0, 0], stdB: [22.7, 7.6, 13.8, 12.8, 21.9, 21.2]
  };

  var raw = D.raw, names = D.n;
  var N = raw.length;
  var labS = (D.lab && D.lab['3']) || [];
  var labR = D.labRaw3 || [];
  var ordS = (D.ord && D.ord['3']) || [1, 2, 0];
  var ordR = D.ordRaw3 || [0, 2, 1];
  var share = D.share || SHARE0;

  // 코드 라벨 → 표시 순서(㉮㉯㉰ / ①②③, ①②③은 삼진 평균 내림차순)
  var gs = [], gr = [], i;
  for (i = 0; i < N; i++) {
    gs.push(ordS.indexOf(labS[i]));
    gr.push(ordR.indexOf(labR[i]));
  }

  // 묶음이 바뀐 선수(이름 목록 → 순번)
  var movedName = D.moved || [];
  var isMoved = [], movedCount = 0;
  for (i = 0; i < N; i++) {
    isMoved.push(movedName.indexOf(names[i]) >= 0);
    if (isMoved[i]) movedCount++;
  }

  // 표준화값 z = (x − 평균) / 표준편차, 모집단 기준(n = 43). 반올림 없이 원자료에서 직접 계산한다
  var MEAN = [], SD = [], j;
  for (j = 0; j < 6; j++) {
    var s = 0, k;
    for (k = 0; k < N; k++) s += raw[k][j];
    var m = s / N, v = 0;
    for (k = 0; k < N; k++) v += (raw[k][j] - m) * (raw[k][j] - m);
    MEAN.push(m); SD.push(Math.sqrt(v / N));
  }
  function zval(a, b) { return (raw[a][b] - MEAN[b]) / SD[b]; }
  function f2(x) {
    var sg = x < 0 ? -1 : 1, ab = Math.abs(x);
    var r = Math.round(ab * 100 + 1e-9) / 100;
    return (sg < 0 && r !== 0 ? '−' : '') + r.toFixed(2);
  }
  function f1(x) { return (Math.round(Math.abs(x) * 10 + 1e-9) / 10).toFixed(1); }

  // 좌표 · 축 밖으로 나간 값은 눌러 붙이고 테두리를 빨강으로(축은 늘리지 않는다)
  var px = [], py = [], clamped = [];
  for (i = 0; i < N; i++) {
    var xv = raw[i][3], yv = raw[i][0];
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

  var reduced = false;
  try {
    var view = doc && doc.defaultView;
    reduced = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { reduced = false; }

  // 점 43개
  var dots = [];
  for (i = 0; i < N; i++) {
    var c = doc.createElementNS(NS, 'circle');
    c.setAttribute('cx', px[i].toFixed(1));
    c.setAttribute('cy', py[i].toFixed(1));
    c.setAttribute('r', '5');
    c.setAttribute('fill-opacity', '0.85');
    c.setAttribute('stroke-width', '0.8');
    c.setAttribute('tabindex', '0');
    c.setAttribute('data-i', String(i));
    c.setAttribute('style', 'cursor:pointer');
    gPts.appendChild(c);
    dots.push(c);
  }
  // 옮겨 간 13명 표시 링(모드 전환 직후 600ms만 보인다)
  for (i = 0; i < N; i++) {
    if (!isMoved[i]) continue;
    var rg = doc.createElementNS(NS, 'circle');
    rg.setAttribute('cx', px[i].toFixed(1));
    rg.setAttribute('cy', py[i].toFixed(1));
    rg.setAttribute('r', '7.5');
    gRings.appendChild(rg);
  }

  // 막대 두 단 — 세그먼트 6개 + 값 글자 6개
  function makeBar(g, y, h) {
    var segs = [], labs = [], t;
    for (t = 0; t < 6; t++) {
      var r = doc.createElementNS(NS, 'rect');
      r.setAttribute('y', String(y)); r.setAttribute('height', String(h));
      r.setAttribute('x', String(X0)); r.setAttribute('width', '0');
      r.setAttribute('fill', ITEMC[t]);
      g.appendChild(r); segs.push(r);
    }
    for (t = 0; t < 6; t++) {
      var tx = doc.createElementNS(NS, 'text');
      tx.setAttribute('y', String(y + h / 2 + 4));
      tx.setAttribute('font-size', '12');
      tx.setAttribute('fill', '#ffffff');
      tx.setAttribute('text-anchor', 'middle');
      g.appendChild(tx); labs.push(tx);
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

  // 범례 — 기호는 묶음 색, 나머지는 본문 색
  function fillLegend(node, parts) {
    while (node.firstChild) node.removeChild(node.firstChild);
    for (var t = 0; t < parts.length; t++) {
      var sp = doc.createElementNS(NS, 'tspan');
      sp.textContent = parts[t][0];
      if (parts[t][1]) { sp.setAttribute('fill', parts[t][1]); sp.setAttribute('font-weight', '700'); }
      node.appendChild(sp);
    }
  }
  function legendRaw() {
    var cnt = [0, 0, 0], so = [0, 0, 0], t, out = [];
    for (t = 0; t < N; t++) { cnt[gr[t]]++; so[gr[t]] += raw[t][3]; }
    for (t = 0; t < 3; t++) {
      out.push([SYM_R[t], RAWC[t]]);
      out.push([' ' + cnt[t] + '명 ' + (t === 0 ? '삼진 ' : '') + f1(so[t] / cnt[t]) + (t < 2 ? ' · ' : ''), null]);
    }
    return out;
  }
  function legendStd() {
    var cnt = [0, 0, 0], t, out = [];
    for (t = 0; t < N; t++) cnt[gs[t]]++;
    for (t = 0; t < 3; t++) {
      out.push([SYM_S[t], STDT[t]]);
      out.push([' ' + cnt[t] + '명 · ', null]);
    }
    out.push(['§3 표와 같음', null]);
    return out;
  }
  fillLegend(lgRaw, legendRaw());
  fillLegend(lgStd, legendStd());

  // 상태
  var mode = 'raw', onlyMoved = false, sel = 0, seq = 0;
  if (names.indexOf('양의지') >= 0) sel = names.indexOf('양의지');

  function colorOf(a, m) { return m === 'raw' ? RAWC[gr[a]] : STDC[gs[a]]; }
  function strokeOf(a, m) {
    if (clamped[a]) return '#d64545';
    return m === 'raw' ? '#ffffff' : STDS[gs[a]];
  }
  function hex(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
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
      pv[t].textContent = t < 4 ? String(raw[sel][t]) : raw[sel][t].toFixed(3);
      pz[t].textContent = f2(zval(sel, t));
    }
    var ch = isMoved[sel];
    passign.textContent = '원래 단위 ' + SYM_R[gr[sel]] + ' → 표준화 ' + SYM_S[gs[sel]] +
      ' · ' + (ch ? '바뀜' : '그대로');
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

  // 모드 전환 400ms + 옮겨 간 13명 링 600ms
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

  // 점 선택 · 히트 판정 14px, 가장 가까운 점
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

  // 초기 상태 · 원래 단위 · 양의지 선택 · 전체 보기
  wout.textContent = '묶음 바뀐 선수 ' + movedCount + ' / ' + N;
  paintDots(); paintBars('raw'); paintPanel();
  lgRaw.setAttribute('opacity', '1');
  lgStd.setAttribute('opacity', '0');
}

function initW_ruler(root, D) {
  // 11차시 · 자 바꾸기 — 삼진(개)과 출루율 두 항목만 사용한다. D = KBO 타자 43명(n·raw).
  var q = function (s) { return root.querySelector(s); };
  var doc = root.ownerDocument;
  var view = doc && doc.defaultView;
  var reduce = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var raf = (view && view.requestAnimationFrame) ? function (f) { return view.requestAnimationFrame(f); } : null;

  // ── 데이터: 삼진 raw[i][3], 출루율 raw[i][4]
  var NM = D.n, RW = D.raw, N = NM.length;
  var K = [], O = [], i;
  for (i = 0; i < N; i++) { K.push(RW[i][3]); O.push(RW[i][4]); }
  function mean(a) { var s = 0; for (var t = 0; t < a.length; t++) s += a[t]; return s / a.length; }
  function sdp(a) { var m = mean(a), s = 0; for (var t = 0; t < a.length; t++) s += (a[t] - m) * (a[t] - m); return Math.sqrt(s / a.length); }
  var mK = mean(K), sK = sdp(K), mO = mean(O), sO = sdp(O);   // 모집단 기준(n = 43)
  var zK = [], zO = [];
  for (i = 0; i < N; i++) { zK.push((K[i] - mK) / sK); zO.push((O[i] - mO) / sO); }

  // ── 좌표: 원래 단위 삼진 30~165 · 출루율 0.28~0.46, 표준화 두 축 −2.8~+2.8
  var PX0 = 76, PX1 = 452, PY0 = 48, PY1 = 300;
  function gx(v, m) { return m === 'raw' ? PX0 + (v - 30) / 135 * (PX1 - PX0) : PX0 + (v + 2.8) / 5.6 * (PX1 - PX0); }
  function gy(v, m) { return m === 'raw' ? PY1 - (v - 0.28) / 0.18 * (PY1 - PY0) : PY1 - (v + 2.8) / 5.6 * (PY1 - PY0); }
  function pos(k, m) {
    var x = m === 'raw' ? gx(K[k], 'raw') : gx(zK[k], 'std');
    var y = m === 'raw' ? gy(O[k], 'raw') : gy(zO[k], 'std');
    var cx = Math.min(PX1, Math.max(PX0, x)), cy = Math.min(PY1, Math.max(PY0, y));
    return [cx, cy, (cx !== x || cy !== y) ? 1 : 0];
  }

  // ── 거리: 현재 모드의 좌표계(원래 단위 또는 z)
  function diff(a, b, m) {
    return m === 'raw' ? [Math.abs(K[a] - K[b]), Math.abs(O[a] - O[b])] : [Math.abs(zK[a] - zK[b]), Math.abs(zO[a] - zO[b])];
  }
  function nearestOf(k, m) {
    var best = -1, bd = Infinity;
    for (var t = 0; t < N; t++) {
      if (t === k) continue;
      var d = diff(k, t, m), v = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
      if (v < bd) { bd = v; best = t; }        // 동률이면 앞선 순서 유지
    }
    return best;
  }
  var nRaw = [], nStd = [], changed = 0;
  for (i = 0; i < N; i++) {
    nRaw.push(nearestOf(i, 'raw')); nStd.push(nearestOf(i, 'std'));
    if (nRaw[i] !== nStd[i]) changed++;
  }

  // ── 격자·눈금 숫자
  var TX = { raw: [30, 60, 90, 120, 150], std: [-2, -1, 0, 1, 2] };
  var TY = { raw: [0.28, 0.32, 0.36, 0.40, 0.44], std: [-2, -1, 0, 1, 2] };
  function lab(v, m, ax) {
    if (m === 'std') return (v < 0 ? '−' : '') + Math.abs(v);
    return ax === 'y' ? v.toFixed(2) : String(v);
  }
  function grid(g, m) {
    var s = '', k, x, y;
    for (k = 0; k < TX[m].length; k++) {
      x = gx(TX[m][k], m);
      s += '<line x1="' + x.toFixed(1) + '" y1="48" x2="' + x.toFixed(1) + '" y2="300" stroke="#e3ddcf" stroke-width="1"/>';
      s += '<text x="' + x.toFixed(1) + '" y="314" font-size="13" fill="#6b7385" text-anchor="middle">' + lab(TX[m][k], m, 'x') + '</text>';
    }
    for (k = 0; k < TY[m].length; k++) {
      y = gy(TY[m][k], m);
      s += '<line x1="76" y1="' + y.toFixed(1) + '" x2="452" y2="' + y.toFixed(1) + '" stroke="#e3ddcf" stroke-width="1"/>';
      s += '<text x="70" y="' + (y + 4.5).toFixed(1) + '" font-size="13" fill="#6b7385" text-anchor="end">' + lab(TY[m][k], m, 'y') + '</text>';
    }
    g.innerHTML = s;
  }
  var gRaw = q('.gr-raw'), gStd = q('.gr-std');
  grid(gRaw, 'raw'); grid(gStd, 'std');

  // ── 점 43개
  var pts = q('.pts'), s0 = '';
  for (i = 0; i < N; i++) {
    var p0 = pos(i, 'raw');
    s0 += '<circle data-i="' + i + '" tabindex="0" aria-label="' + NM[i] + '" cx="' + p0[0].toFixed(1) + '" cy="' + p0[1].toFixed(1)
      + '" r="5" fill="#b9b3a5" fill-opacity="0.85" stroke="' + (p0[2] ? '#d64545' : '#fff') + '" stroke-width="0.8"/>';
  }
  pts.innerHTML = s0;
  var dots = pts.querySelectorAll('circle');

  // ── 상태
  var svg = root.querySelector('svg');
  var labs = q('.labs'), line = q('.link'), bar = q('.bar');
  var dSel = q('.dot-sel'), dNear = q('.dot-near');
  var mode = 'raw', link = true, busy = false, seq = 0;
  var sel = NM.indexOf('디아즈'); if (sel < 0) sel = 0;
  var cur = [];
  for (i = 0; i < N; i++) { var p1 = pos(i, 'raw'); cur.push([p1[0], p1[1]]); }
  function near() { return mode === 'raw' ? nRaw[sel] : nStd[sel]; }

  // ── 그리기
  var BAR_W = 156;                                  // 패널 가용폭(480~692)에서 값 표시 폭을 뺀 나머지
  function nameW(t) { return t.length * 13 + 4; }   // 한글은 글자 폭 ≈ font-size
  function box(k, ty) {
    var x = cur[k][0], w = nameW(NM[k]);
    var right = x + 9 + w <= 462;                   // 오른쪽으로 넘치면 점 왼쪽에 붙인다
    var lx = right ? x + 9 : x - 9;
    return { x: lx, y: ty, a: right ? 'start' : 'end', x0: right ? lx : lx - w, x1: right ? lx + w : lx };
  }
  function svgText(b, t) {
    return '<text x="' + b.x.toFixed(1) + '" y="' + b.y.toFixed(1)
      + '" font-size="13" fill="#1c2230" text-anchor="' + b.a + '">' + t + '</text>';
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
    var bs = box(sel, clampY(cur[sel][1] + 4.5));
    var bn = box(nb, clampY(cur[nb][1] + 4.5));
    // 두 이름이 가로로 겹치면서 세로 간격이 좁을 때만 한 줄 내린다
    if (Math.abs(bs.y - bn.y) < 15 && bn.x0 < bs.x1 && bs.x0 < bn.x1) {
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
    var dK = Math.abs(K[sel] - K[nb]), dO = Math.abs(O[sel] - O[nb]);
    var zk = Math.abs(zK[sel] - zK[nb]), zo = Math.abs(zO[sel] - zO[nb]);
    var a = mode === 'raw' ? dK : zk, b = mode === 'raw' ? dO : zo;
    var den = a * a + b * b;
    q('.p-sel').textContent = '선택 ' + NM[sel];
    q('.p-near').textContent = '최근접 ' + NM[nb];
    q('.v-k').textContent = mode === 'raw' ? String(Math.round(dK)) : Math.round(dK) + ' (z ' + zk.toFixed(2) + ')';
    q('.v-o').textContent = mode === 'raw' ? dO.toFixed(3) : dO.toFixed(3) + ' (z ' + zo.toFixed(2) + ')';
    q('.v-d').textContent = Math.sqrt(den).toFixed(3);
    var sh = den > 0 ? a * a / den * 100 : 0;
    q('.v-s').textContent = sh.toFixed(1) + '%';
    bar.setAttribute('width', (BAR_W * sh / 100).toFixed(1));
  }

  // ── 모드 전환(500ms, cubic-bezier(.4,0,.2,1))
  function ease(x) {
    var cx1 = 0.4, cx2 = 0.2, lo = 0, hi = 1, t = x, v;
    for (var k = 0; k < 24; k++) {
      v = 3 * (1 - t) * (1 - t) * t * cx1 + 3 * (1 - t) * t * t * cx2 + t * t * t;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return 3 * (1 - t) * t * t + t * t * t;   // y1 = 0, y2 = 1
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
    var bs = root.querySelectorAll('.wbtn[data-mode]');
    for (var t = 0; t < bs.length; t++) {
      var onb = bs[t].getAttribute('data-mode') === m;
      bs[t].classList.toggle('on', onb);
      bs[t].setAttribute('aria-pressed', onb ? 'true' : 'false');
    }
    q('.axx').textContent = m === 'raw' ? '삼진(개)' : '삼진(표준화)';
    q('.axy').textContent = m === 'raw' ? '출루율' : '출루율(표준화)';
    var to = [], clamped = [];
    for (t = 0; t < N; t++) { var p = pos(t, m); to.push([p[0], p[1]]); clamped.push(p[2]); }
    for (t = 0; t < N; t++) dots[t].setAttribute('stroke', clamped[t] ? '#d64545' : '#fff');
    panel();
    var token = ++seq;
    // 화면에 보이지 않는 탭에서는 rAF가 멈춰 점·눈금만 뒤처진다. 이때는 전환 없이 즉시 반영한다
    if (reduce || !raf || (doc && doc.visibilityState === 'hidden')) { jump(to); return; }
    var from = [];
    for (t = 0; t < N; t++) from.push([cur[t][0], cur[t][1]]);
    busy = true;
    var t0 = -1;
    var frame = function (ts) {
      if (token !== seq) return;
      if (t0 < 0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 500);
      if (k >= 1) { jump(to); return; }          // 끝에서는 목표 좌표로 정확히 맞춘다
      var e = ease(k);
      for (var u = 0; u < N; u++) {
        cur[u][0] = from[u][0] + (to[u][0] - from[u][0]) * e;
        cur[u][1] = from[u][1] + (to[u][1] - from[u][1]) * e;
      }
      gRaw.setAttribute('opacity', (m === 'raw' ? k : 1 - k).toFixed(2));
      gStd.setAttribute('opacity', (m === 'std' ? k : 1 - k).toFixed(2));
      paint();
      raf(frame);
    };
    paint();
    raf(frame);
  }

  // ── 선택
  function select(k) {
    if (k === sel || k < 0 || k >= N) return;
    sel = k; paint(); panel();
  }

  // 클릭 판정: 가장 가까운 점까지 14(viewBox 단위) 이내
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
    e.preventDefault();
    select(+a);
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

  q('.wout').textContent = '최근접 바뀜 ' + changed + ' / ' + N;
  paint(); panel();
}

function initW_kpick(root, D) {
  // ── 상수: 색·기호·좌표 ─────────────────────────────────────────────
  const CLR = ['#f4b400', '#54a24b', '#3ba6a0', '#2b7fd6', '#b07a00', '#8a6bbf'];
  const SYM = ['㉮', '㉯', '㉰', '㉱', '㉲', '㉳'];
  const NEG = '#d64545';
  const KS = [2, 3, 4, 5, 6];
  const N = D.n.length;                       // 43
  const M = D.z[0].length;                    // 6
  const SX = s => 170 + (s + 0.1) * 400;      // 실루엣 −0.1~0.5 → x 170~410
  const X0 = SX(0);                           // 210
  const ROW = 7.2, BAR = 5.4, GAP = 7, TOP = 50;
  const CX = 450, CW = 262, CTOP = 50, CBOT = 400, CGAP = 6;
  const HR = 0, SB = 1, SO = 3, SG = 5;       // raw 열: 홈런·도루·볼넷·삼진·출루율·장타율

  // 글자 폭 어림: 한글·기호 1.0em, 나머지 0.55em
  const wide = c => c.charCodeAt(0) > 0x2000;
  const tw = (t, f) => {
    let w = 0;
    for (let i = 0; i < t.length; i++) w += wide(t[i]) ? f : f * 0.55;
    return w;
  };

  // ── 계산: 거리 → 실루엣 ────────────────────────────────────────────
  const dist = [];
  for (let i = 0; i < N; i++) dist.push(new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      let t = 0;
      for (let m = 0; m < M; m++) { const d = D.z[i][m] - D.z[j][m]; t += d * d; }
      const v = Math.sqrt(t);
      dist[i][j] = v; dist[j][i] = v;
    }
  }
  function silhouette(lab, k) {
    const size = new Array(k).fill(0);
    for (let i = 0; i < N; i++) size[lab[i]]++;
    const s = new Array(N).fill(0);
    for (let i = 0; i < N; i++) {
      const own = lab[i];
      if (size[own] <= 1) { s[i] = 0; continue; }
      const sum = new Array(k).fill(0);
      for (let j = 0; j < N; j++) if (j !== i) sum[lab[j]] += dist[i][j];
      const a = sum[own] / (size[own] - 1);
      let b = Infinity;
      for (let c = 0; c < k; c++) if (c !== own && size[c] > 0) b = Math.min(b, sum[c] / size[c]);
      s[i] = (b - a) / Math.max(a, b);
    }
    return s;
  }

  // ── k별 상태 미리 계산 ─────────────────────────────────────────────
  const VIEW = {};
  KS.forEach(k => {
    const lab = D.lab[String(k)], ord = D.ord[String(k)];
    const s = silhouette(lab, k);
    const gi = ord.map(code => {
      const mem = [];
      for (let i = 0; i < N; i++) if (lab[i] === code) mem.push(i);
      mem.sort((p, q) => s[q] - s[p]);
      const avg = [];
      for (let m = 0; m < M; m++) {
        let t = 0;
        for (const i of mem) t += D.raw[i][m];
        avg.push(t / mem.length);
      }
      return { mem: mem, avg: avg };
    });
    let mean = 0, neg = 0;
    for (let i = 0; i < N; i++) { mean += s[i]; if (s[i] < 0) neg++; }
    mean /= N;
    const small = Math.min.apply(null, gi.map(g => g.mem.length));
    // 선수별 y 좌표·표시 묶음 번호
    const slot = new Array(N).fill(0), grp = new Array(N).fill(0);
    let y = TOP;
    const bandY = [];
    gi.forEach((g, o) => {
      const y0 = y;
      g.mem.forEach(i => { slot[i] = y; grp[i] = o; y += ROW; });
      bandY.push((y0 + y - ROW) / 2 + BAR / 2 + 0.9);
      y += GAP;
    });
    VIEW[k] = { s: s, gi: gi, mean: mean, neg: neg, small: small, slot: slot, grp: grp, bandY: bandY };
  });

  let best = KS[0];
  KS.forEach(k => { if (VIEW[k].mean > VIEW[best].mean) best = k; });

  // ── 요소 ──────────────────────────────────────────────────────────
  const q = sel => root.querySelector(sel);
  const barsG = q('.bars'), labG = q('.glab'), cardG = q('.cards');
  const meanL = q('.meanline'), meanT = q('.meantext');
  const pinT = q('.pinname'), readT = q('.readout'), outS = q('.wout');
  const btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));
  const READY = '막대 클릭 → 선수 한 명 고정 · k 변경 시 소속 이동 확인';

  const f1 = v => v.toFixed(1);
  const f3 = v => v.toFixed(3);
  const sg = v => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(3);

  // 막대 43개는 선수 순서로 한 번만 만든다. k가 바뀌면 위치와 색만 바꾼다
  barsG.innerHTML = D.n.map(name =>
    '<g class="row" tabindex="0" role="button" aria-label="' + name + '">' +
    '<rect x="152" y="0" width="278" height="7.2" fill="#ffffff" fill-opacity="0" pointer-events="all"/>' +
    '<rect class="bar" x="210" y="0.9" width="0" height="5.4" rx="1"/>' +
    '</g>').join('');
  const rows = Array.prototype.slice.call(root.querySelectorAll('.row'));
  const bars = rows.map(g => g.querySelector('.bar'));

  // ── 상태 ──────────────────────────────────────────────────────────
  let curK = 2, prevK = 0, pin = -1, hov = -1;
  let posNow = VIEW[2].slot.slice();
  let anim = 0;

  const dv = root.ownerDocument && root.ownerDocument.defaultView;
  const reduce = !!(dv && dv.matchMedia && dv.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ── 그리기 ────────────────────────────────────────────────────────
  function paintBars() {
    const V = VIEW[curK];
    for (let i = 0; i < N; i++) {
      rows[i].setAttribute('transform', 'translate(0 ' + posNow[i].toFixed(2) + ')');
      const s = V.s[i], x = SX(s), b = bars[i];
      b.setAttribute('x', (s < 0 ? x : X0).toFixed(2));
      b.setAttribute('width', Math.max(0.8, Math.abs(x - X0)).toFixed(2));
      b.setAttribute('fill', s < 0 ? NEG : CLR[V.grp[i]]);
      if (i === pin) { b.setAttribute('stroke', '#1c2230'); b.setAttribute('stroke-width', '1.2'); }
      else { b.removeAttribute('stroke'); b.removeAttribute('stroke-width'); }
    }
    // 고정 선수명은 막대 위 별도 층에 한 개만 둔다
    if (pin < 0) { pinT.setAttribute('display', 'none'); return; }
    const s = V.s[pin], x = SX(s);
    const right = Math.max(x, X0), left = Math.min(x, X0);
    const w = tw(D.n[pin], 13);
    const fits = right + 6 + w <= 444;
    pinT.setAttribute('display', '');
    pinT.setAttribute('text-anchor', fits ? 'start' : 'end');
    pinT.setAttribute('x', (fits ? right + 6 : left - 6).toFixed(2));
    pinT.setAttribute('y', (posNow[pin] + 8.2).toFixed(2));
    pinT.textContent = D.n[pin];
  }
  function paintMean() {
    const V = VIEW[curK], x = SX(V.mean);
    meanL.setAttribute('x1', x.toFixed(2)); meanL.setAttribute('x2', x.toFixed(2));
    meanT.setAttribute('x', x.toFixed(2));
    meanT.textContent = '평균 ' + f3(V.mean);
  }
  function paintLabels() {
    const V = VIEW[curK];
    labG.innerHTML = V.gi.map((g, o) =>
      '<text x="146" y="' + (V.bandY[o] + 3.7).toFixed(1) + '" font-size="13" text-anchor="end" fill="' +
      CLR[o] + '">' + SYM[o] + ' ' + g.mem.length + '명</text>').join('');
  }
  function paintCards() {
    const V = VIEW[curK], k = curK;
    const h = (CBOT - CTOP - (k - 1) * CGAP) / k;
    const named = k <= 4;                       // 이름칸은 k≤4에만
    const lead = k === 4 ? 14.6 : (k >= 5 ? 15 : 15.5);
    const pad = k >= 4 ? 15 : 16;
    const room = h - pad - (named ? 20 : 6);
    const maxLines = Math.max(2, Math.floor(room / lead) + 1);
    let out = '';
    V.gi.forEach((g, o) => {
      const top = CTOP + o * (h + CGAP);
      const a = g.avg, one = g.mem.length === 1;
      const lines = [];
      lines.push({ t: SYM[o] + ' ' + g.mem.length + '명', w: 1, c: CLR[o], dot: 1 });
      if (one) lines.push({ t: '실루엣 정의 불가 · 구성원 1명', c: '#6b7385' });
      lines.push({ t: '홈런 ' + f1(a[HR]) + ' · 도루 ' + f1(a[SB]), c: '#1c2230' });
      lines.push({ t: '삼진 ' + f1(a[SO]) + ' · 장타율 ' + f3(a[SG]), c: '#1c2230' });
      if (k <= 4 && !one) lines.push({ t: D.rep[String(k)][o].join(' · '), c: '#6b7385' });
      out += '<rect x="' + CX + '" y="' + top.toFixed(1) + '" width="' + CW + '" height="' + h.toFixed(1) +
        '" rx="6" fill="#ffffff" stroke="#e3ddcf"/>';
      lines.slice(0, maxLines).forEach((ln, r) => {
        const y = top + pad + r * lead;
        if (ln.dot) out += '<circle cx="465.5" cy="' + (y - 4.4).toFixed(1) + '" r="3.5" fill="' + CLR[o] + '"/>';
        out += '<text x="' + (ln.dot ? 474 : 462) + '" y="' + y.toFixed(1) + '" font-size="13"' +
          (ln.w ? ' font-weight="700"' : '') + ' fill="' + ln.c + '">' + ln.t + '</text>';
      });
      if (named) out += '<text x="' + (CX + CW - 12) + '" y="' + (top + h - 9).toFixed(1) +
        '" font-size="12" text-anchor="end" fill="#6b7385">유형 이름은? ______</text>';
    });
    cardG.innerHTML = out;
  }
  function paintOut() {
    const V = VIEW[curK];
    outS.textContent = '평균 ' + f3(V.mean) + ' · 음수 ' + V.neg + '명 · 가장 작은 묶음 ' + V.small + '명';
  }
  function paintRead() {
    const i = hov >= 0 ? hov : pin;
    if (i < 0) { readT.textContent = READY; return; }
    const V = VIEW[curK];
    let t = D.n[i] + ' · 지금 k=' + curK + ' → ' + SYM[V.grp[i]] + ' · 실루엣 ' + sg(V.s[i]);
    if (prevK) {
      const P = VIEW[prevK];
      t += ' / 직전 k=' + prevK + ' → ' + SYM[P.grp[i]] + ' · ' + sg(P.s[i]);
    }
    readT.textContent = t;
  }
  function paintTabs() {
    btns.forEach(b => {
      const k = +b.getAttribute('data-k');
      b.textContent = (k === best ? '★ ' : '') + 'k=' + k + ' · ' + f3(VIEW[k].mean);
      if (k === curK) b.classList.add('on'); else b.classList.remove('on');
    });
  }

  // ── k 전환: 막대 y·색만 300ms ─────────────────────────────────────
  function setK(k) {
    if (k === curK) return;
    const from = posNow.slice(), to = VIEW[k].slot;
    prevK = curK; curK = k;
    paintTabs(); paintMean(); paintLabels(); paintCards(); paintOut(); paintRead();
    if (reduce) { posNow = to.slice(); paintBars(); return; }
    const seq = ++anim, t0 = Date.now();
    (function step() {
      if (seq !== anim) return;
      const p = Math.min(1, (Date.now() - t0) / 300);
      const e = 1 - (1 - p) * (1 - p);
      for (let i = 0; i < N; i++) posNow[i] = from[i] + (to[i] - from[i]) * e;
      paintBars();
      if (p < 1) requestAnimationFrame(step);
    })();
  }

  // ── 조작 ──────────────────────────────────────────────────────────
  btns.forEach(b => b.addEventListener('click', () => setK(+b.getAttribute('data-k'))));
  rows.forEach((g, i) => {
    const toggle = () => { pin = (pin === i ? -1 : i); paintBars(); paintRead(); };
    g.addEventListener('click', toggle);
    g.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); toggle(); }
    });
    const on = () => { hov = i; paintRead(); };
    const off = () => { if (hov === i) { hov = -1; paintRead(); } };
    g.addEventListener('mouseenter', on);
    g.addEventListener('mouseleave', off);
    g.addEventListener('focus', on);
    g.addEventListener('blur', off);
  });

  // ── 초기 상태: k=2, 고정 없음 ─────────────────────────────────────
  paintTabs(); paintMean(); paintLabels(); paintCards(); paintOut(); paintBars(); paintRead();
}

function initW_sildist(root, D) {
  /*--CALC-START--*/
  var Z = D.z, NM = D.n, n = NM.length;
  var ORD = D.ord['3'];                        // 표시 순서 ㉮㉯㉰ → 코드 라벨
  var LABS = [D.lab['3'], D.alt3.b.lab, D.alt3.c.lab];
  var MOVED = [[], D.alt3.b.moved, D.alt3.c.moved];
  var FREQ = [48, D.alt3.b.freq, D.alt3.c.freq];

  var DM = [];
  (function () {
    for (var i = 0; i < n; i++) DM.push(new Array(n));
    for (var p = 0; p < n; p++) {
      DM[p][p] = 0;
      for (var q = p + 1; q < n; q++) {
        var s = 0;
        for (var k = 0; k < 6; k++) { var t = Z[p][k] - Z[q][k]; s += t * t; }
        DM[p][q] = DM[q][p] = Math.sqrt(s);
      }
    }
  })();

  function stats(L, i) {
    var own = L[i], sums = {}, cnts = {}, j, c;
    for (j = 0; j < n; j++) {
      if (j === i) continue;
      c = L[j];
      sums[c] = (sums[c] || 0) + DM[i][j];
      cnts[c] = (cnts[c] || 0) + 1;
    }
    var means = {};
    for (c in sums) means[c] = sums[c] / cnts[c];
    var a = (cnts[own] ? means[own] : null);
    var b = null, bc = null;
    for (c in means) {
      if (+c === own) continue;
      if (b === null || means[c] < b) { b = means[c]; bc = +c; }
    }
    var s = (a === null) ? 0 : (b - a) / Math.max(a, b);
    return { a: a, b: b, bc: bc, s: s, means: means, own: own };
  }

  function scoreOf(L) {
    var t = 0;
    for (var i = 0; i < n; i++) t += stats(L, i).s;
    return t / n;
  }
  function sizesOf(L) {
    var out = [];
    for (var li = 0; li < 3; li++) {
      var c = 0;
      for (var i = 0; i < n; i++) if (L[i] === ORD[li]) c++;
      out.push(c);
    }
    return out;
  }
  function negOf(L) {
    var out = [];
    for (var i = 0; i < n; i++) if (stats(L, i).s < 0) out.push(NM[i]);
    return out;
  }
  function orderOf(L) {
    var ix = [], sc = [];
    for (var i = 0; i < n; i++) { ix.push(i); sc.push(stats(L, i).s); }
    ix.sort(function (p, q) { return sc[p] !== sc[q] ? sc[p] - sc[q] : p - q; });
    return ix;
  }
  function f3(v) { return v.toFixed(3).replace('-', '−'); }
  function r3(v) { return Math.round(v * 1000) / 1000; }
  // 화면 산술 자기일치: 표시된 세 자리 a·b로 나눗셈을 다시 계산한다
  function shown(st) {
    var a = r3(st.a), b = r3(st.b), big = Math.max(a, b);
    return { a: a, b: b, big: big, s: (b - a) / big };
  }

  var RUNS = [];
  (function () {
    for (var r = 0; r < 3; r++) {
      var L = LABS[r], sz = sizesOf(L), sc = scoreOf(L), ng = negOf(L), mv = MOVED[r];
      var head = (r === 0) ? '① 교재 조건(n_init=10) · 점수 ' : (r === 1 ? '② 다른 시작 · ' : '③ 다른 시작 · ');
      var mid = sc.toFixed(3) + ' · ' + sz.join('·') + '명 · ';
      var tail;
      if (r === 0) tail = '음수 ' + ng.length + '명 · 400회 중 ' + FREQ[r] + '회';
      else if (r === 1) tail = '소속 이동 ' + mv.length + '명(' + mv.join('·') + ') · 400회 중 ' + FREQ[r] + '회 · 가장 흔함';
      else tail = '소속 이동 ' + mv.length + '명 · 400회 중 ' + FREQ[r] + '회';
      RUNS.push({ lab: L, row: head + mid + tail, order: orderOf(L) });
    }
  })();

  var XA = 150, XB = 660, DMAX = 7.6;
  function X(d) { return XA + d * (XB - XA) / DMAX; }
  var LANEY = [74, 124, 174];
  var CCOL = ['#f4b400', '#54a24b', '#3ba6a0'];         // ㉮ ㉯ ㉰
  var SYM = ['㉮', '㉯', '㉰'];
  var OWNC = '#2b7fd6', NEARC = '#b07a00', OTHC = '#b9b3a5';
  function jit(i) { return ((i * 37 + 11) % 7) - 3; }
  /*--CALC-END--*/

  var NS = 'http://www.w3.org/2000/svg';
  var doc = root.ownerDocument;
  var svg = root.querySelector('svg');
  var view = doc && doc.defaultView;
  var reduce = !!(view && view.matchMedia && view.matchMedia('(prefers-reduced-motion: reduce)').matches);
  root.style.overflowX = 'auto';

  function mk(tag, attrs, parent) {
    var e = doc.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  var gLanes = svg.querySelector('.lanes');
  var gTicks = svg.querySelector('.ticks');
  var gMeans = svg.querySelector('.means');
  var gSelf = svg.querySelector('.self');
  var tCalc = svg.querySelector('.calc');
  var tName = svg.querySelector('.hd-name');
  var gTable = svg.querySelector('.runtable');
  var out = root.querySelector('.wout');

  var lane = [], mean = [], tick = [];
  var li, i;
  for (li = 0; li < 3; li++) {
    var g = mk('g', { transform: 'translate(0,' + LANEY[li] + ')' }, gLanes);
    mk('line', { x1: XA, y1: 0, x2: XB, y2: 0, stroke: '#e3ddcf', 'stroke-width': 1 }, g);
    var t1 = mk('text', { x: 140, y: -4, 'text-anchor': 'end', 'font-size': 13, fill: '#1c2230' }, g);
    var s1 = mk('tspan', {}, t1), s2 = mk('tspan', {}, t1), s3 = mk('tspan', { fill: '#d64545' }, t1);
    var t2 = mk('text', { x: 140, y: 12, 'text-anchor': 'end', 'font-size': 13, fill: '#6b7385' }, g);
    lane.push({ sym: s1, cnt: s2, warn: s3, role: t2 });
  }
  for (i = 0; i < n; i++) {
    tick.push(mk('line', { x1: 0, y1: -7.5, x2: 0, y2: 7.5, 'stroke-width': 1.6, stroke: OTHC }, gTicks));
  }
  for (li = 0; li < 3; li++) {
    var gm = mk('g', {}, gMeans);
    var ml = mk('line', { x1: 0, y1: -12, x2: 0, y2: 12, 'stroke-width': 2 }, gm);
    var mt = mk('path', { d: 'M -5 -20 L 5 -20 L 0 -12 Z' }, gm);
    var mx = mk('text', { x: 0, y: -24, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700 }, gm);
    mean.push({ g: gm, line: ml, tri: mt, lab: mx });
  }
  var selDia = mk('text', { x: 0, y: 6, 'text-anchor': 'middle', 'font-size': 16, fill: '#1c2230' }, gSelf);
  selDia.textContent = '◆';
  var selNm = mk('text', { x: 10, y: 26, 'font-size': 13, fill: '#1c2230' }, gSelf);

  var rowRect = [], rowText = [];
  var rowMid = [274, 296, 318];
  for (var r = 0; r < 3; r++) {
    rowRect.push(mk('rect', { x: 20, y: rowMid[r] - 11, width: 680, height: 22, rx: 4, fill: '#fff', stroke: '#e3ddcf' }, gTable));
    rowText.push(mk('text', { x: 30, y: rowMid[r] + 5, 'font-size': 13, fill: '#1c2230' }, gTable));
  }

  // 시작 중심점을 바꿀 때만 전환한다. 선수 전환은 즉시.
  function setAnim(on) {
    var move = (on && !reduce) ? 'transform 250ms ease' : 'none';
    var col = (on && !reduce) ? 'stroke 250ms ease' : 'none';
    for (var z = 0; z < tick.length; z++) tick[z].style.transition = col;
    for (z = 0; z < 3; z++) mean[z].g.style.transition = move;
  }

  var runIx = 0, selIx = NM.indexOf('문현빈');
  if (selIx < 0) selIx = 0;

  function render() {
    var L = RUNS[runIx].lab, st = stats(L, selIx), q, j;
    tName.textContent = NM[selIx];

    var laneOf = {}, roleOf = {};
    for (q = 0; q < 3; q++) {
      var code = ORD[q];
      laneOf[code] = q;
      roleOf[code] = (code === st.own) ? 'own' : (code === st.bc ? 'near' : 'oth');
    }
    var neg = st.a !== null && st.s < 0;

    for (q = 0; q < 3; q++) {
      var c = ORD[q], role = roleOf[c], cnt = 0;
      for (j = 0; j < n; j++) if (L[j] === c) cnt++;
      lane[q].sym.setAttribute('fill', CCOL[q]);
      lane[q].sym.textContent = SYM[q] + ' ';
      lane[q].cnt.textContent = cnt + '명';
      lane[q].warn.textContent = (neg && role !== 'oth') ? ' · b < a' : '';
      lane[q].role.textContent = role === 'own' ? '내 묶음' : (role === 'near' ? '가장 가까운 묶음' : '');
    }

    for (i = 0; i < n; i++) {
      var tk = tick[i];
      if (i === selIx) { tk.setAttribute('visibility', 'hidden'); continue; }
      tk.setAttribute('visibility', 'visible');
      var q2 = laneOf[L[i]], rl = roleOf[L[i]];
      tk.setAttribute('transform', 'translate(' + X(DM[selIx][i]).toFixed(1) + ',' + (LANEY[q2] + jit(i)) + ')');
      tk.setAttribute('stroke', rl === 'own' ? OWNC : (rl === 'near' ? NEARC : OTHC));
    }

    for (q = 0; q < 3; q++) {
      var cc = ORD[q], rr = roleOf[cc], mv = st.means[cc], m = mean[q];
      if (mv === undefined) { m.g.setAttribute('visibility', 'hidden'); continue; }
      m.g.setAttribute('visibility', 'visible');
      var col = rr === 'own' ? OWNC : (rr === 'near' ? NEARC : OTHC);
      m.g.setAttribute('transform', 'translate(' + X(mv).toFixed(1) + ',' + LANEY[q] + ')');
      m.line.setAttribute('stroke', col);
      m.tri.setAttribute('fill', col);
      m.lab.setAttribute('fill', col);
      m.lab.textContent = rr === 'own' ? 'a' : (rr === 'near' ? 'b' : '');
    }

    gSelf.setAttribute('transform', 'translate(' + XA + ',' + LANEY[laneOf[st.own]] + ')');
    selNm.textContent = NM[selIx];

    while (tCalc.firstChild) tCalc.removeChild(tCalc.firstChild);
    if (st.a === null) {
      tCalc.appendChild(doc.createTextNode('구성원 1명 · 실루엣 0'));
      out.textContent = '구성원 1명 · s 0';
    } else {
      var sh = shown(st);
      tCalc.appendChild(doc.createTextNode(
        'a = ' + f3(sh.a) + ' · b = ' + f3(sh.b) + ' · (' + f3(sh.b) + ' − ' + f3(sh.a) + ') ÷ ' + f3(sh.big) + ' = '));
      var ts = mk('tspan', { fill: neg ? '#d64545' : '#1c2230', 'font-weight': 700 }, tCalc);
      ts.textContent = f3(sh.s);
      out.textContent = 'a ' + f3(sh.a) + ' · b ' + f3(sh.b) + ' · s ' + (sh.s >= 0 ? '+' : '') + f3(sh.s);
    }

    for (r = 0; r < 3; r++) {
      rowText[r].textContent = RUNS[r].row;
      rowRect[r].setAttribute('fill', r === runIx ? '#eef4fb' : '#fff');
      rowRect[r].setAttribute('stroke', r === runIx ? '#2b7fd6' : '#e3ddcf');
    }
    var btns = root.querySelectorAll('[data-run]');
    for (i = 0; i < btns.length; i++) btns[i].className = (+btns[i].getAttribute('data-run') === runIx) ? 'wbtn on' : 'wbtn';
  }

  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
    if (!b || !root.contains(b)) return;
    if (b.hasAttribute('data-run')) {
      var nr = +b.getAttribute('data-run');
      if (nr === runIx) return;
      runIx = nr; setAnim(true); render(); return;
    }
    setAnim(false);
    if (b.hasAttribute('data-jump')) {
      var od = RUNS[runIx].order;
      selIx = b.getAttribute('data-jump') === 'min' ? od[0] : od[od.length - 1];
      render(); return;
    }
    if (b.hasAttribute('data-nav')) {
      var o = RUNS[runIx].order, p = o.indexOf(selIx);
      p = (p + (+b.getAttribute('data-nav')) + o.length) % o.length;
      selIx = o[p]; render();
    }
  });

  setAnim(false);
  render();
}
  const WIDGET_INIT = {stdswitch: initW_stdswitch, ruler: initW_ruler, kpick: initW_kpick, sildist: initW_sildist};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
