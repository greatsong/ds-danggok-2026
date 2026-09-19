// 12차시 챌린지 베타 순위판 — 공개 순위와 최종 순위.
// 주소 뒤에 ?final=1 을 붙이면 최종 순위판이 된다. 수업 끝에 선생님이 화면에 띄운다.
(function () {
  var 설정 = window.APP_CONFIG || {};
  var 주소 = 설정.SUPABASE_URL, 키 = 설정.SUPABASE_KEY;
  var 정원 = 200, 고른반 = 'all';
  var 최종 = new URLSearchParams(location.search).get('final') === '1';
  var $ = function (id) { return document.getElementById(id); };
  var 앞 = 최종 ? 'final' : 'public';

  $('딱지').innerHTML = 최종
    ? '<span class="badge" style="background:var(--red);color:#fff">최종</span>'
    : '<span class="badge">공개</span>';
  $('설명').innerHTML = 최종
    ? '<div class="h">🏁 최종 순위판</div><p><b>최종 채점용 1,022명</b>으로 다시 매긴 순위입니다. ' +
      '공개 순위판에서 몇 위였는지도 함께 적었습니다. <b>순위가 내려간 팀은 공개 채점용에만 맞는 모델을 만든 것입니다.</b></p>'
    : '<div class="h">📣 공개 순위판</div><p><b>공개 채점용 1,022명</b>으로 매긴 순위입니다. ' +
      '최종 채점용 1,022명의 점수는 수업이 끝날 때 한 번만 공개합니다. ' +
      '<b>공개 점수만 보고 설정을 계속 고치면 공개 채점용에만 맞는 모델이 됩니다.</b></p>';
  if (최종) $('이동칸').textContent = '공개 순위';

  function 글자(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function 설정글(r) {
    return r.model + ' · 가중치 ' + (r.weighted ? '켬' : '끔') +
           (r.model !== '로지스틱 회귀' ? ' · 질문 ' + r.depth + '번' : '') +
           (r.model !== '의사결정트리' ? ' · 기준값 ' + Number(r.threshold).toFixed(2) : '') +
           ' · ' + r.features;
  }
  function 수(r, 무엇, 어느) { return r[(어느 || 앞) + '_' + 무엇]; }

  function 팀별(줄들, 어느) {
    var 표 = {};
    줄들.forEach(function (r) {
      var 열쇠 = r.class_id + '/' + r.team_name;
      var it = 표[열쇠] || (표[열쇠] = { 열쇠: 열쇠, 팀명: r.team_name, 반: r.class_id,
                                        제출: 0, 최고: null, 마지막: r.created_at });
      it.제출 += 1;
      if (r.created_at > it.마지막) it.마지막 = r.created_at;
      if (수(r, 'ok', 어느) && (!it.최고 || 수(r, 'found', 어느) > 수(it.최고, 'found', 어느))) it.최고 = r;
    });
    return Object.values(표).sort(function (a, b) {
      var A = a.최고 ? 수(a.최고, 'found', 어느) : -1, B = b.최고 ? 수(b.최고, 'found', 어느) : -1;
      return B - A || a.마지막.localeCompare(b.마지막);
    });
  }

  function 순위붙이기(목록, 어느) {
    var 앞점수 = null, 앞순위 = 0;
    목록.forEach(function (it, i) {
      var 점수 = it.최고 ? 수(it.최고, 'found', 어느) : null;
      it.순위 = (점수 === null) ? null : (점수 === 앞점수 ? 앞순위 : i + 1);
      if (점수 !== null) { 앞점수 = 점수; 앞순위 = it.순위; }
    });
    return 목록;
  }

  function 그리기(전체) {
    var 대상 = 고른반 === 'all' ? 전체 : 전체.filter(function (r) { return r.class_id === 고른반; });
    var 목록 = 순위붙이기(팀별(대상, 앞), 앞);
    var 공개순위 = {};
    if (최종) 순위붙이기(팀별(대상, 'public'), 'public')
      .forEach(function (it) { 공개순위[it.열쇠] = it.순위; });

    var 메달표 = ['🥇', '🥈', '🥉'];
    $('시상대').innerHTML = [0, 1, 2].map(function (i) {
      var it = 목록[i];
      if (!it || !it.최고) return '<div class="pod empty"><div class="medal">' + 메달표[i] +
        '</div><div class="who">비어 있습니다</div><div class="big">—</div></div>';
      var b = it.최고;
      return '<div class="pod' + (it.순위 === 1 ? ' first' : '') + '">' +
        '<div class="medal">' + (메달표[it.순위 - 1] || 메달표[2]) + '</div>' +
        '<div class="who">' + 글자(it.팀명) + '</div>' +
        '<div class="cls">' + 글자(it.반) + ' · 제출 ' + it.제출 + '번' +
          (최종 && 공개순위[it.열쇠] ? ' · 공개 ' + 공개순위[it.열쇠] + '위' : '') + '</div>' +
        '<div class="big">' + 수(b, 'found') + '<span>명</span></div>' +
        '<div class="set">안내 ' + 수(b, 'sent') + '명 · ' + 글자(설정글(b)) + '</div></div>';
    }).join('');

    $('s인원').textContent = 목록.length + '팀';
    $('s시도').textContent = 대상.length + '번';
    $('s최고').textContent = (목록[0] && 목록[0].최고) ? 수(목록[0].최고, 'found') + '명' : '—';
    $('s초과').textContent = 대상.filter(function (r) { return !수(r, 'ok'); }).length + '번';

    $('순위').innerHTML = 목록.map(function (it) {
      var b = it.최고;
      var 이동 = '';
      var 칸클래스 = '';
      if (최종 && b && 공개순위[it.열쇠]) {
        var 차 = 공개순위[it.열쇠] - it.순위;
        이동 = 차 > 0 ? '<span class="move u">▲ ' + 차 + '</span>'
             : 차 < 0 ? '<span class="move d">▼ ' + (-차) + '</span>'
             : '<span class="move s">—</span>';
        칸클래스 = 차 > 0 ? 'up' : (차 < 0 ? 'down' : '');
        이동 = '공개 ' + 공개순위[it.열쇠] + '위 ' + 이동;
      }
      return '<tr class="' + 칸클래스 + '">' +
        '<td class="rank">' + (b ? (메달표[it.순위 - 1] || it.순위) : '—') + '</td>' +
        '<td class="nick">' + 글자(it.팀명) + '<div class="set2">' + 글자(it.반) + '</div></td>' +
        '<td class="num">' + (b ? '<b>' + 수(b, 'found') + '명</b>' : '정원 초과') + '</td>' +
        '<td class="num">' + (b ? 수(b, 'sent') + '명' : '—') + '</td>' +
        '<td class="num hide">' + (b && 수(b, 'recall') != null ? Number(수(b, 'recall')).toFixed(4) : '—') + '</td>' +
        '<td class="num hide">' + (b && 수(b, 'f1') != null ? Number(수(b, 'f1')).toFixed(4) : '—') + '</td>' +
        '<td class="hide set2">' + (b ? 글자(설정글(b)) : '—') + '</td>' +
        '<td class="num">' + it.제출 + '</td>' +
        '<td class="num hide">' + 이동 + '</td></tr>';
    }).join('') || '<tr><td colspan="9" class="quiet">아직 올라온 기록이 없습니다.</td></tr>';

    function 점(줄, 이름, 색, 투명, 크기) {
      return { x: 줄.map(function (r) { return r.created_at; }),
               y: 줄.map(function (r) { return 수(r, 'found'); }),
               text: 줄.map(function (r) { return r.team_name + ' · ' + 설정글(r); }),
               hovertemplate: '%{text}<br>찾아낸 대상자 %{y}명<extra></extra>',
               mode: 'markers', type: 'scatter', name: 이름,
               marker: { size: 크기, color: 색, opacity: 투명, line: { width: 0 } } };
    }
    Plotly.react('plot', [
      점(대상.filter(function (r) { return !수(r, 'ok'); }), '정원 초과', '#9a8b6a', 0.35, 8),
      점(대상.filter(function (r) { return 수(r, 'ok'); }), '정원 안', 최종 ? '#e45756' : '#e8930c', 0.85, 11)
    ], {
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Apple SD Gothic Neo, sans-serif', color: '#6b5836', size: 12 },
      margin: { l: 52, r: 16, t: 10, b: 44 },
      xaxis: { title: '올린 시각', gridcolor: '#f7edcf', tickformat: '%H:%M' },
      yaxis: { title: '찾아낸 대상자(명)', rangemode: 'tozero', gridcolor: '#f7edcf' },
      legend: { orientation: 'h', y: 1.15, x: 0 }
    }, { displayModeBar: false, responsive: true });
  }

  function 읽기() {
    if (!주소 || !키) { $('상태').textContent = '설정이 없어 순위판을 열 수 없습니다.'; $('불').className = 'dot off'; return; }
    fetch(주소 + '/rest/v1/challenge_beta?select=*&order=created_at.asc&limit=3000',
          { headers: { apikey: 키, Authorization: 'Bearer ' + 키 } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (줄들) {
        $('불').className = 'dot';
        $('상태').textContent = '5초마다 새로 읽습니다 · ' + new Date().toLocaleTimeString('ko-KR');
        그리기(줄들);
      })
      .catch(function (e) {
        $('불').className = 'dot off';
        $('상태').textContent = (e.message === '404')
          ? '순위판이 아직 열리지 않았습니다. 선생님이 challenge/beta_schema.sql을 한 번 실행하면 열립니다.'
          : '읽지 못했습니다 (' + e.message + ')';
      });
  }

  $('반').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call(this.querySelectorAll('button'), function (x) { x.classList.remove('on'); });
    b.classList.add('on'); 고른반 = b.dataset.v; 읽기();
  });
  읽기();
  setInterval(읽기, 5000);
})();
