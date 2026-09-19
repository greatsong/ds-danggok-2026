// 11·12차시(분류 · 뇌졸중) 경계 위젯 — 교재 lesson11.html과 lesson12.html이 함께 사용한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.STROKE_DATA.

function 격자최대(것) {   // 그림 안에서 가장 높은 확률. 앱 화면과 같은 값이다
  return (것.pmax_grid === undefined || 것.pmax_grid === null) ? 것.pmax : 것.pmax_grid;
}
// 데이터는 assets/stroke_data.js(scripts/lesson11_12_stroke_widgets.py가 다시 쓴다)에서 온다.
// plotly는 이 파일 뒤에서 불린다. 준비되지 않으면 안내 문장만 표시한다.
(function () {
  'use strict';

  var 붉은색 = '#d64545', 회색 = '#9aa0ad', 남색 = '#1c2230', 흐린글 = '#6b7385';
  var 파란색 = '#2b7fd6', 금색 = '#b07a00';
  var FONT = { family: 'inherit', size: 12, color: '#3a2e1a' };
  // 3차원 그림의 축 이름은 WebGL 화면에 직접 그려진다. 'inherit'로는 한글이 나오지 않으므로 글꼴을 적어 준다.
  var FONT3D = { family: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", Roboto, sans-serif', size: 12, color: '#3a2e1a' };
  var BASE = { displayModeBar: false, responsive: true };

  function 읽기() { return window.STROKE_DATA || null; }

  // ── 점 나누기 ────────────────────────────────────────────────
  // 5,110명을 전부 그린다. 뇌졸중은 붉은색, 아닌 사람은 회색 반투명이다.
  function 점묶음(D, 축1, 축2, bmi있는것만) {
    var P = D.points, 값 = { age: P.age, glu: P.glu, bmi: P.bmi };
    var 환자 = { x: [], y: [], t: [] }, 아님 = { x: [], y: [], t: [] };
    for (var i = 0; i < P.n; i++) {
      var a = 값[축1][i], b = 값[축2][i];
      if (a === null || b === null) continue;
      if (bmi있는것만 && P.bmi[i] === null) continue;
      var 통 = P.y[i] === 1 ? 환자 : 아님;
      통.x.push(a); 통.y.push(b);
      통.t.push(P.age[i] + '세 · 혈당 ' + P.glu[i] + (P.bmi[i] === null ? '' : ' · 체질량 ' + P.bmi[i]));
    }
    return { 환자: 환자, 아님: 아님 };
  }

  function 산점도(묶음, 이름1, 이름2) {
    var 틀 = {
      type: 'scatter', mode: 'markers',
      hovertemplate: '%{text}<br>' + 이름1 + ' %{x} · ' + 이름2 + ' %{y}<extra></extra>'
    };
    return [
      Object.assign({}, 틀, {
        x: 묶음.아님.x, y: 묶음.아님.y, text: 묶음.아님.t, name: '뇌졸중 없음',
        marker: { size: 4, color: 회색, opacity: 0.3 }
      }),
      Object.assign({}, 틀, {
        x: 묶음.환자.x, y: 묶음.환자.y, text: 묶음.환자.t, name: '뇌졸중 있음',
        marker: { size: 5.5, color: 붉은색, opacity: 0.85 }
      })
    ];
  }

  // ── 0.5 경계선을 그림 안으로 자른다 ───────────────────────────
  // 경계선은 혈당 = a + b × 나이다. 그림 밖이면 null을 돌려준다.
  function 경계선(선, 나이축, 혈당축) {
    if (!선) return null;
    var 점 = [];
    [나이축[0], 나이축[1]].forEach(function (x) {
      var y = 선.a + 선.b * x;
      if (y >= 혈당축[0] && y <= 혈당축[1]) 점.push([x, y]);
    });
    [혈당축[0], 혈당축[1]].forEach(function (y) {
      if (Math.abs(선.b) < 1e-9) return;
      var x = (y - 선.a) / 선.b;
      if (x >= 나이축[0] && x <= 나이축[1]) 점.push([x, y]);
    });
    if (점.length < 2) return null;
    점.sort(function (p, q) { return p[0] - q[0]; });
    var 앞 = 점[0], 뒤 = 점[점.length - 1];
    if (Math.abs(앞[0] - 뒤[0]) < 1e-6 && Math.abs(앞[1] - 뒤[1]) < 1e-6) return null;
    return { x: [앞[0], 뒤[0]], y: [앞[1], 뒤[1]] };
  }

  function 등고선(D, 격자, 색, 이름) {
    return {
      type: 'contour', x: D.grid.age, y: D.grid.glu, z: 격자,
      name: 이름, showscale: false, hoverinfo: 'skip', showlegend: true,
      contours: { coloring: 'lines', start: 0.1, end: 0.9, size: 0.1, showlabels: true,
                  labelfont: { size: 10, color: 색 } },
      line: { width: 1.6, color: 색 }, colorscale: [[0, 색], [1, 색]]
    };
  }

  // ── 전체 화면 ────────────────────────────────────────────────
  // figure 상자를 통째로 전체 화면으로 하고 plotly를 다시 그린다. 나갈 때 원래 크기로 돌린다.
  function 전체화면붙이기(root, host, 다시그리기) {
    var 상자 = root.closest('figure') || root;
    var 버튼 = root.querySelector('[data-act="full"]');
    if (!버튼) return;
    var 들어갈수있나 = !!(상자.requestFullscreen || 상자.webkitRequestFullscreen);
    if (!들어갈수있나) { 버튼.style.display = 'none'; return; }

    버튼.addEventListener('click', function () {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        (상자.requestFullscreen || 상자.webkitRequestFullscreen).call(상자);
      }
    });

    function 바뀜() {
      var 지금 = document.fullscreenElement || document.webkitFullscreenElement;
      var 안에있다 = 지금 === 상자;
      상자.classList.toggle('fullwide', 안에있다);
      상자.style.background = 안에있다 ? '#fff' : '';
      상자.style.padding = 안에있다 ? '18px 22px' : '';
      상자.style.overflow = 안에있다 ? 'auto' : '';
      host.style.height = 안에있다 ? 'calc(100vh - 200px)' : '';
      버튼.textContent = 안에있다 ? '전체 화면 나가기' : '전체 화면';
      버튼.classList.toggle('on', 안에있다);
      if (typeof window.Plotly !== 'undefined' && host.data) {
        window.Plotly.Plots.resize(host);
      }
      if (다시그리기) 다시그리기();
    }
    document.addEventListener('fullscreenchange', 바뀜);
    document.addEventListener('webkitfullscreenchange', 바뀜);
  }

  function 토글붙이기(root, 고르기) {
    var 버튼들 = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-act]'))
      .filter(function (b) { return b.dataset.act !== 'full'; });
    버튼들.forEach(function (b) {
      b.addEventListener('click', function () {
        버튼들.forEach(function (x) {
          if (x.dataset.group !== b.dataset.group) return;
          x.classList.toggle('on', x === b);
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        고르기(b.dataset.act, b.dataset.group);
      });
    });
  }

  function plotly기다리기(그리기, 안내) {
    (function 기다림(n) {
      if (typeof window.Plotly !== 'undefined') { 그리기(); return; }
      if (n > 40) { 안내(); return; }
      setTimeout(function () { 기다림(n + 1); }, 100);
    })(0);
  }

  function 숫자(v, 자리) { return v === null || v === undefined ? '—' : v.toFixed(자리 === undefined ? 4 : 자리); }

  // ══ boundary2d — 11차시 4절 ═══════════════════════════════════
  // 확률 모델의 등고선과 질문 모델의 직사각형을 같은 산점도 위에 번갈아 올린다.
  function initW_boundary2d(root, D) {
    if (!D) return;
    var host = root.querySelector('.plot');
    var 알림 = root.querySelector('[data-t="out"]');
    var 규칙칸 = root.querySelector('[data-t="rules"]');
    var 묶음 = 점묶음(D, 'age', 'glu', false);
    var 나이축 = D.axis.age, 혈당축 = D.axis.glu;
    var 모드 = 'prob';

    function 안내() { if (알림) 알림.textContent = '그래프를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로 고침 합니다.'; }

    function 그리기() {
      if (typeof window.Plotly === 'undefined') { 안내(); return; }
      var 자취 = 산점도(묶음, '나이', '혈당');
      var 도형 = [], 글상자 = [];
      var 배치 = {
        margin: { l: 58, r: 16, t: 66, b: 46 }, font: FONT, hovermode: 'closest',
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        legend: { orientation: 'h', y: 1.01, yanchor: 'bottom', x: 0, font: { size: 12 } },
        xaxis: { title: '나이(세)', range: [나이축[0] - 1, 나이축[1] + 1], zeroline: false },
        yaxis: { title: '평균 혈당', range: [혈당축[0] - 4, 혈당축[1] + 4], zeroline: false }
      };

      if (모드 === 'prob') {
        var 앞 = D.d2.plain;
        자취.unshift(등고선(D, 앞.z, 파란색, '뇌졸중이라고 본 확률'));
        var 선 = 경계선(앞.line, 나이축, 혈당축);
        if (선) {
          자취.push({ x: 선.x, y: 선.y, type: 'scatter', mode: 'lines', name: '0.5 경계선',
                      line: { color: 남색, width: 3 }, hoverinfo: 'skip' });
        } else {
          글상자.push({ x: 0.02, y: 0.97, xref: 'paper', yref: 'paper', xanchor: 'left',
                        text: '이 그림 안에서 확률이 가장 높은 자리도 ' + 격자최대(앞).toFixed(2) + '입니다<br>0.5 경계선이 그림 밖에 있습니다',
                        showarrow: false, align: 'left', bgcolor: 'rgba(255,255,255,0.88)',
                        bordercolor: 금색, borderwidth: 1.2, borderpad: 6,
                        font: { size: 12.5, color: 금색 } });
        }
        if (알림) {
          알림.textContent = '등고선은 0.1씩 그린 확률의 층입니다. 채점용 1,533명 가운데 가장 높은 확률이 '
            + 앞.pmax.toFixed(4) + '입니다. 정확도는 ' + 숫자(앞.acc) + '입니다.';
        }
      } else {
        var 나무 = D.d2.tree;
        // 직사각형이 좁아 질문 문장을 칸 안에 넣으면 서로 겹친다. 칸에는 번호만 넣고 문장은 아래에 적는다.
        var 번호표 = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
        나무.rects.forEach(function (r, i) {
          도형.push({ type: 'rect', x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1,
                      line: { color: r.cls === 1 ? 붉은색 : '#c9c2b2', width: r.cls === 1 ? 2.4 : 1 },
                      fillcolor: r.cls === 1 ? 'rgba(214,69,69,0.2)' : 'rgba(43,127,214,' + (0.03 + r.p * 0.5).toFixed(3) + ')',
                      layer: 'below' });
          글상자.push({ x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2,
                        text: '<b>' + 번호표[i] + '</b>', showarrow: false,
                        font: { size: 15, color: r.cls === 1 ? 붉은색 : 흐린글 },
                        bgcolor: 'rgba(255,255,255,0.85)', borderpad: 2 });
        });
        if (규칙칸) {
          규칙칸.innerHTML = 나무.rects.map(function (r, i) {
            return '<li><b>' + 번호표[i] + '</b> ' + r.q + ' → <b style="color:'
              + (r.cls === 1 ? 붉은색 : 흐린글) + '">' + (r.cls === 1 ? '뇌졸중' : '아님')
              + '</b> · 훈련용 ' + r.n.toLocaleString() + '명 가운데 환자 ' + r.pos + '명</li>';
          }).join('');
        }
        if (알림) {
          알림.textContent = '질문 모델은 두 축을 직사각형 ' + 나무.rects.length
            + '개로 나눕니다. 붉은 테두리 칸 하나만 뇌졸중이라고 답하는 자리입니다. 정확도는 '
            + 숫자(나무.acc) + '입니다.';
        }
      }
      if (규칙칸) 규칙칸.style.display = 모드 === 'tree' ? '' : 'none';
      배치.shapes = 도형;
      배치.annotations = 글상자;
      window.Plotly.react(host, 자취, 배치, BASE);
    }

    토글붙이기(root, function (act) { 모드 = act; 그리기(); });
    전체화면붙이기(root, host, function () { if (host.data) 그리기(); });
    plotly기다리기(그리기, 안내);
  }

  // ══ boundaryShift — 12차시 4절 ════════════════════════════════
  // 가중치를 맞추기 전과 뒤의 경계가 어디로 움직이는지 2D와 3D로 본다.
  function initW_boundaryShift(root, D) {
    if (!D) return;
    var host = root.querySelector('.plot');
    var 알림 = root.querySelector('[data-t="out"]');
    var 묶음 = 점묶음(D, 'age', 'glu', false);
    var 나이축 = D.axis.age, 혈당축 = D.axis.glu;
    var 상태 = 'before';

    function 안내() { if (알림) 알림.textContent = '그래프를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로 고침 합니다.'; }

    function 그리기() {
      if (typeof window.Plotly === 'undefined') { 안내(); return; }
      var 것 = 상태 === 'before' ? D.d2.plain : D.d2.bal;
      var 색 = 상태 === 'before' ? 파란색 : 금색;
      var 자취 = 산점도(묶음, '나이', '혈당');
      자취.unshift(등고선(D, 것.z, 색, 상태 === 'before' ? '가중치 맞추기 전 확률' : '가중치 맞춘 뒤 확률'));
      var 글상자 = [];
      var 선 = 경계선(것.line, 나이축, 혈당축);
      if (선) {
        자취.push({ x: 선.x, y: 선.y, type: 'scatter', mode: 'lines', name: '0.5 경계선',
                    line: { color: 남색, width: 3 }, hoverinfo: 'skip' });
      } else {
        글상자.push({ x: 0.02, y: 0.97, xref: 'paper', yref: 'paper', xanchor: 'left',
                      text: '이 그림 안에서 확률이 가장 높은 자리도 ' + 격자최대(것).toFixed(2) + '입니다<br>0.5 경계선이 그림 밖에 있습니다',
                      showarrow: false, align: 'left', bgcolor: 'rgba(255,255,255,0.88)',
                      bordercolor: 금색, borderwidth: 1.2, borderpad: 6,
                      font: { size: 12.5, color: 금색 } });
      }
      window.Plotly.react(host, 자취, {
        margin: { l: 58, r: 16, t: 66, b: 46 }, font: FONT, hovermode: 'closest',
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        legend: { orientation: 'h', y: 1.01, yanchor: 'bottom', x: 0, font: { size: 12 } },
        xaxis: { title: '나이(세)', range: [나이축[0] - 1, 나이축[1] + 1], zeroline: false },
        yaxis: { title: '평균 혈당', range: [혈당축[0] - 4, 혈당축[1] + 4], zeroline: false },
        annotations: 글상자
      }, BASE);
      if (알림) {
        알림.textContent = (상태 === 'before' ? '가중치를 맞추기 전' : '가중치를 맞춘 뒤')
          + ' · 정확도 ' + 숫자(것.acc) + ' · 찾아낸 환자 ' + 것.tp + '명 · 놓친 환자 ' + 것.fn
          + '명 · 헛짚은 사람 ' + 것.fp + '명';
      }
    }

    토글붙이기(root, function (act) { 상태 = act; 그리기(); });
    전체화면붙이기(root, host, function () { if (host.data) 그리기(); });
    plotly기다리기(그리기, 안내);
  }

  // ══ plane3d — 12차시 4절 접힘 ═════════════════════════════════
  // 체질량지수를 한 축 더해 세 축으로 본다. 0.5 평면이 어디에 놓이는지 돌려 본다.
  function initW_strokePlane3d(root, D) {
    if (!D) return;
    var host = root.querySelector('.plot');
    var 알림 = root.querySelector('[data-t="out"]');
    var P = D.points;
    var 나이축 = D.axis.age, 혈당축 = D.axis.glu, 체질량축 = D.axis.bmi;
    var 상태 = 'before', 그린적있나 = false;

    var 환자 = { x: [], y: [], z: [] }, 아님 = { x: [], y: [], z: [] };
    for (var i = 0; i < P.n; i++) {
      if (P.bmi[i] === null) continue;
      var 통 = P.y[i] === 1 ? 환자 : 아님;
      통.x.push(P.age[i]); 통.y.push(P.glu[i]); 통.z.push(P.bmi[i]);
    }

    function 안내() { if (알림) 알림.textContent = '그래프를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로 고침 합니다.'; }

    // 0.5 평면: 체질량 = A + B × 나이 + C × 혈당.
    // 격자로 그리면 상자 안에 남는 칸이 얇은 띠가 되어 평면으로 보이지 않는다.
    // 그래서 평면과 상자가 만나는 다각형을 직접 구해 삼각형으로 채운다.
    function 평면다각형(면) {
      // 면을 k0 + k1×나이 + k2×혈당 + k3×체질량 = 0 꼴로 옮긴다
      var k0 = -면.A, k1 = -면.B, k2 = -면.C, k3 = 1;
      var X = 나이축, Y = 혈당축, Z = 체질량축;
      function 값(p) { return k0 + k1 * p[0] + k2 * p[1] + k3 * p[2]; }
      var 꼭짓점 = [];
      [X[0], X[1]].forEach(function (x) {
        [Y[0], Y[1]].forEach(function (y) {
          [Z[0], Z[1]].forEach(function (z) { 꼭짓점.push([x, y, z]); });
        });
      });
      var 모서리 = [];
      for (var a = 0; a < 8; a++) {
        for (var b = a + 1; b < 8; b++) {
          var 다른 = 0;
          for (var c = 0; c < 3; c++) if (꼭짓점[a][c] !== 꼭짓점[b][c]) 다른++;
          if (다른 === 1) 모서리.push([꼭짓점[a], 꼭짓점[b]]);
        }
      }
      var 만난점 = [];
      모서리.forEach(function (e) {
        var f0 = 값(e[0]), f1 = 값(e[1]);
        if (f0 === f1) return;
        var t = f0 / (f0 - f1);
        if (t < 0 || t > 1) return;
        만난점.push([e[0][0] + t * (e[1][0] - e[0][0]),
                     e[0][1] + t * (e[1][1] - e[0][1]),
                     e[0][2] + t * (e[1][2] - e[0][2])]);
      });
      if (만난점.length < 3) return null;

      // 평면 위에서 가운데를 중심으로 각도 순으로 늘어놓아야 삼각형이 꼬이지 않는다
      var 가운데 = [0, 1, 2].map(function (c) {
        return 만난점.reduce(function (s2, p2) { return s2 + p2[c]; }, 0) / 만난점.length;
      });
      var 법선 = [k1, k2, k3];
      var 기준 = Math.abs(법선[0]) < Math.abs(법선[2]) ? [1, 0, 0] : [0, 0, 1];
      function 외적(u, v) {
        return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      }
      function 단위(u) {
        var L = Math.hypot(u[0], u[1], u[2]) || 1;
        return [u[0] / L, u[1] / L, u[2] / L];
      }
      // 축마다 크기가 달라 각도가 비뚤어지지 않도록 축 길이로 나눈 자리에서 각도를 구한다
      var 폭 = [X[1] - X[0] || 1, Y[1] - Y[0] || 1, Z[1] - Z[0] || 1];
      var u축 = 단위(외적(법선, 기준)), v축 = 단위(외적(법선, u축));
      만난점.sort(function (p2, q2) {
        function 각(r) {
          var d = [(r[0] - 가운데[0]) / 폭[0], (r[1] - 가운데[1]) / 폭[1], (r[2] - 가운데[2]) / 폭[2]];
          return Math.atan2(d[0] * v축[0] + d[1] * v축[1] + d[2] * v축[2],
                            d[0] * u축[0] + d[1] * u축[1] + d[2] * u축[2]);
        }
        return 각(p2) - 각(q2);
      });
      var i2 = [], j2 = [], k2i = [];
      for (var t2 = 1; t2 < 만난점.length - 1; t2++) { i2.push(0); j2.push(t2); k2i.push(t2 + 1); }
      return { x: 만난점.map(function (p2) { return p2[0]; }),
               y: 만난점.map(function (p2) { return p2[1]; }),
               z: 만난점.map(function (p2) { return p2[2]; }),
               i: i2, j: j2, k: k2i };
    }

    function 그리기() {
      if (typeof window.Plotly === 'undefined') { 안내(); return; }
      var 것 = 상태 === 'before' ? D.d3.plain : D.d3.bal;
      var 색 = 상태 === 'before' ? 파란색 : 금색;
      var 면 = 평면다각형(것.plane);
      var 자취 = [
        { x: 아님.x, y: 아님.y, z: 아님.z, type: 'scatter3d', mode: 'markers', name: '뇌졸중 없음',
          marker: { size: 1.8, color: 회색, opacity: 0.3 },
          hovertemplate: '나이 %{x}세 · 혈당 %{y} · 체질량 %{z}<extra></extra>' },
        { x: 환자.x, y: 환자.y, z: 환자.z, type: 'scatter3d', mode: 'markers', name: '뇌졸중 있음',
          marker: { size: 2.8, color: 붉은색, opacity: 0.9 },
          hovertemplate: '나이 %{x}세 · 혈당 %{y} · 체질량 %{z}<extra></extra>' }
      ];
      if (면) {
        자취.push({ x: 면.x, y: 면.y, z: 면.z, i: 면.i, j: 면.j, k: 면.k, type: 'mesh3d',
                    name: '0.5 평면', color: 색, opacity: 0.45, flatshading: true,
                    hoverinfo: 'skip', showlegend: true, showscale: false });
      }
      window.Plotly.react(host, 자취, {
        margin: { l: 0, r: 0, t: 40, b: 0 }, font: FONT3D, paper_bgcolor: 'rgba(0,0,0,0)',
        legend: { orientation: 'h', y: 1.0, yanchor: 'bottom', x: 0, font: { size: 12 } },
        scene: {
          // 세 축의 단위가 서로 달라 그대로 두면 한 축이 납작해진다. 정육면체로 맞춘다.
          aspectmode: 'cube',
          xaxis: { title: '나이(세)' }, yaxis: { title: '평균 혈당' }, zaxis: { title: '체질량지수' },
          camera: { eye: { x: 1.75, y: -1.75, z: 0.95 } }
        }
      }, BASE);
      그린적있나 = true;
      if (알림) {
        알림.textContent = (상태 === 'before' ? '가중치를 맞추기 전' : '가중치를 맞춘 뒤')
          + ' · 정확도 ' + 숫자(것.acc) + ' · 찾아낸 환자 ' + 것.tp + '명 · 놓친 환자 ' + 것.fn + '명'
          + (면 ? '' : ' · 확률이 ' + 것.pmax.toFixed(2) + '을 넘는 사람이 없어 0.5 평면이 그림 밖에 있습니다');
      }
    }

    토글붙이기(root, function (act) { 상태 = act; 그리기(); });
    전체화면붙이기(root, host, function () { if (그린적있나) 그리기(); });

    // 접힘 상자 안에 있으면 펼칠 때 그린다. 숨어 있는 동안 그리면 크기가 0이 된다.
    var 접힘 = root.closest('details');
    if (접힘 && !접힘.open) {
      접힘.addEventListener('toggle', function () {
        if (접힘.open && !그린적있나) plotly기다리기(그리기, 안내);
        else if (접힘.open && typeof window.Plotly !== 'undefined') window.Plotly.Plots.resize(host);
      });
    } else {
      plotly기다리기(그리기, 안내);
    }
  }

  var WIDGET_INIT = { boundary2d: initW_boundary2d, boundaryShift: initW_boundaryShift, strokePlane3d: initW_strokePlane3d };
  function initStrokeWidgets(scope) {
    (scope || document).querySelectorAll('.widget[data-w]').forEach(function (el) {
      if (el.dataset.ready) return;
      var f = WIDGET_INIT[el.dataset.w];
      if (f) { f(el, 읽기()); el.dataset.ready = '1'; }
    });
  }
  window.initStrokeWidgets = initStrokeWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initStrokeWidgets(); });
  else initStrokeWidgets();
})();
