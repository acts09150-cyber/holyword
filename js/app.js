/**
 * HolyWord - app.js v7 (최종)
 * 다국어 완전 지원 + NIV(WEB) 추가
 */

const App = {
  currentBook: '창세기',
  currentChapter: 1,
  totalChapters: 50,
  currentLang: 'ko',
  fontSize: 18,
  highlightedVerses: new Set(),
  selectedVerse: null,
};

// ===== 초기화 (순서 엄수: URL파싱 → 오늘말씀 → 챕터로드) =====
document.addEventListener('DOMContentLoaded', () => {
  parseURL();          // 1. URL에서 lang/book/ch 파싱 (loadChapter 전!)
  initDailyVerse();    // 2. 오늘의 말씀
  loadChapter();       // 3. 성경 본문 (lang 이미 설정됨)
  initKeys();          // 4. 키보드 단축키
  initInterstitial(); // 5. 아무 조작 없을 때 1분 후 전면광고
});

// ===== URL 파라미터 파싱 (loadChapter 전에 반드시 실행) =====
function parseURL() {
  const p = new URLSearchParams(window.location.search);

  // 언어
  const lang = p.get('lang');
  if (lang && window.LANG_CONFIG?.[lang]) {
    App.currentLang = lang;
    _applyLangUI(lang); // UI만 적용 (loadChapter 호출 안 함)
  }

  // 책
  const book = p.get('book');
  if (book) {
    App.currentBook = decodeURIComponent(book);
    const all = [...(window.BIBLE_BOOKS?.ot||[]), ...(window.BIBLE_BOOKS?.nt||[])];
    const info = all.find(b => b.name === App.currentBook);
    if (info) App.totalChapters = info.chapters;
  }

  // 챕터
  const ch = p.get('ch');
  if (ch) App.currentChapter = parseInt(ch) || 1;
}

// ===== 언어 UI 적용 (API 호출 없음) =====
function _applyLangUI(lang) {
  const cfg = window.LANG_CONFIG?.[lang];
  if (!cfg) return;

  // 플래그/이름 업데이트
  const parts = cfg.label.split(' ');
  const flag = parts[0];
  const name = parts.slice(1).join(' ');
  const flagEl = document.getElementById('currentLangFlag');
  const nameEl = document.getElementById('currentLangName');
  if (flagEl) flagEl.textContent = flag;
  if (nameEl) nameEl.textContent = name;

  // RTL (아랍어)
  const bt = document.getElementById('bibleText');
  if (bt) {
    bt.style.direction = cfg.rtl ? 'rtl' : 'ltr';
    bt.style.textAlign = cfg.rtl ? 'right' : 'left';
  }

  document.getElementById('langDropdown')?.classList.remove('open');
}

// ===== 오늘의 말씀 =====
function initDailyVerse() {
  if (!window.DAILY_VERSES?.length) return;
  const v = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];
  const el = document.getElementById('dailyVerseText');
  const ref = document.getElementById('dailyVerseRef');
  if (el) el.textContent = `"${v.text}"`;
  if (ref) ref.textContent = v.ref;
  window._dv = v;
}

// ===== 챕터 로드 =====
async function loadChapter() {
  showLoading();
  updateUI();
  try {
    const verses = await fetchBibleChapter(App.currentBook, App.currentChapter, App.currentLang);
    renderVerses(verses);
    updateURL();
    window.scrollTo({top:0, behavior:'smooth'});
  } catch(e) {
    console.error(e);
    showError();
  }
}

function showLoading() {
  const c = document.getElementById('bibleText');
  if (c) c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><span>말씀을 불러오는 중...</span></div>`;
}

function showError() {
  const c = document.getElementById('bibleText');
  if (c) c.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#9E855A;">
    <div style="font-size:32px;margin-bottom:16px;">📖</div>
    <p style="margin-bottom:12px;">말씀을 불러올 수 없습니다</p>
    <button onclick="loadChapter()" style="padding:8px 20px;background:#C9A84C;color:#1A1208;border:none;border-radius:6px;cursor:pointer;font-size:13px;">다시 시도</button>
  </div>`;
}

function renderVerses(verses) {
  const c = document.getElementById('bibleText');
  if (!c) return;
  c.style.fontSize = App.fontSize + 'px';
  c.innerHTML = '';

  verses.forEach((v, idx) => {
    const d = document.createElement('div');
    d.className = 'verse-row' + (App.highlightedVerses.has(v.number) ? ' highlighted' : '');
    d.dataset.verse = v.number;
    d.innerHTML = `<span class="v-num">${v.number}</span><span class="v-text">${v.text}</span>`;
    d.addEventListener('click', () => selectVerse(v.number, v.text));
    c.appendChild(d);

    // 15절 후 중간 광고
    if (idx === 14 && verses.length > 20) {
      const ad = document.createElement('div');
      ad.style.cssText = 'margin:28px 0;text-align:center;';
      ad.innerHTML = `<ins class="adsbygoogle" style="display:block"
        data-ad-client="ca-pub-8675368228460145"
        data-ad-slot="2240680444"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>`;
      c.appendChild(ad);
      try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    }
  });
}

// ===== 구절 선택 =====
function selectVerse(num, text) {
  App.selectedVerse = {num, text, ref:`${App.currentBook} ${App.currentChapter}:${num}`};
  document.querySelector(`[data-verse="${num}"]`)?.classList.toggle('highlighted');
  App.highlightedVerses.has(num) ? App.highlightedVerses.delete(num) : App.highlightedVerses.add(num);
  const pp = document.getElementById('versePopup');
  const pv = document.getElementById('popupVerse');
  if (pp && pv) {
    pv.innerHTML = `<strong style="color:#C9A84C;font-size:11px;">${App.currentBook} ${App.currentChapter}:${num}</strong><br><br>"${text}"`;
    pp.classList.add('show');
    setTimeout(() => pp.classList.remove('show'), 5000);
  }
}
function closePopup() { document.getElementById('versePopup')?.classList.remove('show'); }
function copySelectedVerse() {
  if (!App.selectedVerse) return;
  navigator.clipboard.writeText(`"${App.selectedVerse.text}" — ${App.selectedVerse.ref}\n(bible2.kingdom2025.com)`).then(() => toast('복사되었습니다 ✓'));
  closePopup();
}
function shareSelectedVerse() {
  if (!App.selectedVerse) return;
  if (navigator.share) navigator.share({title:'HolyWord',text:`"${App.selectedVerse.text}" — ${App.selectedVerse.ref}`,url:location.href});
  else { navigator.clipboard.writeText(`"${App.selectedVerse.text}" — ${App.selectedVerse.ref}`); toast('복사되었습니다 ✓'); }
  closePopup();
}

// ===== 챕터 네비 =====
function prevChapter() {
  if (App.currentChapter > 1) { App.currentChapter--; loadChapter(); }
  else toast('첫 번째 장입니다');
}
function nextChapter() {
  if (App.currentChapter < App.totalChapters) { App.currentChapter++; loadChapter(); }
  else toast('마지막 장입니다');
}

// ===== 책 선택 =====
function selectBook(btn) {
  document.querySelectorAll('.book-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  App.currentBook = btn.dataset.book;
  App.totalChapters = parseInt(btn.dataset.chapters);
  App.currentChapter = 1;
  App.highlightedVerses.clear();
  loadChapter();
  if (window.innerWidth < 960) toggleMobileNav();
}

// ===== UI 업데이트 =====
function updateUI() {
  const all = [...(window.BIBLE_BOOKS?.ot||[]), ...(window.BIBLE_BOOKS?.nt||[])];
  const info = all.find(b => b.name === App.currentBook);
  if (info) App.totalChapters = info.chapters;

  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('chapterBookName', App.currentBook);
  set('chapterNumber', `제 ${App.currentChapter} 장`);
  set('bcBook', App.currentBook);
  set('bcChapter', `${App.currentChapter}장`);
  set('navBookInfo', `${App.currentBook} ${App.currentChapter}장`);

  renderChapterGrid();

  const pct = Math.round(App.currentChapter / App.totalChapters * 100);
  const fill = document.getElementById('progressMini');
  const txt = document.getElementById('progressText');
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = `${App.currentChapter} / ${App.totalChapters}장`;

  const cfg = window.LANG_CONFIG?.[App.currentLang];
  document.title = `${App.currentBook} ${App.currentChapter}장 (${cfg?.sub||''}) | HolyWord`;
}

function renderChapterGrid() {
  const grid = document.getElementById('chapterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const max = Math.min(App.totalChapters, 50);
  for (let i = 1; i <= max; i++) {
    const btn = document.createElement('button');
    btn.className = 'ch-num-btn' + (i === App.currentChapter ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => { App.currentChapter = i; loadChapter(); };
    grid.appendChild(btn);
  }
  if (App.totalChapters > 50) {
    const more = document.createElement('span');
    more.style.cssText = 'font-size:12px;color:#9E855A;padding:8px;align-self:center;';
    more.textContent = `... ${App.totalChapters}장까지`;
    grid.appendChild(more);
  }
}

// ===== 언어 전환 (버튼 클릭 시) =====
function setLang(lang) {
  if (App.currentLang === lang) {
    document.getElementById('langDropdown')?.classList.remove('open');
    return;
  }
  App.currentLang = lang;
  App.highlightedVerses.clear();
  verseCache?.clear(); // 캐시 초기화
  _applyLangUI(lang);

  const cfg = window.LANG_CONFIG?.[lang];
  toast(`${cfg?.label || lang} (${cfg?.sub || ''}) 성경으로 변경`);

  loadChapter(); // 새 언어로 다시 로드

  const url = new URL(location);
  url.searchParams.set('lang', lang);
  history.pushState({}, '', url);
}

function toggleLangMenu() {
  document.getElementById('langDropdown')?.classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.lang-picker')) document.getElementById('langDropdown')?.classList.remove('open');
});

// ===== 폰트 크기 =====
function changeFontSize(d) {
  App.fontSize = Math.max(14, Math.min(26, App.fontSize + d));
  const c = document.getElementById('bibleText');
  if (c) c.style.fontSize = App.fontSize + 'px';
  toast(`글자 크기: ${App.fontSize}px`);
}

// ===== 공유 =====
function shareToKakao() { toast('카카오 SDK 연동 후 사용 가능합니다'); }
function copyVerse() {
  if (!window._dv) return;
  navigator.clipboard.writeText(`"${window._dv.text}" — ${window._dv.ref}\n\nhttps://bible2.kingdom2025.com`);
  toast('복사되었습니다 ✓');
}
function createImageCard() { toast('이미지 카드 기능 준비 중'); }
function shareToTwitter() {
  const v = App.selectedVerse || window._dv;
  if (!v) return;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('"'+(v.text||v)+'" — '+(v.ref||'')+'\n\n#성경 #HolyWord')}&url=${encodeURIComponent(location.href)}`, '_blank');
}
function shareDailyVerse() {
  if (navigator.share && window._dv) navigator.share({title:'오늘의 말씀',text:`"${window._dv.text}" — ${window._dv.ref}`,url:location.href});
  else copyVerse();
}
function subscribeNewsletter() {
  const i = document.querySelector('.email-input');
  if (!i?.value.includes('@')) { toast('올바른 이메일을 입력해주세요'); return; }
  toast('구독 완료! 매일 아침 말씀을 보내드립니다 ✓');
  i.value = '';
}

// ===== 검색 =====
function filterBooks(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.book-item').forEach(b => {
    b.style.display = (b.dataset.book||'').includes(q) || !q ? 'block' : 'none';
  });
  document.querySelectorAll('.book-category,.testament-header').forEach(el => {
    el.style.display = q ? 'none' : '';
  });
}

// ===== 모바일 =====
function toggleMobileNav() {
  document.getElementById('sidebarLeft')?.classList.toggle('open');
  document.getElementById('mobileOverlay')?.classList.toggle('show');
}

// ===== URL 업데이트 =====
function updateURL() {
  const url = new URL(location);
  url.searchParams.set('book', App.currentBook);
  url.searchParams.set('ch', App.currentChapter);
  url.searchParams.set('lang', App.currentLang);
  history.pushState({}, '', url);
}

// ===== 전면광고 =====
// ===== 전면광고 — 아무 조작 없을 때 1분 후 =====
let _idleTimer = null;
let _interShown = false;

function initInterstitial() {
  _resetIdleTimer();
  // 사용자 활동 감지 → 타이머 리셋
  ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(ev => {
    document.addEventListener(ev, _resetIdleTimer, { passive: true });
  });
}

function _resetIdleTimer() {
  clearTimeout(_idleTimer);
  // 아무 조작 없이 1분 경과 시 전면광고
  _idleTimer = setTimeout(() => {
    if (!_interShown) showInterstitial();
  }, 60000);
}

function showInterstitial() {
  if (document.getElementById('iOv')) return;
  _interShown = true;

  const ov = document.createElement('div');
  ov.id = 'iOv';
  ov.style.cssText = [
    'position:fixed','inset:0','background:rgba(0,0,0,0.88)',
    'z-index:99999','display:flex','align-items:center','justify-content:center'
  ].join(';');

  // 광고 컨테이너 생성
  const box = document.createElement('div');
  box.style.cssText = [
    'background:#1A1208','border:1px solid #C9A84C','border-radius:16px',
    'padding:24px','max-width:520px','width:92%','text-align:center'
  ].join(';');

  // 광고 ins 태그
  const ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.cssText = 'display:block;min-height:280px;';
  ins.setAttribute('data-ad-client','ca-pub-8675368228460145');
  ins.setAttribute('data-ad-slot','7174010171');
  ins.setAttribute('data-ad-format','auto');
  ins.setAttribute('data-full-width-responsive','true');

  // 하단 카운트다운 영역
  const bottom = document.createElement('div');
  bottom.style.cssText = 'margin-top:16px;display:flex;align-items:center;justify-content:space-between;';

  const cnt = document.createElement('span');
  cnt.id = 'iCnt';
  cnt.style.cssText = 'font-size:12px;color:#9E855A;';
  cnt.textContent = '5초 후 닫기 가능';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'iBtn';
  closeBtn.textContent = '닫기 ✕';
  closeBtn.style.cssText = [
    'background:#C9A84C','color:#1A1208','border:none',
    'padding:8px 22px','border-radius:20px','font-size:13px',
    'font-weight:700','cursor:pointer','opacity:0.35','pointer-events:none'
  ].join(';');
  closeBtn.onclick = closeInter;

  bottom.appendChild(cnt);
  bottom.appendChild(closeBtn);

  const adLabel = document.createElement('div');
  adLabel.style.cssText = 'font-size:10px;color:#9E855A;letter-spacing:2px;margin-bottom:14px;';
  adLabel.textContent = '광고';

  box.appendChild(adLabel);
  box.appendChild(ins);
  box.appendChild(bottom);
  ov.appendChild(box);
  document.body.appendChild(ov);

  // AdSense 로드
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}

  // DOM 렌더링 후 카운트다운 시작
  let n = 5;
  const timer = setInterval(() => {
    n--;
    const cntEl = document.getElementById('iCnt');
    const btnEl = document.getElementById('iBtn');
    if (cntEl) cntEl.textContent = n > 0 ? `${n}초 후 닫기 가능` : '닫기 가능';
    if (n <= 0) {
      clearInterval(timer);
      if (btnEl) {
        btnEl.style.opacity = '1';
        btnEl.style.pointerEvents = 'auto';
      }
    }
  }, 1000);
}

function closeInter() {
  document.getElementById('iOv')?.remove();
  _interShown = false;
  // 닫은 후 30분 뒤 다시 idle 감지 재시작
  setTimeout(() => { _resetIdleTimer(); }, 30 * 60 * 1000);
}

// ===== 토스트 =====
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== 키보드 =====
function initKeys() {
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key==='ArrowRight') nextChapter();
    if (e.key==='ArrowLeft') prevChapter();
    if (e.key==='+') changeFontSize(1);
    if (e.key==='-') changeFontSize(-1);
    if (e.key==='Escape') { closePopup(); closeInter(); }
  });
}

window.addEventListener('popstate', () => { parseURL(); loadChapter(); });
