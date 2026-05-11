// ===== Configuration =====
const CONFIG = {
  typeSpeed: 120,
  deleteSpeed: 60,
  pauseTime: 1200,
  cursorBlinkSpeed: 800,
  orbitRadius: 200,
};

// ===== Typewriter Effect =====
const typewriterTexts = [
  'Vibe Coder',
  'AI Product',
  'Data Insight',
  'Legal Tech',
  'ENFJ',
  '可能·更多'
];

let typewriterIndex = 0;
let typewriterCharIndex = 0;
let isDeleting = false;

function typeWriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const currentText = typewriterTexts[typewriterIndex];

  if (isDeleting) {
    el.textContent = currentText.substring(0, typewriterCharIndex - 1);
    typewriterCharIndex--;
  } else {
    el.textContent = currentText.substring(0, typewriterCharIndex + 1);
    typewriterCharIndex++;
  }

  let nextSpeed = isDeleting ? CONFIG.deleteSpeed : CONFIG.typeSpeed;

  if (!isDeleting && typewriterCharIndex === currentText.length) {
    nextSpeed = CONFIG.pauseTime;
    isDeleting = true;
  } else if (isDeleting && typewriterCharIndex === 0) {
    isDeleting = false;
    typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
    nextSpeed = 500;
  }

  setTimeout(typeWriter, nextSpeed);
}

// ===== Orbit Bubble Positioning =====
function positionBubbles() {
  const bubbles = document.querySelectorAll('.orbit-bubble');
  const container = document.querySelector('.hero-center');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const bubbleConfigs = [
    { angle: 270, radius: 220, offX: 0,   offY: 22 },  // Vibe Coder - 向下移动22px
    { angle: 30,  radius: 285, offX: 22,  offY: 0 },  // AI Product - 稍外推避免重叠
    { angle: 90,  radius: 220, offX: 0,   offY: 0 },   // Data Insight - 正下方，与Vibe Coder对称
    { angle: 150, radius: 220, offX: -22, offY: 0 },  // Legal Tech - 稍外推避免重叠
    { angle: 210, radius: 285, offX: -22, offY: -5 }, // ENFJ - 稍外推避免重叠
    { angle: 330, radius: 285, offX: 22,  offY: 5 },  // 可能·更多 - 稍外推避免重叠
  ];

  bubbles.forEach((bubble, index) => {
    const cfg = bubbleConfigs[index];
    const angleRad = (cfg.angle * Math.PI) / 180;
    let x = centerX + cfg.radius * Math.cos(angleRad) + cfg.offX;
    let y = centerY + cfg.radius * Math.sin(angleRad) + cfg.offY;
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
  });
}

// ===== Navigation Active State =====
function updateNavActive() {
  const sections = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 100;

  sections.forEach((section, index) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLinks[index]) navLinks[index].classList.add('active');
    }
  });
}

// ===== Intersection Observer for Card Animations =====
function initCardAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => cardObserver.observe(card));
}

// ===== Contact Page Animations =====
function initContactAnimations() {
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-delay]').forEach(el => {
          const delay = el.dataset.delay || 0;
          setTimeout(() => el.classList.add('visible'), parseInt(delay));
        });
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const contactPage = document.querySelector('.page-contact');
  if (contactPage) contactObserver.observe(contactPage);
}

// ===== Timeline Scroll & Progress =====
function initTimeline() {
  const scrollArea = document.querySelector('.timeline-scroll-area');
  const timelineProgress = document.getElementById('timelineProgress');
  const scrollFill = document.getElementById('scrollFill');
  const items = document.querySelectorAll('.timeline-item');

  if (!scrollArea || !items.length) return;

  scrollArea.addEventListener('scroll', () => {
    const scrollTop = scrollArea.scrollTop;
    const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (timelineProgress) timelineProgress.style.height = progress + '%';
    if (scrollFill) scrollFill.style.height = progress + '%';
  });

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.data-highlight').forEach(el => {
          el.classList.add('flash');
          setTimeout(() => el.classList.remove('flash'), 1000);
        });
      }
      const rect = entry.target.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      const itemCenter = rect.top + rect.height / 2;
      if (Math.abs(itemCenter - centerY) < rect.height / 2 + 100) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    root: scrollArea,
    threshold: 0.3,
    rootMargin: '-20% 0px -20% 0px'
  });

  items.forEach(item => {
    itemObserver.observe(item);
    item.classList.add('visible');
  });
}

// ===== Radar Chart =====
function initRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 360;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const labels = ['用户同理心', '跨部门沟通', '敏捷项目管理', '需求导向', 'Vibe Coding', '严谨思维'];
  const values = [0.90, 0.88, 0.82, 0.92, 0.85, 0.90];
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 110;
  const levels = 5;

  let animationProgress = 0;
  let hoveredVertex = -1;
  let mouseX = 0;
  let mouseY = 0;
  let growthStartTime = null;

  function drawGrid() {
    ctx.strokeStyle = '#2A2A2E';
    ctx.lineWidth = 1;

    for (let i = 1; i <= levels; i++) {
      const r = (radius / levels) * i;
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  function drawData() {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const r = radius * values[i] * animationProgress;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push({ x, y });
    }

    ctx.fillStyle = 'rgba(200, 162, 200, 0.15)';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#C8A2C8';
    ctx.lineWidth = 2;
    ctx.stroke();

    points.forEach((p, i) => {
      const isHovered = i === hoveredVertex;
      const dotSize = isHovered ? 12 : 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, dotSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#C8A2C8';
      ctx.fill();

      if (isHovered) {
        const prevIdx = (i - 1 + 6) % 6;
        const nextIdx = (i + 1) % 6;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[prevIdx].x, points[prevIdx].y);
        ctx.lineTo(p.x, p.y);
        ctx.lineTo(points[nextIdx].x, points[nextIdx].y);
        ctx.stroke();
      }
    });
  }

  function drawLabels() {
    ctx.font = '12px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const labelRadius = radius + 32;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(labels[i], x, y);

      const valRadius = radius * values[i] * animationProgress + 14;
      const vx = centerX + valRadius * Math.cos(angle);
      const vy = centerY + valRadius * Math.sin(angle);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#C8A2C8';
      ctx.fillText(Math.round(values[i] * 100), vx, vy);
      ctx.font = '12px "Noto Sans SC", sans-serif';
    }
  }

  function drawScanline() {
    const time = Date.now() / 3000;
    const offset = (time % 1) * (radius * 2 + 40) - radius - 20;
    const gradient = ctx.createLinearGradient(0, centerY + offset - 15, 0, centerY + offset + 15);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, 'rgba(200, 162, 200, 0.05)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - radius - 20, centerY + offset - 15, (radius + 20) * 2, 30);
  }

  function drawTooltip() {
    if (hoveredVertex === -1) return;
    const angle = (Math.PI * 2 / 6) * hoveredVertex - Math.PI / 2;
    const r = radius * values[hoveredVertex] * animationProgress;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);

    const text = `${labels[hoveredVertex]}：${Math.round(values[hoveredVertex] * 100)}分`;
    ctx.font = '13px "Noto Sans SC", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 10;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 28;

    let boxX = x - boxWidth / 2;
    let boxY = y - 48;
    if (boxX < 10) boxX = 10;
    if (boxX + boxWidth > size - 10) boxX = size - 10 - boxWidth;
    if (boxY < 10) boxY = y + 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.strokeStyle = '#C8A2C8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2);
  }

  function animate() {
    ctx.clearRect(0, 0, size, size);
    drawGrid();
    drawScanline();
    drawData();
    drawLabels();
    drawTooltip();
    requestAnimationFrame(animate);
  }

  function grow(timestamp) {
    if (!growthStartTime) growthStartTime = timestamp;
    const elapsed = timestamp - growthStartTime;
    const duration = 1200;
    const progress = Math.min(elapsed / duration, 1);
    animationProgress = 1 - Math.pow(1 - progress, 3);
    if (progress < 1) {
      requestAnimationFrame(grow);
    }
  }
  setTimeout(() => requestAnimationFrame(grow), 300);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * dpr;
    mouseY = (e.clientY - rect.top) * dpr;

    let closest = -1;
    let closestDist = Infinity;

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
      const r = radius * values[i] * animationProgress;
      const vx = centerX + r * Math.cos(angle);
      const vy = centerY + r * Math.sin(angle);
      const dist = Math.sqrt((mouseX - vx) ** 2 + (mouseY - vy) ** 2);
      if (dist < 25 && dist < closestDist) {
        closest = i;
        closestDist = dist;
      }
    }
    hoveredVertex = closest;
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredVertex = -1;
  });

  animate();
}

// ===== Project Showcase Slider =====
function initShowcaseSlider() {
  const slides = document.querySelectorAll('.showcase-slide');
  const indicators = document.querySelectorAll('.indicator');
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!slides.length) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active');
      const offset = index - currentIndex;

      if (offset === 0) {
        slide.classList.add('active');
        slide.style.transform = 'scale(1) translateX(0)';
        slide.style.opacity = '1';
        slide.style.zIndex = '10';
      } else if (offset > 0) {
        const scale = Math.max(0.75, 1 - offset * 0.08);
        const translateX = offset * 40;
        slide.style.transform = `scale(${scale}) translateX(${translateX}px)`;
        slide.style.opacity = '0.6';
        slide.style.zIndex = `${10 - offset}`;
      } else {
        const scale = Math.max(0.75, 1 - Math.abs(offset) * 0.08);
        const translateX = offset * 40;
        slide.style.transform = `scale(${scale}) translateX(${translateX}px)`;
        slide.style.opacity = '0.6';
        slide.style.zIndex = `${10 - Math.abs(offset)}`;
      }
    });

    indicators.forEach((ind, index) => {
      ind.classList.toggle('active', index === currentIndex);
    });

    if (counter) counter.textContent = `${currentIndex + 1}/${slides.length}`;
  }

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    updateSlides();

    // 重置所有图片滚动位置到顶部
    slides.forEach(slide => {
      const wrapper = slide.querySelector('.slide-image-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
    });
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  indicators.forEach((ind, index) => {
    ind.addEventListener('click', () => goToSlide(index));
  });

  const stack = document.getElementById('showcaseStack');
  if (stack) {
    // 滚轮事件：在图片区域内只触发垂直滚动，不触发横向切换
    stack.addEventListener('wheel', (e) => {
      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;
      const wrapper = activeSlide.querySelector('.slide-image-wrapper');
      if (!wrapper) return;

      const canScrollDown = wrapper.scrollTop + wrapper.clientHeight < wrapper.scrollHeight;
      const canScrollUp = wrapper.scrollTop > 0;

      // 如果图片可垂直滚动，且滚轮方向与滚动方向一致，则阻止横向切换
      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
        e.stopPropagation();
        // 不阻止默认行为，让 wrapper 自然滚动
      }
    }, { passive: true });

    stack.addEventListener('mousedown', (e) => {
      // 如果点击在可滚动区域内，不启动拖拽
      const activeSlide = slides[currentIndex];
      const wrapper = activeSlide?.querySelector('.slide-image-wrapper');
      if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) {
        const rect = wrapper.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          return;
        }
      }
      isDragging = true;
      startX = e.clientX;
    });

    stack.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goToSlide(currentIndex - 1) : goToSlide(currentIndex + 1);
      }
    });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goToSlide(currentIndex - 1) : goToSlide(currentIndex + 1);
      }
    });
  }

  updateSlides();
}

// ===== Smooth Scroll for Nav Links =====
function initSmoothScroll() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 64,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ===== Hero Buttons Smooth Scroll =====
function initHeroButtons() {
  document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 64,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ===== Page Keyword Animations =====
function initPageKeywords() {
  const keywordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const keyword = entry.target.querySelector('.page-keyword');
        if (keyword) {
          setTimeout(() => keyword.classList.add('visible'), 100);
        }
        keywordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.page-background, .page-internship, .page-project').forEach(page => {
    keywordObserver.observe(page);
  });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  positionBubbles();
  setTimeout(typeWriter, 800);
  initCardAnimations();
  initContactAnimations();
  initTimeline();
  initRadarChart();
  initShowcaseSlider();
  initSmoothScroll();
  initHeroButtons();
  initPageKeywords();

  window.addEventListener('scroll', updateNavActive);
  updateNavActive();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(positionBubbles, 200);
  });
});
