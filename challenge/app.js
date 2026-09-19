// 12차시 성능 높이기 챌린지 순위판 — 수파베이스에서 읽어 순위와 이력을 그린다.
// 설정은 갤러리와 같은 파일(../gallery/config.js)을 사용한다. 공개용 키만 들어 있다.
(function () {
  var 설정 = window.APP_CONFIG || {};
  var 주소 = 설정.SUPABASE_URL, 키 = 설정.SUPABASE_KEY;
  var 정원 = 500, 기본기록 = 67;
  var 상태 = document.getElementById('상태');

  function 시각(문자열) {
    var d = new Date(문자열);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }

  function 설정글(r) {
    return r.inputs + ' · 가중치 ' + (r.weighted ? '켬' : '끔') +
           ' · 질문 ' + r.depth + '번 · 기준값 ' + Number(r.threshold).toFixed(2) +
           (r.missing === '지운다' ? ' · 빈 값 지움' : '');
  }

  function 그리기(줄들) {
    var 반 = document.getElementById('반').value;
    var 대상 = 반 === 'all' ? 줄들 : 줄들.filter(function (r) { return r.class_id === 반; });

    // 별명+반마다 최고 기록과 시도 횟수
    var 사람 = {};
    대상.forEach(function (r) {
      var 열쇠 = r.class_id + '/' + r.nickname;
      var it = 사람[열쇠] || (사람[열쇠] = { 별명: r.nickname, 반: r.class_id, 시도: 0, 최고: null, 마지막: r.created_at });
      it.시도 += 1;
      if (r.created_at > it.마지막) it.마지막 = r.created_at;
      if (r.within_quota && (!it.최고 || r.found > it.최고.found)) it.최고 = r;
    });
    var 목록 = Object.values(사람).sort(function (a, b) {
      var A = a.최고 ? a.최고.found : -1, B = b.최고 ? b.최고.found : -1;
      return B - A || a.마지막.localeCompare(b.마지막);
    });

    document.getElementById('s인원').textContent = 목록.length + '명';
    document.getElementById('s시도').textContent = 대상.length + '번';
    document.getElementById('s최고').textContent = (목록[0] && 목록[0].최고)
      ? 목록[0].최고.found + '명 · ' + 목록[0].별명 : '—';

    var 몸 = document.getElementById('순위');
    몸.innerHTML = 목록.map(function (it, i) {
      var b = it.최고;
      return '<tr' + (b && b.found >= 기본기록 + 1 ? ' class="top"' : '') + '>' +
        '<td class="num">' + (b ? i + 1 : '—') + '</td>' +
        '<td>' + 글자(it.별명) + '</td><td>' + it.반 + '</td>' +
        '<td class="num">' + (b ? b.found + '명' : '정원 초과') + '</td>' +
        '<td class="num">' + (b ? b.sent.toLocaleString() + '명' : '—') + '</td>' +
        '<td class="num">' + (b && b.recall != null ? Number(b.recall).toFixed(4) : '—') + '</td>' +
        '<td class="quiet">' + (b ? 글자(설정글(b)) : '—') + '</td>' +
        '<td class="num">' + it.시도 + '</td><td class="num">' + 시각(it.마지막) + '</td></tr>';
    }).join('') || '<tr><td colspan="9" class="quiet">아직 올라온 기록이 없습니다.</td></tr>';

    // 이력 그래프
    var 통과 = 대상.filter(function (r) { return r.within_quota; });
    var 초과 = 대상.filter(function (r) { return !r.within_quota; });
    function 점(줄, 이름, 색, 투명) {
      return {
        x: 줄.map(function (r) { return r.created_at; }),
        y: 줄.map(function (r) { return r.found; }),
        text: 줄.map(function (r) { return r.nickname + ' · 안내 ' + r.sent + '명'; }),
        mode: 'markers', type: 'scatter', name: 이름,
        marker: { size: 9, color: 색, opacity: 투명 }
      };
    }
    Plotly.react('plot', [점(통과, '정원 안', '#2563eb', 0.8), 점(초과, '정원 초과', '#94a3b8', 0.35)], {
      margin: { l: 48, r: 16, t: 16, b: 44 },
      xaxis: { title: '올린 시각' }, yaxis: { title: '찾아낸 환자(명)', rangemode: 'tozero' },
      shapes: [{ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: 기본기록, y1: 기본기록,
                 line: { color: '#e8930c', width: 2, dash: 'dot' } }],
      annotations: [{ xref: 'paper', x: 0.01, y: 기본기록, text: '수업 기본 ' + 기본기록 + '명',
                      showarrow: false, yshift: 12, font: { size: 11, color: '#e8930c' } }],
      legend: { orientation: 'h', y: 1.12 }
    }, { displayModeBar: false, responsive: true });
  }

  function 글자(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function 읽기() {
    if (!주소 || !키) { 상태.textContent = '설정이 없어 순위판을 열 수 없습니다.'; return; }
    상태.textContent = '읽는 중…';
    fetch(주소 + '/rest/v1/challenge_log?select=*&order=created_at.asc&limit=2000',
          { headers: { apikey: 키, Authorization: 'Bearer ' + 키 } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (줄들) {
        상태.textContent = '마지막으로 읽은 시각 ' + new Date().toLocaleTimeString('ko-KR');
        그리기(줄들);
      })
      .catch(function (e) {
        상태.textContent = (e.message === '404')
          ? '순위판이 아직 열리지 않았습니다. 선생님이 challenge/schema.sql을 한 번 실행하면 열립니다.'
          : '읽지 못했습니다 (' + e.message + ')';
      });
  }

  document.getElementById('새로').addEventListener('click', 읽기);
  document.getElementById('반').addEventListener('change', 읽기);
  읽기();
  setInterval(읽기, 5000);
})();
