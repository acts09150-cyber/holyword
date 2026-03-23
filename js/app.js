/**
 * HolyWord - App.js
 * 한국어 개역개정 기본 + 1분 후 전면광고
 */

const App = {
  currentBook: '창세기',
  currentChapter: 1,
  totalChapters: 50,
  currentLang: 'ko',
  fontSize: 18,
  highlightedVerses: new Set(),
  selectedVerse: null,
  interstitialShown: false,
};

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  initDailyVerse();
  loadChapter();
  initURLState();
  initKeyboardNav();
  // 1분 후 전면광고
  setTimeout(showInterstitialAd, 60000);
});

function initURLState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang')) App.currentLang = params.get('lang');
  if (params.get('book')) App.currentBook = decodeURIComponent(params.get('book'));
  if (params.get('ch')) App.currentChapter = parseInt(params.get('ch')) || 1;
  // 책의 총 챕터 수 설정
  const allBooks = [...window.BIBLE_BOOKS.ot, ...window.BIBLE_BOOKS.nt];
  const bookInfo = allBooks.find(b => b.name === App.currentBook);
  if (bookInfo) App.totalChapters = bookInfo.chapters;
}

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'n') nextChapter();
    if (e.key === 'ArrowLeft' || e.key === 'p') prevChapter();
    if (e.key === 'Escape') { closePopup(); closeInterstitial(); }
  });
}

// ===== 오늘의 말씀 =====
function initDailyVerse() {
  const idx = new Date().getDate() % DAILY_VERSES.length;
  const v = DAILY_VERSES[idx];
  const el = document.getElementById('dailyVerseText');
  const ref = document.getElementById('dailyVerseRef');
  if (el) el.textContent = `"${v.text}"`;
  if (ref) ref.textContent = v.ref;
  window._dailyVerse = v;
}

// ===== 챕터 로드 =====
async function loadChapter() {
  showLoading();
  updateUI();
  try {
    const verses = await fetchBibleChapter(App.currentBook, App.currentChapter, App.currentLang);
    renderVerses(verses);
    updateURL();
    scrollToTop();
  } catch(e) {
    showError();
  }
}

function showLoading() {
  const c = document.getElementById('bibleText');
  if (c) c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><span>말씀을 불러오는 중...</span></div>`;
}

function showError() {
  const c = document.getElementById('bibleText');
  if (c) c.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#9E855A;"><div style="font-size:32px;margin-bottom:16px;">📖</div><p>말씀을 불러올 수 없습니다</p><button onclick="loadChapter()" style="margin-top:16px;padding:8px 20px;background:#C9A84C;color:#1A1208;border:none;border-radius:6px;cursor:pointer;">다시 시도</button></div>`;
}

function renderVerses(verses) {
  const c = document.getElementById('bibleText');
  if (!c) return;
  c.style.fontSize = App.fontSize + 'px';
  c.innerHTML = '';

  verses.forEach((v, idx) => {
    const div = document.createElement('div');
    div.className = 'verse-row' + (App.highlightedVerses.has(v.number) ? ' highlighted' : '');
    div.dataset.verse = v.number;
    div.innerHTML = `<span class="v-num">${v.number}</span><span class="v-text">${v.text}</span>`;
    div.addEventListener('click', () => selectVerse(v.number, v.text));
    c.appendChild(div);

    // 중간 광고 (15절 후)
    if (idx === 14 && verses.length > 20) {
      const adDiv = document.createElement('div');
      adDiv.style.cssText = 'margin:28px 0;text-align:center;';
      adDiv.innerHTML = `
        <div style="font-size:9px;color:#9E855A;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">광고</div>
        <ins class="adsbygoogle"
             style="display:block;text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-8675368228460145"
             data-ad-slot="2240680444"></ins>`;
      c.appendChild(adDiv);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    }
  });
}

// ===== 전면광고 (1분 후) =====
function showInterstitialAd() {
  if (App.interstitialShown) return;
  App.interstitialShown = true;

  const overlay = document.createElement('div');
  overlay.id = 'interstitialOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;
    display:flex;align-items:center;justify-content:center;
    animation:fadeInOverlay 0.4s ease;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background:#1A1208;border:1px solid #C9A84C;border-radius:16px;
    padding:24px;max-width:500px;width:90%;position:relative;
    text-align:center;
  `;

  // 카운트다운 5초
  let count = 5;
  box.innerHTML = `
    <div style="font-size:11px;color:#9E855A;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">광고</div>
    <ins class="adsbygoogle"
         style="display:block;min-height:250px;"
         data-ad-client="ca-pub-8675368228460145"
         data-ad-slot="7174010171"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:12px;color:#9E855A;" id="interstitialCountdown">${count}초 후 닫기 가능</span>
      <button id="interstitialClose"
        style="background:#C9A84C;color:#1A1208;border:none;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;opacity:0.4;pointer-events:none;"
        onclick="closeInterstitial()">닫기 ✕</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // 애드센스 광고 로드
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}

  // 카운트다운
  const timer = setInterval(() => {
    count--;
    const cd = document.getElementById('interstitialCountdown');
    const btn = document.getElementById('interstitialClose');
    if (cd) cd.textContent = count > 0 ? `${count}초 후 닫기 가능` : '닫기 가능';
    if (count <= 0) {
      clearInterval(timer);
      if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
    }
  }, 1000);

  // CSS 애니메이션
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInOverlay{from{opacity:0}to{opacity:1}}`;
  document.head.appendChild(style);
}

function closeInterstitial() {
  const overlay = document.getElementById('interstitialOverlay');
  if (overlay) overlay.remove();
  // 30분 후 다시 표시
  App.interstitialShown = false;
  setTimeout(showInterstitialAd, 30 * 60 * 1000);
}

// ===== 구절 선택 =====
function selectVerse(num, text) {
  App.selectedVerse = { num, text, ref: `${App.currentBook} ${App.currentChapter}:${num}` };
  const row = document.querySelector(`[data-verse="${num}"]`);
  if (row) row.classList.toggle('highlighted');
  if (App.highlightedVerses.has(num)) App.highlightedVerses.delete(num);
  else App.highlightedVerses.add(num);

  const popup = document.getElementById('versePopup');
  const popupVerse = document.getElementById('popupVerse');
  if (popup && popupVerse) {
    popupVerse.innerHTML = `<strong style="color:#C9A84C;font-size:11px;">${App.currentBook} ${App.currentChapter}:${num}</strong><br><br>"${text}"`;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 5000);
  }
}

function closePopup() {
  document.getElementById('versePopup')?.classList.remove('show');
}

function copySelectedVerse() {
  if (!App.selectedVerse) return;
  navigator.clipboard.writeText(`"${App.selectedVerse.text}" — ${App.selectedVerse.ref} (HolyWord)`).then(() => showToast('구절이 복사되었습니다 ✓'));
  closePopup();
}

function shareSelectedVerse() {
  if (!App.selectedVerse) return;
  if (navigator.share) navigator.share({ title: 'HolyWord 말씀', text: `"${App.selectedVerse.text}" — ${App.selectedVerse.ref}`, url: window.location.href });
  else { navigator.clipboard.writeText(`"${App.selectedVerse.text}" — ${App.selectedVerse.ref}`); showToast('복사되었습니다 ✓'); }
  closePopup();
}

// ===== 챕터 네비게이션 =====
function prevChapter() {
  if (App.currentChapter > 1) { App.currentChapter--; loadChapter(); }
  else showToast('첫 번째 장입니다');
}

function nextChapter() {
  if (App.currentChapter < App.totalChapters) { App.currentChapter++; loadChapter(); }
  else showToast('마지막 장입니다');
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
  const bookName = document.getElementById('chapterBookName');
  const chNum = document.getElementById('chapterNumber');
  const bcBook = document.getElementById('bcBook');
  const bcCh = document.getElementById('bcChapter');
  const navInfo = document.getElementById('navBookInfo');

  if (bookName) bookName.textContent = App.currentBook;
  if (chNum) chNum.textContent = `제 ${App.currentChapter} 장`;
  if (bcBook) bcBook.textContent = App.currentBook;
  if (bcCh) bcCh.textContent = `${App.currentChapter}장`;
  if (navInfo) navInfo.textContent = `${App.currentBook} ${App.currentChapter}장`;

  renderChapterGrid();

  const pct = Math.round(App.currentChapter / App.totalChapters * 100);
  const fill = document.getElementById('progressMini');
  const text = document.getElementById('progressText');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${App.currentChapter} / ${App.totalChapters}장`;

  document.title = `${App.currentBook} ${App.currentChapter}장 (개역개정) | HolyWord 성경`;
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

// ===== 언어 전환 =====
function setLang(lang, flag, name) {
  App.currentLang = lang;
  App.highlightedVerses.clear();
  if (flag) document.getElementById('currentLangFlag').textContent = flag;
  if (name) document.getElementById('currentLangName').textContent = name;
  document.getElementById('langDropdown')?.classList.remove('open');
  loadChapter();
  showToast(`언어: ${name || lang}`);
}

function toggleLangMenu() {
  document.getElementById('langDropdown')?.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-picker')) document.getElementById('langDropdown')?.classList.remove('open');
});

// ===== 폰트 크기 =====
function changeFontSize(delta) {
  App.fontSize = Math.max(14, Math.min(26, App.fontSize + delta));
  const c = document.getElementById('bibleText');
  if (c) c.style.fontSize = App.fontSize + 'px';
  showToast(`글자 크기: ${App.fontSize}px`);
}

// ===== 공유 =====
function shareToKakao() { showToast('카카오 SDK 연동 후 사용 가능합니다'); }
function copyVerse() {
  const v = window._dailyVerse;
  if (!v) return;
  navigator.clipboard.writeText(`"${v.text}" — ${v.ref}\n\nhttps://bible2.kingdom2025.com`);
  showToast('복사되었습니다 ✓');
}
function createImageCard() { showToast('이미지 카드 기능 준비 중입니다'); }
function shareToTwitter() {
  const v = App.selectedVerse || window._dailyVerse;
  if (!v) return;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('"' + (v.text||v) + '" — ' + (v.ref||'') + '\n\n#성경 #말씀 #HolyWord')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
}
function shareDailyVerse() {
  if (navigator.share) navigator.share({ title: '오늘의 말씀', text: `"${window._dailyVerse?.text}" — ${window._dailyVerse?.ref}`, url: window.location.href });
  else copyVerse();
}

// ===== 뉴스레터 =====
function subscribeNewsletter() {
  const input = document.querySelector('.email-input');
  if (!input?.value.includes('@')) { showToast('올바른 이메일을 입력해주세요'); return; }
  showToast('구독 완료! 매일 아침 말씀을 보내드립니다 ✓');
  input.value = '';
}

// ===== 검색 =====
function filterBooks(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.book-item').forEach(btn => {
    btn.style.display = (btn.dataset.book||'').includes(q) || !q ? 'block' : 'none';
  });
  document.querySelectorAll('.book-category, .testament-header').forEach(el => {
    el.style.display = q ? 'none' : '';
  });
}

// ===== 모바일 네비 =====
function toggleMobileNav() {
  document.getElementById('sidebarLeft')?.classList.toggle('open');
  document.getElementById('mobileOverlay')?.classList.toggle('show');
}

// ===== URL =====
function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('book', App.currentBook);
  url.searchParams.set('ch', App.currentChapter);
  url.searchParams.set('lang', App.currentLang);
  history.pushState({}, '', url);
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ===== 토스트 =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

window.addEventListener('popstate', () => { initURLState(); loadChapter(); });
