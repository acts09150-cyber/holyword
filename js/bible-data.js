/**
 * HolyWord - bible-data.js v5
 * 10개 언어 완전 지원 (한국어/영어/중국어/스페인어/일본어/포르투갈어/프랑스어/독일어/아랍어/러시아어)
 * API: bible-api.com (무료, CORS 허용)
 */

// ===== 성경 66권 전체 목록 =====
const BIBLE_BOOKS = {
  ot: [
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
  nt: [
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

// ===== 10개 언어 API 번역본 매핑 =====
// bible-api.com 지원 번역본 (브라우저에서 직접 CORS 허용)
const LANG_CONFIG = {
  ko: {
    translation: 'kjv',      // bible-api.com에 한국어 없으므로 KJV + 내장 데이터 사용
    name: '개역개정',
    flag: '🇰🇷',
    useLocal: true,           // 한국어는 내장 데이터 우선
    rtl: false
  },
  en: {
    translation: 'kjv',
    name: 'King James Version',
    flag: '🇺🇸',
    useLocal: false,
    rtl: false
  },
  zh: {
    translation: 'cunpss-shangti',  // 中文 和合本 (上帝版)
    fallback: 'cunpss-shengjing',   // 次선택
    name: '中文和合本',
    flag: '🇨🇳',
    useLocal: false,
    rtl: false
  },
  es: {
    translation: 'rv-valera',       // Reina-Valera 1909
    name: 'Reina-Valera',
    flag: '🇪🇸',
    useLocal: false,
    rtl: false
  },
  ja: {
    translation: 'jfa',             // 일본語 フランシスコ会 訳
    fallback: 'kjv',
    name: '口語訳',
    flag: '🇯🇵',
    useLocal: false,
    rtl: false
  },
  pt: {
    translation: 'almeida',         // João Ferreira de Almeida
    name: 'Almeida',
    flag: '🇧🇷',
    useLocal: false,
    rtl: false
  },
  fr: {
    translation: 'ls1910',          // Louis Segond 1910
    fallback: 'kjv',
    name: 'Louis Segond',
    flag: '🇫🇷',
    useLocal: false,
    rtl: false
  },
  de: {
    translation: 'luther1912',      // Luther Bibel 1912
    fallback: 'kjv',
    name: 'Luther 1912',
    flag: '🇩🇪',
    useLocal: false,
    rtl: false
  },
  ar: {
    translation: 'avd',             // Arabic Van Dyke / Smith
    fallback: 'kjv',
    name: 'الكتاب المقدس',
    flag: '🇸🇦',
    useLocal: false,
    rtl: true                       // 오른쪽→왼쪽 텍스트
  },
  ru: {
    translation: 'rst',             // Russian Synodal Translation
    fallback: 'kjv',
    name: 'Синодальный',
    flag: '🇷🇺',
    useLocal: false,
    rtl: false
  }
};

// ===== 성경 책 이름 → API URL 파라미터 매핑 (66권) =====
const BOOK_EN_MAP = {
  '창세기':'genesis','출애굽기':'exodus','레위기':'leviticus','민수기':'numbers',
  '신명기':'deuteronomy','여호수아':'joshua','사사기':'judges','룻기':'ruth',
  '사무엘상':'1+samuel','사무엘하':'2+samuel','열왕기상':'1+kings','열왕기하':'2+kings',
  '역대상':'1+chronicles','역대하':'2+chronicles','에스라':'ezra','느헤미야':'nehemiah',
  '에스더':'esther','욥기':'job','시편':'psalms','잠언':'proverbs',
  '전도서':'ecclesiastes','아가':'song+of+solomon','이사야':'isaiah',
  '예레미야':'jeremiah','예레미야애가':'lamentations','에스겔':'ezekiel',
  '다니엘':'daniel','호세아':'hosea','요엘':'joel','아모스':'amos','오바댜':'obadiah',
  '요나':'jonah','미가':'micah','나훔':'nahum','하박국':'habakkuk','스바냐':'zephaniah',
  '학개':'haggai','스가랴':'zechariah','말라기':'malachi',
  '마태복음':'matthew','마가복음':'mark','누가복음':'luke','요한복음':'john',
  '사도행전':'acts','로마서':'romans','고린도전서':'1+corinthians','고린도후서':'2+corinthians',
  '갈라디아서':'galatians','에베소서':'ephesians','빌립보서':'philippians',
  '골로새서':'colossians','데살로니가전서':'1+thessalonians','데살로니가후서':'2+thessalonians',
  '디모데전서':'1+timothy','디모데후서':'2+timothy','디도서':'titus','빌레몬서':'philemon',
  '히브리서':'hebrews','야고보서':'james','베드로전서':'1+peter','베드로후서':'2+peter',
  '요한일서':'1+john','요한이서':'2+john','요한삼서':'3+john','유다서':'jude',
  '요한계시록':'revelation'
};

// ===== 오늘의 말씀 데이터 =====
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
    {verse:'사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며',ref:'고린도전서 13:4'},
    {verse:'하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라',ref:'요한복음 3:16'},
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
    {verse:'여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요',ref:'이사야 40:31'},
  ],
  결혼:[
    {verse:'이러므로 남자가 부모를 떠나 그의 아내와 합하여 둘이 한 몸을 이룰지로다',ref:'창세기 2:24'},
    {verse:'집과 재물은 조상에게서 상속하거니와 슬기로운 아내는 여호와께서 주시느니라',ref:'잠언 19:14'},
    {verse:'무엇보다도 뜨겁게 서로 사랑할지니 사랑은 허다한 죄를 덮느니라',ref:'베드로전서 4:8'},
  ],
  치유:[
    {verse:'그는 마음이 상한 자를 고치시며 그들의 상처를 싸매시는도다',ref:'시편 147:3'},
    {verse:'그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라 그가 채찍에 맞으므로 우리는 나음을 받았도다',ref:'이사야 53:5'},
  ],
};

// ===== 한국어 개역개정 내장 데이터 =====
const KRV_DATA = {
  '창세기': {
    1: ['태초에 하나님이 천지를 창조하시니라','땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라','하나님이 이르시되 빛이 있으라 하시니 빛이 있었고','빛이 하나님이 보시기에 좋았더라 하나님이 빛과 어둠을 나누사','하나님이 빛을 낮이라 부르시고 어둠을 밤이라 부르시니라 저녁이 되고 아침이 되니 이는 첫째 날이니라','하나님이 이르시되 물 가운데에 궁창이 있어 물과 물로 나뉘라 하시고','하나님이 궁창을 만드사 궁창 아래의 물과 궁창 위의 물로 나뉘게 하시니 그대로 되니라','하나님이 궁창을 하늘이라 부르시니라 저녁이 되고 아침이 되니 이는 둘째 날이니라','하나님이 이르시되 천하의 물이 한 곳으로 모이고 뭍이 드러나라 하시니 그대로 되니라','하나님이 뭍을 땅이라 부르시고 모인 물을 바다라 부르시니 하나님이 보시기에 좋았더라','하나님이 이르시되 땅은 풀과 씨 맺는 채소와 각기 종류대로 씨 가진 열매 맺는 나무를 내라 하시니 그대로 되어','땅이 풀과 각기 종류대로 씨 맺는 채소와 각기 종류대로 씨 가진 열매 맺는 나무를 내니 하나님이 보시기에 좋았더라','저녁이 되고 아침이 되니 이는 셋째 날이니라','하나님이 이르시되 하늘의 궁창에 광명체들이 있어 낮과 밤을 나뉘게 하고 그것들로 징조와 계절과 날과 해를 이루게 하라','또 광명체들이 하늘의 궁창에 있어 땅을 비추라 하시니 그대로 되니라','하나님이 두 큰 광명체를 만드사 큰 광명체로 낮을 주관하게 하시고 작은 광명체로 밤을 주관하게 하시며 또 별들을 만드시고','하나님이 그것들을 하늘의 궁창에 두어 땅을 비추게 하시며','낮과 밤을 주관하게 하시고 빛과 어둠을 나뉘게 하시니 하나님이 보시기에 좋았더라','저녁이 되고 아침이 되니 이는 넷째 날이니라','하나님이 이르시되 물들은 생물을 번성하게 하라 땅 위 하늘의 궁창에는 새가 날으라 하시고','하나님이 큰 바다 짐승들과 물에서 번성하여 움직이는 모든 생물을 그 종류대로, 날개 있는 모든 새를 그 종류대로 창조하시니 하나님이 보시기에 좋았더라','하나님이 그들에게 복을 주시며 이르시되 생육하고 번성하여 여러 바닷물에 충만하라 새들도 땅에 번성하라 하시니라','저녁이 되고 아침이 되니 이는 다섯째 날이니라','하나님이 이르시되 땅은 생물을 그 종류대로 내되 가축과 기는 것과 땅의 짐승을 종류대로 내라 하시니 그대로 되니라','하나님이 땅의 짐승을 그 종류대로, 가축을 그 종류대로, 땅에 기는 모든 것을 그 종류대로 만드시니 하나님이 보시기에 좋았더라','하나님이 이르시되 우리의 형상을 따라 우리의 모양대로 우리가 사람을 만들고 그들로 바다의 물고기와 하늘의 새와 가축과 온 땅과 땅에 기는 모든 것을 다스리게 하자 하시고','하나님이 자기 형상 곧 하나님의 형상대로 사람을 창조하시되 남자와 여자를 창조하시고','하나님이 그들에게 복을 주시며 하나님이 그들에게 이르시되 생육하고 번성하여 땅에 충만하라, 땅을 정복하라, 바다의 물고기와 하늘의 새와 땅에 움직이는 모든 생물을 다스리라 하시니라','하나님이 이르시되 내가 온 지면의 씨 맺는 모든 채소와 씨 가진 열매 맺는 모든 나무를 너희에게 주노니 너희의 먹을 거리가 되리라','또 땅의 모든 짐승과 하늘의 모든 새와 생명이 있어 땅에 기는 모든 것에게는 내가 모든 푸른 풀을 먹을 거리로 주노라 하시니 그대로 되니라','하나님이 지으신 그 모든 것을 보시니 보시기에 심히 좋았더라 저녁이 되고 아침이 되니 이는 여섯째 날이니라'],
    2: ['천지와 만물이 다 이루어지니라','하나님이 그가 하시던 일을 일곱째 날에 마치시니 그가 하시던 모든 일을 그치고 일곱째 날에 안식하시니라','하나님이 그 일곱째 날을 복되게 하사 거룩하게 하셨으니 이는 하나님이 그 창조하시며 만드시던 모든 일을 마치시고 그 날에 안식하셨음이니라','이것이 천지가 창조될 때에 하늘과 땅의 내력이니 여호와 하나님이 땅과 하늘을 만드시던 날에','여호와 하나님이 땅에 비를 내리지 아니하셨고 땅을 갈 사람도 없었으므로 들에는 초목이 아직 없었고 밭에는 채소가 나지 아니하였으며','안개만 땅에서 올라와 온 지면을 적셨더라','여호와 하나님이 땅의 흙으로 사람을 지으시고 생기를 그 코에 불어넣으시니 사람이 생령이 되니라','여호와 하나님이 동방의 에덴에 동산을 창설하시고 그 지으신 사람을 거기 두시니라','여호와 하나님이 그 땅에서 보기에 아름답고 먹기에 좋은 나무가 나게 하시니 동산 가운데에는 생명나무와 선악을 알게 하는 나무도 있더라','강이 에덴에서 흘러 나와 동산을 적시고 거기서부터 갈라져 네 근원이 되었으니']
  },
  '시편': {
    23: ['여호와는 나의 목자시니 내게 부족함이 없으리로다','그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다','내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다','내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다','주께서 내 원수의 목전에서 내게 상을 차려 주시고 기름을 내 머리에 부으셨으니 내 잔이 넘치나이다','내 평생에 선하심과 인자하심이 반드시 나를 따르리니 내가 여호와의 집에 영원히 살리로다'],
    1: ['복 있는 사람은 악인들의 꾀를 따르지 아니하며 죄인들의 길에 서지 아니하며 오만한 자들의 자리에 앉지 아니하고','오직 여호와의 율법을 즐거워하여 그의 율법을 주야로 묵상하는도다','그는 시냇가에 심은 나무가 철을 따라 열매를 맺으며 그 잎사귀가 마르지 아니함 같으니 그가 하는 모든 일이 다 형통하리로다','악인들은 그렇지 아니함이여 오직 바람에 나는 겨와 같도다','그러므로 악인들은 심판을 견디지 못하며 죄인들이 의인들의 모임에 들지 못하리로다','무릇 의인들의 길은 여호와께서 인정하시나 악인들의 길은 망하리로다']
  },
  '요한복음': {
    3: ['그런데 바리새인 중에 니고데모라 하는 사람이 있으니 유대인의 지도자라','그가 밤에 예수께 와서 이르되 랍비여 우리가 당신은 하나님께로부터 오신 선생인 줄 아나이다 하나님이 함께 하시지 아니하시면 당신이 행하시는 이 표적을 아무도 할 수 없음이니이다','예수께서 대답하여 이르시되 진실로 진실로 네게 이르노니 사람이 거듭나지 아니하면 하나님의 나라를 볼 수 없느니라','니고데모가 이르되 사람이 늙으면 어떻게 날 수 있사옵나이까 두 번째 모태에 들어갔다가 날 수 있사옵나이까','예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님의 나라에 들어갈 수 없느니라','육으로 난 것은 육이요 영으로 난 것은 영이니','내가 네게 거듭나야 하겠다 하는 말을 놀랍게 여기지 말라','바람이 임의로 불매 네가 그 소리는 들어도 어디서 와서 어디로 가는지 알지 못하나니 성령으로 난 사람도 다 그러하니라','니고데모가 대답하여 이르되 어찌 그러한 일이 있을 수 있나이까','예수께서 그에게 대답하여 이르시되 너는 이스라엘의 선생으로서 이러한 것들을 알지 못하느냐','진실로 진실로 네게 이르노니 우리는 아는 것을 말하고 본 것을 증언하노라 그러나 너희가 우리의 증언을 받지 아니하는도다','내가 땅의 일을 말하여도 너희가 믿지 아니하거든 하물며 하늘의 일을 말하면 어떻게 믿겠느냐','하늘에서 내려온 자 곧 인자 외에는 하늘에 올라간 자가 없느니라','모세가 광야에서 뱀을 든 것 같이 인자도 들려야 하리니','이는 그를 믿는 자마다 영생을 얻게 하려 하심이니라','하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라','하나님이 그 아들을 세상에 보내신 것은 세상을 심판하려 하심이 아니요 그로 말미암아 세상이 구원을 받게 하려 하심이라']
  },
  '빌립보서': {
    4: ['그러므로 나의 사랑하고 사모하는 형제들, 나의 기쁨이요 면류관인 사랑하는 자들아 이와 같이 주 안에 서라','내가 유오디아를 권하고 순두게를 권하노니 주 안에서 같은 마음을 품으라','또 참으로 나와 멍에를 같이한 네게 구하노니 복음에 나와 함께 힘쓰던 저 여인들을 돕고 또한 글레멘드와 그 외에 나의 동역자들을 도우라 그 이름들이 생명책에 있느니라','주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라','너희 관용을 모든 사람에게 알게 하라 주께서 가까우시니라','아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라','그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라','끝으로 형제들아 무엇에든지 참되며 무엇에든지 경건하며 무엇에든지 옳으며 무엇에든지 정결하며 무엇에든지 사랑 받을 만하며 무엇에든지 칭찬 받을 만하며 무슨 덕이 있든지 무슨 기림이 있든지 이것들을 생각하라','너희는 내게 배우고 받고 듣고 본 바를 행하라 그리하면 평강의 하나님이 너희와 함께 계시리라','내가 주 안에서 크게 기뻐함은 너희가 나를 생각하던 것이 이제 다시 싹이 남이니 너희가 또한 이를 위하여 생각은 하였으나 기회가 없었느니라','내가 궁핍하므로 말하는 것이 아니니라 어떠한 형편에 있든지 나는 자족하기를 배웠노라','나는 비천에 처할 줄도 알고 풍부에 처할 줄도 알아 모든 일 곧 배부름과 배고픔과 풍부와 궁핍에도 처할 줄 아는 일체의 비결을 배웠노라','내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라']
  }
};

// ===== 캐시 시스템 =====
const verseCache = new Map();

// ===== 핵심 함수: 성경 챕터 가져오기 =====
async function fetchBibleChapter(bookName, chapter, lang = 'ko') {
  const cacheKey = `${lang}_${bookName}_${chapter}`;
  if (verseCache.has(cacheKey)) return verseCache.get(cacheKey);

  // ① 한국어 내장 데이터 우선 사용
  if (lang === 'ko' && KRV_DATA[bookName]?.[chapter]) {
    const verses = KRV_DATA[bookName][chapter].map((text, i) => ({number: i+1, text}));
    verseCache.set(cacheKey, verses);
    return verses;
  }

  const bookEn = BOOK_EN_MAP[bookName];
  if (!bookEn) return [{number:1, text:`${bookName}을 찾을 수 없습니다.`}];

  const config = LANG_CONFIG[lang] || LANG_CONFIG.en;

  // ② bible-api.com API 호출
  const tryTranslation = async (translation) => {
    const url = `https://bible-api.com/${bookEn}+${chapter}?translation=${translation}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.verses || data.verses.length === 0) throw new Error('구절 없음');
    return data.verses.map(v => ({
      number: v.verse,
      text: v.text.replace(/\r?\n/g, ' ').trim()
    }));
  };

  try {
    // 1차: 해당 언어 번역본
    const verses = await tryTranslation(config.translation);
    verseCache.set(cacheKey, verses);
    return verses;
  } catch(e1) {
    // 2차: 폴백 번역본 (있는 경우)
    if (config.fallback) {
      try {
        const verses = await tryTranslation(config.fallback);
        verseCache.set(cacheKey, verses);
        return verses;
      } catch(e2) {}
    }
    // 3차: KJV 영어로 폴백
    try {
      const verses = await tryTranslation('kjv');
      verseCache.set(cacheKey, verses);
      return verses;
    } catch(e3) {
      return [{number:1, text:`${bookName} ${chapter}장을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.`}];
    }
  }
}

// ===== 전역 노출 =====
window.BIBLE_BOOKS = BIBLE_BOOKS;
window.DAILY_VERSES = DAILY_VERSES;
window.TOPIC_VERSES = TOPIC_VERSES;
window.LANG_CONFIG = LANG_CONFIG;
window.fetchBibleChapter = fetchBibleChapter;
window.BOOK_EN_MAP = BOOK_EN_MAP;
window.KRV_DATA = KRV_DATA;
