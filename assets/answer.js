// 교재의 질문·빈 표에 답을 적는 칸을 만든다.
//   · 저장하지 않는다. 새로 고치면 지워진다(교실 공용 기기를 생각한 선택).
//   · 적은 답은 "답 모아 복사"로 한 번에 가져가 클래스룸이나 공책에 옮긴다.
// 대상: .callout.ask 안의 목록 항목, 그리고 값이 비어 있는 표 칸.
(function () {
  'use strict';

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight, 38) + 'px';
  }

  function addAnswerBoxes(scope) {
    var asks = (scope || document).querySelectorAll('.callout.ask');
    asks.forEach(function (box) {
      if (box.dataset.answerReady) return;
      var items = box.querySelectorAll('li');
      items.forEach(function (li, i) {
        var ta = document.createElement('textarea');
        ta.className = 'answer-in';
        ta.rows = 1;
        ta.placeholder = '여기에 답을 적습니다';
        ta.setAttribute('aria-label', '답 ' + (i + 1));
        ta.addEventListener('input', function () { autoGrow(ta); });
        li.appendChild(ta);
      });
      if (items.length) {
        var bar = document.createElement('div');
        bar.className = 'answer-bar';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'answer-copy';
        btn.textContent = '답 모아 복사';
        var msg = document.createElement('span');
        msg.className = 'answer-msg';
        btn.addEventListener('click', function () { copyAnswers(box, msg); });
        bar.appendChild(btn);
        bar.appendChild(msg);
        box.appendChild(bar);
      }
      box.dataset.answerReady = '1';
    });
  }

  function addTableInputs(scope) {
    var tables = (scope || document).querySelectorAll('table.daymap');
    tables.forEach(function (table) {
      if (table.dataset.answerReady) return;
      var blanks = 0;
      table.querySelectorAll('tbody td').forEach(function (td) {
        if (td.textContent.trim() !== '' || td.querySelector('input')) return;
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

  function copyAnswers(box, msg) {
    var lines = [];
    var head = box.querySelector('.h');
    if (head) lines.push(head.textContent.trim());
    box.querySelectorAll('li').forEach(function (li, i) {
      var ta = li.querySelector('.answer-in');
      var q = li.cloneNode(true);
      var inner = q.querySelector('.answer-in');
      if (inner) inner.remove();
      lines.push((i + 1) + '. ' + q.textContent.trim());
      lines.push('   → ' + ((ta && ta.value.trim()) || '(비어 있음)'));
    });
    var text = lines.join('\n');
    var done = function (ok) {
      msg.textContent = ok ? '복사했습니다' : '복사하지 못했습니다';
      setTimeout(function () { msg.textContent = ''; }, 2500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(text, done); });
    } else {
      fallback(text, done);
    }
  }

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    done(ok);
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
