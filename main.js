/* ============ GIAI ĐIỆU VIỆT – MAIN JS ============ */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Header: shadow khi cuộn + menu mobile ---------- */
  const header = $('#header');
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Lên đầu trang');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });
  $$('a', mainNav).forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Ảnh lỗi → dùng nền gradient dự phòng ---------- */
  $$('img').forEach(img => {
    const hide = () => img.classList.add('broken');
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- Hero slider ---------- */
  const hero = $('#hero');
  const slides = $$('.hero-slide', hero);
  const dotsWrap = $('.hero-dots', hero);
  let current = 0, timer = null;
  const INTERVAL = 6000;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = $$('button', dotsWrap);

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  function start() { timer = setInterval(() => goTo(current + 1), INTERVAL); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  $('.hero-arrow.prev', hero).addEventListener('click', () => { goTo(current - 1); restart(); });
  $('.hero-arrow.next', hero).addEventListener('click', () => { goTo(current + 1); restart(); });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  // Vuốt trên thiết bị cảm ứng
  let touchX = null;
  hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
    touchX = null;
  });

    // Bấm vào bất kỳ chỗ nào của slide (có data-href) để mở bài viết
  let justSwiped = false;
  hero.addEventListener('touchend', () => { justSwiped = true; setTimeout(() => { justSwiped = false; }, 350); });
  hero.addEventListener('click', e => {
    if (e.target.closest('.hero-arrow, .hero-dots, a')) return;
    const slide = e.target.closest('.hero-slide[data-href]');
    if (slide && slide.classList.contains('active') && !justSwiped) {
      window.location.href = slide.dataset.href;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); restart(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); restart(); }
  });
  goTo(0);
  start();

  /* ---------- Lọc theo chuyên mục + tìm kiếm ---------- */
  const cards = $$('.post-card');
  const info = $('#searchInfo');
  const searchForm = $('#searchForm');
  const searchInput = $('#searchInput');

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const catNames = {
    'dong-chay': 'Dòng chảy', 'guong-mat': 'Gương mặt', 'tac-pham': 'Tác phẩm',
    'van-hoa': 'Văn hóa'
  };

  function showInfo(text) {
    info.hidden = false;
    info.innerHTML = '';
    info.append(text + ' ');
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = 'Xóa bộ lọc';
    b.addEventListener('click', resetFilter);
    info.appendChild(b);
  }
  function resetFilter() {
    cards.forEach(c => c.classList.toggle('is-hidden', c.classList.contains('more')));
    info.hidden = true;
    searchInput.value = '';
    $$('.main-nav a').forEach((a, i) => a.classList.toggle('active', i === 0));
  }
  function filterCategory(cat) {
    let n = 0;
    cards.forEach(c => {
      const ok = c.dataset.cat === cat;
      c.classList.toggle('is-hidden', !ok);
      if (ok) n++;
    });
    showInfo(n ? `Đang xem chuyên mục “${catNames[cat]}” (${n} bài).` : `Chưa có bài viết nào trong “${catNames[cat]}”.`);
  }
  function search(q) {
    const key = norm(q.trim());
    if (!key) return resetFilter();
    let n = 0;
    cards.forEach(c => {
      const text = norm(c.textContent);
      const ok = text.includes(key);
      c.classList.toggle('is-hidden', !ok);
      if (ok) n++;
    });
    showInfo(n ? `Tìm thấy ${n} bài cho “${q.trim()}”.` : `Không tìm thấy bài nào cho “${q.trim()}”.`);
    $('#bai-viet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchForm.addEventListener('submit', e => { e.preventDefault(); search(searchInput.value); });

  $$('[data-cat]').forEach(el => {
    if (el.classList.contains('post-card')) return;
    el.addEventListener('click', e => {
      e.preventDefault();
      const cat = el.dataset.cat;
      filterCategory(cat);
      $$('.main-nav a').forEach(a => a.classList.toggle('active', a.dataset.cat === cat));
      $('#bai-viet').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  // Logo & "Trang chủ" → bỏ lọc và lên đầu trang
  $$('.logo, .main-nav li:first-child a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); resetFilter(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  // Chặn link giả "#"
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* ---------- Đọc nhiều (carousel) ---------- */
  const popular = [
    { tag: 'DÒNG CHẢY', cls: 'tag-red', title: 'Từ băng cassette đến streaming: Người Việt đã nghe nhạc như thế nào?', desc: 'Hành trình thay đổi cách nghe nhạc của người Việt qua các thời kỳ, từ những chiếc băng cassette, đĩa CD cho đến thời đại streaming ngày nay...', date: '28.09.2025', views: '12.4K', img: 'images/cassette1.jpg' },
    { tag: 'GƯƠNG MẶT', cls: 'tag-gold', title: 'Trịnh Công Sơn và dấu ấn riêng trong nền tân nhạc Việt Nam', desc: 'Những giai điệu của ông vẫn sống mãi trong lòng nhiều thế hệ người Việt, như một phần không thể thiếu của ký ức chung...', date: '10.10.2025', views: '9.8K', img: 'images/trinhcongson1.jpg' },
    { tag: 'VĂN HÓA', cls: 'tag-green', title: 'Văn hóa đi concert của giới trẻ Việt Nam đang thay đổi ra sao?', desc: 'Từ những sân khấu nhỏ đến những đại nhạc hội quy mô lớn, concert đang dần trở thành một phần của đời sống tinh thần giới trẻ...', date: '05.10.2025', views: '8.1K', img: 'images/concert1.jpg' }
  ];
  let pi = 0;
  const pBody = $('#popularBody');
  const pImg = $('.popular-thumb img', pBody);

  function renderPopular(i) {
    pi = (i + popular.length) % popular.length;
    const p = popular[pi];
    pBody.classList.add('fade');
    setTimeout(() => {
      const tag = $('#popTag');
      tag.textContent = p.tag;
      tag.className = 'tag ' + p.cls;
      $('#popTitle').textContent = p.title;
      $('#popDesc').textContent = p.desc;
      $('#popDate').textContent = p.date;
      $('#popViewNum').textContent = p.views;
      pImg.classList.remove('broken');
      pImg.src = p.img;
      pBody.classList.remove('fade');
    }, 250);
  }
  $('.pop-prev').addEventListener('click', () => renderPopular(pi - 1));
  $('.pop-next').addEventListener('click', () => renderPopular(pi + 1));

  /* ---------- Form đăng ký nhận tin ---------- */
  const form = $('#newsletterForm');
  const emailInput = $('#emailInput');
  const msg = $('#formMsg');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = emailInput.value.trim();
    if (!emailRe.test(v)) {
      emailInput.classList.add('error');
      msg.className = 'form-msg err';
      msg.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
      return;
    }
    emailInput.classList.remove('error');
    try {
      const list = JSON.parse(localStorage.getItem('gdv_subscribers') || '[]');
      if (!list.includes(v)) list.push(v);
      localStorage.setItem('gdv_subscribers', JSON.stringify(list));
    } catch (_) { /* bỏ qua nếu trình duyệt chặn localStorage */ }
    msg.className = 'form-msg ok';
    msg.textContent = 'Cảm ơn bạn! Bạn đã đăng ký thành công.';
    form.reset();
  });
    emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
    msg.textContent = '';
  });

  /* ---------- Nhận yêu cầu từ trang bài viết: ?q=... hoặc ?cat=... ---------- */
  const params = new URLSearchParams(location.search);
  const qParam = params.get('q');
  const catParam = params.get('cat');
  if (qParam && qParam.trim()) {
    searchInput.value = qParam;
    search(qParam);
  } else if (catParam && catNames[catParam]) {
    filterCategory(catParam);
    $$('.main-nav a').forEach(a => a.classList.toggle('active', a.dataset.cat === catParam));
    $('#bai-viet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();