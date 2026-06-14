import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="countdown-overlay" class="countdown-overlay">
    <div class="countdown-content">
     
     
      <div id="countdown" class="countdown-timer-large">
        <div class="time-block-large"><span id="cd-hours">00</span><span class="time-label-large">ชม.</span></div>
        <div class="time-block-large"><span id="cd-minutes">00</span><span class="time-label-large">นาที</span></div>
        <div class="time-block-large"><span id="cd-seconds">00</span><span class="time-label-large">วินาที</span></div>
      </div>
    </div>
  </div>

  <div class="book-scene" id="book-scene" style="display: none; opacity: 0; transition: opacity 2s ease;">
    
    <!-- Swipe animation hint -->
    <div id="swipe-hint" class="swipe-hint">
      <div class="hand-icon">👆</div>
    </div>

    <div class="book" id="book">
      
      <!-- Leaf 3 (Page 4 and Back Cover) -->
      <div class="leaf leaf-3" id="leaf-3">
        <!-- Front side of Leaf 3 (Right Page 4) -->
        <div class="side front right-page">
          <div class="page-content right-content">
            <h2 class="chapter-title" style="color: #ccc; font-weight: 400;">Page 4</h2>
            <span class="page-number">4.</span>
          </div>
        </div>
        <!-- Back side of Leaf 3 (Back Cover) -->
        <div class="side back cover-back">
          <div class="page-content">
            <!-- Empty back cover -->
          </div>
        </div>
      </div>

      <!-- Leaf 2 (Yellow Page and Page 3) -->
      <div class="leaf leaf-2" id="leaf-2">
        <!-- Front side of Leaf 2 (Yellow Page 2) -->
        <div class="side front right-page yellow-chapter-page">
          <div class="cover-content">
            <div class="custom-title-layout">
              <div class="title-line-1">ขอให้</div>
              <div class="title-line-2">วันนี้</div>
              <div class="title-line-3">
                <span class="text-small-part">เป็น</span>
                <span class="text-large-part">วันที่ดี</span>
                <span class="text-small-part" style="margin-left: 8px; margin-right: 0;">น๊าา</span>
              </div>
            </div>
            
            <div class="cover-author-section" style="border-bottom-width: 20px; color: transparent;">
              <div class="cover-illustration">
                 <div class="chair"></div>
                 <div class="person"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Back side of Leaf 2 (Left Page 3) -->
        <div class="side back left-page">
          <div class="page-content left-content">
          </div>
        </div>
      </div>

      <!-- Leaf 1 (Cover and Chapter 1) -->
      <div class="leaf cover-wrapper leaf-1" id="leaf-1">
        <div class="leaf-inner" id="cover">
          
          <!-- Front Cover -->
          <div class="side front cover-front pink-cover">
            <div class="cover-titles">
              <div class="custom-title-layout" style="align-items: center; color: white; text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15); margin-top: -10px; margin-bottom: 5px; position: relative; top: 0;">
                <div class="title-line-1" style="font-weight: 600;">Book</div>
                <div class="title-line-2" style="font-weight: 700;">For</div>
                <div class="title-line-3">
                  <span class="text-large-part" style="font-weight: 700; font-size: 85px;">You</span>
                </div>
              </div>
              <p class="sub-title">หนังสือสำหรับคุณ</p>
            </div>
            <img src="/cat4.png" alt="Cat Cover" class="cover-cat-image-small" />
          </div>

          <!-- Back of Cover (Left Page 1) -->
          <div class="side back cover-back">
            <div class="page-content left-content" style="background-image: none;">
              <h2 class="chapter-title" style="margin-top: 20px;">Chapter 1</h2>
              <div class="chapter-image-container">
                <img src="/cat_chapter1.png" alt="Cat holding flower" class="chapter-cat-image" />
              </div>
              <span class="page-number" style="left: 50px;">1.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
`

let currentLeaf = 0;
const totalLeaves = 3;

const book = document.getElementById('book')!;
const swipeHint = document.getElementById('swipe-hint')!;

// Hide hint on any interaction
const hideHint = () => {
  if (swipeHint.style.display !== 'none') {
    swipeHint.style.display = 'none';
  }
};

const updateBook = () => {
  if (currentLeaf === 0) {
    book.classList.remove('open');
  } else {
    book.classList.add('open');
  }

  for (let i = 1; i <= totalLeaves; i++) {
    const leaf = document.getElementById(`leaf-${i}`)!;
    const leafInner = i === 1 ? document.getElementById('cover')! : leaf;

    // Calculate the target z-index based on the stack
    const targetZIndex = (i <= currentLeaf)
      ? totalLeaves + i        // Left stack: totalLeaves + i
      : totalLeaves - i + 1;   // Right stack: totalLeaves - i + 1

    const currentZIndex = parseInt(leaf.style.zIndex || '0', 10);

    if (i <= currentLeaf) {
      leafInner.classList.add('flipped');
    } else {
      leafInner.classList.remove('flipped');
    }

    // Apply z-index logic: immediate if increasing, delayed if decreasing
    if (targetZIndex >= currentZIndex) {
      leaf.style.zIndex = String(targetZIndex);
    } else {
      // Delay the decrease so the page stays on top while flipping back
      setTimeout(() => {
        leaf.style.zIndex = String(targetZIndex);
      }, 800); // 800ms matches the CSS transition time
    }
  }
};

// Pointer events for swipe (mouse & touch)
let startX = 0;
let isDragging = false;

book.addEventListener('pointerdown', (e) => {
  startX = e.clientX;
  isDragging = true;
  hideHint();
});

// Countdown Timer Logic
function initCountdown() {
  // Target: June 15, 2026, 06:00:00 (Thailand time GMT+7)
  const targetDate = new Date('2026-06-15T01:00:00+07:00').getTime();



  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timer);
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';

      const overlayEl = document.getElementById('countdown-overlay');
      const sceneEl = document.getElementById('book-scene');

      if (overlayEl) {
        overlayEl.style.opacity = '0';
        setTimeout(() => overlayEl.remove(), 1000);
      }

      if (sceneEl) {
        sceneEl.style.display = 'flex';
        // Force reflow
        void sceneEl.offsetWidth;
        sceneEl.style.opacity = '1';
      }

      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    hoursEl.innerText = hours.toString().padStart(2, '0');
    minutesEl.innerText = minutes.toString().padStart(2, '0');
    secondsEl.innerText = seconds.toString().padStart(2, '0');
  }, 1000);
}

// Start the countdown
initCountdown();

book.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.clientX;
  const threshold = 40; // Pixels needed to register as a swipe

  if (endX < startX - threshold) {
    // Swipe left (next page)
    if (currentLeaf < 2) {
      currentLeaf++;
      updateBook();
    }
  } else if (endX > startX + threshold) {
    // Swipe right (previous page)
    if (currentLeaf > 0) {
      currentLeaf--;
      updateBook();
    }
  }
});

// Click to turn pages (fallback to clicking specific pages)
document.getElementById('leaf-1')?.addEventListener('click', (e) => {
  if (isDragging && Math.abs(startX - e.clientX) > 10) return; // Ignore click if it was a drag
  if (currentLeaf === 0) { currentLeaf = 1; updateBook(); }
  else if (currentLeaf === 1) { currentLeaf = 0; updateBook(); }
});
document.getElementById('leaf-2')?.addEventListener('click', (e) => {
  if (isDragging && Math.abs(startX - e.clientX) > 10) return;
  if (currentLeaf === 1) { currentLeaf = 2; updateBook(); }
  else if (currentLeaf === 2) { currentLeaf = 1; updateBook(); }
});
// leaf-3 ไม่สามารถคลิกเปิดต่อไปได้แล้ว (หยุดที่หน้า 3-4)

// Initialize
updateBook();
