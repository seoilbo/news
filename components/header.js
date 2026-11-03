/*
 * 서오일보 공통 헤더
 *
 * 사용법 (각 html의 <body> 바로 아래):
 *   <script src="components/header.js"></script>
 *
 * 페이지별로 다르게 하고 싶을 때 (data- 속성, 전부 선택사항):
 *   <script src="components/header.js"
 *           data-active="opinion"      // 현재 메뉴 강조 (아래 MENU의 key)
 *           data-small="off"           // 스크롤 시 내려오는 소형 헤더 끄기
 *           data-large="off"           // 큰 헤더(날짜+메뉴 바 포함) 숨기기
 *           data-logo-link="index.html"
 *           data-variant="viewer"      // 뷰어 전용: 스크롤 진행 바 + 모바일 유틸 바(A+/A-/듣기/다크/공유)
 *           ></script>
 *
 * 메뉴를 바꾸고 싶으면 아래 MENU 배열만 고치면 모든 페이지에 반영됩니다.
 */
(function () {
  var script = document.currentScript;
  var opt = script ? script.dataset : {};

  // ▼ 메뉴는 여기 한 곳에서만 관리
  var MENU = [
    { key: 'social',     label: '사회',       href: 'category.html?type=social' },
    { key: 'economy',    label: '경제',       href: 'category.html?type=economy' },
    { key: 'politics',   label: '정치',       href: 'category.html?type=politics' },
    { key: 'realestate', label: '부동산',     href: 'category.html?type=realestate' },
    { key: 'culture',    label: '문화',       href: 'category.html?type=culture' },
    { key: 'opinion',    label: '오피니언',   href: 'category.html?type=opinion' },
    { key: 'jae',        label: '동네개발맵', href: 'jae.html' },
    { key: 'monthly',    label: '월간서오',   href: 'https://seoilbo.github.io/monthly/' }
  ];

  var LOGO_SRC = 'assets/seologo.png';
  var HOME = opt.logoLink || 'index.html';
  var isViewer = opt.variant === 'viewer';

  // 현재 메뉴 자동 감지: data-active가 없으면 주소의 ?type= 값이나 파일명으로 추정
  var active = opt.active;
  if (!active) {
    var type = new URLSearchParams(location.search).get('type');
    var file = location.pathname.split('/').pop().replace('.html', '');
    active = type || (file === 'jae' ? 'jae' : '');
  }

  var nav = MENU.map(function (m) {
    return '<a href="' + m.href + '"' + (m.key === active ? ' class="active"' : '') + '>' + m.label + '</a>';
  }).join('\n                    ');

  var largeHtml = opt.large === 'off' ? '' : (
    '<div class="large-header" id="largeHeader">' +
      '<div class="header-main-bar"><div class="header-container">' +
        '<a href="' + HOME + '" class="logo-link"><img src="' + LOGO_SRC + '" alt="서오일보 로고" class="logo-img-large"></a>' +
      '</div></div>' +
      '<div class="sub-info-bar"><div class="sub-info-inner">' +
        '<span class="current-date" id="headerDate"></span>' +
        '<nav class="sub-nav-categories">' + nav + '</nav>' +
      '</div></div>' +
    '</div>'
  );

  // 뷰어 전용: 모바일 유틸 바 + 스크롤 진행 바
  // (버튼이 부르는 changeFontSize / startTTS / toggleTheme / toggleSharePopup 은 뷰어 html 안에 그대로 있어야 함)
  var VIEWER_EXTRA =
    '<div class="mobile-utility-bar">' +
      '<button class="util-btn" onclick="changeFontSize(1)">A+</button>' +
      '<button class="util-btn" onclick="changeFontSize(-1)">A-</button>' +
      '<button class="util-btn tts-btn" onclick="startTTS()" aria-label="기사 듣기"><img src="assets/speak.png" alt="기사 듣기" class="util-icon"></button>' +
      '<button class="util-btn theme-btn" onclick="toggleTheme()" aria-label="다크 모드"><img src="assets/dark.png" alt="다크 모드" class="util-icon"></button>' +
      '<button class="util-btn" onclick="toggleSharePopup(this, event)"><img src="assets/share.png" alt="공유" class="util-icon"></button>' +
    '</div>' +
    '<span class="util-scroll-hint" id="utilScrollHint" aria-hidden="true">&#8250;</span>' +
    '<div class="scroll-progress-bar" id="scrollProgressBar"></div>';

  var smallHtml = opt.small === 'off' ? '' : (
    '<header class="fixed-small-header" id="fixedSmallHeader">' +
      '<div class="header-container">' +
        '<a href="' + HOME + '" class="logo-link"><img src="' + LOGO_SRC + '" alt="서오일보 로고" class="logo-img-small"></a>' +
      '</div>' +
      (isViewer ? VIEWER_EXTRA : '') +
    '</header>'
  );

  // CSS가 페이지에 없으면 자동으로 불러옴 (헤더 파일과 같은 폴더의 header.css)
  if (script && !document.querySelector('link[data-seoilbo-header]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = script.src.replace(/header\.js(\?.*)?$/, 'header.css');
    link.setAttribute('data-seoilbo-header', '');
    document.head.appendChild(link);
  }

  // 스크립트 태그가 있는 자리에 바로 삽입 → 페이지 로딩 중 깜빡임 없음
  if (script) script.insertAdjacentHTML('beforebegin', largeHtml + smallHtml);

  // 오늘 날짜
  var dateEl = document.getElementById('headerDate');
  if (dateEl) {
    var now = new Date();
    var week = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    dateEl.textContent = now.getFullYear() + '.' +
      String(now.getMonth() + 1).padStart(2, '0') + '.' +
      String(now.getDate()).padStart(2, '0') + ' (' + week + ')';
  }

  // 스크롤 시 소형 헤더 내려오기 (+ 뷰어: 진행 바, 모바일에서 내릴 때 유틸 바로 전환)
  var fixedHeader = document.getElementById('fixedSmallHeader');
  var largeHeader = document.getElementById('largeHeader');
  var progressBar = document.getElementById('scrollProgressBar');
  var lastScrollTop = 0;
  if (fixedHeader) {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var threshold = largeHeader ? largeHeader.offsetHeight : 111;

      if (progressBar) {
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (height > 0 ? (y / height) * 100 : 0) + '%';
      }

      if (y > threshold) {
        fixedHeader.classList.add('active');
        if (isViewer && window.innerWidth <= 768) {
          fixedHeader.classList.toggle('mobile-scrolled-down', y >= lastScrollTop);
        }
      } else {
        fixedHeader.classList.remove('active');
        fixedHeader.classList.remove('mobile-scrolled-down');
      }
      lastScrollTop = y <= 0 ? 0 : y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 뷰어: 모바일 유틸 바 '옆으로 넘기기' 화살표 (한 번 만지면 사라지고 다시 안 나타남)
  if (isViewer) {
    var root = document.documentElement;
    var done = false;
    try { done = localStorage.getItem('seoUtilHintDone') === '1'; } catch (e) {}
    if (done) {
      root.classList.add('util-hint-done');
    } else {
      var bar = document.querySelector('.mobile-utility-bar');
      if (bar) {
        var hide = function () {
          root.classList.add('util-hint-done');
          try { localStorage.setItem('seoUtilHintDone', '1'); } catch (e) {}
        };
        bar.addEventListener('touchstart', hide, { once: true, passive: true });
        bar.addEventListener('pointerdown', hide, { once: true, passive: true });
        bar.addEventListener('scroll', hide, { once: true, passive: true });
      }
    }
  }
})();
