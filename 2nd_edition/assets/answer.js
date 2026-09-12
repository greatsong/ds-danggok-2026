// 교재의 질문·빈 표에 답을 적는 칸을 만든다.
//   · 저장하지 않는다. 새로 고치면 지워진다(교실 공용 기기를 생각한 선택).
// 대상: .callout.ask 안의 목록 항목, 그리고 값이 비어 있는 표 칸.
(function () {
  'use strict';

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight, 38) + 'px';
  }

  function addAnswerBoxes(scope) {
    (scope || document).querySelectorAll('.callout.ask').forEach(function (box) {
      if (box.dataset.answerReady) return;
      box.querySelectorAll('li').forEach(function (li, i) {
        if (li.querySelector('.quiz')) return;   // 선택형 문항은 답을 고르므로 입력칸을 붙이지 않는다
        var ta = document.createElement('textarea');
        ta.className = 'answer-in';
        ta.rows = 1;
        ta.placeholder = '여기에 답을 적습니다';
        ta.setAttribute('aria-label', '답 ' + (i + 1));
        ta.addEventListener('input', function () { autoGrow(ta); });
        li.appendChild(ta);
      });
      box.dataset.answerReady = '1';
    });
  }

  function addTableInputs(scope) {
    (scope || document).querySelectorAll('table.daymap').forEach(function (table) {
      if (table.dataset.answerReady) return;
      var blanks = 0;
      table.querySelectorAll('tbody td').forEach(function (td) {
        // 여백용 칸(colspan)과 이미 채워진 칸은 건너뛴다
        if (td.textContent.trim() !== '' || td.querySelector('input')) return;
        if (td.hasAttribute('colspan')) return;
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'answer-cell';
        inp.setAttribute('aria-label', '기록 칸');
        td.appendChild(inp);
        blanks++;
      });
      if (blanks) table.dataset.answerReady = '1';
    });
  }

  function init(scope) {
    addAnswerBoxes(scope);
    addTableInputs(scope);
  }

  window.initAnswerBoxes = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
})();
