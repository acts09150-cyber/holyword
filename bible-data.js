/**
 * HolyWord - Bible Data Module
 * 한국어(개역개정) 성경 데이터 + 다국어 API 연동
 */

// ===== 성경 책 정보 =====
const BIBLE_BOOKS = {
  ot: [ // 구약
    { id: 'GEN', name: '창세기', chapters: 50 },
    { id: 'EXO', name: '출애굽기', chapters: 40 },
    { id: 'LEV', name: '레위기', chapters: 27 },
    { id: 'NUM', name: '민수기', chapters: 36 },
    { id: 'DEU', name: '신명기', chapters: 34 },
    { id: 'JOS', name: '여호수아', chapters: 24 },
    { id: 'JDG', name: '사사기', chapters: 21 },
    { id: 'RUT', name: '룻기', chapters: 4 },
    { id: '1SA', name: '사무엘상', chapters: 31 },
    { id: '2SA', name: '사무엘하', chapters: 24 },
    { id: '1KI', name: '열왕기상', chapters: 22 },
    { id: '2KI', name: '열왕기하', chapters: 25 },
    { id: '1CH', name: '역대상', chapters: 29 },
    { id: '2CH', name: '역대하', chapters: 36 },
    { id: 'EZR', name: '에스라', chapters: 10 },
    { id: 'NEH', name: '느헤미야', chapters: 13 },
    { id: 'EST', name: '에스더', chapters: 10 },
    { id: 'JOB', name: '욥기', chapters: 42 },
    { id: 'PSA', name: '시편', chapters: 150 },
    { id: 'PRO', name: '잠언', chapters: 31 },
    { id: 'ECC', name: '전도서', chapters: 12 },
    { id: 'SNG', name: '아가', chapters: 8 },
    { id: 'ISA', name: '이사야', chapters: 66 },
    { id: 'JER', name: '예레미야', chapters: 52 },
    { id: 'LAM', name: '예레미야애가', chapters: 5 },
    { id: 'EZK', name: '에스겔', chapters: 48 },
    { id: 'DAN', name: '다니엘', chapters: 12 },
    { id: 'HOS', name: '호세아', chapters: 14 },
    { id: 'JOL', name: '요엘', chapters: 3 },
    { id: 'AMO', name: '아모스', chapters: 9 },
    { id: 'OBA', name: '오바댜', chapters: 1 },
    { id: 'JON', name: '요나', chapters: 4 },
    { id: 'MIC', name: '미가', chapters: 7 },
    { id: 'NAH', name: '나훔', chapters: 3 },
    { id: 'HAB', name: '하박국', chapters: 3 },
    { id: 'ZEP', name: '스바냐', chapters: 3 },
    { id: 'HAG', name: '학개', chapters: 2 },
    { id: 'ZEC', name: '스가랴', chapters: 14 },
    { id: 'MAL', name: '말라기', chapters: 4 },
  ],
  nt: [ // 신약
    { id: 'MAT', name: '마태복음', chapters: 28 },
    { id: 'MRK', name: '마가복음', chapters: 16 },
    { id: 'LUK', name: '누가복음', chapters: 24 },
    { id: 'JHN', name: '요한복음', chapters: 21 },
    { id: 'ACT', name: '사도행전', chapters: 28 },
    { id: 'ROM', name: '로마서', chapters: 16 },
    { id: '1CO', name: '고린도전서', chapters: 16 },
    { id: '2CO', name: '고린도후서', chapters: 13 },
    { id: 'GAL', name: '갈라디아서', chapters: 6 },
    { id: 'EPH', name: '에베소서', chapters: 6 },
    { id: 'PHP', name: '빌립보서', chapters: 4 },
    { id: 'COL', name: '골로새서', chapters: 4 },
    { id: '1TH', name: '데살로니가전서', chapters: 5 },
    { id: '2TH', name: '데살로니가후서', chapters: 3 },
    { id: '1TI', name: '디모데전서', chapters: 6 },
    { id: '2TI', name: '디모데후서', chapters: 4 },
    { id: 'TIT', name: '디도서', chapters: 3 },
    { id: 'PHM', name: '빌레몬서', chapters: 1 },
    { id: 'HEB', name: '히브리서', chapters: 13 },
    { id: 'JAS', name: '야고보서', chapters: 5 },
    { id: '1PE', name: '베드로전서', chapters: 5 },
    { id: '2PE', name: '베드로후서', chapters: 3 },
    { id: '1JN', name: '요한일서', chapters: 5 },
    { id: '2JN', name: '요한이서', chapters: 1 },
    { id: '3JN', name: '요한삼서', chapters: 1 },
    { id: 'JUD', name: '유다서', chapters: 1 },
    { id: 'REV', name: '요한계시록', chapters: 22 },
  ]
};

// ===== 오늘의 말씀 (매일 변경) =====
const DAILY_VERSES = [
  { text: '내가 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라', ref: '빌립보서 4:13', refEn: 'Philippians 4:13' },
  { text: '여호와는 나의 목자시니 내게 부족함이 없으리로다', ref: '시편 23:1', refEn: 'Psalm 23:1' },
  { text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라', ref: '요한복음 3:16', refEn: 'John 3:16' },
  { text: '주 너의 하나님이 너와 함께 하느니라 그가 너를 떠나지 아니하시며 버리지 아니하시리라', ref: '신명기 31:6', refEn: 'Deuteronomy 31:6' },
  { text: '아무것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라', ref: '빌립보서 4:6', refEn: 'Philippians 4:6' },
  { text: '여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다', ref: '이사야 40:31', refEn: 'Isaiah 40:31' },
  { text: '너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라', ref: '베드로전서 5:7', refEn: '1 Peter 5:7' },
];

// ===== 주제별 구절 (SEO 핵심 데이터) =====
const TOPIC_VERSES = {
  위로: [
    { verse: '여호와여 내가 주께 부르짖었사오니 주는 나의 반석이시라 나를 외면하지 마소서', ref: '시편 28:1' },
    { verse: '내가 너와 함께 하여 어디로 가든지 너를 지키며 너를 이끌어 이 땅으로 돌아오게 할지라', ref: '창세기 28:15' },
    { verse: '마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다', ref: '시편 34:18' },
    { verse: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라', ref: '마태복음 11:28' },
    { verse: '우리가 사방으로 우겨쌈을 당하여도 싸이지 아니하며 답답한 일을 당하여도 낙심하지 아니하며', ref: '고린도후서 4:8' },
  ],
  믿음: [
    { verse: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니', ref: '히브리서 11:1' },
    { verse: '예수께서 이르시되 할 수 있거든이 무슨 말이냐 믿는 자에게는 능히 하지 못할 일이 없느니라', ref: '마가복음 9:23' },
    { verse: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라', ref: '잠언 3:5' },
    { verse: '내가 확신하노니 사망이나 생명이나 천사들이나 권세자들이나 현재 일이나 장래 일이나 능력이나 높음이나 깊음이나 다른 어떤 피조물이라도 우리를 우리 주 그리스도 예수 안에 있는 하나님의 사랑에서 끊을 수 없으리라', ref: '로마서 8:38-39' },
  ],
  사랑: [
    { verse: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며', ref: '고린도전서 13:4' },
    { verse: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니', ref: '요한복음 3:16' },
    { verse: '새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라', ref: '요한복음 13:34' },
  ],
  감사: [
    { verse: '범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라', ref: '데살로니가전서 5:18' },
    { verse: '여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다', ref: '시편 107:1' },
    { verse: '이것이 주께서 만드신 날이라 우리가 기뻐하고 즐거워하리로다', ref: '시편 118:24' },
  ],
  소망: [
    { verse: '내가 너희를 향하여 계획하는 것들을 내가 아노니 재앙이 아니라 평안이요 너희에게 미래와 희망을 주려 하는 것이라', ref: '예레미야 29:11' },
    { verse: '소망 중에 즐거워하며 환난 중에 참으며 기도에 항상 힘쓰며', ref: '로마서 12:12' },
    { verse: '여호와를 앙망하는 자는 새 힘을 얻으리니', ref: '이사야 40:31' },
  ],
  결혼: [
    { verse: '이러므로 남자가 부모를 떠나 그의 아내와 합하여 둘이 한 몸을 이룰지로다', ref: '창세기 2:24' },
    { verse: '집과 재물은 조상에게서 상속하거니와 슬기로운 아내는 여호와께서 주시느니라', ref: '잠언 19:14' },
    { verse: '무엇보다도 뜨겁게 서로 사랑할지니 사랑은 허다한 죄를 덮느니라', ref: '베드로전서 4:8' },
  ],
  치유: [
    { verse: '그는 마음이 상한 자를 고치시며 그들의 상처를 싸매시는도다', ref: '시편 147:3' },
    { verse: '여호와께서 이같이 말씀하시니라 네 상처는 고칠 수 없고 네 부상은 중하도다', ref: '예레미야 30:12' },
    { verse: '그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라 그가 징계를 받으므로 우리는 평화를 누리고 그가 채찍에 맞으므로 우리는 나음을 받았도다', ref: '이사야 53:5' },
  ],
};

// ===== 성경 API 연동 =====
// bible-api.com (무료 오픈소스 API)
const BIBLE_API_BASE = 'https://bible-api.com';

// API 번역본 매핑
const LANG_TO_TRANSLATION = {
  ko: 'kjv',       // 한국어는 직접 데이터 (KJV 폴백)
  en: 'kjv',       // King James Version
  es: 'rv-valera', // Reina Valera
  pt: 'almeida',   // João Ferreira de Almeida
  zh: 'cunpss-shangti', // Chinese Union Version
};

// 책 이름 영어 매핑 (API 호출용)
const BOOK_EN_MAP = {
  '창세기': 'genesis', '출애굽기': 'exodus', '레위기': 'leviticus',
  '민수기': 'numbers', '신명기': 'deuteronomy', '여호수아': 'joshua',
  '사사기': 'judges', '룻기': 'ruth', '사무엘상': '1samuel', '사무엘하': '2samuel',
  '열왕기상': '1kings', '열왕기하': '2kings', '역대상': '1chronicles', '역대하': '2chronicles',
  '에스라': 'ezra', '느헤미야': 'nehemiah', '에스더': 'esther', '욥기': 'job',
  '시편': 'psalm', '잠언': 'proverbs', '전도서': 'ecclesiastes', '아가': 'song of solomon',
  '이사야': 'isaiah', '예레미야': 'jeremiah', '예레미야애가': 'lamentations',
  '에스겔': 'ezekiel', '다니엘': 'daniel', '호세아': 'hosea', '요엘': 'joel',
  '아모스': 'amos', '오바댜': 'obadiah', '요나': 'jonah', '미가': 'micah',
  '나훔': 'nahum', '하박국': 'habakkuk', '스바냐': 'zephaniah', '학개': 'haggai',
  '스가랴': 'zechariah', '말라기': 'malachi',
  '마태복음': 'matthew', '마가복음': 'mark', '누가복음': 'luke', '요한복음': 'john',
  '사도행전': 'acts', '로마서': 'romans', '고린도전서': '1corinthians', '고린도후서': '2corinthians',
  '갈라디아서': 'galatians', '에베소서': 'ephesians', '빌립보서': 'philippians',
  '골로새서': 'colossians', '데살로니가전서': '1thessalonians', '데살로니가후서': '2thessalonians',
  '디모데전서': '1timothy', '디모데후서': '2timothy', '디도서': 'titus',
  '빌레몬서': 'philemon', '히브리서': 'hebrews', '야고보서': 'james',
  '베드로전서': '1peter', '베드로후서': '2peter', '요한일서': '1john',
  '요한이서': '2john', '요한삼서': '3john', '유다서': 'jude', '요한계시록': 'revelation',
};

// ===== 캐시 시스템 =====
const verseCache = new Map();

async function fetchBibleChapter(bookName, chapter, lang = 'ko') {
  const cacheKey = `${lang}_${bookName}_${chapter}`;
  if (verseCache.has(cacheKey)) return verseCache.get(cacheKey);

  try {
    const bookEn = BOOK_EN_MAP[bookName] || bookName.toLowerCase();
    const translation = LANG_TO_TRANSLATION[lang] || 'kjv';
    const url = `${BIBLE_API_BASE}/${bookEn}+${chapter}?translation=${translation}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('API 오류');

    const data = await response.json();
    const verses = data.verses.map(v => ({
      number: v.verse,
      text: v.text.trim()
    }));

    verseCache.set(cacheKey, verses);
    return verses;

  } catch (err) {
    console.warn('API 호출 실패, 샘플 데이터 사용:', err);
    return getFallbackVerses(bookName, chapter);
  }
}

// 폴백 데이터 (창세기 1장 - 한국어 개역개정)
function getFallbackVerses(bookName, chapter) {
  if (bookName === '창세기' && chapter === 1) {
    return [
      { number: 1, text: '태초에 하나님이 천지를 창조하시니라' },
      { number: 2, text: '땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라' },
      { number: 3, text: '하나님이 이르시되 빛이 있으라 하시니 빛이 있었고' },
      { number: 4, text: '빛이 하나님이 보시기에 좋았더라 하나님이 빛과 어둠을 나누사' },
      { number: 5, text: '하나님이 빛을 낮이라 부르시고 어둠을 밤이라 부르시니라 저녁이 되고 아침이 되니 이는 첫째 날이니라' },
      { number: 6, text: '하나님이 이르시되 물 가운데에 궁창이 있어 물과 물로 나뉘라 하시고' },
      { number: 7, text: '하나님이 궁창을 만드사 궁창 아래의 물과 궁창 위의 물로 나뉘게 하시니 그대로 되니라' },
      { number: 8, text: '하나님이 궁창을 하늘이라 부르시니라 저녁이 되고 아침이 되니 이는 둘째 날이니라' },
      { number: 9, text: '하나님이 이르시되 천하의 물이 한 곳으로 모이고 뭍이 드러나라 하시니 그대로 되니라' },
      { number: 10, text: '하나님이 뭍을 땅이라 부르시고 모인 물을 바다라 부르시니 하나님이 보시기에 좋았더라' },
      { number: 11, text: '하나님이 이르시되 땅은 풀과 씨 맺는 채소와 각기 종류대로 씨 가진 열매 맺는 나무를 내라 하시니 그대로 되어' },
      { number: 12, text: '땅이 풀과 각기 종류대로 씨 맺는 채소와 각기 종류대로 씨 가진 열매 맺는 나무를 내니 하나님이 보시기에 좋았더라' },
      { number: 13, text: '저녁이 되고 아침이 되니 이는 셋째 날이니라' },
      { number: 14, text: '하나님이 이르시되 하늘의 궁창에 광명체들이 있어 낮과 밤을 나뉘게 하고 그것들로 징조와 계절과 날과 해를 이루게 하라' },
      { number: 15, text: '또 광명체들이 하늘의 궁창에 있어 땅을 비추라 하시니 그대로 되니라' },
      { number: 16, text: '하나님이 두 큰 광명체를 만드사 큰 광명체로 낮을 주관하게 하시고 작은 광명체로 밤을 주관하게 하시며 또 별들을 만드시고' },
      { number: 17, text: '하나님이 그것들을 하늘의 궁창에 두어 땅을 비추게 하시며' },
      { number: 18, text: '낮과 밤을 주관하게 하시고 빛과 어둠을 나뉘게 하시니 하나님이 보시기에 좋았더라' },
      { number: 19, text: '저녁이 되고 아침이 되니 이는 넷째 날이니라' },
      { number: 20, text: '하나님이 이르시되 물들은 생물을 번성하게 하라 땅 위 하늘의 궁창에는 새가 날으라 하시고' },
      { number: 21, text: '하나님이 큰 바다 짐승들과 물에서 번성하여 움직이는 모든 생물을 그 종류대로 날개 있는 모든 새를 그 종류대로 창조하시니 하나님이 보시기에 좋았더라' },
      { number: 22, text: '하나님이 그들에게 복을 주시며 이르시되 생육하고 번성하여 여러 바닷물에 충만하라 새들도 땅에 번성하라 하시니라' },
      { number: 23, text: '저녁이 되고 아침이 되니 이는 다섯째 날이니라' },
      { number: 24, text: '하나님이 이르시되 땅은 생물을 그 종류대로 내되 가축과 기는 것과 땅의 짐승을 종류대로 내라 하시니 그대로 되니라' },
      { number: 25, text: '하나님이 땅의 짐승을 그 종류대로, 가축을 그 종류대로, 땅에 기는 모든 것을 그 종류대로 만드시니 하나님이 보시기에 좋았더라' },
      { number: 26, text: '하나님이 이르시되 우리의 형상을 따라 우리의 모양대로 우리가 사람을 만들고 그들로 바다의 물고기와 하늘의 새와 가축과 온 땅과 땅에 기는 모든 것을 다스리게 하자 하시고' },
      { number: 27, text: '하나님이 자기 형상 곧 하나님의 형상대로 사람을 창조하시되 남자와 여자를 창조하시고' },
      { number: 28, text: '하나님이 그들에게 복을 주시며 하나님이 그들에게 이르시되 생육하고 번성하여 땅에 충만하라, 땅을 정복하라, 바다의 물고기와 하늘의 새와 땅에 움직이는 모든 생물을 다스리라 하시니라' },
      { number: 29, text: '하나님이 이르시되 내가 온 지면의 씨 맺는 모든 채소와 씨 가진 열매 맺는 모든 나무를 너희에게 주노니 너희의 먹을 거리가 되리라' },
      { number: 30, text: '또 땅의 모든 짐승과 하늘의 모든 새와 생명이 있어 땅에 기는 모든 것에게는 내가 모든 푸른 풀을 먹을 거리로 주노라 하시니 그대로 되니라' },
      { number: 31, text: '하나님이 지으신 그 모든 것을 보시니 보시기에 심히 좋았더라 저녁이 되고 아침이 되니 이는 여섯째 날이니라' },
    ];
  }

  // 다른 챕터는 API에서 가져옴 (폴백 메시지)
  return Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    text: `${bookName} ${chapter}장 ${i+1}절 — 성경 데이터를 불러오는 중입니다. 인터넷 연결을 확인해주세요.`
  }));
}

window.BIBLE_BOOKS = BIBLE_BOOKS;
window.DAILY_VERSES = DAILY_VERSES;
window.TOPIC_VERSES = TOPIC_VERSES;
window.fetchBibleChapter = fetchBibleChapter;
window.BOOK_EN_MAP = BOOK_EN_MAP;
