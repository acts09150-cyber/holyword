/**
 * HolyWord - Main App
 * 다국어 성경 읽기 서비스 메인 로직
 */

// ===== 앱 상태 =====
const App = {
  currentBook: '창세기',
  currentChapter: 1,
  totalChapters: 50,
  currentLang: 'ko',
  fontSize: 18,
  highlightedVerses: new Set(),
  selectedVerse: null,
  readHistory: JSON.parse(localStorage.getItem('hw_history') || '[]'),
};

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  initDailyVerse();
  initReadHistory();
  loadChapter();
  initURLState();
  initKeyboardNav();
});

// URL 파라미터 파싱
function initURLState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang')) setLang(params.get('lang'), '', '');
  if (params.get('book')) App.currentBook = params.get('book');
  if (params.get('ch')) App.currentChapter = parseInt(params.get('ch')) || 1;
}

// 키보드 단축키
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'n') nextChapter();
    if (e.key === 'ArrowLeft' || e.key === 'p') prevChapter();
    if (e.key === '+') changeFontSize(1);
    if (e.key === '-') changeFontSize(-1);
    if (e.key === 'Escape') closePopup();
  });
}

// ===== 오늘의 말씀 =====
function initDailyVerse() {
  const dayIdx = new Date().getDate() % DAILY_VERSES.length;
  const verse = DAILY_VERSES[dayIdx];
  const el = document.getElementById('dailyVerseText');
  const refEl = document.getElementById('dailyVerseRef');
  if (el) el.textContent = `"${verse.text}"`;
  if (refEl) refEl.textContent = verse.ref;
  window._dailyVerse = verse;
}

// ===== 성경 챕터 로드 =====
async function loadChapter() {
  showLoading();
  updateUI();

  try {
    const verses = await fetchBibleChapter(App.currentBook, App.currentChapter, App.currentLang);
    renderVerses(verses);
    saveHistory();
    updateURL();
    scrollToTop();
  } catch (err) {
    showError();
  }
}

function showLoading() {
  const container = document.getElementById('bibleText');
  if (container) {
    container.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span>말씀을 불러오는 중...</span>
      </div>`;
  }
}

function showError() {
  const container = document.getElementById('bibleText');
  if (container) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#9E855A;">
        <div style="font-size:32px;margin-bottom:16px;">📖</div>
        <div style="font-size:16px;margin-bottom:8px;">말씀을 불러올 수 없습니다</div>
        <div style="font-size:13px;opacity:0.7;">인터넷 연결을 확인하고 다시 시도해주세요</div>
        <button onclick="loadChapter()" style="margin-top:16px;padding:8px 20px;background:#C9A84C;color:#1A1208;border:none;border-radius:6px;font-size:13px;cursor:pointer;">다시 시도</button>
      </div>`;
  }
}

function renderVerses(verses) {
  const container = document.getElementById('bibleText');
  if (!container) return;

  container.style.fontSize = App.fontSize + 'px';
  container.innerHTML = '';

  verses.forEach((v, idx) => {
    const div = document.createElement('div');
    div.className = 'verse-row' + (App.highlightedVerses.has(v.number) ? ' highlighted' : '');
    div.dataset.verse = v.number;

    div.innerHTML = `
      <span class="v-num">${v.number}</span>
      <span class="v-text">${v.text}</span>`;

    div.addEventListener('click', () => selectVerse(v.number, v.text));
    container.appendChild(div);

    // 중간 광고 (15절 뒤에 삽입 — 체류 후 노출)
    if (idx === 14 && verses.length > 20) {
      const adDiv = document.createElement('div');
      adDiv.className = 'ad-zone ad-in-article';
      adDiv.innerHTML = `
        <div class="ad-label">광고</div>
        <div class="ad-placeholder" style="width:100%;height:100px;">
          <!--
          <ins class="adsbygoogle" style="display:block;text-align:center;"
               data-ad-layout="in-article" data-ad-format="fluid"
               data-ad-client="ca-pub-YOUR_ID" data-ad-slot="YOUR_SLOT"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>
          -->
          <div class="ad-demo-text">In-Article 광고 · 본문 중간 · 높은 CTR</div>
        </div>`;
      container.appendChild(adDiv);
    }
  });
}

// ===== 구절 선택 팝업 =====
function selectVerse(num, text) {
  App.selectedVerse = { num, text, ref: `${App.currentBook} ${App.currentChapter}:${num}` };

  // 하이라이트 토글
  const row = document.querySelector(`[data-verse="${num}"]`);
  if (row) row.classList.toggle('highlighted');
  if (App.highlightedVerses.has(num)) {
    App.highlightedVerses.delete(num);
  } else {
    App.highlightedVerses.add(num);
  }

  // 팝업 표시
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
  const text = `"${App.selectedVerse.text}" — ${App.selectedVerse.ref} (HolyWord)`;
  navigator.clipboard.writeText(text).then(() => showToast('구절이 복사되었습니다 ✓'));
  closePopup();
}

function shareSelectedVerse() {
  if (!App.selectedVerse) return;
  const text = `"${App.selectedVerse.text}" — ${App.selectedVerse.ref}`;
  if (navigator.share) {
    navigator.share({ title: 'HolyWord 말씀', text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('구절이 복사되었습니다 ✓'));
  }
  closePopup();
}

// ===== 챕터 네비게이션 =====
function prevChapter() {
  if (App.currentChapter > 1) {
    App.currentChapter--;
    loadChapter();
  } else {
    showToast('첫 번째 장입니다');
  }
}

function nextChapter() {
  if (App.currentChapter < App.totalChapters) {
    App.currentChapter++;
    loadChapter();
  } else {
    showToast('마지막 장입니다. 다음 성경책을 선택하세요');
  }
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

  // 모바일 사이드바 닫기
  if (window.innerWidth < 960) toggleMobileNav();
}

// ===== UI 업데이트 =====
function updateUI() {
  // 헤더
  const bookName = document.getElementById('chapterBookName');
  const chNum = document.getElementById('chapterNumber');
  if (bookName) bookName.textContent = App.currentBook;
  if (chNum) chNum.textContent = `제 ${App.currentChapter} 장`;

  // 브레드크럼
  const bcBook = document.getElementById('bcBook');
  const bcCh = document.getElementById('bcChapter');
  if (bcBook) bcBook.textContent = App.currentBook;
  if (bcCh) bcCh.textContent = `${App.currentChapter}장`;

  // 하단 네비
  const navInfo = document.getElementById('navBookInfo');
  if (navInfo) navInfo.textContent = `${App.currentBook} ${App.currentChapter}장`;

  // 챕터 선택기
  renderChapterGrid();

  // 진행바
  const pct = Math.round(App.currentChapter / App.totalChapters * 100);
  const fill = document.getElementById('progressMini');
  const text = document.getElementById('progressText');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${App.currentChapter} / ${App.totalChapters}장`;

  // 페이지 타이틀 업데이트 (SEO)
  document.title = `${App.currentBook} ${App.currentChapter}장 | HolyWord 다국어 성경`;
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

  const dropdown = document.getElementById('langDropdown');
  if (dropdown) dropdown.classList.remove('open');

  loadChapter();
  showToast(`언어 변경: ${name || lang}`);

  // URL 업데이트
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  history.pushState({}, '', url);
}

function toggleLangMenu() {
  document.getElementById('langDropdown')?.classList.toggle('open');
}

// 외부 클릭시 드롭다운 닫기
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-picker')) {
    document.getElementById('langDropdown')?.classList.remove('open');
  }
});

// ===== 폰트 크기 =====
function changeFontSize(delta) {
  App.fontSize = Math.max(14, Math.min(26, App.fontSize + delta));
  const container = document.getElementById('bibleText');
  if (container) container.style.fontSize = App.fontSize + 'px';
  showToast(`글자 크기: ${App.fontSize}px`);
  localStorage.setItem('hw_fontsize', App.fontSize);
}

// ===== 공유 기능 =====
function shareToKakao() {
  showToast('카카오 SDK 연동 필요 (kakao.Link.sendDefault)');
}

function copyVerse() {
  const verse = window._dailyVerse;
  if (!verse) return;
  navigator.clipboard.writeText(`"${verse.text}" — ${verse.ref}\n\nHolyWord에서 더 많은 말씀 읽기: ${window.location.origin}`);
  showToast('오늘의 말씀이 복사되었습니다 ✓');
}

function createImageCard() {
  showToast('이미지 카드 기능은 pages/share.html에서 제공됩니다');
}

function shareToTwitter() {
  const verse = App.selectedVerse || window._dailyVerse;
  if (!verse) return;
  const text = encodeURIComponent(`"${verse.text}" — ${verse.ref || ''}\n\n#성경 #Bible #HolyWord`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareDailyVerse() {
  if (navigator.share) {
    navigator.share({
      title: '오늘의 말씀 | HolyWord',
      text: `"${window._dailyVerse?.text}" — ${window._dailyVerse?.ref}`,
      url: window.location.href
    });
  } else {
    copyVerse();
  }
}

// ===== 뉴스레터 =====
function subscribeNewsletter() {
  const input = document.querySelector('.email-input');
  if (!input?.value.includes('@')) {
    showToast('올바른 이메일을 입력해주세요');
    return;
  }
  // 실제 구현: Mailchimp, ConvertKit API 연동
  showToast('구독 완료! 매일 아침 말씀을 보내드립니다 ✓');
  input.value = '';
}

// ===== 책 검색 필터 =====
function filterBooks(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.book-item').forEach(btn => {
    const name = btn.dataset.book || '';
    btn.style.display = name.includes(q) ? 'block' : 'none';
  });
  document.querySelectorAll('.book-category, .testament-header').forEach(el => {
    el.style.display = q ? 'none' : '';
  });
}

// ===== 모바일 네비게이션 =====
function toggleMobileNav() {
  const sidebar = document.getElementById('sidebarLeft');
  const overlay = document.getElementById('mobileOverlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('show');
}

// ===== 읽기 기록 =====
function saveHistory() {
  const key = `${App.currentBook}_${App.currentChapter}`;
  if (!App.readHistory.includes(key)) {
    App.readHistory.push(key);
    if (App.readHistory.length > 200) App.readHistory.shift();
    localStorage.setItem('hw_history', JSON.stringify(App.readHistory));
  }
}

function initReadHistory() {
  const saved = localStorage.getItem('hw_fontsize');
  if (saved) App.fontSize = parseInt(saved);
}

// ===== URL 업데이트 =====
function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('book', App.currentBook);
  url.searchParams.set('ch', App.currentChapter);
  url.searchParams.set('lang', App.currentLang);
  history.pushState({}, '', url);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 토스트 알림 =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Google Analytics 이벤트 (트래킹) =====
function trackEvent(category, action, label) {
  // GA4 연동:
  // gtag('event', action, { event_category: category, event_label: label });
  console.log(`[Analytics] ${category} | ${action} | ${label}`);
}

// 브라우저 뒤로가기 지원
window.addEventListener('popstate', () => {
  initURLState();
  loadChapter();
});
