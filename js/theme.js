const THEME_KEY = 'holyword-theme';
const LANG_KEY = 'holyword-ui-lang';
const BASE_URL = 'https://bible2.kingdom2025.com';
const NAV_LABELS = {
  en: {
    reader: 'Bible Reader',
    topics: 'Topics',
    daily: 'Daily Verse',
    search: 'Search',
    prayer: 'AI Prayer'
  },
  ko: {
    reader: '성경 읽기',
    topics: '주제별 말씀',
    daily: '오늘의 말씀',
    search: '구절 검색',
    prayer: '대표기도 작성'
  }
};

function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  const btn = document.getElementById('darkModeBtn');
  if (btn) btn.textContent = enabled ? '☀️ Light' : '🌙 Dark';
}

function loadTheme() {
  setDarkMode(localStorage.getItem(THEME_KEY) === 'dark');
}

function toggleDarkMode() {
  const enabled = !document.body.classList.contains('dark-mode');
  localStorage.setItem(THEME_KEY, enabled ? 'dark' : 'light');
  setDarkMode(enabled);
}

function getLangFromURL() {
  const p = new URLSearchParams(location.search).get('lang');
  return p === 'ko' || p === 'en' ? p : null;
}

function getPreferredLang() {
  const urlLang = getLangFromURL();
  if (urlLang) {
    localStorage.setItem(LANG_KEY, urlLang);
    return urlLang;
  }
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'ko' || saved === 'en') return saved;
  return (navigator.language || 'en').startsWith('ko') ? 'ko' : 'en';
}

function getNavKeyFromHref(href) {
  if (!href) return null;
  if (href.includes('index.html') || href === '/' || href === '../') return 'reader';
  if (href.includes('topics')) return 'topics';
  if (href.includes('daily')) return 'daily';
  if (href.includes('search')) return 'search';
  if (href.includes('prayer')) return 'prayer';
  return null;
}

function applyHeaderLanguage(lang) {
  const labels = NAV_LABELS[lang] || NAV_LABELS.en;
  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);

  document.querySelectorAll('.header-nav a.nav-link').forEach((link) => {
    const key = getNavKeyFromHref(link.getAttribute('href'));
    if (!key || !labels[key]) return;
    const icon = link.textContent.trim().match(/^[^\w가-힣]+/u)?.[0]?.trim();
    link.textContent = icon ? `${icon} ${labels[key]}` : labels[key];
  });
}

function ensureHreflang(relLang, href) {
  const selector = `link[rel="alternate"][hreflang="${relLang}"]`;
  let link = document.querySelector(selector);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', relLang);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function injectHreflang() {
  const path = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
  ensureHreflang('ko', `${BASE_URL}${path}?lang=ko`);
  ensureHreflang('en', `${BASE_URL}${path}?lang=en`);
  ensureHreflang('x-default', `${BASE_URL}${path}`);
}

function injectDarkModeButton() {
  if (document.getElementById('darkModeBtn')) return;

  const target = document.querySelector('.header-inner') || document.querySelector('.site-header');
  if (!target) return;

  const btn = document.createElement('button');
  btn.id = 'darkModeBtn';
  btn.className = 'dark-mode-btn';
  btn.type = 'button';
  btn.textContent = '🌙 Dark';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.addEventListener('click', toggleDarkMode);

  if (target.classList.contains('header-inner')) {
    btn.style.marginLeft = '12px';
  }
  target.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  injectDarkModeButton();
  loadTheme();
  applyHeaderLanguage(getPreferredLang());
  injectHreflang();
});
