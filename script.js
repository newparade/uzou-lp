/**
 * UZOU LP v11 — script.js
 * "Precision Lattice" concept
 * 白ファースト（75% light / 25% dark）
 *
 * 目次:
 * 1. 初期化エントリポイント
 * 2. Header（スクロール検知 + モバイルメニュー）
 * 3. スクロールリビール（IntersectionObserver）
 * 4. Canvas: Hero Connection Visualizer（新規実装）
 * 5. Solution タブ切替（新規実装）
 * 6. About Platform Diagram（スクロール連動ライン描画）
 * 7. Results カウントアップ + ブラーリビール（新規実装）
 * 8. Features アニメーション群
 *    - Feature-01: バーチャート変動（v9継承強化）
 *    - Feature-02: ノード増殖SVG（新規実装）
 *    - Feature-03: フローハイライト（新規実装）
 * 9. Flow アコーディオン（新規実装）
 * 10. Canvas: Final CTA マウス追従パーティクル（新規実装）
 */

/* =============================================
   1. 初期化エントリポイント
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initConnectionSpine();
  initConnectionVisualizer();
  initSolutionTabs();
  initPlatformDiagram();
  initCountUp();
  initFeaturesAnimations();
  initFlowAccordion();
  initFinalCtaParticles();
  initMagneticButtons();
  initCardGlowFollow();
  initSectionParallax();
  initCardTilt();
  initFlowTimelineScroll();
  initFaqSmoothAccordion();
  initHeroTextSplit();
  initSmoothAnchor();
  initHeaderDarkMode();
});

/* =============================================
   2. Header スクロール検知 + Fixed CTAバー
   ============================================= */
function initHeader() {
  const header = document.getElementById('site-header');
  const fixedBar = document.querySelector('.fixed-cta-bar');
  const heroSection = document.getElementById('hero');
  if (!header) return;

  const scrollHandler = () => {
    const scrollY = window.scrollY;

    header.classList.toggle('is-scrolled', scrollY > 40);

    if (heroSection && fixedBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      fixedBar.classList.toggle('is-visible', scrollY > heroBottom - 100);
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
}

/* =============================================
   モバイルメニュー（ESCキー対応 + フォーカストラップ）
   ============================================= */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  const open = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.removeAttribute('aria-hidden');
    const focusable = menu.querySelectorAll('a, button');
    if (focusable.length) focusable[0].focus();
  };

  const close = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();

    // フォーカストラップ
    if (e.key === 'Tab' && menu.classList.contains('is-open')) {
      const focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* =============================================
   接続スパイン（ページ全体を貫く接続線のスクロール追従）
   ============================================= */
function initConnectionSpine() {
  const spine = document.querySelector('.connection-spine');
  if (!spine) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pulse = spine.querySelector('.connection-spine__pulse');
  if (!pulse) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    // パルスドットのY位置をスクロール進捗に連動
    const pulseY = progress * (window.innerHeight - 8);
    pulse.style.transform = `translateY(${pulseY}px)`;

    // パルスサイズをスクロール中盤で最大化
    const sizeFactor = 1 + Math.sin(progress * Math.PI) * 0.5;
    pulse.style.width = `${8 * sizeFactor}px`;
    pulse.style.height = `${8 * sizeFactor}px`;

    // Hero通過後にアクティブ化
    spine.classList.toggle('is-active', scrollY > 200);

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* =============================================
   3. スクロールリビール（scroll-reveal.js参照）
   IntersectionObserver + data-reveal 属性
   ============================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.revealDelay || '0');
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   4. Canvas: Hero Connection Visualizer
   新規実装
   - ノード: ADV(7) + UZOU Core(1) + MEDIA(7)
   - 接続線: bezierCurveTo（直線禁止）
   - マウスインタラクション: バネ係数0.05
   - 30fps制限
   - prefers-reduced-motion 対応
   ============================================= */
function initConnectionVisualizer() {
  const canvas = document.getElementById('connection-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let mouseX = -999, mouseY = -999;
  let lastTime = 0;
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  let activeConnections = new Set();
  let lastConnectionUpdate = 0;
  const CONNECTION_UPDATE_INTERVAL = 3000;

  // Canvasサイズ設定
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    nodes = generateNodes(rect.width, rect.height);
  }

  // ノード生成
  function generateNodes(w, h) {
    const arr = [];

    // UZOUコアノード（中央固定）
    arr.push({
      id: 'uzou-core', type: 'uzou',
      x: w * 0.5, y: h * 0.5,
      radius: 22,
      vx: 0, vy: 0,
      baseX: w * 0.5, baseY: h * 0.5,
      pulsePhase: 0,
    });

    const isMobile = w < 600;
    const advCount = isMobile ? 4 : 7;
    const mediaCount = isMobile ? 4 : 7;

    // 広告主ノード（左1/3エリア）
    for (let i = 0; i < advCount; i++) {
      const bx = w * 0.05 + Math.random() * w * 0.28;
      const by = h * 0.08 + Math.random() * h * 0.84;
      arr.push({
        id: `adv-${i}`, type: 'adv',
        x: bx, y: by,
        radius: 5 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseX: bx, baseY: by,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // メディアノード（右1/3エリア）
    for (let i = 0; i < mediaCount; i++) {
      const bx = w * 0.65 + Math.random() * w * 0.28;
      const by = h * 0.08 + Math.random() * h * 0.84;
      arr.push({
        id: `media-${i}`, type: 'media',
        x: bx, y: by,
        radius: 4 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseX: bx, baseY: by,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    return arr;
  }

  // アクティブ接続更新（3秒ごとにランダム選定）
  function updateActiveConnections() {
    activeConnections.clear();
    const advNodes   = nodes.filter(n => n.type === 'adv');
    const mediaNodes = nodes.filter(n => n.type === 'media');

    const pickCount = 2 + Math.floor(Math.random() * 2);
    const allNonCore = [...advNodes, ...mediaNodes];
    const shuffled = allNonCore.sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(pickCount, shuffled.length); i++) {
      activeConnections.add(shuffled[i].id);
    }
  }

  // 幾何学形状描画ヘルパー
  function drawTriangle(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHexagon(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI / 3) - Math.PI / 6;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  // ノード描画（幾何学形状混在: 円/三角形/六角形）
  function drawNode(node, time) {
    const pulseFactor = 1 + Math.sin(time * 0.002 + node.pulsePhase) * 0.15;

    if (node.type === 'uzou') {
      // 外グロー（六角形）— 白背景用に濃度up
      const outerGlow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 3
      );
      outerGlow.addColorStop(0, 'rgba(52, 98, 111, 0.12)');
      outerGlow.addColorStop(1, 'rgba(52, 98, 111, 0)');
      ctx.fillStyle = outerGlow;
      drawHexagon(node.x, node.y, node.radius * 3);
      ctx.fill();

      // コア本体（六角形）
      const coreGrad = ctx.createRadialGradient(
        node.x - 3, node.y - 3, 0,
        node.x, node.y, node.radius * pulseFactor
      );
      coreGrad.addColorStop(0, 'rgba(52, 98, 111, 0.85)');
      coreGrad.addColorStop(1, 'rgba(43, 73, 84, 0.65)');
      ctx.fillStyle = coreGrad;
      drawHexagon(node.x, node.y, node.radius * pulseFactor);
      ctx.fill();

      // リング（六角形）
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.4)';
      ctx.lineWidth = 1.5;
      drawHexagon(node.x, node.y, node.radius * pulseFactor + 6);
      ctx.stroke();

      // 外リング（追加装飾）
      ctx.strokeStyle = 'rgba(139, 192, 202, 0.15)';
      ctx.lineWidth = 0.5;
      drawHexagon(node.x, node.y, node.radius * pulseFactor + 14);
      ctx.stroke();

      // 3層目リング（v11追加）
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.08)';
      ctx.lineWidth = 0.3;
      drawHexagon(node.x, node.y, node.radius * pulseFactor + 22);
      ctx.stroke();

    } else if (node.type === 'adv') {
      // 広告主ノード: 白背景用に濃度up
      const idx = parseInt(node.id.split('-')[1], 10);
      ctx.fillStyle = `rgba(52, 98, 111, ${0.30 + Math.sin(time * 0.001 + node.pulsePhase) * 0.1})`;
      if (idx % 2 === 0) {
        drawTriangle(node.x, node.y, node.radius);
      } else {
        drawHexagon(node.x, node.y, node.radius);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

    } else if (node.type === 'media') {
      // メディアノード: 白背景用に濃度up
      const idx = parseInt(node.id.split('-')[1], 10);
      if (activeConnections.has(node.id)) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(52, 98, 111, 0.3)';
      }
      ctx.fillStyle = `rgba(139, 192, 202, ${0.40 + Math.sin(time * 0.0015 + node.pulsePhase) * 0.15})`;
      if (idx % 3 === 0) {
        drawHexagon(node.x, node.y, node.radius);
      } else if (idx % 3 === 1) {
        drawTriangle(node.x, node.y, node.radius);
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // 接続線描画（bezierCurveTo — 直線禁止）
  function drawConnections(time) {
    const coreNode = nodes.find(n => n.type === 'uzou');
    if (!coreNode) return;

    const MAX_DIST = 200;

    nodes.forEach(node => {
      if (node.type === 'uzou') return;

      const dx = coreNode.x - node.x;
      const dy = coreNode.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > MAX_DIST * 1.5) return;

      const alpha = Math.max(0, 1 - dist / (MAX_DIST * 1.5));
      const isActive = activeConnections.has(node.id);

      // ベジェ曲線の制御点（中点から法線方向にオフセット）
      const mx = (node.x + coreNode.x) / 2;
      const my = (node.y + coreNode.y) / 2;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const curveOffset = len * 0.2 * (node.id.includes('adv') ? -0.8 : 0.8);
      const cpx = mx - (dy / len) * curveOffset;
      const cpy = my + (dx / len) * curveOffset;

      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.quadraticCurveTo(cpx, cpy, coreNode.x, coreNode.y);

      if (isActive) {
        const flowAlpha = 0.5 + Math.sin(time * 0.004) * 0.2;
        ctx.strokeStyle = `rgba(52, 98, 111, ${alpha * flowAlpha})`;
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(52, 98, 111, 0.30)';
      } else {
        ctx.strokeStyle = `rgba(52, 98, 111, ${alpha * 0.25})`;
        ctx.lineWidth = 0.7;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  // マウス引力（バネ係数0.05 + 復元力）
  function applyMouseAttractionToNode(node, mx, my) {
    if (mx < -900) return;
    const dx = mx - node.x;
    const dy = my - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const RADIUS = 200;
    const SPRING = 0.05;

    if (dist < RADIUS && dist > 0) {
      const force = (RADIUS - dist) / RADIUS;
      node.vx += (dx / dist) * force * SPRING;
      node.vy += (dy / dist) * force * SPRING;
    }

    // 元の位置への復元力（深海生物の抵抗）
    node.vx += (node.baseX - node.x) * 0.02;
    node.vy += (node.baseY - node.y) * 0.02;

    // 速度減衰（摩擦）
    node.vx *= 0.92;
    node.vy *= 0.92;
    node.x += node.vx;
    node.y += node.vy;
  }

  // メインループ（30fps制限）
  function loop(timestamp) {
    if (!document.getElementById('connection-canvas')) return;

    const elapsed = timestamp - lastTime;
    if (elapsed >= FRAME_INTERVAL) {
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (timestamp - lastConnectionUpdate > CONNECTION_UPDATE_INTERVAL) {
        updateActiveConnections();
        lastConnectionUpdate = timestamp;
      }

      nodes.forEach(node => {
        if (node.type !== 'uzou') {
          applyMouseAttractionToNode(node, mouseX, mouseY);
        }
        drawNode(node, timestamp);
      });

      drawConnections(timestamp);
    }

    requestAnimationFrame(loop);
  }

  // マウスイベント
  const heroVisual = canvas.closest('.hero__visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    heroVisual.addEventListener('mouseleave', () => {
      mouseX = -999; mouseY = -999;
    });
  }

  // prefers-reduced-motion: 静止画フォールバック
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resize();
    updateActiveConnections();
    nodes.forEach(node => drawNode(node, 0));
    drawConnections(0);
    // リサイズ時にも再描画
    const roStatic = new ResizeObserver(() => {
      resize();
      updateActiveConnections();
      nodes.forEach(node => drawNode(node, 0));
      drawConnections(0);
    });
    roStatic.observe(canvas);
    return;
  }

  resize();
  updateActiveConnections();
  requestAnimationFrame(loop);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
}

/* =============================================
   5. Solution タブ切替
   新規実装 + ARIA属性更新
   ============================================= */
function initSolutionTabs() {
  const tabs   = document.querySelectorAll('.solution__tab');
  const panels = document.querySelectorAll('.solution__panel');
  if (!tabs.length) return;

  function activateTab(index) {
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.classList.remove('is-active');
      p.setAttribute('hidden', '');
    });

    tabs[index].classList.add('is-active');
    tabs[index].setAttribute('aria-selected', 'true');
    tabs[index].setAttribute('tabindex', '0');
    tabs[index].focus();
    panels[index].classList.add('is-active');
    panels[index].removeAttribute('hidden');

    // タブ切替時のアイテムリビール
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    panels[index].querySelectorAll('.solution__item').forEach((item, j) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.4s, transform 0.4s var(--ease-reveal, cubic-bezier(0.22, 1, 0.36, 1))';
        item.style.opacity = '1';
        item.style.transform = 'none';
      }, j * 60);
    });
  }

  // 初期tabindex設定
  tabs.forEach((tab, i) => {
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    tab.addEventListener('click', () => activateTab(i));
  });

  // 矢印キーナビゲーション（WAI-ARIA Tabs Pattern）
  const tablist = document.querySelector('.solution__tabs');
  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const currentIndex = Array.from(tabs).findIndex(t => t === document.activeElement);
      if (currentIndex === -1) return;

      let newIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabs.length - 1;
      }

      if (newIndex !== undefined) activateTab(newIndex);
    });
  }
}

/* =============================================
   6. About Platform Diagram スクロール連動
   IntersectionObserver で stroke-dashoffset → 0
   ============================================= */
function initPlatformDiagram() {
  const diagram = document.querySelector('.about__diagram');
  if (!diagram) return;

  const lines = diagram.querySelectorAll('.platform-line');
  lines.forEach((line, i) => {
    line.style.transitionDelay = `${i * 150}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(diagram);
}

/* =============================================
   7. Results カウントアップ + ブラーリビール
   新規実装（counter-up.js参照）
   ============================================= */
function initCountUp() {
  const counters = document.querySelectorAll('.results__count[data-count]');
  if (!counters.length) return;

  // prefers-reduced-motion: そのまま表示
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(el => {
      const prefix  = el.dataset.countPrefix || '';
      const suffix  = el.dataset.countSuffix || '';
      const target  = parseFloat(el.dataset.count);
      const decimal = parseInt(el.dataset.countDecimal || '0', 10);
      el.textContent = prefix + target.toFixed(decimal) + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.countSuffix || '';
      const prefix   = el.dataset.countPrefix || '';
      const duration = parseFloat(el.dataset.countDuration || '1.5') * 1000;
      const decimal  = parseInt(el.dataset.countDecimal || '0', 10);

      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + current.toFixed(decimal) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* =============================================
   8. Features アニメーション群
   ============================================= */
function initFeaturesAnimations() {
  initBarChart();
  initNodeGrowth();
  initFlowHighlight();
}

// Feature-01: バーチャート変動（setInterval / v9継承強化）
function initBarChart() {
  const bars = document.querySelectorAll('.features__bar');
  if (!bars.length) return;

  const baseHeights = Array.from(bars).map(b =>
    parseFloat(b.style.getPropertyValue('--h'))
  );

  const randomize = () => {
    bars.forEach((bar, i) => {
      const variation = (Math.random() - 0.5) * 30;
      const newH = Math.max(20, Math.min(95, baseHeights[i] + variation));
      bar.style.setProperty('--h', newH + '%');
    });

    // 最大バーをアクティブに
    const heights = Array.from(bars).map(b =>
      parseFloat(b.style.getPropertyValue('--h'))
    );
    const maxIdx = heights.indexOf(Math.max(...heights));
    bars.forEach((b, i) => {
      b.classList.toggle('features__bar--active', i === maxIdx);
    });
  };

  const chart = document.getElementById('feature-barchart');
  if (!chart) return;

  let barInterval = null;
  const obs = new IntersectionObserver(entries => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (entries[0].isIntersecting) {
      if (!barInterval) barInterval = setInterval(randomize, 1800);
    } else {
      clearInterval(barInterval);
      barInterval = null;
    }
  }, { threshold: 0.3 });
  obs.observe(chart);
}

// Feature-02: ノード増殖SVG（新規実装）
function initNodeGrowth() {
  const svg     = document.getElementById('node-growth-svg');
  const counter = document.getElementById('node-count-display');
  if (!svg || !counter) return;

  const cx = 120, cy = 90;
  const maxNodes = 12;
  let count = 1;

  const addNode = () => {
    if (count >= maxNodes) return;

    const angle  = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 60;
    const nx = cx + Math.cos(angle) * radius;
    const ny = cy + Math.sin(angle) * radius;

    // 接続線
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', nx); line.setAttribute('y2', ny);
    line.setAttribute('stroke', 'rgba(52,98,111,0.25)');
    line.setAttribute('stroke-width', '0.8');
    svg.insertBefore(line, svg.firstChild);

    // ノード
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const r = 5 + Math.random() * 8;
    circle.setAttribute('cx', nx); circle.setAttribute('cy', ny);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'rgba(139,192,202,0.08)');
    circle.setAttribute('stroke', 'rgba(139,192,202,0.4)');
    circle.setAttribute('stroke-width', '1');
    circle.style.opacity = '0';
    circle.style.transition = 'opacity 0.4s';
    svg.appendChild(circle);
    setTimeout(() => { circle.style.opacity = '1'; }, 50);

    count++;
    counter.textContent = count;
  };

  const visual = document.querySelector('.features__node-visual');
  if (!visual) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        counter.textContent = maxNodes;
        return;
      }
      const timer = setInterval(() => {
        addNode();
        if (count >= maxNodes) clearInterval(timer);
      }, 400);
      obs.unobserve(visual);
    }
  }, { threshold: 0.4 });
  obs.observe(visual);
}

// Feature-03: フローハイライト（新規実装）
function initFlowHighlight() {
  const flow = document.getElementById('feature-flow');
  if (!flow) return;

  const steps = flow.querySelectorAll('.features__flow-step');
  let currentStep = 0;

  const highlight = () => {
    steps.forEach(s => s.classList.remove('is-active'));
    steps[currentStep].classList.add('is-active');
    currentStep = (currentStep + 1) % steps.length;
  };

  let flowInterval = null;
  const obs = new IntersectionObserver(entries => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      steps[0].classList.add('is-active');
      return;
    }
    if (entries[0].isIntersecting) {
      if (!flowInterval) {
        highlight();
        flowInterval = setInterval(highlight, 1200);
      }
    } else {
      clearInterval(flowInterval);
      flowInterval = null;
    }
  }, { threshold: 0.4 });
  obs.observe(flow);
}

/* =============================================
   9. Flow アコーディオン
   新規実装（aria-expanded 更新対応）
   ============================================= */
function initFlowAccordion() {
  const headers = document.querySelectorAll('.flow__step-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const detailId   = header.getAttribute('aria-controls');
      const detail     = document.getElementById(detailId);
      if (!detail) return;

      header.setAttribute('aria-expanded', String(!isExpanded));
      if (isExpanded) {
        detail.setAttribute('hidden', '');
      } else {
        detail.removeAttribute('hidden');
      }
    });
  });
}

/* =============================================
   10. Canvas: Final CTA マウス追従パーティクル
   新規実装
   - 40パーティクル
   - マウス引力 + 自律回転移動
   - prefers-reduced-motion 対応
   ============================================= */
function initFinalCtaParticles() {
  const canvas = document.getElementById('final-cta-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  let mouseX = 0.5, mouseY = 0.5;

  function resize() {
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  // 幾何学形状描画ヘルパー（Final CTA用）
  function drawParticleTriangle(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI / 3) - Math.PI / 2;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawParticleHexagon(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) - Math.PI / 6;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  // パーティクル初期化（形状混在: circle/triangle/hexagon）
  for (let i = 0; i < 40; i++) {
    const shapes = ['circle', 'triangle', 'hexagon'];
    particles.push({
      x:     Math.random(),
      y:     Math.random(),
      size:  1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3,
      speed: 0.0002 + Math.random() * 0.0003,
      angle: Math.random() * Math.PI * 2,
      shape: shapes[i % 3],
    });
  }

  let lastFrame = 0;
  const frameInterval = 1000 / 30; // 30fps制限

  function loop(now) {
    requestAnimationFrame(loop);
    if (now - lastFrame < frameInterval) return;
    lastFrame = now;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach(p => {
      // マウスへの引力
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      p.x += dx * 0.0008;
      p.y += dy * 0.0008;

      // 自律移動（緩やかな回転）
      p.angle += 0.02;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // 境界折り返し
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      // 幾何学形状描画（ダークセクション用なのでlight colorを使用）
      const px = p.x * rect.width;
      const py = p.y * rect.height;
      ctx.fillStyle = `rgba(139, 192, 202, ${p.alpha * 0.8})`;
      if (p.shape === 'triangle') {
        drawParticleTriangle(px, py, p.size * 1.3);
        ctx.fill();
      } else if (p.shape === 'hexagon') {
        drawParticleHexagon(px, py, p.size * 1.1);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // マウスイベント
  const section = canvas.closest('.final-cta');
  if (section) {
    section.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top)  / rect.height;
    });
  }

  resize();
  requestAnimationFrame(loop);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
}

/* =============================================
   11. マグネティックボタン
   マウスに吸いつくようにボタンが微動する
   ============================================= */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-cta-primary, .btn-nav-primary');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s var(--ease-reveal, cubic-bezier(0.22, 1, 0.36, 1))';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

/* =============================================
   12. カードホバーグロー追従
   マウス位置に合わせてグロー光が追従する
   ============================================= */
function initCardGlowFollow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.features__card');

  cards.forEach(card => {
    // グローエレメント生成
    const glow = document.createElement('div');
    glow.className = 'features__card-glow';
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    });
  });

  // Testimonials カードにもチルト効果
  const tCards = document.querySelectorAll('.testimonials__card');
  tCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) scale(1.01) perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-reveal, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow 0.4s';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* =============================================
   13. セクションパララックス
   背景装飾をスクロールに連動して微妙にずらす
   ============================================= */
function initSectionParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 装飾要素ごとに速度を差別化（奥行き感）
  const parallaxEls = [
    // Hero
    { el: document.querySelector('.hero__glow-tl'), speed: 0.03 },
    { el: document.querySelector('.hero__glow-br'), speed: -0.02 },
    { el: document.querySelector('.hero__glow-tr'), speed: 0.04 },
    // Solution
    { el: document.querySelector('.solution__glow'), speed: 0.04 },
    { el: document.querySelector('.solution__deco'), speed: -0.025 },   // 六角形: 中景
    // Results
    { el: document.querySelector('.results__flow-svg'), speed: 0.02 },  // SVGライン: 後景
    // Features
    { el: document.querySelector('.features__deco'), speed: -0.06 },    // 三角形: 前景
    // Testimonials
    { el: document.querySelector('.testimonials__deco'), speed: 0.02 }, // ドット: 後景
  ].filter(p => p.el);

  if (!parallaxEls.length) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* =============================================
   14. Features 3D Tilt（v11追加）
   mousemove で perspective rotate
   ============================================= */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  const cards = document.querySelectorAll('.features__card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        perspective(1000px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateY(-6px)
        scale(1.01)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-reveal)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* =============================================
   15. Flow タイムライン スクロール連動（v11追加）
   viewportCenter とコンテナ位置から progress を計算
   ============================================= */
function initFlowTimelineScroll() {
  const timelineSteps = document.querySelectorAll('.flow__step');
  const flowSection = document.querySelector('.flow');
  if (!timelineSteps.length || !flowSection) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const updateTimeline = () => {
    const containerRect = flowSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;

    const sectionProgress = Math.max(0, Math.min(1,
      (viewportCenter - containerRect.top) / containerRect.height
    ));

    timelineSteps.forEach((step, i) => {
      const stepProgress = (i + 1) / timelineSteps.length;
      const dot = step.querySelector('.flow__step-dot');
      const line = step.querySelector('.flow__step-line');

      if (sectionProgress >= stepProgress * 0.8) {
        if (dot) {
          dot.style.borderColor = 'var(--c-primary)';
          dot.style.boxShadow = '0 0 12px rgba(var(--c-primary-rgb), 0.35)';
          dot.style.transform = 'scale(1.2)';
        }
      } else {
        if (dot) {
          dot.style.borderColor = '';
          dot.style.boxShadow = '';
          dot.style.transform = '';
        }
      }

      if (line) {
        const lineProgress = Math.max(0, Math.min(1,
          (sectionProgress - stepProgress * 0.6) / 0.3
        ));
        line.style.transform = `scaleY(${lineProgress})`;
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateTimeline();
}

/* =============================================
   16. FAQ アコーディオン スムーズ height 遷移（v11追加）
   details のネイティブ開閉をJSでオーバーライド
   ============================================= */
function initFaqSmoothAccordion() {
  const items = document.querySelectorAll('.faq__item');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  items.forEach(item => {
    const summary = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!summary || !answer) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (item.open) {
        const startHeight = answer.offsetHeight;
        answer.style.maxHeight = startHeight + 'px';
        answer.style.opacity = '1';

        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          answer.style.paddingBottom = '0';
        });

        answer.addEventListener('transitionend', function handler() {
          item.open = false;
          answer.style.maxHeight = '';
          answer.style.opacity = '';
          answer.style.paddingBottom = '';
          answer.removeEventListener('transitionend', handler);
        }, { once: true });
      } else {
        item.open = true;
        const targetHeight = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';

        requestAnimationFrame(() => {
          answer.style.maxHeight = targetHeight + 'px';
          answer.style.opacity = '1';
        });

        answer.addEventListener('transitionend', function handler() {
          answer.style.maxHeight = '';
          answer.removeEventListener('transitionend', handler);
        }, { once: true });
      }
    });
  });
}

/* =============================================
   17. Heroテキスト文字分割アニメーション
   H1の各文字を個別にフェードイン
   ============================================= */
function initHeroTextSplit() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const title = document.getElementById('hero-title');
  if (!title) return;

  // HTMLのbrを保持しつつ文字分割
  const html = title.innerHTML;
  const fragments = html.split(/(<br\s*\/?>)/);

  let charIndex = 0;
  const newHTML = fragments.map(frag => {
    if (frag.match(/<br\s*\/?>/)) return frag;
    return frag.split('').map(char => {
      if (char === ' ') return ' ';
      const span = `<span class="hero-char" style="opacity:0;display:inline-block;transform:translateY(20px);transition:opacity 0.5s ${charIndex * 0.03}s,transform 0.5s ${charIndex * 0.03}s var(--ease-reveal,cubic-bezier(0.22,1,0.36,1))">${char}</span>`;
      charIndex++;
      return span;
    }).join('');
  }).join('');

  title.innerHTML = newHTML;

  // data-reveal の代わりに独自のリビールを使用
  title.closest('[data-reveal]')?.classList.add('is-visible');
  title.style.opacity = '1';
  title.style.transform = 'none';

  // 少し遅延して文字をアニメーション
  setTimeout(() => {
    title.querySelectorAll('.hero-char').forEach(span => {
      span.style.opacity = '1';
      span.style.transform = 'none';
    });
  }, 300);
}

/* =============================================
   15. スムースアンカースクロール
   ネイティブのscroll-behaviorに加えてoffset調整
   ============================================= */
function initSmoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =============================================
   16. Header ダークモード切替
   ダークセクション（CTA Strip, Final CTA, Footer）上で
   ヘッダーをダークテーマに切り替える
   ============================================= */
function initHeaderDarkMode() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // ダークセクション: CTA Strip, Final CTA, Footer
  const darkSections = document.querySelectorAll('.cta-strip, .final-cta, .site-footer');
  if (!darkSections.length) return;

  const checkDarkMode = () => {
    const headerBottom = header.getBoundingClientRect().bottom;
    let isDark = false;

    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // ヘッダーの下端がダークセクション内にある場合
      if (rect.top < headerBottom && rect.bottom > 0) {
        isDark = true;
      }
    });

    header.classList.toggle('is-dark', isDark);
  };

  window.addEventListener('scroll', checkDarkMode, { passive: true });
  checkDarkMode();
}
