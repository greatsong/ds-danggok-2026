// 구술 평가 앱 오프라인 껍데기. 교실 와이파이가 끊겨도 앱이 열리게 한다.
// 같은 출처 파일은 네트워크 먼저(새 버전 반영), 실패하면 캐시. 시트 요청(script.google.com)은 건드리지 않는다.
var CACHE = 'oral-shell-v10';
var SHELL = ['./', 'index.html', 'oral.css?v=4', 'oral.js?v=10', 'seed.js?v=2', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', '../../assets/gate.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: false }).then(function (hit) { return hit || caches.match('index.html'); });
  }));
});
