// js/app.js 전체 교체용
async function loadOriginalInfo(verseNum, krText) {
  // bookIdx가 0부터 시작하므로 +1 해줍니다.
  const bookNum = State.bookIdx + 1;
  const translation = bookNum <= 39 ? 'WLC' : 'SBLGNT';
  const bookName = BOOKS[State.bookIdx].n;

  const container = document.getElementById('analysis-content');
  container.innerHTML = `<p>불러오는 중...</p>`;

  try {
    const res = await fetch(`https://bolls.life/get-text/${translation}/${bookNum}/${State.chapter}/${verseNum}/`);
    const data = await res.json();
    
    container.innerHTML = `
      <div style="font-size: 1.5rem; margin-bottom: 10px; font-family: serif;">${data.text}</div>
      <p style="font-size: 0.9rem; color: #555;">${krText}</p>
      <button onclick="copyToClipboard('${krText} (${data.text})')" style="width:100%; padding:10px; background:#2c3e50; color:white; border:none; border-radius:5px; cursor:pointer;">사역자용 복사</button>
    `;
  } catch (e) {
    container.innerHTML = `<p>데이터를 불러오지 못했습니다.</p>`;
  }
}

// 이 함수가 성경 본문을 그릴 때 클릭 이벤트를 강제로 심어줍니다.
function renderVerses(containerId, verses, trans, book, meta) {
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  verses.forEach(v => {
    const row = document.createElement('div');
    row.className = 'verse-row';
    row.style.cursor = 'pointer'; // 마우스 올리면 손가락 모양
    row.onclick = () => loadOriginalInfo(v.number, v.text); // 클릭 시 원어 호출

    row.innerHTML = `<span class="v-num">${v.number}</span> <span class="v-text">${v.text}</span>`;
    c.appendChild(row);
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("복사되었습니다!");
}
