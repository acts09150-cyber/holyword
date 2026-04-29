/**
 * HolyWord Global v2 - app.js
 * Parallel Bible Reader + Image Card Sharing
 */

// ===== 66권 성경 목록 =====
const BOOKS = [
  {n:'창세기',e:'Genesis',ch:50},{n:'출애굽기',e:'Exodus',ch:40},{n:'레위기',e:'Leviticus',ch:27},
  {n:'민수기',e:'Numbers',ch:36},{n:'신명기',e:'Deuteronomy',ch:34},{n:'여호수아',e:'Joshua',ch:24},
  {n:'사사기',e:'Judges',ch:21},{n:'룻기',e:'Ruth',ch:4},{n:'사무엘상',e:'1 Samuel',ch:31},
  {n:'사무엘하',e:'2 Samuel',ch:24},{n:'열왕기상',e:'1 Kings',ch:22},{n:'열왕기하',e:'2 Kings',ch:25},
  {n:'역대상',e:'1 Chronicles',ch:29},{n:'역대하',e:'2 Chronicles',ch:36},{n:'에스라',e:'Ezra',ch:10},
  {n:'느헤미야',e:'Nehemiah',ch:13},{n:'에스더',e:'Esther',ch:10},{n:'욥기',e:'Job',ch:42},
  {n:'시편',e:'Psalms',ch:150},{n:'잠언',e:'Proverbs',ch:31},{n:'전도서',e:'Ecclesiastes',ch:12},
  {n:'아가',e:'Song of Solomon',ch:8},{n:'이사야',e:'Isaiah',ch:66},{n:'예레미야',e:'Jeremiah',ch:52},
  {n:'예레미야애가',e:'Lamentations',ch:5},{n:'에스겔',e:'Ezekiel',ch:48},{n:'다니엘',e:'Daniel',ch:12},
  {n:'호세아',e:'Hosea',ch:14},{n:'요엘',e:'Joel',ch:3},{n:'아모스',e:'Amos',ch:9},
  {n:'오바댜',e:'Obadiah',ch:1},{n:'요나',e:'Jonah',ch:4},{n:'미가',e:'Micah',ch:7},
  {n:'나훔',e:'Nahum',ch:3},{n:'하박국',e:'Habakkuk',ch:3},{n:'스바냐',e:'Zephaniah',ch:3},
  {n:'학개',e:'Haggai',ch:2},{n:'스가랴',e:'Zechariah',ch:14},{n:'말라기',e:'Malachi',ch:4},
  {n:'마태복음',e:'Matthew',ch:28},{n:'마가복음',e:'Mark',ch:16},{n:'누가복음',e:'Luke',ch:24},
  {n:'요한복음',e:'John',ch:21},{n:'사도행전',e:'Acts',ch:28},{n:'로마서',e:'Romans',ch:16},
  {n:'고린도전서',e:'1 Corinthians',ch:16},{n:'고린도후서',e:'2 Corinthians',ch:13},
  {n:'갈라디아서',e:'Galatians',ch:6},{n:'에베소서',e:'Ephesians',ch:6},{n:'빌립보서',e:'Philippians',ch:4},
  {n:'골로새서',e:'Colossians',ch:4},{n:'데살로니가전서',e:'1 Thessalonians',ch:5},
  {n:'데살로니가후서',e:'2 Thessalonians',ch:3},{n:'디모데전서',e:'1 Timothy',ch:6},
  {n:'디모데후서',e:'2 Timothy',ch:4},{n:'디도서',e:'Titus',ch:3},{n:'빌레몬서',e:'Philemon',ch:1},
  {n:'히브리서',e:'Hebrews',ch:13},{n:'야고보서',e:'James',ch:5},{n:'베드로전서',e:'1 Peter',ch:5},
  {n:'베드로후서',e:'2 Peter',ch:3},{n:'요한일서',e:'1 John',ch:5},{n:'요한이서',e:'2 John',ch:1},
  {n:'요한삼서',e:'3 John',ch:1},{n:'유다서',e:'Jude',ch:1},{n:'요한계시록',e:'Revelation',ch:22}
];

// ===== 번역본 메타 =====
const TRANS_META = {
  RNKSV:{name:'한국어 개역개정', flag:'🇰🇷', rtl:false, cls:'', ntOnly:false},
  KRV:  {name:'한국어 개역한글', flag:'🇰🇷', rtl:false, cls:'', ntOnly:false},
  KJV:  {name:'English KJV',   flag:'🇺🇸', rtl:false, cls:'', ntOnly:false},
  NIV:  {name:'English NIV',   flag:'🇺🇸', rtl:false, cls:'', ntOnly:false},
  NASB: {name:'English NASB',  flag:'🇺🇸', rtl:false, cls:'', ntOnly:false},
  CUV:  {name:'中文 和合本',    flag:'🇨🇳', rtl:false, cls:'', ntOnly:false},
  SYNOD:{name:'Русский',        flag:'🇷🇺', rtl:false, cls:'', ntOnly:false},
  // ※ TR/WH = Bolls.life 공식 헬라어 신약 코드 (신약만 지원)
  TR:   {name:'헬라어 Textus Receptus (신약)', flag:'🏛️', rtl:false, cls:'greek', ntOnly:true},
  WH:   {name:'헬라어 Westcott-Hort (신약)',   flag:'🏛️', rtl:false, cls:'greek', ntOnly:true},
  WLC:  {name:'히브리어 WLC (구약)',            flag:'✡️', rtl:true,  cls:'hebrew', ntOnly:false},
};

// ===== 상태 =====
const State = {
  bookIdx: 0,     // 창세기=0
  chapter: 1,
  leftTrans: 'KRV',
  rightTrans: 'KJV',
  uiLang: 'en',
};

// ===== i18n =====
const I18N = {
  en: { book:'Book', chapter:'Chapter', left:'Left Column', right:'Right Column',
        loading:'Loading scripture...', prev:'← Prev', next:'Next →',
        share:'Share', copy:'Copy', pinterest:'Pin' },
  ko: { book:'성경 권', chapter:'장', left:'왼쪽 번역본', right:'오른쪽 번역본',
        loading:'말씀을 불러오는 중...', prev:'← 이전', next:'다음 →',
        share:'공유', copy:'복사', pinterest:'핀' },
};

// ===== 캐시 =====
const cache = new Map();

// ===== 텍스트 정리 (Strong's 번호, HTML 태그 등 제거) =====
function cleanText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')           // HTML 태그 제거
    .replace(/\d{3,5}/g, '')           // Strong's 번호 (3-5자리 숫자) 제거
    .replace(/\s{2,}/g, ' ')           // 다중 공백 → 단일
    .replace(/\r?\n/g, ' ')
    .trim();
}

const SITE_BASE_URL = 'https://bible2.kingdom2025.com';
const OG_IMAGE_URL = `${SITE_BASE_URL}/public/images/og-image.png`;
const DEFAULT_SEO_TITLE = 'Holyword - 매일 만나는 생명의 말씀';
const DEFAULT_SEO_DESCRIPTION = '창세기부터 요한계시록까지, 개역개정 성경을 어디서나 편하게 읽으세요.';

function trimForDescription(text, max = 150) {
  if (!text) return `${DEFAULT_SEO_DESCRIPTION}...`;
  const flat = cleanText(text);
  if (flat.length <= max) return `${flat}...`;
  return `${flat.slice(0, max)}...`;
}

function ensureMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(nameOrProp, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  const selector = `meta[${attr}="${nameOrProp}"]`;
  ensureMeta(selector, attr, nameOrProp).setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function getShareUrl() {
  return `${SITE_BASE_URL}${location.pathname}${location.search}`;
}

function applySeoMeta(title, description, url) {
  document.title = title;
  setMeta('description', description);
  setMeta('og:type', 'website', true);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', url, true);
  setMeta('og:image', OG_IMAGE_URL, true);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', OG_IMAGE_URL);
  setCanonical(url);
}

function applyDefaultSeoMeta() {
  applySeoMeta(DEFAULT_SEO_TITLE, DEFAULT_SEO_DESCRIPTION, getShareUrl());
}

async function updateChapterSeoMeta(book, bookNum, chapter) {
  try {
    const verses = await fetchChapter('RNKSV', bookNum, chapter);
    const firstVerse = verses?.[0]?.text || DEFAULT_SEO_DESCRIPTION;
    const title = `${book.n} ${chapter}장 - Holyword`;
    const description = trimForDescription(firstVerse, 150);
    applySeoMeta(title, description, getShareUrl());
  } catch (e) {
    applyDefaultSeoMeta();
  }
}


// ===== 로컬 한국어 개역개정 JSON 로더 =====
// bible/ko/{BOOK_ID}/{CHAPTER}.json 에서 로드
// 없으면 Bolls.life API 폴백
const BOOK_ID_BY_NUM = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA',
  '1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO',
  'ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO',
  'OBA','JON','MIC','NAH','HAB','ZEP','HAG','ZEC','MAL',
  'MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH',
  'PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS',
  '1PE','2PE','1JN','2JN','3JN','JUD','REV'
];

async function fetchLocalKorean(bookNum, chapter) {
  const bookId = BOOK_ID_BY_NUM[bookNum - 1];
  if (!bookId) return null;
  try {
    const url = `bible/ko/${bookId}/${chapter}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.v || !Array.isArray(data.v)) return null;
    return data.v.map((text, i) => ({ number: i + 1, text }));
  } catch(e) {
    return null;
  }
}

// ===== Bolls.life API =====
async function fetchChapter(trans, bookNum, chapter) {
  const key = `${trans}_${bookNum}_${chapter}`;
  if (cache.has(key)) return cache.get(key);

  // 한국어 번역본은 로컬 JSON 먼저 시도
  if (trans === 'RNKSV' || trans === 'KRV') {
    const local = await fetchLocalKorean(bookNum, chapter);
    if (local && local.length > 0) {
      cache.set(key, local);
      return local;
    }
    // 로컬에 없으면 Bolls.life KRV로 폴백
    const fallbackKey = `KRV_${bookNum}_${chapter}`;
    if (cache.has(fallbackKey)) return cache.get(fallbackKey);
  }

  const url = `https://bolls.life/get-text/${trans}/${bookNum}/${chapter}/`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
    const verses = data.map(v => ({
      number: v.verse,
      text: cleanText(v.text || '')
    }));
    cache.set(key, verses);
    return verses;
  } catch(e) {
    // KJV 폴백
    if (trans !== 'KJV') {
      try {
        const r2 = await fetch(`https://bolls.life/get-text/KJV/${bookNum}/${chapter}/`);
        const d2 = await r2.json();
        const v2 = d2.map(v=>({number:v.verse, text:cleanText(v.text||'')}));
        cache.set(key, v2);
        return v2;
      } catch(e2) {}
    }
    return [{number:1, text:`Unable to load ${BOOKS[State.bookIdx]?.e} ${chapter}. Please try again.`}];
  }
}

// ===== UI 초기화 =====
function init() {
  buildBookSelect();
  buildChapterSelect();
  detectUserLang();
  parseURL();
  loadBoth();
}

function buildBookSelect() {
  const sel = document.getElementById('bookSelect');
  BOOKS.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i+1}. ${b.e} / ${b.n}`;
    if (i === State.bookIdx) opt.selected = true;
    sel.appendChild(opt);
  });
}

function buildChapterSelect() {
  const sel = document.getElementById('chapterSelect');
  sel.innerHTML = '';
  const maxCh = BOOKS[State.bookIdx].ch;
  for (let i = 1; i <= maxCh; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Chapter ${i} / ${i}장`;
    if (i === State.chapter) opt.selected = true;
    sel.appendChild(opt);
  }
}

function detectUserLang() {
  const lang = navigator.language || navigator.userLanguage || 'en';
  if (lang.startsWith('ko')) {
    State.uiLang = 'ko';
    State.leftTrans = 'RNKSV';
    State.rightTrans = 'KJV';
    document.getElementById('leftTrans').value = 'RNKSV';
    document.getElementById('rightTrans').value = 'KJV';
    document.getElementById('uiLangFlag').textContent = '🇰🇷';
    document.getElementById('uiLangName').textContent = '한국어';
    document.documentElement.lang = 'ko';
  } else {
    // 영미권 기본: 영어 왼쪽
    State.leftTrans = 'KJV';
    State.rightTrans = 'KRV';
    document.getElementById('leftTrans').value = 'KJV';
    document.getElementById('rightTrans').value = 'KRV';
  }
}

function parseURL() {
  const p = new URLSearchParams(location.search);
  if (p.get('book')) { State.bookIdx = parseInt(p.get('book')) || 0; document.getElementById('bookSelect').value = State.bookIdx; }
  if (p.get('ch'))   { State.chapter = parseInt(p.get('ch')) || 1; }
  if (p.get('lt'))   { State.leftTrans = p.get('lt'); document.getElementById('leftTrans').value = State.leftTrans; }
  if (p.get('rt'))   { State.rightTrans = p.get('rt'); document.getElementById('rightTrans').value = State.rightTrans; }
  buildChapterSelect();
  document.getElementById('chapterSelect').value = State.chapter;
}

// ===== 이벤트 핸들러 =====
function onBookChange() {
  State.bookIdx = parseInt(document.getElementById('bookSelect').value);
  State.chapter = 1;
  buildChapterSelect();
  loadBoth();
}

function onChapterChange() {
  State.chapter = parseInt(document.getElementById('chapterSelect').value);
  loadBoth();
}

function prevChapter() {
  if (State.chapter > 1) { State.chapter--; document.getElementById('chapterSelect').value = State.chapter; loadBoth(); }
  else toast('First chapter');
}

function nextChapter() {
  if (State.chapter < BOOKS[State.bookIdx].ch) { State.chapter++; document.getElementById('chapterSelect').value = State.chapter; loadBoth(); }
  else toast('Last chapter');
}

function setLeftTrans(t) { document.getElementById('leftTrans').value = t; State.leftTrans = t; loadBoth(); }

// ===== NT 전용 번역본 구약 접근 방지 =====
const NT_START_BOOK_IDX = 39; // 마태복음=인덱스39 (0-based)

function isNTOnly(trans) {
  return TRANS_META[trans]?.ntOnly === true;
}

function checkNTWarning(trans, bookIdx) {
  if (isNTOnly(trans) && bookIdx < NT_START_BOOK_IDX) {
    return true; // 구약에서 NT-only 번역본 선택됨
  }
  return false;
}

// ===== 양쪽 동시 로드 =====
async function loadBoth() {
  State.leftTrans = document.getElementById('leftTrans').value;
  State.rightTrans = document.getElementById('rightTrans').value;

  const book = BOOKS[State.bookIdx];
  const bookNum = State.bookIdx + 1;

  // 컨트롤 정보 업데이트
  document.getElementById('ctrlBookChap').textContent = `${book.e} · Chapter ${State.chapter}`;
  document.getElementById('ctrlTransInfo').textContent = `${TRANS_META[State.leftTrans]?.name} ↔ ${TRANS_META[State.rightTrans]?.name}`;
  document.getElementById('chNavInfo').textContent = `${State.chapter} / ${book.ch}`;

  // 패널 헤더
  const lm = TRANS_META[State.leftTrans]||{}, rm = TRANS_META[State.rightTrans]||{};
  document.getElementById('leftPanelName').textContent = lm.flag+' '+lm.name;
  document.getElementById('rightPanelName').textContent = rm.flag+' '+rm.name;
  document.getElementById('leftDir').textContent = lm.rtl ? 'RTL' : 'LTR';
  document.getElementById('rightDir').textContent = rm.rtl ? 'RTL' : 'LTR';

  // NT-only 번역본 구약 접근 시 경고 표시
  const leftNTWarn = checkNTWarning(State.leftTrans, State.bookIdx);
  const rightNTWarn = checkNTWarning(State.rightTrans, State.bookIdx);

  // 로딩 표시
  showLoading('leftVerses'); showLoading('rightVerses');

  // NT-only 번역본이 구약 선택된 경우 처리
  const leftFetch = leftNTWarn
    ? Promise.resolve([{number:1, text:'⚠️ 헬라어 신약(TR/WH)은 신약성경(마태복음~요한계시록)만 지원합니다. 신약 책을 선택해 주세요.'}])
    : fetchChapter(State.leftTrans, bookNum, State.chapter);

  const rightFetch = rightNTWarn
    ? Promise.resolve([{number:1, text:'⚠️ Greek NT (TR/WH) supports only New Testament books (Matthew-Revelation). Please select a NT book.'}])
    : fetchChapter(State.rightTrans, bookNum, State.chapter);

  // 병렬 로드
  const [lv, rv] = await Promise.all([leftFetch, rightFetch]);

  renderVerses('leftVerses', lv, State.leftTrans, book, lm);
  renderVerses('rightVerses', rv, State.rightTrans, book, rm);
  updateURL();
  await updateChapterSeoMeta(book, bookNum, State.chapter);
  window.scrollTo({top:0, behavior:'smooth'});
}

function showLoading(id) {
  document.getElementById(id).innerHTML = `<div class="loading-wrap"><div class="spinner"></div><p>Loading...</p></div>`;
}

function renderVerses(containerId, verses, trans, book, meta) {
  const c = document.getElementById(containerId);
  c.innerHTML = '';

  verses.forEach(v => {
    const row = document.createElement('div');
    row.className = 'verse-row';
    row.dataset.verse = v.number;
    row.dataset.text = v.text;
    row.dataset.ref = `${book.e} ${State.chapter}:${v.number}`;

    const numEl = document.createElement('span');
    numEl.className = 'v-num';
    numEl.textContent = v.number;

    const txtEl = document.createElement('span');
    txtEl.className = 'v-text' + (meta.rtl ? ' rtl' : '') + (meta.cls ? ' '+meta.cls : '');
    txtEl.textContent = v.text;

    // 액션 버튼
    const actions = document.createElement('div');
    actions.className = 'verse-actions';
    actions.innerHTML = `
      <button class="v-action-btn share" onclick="openShareModal(event,'${v.text.replace(/'/g,"\\'")}','${book.e} ${State.chapter}:${v.number}')" title="Share verse card">🖼️</button>
      <button class="v-action-btn" onclick="copyVerse(event,'${v.text.replace(/'/g,"\\'")}','${book.e} ${State.chapter}:${v.number}')" title="Copy">📋</button>
      <button class="v-action-btn pinterest" onclick="pinVerse(event,'${v.text.replace(/'/g,"\\'")}','${book.e} ${State.chapter}:${v.number}')" title="Pin to Pinterest">📌</button>`;

    row.appendChild(numEl);
    row.appendChild(txtEl);
    row.appendChild(actions);
    row.addEventListener('click', () => row.classList.toggle('highlighted'));
    c.appendChild(row);
  });

  // 출처
  const src = document.createElement('div');
  src.style.cssText = 'text-align:center;padding:16px;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;margin-top:12px;';
  src.innerHTML = `Scripture: <a href="https://bolls.life" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none;">Bolls.life</a> · ${trans}`;
  c.appendChild(src);
}

function updateURL() {
  const url = new URL(location);
  url.searchParams.set('book', State.bookIdx);
  url.searchParams.set('ch', State.chapter);
  url.searchParams.set('lt', State.leftTrans);
  url.searchParams.set('rt', State.rightTrans);
  history.pushState({}, '', url);
}

// ===== 이미지 카드 공유 =====
let _shareVerse = '', _shareRef = '', _cardStyle = 'classic';

const CARD_STYLES = {
  classic: { bg:'#1a3a5c', text:'#ffffff', accent:'#d4a017', sub:'rgba(255,255,255,0.6)' },
  dark:    { bg:'#0f172a', text:'#f1f5f9', accent:'#60a5fa', sub:'rgba(241,245,249,0.6)' },
  gold:    { bg:'#1c1409', text:'#f0c040', accent:'#d4a017', sub:'rgba(240,192,64,0.7)' },
  nature:  { bg:'#14532d', text:'#dcfce7', accent:'#86efac', sub:'rgba(220,252,231,0.65)' },
};

function openShareModal(e, verse, ref) {
  if (e) e.stopPropagation();
  _shareVerse = verse;
  _shareRef = ref;
  _cardStyle = 'classic';
  document.getElementById('shareModal').style.display = 'flex';
  renderCard();
}

function closeShareModal(e) {
  if (!e || e.target === document.getElementById('shareModal')) {
    document.getElementById('shareModal').style.display = 'none';
  }
}

function changeCardStyle(style) {
  _cardStyle = style;
  renderCard();
}

function renderCard() {
  const canvas = document.getElementById('shareCanvas');
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 1080;
  canvas.width = W; canvas.height = H;

  const s = CARD_STYLES[_cardStyle] || CARD_STYLES.classic;

  // 배경
  ctx.fillStyle = s.bg;
  ctx.fillRect(0, 0, W, H);

  // 테두리 장식
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, W-60, H-60);
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.strokeRect(40, 40, W-80, H-80);
  ctx.globalAlpha = 1;

  // 십자가 아이콘
  ctx.fillStyle = s.accent;
  ctx.font = 'bold 52px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', W/2, 130);

  // 브랜드명
  ctx.fillStyle = s.accent;
  ctx.font = 'bold 24px Inter, Arial';
  ctx.fillText('HolyWord Bible', W/2, 175);

  // 구분선
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.moveTo(120, 200); ctx.lineTo(W-120, 200); ctx.stroke();
  ctx.globalAlpha = 1;

  // 성경 구절 텍스트 (자동 줄바꿈)
  ctx.fillStyle = s.text;
  ctx.font = 'italic 38px Georgia, serif';
  ctx.textAlign = 'center';
  const verse = `"${_shareVerse}"`;
  const maxW = W - 160;
  const lineH = 56;
  let y = 290;
  const words = verse.split(' ');
  let line = '';
  const lines = [];
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);

  // 텍스트가 너무 길면 폰트 축소
  if (lines.length > 8) ctx.font = 'italic 30px Georgia, serif';
  lines.forEach(l => { ctx.fillText(l, W/2, y); y += lineH; });

  // 성경 레퍼런스
  ctx.fillStyle = s.accent;
  ctx.font = 'bold 30px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('— ' + _shareRef, W/2, Math.max(y + 40, 820));

  // 하단 구분선
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.moveTo(120, H-120); ctx.lineTo(W-120, H-120); ctx.stroke();
  ctx.globalAlpha = 1;

  // 워터마크
  ctx.fillStyle = s.sub;
  ctx.font = '20px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('bible2.kingdom2025.com', W/2, H-70);
}

function downloadCard() {
  const canvas = document.getElementById('shareCanvas');
  const a = document.createElement('a');
  a.download = `holyword-${_shareRef.replace(/[^a-zA-Z0-9]/g,'-')}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  toast('Image downloaded!');
}

function shareTo(platform) {
  const canvas = document.getElementById('shareCanvas');
  const imgUrl = canvas.toDataURL('image/png');
  const text = encodeURIComponent(`"${_shareVerse}" — ${_shareRef} | ${SITE_BASE_URL}`);
  const siteUrl = encodeURIComponent(SITE_BASE_URL);

  switch(platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${text}`, '_blank', 'width=600,height=400');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${siteUrl}&hashtags=Bible,HolyWord,Scripture`, '_blank', 'width=600,height=400');
      break;
    case 'pinterest':
      pinVerse(null, _shareVerse, _shareRef);
      break;
    case 'instagram':
      downloadCard();
      toast('Image saved! Upload to Instagram manually.');
      break;
  }
}

function pinVerse(e, verse, ref) {
  if (e) e.stopPropagation();
  const desc = encodeURIComponent(`"${verse}" — ${ref} | Read more at ${SITE_BASE_URL}`);
  const media = encodeURIComponent(OG_IMAGE_URL);
  const url = encodeURIComponent(SITE_BASE_URL);
  window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank', 'width=750,height=550');
}

function copyVerse(e, verse, ref) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(`"${verse}" — ${ref}\n\n${SITE_BASE_URL}`).then(() => toast('Copied! ✓'));
}

// ===== UI 언어 =====
function setUiLang(lang) {
  State.uiLang = lang;
  const flags = {en:'🇺🇸', ko:'🇰🇷'};
  const names = {en:'English', ko:'한국어'};
  document.getElementById('uiLangFlag').textContent = flags[lang] || '🇺🇸';
  document.getElementById('uiLangName').textContent = names[lang] || 'English';
  document.getElementById('langDropdown').classList.remove('open');
  document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  toast(lang === 'ko' ? '한국어 모드' : 'English mode');
}

function toggleLangMenu() {
  document.getElementById('langDropdown').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-picker')) document.getElementById('langDropdown')?.classList.remove('open');
});

// ===== TOAST =====
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== INIT =====
window.addEventListener('popstate', () => { parseURL(); loadBoth(); });
document.addEventListener('DOMContentLoaded', init);
