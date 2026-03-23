/**
 * HolyWord - bible-data.js v9 (최종)
 * API: Bolls.life (https://bolls.life/api/)
 * URL: https://bolls.life/get-text/{translation}/{book}/{chapter}/
 * 응답: [{pk, verse, text}, ...]
 *
 * 지원 번역본 6종:
 *  KRV   → 한국어 개역개정
 *  KJV   → English King James Version
 *  NIV   → English New International Version
 *  NASB  → English New American Standard Bible
 *  CUV   → 中文 和合本
 *  SYNOD → Русский Синодальный
 */

// ===== 성경 66권 =====
const BIBLE_BOOKS = {
  ot:[
    {id:'GEN',name:'창세기',chapters:50},{id:'EXO',name:'출애굽기',chapters:40},
    {id:'LEV',name:'레위기',chapters:27},{id:'NUM',name:'민수기',chapters:36},
    {id:'DEU',name:'신명기',chapters:34},{id:'JOS',name:'여호수아',chapters:24},
    {id:'JDG',name:'사사기',chapters:21},{id:'RUT',name:'룻기',chapters:4},
    {id:'1SA',name:'사무엘상',chapters:31},{id:'2SA',name:'사무엘하',chapters:24},
    {id:'1KI',name:'열왕기상',chapters:22},{id:'2KI',name:'열왕기하',chapters:25},
    {id:'1CH',name:'역대상',chapters:29},{id:'2CH',name:'역대하',chapters:36},
    {id:'EZR',name:'에스라',chapters:10},{id:'NEH',name:'느헤미야',chapters:13},
    {id:'EST',name:'에스더',chapters:10},{id:'JOB',name:'욥기',chapters:42},
    {id:'PSA',name:'시편',chapters:150},{id:'PRO',name:'잠언',chapters:31},
    {id:'ECC',name:'전도서',chapters:12},{id:'SNG',name:'아가',chapters:8},
    {id:'ISA',name:'이사야',chapters:66},{id:'JER',name:'예레미야',chapters:52},
    {id:'LAM',name:'예레미야애가',chapters:5},{id:'EZK',name:'에스겔',chapters:48},
    {id:'DAN',name:'다니엘',chapters:12},{id:'HOS',name:'호세아',chapters:14},
    {id:'JOL',name:'요엘',chapters:3},{id:'AMO',name:'아모스',chapters:9},
    {id:'OBA',name:'오바댜',chapters:1},{id:'JON',name:'요나',chapters:4},
    {id:'MIC',name:'미가',chapters:7},{id:'NAH',name:'나훔',chapters:3},
    {id:'HAB',name:'하박국',chapters:3},{id:'ZEP',name:'스바냐',chapters:3},
    {id:'HAG',name:'학개',chapters:2},{id:'ZEC',name:'스가랴',chapters:14},
    {id:'MAL',name:'말라기',chapters:4}
  ],
  nt:[
    {id:'MAT',name:'마태복음',chapters:28},{id:'MRK',name:'마가복음',chapters:16},
    {id:'LUK',name:'누가복음',chapters:24},{id:'JHN',name:'요한복음',chapters:21},
    {id:'ACT',name:'사도행전',chapters:28},{id:'ROM',name:'로마서',chapters:16},
    {id:'1CO',name:'고린도전서',chapters:16},{id:'2CO',name:'고린도후서',chapters:13},
    {id:'GAL',name:'갈라디아서',chapters:6},{id:'EPH',name:'에베소서',chapters:6},
    {id:'PHP',name:'빌립보서',chapters:4},{id:'COL',name:'골로새서',chapters:4},
    {id:'1TH',name:'데살로니가전서',chapters:5},{id:'2TH',name:'데살로니가후서',chapters:3},
    {id:'1TI',name:'디모데전서',chapters:6},{id:'2TI',name:'디모데후서',chapters:4},
    {id:'TIT',name:'디도서',chapters:3},{id:'PHM',name:'빌레몬서',chapters:1},
    {id:'HEB',name:'히브리서',chapters:13},{id:'JAS',name:'야고보서',chapters:5},
    {id:'1PE',name:'베드로전서',chapters:5},{id:'2PE',name:'베드로후서',chapters:3},
    {id:'1JN',name:'요한일서',chapters:5},{id:'2JN',name:'요한이서',chapters:1},
    {id:'3JN',name:'요한삼서',chapters:1},{id:'JUD',name:'유다서',chapters:1},
    {id:'REV',name:'요한계시록',chapters:22}
  ]
};

// ===== 번역본 설정 (6종) =====
const LANG_CONFIG = {
  KRV: {
    label:'🇰🇷 한국어', sub:'개역개정 (KRV)',
    rtl:false, lang:'ko'
  },
  KJV: {
    label:'🇺🇸 English', sub:'King James (KJV)',
    rtl:false, lang:'en'
  },
  NIV: {
    label:'🇺🇸 English', sub:'NIV',
    rtl:false, lang:'en'
  },
  NASB: {
    label:'🇺🇸 English', sub:'NASB',
    rtl:false, lang:'en'
  },
  CUV: {
    label:'🇨🇳 中文', sub:'和合本 (CUV)',
    rtl:false, lang:'zh'
  },
  SYNOD: {
    label:'🇷🇺 Русский', sub:'Синодальный (SYNOD)',
    rtl:false, lang:'ru'
  }
};

// ===== 책 번호 매핑 (Bolls.life: 창세기=1 ~ 요한계시록=66) =====
const BOOK_NUM = {
  '창세기':1,'출애굽기':2,'레위기':3,'민수기':4,'신명기':5,
  '여호수아':6,'사사기':7,'룻기':8,'사무엘상':9,'사무엘하':10,
  '열왕기상':11,'열왕기하':12,'역대상':13,'역대하':14,'에스라':15,
  '느헤미야':16,'에스더':17,'욥기':18,'시편':19,'잠언':20,
  '전도서':21,'아가':22,'이사야':23,'예레미야':24,'예레미야애가':25,
  '에스겔':26,'다니엘':27,'호세아':28,'요엘':29,'아모스':30,
  '오바댜':31,'요나':32,'미가':33,'나훔':34,'하박국':35,
  '스바냐':36,'학개':37,'스가랴':38,'말라기':39,
  '마태복음':40,'마가복음':41,'누가복음':42,'요한복음':43,'사도행전':44,
  '로마서':45,'고린도전서':46,'고린도후서':47,'갈라디아서':48,'에베소서':49,
  '빌립보서':50,'골로새서':51,'데살로니가전서':52,'데살로니가후서':53,
  '디모데전서':54,'디모데후서':55,'디도서':56,'빌레몬서':57,
  '히브리서':58,'야고보서':59,'베드로전서':60,'베드로후서':61,
  '요한일서':62,'요한이서':63,'요한삼서':64,'유다서':65,'요한계시록':66
};

// ===== 오늘의 말씀 =====
const DAILY_VERSES = [
  {text:'내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',ref:'빌립보서 4:13'},
  {text:'여호와는 나의 목자시니 내게 부족함이 없으리로다',ref:'시편 23:1'},
  {text:'하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라',ref:'요한복음 3:16'},
  {text:'주 너의 하나님이 너와 함께 하느니라 그가 너를 떠나지 아니하시며 버리지 아니하시리라',ref:'신명기 31:6'},
  {text:'아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라',ref:'빌립보서 4:6'},
  {text:'여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요',ref:'이사야 40:31'},
  {text:'너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라',ref:'베드로전서 5:7'},
  {text:'범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',ref:'데살로니가전서 5:18'},
  {text:'내가 너희를 향하여 계획하는 것들을 내가 아노니 재앙이 아니라 평안이요 너희에게 미래와 희망을 주려 하는 것이라',ref:'예레미야 29:11'},
  {text:'강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라',ref:'여호수아 1:9'},
];

// ===== 주제별 구절 =====
const TOPIC_VERSES = {
  위로:[
    {verse:'수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라',ref:'마태복음 11:28'},
    {verse:'마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다',ref:'시편 34:18'},
    {verse:'그는 마음이 상한 자를 고치시며 그들의 상처를 싸매시는도다',ref:'시편 147:3'},
    {verse:'우리가 사방으로 우겨쌈을 당하여도 싸이지 아니하며 답답한 일을 당하여도 낙심하지 아니하며',ref:'고린도후서 4:8'},
    {verse:'내가 확신하노니 사망이나 생명이나 어떤 피조물이라도 우리를 우리 주 그리스도 예수 안에 있는 하나님의 사랑에서 끊을 수 없으리라',ref:'로마서 8:38-39'},
  ],
  믿음:[
    {verse:'믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니',ref:'히브리서 11:1'},
    {verse:'예수께서 이르시되 할 수 있거든이 무슨 말이냐 믿는 자에게는 능히 하지 못할 일이 없느니라',ref:'마가복음 9:23'},
    {verse:'너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라',ref:'잠언 3:5'},
    {verse:'내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',ref:'빌립보서 4:13'},
  ],
  사랑:[
    {verse:'사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며',ref:'고린도전서 13:4'},
    {verse:'하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니',ref:'요한복음 3:16'},
    {verse:'새 계명을 너희에게 주노니 서로 사랑하라',ref:'요한복음 13:34'},
  ],
  감사:[
    {verse:'범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',ref:'데살로니가전서 5:18'},
    {verse:'여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다',ref:'시편 107:1'},
    {verse:'이것이 주께서 만드신 날이라 우리가 기뻐하고 즐거워하리로다',ref:'시편 118:24'},
  ],
  소망:[
    {verse:'내가 너희를 향하여 계획하는 것들을 내가 아노니 재앙이 아니라 평안이요 너희에게 미래와 희망을 주려 하는 것이라',ref:'예레미야 29:11'},
    {verse:'소망 중에 즐거워하며 환난 중에 참으며 기도에 항상 힘쓰며',ref:'로마서 12:12'},
    {verse:'여호와를 앙망하는 자는 새 힘을 얻으리니',ref:'이사야 40:31'},
  ],
  결혼:[
    {verse:'이러므로 남자가 부모를 떠나 그의 아내와 합하여 둘이 한 몸을 이룰지로다',ref:'창세기 2:24'},
    {verse:'집과 재물은 조상에게서 상속하거니와 슬기로운 아내는 여호와께서 주시느니라',ref:'잠언 19:14'},
    {verse:'무엇보다도 뜨겁게 서로 사랑할지니 사랑은 허다한 죄를 덮느니라',ref:'베드로전서 4:8'},
  ],
  치유:[
    {verse:'그는 마음이 상한 자를 고치시며 그들의 상처를 싸매시는도다',ref:'시편 147:3'},
    {verse:'그가 찔림은 우리의 허물 때문이요 그가 채찍에 맞으므로 우리는 나음을 받았도다',ref:'이사야 53:5'},
  ],
};

// ===== 캐시 =====
const verseCache = new Map();

// ===== HTML 태그 제거 함수 =====
function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
    .replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'')
    .replace(/\r?\n/g,' ').trim();
}

// ===== Bolls.life API 호출 =====
async function fetchBibleChapter(bookName, chapter, translation = 'KRV') {
  const key = `${translation}_${bookName}_${chapter}`;
  if (verseCache.has(key)) return verseCache.get(key);

  const bookNum = BOOK_NUM[bookName];
  if (!bookNum) {
    console.error('책 번호 없음:', bookName);
    return [{number:1, text:`"${bookName}" 책 정보를 찾을 수 없습니다.`}];
  }

  const url = `https://bolls.life/get-text/${translation}/${bookNum}/${chapter}/`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('빈 응답');
    }

    const verses = data.map(v => ({
      number: v.verse,
      text: stripHtml(v.text || '')
    }));

    verseCache.set(key, verses);
    return verses;

  } catch(err) {
    console.error(`[Bolls.life] ${translation} ${bookName}${chapter}장 실패:`, err.message);

    // 폴백: KJV로 재시도
    if (translation !== 'KJV') {
      try {
        const fallbackUrl = `https://bolls.life/get-text/KJV/${bookNum}/${chapter}/`;
        const res2 = await fetch(fallbackUrl);
        const data2 = await res2.json();
        if (Array.isArray(data2) && data2.length > 0) {
          const verses = data2.map(v => ({number:v.verse, text:stripHtml(v.text||'')}));
          verseCache.set(key, verses);
          return verses;
        }
      } catch(e2) {}
    }

    return [{number:1, text:`${bookName} ${chapter}장을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.`}];
  }
}

// ===== 전역 노출 =====
window.BIBLE_BOOKS = BIBLE_BOOKS;
window.LANG_CONFIG = LANG_CONFIG;
window.DAILY_VERSES = DAILY_VERSES;
window.TOPIC_VERSES = TOPIC_VERSES;
window.BOOK_NUM = BOOK_NUM;
window.verseCache = verseCache;
window.fetchBibleChapter = fetchBibleChapter;
