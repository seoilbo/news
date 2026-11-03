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
 *           data-tools="off"          // 왼쪽 메뉴/검색 버튼 숨기기
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
    { key: 'jae',        label: '동네개발맵', href: 'jae.html', group: 'special' },
    { key: 'monthly',    label: '월간서오',   href: 'https://seoilbo.github.io/monthly/', group: 'special' }
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

  // ---- 왼쪽 도구: 메뉴 / 검색 버튼 ----
  var SVG = function (inner, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" ' +
           'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  };
  var ICON = {
    menu:   function (n) { return SVG('<path d="M4 6.5h16M4 12h16M4 17.5h16"/>', n || 24); },
    close:  function (n) { return SVG('<path d="M5 5l14 14M19 5L5 19"/>', n || 24); },
    search: function (n) { return SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>', n || 24); }
  };
  var toolsOn = opt.tools !== 'off';
  var toolsHtml = !toolsOn ? '' : (
    '<div class="hdr-tools">' +
      '<button type="button" class="hdr-btn hdr-menu-btn" aria-label="메뉴" aria-expanded="false">' +
        '<span class="ic-menu">' + ICON.menu() + '</span><span class="ic-close">' + ICON.close() + '</span>' +
      '</button>' +
      '<button type="button" class="hdr-btn hdr-search-btn" aria-label="검색">' + ICON.search() + '</button>' +
    '</div>'
  );

  var largeHtml = opt.large === 'off' ? '' : (
    '<div class="large-header" id="largeHeader">' +
      '<div class="header-main-bar"><div class="header-container">' + toolsHtml +
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
      '<div class="header-container">' + toolsHtml +
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

  // ===== 메뉴 / 검색 패널 =====
  if (toolsOn) (function () {
    var root = document.documentElement;
    var mq = window.matchMedia('(max-width: 768px)');
    var esc = function (t) {
      return String(t).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    var group = function (g) {
      return MENU.filter(function (m) { return (m.group || 'category') === g; }).map(function (m) {
        return '<a href="' + m.href + '"' + (m.key === active ? ' class="active"' : '') + '>' + esc(m.label) + '</a>';
      }).join('');
    };

    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="hdr-overlay" id="hdrOverlay"></div>' +
      '<nav class="hdr-menu" id="hdrMenu" aria-label="전체 메뉴" aria-hidden="true">' +
        '<button type="button" class="hdr-menu-close" id="hdrMenuClose" aria-label="메뉴 닫기">' + ICON.close() + '</button>' +
        '<div class="hdr-menu-title">카테고리</div>' + group('category') +
        '<div class="hdr-menu-sep"></div>' +
        '<div class="hdr-menu-title">특별부문</div>' + group('special') +
      '</nav>' +
      '<div class="hdr-search" id="hdrSearch" role="dialog" aria-label="검색" aria-hidden="true">' +
        '<div class="hdr-search-top"><span class="hdr-search-title">검색</span>' +
          '<button type="button" class="hdr-search-close" id="hdrSearchClose" aria-label="검색 닫기">' + ICON.close(28) + '</button></div>' +
        '<form class="hdr-search-form" id="hdrSearchForm" autocomplete="off">' +
          '<input type="search" id="hdrSearchInput" placeholder="검색어를 입력하세요." enterkeyhint="search" aria-label="검색어">' +
          '<button type="submit" aria-label="검색">' + ICON.search(24) + '</button>' +
        '</form>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    var overlay = document.getElementById('hdrOverlay');
    var menu = document.getElementById('hdrMenu');
    var panel = document.getElementById('hdrSearch');
    var input = document.getElementById('hdrSearchInput');
    var openedAt = 0;

    function setBtns(sel, on) {
      var list = document.querySelectorAll(sel);
      for (var i = 0; i < list.length; i++) {
        list[i].classList.toggle('is-open', on);
        if (list[i].hasAttribute('aria-expanded')) list[i].setAttribute('aria-expanded', on ? 'true' : 'false');
      }
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      setBtns('.hdr-menu-btn', false);
    }
    function closeSearch() {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      setBtns('.hdr-search-btn', false);
      input.blur();
    }
    function closeAll() {
      closeMenu(); closeSearch();
      overlay.classList.remove('is-open', 'dim');
      root.classList.remove('hdr-lock');
    }

    function openMenu(btn) {
      closeSearch();
      var r = btn.getBoundingClientRect();
      var g = btn.parentNode.getBoundingClientRect();
      menu.style.setProperty('--m-top', (g.bottom + 8) + 'px');
      menu.style.setProperty('--m-left', Math.max(8, g.left) + 'px');
      // 모바일: 메뉴 버튼이 있던 자리에 X 버튼이 오도록
      menu.style.setProperty('--x-top', r.top + 'px');
      menu.style.setProperty('--x-left', r.left + 'px');
      menu.style.setProperty('--x-bottom', r.bottom + 'px');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      setBtns('.hdr-menu-btn', true);
      overlay.classList.add('is-open');
      overlay.classList.toggle('dim', mq.matches);
      if (mq.matches) root.classList.add('hdr-lock');
      openedAt = window.pageYOffset || 0;
    }
    function openSearch(btn) {
      closeMenu();
      var g = btn.parentNode.getBoundingClientRect();
      panel.style.setProperty('--s-top', (g.bottom + 8) + 'px');
      panel.style.setProperty('--s-left', Math.max(8, g.left) + 'px');
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      setBtns('.hdr-search-btn', true);
      overlay.classList.add('is-open');
      overlay.classList.remove('dim');
      if (mq.matches) root.classList.add('hdr-lock');
      openedAt = window.pageYOffset || 0;
      setTimeout(function () { input.focus(); }, 60);
    }

    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.hdr-menu-btn, .hdr-search-btn') : null;
      if (!b) return;
      var isMenuBtn = b.classList.contains('hdr-menu-btn');
      if (b.classList.contains('is-open')) { closeAll(); return; }
      isMenuBtn ? openMenu(b) : openSearch(b);
    });
    overlay.addEventListener('click', closeAll);
    document.getElementById('hdrMenuClose').addEventListener('click', closeAll);
    document.getElementById('hdrSearchClose').addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    // 데스크톱에서는 스크롤하면 닫기 (패널이 헤더에서 떨어져 보이지 않게)
    window.addEventListener('scroll', function () {
      if (!mq.matches && overlay.classList.contains('is-open') &&
          Math.abs((window.pageYOffset || 0) - openedAt) > 40) closeAll();
    }, { passive: true });
    var onBreak = function () { closeAll(); };
    if (mq.addEventListener) mq.addEventListener('change', onBreak); else if (mq.addListener) mq.addListener(onBreak);
    menu.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) closeAll(); });

    // ---- 검색: 결과는 search.html 에서 보여줌 ----
    var SEARCH_PAGE = 'search.html';
    document.getElementById('hdrSearchForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) {
        alert('검색어를 입력하세요!');
        input.focus();
        return;
      }
      location.href = SEARCH_PAGE + '?q=' + encodeURIComponent(q);
    });
  })();
})();
