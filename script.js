/**
 * UZOU LP v10 — script.js
 * "接続の闇市場" concept by creative-director
 * 実装: asset-assembler
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
      radius: 18,
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
      // 外グロー（六角形）
      const outerGlow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 3
      );
      outerGlow.addColorStop(0, 'rgba(139, 192, 202, 0.15)');
      outerGlow.addColorStop(1, 'rgba(139, 192, 202, 0)');
      ctx.fillStyle = outerGlow;
      drawHexagon(node.x, node.y, node.radius * 3);
      ctx.fill();

      // コア本体（六角形）
      const coreGrad = ctx.createRadialGradient(
        node.x - 3, node.y - 3, 0,
        node.x, node.y, node.radius * pulseFactor
      );
      coreGrad.addColorStop(0, 'rgba(139, 192, 202, 0.9)');
      coreGrad.addColorStop(1, 'rgba(52, 98, 111, 0.7)');
      ctx.fillStyle = coreGrad;
      drawHexagon(node.x, node.y, node.radius * pulseFactor);
      ctx.fill();

      // リング（六角形）
      ctx.strokeStyle = 'rgba(139, 192, 202, 0.5)';
      ctx.lineWidth = 1;
      drawHexagon(node.x, node.y, node.radius * pulseFactor + 6);
      ctx.stroke();

    } else if (node.type === 'adv') {
      // 広告主ノード: 偶数=三角形、奇数=六角形
      const idx = parseInt(node.id.split('-')[1], 10);
      ctx.fillStyle = `rgba(52, 98, 111, ${0.6 + Math.sin(time * 0.001 + node.pulsePhase) * 0.2})`;
      if (idx % 2 === 0) {
        drawTriangle(node.x, node.y, node.radius);
      } else {
        drawHexagon(node.x, node.y, node.radius);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();

    } else if (node.type === 'media') {
      // メディアノード: 0,3=六角形、1,4=三角形、2,5,6=円
      const idx = parseInt(node.id.split('-')[1], 10);
      if (activeConnections.has(node.id)) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(139, 192, 202, 0.5)';
      }
      ctx.fillStyle = `rgba(139, 192, 202, ${0.5 + Math.sin(time * 0.0015 + node.pulsePhase) * 0.15})`;
      if (idx % 3 === 0) {
        drawHexagon(node.x, node.y, node.radius);
      } else if (idx % 3 === 1) {
        drawTriangle(node.x, node.y, node.radius);
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 192, 202, 0.6)';
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
        const flowAlpha = 0.6 + Math.sin(time * 0.004) * 0.25;
        ctx.strokeStyle = `rgba(139, 192, 202, ${alpha * flowAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(139, 192, 202, 0.4)';
      } else {
        ctx.strokeStyle = `rgba(43, 73, 84, ${alpha * 0.6})`;
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

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setInterval(randomize, 1800);
      obs.unobserve(chart);
    }
  }, { threshold: 0.5 });
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

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        steps[0].classList.add('is-active');
        return;
      }
      highlight();
      setInterval(highlight, 1200);
      obs.unobserve(flow);
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

  function loop() {
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

      // 幾何学形状描画
      const px = p.x * rect.width;
      const py = p.y * rect.height;
      ctx.fillStyle = `rgba(139, 192, 202, ${p.alpha})`;
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

    requestAnimationFrame(loop);
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
