// 확인 문제 인터랙션 — .quiz .opt 클릭으로 정답 확인
// 정답 버튼에 data-ok="1". 정답을 고르면 해설(.fb)이 열리고, 오답은 다시 고를 수 있다.
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz .opt');
    if (!btn || btn.disabled) return;
    var opts = btn.closest('.qopts');
    var item = btn.closest('.qitem');
    if (!opts) return;
    if (btn.dataset.ok === '1') {
      opts.querySelectorAll('.opt').forEach(function (o) {
        o.disabled = true;
        if (o.dataset.ok === '1') o.classList.add('right');
      });
      var fb = item && item.querySelector('.fb');
      if (fb) fb.classList.add('show');
    } else {
      btn.classList.add('wrong');
      setTimeout(function () { btn.classList.remove('wrong'); }, 700);
    }
  });
})();
