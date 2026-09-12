// 오늘의 체크 — 항목을 누르면 초록 체크가 켜지고, 브라우저에 기억된다.
document.addEventListener('DOMContentLoaded', function () {
  var lists = document.querySelectorAll('.checklist');
  if (!lists.length) return;
  var KEY = 'dsdg_check_' + location.pathname;
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  var items = [];
  lists.forEach(function (ul) {
    ul.querySelectorAll('li').forEach(function (li) { items.push(li); });
  });
  items.forEach(function (li, i) {
    if (saved.indexOf(i) !== -1) li.classList.add('done');
    li.setAttribute('role', 'checkbox');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-checked', li.classList.contains('done') ? 'true' : 'false');
    function toggle() {
      li.classList.toggle('done');
      li.setAttribute('aria-checked', li.classList.contains('done') ? 'true' : 'false');
      var done = [];
      items.forEach(function (x, j) { if (x.classList.contains('done')) done.push(j); });
      try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
    }
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
  });
});
