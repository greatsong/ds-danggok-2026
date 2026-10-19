/* 구술 평가 — 교사용 앱 (2026-10-19)
 * 아이폰 사파리에서 홈 화면에 추가해 쓰는 것을 기준으로 만들었다.
 * 흐름: 팀 선택 → 녹음 → 지목·꼬리질문 표시 → 루브릭 점수 → 메모 → 저장
 * 저장은 기기(IndexedDB)에 먼저 하고, 시트(Apps Script)와 드라이브로 차례로 올린다.
 */
(function () {
  'use strict';
  var APP_VERSION = '2026-10-19.1';

  // ── 작은 도구 ─────────────────────────────────────────────────────────
  function $(sel, root) { return (root || document).querySelector(sel); }
  function h(tag, attrs) {
    var el = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'style') el.setAttribute('style', v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    kids.forEach(function add(c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) { c.forEach(add); return; }
      el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return el;
  }
  function uid(prefix) { return (prefix || 'S') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
  function kst(iso) {
    if (!iso) return '';
    var d = new Date(iso); if (isNaN(d)) return String(iso);
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  // 시트의 "yyyy-MM-dd HH:mm:ss"(한국 시각)와 기기의 ISO 시각을 같은 기준으로 비교한다
  function ts(v) {
    if (!v) return 0;
    var str = String(v);
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(str)) str = str.replace(' ', 'T') + '+09:00';
    var t = Date.parse(str); return isNaN(t) ? 0 : t;
  }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var toastTimer = null;
  function toast(msg, action) {
    var t = $('#toast');
    t.innerHTML = '';
    t.appendChild(h('span', null, msg));
    if (action) t.appendChild(h('button', { type: 'button', onclick: function () { t.classList.remove('show'); action.fn(); } }, action.label));
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, action ? 6000 : 2600);
  }
  function isIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function device() { return isIOS() ? 'iPhone/iPad' : (/Mac/.test(navigator.platform) ? 'Mac' : (navigator.platform || '기타')); }

  // ── IndexedDB ────────────────────────────────────────────────────────
  var DB = null;
  function dbOpen() {
    if (DB) return Promise.resolve(DB);
    return new Promise(function (res, rej) {
      var r = indexedDB.open('oral-assessment', 1);
      r.onupgradeneeded = function () {
        var db = r.result;
        if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('chunks')) db.createObjectStore('chunks', { keyPath: 'k' });
        if (!db.objectStoreNames.contains('audio')) db.createObjectStore('audio', { keyPath: 'id' });
      };
      r.onsuccess = function () { DB = r.result; res(DB); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function tx(store, mode, fn) {
    return dbOpen().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(store, mode); var s = t.objectStore(store); var out;
        var req = fn(s);
        if (req) req.onsuccess = function () { out = req.result; };
        t.oncomplete = function () { res(out); };
        t.onerror = function () { rej(t.error); };
        t.onabort = function () { rej(t.error); };
      });
    });
  }
  var idb = {
    put: function (store, v) { return tx(store, 'readwrite', function (s) { return s.put(v); }); },
    get: function (store, k) { return tx(store, 'readonly', function (s) { return s.get(k); }); },
    del: function (store, k) { return tx(store, 'readwrite', function (s) { return s.delete(k); }); },
    all: function (store) { return tx(store, 'readonly', function (s) { return s.getAll(); }); }
  };

  // ── 상태 ─────────────────────────────────────────────────────────────
  var S = {
    cfg: lsGet('oral.cfg', null),            // { url, token }
    boot: lsGet('oral.boot', null),          // 시트에서 받은 마지막 데이터
    ui: lsGet('oral.ui', { cls: '', cp: '', tab: 'eval' }),
    prefs: lsGet('oral.prefs', { noise: true }),
    drafts: [],                              // 기기의 기록
    pendingTeams: lsGet('oral.pendingTeams', []),
    syncing: false, online: navigator.onLine
  };
  function saveUi() { lsSet('oral.ui', S.ui); }

  // 시트에 연결하기 전에는 콘텐츠 팩(seed.js)의 값으로 연다
  function defaultBoot() {
    var seed = window.ORAL_SEED || { checkpoints: [] };
    var c = seed.course || {};
    var codes = c.class_codes ? Object.keys(c.class_codes).map(function (k) { return k + '=' + c.class_codes[k]; }).join(',') : '';
    return { settings: { app_title: c.app_title || '구술 평가', course_name: c.course_name || '', scale: seed.scale_default || 3,
      classes: c.classes || ['1반', '2반'], class_codes: codes, stt_engine: 'none', auto_transcribe: true, keys: {} },
      checkpoints: seed.checkpoints, teams: [], sessions: [], scores: [], sheetUrl: '', offline: true,
      elementRule: seed.element_rule || '', methods: c.methods || {}, memoPhrases: seed.memo_phrases || { team: [], student: [] } };
  }
  function boot() { return S.boot || defaultBoot(); }
  function settings() { return boot().settings || {}; }
  function checkpoints() { return boot().checkpoints || []; }
  function cpById(id) { return checkpoints().filter(function (c) { return c.id === id; })[0]; }
  function curCp() { return cpById(S.ui.cp) || checkpoints()[0]; }
  function classes() { var c = settings().classes; return (c && c.length) ? c : (defaultBoot().settings.classes); }
  function curCls() { return S.ui.cls && classes().indexOf(S.ui.cls) !== -1 ? S.ui.cls : classes()[0]; }

  function allTeams() {
    var map = {};
    (boot().teams || []).forEach(function (t) { map[t.id] = t; });
    S.pendingTeams.forEach(function (t) { if (t._deleted) delete map[t.id]; else map[t.id] = t; });
    return Object.keys(map).map(function (k) { return map[k]; });
  }
  // 등록 순서(팀ID 순: 설문 제출 순으로 TE01·TE02 …, 앱에서 만든 팀은 만든 시각 순)로 보여 준다
  function teamsOf(cls) {
    return allTeams().filter(function (t) { return t.cls === cls; }).sort(function (a, b) {
      return String(a.id).localeCompare(String(b.id), 'en', { numeric: true });
    });
  }
  function teamById(id) { return allTeams().filter(function (t) { return t.id === id; })[0]; }

  // "20203 김도윤 / 20211 박서연" → [{key, sid, name}]
  function parseMembers(str) {
    return String(str || '').split(/\s*\/\s*|\n|,|·/).map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) {
      var m = s.match(/^(\d{4,6})\s*(.*)$/);
      if (m) return { key: m[1], sid: m[1], name: m[2] || m[1] };
      return { key: s, sid: '', name: s };
    });
  }

  function levelsFor(scale) {
    if (Number(scale) === 5) return [
      { v: 5, label: '5', cls: 'v-hi', d: 'high' }, { v: 4, label: '4', cls: 'v-hi', d: 'high_mid' },
      { v: 3, label: '3', cls: 'v-mid', d: 'mid' }, { v: 2, label: '2', cls: 'v-lo', d: 'mid_low' },
      { v: 1, label: '1', cls: 'v-lo', d: 'low' }];
    return [{ v: 3, label: '상', cls: 'v-hi', d: 'high' }, { v: 2, label: '중', cls: 'v-mid', d: 'mid' }, { v: 1, label: '하', cls: 'v-lo', d: 'low' }];
  }
  function descOf(item, key) {
    if (key === 'high_mid') return '상과 중 사이: ' + item.high;
    if (key === 'mid_low') return '중과 하 사이: ' + item.mid;
    return item[key] || '';
  }
  var CP_COLORS = ['#ff7a59', '#f59f00', '#12b886', '#3b9dff', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];
  function cpColor(cp) {
    if (!cp) return CP_COLORS[0];
    if (cp.color) return cp.color;
    var i = checkpoints().map(function (c) { return c.id; }).indexOf(cp.id);
    return CP_COLORS[(i < 0 ? 0 : i) % CP_COLORS.length];
  }
  var TEAM_COLORS = ['#ff7a59', '#5b5bf6', '#12b886', '#f59f00', '#3b9dff', '#ec4899', '#8b5cf6', '#14b8a6', '#ef6351', '#7cb342'];
  function teamColor(t) { var n = 0; String(t.name || '').split('').forEach(function (c) { n += c.charCodeAt(0); }); return TEAM_COLORS[n % TEAM_COLORS.length]; }
  function teamInitial(t) { var m = String(t.name || '').match(/^\s*(\d+)/); return m ? m[1] : String(t.name || '?').trim().charAt(0); }
  function ratioClass(r) { return r >= 0.83 ? 'hi' : r >= 0.5 ? 'mid' : 'lo'; }

  // 서버 기록 + 기기 기록을 합쳐 팀·회차별 최신 기록을 고른다
  function sessionsAll() {
    var map = {};
    (boot().sessions || []).forEach(function (s) { map[s.id] = Object.assign({ _src: 'server' }, s); });
    S.drafts.forEach(function (d) {
      if (!d.final) return;
      var sum = sessionPayload(d).session;
      map[d.id] = Object.assign({}, map[d.id] || {}, d, { _src: 'local', total: sum.total, max: sum.max, absent: sum.absent });
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }
  function latestSession(teamId, cp) {
    var list = sessionsAll().filter(function (s) { return s.teamId === teamId && s.cp === cp; });
    list.sort(function (a, b) { return ts(b.savedAt || b.updatedAt) - ts(a.savedAt || a.updatedAt); });
    return list[0];
  }
  function scoresForSession(s) {
    if (s._src === 'local' && s.scores) return s.scores;
    var out = {};
    (boot().scores || []).forEach(function (x) {
      if (x.sid !== s.id) return;
      if (x.target === '팀') out[x.item] = x.v;
      else { out[x.item] = out[x.item] || {}; out[x.item][x.target] = x.v; }
    });
    return out;
  }

  // ── 연결 ─────────────────────────────────────────────────────────────
  // "#connect=…"가 붙은 연결 링크 문자열에서 웹 앱 주소·토큰을 꺼낸다
  function parseConnect(text) {
    var m = String(text || '').match(/connect=([A-Za-z0-9_\-]+)/);
    if (!m) return null;
    try {
      var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
      return obj.u && obj.t ? { url: obj.u, token: obj.t } : null;
    } catch (e) { return null; }
  }
  function readConnectHash() {
    var m = location.hash.match(/connect=([A-Za-z0-9_\-]+)/);
    if (!m) return false;
    try {
      var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var obj = JSON.parse(decodeURIComponent(escape(atob(b64))));
      if (obj.u && obj.t) { S.cfg = { url: obj.u, token: obj.t }; lsSet('oral.cfg', S.cfg); }
    } catch (e) { console.warn(e); }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    return !!S.cfg;
  }

  function api(action, payload, opts) {
    if (!S.cfg || !S.cfg.url) return Promise.reject(new Error('시트에 연결되지 않았습니다. 설정에서 연결하세요.'));
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var ms = (opts && opts.timeout) || 60000;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
    var body = JSON.stringify(Object.assign({ token: S.cfg.token, action: action }, payload || {}));
    return fetch(S.cfg.url, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var data; try { data = JSON.parse(txt); } catch (e) { throw new Error('응답을 읽지 못했습니다. 웹 앱 주소를 확인하세요.'); }
        if (!data.ok) { var err = new Error(data.error || '요청 실패'); err.code = data.code; throw err; }
        return data;
      })
      .catch(function (e) { if (e.name === 'AbortError') throw new Error('응답 시간이 초과되었습니다.'); throw e; })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function loadBoot(quiet) {
    if (!S.cfg) return Promise.resolve();
    return api('bootstrap', {}, { timeout: 45000 }).then(function (d) {
      delete d.ok;
      S.boot = d; lsSet('oral.boot', d);
      if (!S.ui.cp || !cpById(S.ui.cp)) { S.ui.cp = (d.checkpoints[0] || {}).id; saveUi(); }
      render();
      if (!quiet) toast('시트에서 새로 불러왔습니다');
    }).catch(function (e) { if (!quiet) toast('불러오기 실패: ' + e.message); renderSync(); });
  }

  // ── 녹음 ─────────────────────────────────────────────────────────────
  var Rec = {
    stream: null, ctx: null, analyser: null, splitter: null, analysers: [], mr: null, mime: '', id: null, seq: 0,
    chunks: [], startedAt: 0, accMs: 0, runFrom: 0, state: 'idle', wake: null, raf: 0, hiddenDuring: false, onTick: null,
    // 아이폰은 mp4(AAC)가 기본, 그 밖의 브라우저는 webm(Opus)이 가장 안정적이다
    mimeCandidates: function () {
      var mp4 = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4'], webm = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
      var c = isIOS() ? mp4.concat(webm) : webm.concat(mp4);
      if (typeof MediaRecorder === 'undefined') return [];
      var ok = c.filter(function (m) { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } });
      return ok.length ? ok : [''];
    },
    ensureStream: function () {
      if (Rec.stream && Rec.stream.getAudioTracks().some(function (t) { return t.readyState === 'live'; })) return Promise.resolve(Rec.stream);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error('이 브라우저는 녹음을 지원하지 않습니다. 사파리(https)로 여세요.'));
      var noise = S.prefs.noise !== false;
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: noise, noiseSuppression: noise, autoGainControl: true, channelCount: { ideal: 2 } } })
        .then(function (st) {
          Rec.stream = st;
          try {
            var AC = window.AudioContext || window.webkitAudioContext;
            Rec.ctx = new AC();
            var src = Rec.ctx.createMediaStreamSource(st);
            Rec.analyser = Rec.ctx.createAnalyser(); Rec.analyser.fftSize = 1024;
            src.connect(Rec.analyser);
            var ch = (st.getAudioTracks()[0].getSettings() || {}).channelCount || 1;
            Rec.analysers = [];
            if (ch >= 2) {
              Rec.splitter = Rec.ctx.createChannelSplitter(2); src.connect(Rec.splitter);
              for (var i = 0; i < 2; i++) { var a = Rec.ctx.createAnalyser(); a.fftSize = 1024; Rec.splitter.connect(a, i); Rec.analysers.push(a); }
            }
          } catch (e) { console.warn('미터 생성 실패', e); }
          return st;
        });
    },
    level: function (an) {
      an = an || Rec.analyser; if (!an) return 0;
      var buf = new Uint8Array(an.fftSize); an.getByteTimeDomainData(buf);
      var sum = 0; for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
      return Math.min(1, Math.sqrt(sum / buf.length) * 4);
    },
    trackInfo: function () {
      if (!Rec.stream) return null;
      var t = Rec.stream.getAudioTracks()[0]; var s = (t && t.getSettings && t.getSettings()) || {};
      return { label: t ? t.label : '', channels: s.channelCount || 1, rate: s.sampleRate || (Rec.ctx && Rec.ctx.sampleRate) || '' };
    },
    elapsed: function () { return (Rec.accMs + (Rec.state === 'recording' ? Date.now() - Rec.runFrom : 0)) / 1000; },
    start: function (id) {
      return Rec.ensureStream().then(function (st) {
        if (Rec.ctx && Rec.ctx.state === 'suspended') Rec.ctx.resume();
        Rec.id = id; Rec.seq = 0; Rec.chunks = []; Rec.accMs = 0; Rec.runFrom = Date.now(); Rec.startedAt = Date.now(); Rec.hiddenDuring = false;
        Rec.failed = '';
        Rec.candidates = Rec.mimeCandidates();
        Rec.begin(st, id);
        Rec.state = 'recording';
        Rec.keepAwake(true);
        Rec.loop();
      });
    },
    // 인코더 오류가 녹음 첫머리에 나면 다음 형식으로 바꿔 다시 시작한다
    begin: function (st, id) {
      var mime = Rec.candidates.shift() || '';
      var opt = { audioBitsPerSecond: 64000 }; if (mime) opt.mimeType = mime;
      var mr = new MediaRecorder(st, opt);
      Rec.mr = mr; Rec.mime = mr.mimeType || mime || 'audio/mp4';
      Rec.stopped = new Promise(function (res) { mr.addEventListener('stop', res); });
      mr.ondataavailable = function (e) {
        if (!e.data || !e.data.size || mr !== Rec.mr) return;
        Rec.chunks.push(e.data);
        var seq = Rec.seq++; var m = Rec.mime;
        e.data.arrayBuffer().then(function (buf) { return idb.put('chunks', { k: id + ':' + String(seq).padStart(5, '0'), id: id, seq: seq, mime: m, buf: buf }); })
          .catch(function (err) { console.warn('조각 저장 실패', err); });
      };
      mr.onerror = function (e) {
        var msg = (e && e.error && (e.error.name || e.error.message)) || '알 수 없는 오류';
        console.warn('녹음 오류', Rec.mime, msg);
        if (mr !== Rec.mr) return;
        if (!Rec.chunks.length && Rec.candidates.length && Rec.state !== 'idle') { Rec.begin(st, id); return; }
        Rec.failed = msg; toast('녹음 오류: ' + msg + '. 녹음을 끝내고 다시 시작하세요');
      };
      mr.start(2000);
    },
    pause: function () { if (Rec.mr && Rec.state === 'recording' && Rec.mr.state === 'recording') { Rec.mr.pause(); Rec.accMs += Date.now() - Rec.runFrom; Rec.state = 'paused'; } },
    resume: function () { if (Rec.mr && Rec.state === 'paused' && Rec.mr.state === 'paused') { Rec.mr.resume(); Rec.runFrom = Date.now(); Rec.state = 'recording'; } },
    stop: function () {
      if (!Rec.mr || Rec.state === 'idle') return Promise.resolve(null);
      var dur = Rec.elapsed();
      var mr = Rec.mr, id = Rec.id, mime = Rec.mime;
      Rec.state = 'stopping';
      try { if (mr.state !== 'inactive') mr.stop(); } catch (e) { console.warn(e); }
      // 'stop' 이벤트를 기다리되, 이미 멈춰 있었거나 이벤트가 오지 않아도 3초 뒤에는 마무리한다
      return Promise.race([Rec.stopped, new Promise(function (r) { setTimeout(r, 3000); })]).then(function () {
        Rec.state = 'idle'; Rec.mr = null; Rec.keepAwake(false);
        if (!Rec.chunks.length) { toast('녹음된 소리가 없습니다' + (Rec.failed ? ' (' + Rec.failed + ')' : '')); return clearChunks(id).then(function () { return null; }); }
        var blob = new Blob(Rec.chunks, { type: mime });
        return blob.arrayBuffer().then(function (buf) {
          return idb.put('audio', { id: id, mime: mime, buf: buf, duration: dur, size: blob.size });
        }).then(function () { return clearChunks(id); }).then(function () { return { mime: mime, size: blob.size, duration: dur }; })
          .catch(function (e) { console.warn(e); return { mime: mime, size: blob.size, duration: dur, warn: true }; });
      });
    },
    release: function () {
      if (Rec.state !== 'idle') return;
      if (Rec.stream) Rec.stream.getTracks().forEach(function (t) { t.stop(); });
      Rec.stream = null;
      if (Rec.ctx) { try { Rec.ctx.close(); } catch (e) {} } Rec.ctx = null; Rec.analyser = null; Rec.analysers = [];
    },
    keepAwake: function (on) {
      try {
        if (on && 'wakeLock' in navigator) navigator.wakeLock.request('screen').then(function (w) { Rec.wake = w; }).catch(function () {});
        else if (!on && Rec.wake) { Rec.wake.release(); Rec.wake = null; }
      } catch (e) {}
    },
    loop: function () {
      cancelAnimationFrame(Rec.raf);
      var tick = function () {
        if (Rec.onTick) Rec.onTick();
        if (Rec.state !== 'idle' || Rec.onTick) Rec.raf = requestAnimationFrame(tick);
      };
      Rec.raf = requestAnimationFrame(tick);
    }
  };
  function clearChunks(id) {
    return idb.all('chunks').then(function (list) {
      return Promise.all(list.filter(function (c) { return c.id === id; }).map(function (c) { return idb.del('chunks', c.k); }));
    });
  }
  // 앱이 꺼졌다 켜지면 남아 있던 녹음 조각을 한 파일로 묶어 살린다
  function recoverChunks() {
    return idb.all('chunks').then(function (list) {
      var by = {};
      list.forEach(function (c) { (by[c.id] = by[c.id] || []).push(c); });
      return Promise.all(Object.keys(by).map(function (id) {
        var parts = by[id].sort(function (a, b) { return a.seq - b.seq; });
        var mime = parts[0].mime || 'audio/mp4';
        var blob = new Blob(parts.map(function (p) { return p.buf; }), { type: mime });
        return blob.arrayBuffer().then(function (buf) {
          return idb.put('audio', { id: id, mime: mime, buf: buf, duration: parts.length * 2, size: blob.size, recovered: true });
        }).then(function () { return clearChunks(id); }).then(function () {
          var d = S.drafts.filter(function (x) { return x.id === id; })[0];
          if (d) { d.audio = { has: true, mime: mime, size: blob.size, duration: parts.length * 2, recovered: true }; return saveDraft(d); }
        });
      })).then(function () { if (Object.keys(by).length) toast('끊긴 녹음 ' + Object.keys(by).length + '개를 복구했습니다'); });
    });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && Rec.state === 'recording') Rec.hiddenDuring = true;
    if (!document.hidden && Rec.state !== 'idle') Rec.keepAwake(true);
    if (!document.hidden && S.ui.tab === 'eval' && !$('#sheet').hidden && Rec.hiddenDuring) {
      var w = $('#recWarn'); if (w) { w.hidden = false; }
    }
  });

  // ── 기기 기록(초안) ───────────────────────────────────────────────────
  function saveDraft(d) {
    d.updatedAt = new Date().toISOString();
    var i = S.drafts.findIndex(function (x) { return x.id === d.id; });
    if (i === -1) S.drafts.push(d); else S.drafts[i] = d;
    return idb.put('drafts', JSON.parse(JSON.stringify(d)));
  }
  var saveTimer = null;
  function saveDraftSoon(d) { clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveDraft(d); }, 400); }

  function newDraft(team, cp) {
    var members = parseMembers(team.members);
    return {
      id: uid('R'), cls: team.cls, cp: cp.id, teamId: team.id, teamName: team.name,
      members: members, present: members.map(function (m) { return m.key; }), absent: [],
      scores: {}, memo: '', notes: {}, markers: [], audio: { has: false }, scale: Number(settings().scale) || 3,
      startedAt: '', durationSec: 0, final: false,
      sync: { session: 'none', audio: 'none', stt: 'none' }, createdAt: new Date().toISOString()
    };
  }
  function draftFromServer(s, team) {
    var members = parseMembers(team ? team.members : '');
    (s.present || []).concat(s.absent || []).forEach(function (k) {
      if (!members.some(function (m) { return m.key === k; })) members.push({ key: k, sid: /^\d+$/.test(k) ? k : '', name: k });
    });
    return {
      id: s.id, cls: s.cls, cp: s.cp, teamId: s.teamId, teamName: s.teamName, members: members,
      present: s.present && s.present.length ? s.present : members.map(function (m) { return m.key; }), absent: s.absent || [],
      scores: scoresForSession(s), memo: s.memo || '', notes: s.notes || {}, markers: s.markers || [],
      audio: { has: !!s.audioId, remote: !!s.audioId, url: s.audioUrl }, scale: s.scale || 3,
      startedAt: s.startedAt, durationSec: s.durationSec, final: true, savedAt: s.savedAt,
      sync: { session: 'done', audio: s.audioId ? 'done' : 'none', stt: s.sttStatus === '완료' ? 'done' : 'none' }
    };
  }

  // ── 올리기 ───────────────────────────────────────────────────────────
  function pendingCount() {
    var n = S.pendingTeams.filter(function (t) { return t._pending; }).length;
    S.drafts.forEach(function (d) {
      if (!d.final) return;
      if (d.sync.session === 'pending' || d.sync.session === 'error') n++;
      else if (d.sync.audio === 'pending' || d.sync.audio === 'error') n++;
    });
    return n;
  }
  function errorCount() { return S.drafts.filter(function (d) { return d.final && (d.sync.session === 'error' || d.sync.audio === 'error'); }).length; }

  function blobToB64(buf, mime) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(String(fr.result).split(',')[1] || ''); };
      fr.onerror = function () { rej(fr.error); };
      fr.readAsDataURL(new Blob([buf], { type: mime }));
    });
  }

  function sessionPayload(d) {
    var cp = cpById(d.cp) || { items: [], no: '', title: '' };
    var levels = levelsFor(d.scale);
    var top = levels[0].v;
    var total = 0, max = 0, rows = [];
    var nameOf = {}; d.members.forEach(function (m) { nameOf[m.key] = m.name; });
    cp.items.forEach(function (it) {
      var v = d.scores[it.id];
      if (it.unit === 'individual') {
        Object.keys(v || {}).forEach(function (k) { if (v[k]) rows.push({ target: k, name: nameOf[k] || k, item: it.id, title: it.title, unit: 'individual', v: v[k] }); });
      } else {
        max += top;
        if (v) { total += v; rows.push({ target: '팀', name: '', item: it.id, title: it.title, unit: 'team', v: v }); }
      }
    });
    var present = d.present.map(function (k) { return k; });
    var absent = d.members.filter(function (m) { return d.present.indexOf(m.key) === -1; }).map(function (m) { return m.key; });
    var notes = {}; Object.keys(d.notes || {}).forEach(function (k) { if (d.notes[k]) notes[k] = d.notes[k]; });
    return {
      session: { id: d.id, cls: d.cls, cp: d.cp, teamId: d.teamId, teamName: d.teamName, startedAt: d.startedAt, durationSec: Math.round(d.durationSec || 0),
        present: present, absent: absent, total: total, max: max, scale: d.scale, memo: d.memo, notes: notes, markers: d.markers, device: device() },
      scores: rows
    };
  }

  function syncAll() {
    if (!S.cfg) return Promise.resolve();
    // 올리는 중에 새 기록이 생기면 끝난 뒤 한 번 더 돈다(다음 정기 올리기까지 1분을 기다리지 않게)
    if (S.syncing) { S.syncAgain = true; return Promise.resolve(); }
    S.syncAgain = false;
    S.syncing = true; renderSync();
    var chain = Promise.resolve();
    // 1) 팀
    S.pendingTeams.filter(function (t) { return t._pending; }).forEach(function (t) {
      chain = chain.then(function () {
        var p = t._deleted ? api('deleteTeam', { id: t.id }) : api('saveTeam', { team: t });
        return p.then(function () { t._pending = false; lsSet('oral.pendingTeams', S.pendingTeams); })
          .catch(function (e) { console.warn('팀 올리기 실패', t.name, e); });
      });
    });
    // 2) 기록 → 녹음 → 전사
    S.drafts.filter(function (d) { return d.final; }).sort(function (a, b) { return String(a.savedAt).localeCompare(String(b.savedAt)); }).forEach(function (d) {
      chain = chain.then(function () {
        if (d.sync.session === 'done') return;
        var p = sessionPayload(d);
        return api('saveSession', p, { timeout: 60000 }).then(function () { d.sync.session = 'done'; d.error = ''; return saveDraft(d); })
          .catch(function (e) { d.sync.session = 'error'; d.error = e.message; return saveDraft(d).then(function () { throw e; }); });
      }).then(function () {
        if (d.sync.audio !== 'pending' && d.sync.audio !== 'error') return;
        return idb.get('audio', d.id).then(function (a) {
          if (!a) { d.sync.audio = 'none'; return saveDraft(d); }
          return blobToB64(a.buf, a.mime).then(function (b64) {
            var cp = cpById(d.cp) || {};
            return api('uploadAudio', { id: d.id, mime: a.mime, b64: b64, durationSec: Math.round(a.duration || d.durationSec || 0),
              cls: d.cls, cp: d.cp, cpLabel: (cp.no || '') + (cp.title ? ' ' + cp.title : ''), teamName: d.teamName }, { timeout: 240000 });
          }).then(function (r) {
            d.sync.audio = 'done'; d.audio.remote = true; d.audio.url = r.url; d.error = '';
            var eng = settings().stt_engine;
            if (eng && eng !== 'none' && eng !== 'local' && settings().auto_transcribe !== false) d.sync.stt = 'pending';
            return saveDraft(d);
          });
        }).catch(function (e) { d.sync.audio = 'error'; d.error = e.message; return saveDraft(d).then(function () { throw e; }); });
      }).then(function () {
        if (d.sync.stt !== 'pending') return;
        return api('transcribe', { id: d.id }, { timeout: 330000 }).then(function (r) {
          d.sync.stt = r.skipped ? 'none' : 'done'; if (r.text) d.transcript = r.text; return saveDraft(d);
        }).catch(function (e) { d.sync.stt = 'error'; d.sttError = e.message; return saveDraft(d); });
      }).catch(function (e) { console.warn('올리기 실패', d.id, e); });
    });
    return chain.then(function () {
      S.syncing = false;
      if (S.pendingTeams.every(function (t) { return !t._pending; })) { S.pendingTeams = []; lsSet('oral.pendingTeams', []); }
      return loadBoot(true);
    }).catch(function () { S.syncing = false; }).then(function () {
      S.syncing = false; renderSync(); if (S.ui.tab !== 'eval' || $('#sheet').hidden) render();
      if (S.syncAgain) return syncAll();
    });
  }
  window.addEventListener('online', function () { S.online = true; renderSync(); syncAll(); });
  window.addEventListener('offline', function () { S.online = false; renderSync(); });
  setInterval(function () { if (pendingCount() && navigator.onLine) syncAll(); }, 60000);

  // ── 머리·탭 ──────────────────────────────────────────────────────────
  function renderHeader() {
    var seg = $('#clsSeg'); seg.innerHTML = '';
    classes().forEach(function (c) {
      seg.appendChild(h('button', { type: 'button', class: c === curCls() ? 'on' : '', role: 'tab', 'aria-selected': c === curCls() ? 'true' : 'false',
        onclick: function () { S.ui.cls = c; saveUi(); render(); } }, c));
    });
    var row = $('#cpRow'); row.innerHTML = '';
    checkpoints().forEach(function (c) {
      var short = c.id === 'final' ? '최종' : c.no;
      row.appendChild(h('button', { type: 'button', class: c.id === (curCp() || {}).id ? 'on' : '', role: 'tab',
        onclick: function () { S.ui.cp = c.id; saveUi(); render(); } }, short, h('span', { class: 'l' }, c.id === 'final' ? c.title : c.title.split('·')[0])));
    });
    document.documentElement.style.setProperty('--cp', cpColor(curCp()));
    var title = settings().app_title; if (title) { $('.brand .t').textContent = title; document.title = title; }
    var on = row.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
    $('#cpRow').hidden = S.ui.tab === 'settings' || S.ui.tab === 'queue';
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === S.ui.tab); });
    renderSync();
  }
  function renderSync() {
    var p = $('#syncPill'); var n = pendingCount(); var err = errorCount();
    p.className = 'sync-pill';
    if (!S.cfg) { p.textContent = '연결 안 됨'; p.classList.add('error'); return; }
    if (S.syncing) { p.textContent = '올리는 중…'; p.classList.add('pending'); return; }
    if (!navigator.onLine) { p.textContent = '오프라인' + (n ? ' · ' + n : ''); p.classList.add('pending'); return; }
    if (err) { p.textContent = '실패 ' + err; p.classList.add('error'); return; }
    if (n) { p.textContent = '대기 ' + n; p.classList.add('pending'); return; }
    p.textContent = '저장됨'; p.classList.add('ok');
  }
  $('#syncPill').addEventListener('click', function () { S.ui.tab = 'queue'; saveUi(); render(); syncAll(); });
  document.querySelectorAll('#tabs button').forEach(function (b) {
    b.addEventListener('click', function () { S.ui.tab = b.dataset.tab; saveUi(); render(); window.scrollTo(0, 0); });
  });

  function render() {
    renderHeader();
    var v = $('#view'); v.innerHTML = '';
    if (!S.cfg && S.ui.tab !== 'settings') v.appendChild(connectCard());
    if (S.ui.tab === 'board') renderBoard(v);
    else if (S.ui.tab === 'queue') renderQueue(v);
    else if (S.ui.tab === 'settings') renderSettings(v);
    else renderHome(v);
  }

  function connectCard() {
    return h('div', { class: 'card' },
      h('b', null, '시트에 아직 연결되지 않았습니다'),
      h('p', { class: 'small muted' }, '연결 링크로 열면 바로 연결됩니다. 홈 화면에 추가한 앱이라면 설정에서 연결 링크를 붙여 넣으세요. 연결 전에도 평가와 녹음은 기기에 저장됩니다.'),
      h('button', { type: 'button', class: 'btn', onclick: function () { S.ui.tab = 'settings'; saveUi(); render(); } }, '설정 열기'));
  }

  // ── 평가 목록 ────────────────────────────────────────────────────────
  function renderHome(v) {
    var cp = curCp(); var cls = curCls();
    if (!cp) { v.appendChild(h('div', { class: 'empty' }, '회차 정보가 없습니다.')); return; }
    var teams = teamsOf(cls);
    var done = teams.filter(function (t) { return latestSession(t.id, cp.id); });
    var nextTeam = teams.filter(function (t) { return !latestSession(t.id, cp.id); })[0];
    var teamItems = cp.items.filter(function (it) { return it.unit !== 'individual'; }).length;
    var perMax = teamItems * levelsFor(settings().scale)[0].v;
    var avg = done.length ? done.reduce(function (a, t) { return a + (latestSession(t.id, cp.id).total || 0); }, 0) / done.length : 0;
    var pct = teams.length ? Math.round(done.length / teams.length * 100) : 0;
    var head = h('div', { class: 'card cp-head' },
      h('div', { class: 'row', style: 'align-items:center;gap:12px' },
        h('div', { class: 'cp-no' }, cp.id === 'final' ? '최종' : cp.no),
        h('div', { class: 'grow' }, h('div', { class: 't' }, cp.title), h('div', { class: 'tiny' }, cp.lesson + ' · ' + (cp.format || '') + ' · 팀당 약 ' + cp.minutes + '분'))),
      h('div', { class: 'stats' },
        h('div', null, h('b', null, String(done.length)), h('span', null, ' / ' + teams.length + '팀 완료')),
        perMax && done.length ? h('div', null, h('span', null, '팀 점수 평균 '), h('b', null, avg.toFixed(1)), h('span', null, ' / ' + perMax)) : null),
      h('div', { class: 'progress' }, h('div', { class: 'bar' }, h('i', { style: 'width:' + pct + '%' }))),
      h('div', { class: 'opener' }, h('span', { class: 'lab' }, '시작 질문'), cp.opener));
    v.appendChild(head);

    var list = h('div', { class: 'teams' });
    if (!teams.length) {
      list.appendChild(h('div', { class: 'card empty' }, h('div', { class: 'big', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/></svg>' }),
        h('div', { style: 'font-weight:900;margin-top:4px' }, cls + ' 팀을 등록해 주세요'),
        h('div', { class: 'small', style: 'margin:6px 0 14px' }, '배정한 팀 명단을 한 번에 붙여 넣거나, 한 팀씩 입력합니다.'),
        h('div', { class: 'row', style: 'justify-content:center;flex-wrap:wrap' },
          h('button', { type: 'button', class: 'btn sun', onclick: function () { pasteTeams(); } }, '명단 붙여 넣기'),
          h('button', { type: 'button', class: 'btn', onclick: function () { editTeam(null); } }, '+ 한 팀씩 입력'))));
    }
    teams.forEach(function (t, idx) {
      var s = latestSession(t.id, cp.id);
      var dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, checkpoints().map(function (c) {
        var cs = latestSession(t.id, c.id);
        var cls2 = cs ? (cs.max ? ratioClass(cs.total / cs.max) : 'hi') : '';
        return h('i', { class: cls2 + (c.id === cp.id ? ' cur' : ''), title: (c.id === 'final' ? '최종' : c.no) + (cs && cs.max ? ' ' + cs.total + '/' + cs.max : '') });
      }));
      var members = parseMembers(t.members).map(function (m) { return m.name; }).join(' · ');
      var st;
      if (s) {
        var ratio = s.max ? s.total / s.max : 0;
        var local = s._src === 'local' && (s.sync.session !== 'done' || s.sync.audio === 'pending' || s.sync.audio === 'error');
        st = h('div', { class: 'st' }, h('div', { class: 'score' }, s.max ? (s.total + '/' + s.max) : '완료'),
          h('span', { class: 'badge ' + (local ? 'mid' : ratioClass(ratio)) }, local ? '올리기 대기' : '저장됨'));
      } else {
        st = h('div', { class: 'st' }, h('span', { class: 'badge' }, '미평가'));
      }
      list.appendChild(h('button', { type: 'button', class: 'team' + (s ? ' done' : '') + (nextTeam && nextTeam.id === t.id ? ' next' : ''),
        onclick: function () { openSession(t.id, cp.id); } },
        h('div', { class: 'num' + (s ? ' ok' : (nextTeam && nextTeam.id === t.id ? ' nx' : '')) }, s ? '✓' : String(idx + 1)),
        h('div', { class: 'grow' }, h('div', { class: 'nm' }, t.name, t.method ? h('span', { class: 'mth' }, t.method) : null), h('div', { class: 'mb' }, members || '팀원 미등록'), dots), st));
    });
    v.appendChild(list);
    if (teams.length) v.appendChild(h('div', { class: 'row wrap', style: 'margin-top:14px' },
      h('button', { type: 'button', class: 'btn grow', onclick: function () { editTeam(null); } }, '+ 팀 추가'),
      h('button', { type: 'button', class: 'btn', onclick: function () { pasteTeams(); } }, '붙여 넣기'),
      h('button', { type: 'button', class: 'btn', 'aria-label': '새로 고침', onclick: function () { loadBoot(false); } }, '↻')));
  }

  // ── 팀 편집 ──────────────────────────────────────────────────────────
  function modal(build) {
    var back = h('div', { class: 'modal-back', onclick: function (e) { if (e.target === back) close(); } });
    var box = h('div', { class: 'modal' });
    function close() { back.remove(); }
    build(box, close);
    back.appendChild(box); document.body.appendChild(back);
    return close;
  }
  function nextTeamName(cls) {
    var nums = teamsOf(cls).map(function (t) { var m = String(t.name).match(/^(\d+)\s*팀/); return m ? Number(m[1]) : 0; });
    var n = nums.length ? Math.max.apply(null, nums) + 1 : 1;
    return n + '팀';
  }
  function editTeam(team, chained) {
    var cls = team ? team.cls : curCls();
    modal(function (box, close) {
      var name = h('input', { type: 'text', value: team ? team.name : nextTeamName(cls), placeholder: '예: 1팀 몸값연구소' });
      var members = h('textarea', { placeholder: '한 줄에 한 명: 학번 이름\n20203 김도윤\n20211 박서연' });
      members.value = team ? parseMembers(team.members).map(function (m) { return (m.sid ? m.sid + ' ' : '') + m.name; }).join('\n') : '';
      var repo = h('input', { type: 'url', value: team ? team.repo || '' : '', placeholder: 'https://github.com/…' });
      var q = h('input', { type: 'text', value: team ? team.question || '' : '', placeholder: '~는 정말 ~인가' });
      box.appendChild(h('h3', null, team ? '팀 수정' : cls + ' 팀 추가'));
      box.appendChild(h('label', { class: 'f' }, '팀 이름')); box.appendChild(name);
      box.appendChild(h('label', { class: 'f' }, '팀원')); box.appendChild(members);
      box.appendChild(h('label', { class: 'f' }, '저장소 주소(선택)')); box.appendChild(repo);
      box.appendChild(h('label', { class: 'f' }, '질문(선택)')); box.appendChild(q);
      box.appendChild(h('div', { class: 'row', style: 'margin-top:16px' },
        team ? h('button', { type: 'button', class: 'btn danger', onclick: function () {
          if (!confirm(team.name + ' 팀을 지울까요? 이미 저장한 평가 기록은 시트에 남습니다.')) return;
          upsertPendingTeam(Object.assign({}, team, { _deleted: true })); close(); render();
        } }, '삭제') : null,
        h('span', { class: 'grow' }),
        h('button', { type: 'button', class: 'btn', onclick: close }, '닫기'),
        team ? null : h('button', { type: 'button', class: 'btn', onclick: function () { if (save()) { close(); render(); toast(cls + ' ' + name.value.trim() + ' 저장'); editTeam(null, true); } } }, '저장 후 다음'),
        h('button', { type: 'button', class: 'btn primary', onclick: function () { if (save()) { close(); render(); toast('팀을 저장했습니다'); } } }, '저장')));
      function save() {
        if (!name.value.trim()) { name.focus(); return false; }
        var list = parseMembers(members.value.replace(/\n/g, ' / '));
        upsertPendingTeam({ id: team ? team.id : uid('T'), cls: cls, name: name.value.trim(),
          members: list.map(function (m) { return (m.sid ? m.sid + ' ' : '') + m.name; }).join(' / '),
          repo: repo.value.trim(), question: q.value.trim(), memo: team ? team.memo || '' : '' });
        return true;
      }
      if (chained) box.insertBefore(h('div', { class: 'tiny', style: 'margin-bottom:4px' }, '이어서 다음 팀을 입력합니다. 다 넣었으면 닫기를 누릅니다.'), box.firstChild);
      setTimeout(function () { (team ? name : members).focus(); }, 60);
    });
  }
  function upsertPendingTeam(t, noSync) {
    t._pending = true;
    var i = S.pendingTeams.findIndex(function (x) { return x.id === t.id; });
    if (i === -1) S.pendingTeams.push(t); else S.pendingTeams[i] = t;
    lsSet('oral.pendingTeams', S.pendingTeams);
    if (!noSync) syncAll();
  }

  // ── 명단 붙여 넣기 ───────────────────────────────────────────────────
  // 시트에서 복사한 표(학생마다 한 줄 또는 팀마다 한 줄), "1팀: 20203 김도윤, 20211 박서연",
  // 팀 이름 줄 아래에 학생을 한 줄씩 적은 목록을 모두 받는다.
  // 반은 반 칸(B반 등) → 학번 앞자리(설정 class_codes) → 지금 고른 반 순서로 정한다.
  function classCodes() {
    var map = {};
    String(settings().class_codes || '').split(',').forEach(function (pair) {
      var m = pair.split(/[=:]/); if (m.length === 2 && m[0].trim() && m[1].trim()) map[m[1].trim()] = m[0].trim();
    });
    return map; // { '202': 'B반' }
  }
  function isSid(t) { return /^\d{5}$/.test(t); }
  function isName(t) { return !!t && /^[가-힣]{2,4}$/.test(t) && !/(팀|조|반)$/.test(t); }
  function normCls(t) {
    var m = String(t).match(/^([A-Za-z])\s*반$/); if (m) return m[1].toUpperCase() + '반';
    if (classes().indexOf(t) !== -1) return t;
    var codes = classCodes(); if (codes[t]) return codes[t];
    return null;
  }
  function clsFromSid(sid) { var codes = classCodes(); return codes[String(sid).slice(0, 3)] || null; }
  function parseRoster(text, defaultCls) {
    var groups = []; var byKey = {}; var last = null; var auto = 0;
    function group(cls, label) {
      var k = cls + '|' + label;
      if (!byKey[k]) { byKey[k] = { cls: cls, name: label, members: [] }; groups.push(byKey[k]); }
      return byKey[k];
    }
    function labelOf(parts) {
      var l = parts.join(' ').replace(/\s+/g, ' ').trim();
      if (/^\d+$/.test(l)) l += '팀';
      return l;
    }
    String(text || '').split(/\r?\n/).forEach(function (line) {
      // 반 이름 뒤 괄호(예: "E반(201, 월수금)")는 반 이름만 남긴다
      var raw = line.trim().replace(/([A-Za-z]\s*반)\s*[(（][^)）]*[)）]/g, '$1'); if (!raw) return;
      var cells = raw.split(/\t|,|;|\||\/|·|:|：/).map(function (c) { return c.trim(); }).filter(Boolean);
      var toks = [];
      cells.forEach(function (c) { c.split(/[\s()（）\[\]]+/).filter(Boolean).forEach(function (t) { toks.push(t); }); });
      if (!toks.some(isSid) && toks.every(function (t) { return /^(반|팀|팀명|팀이름|이름|학번|번호|성명|조|팀원)$/.test(t); })) return; // 머리글 행
      var cls = null, labelParts = [], people = [];
      var sidIdx = []; toks.forEach(function (t, i) { if (isSid(t)) sidIdx.push(i); });
      if (sidIdx.length) {
        // 학번-이름 순서인지 이름-학번 순서인지: 짝이 더 많이 맞는 쪽
        var after = sidIdx.filter(function (i) { return isName(toks[i + 1]); }).length;
        var before = sidIdx.filter(function (i) { return isName(toks[i - 1]); }).length;
        var dir = before > after ? -1 : 1;
        var used = {};
        sidIdx.forEach(function (i) {
          var j = i + dir; var nm = '';
          if (isName(toks[j]) && !used[j]) { nm = toks[j]; used[j] = true; }
          used[i] = true; people.push({ sid: toks[i], name: nm || toks[i] });
        });
        var clsTok = '';
        toks.forEach(function (t, i) { if (used[i]) return; var c = normCls(t); if (c) { cls = c; clsTok = t; } else labelParts.push(t); });
        // 팀 이름은 원래 줄에서 학번·이름·반만 빼고 남은 글자로 만든다(괄호 같은 기호를 살린다)
        var rest = raw;
        people.forEach(function (p) { rest = rest.replace(p.sid, ' '); if (p.name !== p.sid) rest = rest.replace(p.name, ' '); });
        if (clsTok) rest = rest.replace(clsTok, ' ');
        rest = rest.replace(/\(\s*\)|（\s*）/g, ' ').replace(/[\t,;|\/·:：]+/g, ' ').replace(/\s+/g, ' ').trim();
        if (labelParts.length) labelParts = rest ? [rest] : labelParts;
      } else {
        // 학번이 없는 줄: "1팀: 김도윤, 박서연" · "몸값연구소" · "김도윤 박서연"
        var rest = toks.filter(function (t) { var c = normCls(t); if (c) { cls = c; return false; } return true; });
        var first = cells.length > 1 ? cells[0] : null;
        if (first && !isName(first) && !normCls(first)) {
          labelParts = [first];
          var firstToks = first.split(/\s+/);
          rest = rest.filter(function (t) { return firstToks.indexOf(t) === -1; });
        } else if (rest.length && (!isName(rest[0]) || rest.length === 1)) {
          labelParts = [rest.shift()];
        }
        rest.filter(isName).forEach(function (n) { people.push({ sid: '', name: n }); });
      }
      var label = labelOf(labelParts);
      if (!cls && people.length && people[0].sid) cls = clsFromSid(people[0].sid);
      // 팀 이름만 있는 줄: 다음 줄의 학생들이 이 팀으로 들어온다(반은 학생의 학번으로 정한다)
      if (!people.length) { if (label) last = { name: label, cls: cls, pending: true }; return; }
      if (!label) {
        if (last && people.length <= 1) { label = last.name; cls = cls || last.cls; }
        else { auto++; label = auto + '팀'; }
      }
      cls = cls || (last && last.name === label ? last.cls : null) || defaultCls;
      if (last && last.pending && last.name === label) last.pending = false;
      var g = group(cls, label); last = g;
      people.forEach(function (p) {
        if (!g.members.some(function (m) { return (p.sid && m.sid === p.sid) || (!p.sid && m.name === p.name); })) g.members.push(p);
      });
    });
    return groups;
  }
  function pasteTeams() {
    modal(function (box, close) {
      var ta = h('textarea', { style: 'min-height:150px', placeholder: '여기에 붙여 넣기' });
      var prev = h('div', { class: 'paste-prev' });
      var go = h('button', { type: 'button', class: 'btn primary', disabled: true }, '가져오기');
      var parsed = [];
      var codes = classCodes();
      var codeText = Object.keys(codes).map(function (k) { return k + '→' + codes[k]; }).join(', ');
      box.appendChild(h('h3', null, '팀 명단 붙여 넣기'));
      box.appendChild(h('p', { class: 'small muted', style: 'margin:0 0 8px' }, '스프레드시트에서 복사한 표나 아래 같은 목록을 그대로 붙여 넣습니다. '
        + (codeText ? '반은 학번 앞자리로 나눕니다(' + codeText + '). ' : '') + '반을 알 수 없으면 지금 고른 ' + curCls() + '으로 넣습니다.'));
      box.appendChild(h('div', { class: 'example' }, '1팀: 20203 김도윤, 20211 박서연, 20219 이준호\n2팀 20207 오태양 20214 윤하린\n\n또는 표(반·팀·학번·이름)를 복사해 붙여 넣기'));
      box.appendChild(h('p', { class: 'tiny', style: 'margin:6px 2px 0' }, '반 칸이 없으면 모두 지금 고른 ' + curCls() + '으로 들어갑니다.'));
      box.appendChild(h('div', { style: 'margin-top:10px' }, ta));
      box.appendChild(prev);
      function update() {
        parsed = parseRoster(ta.value, curCls());
        prev.innerHTML = '';
        var n = 0;
        parsed.forEach(function (g) {
          n += g.members.length;
          var exists = allTeams().some(function (t) { return t.cls === g.cls && t.name === g.name; });
          var warn = g.members.length < 2 || g.members.some(function (m) { return !m.sid; });
          prev.appendChild(h('div', { class: 'pt' + (warn ? ' warn' : '') },
            h('div', { class: 'row' }, h('b', { class: 'grow' }, g.cls + ' · ' + g.name), exists ? h('span', { class: 'badge mid' }, '팀원 바꿈') : h('span', { class: 'badge hi' }, '새 팀')),
            h('div', { class: 'small muted' }, g.members.map(function (m) { return (m.sid ? m.sid + ' ' : '') + m.name; }).join(' · ') || '팀원 없음'),
            warn ? h('div', { class: 'tiny' }, g.members.length < 2 ? '팀원이 2명보다 적습니다' : '학번이 없는 팀원이 있습니다') : null));
        });
        go.disabled = !parsed.length;
        go.textContent = parsed.length ? parsed.length + '팀 · ' + n + '명 가져오기' : '가져오기';
      }
      ta.addEventListener('input', update);
      box.appendChild(h('div', { class: 'row', style: 'margin-top:14px' }, h('span', { class: 'grow' }),
        h('button', { type: 'button', class: 'btn', onclick: close }, '취소'), go));
      go.addEventListener('click', function () {
        parsed.forEach(function (g) {
          var ex = allTeams().filter(function (t) { return t.cls === g.cls && t.name === g.name; })[0];
          upsertPendingTeam({ id: ex ? ex.id : uid('T'), cls: g.cls, name: g.name,
            members: g.members.map(function (m) { return (m.sid ? m.sid + ' ' : '') + m.name; }).join(' / '),
            repo: ex ? ex.repo || '' : '', question: ex ? ex.question || '' : '', memo: ex ? ex.memo || '' : '' }, true);
        });
        close(); render(); syncAll(); toast(parsed.length + '팀을 등록했습니다');
      });
      setTimeout(function () { ta.focus(); }, 60);
    });
  }

  // ── 메모 문구: 누르면 메모에 한 줄로 넣고, 다시 누르면 뺀다 ──────────────
  function phrases(kind) {
    var mp = boot().memoPhrases || (window.ORAL_SEED || {}).memo_phrases || {};
    return (mp[kind] || []).filter(Boolean);
  }
  function phraseRow(kind, ta, foldable) {
    var row = h('div', { class: 'phr' });
    var open = !foldable;
    function paint() {
      row.innerHTML = '';
      phrases(kind).forEach(function (p) {
        var on = ta.value.split('\n').some(function (l) { return l.trim() === p; });
        if (!open && !on) return;
        row.appendChild(h('button', { type: 'button', class: on ? 'on' : '', onclick: function () {
          var lines = ta.value.split('\n');
          if (on) lines = lines.filter(function (l) { return l.trim() !== p; });
          else { lines = lines.filter(function (l, i) { return l.trim() || i < lines.length - 1; }); lines.push(p); }
          ta.value = lines.join('\n').replace(/^\n+/, '');
          ta.dispatchEvent(new Event('input'));
          paint();
        } }, (on ? '✓ ' : '+ ') + p));
      });
      if (foldable) row.appendChild(h('button', { type: 'button', class: 'fold', onclick: function () { open = !open; paint(); } }, open ? '접기' : '+ 문구 고르기'));
    }
    ta.addEventListener('input', function () { if (document.activeElement === ta) paint(); });
    paint();
    return row;
  }

  // ── 평가 화면 ────────────────────────────────────────────────────────
  function openSession(teamId, cpId, forceNew) {
    var team = teamById(teamId); var cp = cpById(cpId);
    if (!team || !cp) return;
    var d = S.drafts.filter(function (x) { return x.teamId === teamId && x.cp === cpId && !x.final; })[0];
    if (!d && !forceNew) {
      var s = latestSession(teamId, cpId);
      if (s) d = s._src === 'local' ? JSON.parse(JSON.stringify(S.drafts.filter(function (x) { return x.id === s.id; })[0])) : draftFromServer(s, team);
    }
    if (!d) d = newDraft(team, cp);
    // 팀원이 바뀌었으면 새 팀원을 더한다
    parseMembers(team.members).forEach(function (m) {
      if (!d.members.some(function (x) { return x.key === m.key; })) { d.members.push(m); if (!d.final) d.present.push(m.key); }
    });
    renderSession(d, team, cp);
  }

  function renderSession(d, team, cp) {
    var sheet = $('#sheet'); sheet.innerHTML = ''; sheet.hidden = false; document.body.style.overflow = 'hidden';
    sheet.style.setProperty('--cp', cpColor(cp));
    var dirty = false;
    var levels = levelsFor(d.scale);
    var picked = null;
    // 저장 막대의 요소는 루브릭이 그려질 때 이미 있어야 한다(paintSave가 쓴다)
    var saveBtn = h('button', { type: 'button', class: 'btn primary grow' }, '저장');
    var info = h('div', { class: 'tiny' });
    function touch() { dirty = true; if (!d.final) saveDraftSoon(d); }

    function close() {
      if (Rec.state !== 'idle') { if (!confirm('녹음 중입니다. 녹음을 끝내고 나갈까요?')) return; stopRec().then(doClose); return; }
      doClose();
    }
    function doClose() {
      Rec.onTick = null;
      if (dirty && d.final) {
        if (!confirm('바꾼 내용을 저장하지 않고 나갈까요?')) return;
      }
      if (!d.final && (dirty || d.audio.has)) saveDraft(d);
      sheet.hidden = true; sheet.innerHTML = ''; document.body.style.overflow = ''; render();
    }

    // 머리
    sheet.appendChild(h('div', { class: 'bar-top' },
      h('button', { type: 'button', class: 'btn ghost', onclick: close }, '‹ 목록'),
      h('div', { class: 'ttl' }, team.name + ' · ' + (cp.id === 'final' ? '최종' : cp.no)),
      h('button', { type: 'button', class: 'btn ghost', onclick: function () { sessionMenu(); } }, '⋯')));
    var inner = h('div', { class: 'inner' }); sheet.appendChild(inner);

    function sessionMenu() {
      modal(function (box, closeM) {
        box.appendChild(h('h3', null, team.name));
        if (team.repo) box.appendChild(h('a', { class: 'btn block', href: team.repo, target: '_blank', rel: 'noopener', style: 'display:block;text-align:center;text-decoration:none' }, '저장소 열기'));
        box.appendChild(h('button', { type: 'button', class: 'btn block', style: 'margin-top:8px', onclick: function () { closeM(); sheet.hidden = true; document.body.style.overflow = ''; editTeam(team); } }, '팀 정보 수정'));
        if (d.final) box.appendChild(h('button', { type: 'button', class: 'btn block', style: 'margin-top:8px', onclick: function () {
          closeM(); openSession(team.id, cp.id, true);
        } }, '이 회차를 새 기록으로 다시 평가'));
        if (d.final) box.appendChild(h('button', { type: 'button', class: 'btn block danger', style: 'margin-top:8px', onclick: function () {
          if (!confirm(team.name + ' 팀의 이 회차 기록을 지울까요? 시트의 점수와 드라이브의 녹음도 함께 지워집니다.')) return;
          closeM();
          var done = function () {
            return idb.del('drafts', d.id).then(function () { return idb.del('audio', d.id); }).then(function () {
              S.drafts = S.drafts.filter(function (x) { return x.id !== d.id; });
              if (S.boot) { S.boot.sessions = (S.boot.sessions || []).filter(function (x) { return x.id !== d.id; }); S.boot.scores = (S.boot.scores || []).filter(function (x) { return x.sid !== d.id; }); lsSet('oral.boot', S.boot); }
              Rec.onTick = null; sheet.hidden = true; sheet.innerHTML = ''; document.body.style.overflow = ''; render(); toast('기록을 지웠습니다');
            });
          };
          if (S.cfg && d.sync.session === 'done') api('deleteSession', { id: d.id }).then(done).catch(function (e) { toast('삭제 실패: ' + e.message); });
          else done();
        } }, '이 기록 삭제'));
        box.appendChild(h('button', { type: 'button', class: 'btn block', style: 'margin-top:8px', onclick: closeM }, '닫기'));
      });
    }

    // 이전 회차 요약
    var prev = checkpoints().filter(function (c) { return c.id !== cp.id; }).map(function (c) { return { c: c, s: latestSession(team.id, c.id) }; }).filter(function (x) { return x.s; });
    if (prev.length) {
      var det = h('details', { class: 'card more' }, h('summary', null, '이전 회차 ' + prev.length + '개'));
      prev.forEach(function (x) {
        det.appendChild(h('div', { style: 'margin-top:10px' },
          h('div', { class: 'row' }, h('b', { class: 'grow' }, (x.c.id === 'final' ? '최종' : x.c.no) + ' ' + x.c.title), h('span', { class: 'badge' }, x.s.max ? x.s.total + '/' + x.s.max : '')),
          x.s.memo ? h('div', { class: 'small muted' }, x.s.memo) : null));
      });
      inner.appendChild(det);
    }

    // 참석
    var attend = h('div', { class: 'card' });
    function renderAttend() {
      attend.innerHTML = '';
      attend.appendChild(h('div', { class: 'row' }, h('div', { class: 'sec-t grow' }, h('span', { class: 'step' }, '1'), '참석'), h('span', { class: 'tiny' }, '누르면 결석으로 바뀝니다')));
      var chips = h('div', { class: 'chips', style: 'margin-top:8px' });
      d.members.forEach(function (m) {
        var on = d.present.indexOf(m.key) !== -1;
        chips.appendChild(h('button', { type: 'button', class: 'chip' + (on ? '' : ' off'), onclick: function () {
          if (on) d.present = d.present.filter(function (k) { return k !== m.key; }); else d.present.push(m.key);
          touch(); renderAttend(); renderPick(); renderRubric(); renderNotes();
        } }, m.name));
      });
      if (!d.members.length) chips.appendChild(h('span', { class: 'small muted' }, '팀원이 등록되지 않았습니다(⋯ → 팀 정보 수정).'));
      attend.appendChild(chips);
    }
    renderAttend(); inner.appendChild(attend);

    // 방법 선택(팀에 저장, 다음 회차에도 이어짐)
    var methodCard = h('div', { class: 'method-row' });
    function renderMethod() {
      methodCard.innerHTML = '';
      var cur = (teamById(team.id) || team).method || '';
      var names = Object.keys(boot().methods || {});
      if (!names.length) names = ['회귀', '분류', '군집'];
      var seg = h('div', { class: 'seg mseg' });
      names.forEach(function (m) {
        seg.appendChild(h('button', { type: 'button', class: cur === m ? 'on' : '', onclick: function () {
          var nt = Object.assign({}, teamById(team.id) || team, { method: cur === m ? '' : m });
          team.method = nt.method; upsertPendingTeam(nt); renderMethod(); renderHint();
        } }, m));
      });
      methodCard.appendChild(h('span', { class: 'lab' }, '방법'));
      methodCard.appendChild(seg);
    }
    renderMethod(); attend.appendChild(methodCard);

    // 녹음
    var recCard = h('div', { class: 'card rec-card' });
    var clock = h('div', { class: 'clock' }, mmss(d.durationSec || 0));
    var meter = h('div', { class: 'meter' }, h('i'));
    var recBtn = h('button', { type: 'button', class: 'rec-btn' }, '녹음');
    // 목표 시간 대비 경과를 보여 주는 링
    var ring = h('div', { class: 'ring', html: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="trk" cx="50" cy="50" r="46"/><circle class="val" cx="50" cy="50" r="46" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>' });
    var ringVal = ring.querySelector('.val');
    var recHint = h('div', { class: 'tiny' }, '');
    var recActions = h('div', { class: 'rec-actions' });
    var warn = h('div', { class: 'warnbox', id: 'recWarn', hidden: true }, '화면이 꺼지거나 다른 앱으로 넘어간 동안 녹음이 멈췄을 수 있습니다. 녹음 중에는 화면을 켜 두세요.');
    recCard.appendChild(h('div', { class: 'row', style: 'margin-bottom:10px' }, h('div', { class: 'sec-t grow' }, h('span', { class: 'step' }, '2'), '녹음'), h('span', { class: 'tiny' }, '목표 ' + cp.minutes + '분')));
    recCard.appendChild(h('div', { class: 'rec' }, h('div', { class: 'rec-wrap' }, ring, recBtn), h('div', { class: 'grow' }, clock, meter, recHint)));
    recCard.appendChild(recActions); recCard.appendChild(warn);
    inner.appendChild(recCard);

    function paintRec() {
      var st = Rec.id === d.id ? Rec.state : 'idle';
      recBtn.className = 'rec-btn' + (st === 'recording' ? ' on' : st === 'paused' ? ' paused' : (d.audio.has ? ' has' : ''));
      recBtn.textContent = st === 'recording' ? '일시정지' : st === 'paused' ? '계속' : (d.audio.has ? '다시' : '녹음');
      recActions.innerHTML = '';
      if (st !== 'idle') recActions.appendChild(h('button', { type: 'button', class: 'btn danger', onclick: function () { stopRec(); } }, '녹음 끝내기'));
      if (st === 'idle' && d.audio.has) {
        recHint.textContent = (d.audio.remote ? '드라이브에 올라감' : '기기에 저장됨') + (d.audio.size ? ' · ' + Math.round(d.audio.size / 1024) + 'KB' : '') + (d.audio.recovered ? ' · 복구된 녹음' : '');
        recActions.appendChild(h('button', { type: 'button', class: 'btn', onclick: playLocal }, '들어 보기'));
      } else if (st === 'idle') {
        recHint.textContent = S.cfg ? '누르면 녹음이 시작됩니다' : '시트 연결 전에도 기기에 녹음됩니다';
      } else {
        recHint.textContent = st === 'paused' ? '일시정지됨' : '녹음 중 · 화면을 켜 두세요';
      }
    }
    function playLocal() {
      idb.get('audio', d.id).then(function (a) {
        if (a) { var url = URL.createObjectURL(new Blob([a.buf], { type: a.mime })); var au = new Audio(url); au.play(); toast('재생 중'); }
        else if (d.audio.url) window.open(d.audio.url, '_blank');
        else toast('기기에 녹음이 없습니다');
      });
    }
    function startRec() {
      if (d.audio.has && !confirm('지금 녹음을 지우고 다시 녹음할까요?')) return;
      Rec.start(d.id).then(function () {
        if (!d.startedAt) d.startedAt = new Date().toISOString();
        d.audio = { has: false }; d.markers = []; touch(); paintRec(); renderTimeline();
      }).catch(function (e) { toast('녹음 시작 실패: ' + e.message); });
    }
    function stopRec() {
      return Rec.stop().then(function (info) {
        if (info) {
          d.audio = { has: true, mime: info.mime, size: info.size, duration: info.duration };
          d.durationSec = info.duration;
          if (d.final) d.sync.audio = 'pending';
          touch(); saveDraft(d);
        }
        paintRec();
      });
    }
    recBtn.addEventListener('click', function () {
      var st = Rec.id === d.id ? Rec.state : 'idle';
      if (st === 'idle') {
        if (Rec.state !== 'idle') { toast('다른 팀의 녹음이 진행 중입니다'); return; }
        startRec();
      } else if (st === 'recording') { Rec.pause(); paintRec(); }
      else { Rec.resume(); paintRec(); }
    });
    Rec.onTick = function () {
      if (Rec.id !== d.id || Rec.state === 'idle') { meter.firstChild.style.width = '0%'; return; }
      var sec = Rec.elapsed();
      clock.textContent = mmss(sec);
      var stage = sec > cp.minutes * 60 + 60 ? ' over' : sec > cp.minutes * 60 ? ' warn' : '';
      clock.className = 'clock' + stage;
      ring.className = 'ring on' + stage;
      ringVal.style.strokeDashoffset = String(100 - Math.min(100, sec / (cp.minutes * 60) * 100));
      meter.firstChild.style.width = Math.round(Rec.level() * 100) + '%';
    };
    if (Rec.state !== 'idle' && Rec.id === d.id) Rec.loop();
    paintRec();

    // 지목·질문
    var qCard = h('div', { class: 'card q-card' });
    qCard.appendChild(h('div', { class: 'sec-t' }, h('span', { class: 'step' }, '3'), '질문'));
    qCard.appendChild(h('div', { class: 'label', style: 'margin-top:10px' }, '시작 질문'));
    qCard.appendChild(h('div', { class: 'opener-big' }, cp.opener));
    var hint = h('div', { class: 'mhint' });
    function renderHint() {
      var m = (teamById(team.id) || team).method; var info = m && (boot().methods || {})[m];
      hint.innerHTML = '';
      hint.hidden = !info || !/c3|c4|final/.test(cp.id);
      if (info) hint.appendChild(h('span', null, h('b', null, m), ' · 수업 지표 ' + info.metrics + ' · 베이스라인 ' + info.baseline));
    }
    renderHint(); qCard.appendChild(hint);
    var pickWrap = h('div', { style: 'margin-top:12px' });
    var fq = h('div', { class: 'fq' });
    var tl = h('div', { class: 'timeline' });
    qCard.appendChild(h('div', { class: 'label' }, '지목 · 누르면 녹음 시각이 표시됩니다'));
    qCard.appendChild(pickWrap);
    qCard.appendChild(h('div', { class: 'label' }, '꼬리질문'));
    qCard.appendChild(fq); qCard.appendChild(tl);
    inner.appendChild(qCard);
    function mark(kind, key, label) {
      var t = Rec.id === d.id && Rec.state !== 'idle' ? Math.round(Rec.elapsed()) : null;
      d.markers.push({ t: t, kind: kind, key: key || '', label: label });
      touch(); renderTimeline();
    }
    function renderPick() {
      pickWrap.innerHTML = '';
      var chips = h('div', { class: 'chips' });
      d.members.filter(function (m) { return d.present.indexOf(m.key) !== -1; }).forEach(function (m) {
        var n = d.markers.filter(function (x) { return x.kind === 'student' && x.key === m.key; }).length;
        chips.appendChild(h('button', { type: 'button', class: 'chip' + (picked === m.key ? ' pick' : ''), onclick: function () {
          picked = m.key; mark('student', m.key, m.name); renderPick(); renderNotes(m.key);
        } }, m.name, n ? h('span', { class: 'n' }, String(n)) : null));
      });
      pickWrap.appendChild(chips);
    }
    function renderFq() {
      fq.innerHTML = '';
      cp.followups.forEach(function (q) {
        var used = d.markers.some(function (x) { return x.kind === 'question' && x.label === q; });
        fq.appendChild(h('button', { type: 'button', class: used ? 'used' : '', onclick: function () {
          var who = picked ? (d.members.filter(function (m) { return m.key === picked; })[0] || {}).name : '';
          mark('question', picked || '', q + (who ? ' → ' + who : '')); renderFq();
        } }, q));
      });
    }
    function renderTimeline() {
      tl.innerHTML = '';
      d.markers.slice(-12).forEach(function (x) {
        tl.appendChild(h('span', null, (x.t !== null && x.t !== undefined ? mmss(x.t) + ' ' : '') + (x.kind === 'student' ? '지목 ' : '') + (x.label.length > 24 ? x.label.slice(0, 24) + '…' : x.label)));
      });
    }
    renderPick(); renderFq(); renderTimeline();

    // 루브릭
    var rubCard = h('div', { class: 'card' });
    inner.appendChild(rubCard);
    var showAll = false;
    function levelButtons(item, current, onPick, small) {
      var wrap = h('div', { class: 'levels n' + levels.length });
      levels.forEach(function (lv) {
        wrap.appendChild(h('button', { type: 'button', class: lv.cls + (current === lv.v ? ' on' : ''), 'aria-pressed': current === lv.v ? 'true' : 'false',
          onclick: function () { onPick(current === lv.v ? null : lv.v); } }, lv.label));
      });
      return wrap;
    }
    function renderRubric() {
      rubCard.innerHTML = '';
      rubCard.appendChild(h('div', { class: 'row' }, h('div', { class: 'sec-t grow' }, h('span', { class: 'step' }, '4'), '루브릭'),
        h('span', { class: 'tiny' }, levels.length === 3 ? '상·중·하' : '5단계'),
        h('button', { type: 'button', class: 'btn ghost', style: 'min-height:34px;padding:4px 8px', onclick: function () { showAll = !showAll; renderRubric(); } }, showAll ? '기준 접기' : '기준 보기')));
      var teamSum = 0, teamMax = 0;
      var rule = boot().elementRule;
      if (rule) rubCard.appendChild(h('div', { class: 'rule' }, rule));
      cp.items.forEach(function (it) {
        var box = h('div', { class: 'item' });
        box.appendChild(h('div', { class: 'it' }, h('b', null, it.title), h('span', { class: 'badge' + (it.unit === 'individual' ? ' accent' : '') }, it.unit === 'individual' ? '개인' : '팀'), h('span', { class: 'tiny' }, it.axis)));
        if (it.elements && it.elements.length) box.appendChild(h('ul', { class: 'elems' }, it.elements.map(function (e) { return h('li', null, e); })));
        if (it.unit === 'individual') {
          var cur = d.scores[it.id] || {};
          d.members.filter(function (m) { return d.present.indexOf(m.key) !== -1; }).forEach(function (m) {
            box.appendChild(h('div', { class: 'indiv-row' }, h('div', { class: 'who' }, m.name),
              levelButtons(it, cur[m.key] || null, function (v) {
                d.scores[it.id] = Object.assign({}, d.scores[it.id] || {}); if (v) d.scores[it.id][m.key] = v; else delete d.scores[it.id][m.key];
                touch(); renderRubric();
              })));
          });
        } else {
          var v = d.scores[it.id] || null;
          teamMax += levels[0].v; if (v) teamSum += v;
          box.appendChild(levelButtons(it, v, function (nv) { if (nv) d.scores[it.id] = nv; else delete d.scores[it.id]; touch(); renderRubric(); }));
          if (v && !showAll) {
            var lv = levels.filter(function (x) { return x.v === v; })[0];
            box.appendChild(h('div', { class: 'desc' }, descOf(it, lv.d)));
          }
        }
        if (showAll) box.appendChild(h('div', { class: 'desc all' },
          h('p', null, h('b', null, '상 '), it.high), h('p', null, h('b', null, '중 '), it.mid), h('p', null, h('b', null, '하 '), it.low)));
        rubCard.appendChild(box);
      });
      if (teamMax) rubCard.appendChild(h('div', { class: 'sum' }, h('span', { class: 'grow' }, '팀 점수'), h('span', null, teamSum + ' / ' + teamMax)));
      paintSave();
    }
    renderRubric();

    // 메모
    var memoCard = h('div', { class: 'card' });
    var memo = h('textarea', { placeholder: '(선택) 총평. 대화는 녹음과 전사로 남습니다.' });
    memo.value = d.memo || '';
    memo.addEventListener('input', function () { d.memo = memo.value; touch(); });
    memoCard.appendChild(h('div', { class: 'sec-t' }, h('span', { class: 'step' }, '5'), '메모'));
    memoCard.appendChild(h('div', { class: 'note' }, h('div', { class: 'who' }, '팀 총평'), phrases('team').length ? phraseRow('team', memo) : null, memo));
    var notesWrap = h('div');
    memoCard.appendChild(notesWrap);
    inner.appendChild(memoCard);
    function renderNotes(focusKey) {
      notesWrap.innerHTML = '';
      d.members.filter(function (m) { return d.present.indexOf(m.key) !== -1; }).forEach(function (m) {
        var ta = h('textarea', { placeholder: '(선택) ' + m.name + ' 메모' });
        ta.value = (d.notes || {})[m.key] || '';
        ta.addEventListener('input', function () { d.notes = d.notes || {}; d.notes[m.key] = ta.value; touch(); });
        notesWrap.appendChild(h('div', { class: 'note' }, h('div', { class: 'who' }, m.name), phrases('student').length ? phraseRow('student', ta, true) : null, ta));
        if (focusKey === m.key && !isIOS()) setTimeout(function () { ta.focus(); }, 30);
      });
    }
    renderNotes();

    // 저장 막대
    sheet.appendChild(h('div', { class: 'bar-bottom' }, h('div', { class: 'in' }, h('div', { style: 'max-width:46%' }, info), saveBtn)));
    function paintSave() {
      var need = cp.items.filter(function (it) { return it.unit !== 'individual'; }).filter(function (it) { return !d.scores[it.id]; }).length;
      info.textContent = need ? '팀 항목 ' + need + '개 남음' : (d.final ? '저장된 기록 · 고치면 다시 저장' : '모든 팀 항목 입력됨');
    }
    saveBtn.addEventListener('click', function () {
      var go = function () {
        var need = cp.items.filter(function (it) { return it.unit !== 'individual' && !d.scores[it.id]; }).length;
        if (need && !confirm('입력하지 않은 팀 항목이 ' + need + '개 있습니다. 그대로 저장할까요?')) return;
        d.final = true; d.savedAt = new Date().toISOString();
        d.sync.session = 'pending';
        if (d.audio.has && !d.audio.remote) d.sync.audio = 'pending';
        saveDraft(d).then(function () {
          dirty = false; Rec.onTick = null;
          sheet.hidden = true; sheet.innerHTML = ''; document.body.style.overflow = '';
          render(); syncAll();
          var next = teamsOf(curCls()).filter(function (t) { return t.id !== team.id && !latestSession(t.id, cp.id); })[0];
          toast(team.name + ' 저장', next ? { label: '다음: ' + next.name, fn: function () { openSession(next.id, cp.id); } } : null);
        });
      };
      if (Rec.id === d.id && Rec.state !== 'idle') stopRec().then(go); else go();
    });
    paintSave();
    sheet.scrollTop = 0;
  }

  // ── 현황 ─────────────────────────────────────────────────────────────
  function renderBoard(v) {
    var cls = curCls(); var teams = teamsOf(cls); var cps = checkpoints();
    v.appendChild(h('div', { class: 'h2' }, cls + ' 회차별 팀 점수'));
    v.appendChild(h('div', { class: 'board-sum' }, cps.map(function (c) {
      var n = teams.filter(function (t) { return latestSession(t.id, c.id); }).length;
      return h('div', { class: 'bs' + (n && n === teams.length ? ' full' : '') },
        h('span', { class: 'k' }, c.id === 'final' ? '최종' : c.no), h('b', null, String(n)), h('span', { class: 'of' }, '/' + teams.length));
    })));
    var table = h('table');
    table.appendChild(h('thead', null, h('tr', null, h('th', null, '팀'), cps.map(function (c) { return h('th', null, c.id === 'final' ? '최종' : c.no); }))));
    var tb = h('tbody');
    teams.forEach(function (t) {
      tb.appendChild(h('tr', null, h('td', null, t.name), cps.map(function (c) {
        var s = latestSession(t.id, c.id);
        if (!s) return h('td', { class: 'c none', onclick: function () { S.ui.cp = c.id; S.ui.tab = 'eval'; saveUi(); render(); openSession(t.id, c.id); } }, '·');
        var r = s.max ? s.total / s.max : 1;
        return h('td', { class: 'c ' + ratioClass(r), onclick: function () { showDetail(s, t, c); } }, h('span', null, s.max ? s.total + '/' + s.max : '✓'));
      })));
    });
    table.appendChild(tb);
    v.appendChild(teams.length ? h('div', { class: 'board' }, table) : h('div', { class: 'card empty' }, '팀이 없습니다.'));
    var sheetUrl = boot().sheetUrl;
    if (sheetUrl) v.appendChild(h('p', { class: 'small muted', style: 'margin-top:12px' }, '전체 기록은 ', h('a', { href: sheetUrl, target: '_blank', rel: 'noopener' }, '구글 시트'), '의 ‘요약’·‘기록’·‘점수’ 탭에 있습니다.'));
  }

  function showDetail(s, team, cp) {
    modal(function (box, close) {
      box.appendChild(h('h3', null, team.name + ' · ' + (cp.id === 'final' ? '최종' : cp.no) + ' ' + cp.title));
      box.appendChild(h('div', { class: 'tiny' }, kst(s.startedAt || s.savedAt) + (s.durationSec ? ' · ' + mmss(s.durationSec) : '') + (s.absent && s.absent.length ? ' · 결석 ' + s.absent.join(', ') : '')));
      var sc = scoresForSession(s); var lv = levelsFor(s.scale);
      var label = function (v) { var x = lv.filter(function (l) { return l.v === v; })[0]; return x ? x.label : v; };
      var list = h('div', { class: 'card', style: 'margin-top:10px' });
      cp.items.forEach(function (it) {
        var val = sc[it.id];
        var txt = it.unit === 'individual' ? Object.keys(val || {}).map(function (k) { return k + ' ' + label(val[k]); }).join(', ') : (val ? label(val) : '—');
        list.appendChild(h('div', { class: 'row', style: 'padding:4px 0' }, h('span', { class: 'grow' }, it.title), h('b', null, txt || '—')));
      });
      box.appendChild(list);
      if (s.memo) box.appendChild(h('div', { class: 'card' }, h('b', null, '메모'), h('div', { class: 'small', style: 'white-space:pre-wrap;margin-top:4px' }, s.memo)));
      var notes = s.notes || {};
      if (Object.keys(notes).length) box.appendChild(h('div', { class: 'card' }, h('b', null, '학생 메모'), Object.keys(notes).map(function (k) { return h('div', { class: 'small', style: 'margin-top:4px' }, h('b', null, k + ' '), notes[k]); })));
      if (s.markers && s.markers.length) box.appendChild(h('div', { class: 'card' }, h('b', null, '표시'), h('div', { class: 'timeline' }, s.markers.map(function (x) { return h('span', null, (x.t !== null && x.t !== undefined ? mmss(x.t) + ' ' : '') + x.label); }))));
      var tr = h('div', { class: 'card' }, h('div', { class: 'row' }, h('b', { class: 'grow' }, '녹음·전사'), s.audioUrl || (s.audio && s.audio.url) ? h('a', { href: s.audioUrl || s.audio.url, target: '_blank', rel: 'noopener' }, '녹음 열기') : h('span', { class: 'tiny' }, '녹음 없음')));
      var trBody = h('div', { class: 'transcript', style: 'margin-top:8px' }, s.transcript || '불러오는 중…');
      tr.appendChild(trBody);
      var again = h('button', { type: 'button', class: 'btn', style: 'margin-top:8px' }, '전사 요청');
      again.addEventListener('click', function () {
        again.disabled = true; trBody.textContent = '받아 적는 중… (1분 안팎)';
        api('transcribe', { id: s.id }, { timeout: 330000 }).then(function (r) { trBody.textContent = r.skipped ? '전사 엔진이 꺼져 있습니다(설정).' : r.text; again.disabled = false; })
          .catch(function (e) { trBody.textContent = '실패: ' + e.message; again.disabled = false; });
      });
      tr.appendChild(again);
      box.appendChild(tr);
      if (S.cfg) api('getSession', { id: s.id }).then(function (r) { trBody.textContent = r.session.transcript || '아직 전사가 없습니다.'; }).catch(function () { trBody.textContent = s.transcript || '시트에서 불러오지 못했습니다.'; });
      box.appendChild(h('div', { class: 'row', style: 'margin-top:12px' }, h('span', { class: 'grow' }),
        h('button', { type: 'button', class: 'btn', onclick: function () { close(); S.ui.cp = cp.id; S.ui.tab = 'eval'; saveUi(); render(); openSession(team.id, cp.id); } }, '수정'),
        h('button', { type: 'button', class: 'btn primary', onclick: close }, '닫기')));
    });
  }

  // ── 기록(올리기 상태) ─────────────────────────────────────────────────
  function stepBadge(label, st) {
    var map = { done: 'hi', pending: 'mid', error: 'lo', none: '' };
    var word = { done: '완료', pending: '대기', error: '실패', none: '없음' }[st] || st;
    return h('span', { class: 'badge ' + (map[st] || '') }, label + ' ' + word);
  }
  function renderQueue(v) {
    v.appendChild(h('div', { class: 'row' }, h('div', { class: 'h2 grow' }, '이 기기의 기록'),
      h('button', { type: 'button', class: 'btn', onclick: function () { syncAll(); } }, '지금 올리기')));
    var list = S.drafts.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    if (!list.length) { v.appendChild(h('div', { class: 'card empty' }, '아직 기기에 저장된 기록이 없습니다.')); }
    else {
      var card = h('div', { class: 'card' });
      list.forEach(function (d) {
        var cp = cpById(d.cp) || { no: d.cp, title: '' };
        card.appendChild(h('div', { class: 'q-item' },
          h('div', { class: 'grow' },
            h('div', null, h('b', null, d.teamName), ' ', h('span', { class: 'tiny' }, d.cls + ' · ' + (cp.id === 'final' ? '최종' : cp.no) + ' · ' + kst(d.savedAt || d.updatedAt))),
            h('div', { class: 'steps' }, d.final ? [stepBadge('기록', d.sync.session), stepBadge('녹음', d.sync.audio), stepBadge('전사', d.sync.stt)] : h('span', { class: 'badge mid' }, '작성 중(저장 전)')),
            d.error ? h('div', { class: 'tiny', style: 'color:var(--lo)' }, d.error) : null),
          h('button', { type: 'button', class: 'btn ghost', onclick: function () { openSession(d.teamId, d.cp); } }, '열기')));
      });
      v.appendChild(card);
    }
    var uploaded = S.drafts.filter(function (d) { return d.final && d.sync.session === 'done' && d.sync.audio !== 'pending' && d.sync.audio !== 'error'; });
    v.appendChild(h('div', { class: 'card' },
      h('b', null, '기기 정리'),
      h('p', { class: 'small muted' }, '시트와 드라이브에 다 올라간 기록 ' + uploaded.length + '개를 이 기기에서 지웁니다. 시트의 기록과 드라이브의 녹음은 그대로 남습니다.'),
      h('button', { type: 'button', class: 'btn', disabled: !uploaded.length, onclick: function () {
        if (!confirm('올라간 기록 ' + uploaded.length + '개를 이 기기에서 지울까요?')) return;
        Promise.all(uploaded.map(function (d) { return idb.del('drafts', d.id).then(function () { return idb.del('audio', d.id); }); })).then(function () {
          S.drafts = S.drafts.filter(function (d) { return uploaded.indexOf(d) === -1; }); render(); toast('정리했습니다');
        });
      } }, '올라간 기록 지우기')));
  }

  // ── 설정 ─────────────────────────────────────────────────────────────
  function renderSettings(v) {
    var st = settings();
    // 연결
    var conn = h('div', { class: 'card' });
    conn.appendChild(h('b', null, '시트 연결'));
    if (S.cfg) {
      conn.appendChild(h('p', { class: 'small muted' }, '연결됨' + (boot().sheetUrl ? '' : ' (아직 불러오지 않음)')));
      var r = h('div', { class: 'row wrap' });
      if (boot().sheetUrl) r.appendChild(h('a', { class: 'btn', href: boot().sheetUrl, target: '_blank', rel: 'noopener', style: 'text-decoration:none' }, '시트 열기'));
      r.appendChild(h('button', { type: 'button', class: 'btn', onclick: function () {
        api('ping').then(function () { toast('연결 정상'); }).catch(function (e) { toast('연결 실패: ' + e.message); });
      } }, '연결 확인'));
      r.appendChild(h('button', { type: 'button', class: 'btn', onclick: function () { loadBoot(false); } }, '새로 불러오기'));
      r.appendChild(h('button', { type: 'button', class: 'btn danger', onclick: function () {
        if (!confirm('이 기기에서 연결 정보를 지울까요? 기기에 남은 기록은 그대로 둡니다.')) return;
        S.cfg = null; lsSet('oral.cfg', null); render();
      } }, '연결 끊기'));
      conn.appendChild(r);
    } else {
      var url = h('input', { type: 'url', placeholder: '연결 링크 전체를 붙여 넣기' });
      var tok = h('input', { type: 'password', placeholder: '연결 토큰(웹 앱 주소를 따로 넣을 때만)' });
      conn.appendChild(h('label', { class: 'f' }, '연결 링크 또는 웹 앱 주소')); conn.appendChild(url);
      conn.appendChild(h('label', { class: 'f' }, '토큰')); conn.appendChild(tok);
      conn.appendChild(h('button', { type: 'button', class: 'btn primary', style: 'margin-top:12px', onclick: function () {
        var c = parseConnect(url.value);
        if (!c && (!url.value.trim() || !tok.value.trim())) { toast('연결 링크를 통째로 붙여 넣거나 주소와 토큰을 모두 넣으세요'); return; }
        S.cfg = c || { url: url.value.trim(), token: tok.value.trim() }; lsSet('oral.cfg', S.cfg);
        api('ping').then(function () { toast('연결했습니다'); loadBoot(true); syncAll(); }).catch(function (e) { toast('연결 실패: ' + e.message); });
      } }, '연결'));
      conn.appendChild(h('p', { class: 'tiny' }, '홈 화면에 추가한 앱은 사파리와 저장 공간이 달라 여기서 한 번 더 연결합니다. 연결 링크(…#connect=…)를 길게 눌러 복사해 위 칸에 붙여 넣고 연결을 누르세요.'));
    }
    v.appendChild(conn);

    // 척도
    var scale = h('div', { class: 'card' });
    scale.appendChild(h('b', null, '점수 척도'));
    scale.appendChild(h('p', { class: 'small muted' }, '새로 시작하는 기록부터 적용됩니다. 저장된 기록은 저장할 때의 척도를 그대로 씁니다.'));
    var seg = h('div', { class: 'seg', style: 'margin-left:0' });
    [3, 5].forEach(function (n) {
      seg.appendChild(h('button', { type: 'button', class: Number(st.scale || 3) === n ? 'on' : '', onclick: function () {
        updateSetting({ scale: n });
      } }, n === 3 ? '상·중·하' : '5단계'));
    });
    scale.appendChild(seg);
    v.appendChild(scale);

    // 전사
    var stt = h('div', { class: 'card' });
    stt.appendChild(h('b', null, '녹음 전사'));
    stt.appendChild(h('p', { class: 'small muted' }, '녹음을 글로 옮기는 방식입니다. 외부 서비스(Gemini·OpenAI)를 고르면 학생 음성이 그 회사로 전송됩니다. 아래 전사 테스트로 비교한 뒤 정합니다.'));
    var sel = h('select');
    [['none', '사용 안 함(녹음만 저장)'], ['gemini', 'Gemini' + (st.keys && st.keys.gemini ? '' : ' (키 없음)')], ['openai', 'OpenAI' + (st.keys && st.keys.openai ? '' : ' (키 없음)')], ['local', '맥에서 일괄(로컬 Whisper)']].forEach(function (o) {
      var op = h('option', { value: o[0] }, o[1]); if ((st.stt_engine || 'none') === o[0]) op.selected = true; sel.appendChild(op);
    });
    sel.addEventListener('change', function () { updateSetting({ stt_engine: sel.value }); });
    stt.appendChild(sel);
    var auto = h('label', { class: 'row', style: 'margin-top:10px' }, h('input', { type: 'checkbox', checked: st.auto_transcribe !== false, onchange: function (e) { updateSetting({ auto_transcribe: e.target.checked ? 'TRUE' : 'FALSE' }); } }), h('span', { class: 'small' }, '녹음을 올리면 바로 전사'));
    stt.appendChild(auto);
    stt.appendChild(h('p', { class: 'tiny' }, 'Gemini 모델 ' + (st.gemini_model || '-') + ' · OpenAI 모델 ' + (st.openai_model || '-') + ' (시트 ‘설정’ 탭에서 바꿉니다)'));
    v.appendChild(stt);

    // 마이크 점검
    v.appendChild(micCheckCard());
    // 전사 테스트
    v.appendChild(sttTestCard());

    // 녹음 옵션
    var opt = h('div', { class: 'card' });
    opt.appendChild(h('b', null, '녹음 옵션'));
    opt.appendChild(h('label', { class: 'row', style: 'margin-top:8px' }, h('input', { type: 'checkbox', checked: S.prefs.noise !== false, onchange: function (e) { S.prefs.noise = e.target.checked; lsSet('oral.prefs', S.prefs); Rec.release(); toast('다음 녹음부터 적용'); } }), h('span', { class: 'small' }, '잡음 억제·울림 제거(교실이 시끄러우면 켭니다)')));
    v.appendChild(opt);

    // 앱 정보
    var about = h('div', { class: 'card' });
    about.appendChild(h('b', null, '앱 정보'));
    about.appendChild(h('p', { class: 'small muted' }, '버전 ' + APP_VERSION + ' · 루브릭 ' + ((window.ORAL_SEED || {}).version || '-') + ' · ' + device()));
    about.appendChild(h('p', { class: 'small muted' }, '아이폰에서는 사파리 공유 버튼 → ‘홈 화면에 추가’로 설치하면 앱처럼 열립니다. 마이크 허용을 매번 묻지 않게 하려면 설정 앱 → 사파리 → 마이크 → 허용으로 둡니다.'));
    if (navigator.storage && navigator.storage.estimate) {
      var est = h('p', { class: 'tiny' }, '');
      navigator.storage.estimate().then(function (e) { est.textContent = '기기 저장 공간 사용 ' + Math.round((e.usage || 0) / 1048576) + 'MB'; });
      about.appendChild(est);
    }
    v.appendChild(about);
  }
  function updateSetting(obj) {
    var b = boot(); b.settings = Object.assign({}, b.settings, obj);
    if (obj.auto_transcribe !== undefined) b.settings.auto_transcribe = obj.auto_transcribe === 'TRUE';
    if (obj.scale) b.settings.scale = Number(obj.scale);
    S.boot = b; lsSet('oral.boot', b); render();
    if (!S.cfg) { toast('연결 뒤에 시트에 반영됩니다'); return; }
    api('saveSettings', { settings: obj }).then(function () { toast('설정을 시트에 저장했습니다'); }).catch(function (e) { toast('설정 저장 실패: ' + e.message); });
  }

  function micCheckCard() {
    var card = h('div', { class: 'card' });
    card.appendChild(h('b', null, '마이크 점검'));
    card.appendChild(h('p', { class: 'small muted' }, '수신기를 아이폰에 연결한 뒤 시작을 누르고, 선생님 마이크와 학생 마이크에 차례로 말해 봅니다. 막대가 움직이면 정상입니다.'));
    var info = h('div', { class: 'tiny' });
    var m1 = h('div', { class: 'meter' }, h('i'));
    var two = h('div', { class: 'meter two', hidden: true }, h('span', null, h('i')), h('span', null, h('i')));
    var btn = h('button', { type: 'button', class: 'btn', style: 'margin-top:10px' }, '점검 시작');
    var running = false;
    btn.addEventListener('click', function () {
      if (running) { running = false; Rec.onTick = null; btn.textContent = '점검 시작'; if (Rec.state === 'idle') Rec.release(); return; }
      Rec.ensureStream().then(function () {
        if (Rec.ctx && Rec.ctx.state === 'suspended') Rec.ctx.resume();
        running = true; btn.textContent = '점검 끝내기';
        var ti = Rec.trackInfo() || {};
        info.textContent = '입력 장치: ' + (ti.label || '알 수 없음') + ' · 채널 ' + ti.channels + (ti.rate ? ' · ' + ti.rate + 'Hz' : '')
          + (ti.channels >= 2 ? ' · 위 막대=왼쪽 채널, 아래 막대=오른쪽 채널. 마이크마다 다른 막대가 움직이면 두 목소리가 따로 들어오는 것입니다.' : ' · 두 마이크 소리가 한 채널로 섞여 들어옵니다. 화자 구분은 전사 단계에서 합니다.');
        two.hidden = !(Rec.analysers.length >= 2);
        Rec.onTick = function () {
          m1.firstChild.style.width = Math.round(Rec.level() * 100) + '%';
          if (Rec.analysers.length >= 2) {
            two.children[0].firstChild.style.width = Math.round(Rec.level(Rec.analysers[0]) * 100) + '%';
            two.children[1].firstChild.style.width = Math.round(Rec.level(Rec.analysers[1]) * 100) + '%';
          }
          if (!running) Rec.onTick = null;
        };
        Rec.loop();
      }).catch(function (e) { toast('마이크를 열지 못했습니다: ' + e.message); });
    });
    card.appendChild(m1); card.appendChild(two); card.appendChild(info); card.appendChild(btn);
    return card;
  }

  function sttTestCard() {
    var card = h('div', { class: 'card' });
    card.appendChild(h('b', null, '전사 테스트'));
    card.appendChild(h('p', { class: 'small muted' }, '30초~1분 정도 두 마이크로 대화를 녹음한 뒤, 고른 엔진으로 같은 녹음을 받아 적어 비교합니다. 결과는 시트의 ‘전사 테스트’ 탭에도 남습니다. 맥의 로컬 Whisper 결과는 맥에서 python3 scripts/oral_local_transcribe.py --tests 를 실행하면 같은 탭에 더해집니다.'));
    var engines = [
      ['gemini:gemini-3.8-flash', 'Gemini 3.8 Flash(최신 · 기본)', true], ['gemini:gemini-3.5-transcribe', 'Gemini 3.5 Transcribe(전사 전용 · 화자 구분)', true],
      ['gemini:gemini-2.5-flash', 'Gemini 2.5 Flash', false],
      ['openai:gpt-4o-transcribe', 'OpenAI gpt-4o-transcribe', false], ['openai:gpt-4o-transcribe-diarize', 'OpenAI 화자 구분(diarize)', false],
      ['local', '로컬 Whisper(맥에서 나중에 실행, 외부 전송 없음)', false]];
    var boxes = engines.map(function (e) {
      var cb = h('input', { type: 'checkbox', value: e[0], checked: e[2] });
      card.appendChild(h('label', { class: 'row small', style: 'margin-top:4px' }, cb, h('span', null, e[1])));
      return cb;
    });
    var clock = h('div', { class: 'clock', style: 'font-size:22px;font-weight:800' }, '0:00');
    var meter = h('div', { class: 'meter' }, h('i'));
    var recBtn = h('button', { type: 'button', class: 'btn' }, '녹음 시작');
    var runBtn = h('button', { type: 'button', class: 'btn primary', disabled: true }, '비교 실행');
    var out = h('div', { class: 'cmp', style: 'margin-top:10px' });
    var testId = 'TEST'; var testAudio = null;
    card.appendChild(h('div', { class: 'row', style: 'margin-top:10px' }, clock, h('div', { class: 'grow' }, meter)));
    card.appendChild(h('div', { class: 'row', style: 'margin-top:10px' }, recBtn, runBtn));
    card.appendChild(out);
    recBtn.addEventListener('click', function () {
      if (Rec.state === 'idle') {
        Rec.start(testId).then(function () {
          recBtn.textContent = '녹음 끝내기'; runBtn.disabled = true;
          Rec.onTick = function () { clock.textContent = mmss(Rec.elapsed()); meter.firstChild.style.width = Math.round(Rec.level() * 100) + '%'; if (Rec.elapsed() > 120) recBtn.click(); };
          Rec.loop();
        }).catch(function (e) { toast('녹음 실패: ' + e.message); });
      } else if (Rec.id === testId) {
        Rec.stop().then(function (info) {
          Rec.onTick = null; recBtn.textContent = '다시 녹음';
          return idb.get('audio', testId).then(function (a) { testAudio = a; runBtn.disabled = !a; if (info) clock.textContent = mmss(info.duration); });
        });
      } else toast('평가 녹음이 진행 중입니다');
    });
    runBtn.addEventListener('click', function () {
      if (!testAudio) return;
      var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
      if (!picked.length) { toast('엔진을 하나 이상 고르세요'); return; }
      runBtn.disabled = true; out.innerHTML = ''; out.appendChild(h('div', { class: 'small muted' }, '받아 적는 중… 엔진 하나에 10~40초'));
      blobToB64(testAudio.buf, testAudio.mime).then(function (b64) {
        return api('sttTest', { b64: b64, mime: testAudio.mime, engines: picked, durationSec: Math.round(testAudio.duration || 0) }, { timeout: 330000 });
      }).then(function (r) {
        out.innerHTML = '';
        r.results.forEach(function (x) {
          if (x.pending) {
            out.appendChild(h('div', { class: 'card' }, h('div', { class: 'row' }, h('b', { class: 'grow' }, '로컬 Whisper(맥)'), h('span', { class: 'badge mid' }, '맥에서 실행 대기')),
              h('pre', null, '녹음을 드라이브 테스트 폴더에 올렸습니다. 맥의 터미널에서\npython3 scripts/oral_local_transcribe.py --tests\n를 실행하면 결과가 시트의 ‘전사 테스트’ 탭에 더해집니다.')));
            return;
          }
          out.appendChild(h('div', { class: 'card' }, h('div', { class: 'row' }, h('b', { class: 'grow' }, x.engine + ' · ' + x.model), h('span', { class: 'badge' }, x.sec + '초')),
            h('pre', null, x.error ? '오류: ' + x.error : x.text)));
        });
        runBtn.disabled = false;
      }).catch(function (e) { out.innerHTML = ''; out.appendChild(h('div', { class: 'small', style: 'color:var(--lo)' }, '실패: ' + e.message)); runBtn.disabled = false; });
    });
    return card;
  }

  // ── 시작 ─────────────────────────────────────────────────────────────
  function init() {
    var connected = readConnectHash();
    if (!S.ui.cls) S.ui.cls = classes()[0];
    if (!S.ui.cp) S.ui.cp = (checkpoints()[0] || {}).id;
    saveUi();
    idb.all('drafts').then(function (list) { S.drafts = (list || []).filter(function (d) { return d.id !== 'TEST'; }); })
      .catch(function (e) { console.warn('IndexedDB 사용 불가', e); toast('이 기기에서는 기기 저장을 쓸 수 없습니다(개인 정보 보호 모드?)'); })
      .then(function () { return recoverChunks().catch(function () {}); })
      .then(function () {
        render();
        if (S.cfg) { loadBoot(true).then(function () { if (connected) toast('시트에 연결했습니다'); syncAll(); }); }
      });
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('서비스 워커 등록 실패', e); });
    }
  }
  window.__oral = { S: S, api: api, syncAll: syncAll, Rec: Rec, idb: idb, parseRoster: parseRoster };
  // gate.js의 '교사 열람 모드' 배지가 아래 탭을 가리므로 이 앱에서는 숨긴다
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el.tagName === 'DIV' && /교사 열람 모드/.test(el.textContent || '') && el.style.position === 'fixed') el.remove();
    });
  });
  init();
})();
