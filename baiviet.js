/* ============================================================
   baiviet.js – CHUNG cho mọi trang bài viết
   Cần nạp SAU data.js. Bài hiện tại lấy từ <body data-id="...">
   ============================================================ */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };

  var DATA = window.ARTICLES || [];
  var currentId = document.body.dataset.id || '';
  var byId = {};
  DATA.forEach(function (a) { byId[a.id] = a; });
  var current = byId[currentId];

  var CATS = {
    'dong-chay': { name: 'DÒNG CHẢY', cls: 'tag-red' },
    'guong-mat': { name: 'GƯƠNG MẶT', cls: 'tag-gold' },
    'tac-pham':  { name: 'TÁC PHẨM',  cls: 'tag-red' },
    'van-hoa':   { name: 'VĂN HÓA',   cls: 'tag-green' }
  };
  var EYE = '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function fmtViews(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n); }
  function byViews(a, b) { return b.views - a.views; }

  /* ---------- Thông báo nhỏ ---------- */
  var toast = $('#toast'), toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  /* ---------- SIDEBAR: Bài viết liên quan ---------- */
  function renderRelated() {
    var box = $('#relatedList');
    if (!box) return;
    var manual = (document.body.dataset.related || '').split(',')
      .map(function (s) { return s.trim(); }).filter(Boolean);
    var list;
    if (manual.length) {
      list = manual.map(function (id) { return byId[id]; }).filter(Boolean);
    } else {
      var others = DATA.filter(function (a) { return a.id !== currentId; });
      var same = others.filter(function (a) { return current && a.cat === current.cat; }).sort(byViews);
      var rest = others.filter(function (a) { return !current || a.cat !== current.cat; }).sort(byViews);
      list = same.concat(rest);
    }
    list = list.filter(function (a) { return a.id !== currentId; }).slice(0, 4);

    box.innerHTML = list.map(function (a, i) {
      var c = CATS[a.cat] || CATS['dong-chay'];
      return '<li><a href="' + esc(a.url) + '">' +
        '<span class="r-thumb g' + (i % 4 + 1) + '"><img src="' + esc(a.thumb) + '" alt=""></span>' +
        '<div><span class="tag ' + c.cls + '">' + c.name + '</span>' +
        '<h4>' + esc(a.title) + '</h4><time class="date">' + esc(a.date) + '</time></div></a></li>';
    }).join('');

    var more = $('#relatedMore');
    if (more && current) more.href = 'giaodienchinh.html?cat=' + current.cat;
  }

  /* ---------- SIDEBAR: Bài viết được xem nhiều ---------- */
  function renderTop() {
    var box = $('#topList');
    if (!box) return;
    box.innerHTML = DATA.slice().sort(byViews).slice(0, 5).map(function (a, i) {
      return '<li><a href="' + esc(a.url) + '"' + (a.id === currentId ? ' class="current"' : '') + '>' +
        '<b>' + (i + 1) + '</b><span>' + esc(a.title) + '</span><em>' + EYE + fmtViews(a.views) + '</em></a></li>';
    }).join('');
  }

  renderRelated();
  renderTop();

  /* ---------- Menu: tô sáng mục chuyên mục của bài này ---------- */
  document.querySelectorAll('.main-nav a[data-cat]').forEach(function (a) {
    a.classList.toggle('active', !!current && a.dataset.cat === current.cat);
  });

  /* ---------- Header đổ bóng, thanh tiến độ đọc, nút lên đầu trang ---------- */
  var header = $('#header'), bar = $('#readProgress'), body = $('#articleBody');
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Lên đầu trang');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 500);
    if (!body || !bar) return;
    var r = body.getBoundingClientRect();
    var total = r.height - window.innerHeight * 0.5;
    var done = Math.min(Math.max(-r.top + window.innerHeight * 0.3, 0), total);
    bar.style.width = (total > 0 ? done / total * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu trên điện thoại ---------- */
  var toggle = $('#menuToggle'), nav = $('#mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- Ảnh chưa có file → ẩn ảnh, hiện nền gradient dự phòng ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    function hide() { img.classList.add('broken'); }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- Thời gian đọc (~200 từ/phút) ---------- */
  var lede = $('.article-lede');
  if (body) {
    var words = (body.innerText + ' ' + (lede ? lede.innerText : '')).trim().split(/\s+/).length;
    $('#readTime').textContent = Math.max(1, Math.round(words / 200)) + ' phút đọc';
  }

  /* ---------- Chia sẻ Facebook ---------- */
  $('#shareFb').addEventListener('click', function () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href),
      '_blank', 'noopener,width=600,height=500');
  });

  /* ---------- Sao chép liên kết ---------- */
  $('#copyLink').addEventListener('click', function () {
    function ok() { showToast('Đã sao chép liên kết'); }
    function fallback() {
      var t = document.createElement('input');
      t.value = location.href; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); ok(); } catch (e) { showToast('Không sao chép được'); }
      t.remove();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(location.href).then(ok, fallback);
    } else { fallback(); }
  });

  /* ---------- Lưu bài viết (mỗi bài lưu theo data-id riêng) ---------- */
  var KEY = 'gdv_saved_articles', bm = $('#bookmark');
  function getSaved() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function setSaved(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
  bm.setAttribute('aria-pressed', getSaved().indexOf(currentId) > -1);
  bm.addEventListener('click', function () {
    var list = getSaved(), saved = list.indexOf(currentId) > -1;
    list = saved ? list.filter(function (x) { return x !== currentId; }) : list.concat(currentId);
    setSaved(list);
    bm.setAttribute('aria-pressed', !saved);
    showToast(saved ? 'Đã bỏ lưu bài viết' : 'Đã lưu bài viết');
  });

  /* ---------- Đăng ký nhận tin ---------- */
  var form = $('#newsletterForm'), input = $('#emailInput'), msg = $('#formMsg');
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!re.test(v)) {
      input.classList.add('error');
      msg.className = 'form-msg err';
      msg.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
      return;
    }
    try {
      var l = JSON.parse(localStorage.getItem('gdv_subscribers') || '[]');
      if (l.indexOf(v) < 0) l.push(v);
      localStorage.setItem('gdv_subscribers', JSON.stringify(l));
    } catch (err) {}
    msg.className = 'form-msg ok';
    msg.textContent = 'Cảm ơn bạn! Bạn đã đăng ký thành công.';
    form.reset();
  });
  input.addEventListener('input', function () { input.classList.remove('error'); msg.textContent = ''; });

  /* ---------- Link "#" (bài chưa có trang): báo thay vì nhảy lên đầu trang ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (a) { e.preventDefault(); showToast('Bài viết này sẽ sớm được cập nhật'); }
  });
})();