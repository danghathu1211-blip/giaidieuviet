/* ============================================================
   effects.js – HIỆU ỨNG CHUYỂN TIẾP (dùng chung mọi trang)
   Nạp CUỐI CÙNG, sau main.js / data.js / baiviet.js.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Chuyển trang mượt: mờ đi rồi mới đổi trang ---- */
  function go(url) {
    if (reduce) { location.href = url; return; }
    document.body.classList.add('gdv-leave');
    setTimeout(function () { location.href = url; }, 280);
  }
  window.gdvGo = go; // main.js gọi hàm này cho slide đầu trang

  // Quay lại bằng nút Back của trình duyệt: bỏ trạng thái mờ
  window.addEventListener('pageshow', function () { document.body.classList.remove('gdv-leave'); });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin && u.protocol !== 'file:') return;      // link ra ngoài: giữ nguyên
    if (u.pathname === location.pathname && u.search === location.search) return; // cùng trang
    e.preventDefault();
    go(a.href);
  });

  /* ---- 2. Cuộn tới đâu hiện tới đó ---- */
  var targets = document.querySelectorAll(
    '.section-head, .cat-card, .popular, .newsletter, .site-footer .footer-inner,' +
    '.article-hero, .article-body h2, .article-body p, .side-box'
  );
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.classList.add('gdv-in');
        // Xong thì gỡ lớp hiệu ứng để không ghi đè hiệu ứng rê chuột (hover) của phần tử
        setTimeout(function () { el.classList.remove('gdv-reveal', 'gdv-in'); el.style.removeProperty('--d'); }, 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) return; // đã nằm trong màn hình: khỏi làm mờ
      el.classList.add('gdv-reveal');
      if (el.classList.contains('cat-card')) el.style.setProperty('--d', (Array.prototype.indexOf.call(el.parentNode.children, el) * 0.08) + 's');
      io.observe(el);
    });
  }

  /* ---- 3. Sóng lan tỏa khi bấm nút ---- */
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.btn-primary, .share-btn, .hero-arrow, .pop-prev, .pop-next');
      if (!b) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      var d = document.createElement('span');
      d.className = 'gdv-ripple';
      d.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.style.overflow = 'hidden';
      b.appendChild(d);
      setTimeout(function () { d.remove(); }, 650);
    });
  }
})();