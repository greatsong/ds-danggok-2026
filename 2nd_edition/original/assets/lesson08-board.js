(function () {
  'use strict';
  document.querySelectorAll('.calc-fullscreen').forEach(function (button) {
    var panel = button.closest('.calc-board');
    if (!document.fullscreenEnabled || !panel.requestFullscreen) { button.hidden = true; return; }
    button.addEventListener('click', async function () {
      try {
        if (document.fullscreenElement === panel) await document.exitFullscreen();
        else await panel.requestFullscreen();
      } catch (error) { button.textContent = '전체 화면을 열 수 없습니다'; }
    });
    document.addEventListener('fullscreenchange', function () {
      button.textContent = document.fullscreenElement === panel ? '원래 크기로 돌아가기' : '화면 가득 보기';
    });
  });
}());
