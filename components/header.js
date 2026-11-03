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
 *           data-logo-link="index.html"></script>
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

  var smallHtml = opt.small === 'off' ? '' : (
    '<header class="fixed-small-header" id="fixedSmallHeader">' +
      '<div class="header-container">' +
        '<a href="' + HOME + '" class="logo-link"><img src="' + LOGO_SRC + '" alt="서오일보 로고" class="logo-img-small"></a>' +
      '</div>' +
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

  // 스크롤 시 소형 헤더 내려오기
  var fixedHeader = document.getElementById('fixedSmallHeader');
  var largeHeader = document.getElementById('largeHeader');
  if (fixedHeader) {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var threshold = largeHeader ? largeHeader.offsetHeight : 131;
      fixedHeader.classList.toggle('active', y > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
