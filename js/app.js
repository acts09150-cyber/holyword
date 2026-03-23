/**
 * HolyWord Global v2 - app.js (Original Language & Smart Copy Enhanced)
 * Parallel Bible Reader + Image Card Sharing + Original Language Analysis
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
  KRV:   {name:'Korean (KRV)', flag:'🇰🇷', rtl:false, cls:''},
  KJV:   {name:'English (KJV)', flag:'🇺🇸', rtl:false, cls:''},
  NIV:   {name:'English (NIV)', flag:'🇺🇸', rtl:false, cls:''},
  NASB:  {name:'English (NASB)', flag:'🇺🇸', rtl:false, cls:''},
  CUV:   {name:'Chinese (CUV)', flag:'🇨🇳', rtl:false, cls:''},
  SYNOD: {name:'Russian (Synodal)', flag:'🇷🇺', rtl:false, cls:''},
  LXXE:  {name:'Greek LXX', flag:'🏛️', rtl:false, cls:'greek'},
  TR:    {name:'Greek NT (TR)', flag:'🏛️', rtl:false, cls:'greek'},
  WLC:   {name:'Hebrew OT (WLC)', flag:'✡️', rtl:true, cls:'hebrew'},
};

// ===== 상태 =====
const State = {
  bookIdx: 0,
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

// ===== Bolls.life API =====
async function fetchChapter(trans, bookNum, chapter) {
  const key = `${trans}_${bookNum}_${chapter}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://bolls.life/get-text/${trans}/${bookNum}/${chapter}/`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
    const verses = data.map(v => ({
      number: v.verse,
      text: (v.text || '').replace(/<[^>]+>/g, '').replace(/\r?\n/g,' ').trim()
    }));
    cache.set(key, verses);
    return verses;
  } catch(e) {
    if (trans !== 'KJV') {
      try {
        const r2 = await fetch(`https://bolls.life/get-text/KJV/${bookNum}/${chapter}/`);
        const d2 = await r2.json();
        const v2 = d2.map(v=>({number:v.verse, text:(v.text||'').replace(/<[^>]+>/g,'').trim()}));
        cache.set(key, v2);
        return v2;
      } catch(e2) {}
    }
    return [{number:1, text:`Unable to load ${BOOKS[State.bookIdx]?.e} ${chapter}. Please try again.`}];
  }
}

// ===== 원어 데이터 로드 & 분석창 업데이트 (추가된 기능) =====
async function loadOriginalInfo(verseNum, krText) {
  const bookNum = State.bookIdx + 1;
  const translation = bookNum <= 39 ? 'WLC' : 'SBLGNT';
  const isRTL = bookNum <= 39;
  const bookName = BOOKS[State.bookIdx].n;

  const analysisContent = document.getElementById('analysis-content');
  if (!analysisContent) return;

  analysisContent.innerHTML = `<div class="spinner-sm"></div> <span style="font-size:0.85rem; color:#666;">원어 분석 중...</span>`;

  try {
    const res = await fetch(`https://bolls.life/get-text/${translation}/${bookNum}/${State.chapter}/${verseNum}/`);
    const data = await res.json();
    const originalText = data.text.replace(/<[^>]+>/g, '').trim();

    analysisContent.innerHTML = `
      <div style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
        <span style="font-size:0.8rem; background:var(--gold); color:#fff; padding:2px 6px; border-radius:4px;">${translation}</span>
        <span style="font-size:0.8rem; color:#888; margin-left:8px;">${bookName} ${State.chapter}:${verseNum}</span>
      </div>
      <div class="original-display ${isRTL ? 'hebrew-rtl' : 'greek-ltr'}" style="font-size:1.6rem; line-height:1.6; margin-bottom:15px; color:var(--navy-dark);">
        ${originalText}
      </div>
      <p style="font-size:0.9rem; color:#555; margin-bottom:20px; border-left:3px solid #ddd; padding-left:10px;">${krText}</p>
      
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn-action-primary" onclick="smartCopy('${krText.replace(/'/g,"\\'")}','${originalText.replace(/'/g,"\\'")}','${bookName}','${State.chapter}','${verseNum}','PASTOR')">📋 사역자용 상세 복사</button>
        <button class="btn-action-secondary" onclick="smartCopy('${krText.replace(/'/g,"\\'")}','${originalText.replace(/'/g,"\\'")}','${bookName}','${State.chapter}','${verseNum}','SIMPLE')">한글+원어만 복사</button>
      </div>
    `;
  } catch(e) {
    analysisContent.innerHTML = `<p style="color:red; font-size:0.85rem;">원어 데이터를 불러오지 못했습니다.</p>`;
  }
}

function smartCopy(kr, ori, b, c, v, mode) {
  let textToCopy = "";
  if(mode === 'PASTOR') {
    textToCopy = `> [설교연구] ${kr}\n> 원어(${b} ${c}:${v}): ${ori}\n\n출처: HolyWord 글로벌 성경서비스`;
  } else {
    textToCopy = `${kr} (${ori})`;
  }
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    toast('복사 완료! 설교문에 붙여넣으세요. ✓');
  });
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
    State.leftTrans = 'KRV';
    State.rightTrans = 'KJV';
    document.getElementById('leftTrans').value = 'KRV';
    document.getElementById('rightTrans').value = 'KJV';
    document.getElementById('uiLangFlag').textContent = '🇰🇷';
    document.getElementById('uiLangName').textContent = '한국어';
    document.documentElement.lang = 'ko';
  } else {
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

// ===== 양쪽 동시 로드 =====
async function loadBoth() {
  State.leftTrans = document.getElementById('leftTrans').value;
  State.rightTrans = document.getElementById('rightTrans').value;

  const book = BOOKS[State.bookIdx];
  const bookNum = State.bookIdx + 1;

  document.getElementById('ctrlBookChap').textContent = `${book.e} · Chapter ${State.chapter}`;
  document.getElementById('ctrlTransInfo').textContent = `${TRANS_META[State.leftTrans]?.name} ↔ ${TRANS_META[State.rightTrans]?.name}`;
  document.getElementById('chNavInfo').textContent = `${State.chapter} / ${book.ch}`;
  document.title = `${book.e} ${State.chapter} (${State.leftTrans}/${State.rightTrans}) | HolyWord Bible`;

  const lm = TRANS_META[State.leftTrans]||{}, rm = TRANS_META[State.rightTrans]||{};
  document.getElementById('leftPanelName').textContent = lm.flag+' '+lm.name;
  document.getElementById('rightPanelName').textContent = rm.flag+' '+rm.name;
  document.getElementById('leftDir').textContent = lm.rtl ? 'RTL' : 'LTR';
  document.getElementById('rightDir').textContent = rm.rtl ? 'RTL' : 'LTR';

  showLoading('leftVerses'); showLoading('rightVerses');

  const [lv, rv] = await Promise.all([
    fetchChapter(State.leftTrans, bookNum, State.chapter),
    fetchChapter(State.rightTrans, bookNum, State.chapter)
  ]);

  renderVerses('leftVerses', lv, State.leftTrans, book, lm);
  renderVerses('rightVerses', rv, State.rightTrans, book, rm);
  updateURL();
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

    // 클릭 시 원어 분석창 로드 (추가된 부분)
    row.onclick = () => {
        // 모든 하이라이트 제거 후 현재 클릭한 절 하이라이트
        document.querySelectorAll('.verse-row').forEach(r => r.classList.remove('highlighted'));
        document.querySelectorAll(`[data-verse="${v.number}"]`).forEach(r => r.classList.add('highlighted'));
        
        // 원어 데이터 불러오기 (한글 텍스트를 함께 전달 - 보통 왼쪽이나 오른쪽에 한글이 있을 때)
        // 여기서는 v.text가 현재 행의 텍스트이므로 이를 활용
        loadOriginalInfo(v.number, v.text);
    };

    const numEl = document.createElement('span');
    numEl.className = 'v-num';
    numEl.textContent = v.number;

    const txtEl = document.createElement('span');
    txtEl.className = 'v-text' + (meta.rtl ? ' rtl' : '') + (meta.cls ? ' '+meta.cls : '');
    txtEl.textContent = v.text;

    const actions = document.createElement('div');
    actions.className = 'verse-actions';
    actions.innerHTML = `
      <button class="v-action-btn share" onclick="openShareModal(event,'${v.text.replace(/'/g,"\\'")}','${book.e} ${State.chapter}:${v.number}')" title="Share verse card">🖼️</button>
      <button class="v-action-btn" onclick="copyVerse(event,'${v.text.replace(/'/g,"\\'")}','${book.e} ${State.chapter}:${v.number}')" title="Copy">📋</button>
    `;

    row.appendChild(numEl);
    row.appendChild(txtEl);
    row.appendChild(actions);
    c.appendChild(row);
  });
}

function updateURL() {
  const url = new URL(location);
  url.searchParams.set('book', State.bookIdx);
  url.searchParams.set('ch', State.chapter);
  url.searchParams.set('lt', State.leftTrans);
  url.searchParams.set('rt', State.rightTrans);
  history.pushState({}, '', url);
}

// ===== 이미지 카드 공유 로직 (기존 유지) =====
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
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = s.accent; ctx.lineWidth = 3; ctx.strokeRect(30, 30, W-60, H-60);
  ctx.fillStyle = s.accent; ctx.font = 'bold 52px serif'; ctx.textAlign = 'center'; ctx.fillText('✦', W/2, 130);
  ctx.font = 'bold 24px Inter, Arial'; ctx.fillText('HolyWord Bible', W/2, 175);
  ctx.fillStyle = s.text; ctx.font = 'italic 38px Georgia, serif';
  const verse = `"${_shareVerse}"`;
  const maxW = W - 160; const lineH = 56;
  let y = 290; const words = verse.split(' '); let line = ''; const lines = [];
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  lines.forEach(l => { ctx.fillText(l, W/2, y); y += lineH; });
  ctx.fillStyle = s.accent; ctx.font = 'bold 30px Inter, Arial'; ctx.fillText('— ' + _shareRef, W/2, Math.max(y + 40, 820));
  ctx.fillStyle = s.sub; ctx.font = '20px Inter, Arial'; ctx.fillText('holyword.kr', W/2, H-70);
}

function downloadCard() {
  const canvas = document.getElementById('shareCanvas');
  const a = document.createElement('a');
  a.download = `holyword-${_shareRef}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

function copyVerse(e, verse, ref) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(`"${verse}" — ${ref}\n\nhttps://holyword.kr`).then(() => toast('복사 완료! ✓'));
}

// ===== UI 설정 =====
function setUiLang(lang) {
  State.uiLang = lang;
  document.getElementById('uiLangFlag').textContent = lang === 'ko' ? '🇰🇷' : '🇺🇸';
  document.getElementById('langDropdown').classList.remove('open');
  document.documentElement.lang = lang;
}

function toggleLangMenu() { document.getElementById('langDropdown').classList.toggle('open'); }

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== INIT =====
window.addEventListener('popstate', () => { parseURL(); loadBoth(); });
document.addEventListener('DOMContentLoaded', init);
