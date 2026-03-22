# 🚀 HolyWord 배포 & 수익화 완전 가이드

## 📁 프로젝트 구조

```
holyword/
├── index.html          ← 메인 성경 읽기 페이지
├── sitemap.xml         ← SEO 사이트맵
├── robots.txt          ← 검색엔진 크롤링 설정
├── css/
│   └── style.css       ← 전체 스타일
├── js/
│   ├── bible-data.js   ← 성경 데이터 + API 연동
│   └── app.js          ← 메인 앱 로직
└── pages/
    ├── topics.html     ← 주제별 구절 (SEO 핵심)
    ├── daily.html      ← 오늘의 말씀
    └── search.html     ← 구절 검색

```

---

## ⚡ STEP 1: 즉시 배포 (무료)

### Vercel 배포 (권장)
```bash
# 1. GitHub에 업로드
git init
git add .
git commit -m "HolyWord MVP launch"
git push origin main

# 2. vercel.com 접속 → GitHub 연동 → 자동 배포
# 3. 커스텀 도메인 연결 (무료)
```

### Netlify 배포 (대안)
```bash
# netlify.com → "Deploy from folder" → holyword 폴더 드래그
```

---

## 🌐 STEP 2: 도메인 구입 (SEO 필수)

추천 도메인 (Namecheap/GoDaddy):
- `holyword.kr` (~₩15,000/년)
- `holybible.app` (~$15/년)
- `bible-korean.com` (~$12/년)
- `bibleverse.co.kr` (~₩15,000/년)

**📌 hreflang 태그가 이미 삽입되어 있어 다국어 SEO 즉시 작동**

---

## 💰 STEP 3: Google AdSense 신청

### 신청 전 체크리스트
- [ ] 최소 20개 이상 페이지 콘텐츠
- [ ] 개인정보처리방침 페이지
- [ ] 이용약관 페이지
- [ ] 명확한 연락처 정보
- [ ] 원본 콘텐츠 (성경 + 해설)

### 신청 URL
https://adsense.google.com/start/

### 신청 후 코드 삽입 위치 (index.html)
```html
<!-- <head> 태그 안에 삽입 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
     crossorigin="anonymous"></script>
```

### 광고 슬롯 교체 위치 (index.html에서 검색)
총 5곳에 광고 삽입 위치 마킹됨:
1. 상단 728×90 배너
2. In-Article (본문 전)
3. In-Article (본문 중간, app.js에서 자동 삽입)
4. 사이드바 300×250 (첫 번째)
5. 사이드바 300×250 (두 번째)

---

## 📊 STEP 4: SEO 설정

### Google Search Console 등록
1. search.google.com/search-console
2. 도메인 소유권 인증
3. sitemap.xml 제출: `https://yourdomain.com/sitemap.xml`

### robots.txt 생성
```
User-agent: *
Allow: /
Sitemap: https://holyword.kr/sitemap.xml
```

### 핵심 SEO 키워드 (한국어)
- "성경 읽기" (월 검색량 40,000+)
- "오늘의 말씀" (월 검색량 30,000+)
- "성경 구절" (월 검색량 50,000+)
- "위로의 말씀" (월 검색량 20,000+)
- "빌립보서 4 13" (월 검색량 10,000+)

---

## 📈 STEP 5: 성장 전략

### Phase 1 (0~3개월) - 무료
- [ ] Vercel 배포 완료
- [ ] 도메인 연결
- [ ] AdSense 신청
- [ ] Search Console 등록
- [ ] 인스타그램 계정 개설 (@holyword.kr)
- [ ] 매일 구절 카드 자동 생성 → 인스타 업로드

### Phase 2 (3~6개월) - $50/월 투자
- [ ] Mailchimp 뉴스레터 연동 (무료 500명까지)
- [ ] 카카오 공유 SDK 연동
- [ ] 구글 트렌드 기반 콘텐츠 추가
- [ ] 유튜브 쇼츠 "오늘의 말씀" 채널 개설

### Phase 3 (6개월+) - 수익 재투자
- [ ] Claude API 연동 → AI 성경 해설
- [ ] 오디오 성경 (ElevenLabs TTS)
- [ ] 성경 통독 앱 PWA 변환

---

## 💵 수익 예측 모델

| 단계 | 월 UV | AdSense 수익 | 추가 수익 |
|------|-------|-------------|---------|
| 1개월 | 500 | $2~10 | - |
| 3개월 | 5,000 | $50~200 | - |
| 6개월 | 30,000 | $300~1,200 | 뉴스레터 |
| 12개월 | 150,000 | $1,500~6,000 | 프리미엄 |
| 24개월 | 500,000 | $5,000~20,000 | 제휴+B2B |

**📌 성경 콘텐츠 CPC: $0.3~$2.5 (종교 카테고리 높은 편)**

---

## 🔧 무료 API 연동

### bible-api.com (현재 사용 중)
- 완전 무료
- KJV, ASV, WEB 번역본 지원
- Rate limit 없음

### API.Bible (고급)
- 무료 티어: 5,000 요청/일
- 700+ 번역본
- 가입: scripture.api.bible

---

## 📱 카카오 공유 설정

```javascript
// kakao.js SDK 추가 후:
Kakao.init('YOUR_APP_KEY');
Kakao.Link.sendDefault({
  objectType: 'text',
  text: `"${verse}" — ${ref}`,
  link: { mobileWebUrl: 'https://holyword.kr', webUrl: 'https://holyword.kr' }
});
```

---

## 📧 뉴스레터 연동 (Mailchimp)

```javascript
// 구독 API 호출
fetch('https://us1.api.mailchimp.com/3.0/lists/LIST_ID/members', {
  method: 'POST',
  headers: { Authorization: 'Basic ' + btoa('anystring:YOUR_API_KEY') },
  body: JSON.stringify({ email_address: email, status: 'subscribed' })
});
```

---

Made with ❤️ by HolyWord Team
오늘도 말씀으로 힘내세요! ✦
