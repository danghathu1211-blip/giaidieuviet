/* ============================================================
   data.js – DANH SÁCH TẤT CẢ BÀI VIẾT (nguồn dữ liệu duy nhất)
   Thêm bài mới = thêm 1 dòng vào đây. Sidebar của mọi bài tự cập nhật.

   id     : mã bài, KHÔNG dấu, KHÔNG trùng (dùng cho <body data-id="...">)
   cat    : dong-chay | guong-mat | tac-pham | van-hoa
   url    : tên file trang bài viết. Bài chưa có trang → để '#'
   thumb  : ảnh nhỏ hiện ở "Bài viết liên quan"
   views  : lượt xem (số). Mục "Xem nhiều" tự sắp theo số này
   ============================================================ */
window.ARTICLES = [
  { id: 'dan-ca-vpop',    cat: 'dong-chay', title: 'Từ dân ca đến V-pop: Hành trình của âm nhạc Việt Nam',          date: '12.10.2025', views: 12400, url: 'baiviet.html',                thumb: 'images/danca1.jpg' },
  { id: 'van-cao',        cat: 'guong-mat', title: 'Văn Cao – người nghệ sĩ đa tài của âm nhạc Việt Nam',           date: '20.09.2025', views: 10800, url: '#',                           thumb: 'images/vancao1.jpg' },
  { id: 'ca-khuc-ky-uc',  cat: 'tac-pham',  title: 'Những ca khúc Việt Nam trở thành ký ức của nhiều thế hệ',       date: '08.10.2025', views: 9700,  url: 'cakhuc.html',         thumb: 'images/cakhuc1.jpg' },
  { id: 'rap-viet',       cat: 'dong-chay', title: 'Rap Việt: Từ văn hóa đường phố đến dòng nhạc đại chúng',        date: '02.10.2025', views: 8300,  url: '#',                           thumb: 'images/rapviet1.jpg' },
  { id: 'indie-viet',     cat: 'dong-chay', title: 'Indie Việt: Khi nghệ sĩ trẻ tìm kiếm một màu sắc riêng',        date: '08.09.2025', views: 6900,  url: '#',                           thumb: 'images/indie1.jpg' },
  { id: 'concert',        cat: 'van-hoa',   title: 'Văn hóa đi concert của giới trẻ Việt Nam đang thay đổi ra sao?', date: '05.10.2025', views: 6500,  url: 'concert.html',        thumb: 'images/concert1.jpg' },
  { id: 'trinh-cong-son', cat: 'guong-mat', title: 'Trịnh Công Sơn và dấu ấn riêng trong nền tân nhạc Việt Nam',    date: '10.10.2025', views: 6100,  url: 'trinhcongson.html',   thumb: 'images/trinhcongson1.jpg' },
  { id: 'nhac-vang',      cat: 'dong-chay', title: 'Nhạc vàng và dấu ấn trong đời sống âm nhạc Việt Nam',           date: '12.10.2025', views: 5600,  url: '#',                           thumb: 'images/nhacvang1.jpg' },
  { id: 'son-tung',           cat: 'guong-mat', title: 'Sơn Tùng M-TP và những thay đổi trong diện mạo V-pop', date: '15.09.2026', views: 7800,  url: '#', thumb: 'images/sontung1.jpg' },
  { id: 'den-vau',            cat: 'guong-mat', title: 'Đen Vâu và cách kể chuyện bằng âm nhạc', date: '10.09.2026', views: 7200,  url: '#', thumb: 'images/denvau1.jpg' },
  { id: 'suc-song-ca-khuc',   
    cat: 'tac-pham',  title: 'Điều gì tạo nên sức sống lâu dài của một ca khúc?', date: '05.09.2026', views: 6000,  url: '#', thumb: 'images/sucsong1.jpg' },
  { id: 'album-nhac-viet',    cat: 'tac-pham',  title: 'Album nhạc Việt: Từ tuyển tập ca khúc đến một câu chuyện hoàn chỉnh', date: '01.09.2026', views: 5200,  url: '#', thumb: 'images/album1.jpg' },
  { id: 'chat-lieu-dan-gian', cat: 'tac-pham',  title: 'Khi chất liệu dân gian bước vào những ca khúc hiện đại', date: '28.08.2026', views: 4900,  url: '#', thumb: 'images/dangian1.jpg' },
  { id: 'cassette-streaming', cat: 'van-hoa',   title: 'Từ băng cassette đến streaming: Người Việt đã nghe nhạc như thế nào?', date: '28.09.2026', views: 11200, url: '#', thumb: 'images/cassette1.jpg' },
  { id: 'fandom-viet',        cat: 'van-hoa',   title: 'Fandom Việt: Khi tình yêu âm nhạc trở thành một cộng đồng', date: '22.08.2026', views: 5300,  url: '#', thumb: 'images/fandom1.jpg' },
  { id: 'giai-dieu-ky-uc',    cat: 'van-hoa',   title: 'Vì sao một giai điệu có thể đánh thức ký ức?', date: '18.08.2026', views: 4700,  url: '#', thumb: 'images/giaidieu1.jpg' }
];