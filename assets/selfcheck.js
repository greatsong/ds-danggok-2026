// 손계산 활동지 자가 채점 (8차시). 집에서 혼자 확인할 때 쓴다.
//   · 맞았는지 틀렸는지만 알려 준다. 정답은 보여 주지 않는다.
//   · 단계 순서대로 보고, 처음 어긋난 단계에서 멈춘다. 그 아래는 채점하지 않는다.
//   · 숫자 칸만 채점한다. 어느 지표를 볼 것인가와 그 까닭은 수업에서 다룬다.
// 붙이는 곳: <div class="selfcheck" data-sc="lesson08"></div>
(function () {
  'use strict';

  var SETS = {
    lesson08: {
      note: '활동지의 숫자 칸만 채점합니다. 어느 지표를 볼 것인지와 그 까닭은 채점하지 않습니다. ' +
            '수업에서 다루는 부분이고, 답이 하나로 정해지는 문제가 아니기 때문입니다.',
      parts: [
        {
          title: '기본 문제 · 다음 주 관객 수 예측',
          unit: '만 명',
          steps: [
            { name: '① 오차를 그대로 더한 합',
              cells: [['모델 가', 0], ['모델 나', 4]] },
            { name: '②③④ 절댓값의 합과 제곱의 합',
              cells: [['모델 가 · 절댓값의 합', 6], ['모델 가 · 제곱의 합', 10],
                      ['모델 나 · 절댓값의 합', 4], ['모델 나 · 제곱의 합', 16]] },
            { name: '⑤ MAE와 MSE',
              cells: [['모델 가 · MAE', 1.2], ['모델 가 · MSE', 2],
                      ['모델 나 · MAE', 0.8], ['모델 나 · MSE', 3.2]] },
            { name: '⑥ 실젯값의 평균과 평균값 기준의 제곱오차 합',
              cells: [['실젯값의 평균', 16], ['평균값 기준의 제곱오차 합', 40]] },
            { name: '⑦ 고른 모델의 R²',
              cells: [['모델 가의 R²', 0.75]] }
          ]
        },
        {
          title: '연습 문제 · 하루 매점 매출 예측',
          unit: '만 원',
          steps: [
            { name: '②③④ 절댓값의 합과 제곱의 합',
              cells: [['모델 다 · 절댓값의 합', 7], ['모델 다 · 제곱의 합', 15],
                      ['모델 라 · 절댓값의 합', 8], ['모델 라 · 제곱의 합', 16]] },
            { name: '⑤ MAE와 MSE',
              cells: [['모델 다 · MAE', 1.4], ['모델 다 · MSE', 3],
                      ['모델 라 · MAE', 1.6], ['모델 라 · MSE', 3.2]] },
            { name: '⑥ 실젯값의 평균과 평균값 기준의 제곱오차 합',
              cells: [['실젯값의 평균', 25], ['평균값 기준의 제곱오차 합', 60]] },
            { name: '⑦ 고른 모델의 R²',
              cells: [['모델 다의 R²', 0.75]] },
            { name: '⑦ 평균만 답하는 모델의 R²',
              cells: [['평균만 답하는 모델의 R²', 0]] }
          ]
        }
      ]
    }
  };

  // '−1.2', ' +6 ', '1,200' 같은 입력을 수로 바꾼다. 수가 아니면 null.
  function toNum(raw) {
    var s = String(raw || '').trim().replace(/[−–—]/g, '-').replace(/[,\s]/g, '');
    if (s === '') return null;
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  }

  function same(got, want) {
    return got !== null && !isNaN(got) && Math.abs(got - want) < 5e-4;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildPart(part) {
    var wrap = el('div', 'sc-part');
    wrap.appendChild(el('div', 'sc-title', part.title));
    part.steps.forEach(function (step, si) {
      var box = el('div', 'sc-step');
      box.dataset.step = String(si);
      box.appendChild(el('div', 'sc-step-h', step.name));
      var grid = el('div', 'sc-grid');
      step.cells.forEach(function (cell) {
        var row = el('label', 'sc-row');
        row.appendChild(el('span', 'sc-lab', cell[0]));
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'sc-in';
        inp.inputMode = 'decimal';
        inp.setAttribute('aria-label', part.title + ' ' + step.name + ' ' + cell[0]);
        inp.dataset.want = String(cell[1]);
        row.appendChild(inp);
        row.appendChild(el('span', 'sc-mark', ''));
        grid.appendChild(row);
      });
      box.appendChild(grid);
      wrap.appendChild(box);
    });
    var bar = el('div', 'sc-bar');
    var run = el('button', 'sc-btn', '채점하기');
    run.type = 'button';
    var again = el('button', 'sc-btn ghost', '지우고 다시');
    again.type = 'button';
    var msg = el('p', 'sc-msg', '');
    msg.setAttribute('role', 'status');
    bar.appendChild(run);
    bar.appendChild(again);
    wrap.appendChild(bar);
    wrap.appendChild(msg);

    function clearMarks() {
      wrap.querySelectorAll('.sc-mark').forEach(function (m) { m.textContent = ''; m.className = 'sc-mark'; });
      wrap.querySelectorAll('.sc-step').forEach(function (s) { s.classList.remove('done', 'here'); });
    }

    run.addEventListener('click', function () {
      clearMarks();
      var boxes = Array.prototype.slice.call(wrap.querySelectorAll('.sc-step'));
      for (var i = 0; i < boxes.length; i++) {
        var inputs = Array.prototype.slice.call(boxes[i].querySelectorAll('.sc-in'));
        var blank = 0, wrong = 0;
        inputs.forEach(function (inp) {
          var got = toNum(inp.value);
          var mark = inp.parentNode.querySelector('.sc-mark');
          if (got === null) { blank++; return; }
          if (same(got, parseFloat(inp.dataset.want))) {
            mark.textContent = '○'; mark.className = 'sc-mark ok';
          } else {
            mark.textContent = '✗'; mark.className = 'sc-mark no'; wrong++;
          }
        });
        if (blank && !wrong) {
          boxes[i].classList.add('here');
          msg.className = 'sc-msg hold';
          msg.textContent = (i === 0 ? '' : (i) + '단계까지 맞습니다. ') +
            '"' + part.steps[i].name + '"에 아직 비어 있는 칸이 있습니다.';
          return;
        }
        if (wrong) {
          boxes[i].classList.add('here');
          msg.className = 'sc-msg no';
          msg.textContent = (i === 0 ? '' : (i) + '단계까지 맞습니다. ') +
            '"' + part.steps[i].name + '"에서 다시 볼 칸이 있습니다. ' +
            '이 단계를 고치기 전에는 아래 단계를 채점하지 않습니다. 아래 단계의 값은 이 단계의 값에서 나오기 때문입니다.';
          return;
        }
        boxes[i].classList.add('done');
      }
      msg.className = 'sc-msg ok';
      msg.textContent = '모두 맞습니다. 활동지의 판단 문항(어느 지표를 볼 것인가와 그 까닭)은 수업에서 확인합니다.';
    });

    again.addEventListener('click', function () {
      wrap.querySelectorAll('.sc-in').forEach(function (i) { i.value = ''; });
      clearMarks();
      msg.className = 'sc-msg';
      msg.textContent = '';
    });

    return wrap;
  }

  function init(scope) {
    (scope || document).querySelectorAll('.selfcheck[data-sc]').forEach(function (host) {
      if (host.dataset.ready) return;
      var set = SETS[host.dataset.sc];
      if (!set) return;
      host.appendChild(el('p', 'sc-note', set.note));
      set.parts.forEach(function (p) { host.appendChild(buildPart(p)); });
      host.dataset.ready = '1';
    });
  }

  window.initSelfCheck = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
})();
