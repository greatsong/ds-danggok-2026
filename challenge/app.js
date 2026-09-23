// 12차시 성능 높이기 챌린지 순위판 — 수파베이스에서 읽어 시상대·순위·이력을 그린다.
// 설정은 갤러리와 같은 파일(../gallery/config.js)을 사용한다. 공개용 키만 들어 있다.
(function () {
  var 설정 = window.APP_CONFIG || {};
  var 주소 = 설정.SUPABASE_URL, 키 = 설정.SUPABASE_KEY;
  var 정원 = 500, 기본기록 = 67, 대상자 = 82;
  var 고른반 = 'all', 고른목표 = '정원', 지난최고 = {}, 첫판 = true;
  var 목표이름 = { '정확도': '정확도', '재현율': '재현율', '정밀도': '정밀도', 'F1': 'F1',
                  '정원': '정원 500명 안에서 찾아낸 환자' };
  var 교사용 = (window.CHALLENGE_MODE === 'teacher');   // 교사용에서만 설정과 확인 결과를 보여 준다
  var $ = function (id) { return document.getElementById(id); };

  // ── 올라온 기록이 실제로 나올 수 있는 값인지 정답표와 대조한다 ──────────
  var 속성번호 = { '나이': 0, '평균 혈당': 1, '체질량지수': 2, '고혈압': 3, '심장병': 4 };

  function 열쇠(r) {
    var 번호 = r.inputs.split(' · ').map(function (x) { return 속성번호[x.trim()]; });
    if (번호.some(function (n) { return n === undefined; })) return null;
    번호.sort(function (a, b) { return a - b; });
    // 앱이 보내는 이름은 정식 이름(로지스틱 회귀·의사결정트리)이다. 옛 기록의 교재 이름도 함께 받는다
    var 이름 = r.model || '';
    var 모델 = (이름.indexOf('로지스틱') >= 0 || 이름.indexOf('확률') >= 0) ? 'L' : 'T';
    return (r.missing === '지운다' ? '1' : '0') + (r.weighted ? '1' : '0') +
           번호.join('') + 모델 + (모델 === 'T' ? String(r.depth) : '');
  }

  function 확인(r) {
    var K = window.CHALLENGE_KEY;
    if (!K) return null;                                 // 정답표가 없으면 판정하지 않는다
    var k = 열쇠(r);
    var 줄 = k && K.key[k];
    if (!줄) return false;
    var 자리 = Math.round(Number(r.threshold) / 0.05) - 1;   // 기준값 0.05~0.95가 차례로 들어 있다
    var 정답 = 줄[자리];
    if (정답 && 정답[0] === r.sent && 정답[1] === r.found) return true;
    // 트리에 기준값을 쓰기 전(2026-09-23 전)의 기록은 기준값과 상관없이 채점됐다
    var 옛것 = k.slice(-1) !== 'L' && K.key[k.replace(/T(\d+)$/, 'P$1')];
    return !!(옛것 && 옛것[0] === r.sent && 옛것[1] === r.found);
  }

  function 목표(r) { return r.goal || '정원'; }         // 목표 칸이 생기기 전의 기록은 정원 목표다

  function 지표값(r, 이름) {                           // 올라온 값 대신 안내 인원·찾아낸 환자로 다시 계산한다
    var K = window.CHALLENGE_KEY, 머리 = K && K.head[r.missing === '지운다' ? '1' : '0'];
    if (!머리) return r[{ '정확도': 'accuracy', '재현율': 'recall', '정밀도': 'precision', 'F1': 'f1' }[이름]];
    var TP = r.found, FP = r.sent - r.found, FN = 머리.pos - r.found, TN = 머리.n - 머리.pos - FP;
    var 정밀도 = r.sent ? TP / r.sent : null, 재현율 = TP / 머리.pos;
    if (이름 === '정확도') return (TP + TN) / 머리.n;
    if (이름 === '재현율') return 재현율;
    if (이름 === '정밀도') return 정밀도;
    return (정밀도 && 정밀도 + 재현율 > 0) ? 2 * 정밀도 * 재현율 / (정밀도 + 재현율) : null;
  }

  function 점수(r) {                                    // 고른 목표의 점수. 정원 목표는 찾아낸 환자 수
    return 고른목표 === '정원' ? r.found : 지표값(r, 고른목표);
  }
  function 점수글(r) {
    var v = 점수(r);
    return 고른목표 === '정원' ? v + '명' : (v == null ? '—' : Number(v).toFixed(4));
  }

  function 앞서나(a, b) {                               // 점수가 높을수록 앞선다. 같으면 먼저 올린 기록이 앞선다
    var A = 점수(a), B = 점수(b);
    A = A == null ? -1 : A; B = B == null ? -1 : B;
    return (A - B) || b.created_at.localeCompare(a.created_at);
  }

  function 글자(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function 시각(t) {
    return new Date(t).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  function 지표(r, 이름) {                             // 표에 적는 네 지표도 안내 인원·찾아낸 환자로 다시 계산한다
    if (!r) return '—';
    var v = 지표값(r, { accuracy: '정확도', recall: '재현율', precision: '정밀도', f1: 'F1' }[이름]);
    return v != null ? Number(v).toFixed(4) : '—';
  }
  function 모델글(r) {
    return r.model || '';
  }

  function 설정글(r) {
    return r.inputs + ' · 가중치 ' + (r.weighted ? '켬' : '끔') +
           ' · 질문 ' + r.depth + '번 · 기준값 ' + Number(r.threshold).toFixed(2) +
           (r.missing === '지운다' ? ' · 빈 값 지움' : '');
  }

  function 사람별(줄들) {
    var 표 = {};
    줄들.forEach(function (r) {
      var 열쇠 = r.class_id + '/' + r.nickname;
      var it = 표[열쇠] || (표[열쇠] = { 열쇠: 열쇠, 팀명: r.nickname, 반: r.class_id,
                                        시도: 0, 의심: 0, 최고: null, 마지막: r.created_at });
      it.시도 += 1;
      if (r.created_at > it.마지막) it.마지막 = r.created_at;
      if (r.확인 === false) { it.의심 += 1; return; }   // 맞지 않는 기록은 최고로 치지 않는다
      if (고른목표 === '정원' && !r.within_quota) return;   // 정원 목표는 정원 안에 든 기록만 센다
      if (!it.최고 || 점수(r) > 점수(it.최고)) it.최고 = r;   // 같은 점수면 먼저 낸 기록을 남긴다
    });
    var 목록 = Object.values(표);
    if (!교사용) {                                      // 학생 화면에서는 맞지 않는 기록만 낸 팀을 아예 뺀다
      목록 = 목록.filter(function (it) { return it.최고 || it.의심 === 0; });
    }
    return 목록.sort(function (a, b) {
      if (!a.최고 || !b.최고) return (b.최고 ? 1 : 0) - (a.최고 ? 1 : 0) || a.마지막.localeCompare(b.마지막);
      return 앞서나(b.최고, a.최고);
    });
  }

  function 순위계산(목록, i) {                          // 점수가 같으면 먼저 올린 팀이 앞서므로 같은 순위는 없다
    return 목록[i].최고 ? i + 1 : null;
  }

  function 시상대그리기(목록) {
    var 메달표 = ['🥇', '🥈', '🥉'];
    $('시상대').innerHTML = [0, 1, 2].map(function (i) {
      var it = 목록[i];
      var 메달 = { 0: 메달표[0], 1: 메달표[1], 2: 메달표[2] };
      메달 = (it && it.최고) ? (메달표[(순위계산(목록, i) - 1)] || 메달표[2]) : 메달표[i];
      if (!it || !it.최고) {
        return '<div class="pod empty"><div class="medal">' + 메달표[i] + '</div>' +
               '<div class="who">비어 있습니다</div><div class="big">—</div></div>';
      }
      var b = it.최고;
      return '<div class="pod' + (순위계산(목록, i) === 1 ? ' first' : '') + '">' +
        '<div class="medal">' + 메달 + '</div>' +
        '<div class="who">' + 글자(it.팀명) + '</div>' +
        '<div class="cls">' + 글자(it.반) + ' · 시도 ' + it.시도 + '번</div>' +
        '<div class="big">' + (고른목표 === '정원' ? b.found + '<span>명</span>' : 점수글(b)) + '</div>' +
        (고른목표 === '정원' ? '' : '<div class="set">찾아낸 환자 ' + b.found + '명</div>') +
        '<div class="set">정확도 ' + 지표(b,'accuracy') + ' · 재현율 ' + 지표(b,'recall') +
          ' · 정밀도 ' + 지표(b,'precision') + ' · F1 ' + 지표(b,'f1') + '</div>' +
        '<div class="set">안내 ' + b.sent.toLocaleString() + '명 · ' +
          글자(교사용 ? 설정글(b) : 모델글(b)) + '</div></div>';
    }).join('');
  }

  function 반대항그리기(전체) {
    var 반들 = ['월수금반', '화수목반'];
    var 값 = 반들.map(function (반) {
      var 목록 = 사람별(전체.filter(function (r) { return r.class_id === 반; }));
      var 첫 = 목록.length && 목록[0].최고 ? 목록[0].최고 : null;
      return { 반: 반, 첫: 첫, 최고: 첫 ? 1 : 0, 인원: 목록.length,
               넘김: 목록.filter(function (x) { return x.최고 && x.최고.found > 기본기록; }).length };
    });
    var 차이 = (값[0].첫 && 값[1].첫) ? 앞서나(값[0].첫, 값[1].첫) : (값[0].첫 ? 1 : (값[1].첫 ? -1 : 0));
    var 이긴쪽 = 차이 === 0 ? -1 : (차이 > 0 ? 0 : 1);
    $('반대항').innerHTML = 값.map(function (v, i) {
      return '<div class="side' + (i === 이긴쪽 && v.최고 > 0 ? ' win' : '') + '">' +
        '<div class="n">' + v.반 + '</div>' +
        '<div class="b">' + (v.첫 ? 점수글(v.첫) : '—') + '</div>' +
        (v.첫 ? '<div class="s">찾아낸 환자 ' + v.첫.found + '명 · 안내 ' + v.첫.sent.toLocaleString() + '명</div>' : '') +
        '<div class="s">참가 ' + v.인원 + '팀' + (고른목표 === '정원' ? ' · 기본을 넘긴 팀 ' + v.넘김 + '팀' : '') + '</div></div>';
    }).join('');
  }

  function 순위그리기(목록) {
    var 새로움 = {};
    목록.forEach(function (it) {
      var 지난 = 지난최고[it.열쇠];
      if (!첫판 && it.최고 && 지난 && 점수(it.최고) > 점수(지난)) 새로움[it.열쇠] = true;
      지난최고[it.열쇠] = it.최고;
    });
    첫판 = false;

    목록.forEach(function (it, i) { it.순위 = 순위계산(목록, i); });

    $('순위').innerHTML = 목록.map(function (it) {
      var b = it.최고;
      var 이김 = b && 고른목표 === '정원' && b.found > 기본기록;
      var 폭 = b ? Math.round(b.found / 대상자 * 100) : 0;
      var 메달 = it.순위 ? ['🥇', '🥈', '🥉'][it.순위 - 1] : null;
      return '<tr class="' + (이김 ? 'beat ' : '') + (새로움[it.열쇠] ? 'fresh' : '') + '">' +
        '<td class="rank' + (메달 ? ' m' : '') + '">' + (b ? (메달 || it.순위) : '—') + '</td>' +
        '<td class="nick">' + 글자(it.팀명) + (이김 ? '<span class="badge2">베이스라인 통과</span>' : '') +
          (교사용 && it.의심 ? '<span class="badge3">확인 필요 ' + it.의심 + '건</span>' : '') +
          '<div class="set2">' + 글자(it.반) + '</div></td>' +
        '<td><div class="bar"><i style="width:' + 폭 + '%"></i><b>' +
          (b ? (고른목표 === '정원' ? '' : 고른목표 + ' ' + 점수글(b) + ' · ') + b.found + '명 · ' + 폭 + '%'
             : (it.의심 ? '확인 필요' : '정원 초과')) + '</b></div></td>' +
        '<td class="num">' + (b ? b.sent.toLocaleString() + '명' : '—') + '</td>' +
        '<td class="num hide">' + 지표(b, 'accuracy') + '</td>' +
        '<td class="num">' + 지표(b, 'recall') + '</td>' +
        '<td class="num hide">' + 지표(b, 'precision') + '</td>' +
        '<td class="num">' + 지표(b, 'f1') + '</td>' +
        '<td class="hide set2">' + (b ? 글자(교사용 ? 설정글(b) : 모델글(b)) : '—') + '</td>' +
        '<td class="num">' + it.시도 + '</td>' +
        '<td class="num hide">' + 시각(it.마지막) + '</td></tr>';
    }).join('') || '<tr><td colspan="11" class="quiet">아직 올라온 기록이 없습니다. 실습실에서 첫 기록을 올려 보세요.</td></tr>';
  }

  function 이력그리기(대상) {
    function 점(줄, 이름, 색, 투명, 크기) {
      return { x: 줄.map(function (r) { return r.created_at; }),
               y: 줄.map(function (r) { return 점수(r); }),
               text: 줄.map(function (r) { return r.nickname + ' · 찾아낸 환자 ' + r.found + '명 · 안내 ' + r.sent + '명'; }),
               hovertemplate: '%{text}<br>' + (고른목표 === '정원' ? '찾아낸 환자 %{y}명' : 고른목표 + ' %{y:.4f}') + '<extra></extra>',
               mode: 'markers', type: 'scatter', name: 이름,
               marker: { size: 크기, color: 색, opacity: 투명, line: { width: 0 } } };
    }
    Plotly.react('plot', [
      점(대상.filter(function (r) { return r.확인 !== false && !r.within_quota; }), '정원 초과', '#9a8b6a', 0.35, 8),
      점(대상.filter(function (r) { return r.확인 !== false && r.within_quota; }), '정원 안', '#e8930c', 0.85, 11),
      점(교사용 ? 대상.filter(function (r) { return r.확인 === false; }) : [], '확인 필요', '#e45756', 0.8, 11)
    ], {
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Apple SD Gothic Neo, sans-serif', color: '#6b5836', size: 12 },
      margin: { l: 52, r: 16, t: 10, b: 44 },
      xaxis: { title: '올린 시각', gridcolor: '#f7edcf', tickformat: '%H:%M', hoverformat: '%H:%M' },
      yaxis: { title: 고른목표 === '정원' ? '찾아낸 환자(명)' : 고른목표, rangemode: 'tozero', gridcolor: '#f7edcf' },
      shapes: 고른목표 !== '정원' ? [] : [{ type: 'line', xref: 'paper', x0: 0, x1: 1, y0: 기본기록, y1: 기본기록,
                 line: { color: '#54a24b', width: 2, dash: 'dot' } }],
      annotations: 고른목표 !== '정원' ? [] : [{ xref: 'paper', x: 0.01, y: 기본기록, text: '수업 기본 ' + 기본기록 + '명',
                      showarrow: false, yshift: 13, font: { size: 11, color: '#54a24b' } }],
      legend: { orientation: 'h', y: 1.15, x: 0 }
    }, { displayModeBar: false, responsive: true });
  }

  function 그리기(전체) {
    전체.forEach(function (r) { r.확인 = 확인(r); });
    var 이목표 = 전체.filter(function (r) { return 목표(r) === 고른목표; });
    var 대상 = 고른반 === 'all' ? 이목표 : 이목표.filter(function (r) { return r.class_id === 고른반; });
    var 목록 = 사람별(대상);
    시상대그리기(목록);
    $('s인원').textContent = 목록.length + '팀';
    $('s시도').textContent = 대상.length + '번';
    var 의심칸 = $('s의심');
    if (의심칸) {
      var 의심 = 대상.filter(function (r) { return r.확인 === false; }).length;
      의심칸.textContent = 의심 + '건';
      의심칸.style.color = 의심 ? 'var(--red)' : '';
    }
    $('s넘김').textContent = 고른목표 !== '정원' ? '—' :
      목록.filter(function (x) { return x.최고 && x.최고.found > 기본기록; }).length + '팀';
    $('s최고').textContent = (목록[0] && 목록[0].최고) ? 점수글(목록[0].최고) : '—';
    반대항그리기(이목표);
    순위그리기(목록);
    이력그리기(대상);
  }

  function 읽기() {
    if (!주소 || !키) { $('상태').textContent = '설정이 없어 순위판을 열 수 없습니다.'; $('불').className = 'dot off'; return; }
    fetch(주소 + '/rest/v1/challenge_log?select=*&order=created_at.asc&limit=3000',
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
          ? '순위판이 아직 열리지 않았습니다. 선생님이 challenge/schema.sql을 한 번 실행하면 열립니다.'
          : '읽지 못했습니다 (' + e.message + ')';
      });
  }

  $('목표').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call(this.querySelectorAll('button'), function (x) { x.classList.remove('on'); });
    b.classList.add('on'); 고른목표 = b.dataset.v; 첫판 = true; 지난최고 = {}; 읽기();
  });
  $('반').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call(this.querySelectorAll('button'), function (x) { x.classList.remove('on'); });
    b.classList.add('on'); 고른반 = b.dataset.v; 첫판 = true; 읽기();
  });
  읽기();
  setInterval(읽기, 5000);
})();
