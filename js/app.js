<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HolyWord Bible - Parallel Bible Reader</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8675368228460145" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/style.css">

<style>
    /* 배경색 및 중앙 정렬 */
    body { background-color: #f4f7f6; margin: 0; font-family: 'Inter', 'Noto Sans KR', sans-serif; }

    /* 메인 컨테이너 */
    .main-wrapper { 
        display: flex; 
        justify-content: center; 
        width: 100%; 
    }
    
    .main-layout {
        display: flex;
        justify-content: center;
        gap: 20px;
        width: 95%;
        max-width: 1200px; /* 본문에 집중하기 위해 폭을 최적화했습니다 */
        margin: 0 auto;
        padding: 20px 0;
    }

    /* 성경 본문 영역 (가장 중요) */
    .bible-panels {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr; /* 2열 구조 고정 */
        gap: 20px;
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        min-height: 600px;
    }

    /* 좌우 광고 사이드바 */
    .ad-sidebar {
        flex: 0 0 160px;
        position: sticky;
        top: 20px;
        height: fit-content;
    }

    /* 컨트롤바 디자인 */
    .controls-bar {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        margin: 20px auto;
        max-width: 1140px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .ctrl-group { display: flex; align-items: center; gap: 8px; }
    .ctrl-select { padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd; outline: none; }

    /* 절 스타일 */
    .verse-row { margin-bottom: 12px; line-height: 1.6; font-size: 1.1rem; }
    .v-num { font-weight: bold; color: #2c3e50; margin-right: 8px; }

    @media (max-width: 1000px) {
        .ad-sidebar { display: none; } /* 화면 좁으면 광고 숨김 */
        .bible-panels { grid-template-columns: 1fr; } /* 모바일은 1열 */
    }
</style>
</head>
<body>

<header class="site-header">
  <div class="nav-container" style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 10px 20px;">
    <a href="index.html" class="logo" style="text-decoration: none; color: #2c3e50; font-size: 24px; font-weight: bold;">
      <span class="logo-cross">✦</span> HolyWord
    </a>
    <nav class="header-nav">
      <a href="index.html" class="nav-link active">📖 Bible</a>
      <a href="pages/topics.html" class="nav-link">🏷️ Topics</a>
      <a href="pages/daily.html" class="nav-link">☀️ Daily</a>
    </nav>
  </div>
</header>

<div class="controls-bar" id="controlsBar">
  <div class="ctrl-group">
    <span>Book</span>
    <select id="bookSelect" class="ctrl-select" onchange="onBookChange()"></select>
  </div>
  <div class="ctrl-group">
    <span>Chapter</span>
    <select id="chapterSelect" class="ctrl-select" onchange="onChapterChange()"></select>
  </div>
  <div class="ctrl-group">
    <select id="leftTrans" class="ctrl-select" onchange="loadBoth()">
      <option value="KRV" selected>Korean (KRV)</option>
      <option value="NIV">English (NIV)</option>
      <option value="KJV">English (KJV)</option>
    </select>
  </div>
  <div class="ctrl-group">
    <select id="rightTrans" class="ctrl-select" onchange="loadBoth()">
      <option value="KJV" selected>English (KJV)</option>
      <option value="NIV">English (NIV)</option>
      <option value="KRV">Korean (KRV)</option>
    </select>
  </div>
</div>

<div class="main-wrapper">
    <div class="main-layout">

        <aside class="ad-sidebar">
            <ins class="adsbygoogle" style="display:block;width:160px;height:600px" data-ad-client="ca-pub-8675368228460145" data-ad-slot="7174010171"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </aside>

        <div class="bible-panels">
            <div id="leftVerses">
                <p style="color: #999;">성경 데이터를 불러오는 중...</p>
            </div>
            <div id="rightVerses">
                <p style="color: #999;">성경 데이터를 불러오는 중...</p>
            </div>
        </div>

        <aside class="ad-sidebar">
            <ins class="adsbygoogle" style="display:block;width:160px;height:600px" data-ad-client="ca-pub-8675368228460145" data-ad-slot="2500534899"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </aside>

    </div>
</div>

<footer class="site-footer" style="text-align: center; padding: 40px; color: #666;">
    <p>© 2025 HolyWord Bible · Free Online Bible Service</p>
</footer>

<script src="js/bible-data.js"></script>
<script src="js/app.js"></script>
</body>
</html>
