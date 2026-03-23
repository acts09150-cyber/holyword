/**
 * HolyWord Global v2 - app.js
 * 원어 분석 기능이 통합된 최종 버전
 */

// ===== 66권 성경 목록 (기존 유지) =====
const BOOKS = [
  {n:'창세기',e:'Genesis',ch:50},{n:'출애굽기',e:'Exodus',ch:40},{n:'레위기',e:'Leviticus',ch:27},
  {n:'민수기',e:'Numbers',ch:36},{n:'신명기',e:'Deuteronomy',ch:34},{n:'여호수아',e:'Joshua',ch:24},
  {n:'사사기',e:'Judges',ch:21},{n:'룻기',e:'Ruth',ch:4},{n:'사무엘상',e:'1 Samuel',ch:31},
  {n:'사무엘하',e:'2 Samuel',ch:24},{n:'열왕기상',e:'1 Kings',ch:22},{n:'열왕기하',e:'2 Kings',ch:25},
  {n:'역대상',e:'1 Chronicles',ch:29},{n:'역대하',e:'2 Chronicles',ch:36},{n:'에스라',e:'Ezra',ch:10},
  {n:'느헤미야',e:'Nehemiah',ch:13},{n:'에스더',e:'Esther',ch:10},{n:'욥기',e:'Job',ch:42},
  {n:'시편',e:'Psalms',ch:150},{n:'잠언',e:'Proverbs',ch:31},{n:'전도서',e:'Ecclesiastes',ch:12},// js/app.js (메뉴와 원어 기능이 모두 포함된 버전)
const State = { bookIdx: 0, chapter: 1, leftTrans: 'KRV', rightTrans: 'KJV' };

async function loadOriginalInfo(verseNum, krText) {
    const bookNum = State.bookIdx + 1;
    const trans = bookNum <= 39 ? 'WLC' : 'SBLGNT';
    const container = document.getElementById('analysis-content');// js/app.js (전체 복사 후 덮어쓰기)
const State = { bookIdx: 0, chapter: 1, leftTrans: 'KRV', rightTrans: 'KJV' };

// 초기화 함수
function init() {
    buildBookSelect();
    buildChapterSelect();
    loadBoth();
}

async function fetchChapter(trans, bookNum, chapter) {
    try {
        const res = await fetch(`https://bolls.life/get-text/${trans}/${bookNum}/${chapter}/`);
        const data = await res.json();
        return data.map(v => ({ number: v.verse, text: v.text.replace(/<[^>]+>/g, '').trim() }));
    } catch(e) { return [{number:1, text:'데이터를 불러올 수 없습니다.'}]; }
}

async function loadBoth() {
    State.leftTrans = document.getElementById('leftTrans').value;
    State.rightTrans = document.getElementById('rightTrans').value;
    const bookNum = State.bookIdx + 1;

    const [lv, rv] = await Promise.all([
        fetchChapter(State.leftTrans, bookNum, State.chapter),
        fetchChapter(State.rightTrans, bookNum, State.chapter)
    ]);

    renderVerses('leftVerses', lv);
    renderVerses('rightVerses', rv);
}

function renderVerses(containerId, verses) {
    const c = document.getElementById(containerId);
    c.innerHTML = '';
    verses.forEach(v => {
        const row = document.createElement('div');
        row.className = 'verse-row';
        row.style.cursor = 'pointer';
        row.onclick = () => {
            document.querySelectorAll('.verse-row').forEach(r => r.classList.remove('highlighted'));
            // 양쪽 열의 동일한 절 번호에 하이라이트
            document.querySelectorAll(`.verse-row`).forEach(r => {
                if(r.innerText.startsWith(v.number + ' ')) r.classList.add('highlighted');
            });
            loadOriginalInfo(v.number, v.text);
        };
        row.innerHTML = `<span class="v-num" style="font-weight:bold; color:#2c3e50; margin-right:8px;">${v.number}</span><span class="v-text">${v.text}</span>`;
        c.appendChild(row);
    });
}

async function loadOriginalInfo(verseNum, krText) {
    const bookNum = State.bookIdx + 1;
    const trans = bookNum <= 39 ? 'WLC' : 'SBLGNT'; // 구약 히브리어, 신약 헬라어 자동 선택
    const container = document.getElementById('analysis-content');
    container.innerHTML = `<div style="text-align:center;">원어 분석 중...</div>`;

    try {
        const res = await fetch(`https://bolls.life/get-text/${trans}/${bookNum}/${State.chapter}/${verseNum}/`);
        const data = await res.json();
        const ori = data.text.replace(/<[^>]+>/g, '').trim();

        container.innerHTML = `
            <div style="font-size:1.8rem; margin-bottom:15px; color:#1a3a5c; line-height:1.4; direction:${bookNum<=39?'rtl':'ltr'}">${ori}</div>
            <p style="color:#555; font-size:0.95rem; border-left:3px solid #d1d8d6; padding-left:10px;">${krText}</p>
            <button onclick="copyPastor('${krText.replace(/'/g,"\\'")}','${ori.replace(/'/g,"\\'")}','${verseNum}')" style="width:100%; padding:12px; background:#2c3e50; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:20px;">📋 사역자용 상세 복사</button>
        `;
    } catch(e) { container.innerHTML = "원어 데이터를 불러오지 못했습니다."; }
}

function copyPastor(kr, ori, v) {
    const bookName = BOOKS[State.bookIdx].n;
    const result = `> [원어연구] ${kr}\n> 원어(${bookName} ${State.chapter}:${v}): ${ori}\n\n출처: HolyWord 글로벌 성경`;
    navigator.clipboard.writeText(result);
    alert("사역자용 상세 복사가 완료되었습니다!");
}

// 목사님의 bible-data.js에 BOOKS 배열이 있다고 가정합니다.
function buildBookSelect() {
    const sel = document.getElementById('bookSelect');
    BOOKS.forEach((b, i) => {
        const opt = document.createElement('option');
        opt.value = i; opt.textContent = b.n;
        sel.appendChild(opt);
    });
}

function buildChapterSelect() {
    const sel = document.getElementById('chapterSelect');
    sel.innerHTML = '';
    for (let i = 1; i <= BOOKS[State.bookIdx].ch; i++) {
        const opt = document.createElement('option');
        opt.value = i; opt.textContent = i + '장';
        sel.appendChild(opt);
    }
}

function onBookChange() { State.bookIdx = parseInt(document.getElementById('bookSelect').value); State.chapter = 1; buildChapterSelect(); loadBoth(); }
function onChapterChange() { State.chapter = parseInt(document.getElementById('chapterSelect').value); loadBoth(); }

document.addEventListener('DOMContentLoaded', init);
    container.innerHTML = `<div style="text-align:center; padding:20px;">로딩 중...</div>`;

    try {
        const res = await fetch(`https://bolls.life/get-text/${trans}/${bookNum}/${State.chapter}/${verseNum}/`);
        const data = await res.json();
        const ori = data.text.replace(/<[^>]+>/g, '').trim();

        container.innerHTML = `
            <div style="font-size:1.7rem; margin-bottom:15px; color:#2c3e50; direction:${bookNum<=39?'rtl':'ltr'}">${ori}</div>
            <p style="color:#666; font-size:0.95rem; border-left:3px solid #ccc; padding-left:10px;">${krText}</p>
            <button onclick="copyToNote('${krText.replace(/'/g,"\\'")}','${ori.replace(/'/g,"\\'")}','${verseNum}')" style="width:100%; padding:15px; background:#2c3e50; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:20px;">사역자용 상세 복사</button>
        `;
    } catch(e) { container.innerHTML = "데이터 로드 실패"; }
}

function copyToNote(kr, ori, v) {
    const ref = `${BOOKS[State.bookIdx].n} ${State.chapter}:${v}`;
    const text = `[HolyWord 원어연구]\n본문: ${kr}\n원어(${ref}): ${ori}`;
    navigator.clipboard.writeText(text);
    alert("사역자용 상세 데이터가 복사되었습니다!");
}

function renderVerses(id, verses) {
    const c = document.getElementById(id);
    c.innerHTML = '';
    verses.forEach(v => {
        const div = document.createElement('div');
        div.className = 'verse-row';
        div.onclick = () => {
            document.querySelectorAll('.verse-row').forEach(r => r.classList.remove('highlighted'));
            div.classList.add('highlighted');
            loadOriginalInfo(v.number, v.text);
        };
        div.innerHTML = `<span style="color:#2c3e50; font-weight:bold; margin-right:10px;">${v.number}</span>${v.text}`;
        c.appendChild(div);
    });
}

// 초기화 및 기타 함수는 기존 소스 코드(BOOKS 등)와 함께 로드되도록 설정
function onBookChange() { State.bookIdx = parseInt(document.getElementById('bookSelect').value); State.chapter = 1; loadBoth(); }
function onChapterChange() { State.chapter = parseInt(document.getElementById('chapterSelect').value); loadBoth(); }
async function loadBoth() { /* fetchChapter 호출 및 renderVerses 실행 로직 */ }
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

const TRANS_META = {
  KRV: {name:'Korean (KRV)', flag:'🇰🇷', rtl:false, cls:''},
  KJV: {name:'English (KJV)', flag:'🇺🇸', rtl:false, cls:''},
  NIV: {name:'English (NIV)', flag:'🇺🇸', rtl:false, cls:''},
  NASB: {name:'English (NASB)', flag:'🇺🇸', rtl:false, cls:''},
  CUV: {name:'Chinese (CUV)', flag:'🇨🇳', rtl:false, cls:''},
  SYNOD:{name:'Russian (Synodal)', flag:'🇷🇺', rtl:false, cls:''},
  LXXE: {name:'Greek LXX', flag:'🏛️', rtl:false, cls:'greek'},
  TR: {name:'Greek NT (TR)', flag:'🏛️', rtl:false, cls:'greek'},
  WLC: {name:'Hebrew OT (WLC)', flag:'✡️', rtl:true, cls:'hebrew'},
};

const State = { bookIdx: 0, chapter: 1, leftTrans: 'KRV', rightTrans: 'KJV', uiLang: 'ko' };
const cache = new Map();

async function fetchChapter(trans, bookNum, chapter) {
  const key = `${trans}_${bookNum}_${chapter}`;
  if (cache.has(key)) return cache.get(key);
  try {
    const res = await fetch(`https://bolls.life/get-text/${trans}/${bookNum}/${chapter}/`);
    const data = await res.json();
    const verses = data.map(v => ({ number: v.verse, text: v.text.replace(/<[^>]+>/g, '').trim() }));
    cache.set(key, verses);
    return verses;
  } catch(e) { return [{number:1, text:'Error loading data.'}]; }
}

// ===== 원어 분석 기능 핵심 =====
async function loadOriginalInfo(verseNum, krText) {
  const bookNum = State.bookIdx + 1;
  const translation = bookNum <= 39 ? 'WLC' : 'SBLGNT';
  const container = document.getElementById('analysis-content');
  container.innerHTML = `<div class="spinner-sm"></div> 분석 중...`;

  try {
    const res = await fetch(`https://bolls.life/get-text/${translation}/${bookNum}/${State.chapter}/${verseNum}/`);
    const data = await res.json();
    const oriText = data.text.replace(/<[^>]+>/g, '').trim();
    
    container.innerHTML = `
      <div style="font-size:1.6rem; margin-bottom:15px; color:#2c3e50; direction:${bookNum<=39?'rtl':'ltr'}">${oriText}</div>
      <p style="font-size:0.9rem; color:#666; border-left:3px solid #ddd; padding-left:10px;">${krText}</p>
      <button onclick="copyPastor('${krText.replace(/'/g,"\\'")}','${oriText.replace(/'/g,"\\'")}','${verseNum}')" style="width:100%; padding:12px; background:#2c3e50; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:10px;">📋 사역자용 상세 복사</button>
    `;
  } catch(e) { container.innerHTML = '원어를 불러오지 못했습니다.'; }
}

function copyPastor(kr, ori, v) {
  const ref = `${BOOKS[State.bookIdx].n} ${State.chapter}:${v}`;
  const txt = `> [원어연구] ${kr}\n> 원어(${ref}): ${ori}\n\n출처: HolyWord 글로벌 성경`;
  navigator.clipboard.writeText(txt);
  toast('사역자용 포맷으로 복사되었습니다!');
}

function init() {
  buildBookSelect(); buildChapterSelect(); loadBoth();
}

function buildBookSelect() {
  const sel = document.getElementById('bookSelect');
  BOOKS.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = `${i+1}. ${b.e} / ${b.n}`;
    sel.appendChild(opt);
  });
}

function buildChapterSelect() {
  const sel = document.getElementById('chapterSelect');
  sel.innerHTML = '';
  for (let i = 1; i <= BOOKS[State.bookIdx].ch; i++) {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = `${i}장`;
    sel.appendChild(opt);
  }
}

function onBookChange() { State.bookIdx = parseInt(document.getElementById('bookSelect').value); State.chapter = 1; buildChapterSelect(); loadBoth(); }
function onChapterChange() { State.chapter = parseInt(document.getElementById('chapterSelect').value); loadBoth(); }

async function loadBoth() {
  const [lv, rv] = await Promise.all([
    fetchChapter(document.getElementById('leftTrans').value, State.bookIdx+1, State.chapter),
    fetchChapter(document.getElementById('rightTrans').value, State.bookIdx+1, State.chapter)
  ]);
  renderVerses('leftVerses', lv); renderVerses('rightVerses', rv);
}

function renderVerses(id, verses) {
  const c = document.getElementById(id);
  c.innerHTML = '';
  verses.forEach(v => {
    const row = document.createElement('div');
    row.className = 'verse-row';
    row.onclick = () => {
      document.querySelectorAll('.verse-row').forEach(r=>r.classList.remove('highlighted'));
      row.classList.add('highlighted');
      loadOriginalInfo(v.number, v.text);
    };
    row.innerHTML = `<span class="v-num">${v.number}</span><span class="v-text">${v.text}</span>`;
    c.appendChild(row);
  });
}

function toast(m) { const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000); }

document.addEventListener('DOMContentLoaded', init);
