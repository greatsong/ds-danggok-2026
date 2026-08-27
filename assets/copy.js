// 코드/프롬프트 블록에 복사 버튼을 자동으로 붙인다.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.codewrap').forEach(function (wrap) {
    var pre = wrap.querySelector('pre');
    if (!pre) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = '복사';
    btn.addEventListener('click', function () {
      var text = pre.innerText;
      // 클립보드 접근 실패 시 텍스트 선택으로 대체
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = '드래그해 복사하세요';
        setTimeout(function () { btn.textContent = '복사'; }, 1800);
      }
      // 비보안(http) 환경 등에는 navigator.clipboard 자체가 없다 → 곧장 대체 경로
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '복사됨 ✓';
          btn.classList.add('done');
          setTimeout(function () { btn.textContent = '복사'; btn.classList.remove('done'); }, 1500);
        }).catch(fallback);
      } else {
        fallback();
      }
    });
    wrap.appendChild(btn);
  });
});

// 파일명 칩(.fname) — 누르면 파일 이름만 복사된다
document.addEventListener('DOMContentLoaded', function () {
  var chips = document.querySelectorAll('.fname');
  Array.prototype.forEach.call(chips, function (btn) {
    btn.title = '누르면 파일 이름이 복사됩니다';
    btn.addEventListener('click', function () {
      var name = btn.getAttribute('data-copy') || btn.textContent.trim();
      function ok() {
        btn.classList.add('done');
        setTimeout(function () { btn.classList.remove('done'); }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(name).then(ok).catch(function () {
          window.prompt('아래 이름을 복사하세요', name);
        });
      } else {
        window.prompt('아래 이름을 복사하세요', name);
      }
    });
  });
});
