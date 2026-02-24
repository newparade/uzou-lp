/**
 * UZOU LP v13 — script.js
 * "Crystal Immersion" concept
 * グラフィック・アニメーション・インタラクション超過密
 *
 * 目次:
 * 1. 初期化エントリポイント
 * 2. ユーティリティ: reduced-motion判定
 * 3. カスタムカーソル（ドット + リング追従）
 * 4. グローバル背景Canvas（幾何学ワイヤーフレーム）
 * 5. Header（スクロール検知 + ダークセクション検知）
 * 6. モバイルメニュー（フォーカストラップ + ESCキー）
 * 7. スクロール進捗バー
 * 8. スクロールリビール（IntersectionObserver）
 * 9. Hero テキスト分割アニメーション
 * 10. Hero マウスグロー追従 + 結晶3Dチルト
 * 11. Canvas: 結晶パーティクル（Hero）
 * 12. Problem タブ切替
 * 13. Canvas: Problem 混沌パーティクル
 * 14. Scale カウントアップ
 * 15. Scale トレンドライン描画
 * 16. About 接続線 SVG ストローク描画
 * 17. Features アニメーション群（ニューラルネットワーク / ノード増殖 / ワークフロー）
 * 18. Voices カルーセル（ドラッグスクロール + 自動スクロール）
 * 19. Canvas: CTA Mid パーティクル
 * 20. Flow アコーディオン
 * 21. FAQ スムースアコーディオン
 * 22. カード3Dチルト
 * 23. マグネティックボタン
 * 24. スムースアンカー
 * 25. Canvas: Final CTA 結晶集合パーティクル
 * 26. 固定CTAバー
 * 27. スクロール連動パララックス（全セクション浮遊装飾）
 */

/* =============================================
   1. 初期化
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initGlobalCanvas();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initScrollReveal();
  initHeroTextSplit();
  initMouseGlow();
  initCrystalParticles();
  initProblemTabs();
  initChaosCanvas();
  initCountUp();
  initScaleTrendLines();
  initAboutDiagram();
  initFeaturesAnimations();
  initVoicesCarousel();
  initCtaCanvas();
  initFlowAccordion();
  initFaqAccordion();
  initCardTilt();
  initMagneticButtons();
  initSmoothAnchor();
  initFinalCanvas();
  initStickyCta();
  initParallax();
});

/* =============================================
   2. Reduced-motion ユーティリティ
   ============================================= */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* =============================================
   3. カスタムカーソル
   ============================================= */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || prefersReducedMotion()) return;

  // タッチ端末では非表示
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  if (!dot || !ring) return;

  // JSが有効な環境のみカーソル非表示（a11yフォールバック）
  document.body.classList.add('has-custom-cursor');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let animId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // ホバー要素検知
  const hoverTargets = 'a, button, [role="tab"], details summary, .btn, .glass-card, .header__cta, .header__contact, input, textarea';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('is-hovering');
    }
  });

  function animate() {
    animId = requestAnimationFrame(animate);

    // ドットは即座に追従
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    // リングは遅延追従（lerp）
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  }

  // カーソルの初期位置を非表示にしておく
  cursor.style.opacity = '0';
  document.addEventListener('mousemove', function show() {
    cursor.style.opacity = '1';
    document.removeEventListener('mousemove', show);
  });

  animate();

  // 画面外離脱
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

/* =============================================
   4. グローバル背景Canvas（幾何学ワイヤーフレーム）
   ============================================= */
function initGlobalCanvas() {
  const canvas = document.getElementById('global-canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let points = [];
  let animId;
  let lastTime = 0;
  const FPS_INTERVAL = 1000 / 20; // 低FPSで負荷軽減

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    generatePoints();
  }

  function generatePoints() {
    points = [];
    const spacing = 120;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          baseX: i * spacing,
          baseY: j * spacing,
          x: i * spacing + (Math.random() - 0.5) * 30,
          y: j * spacing + (Math.random() - 0.5) * 30,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0005,
          amplitude: 8 + Math.random() * 12,
        });
      }
    }
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    if (time - lastTime < FPS_INTERVAL) return;
    lastTime = time;

    ctx.clearRect(0, 0, w, h);

    // ポイントを更新
    points.forEach(p => {
      p.x = p.baseX + Math.sin(time * p.speed + p.phase) * p.amplitude;
      p.y = p.baseY + Math.cos(time * p.speed * 0.7 + p.phase) * p.amplitude * 0.6;
    });

    // 近い点同士を接続線で結ぶ
    const maxDist = 160;
    ctx.strokeStyle = 'rgba(139, 192, 202, 0.06)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = dx * dx + dy * dy;
        if (dist < maxDist * maxDist) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // ポイント描画
    ctx.fillStyle = 'rgba(139, 192, 202, 0.08)';
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  resize();
  animId = requestAnimationFrame(animate);
  window.addEventListener('resize', resize);

  // 非表示時停止
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      lastTime = 0;
      animId = requestAnimationFrame(animate);
    }
  });
}

/* =============================================
   5. Header
   ============================================= */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const darkSections = document.querySelectorAll('.problem, .cta-mid, .final-cta');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      header.classList.toggle('is-scrolled', scrollY > 40);

      // ダークセクション検知
      const headerBottom = header.getBoundingClientRect().bottom;
      let inDark = false;
      darkSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < headerBottom && rect.bottom > 0) inDark = true;
      });
      header.classList.toggle('is-dark', inDark);

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   6. モバイルメニュー
   ============================================= */
function initMobileMenu() {
  const btn = document.querySelector('.header__hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const focusableSelector = 'a, button, input, [tabindex]';
  let firstFocusable, lastFocusable;

  function open() {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusables = menu.querySelectorAll(focusableSelector);
    firstFocusable = focusables[0];
    lastFocusable = focusables[focusables.length - 1];
    if (firstFocusable) firstFocusable.focus();
  }

  function close() {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  // ESCキー
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
    }
  });

  // フォーカストラップ
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  // メニューリンクで閉じる
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* =============================================
   7. スクロール進捗バー
   ============================================= */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar || prefersReducedMotion()) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
      ticking = false;
    });
  }, { passive: true });
}

/* =============================================
   8. スクロールリビール
   ============================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   9. Hero テキスト分割アニメーション
   ============================================= */
function initHeroTextSplit() {
  const el = document.querySelector('[data-reveal="split"]');
  if (!el) return;

  if (prefersReducedMotion()) return;

  // HTMLをchar spanに分割（brは維持）
  const html = el.innerHTML;
  const parts = html.split(/(<br\s*\/?>)/gi);
  let newHtml = '';

  parts.forEach(part => {
    if (part.match(/<br\s*\/?>/i)) {
      newHtml += part;
    } else {
      for (const ch of part) {
        if (ch === ' ') {
          newHtml += ' ';
        } else {
          newHtml += `<span class="char">${ch}</span>`;
        }
      }
    }
  });

  el.innerHTML = newHtml;

  // ページロード後にアニメーション発火
  const baseDelay = parseInt(el.dataset.delay || 400, 10);
  const chars = el.querySelectorAll('.char');

  setTimeout(() => {
    chars.forEach((c, i) => {
      setTimeout(() => c.classList.add('is-visible'), i * 50);
    });
  }, baseDelay);
}

/* =============================================
   10. Hero マウスグロー追従 + 結晶3Dチルト
   ============================================= */
function initMouseGlow() {
  const glow = document.querySelector('.hero__mouse-glow');
  const hero = document.querySelector('.hero');
  const crystal = document.querySelector('.hero__crystal');
  if (!hero || prefersReducedMotion()) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // マウスグロー
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    }

    // 結晶画像3Dチルト
    if (crystal) {
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
      crystal.style.transform = `scale(1.05) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    if (glow) glow.style.opacity = '0';
    if (crystal) crystal.style.transform = 'scale(1.05)';
  });
}

/* =============================================
   11. Canvas: 結晶パーティクル（Hero）
   ============================================= */
function initCrystalParticles() {
  const canvas = document.getElementById('crystal-particles');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let particles = [];
  const COUNT = Math.min(40, Math.floor(window.innerWidth / 35));
  let lastTime = 0;
  const FPS_INTERVAL = 1000 / 30;
  let animId;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function createParticle() {
    const sides = Math.random() > 0.5 ? 6 : 5;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      size: Math.random() * 10 + 3,
      alpha: Math.random() * 0.18 + 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      sides: sides,
      color: Math.random() > 0.5 ? '139,192,202' : '52,98,111',
    };
  }

  function drawPolygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (Math.PI * 2 * i) / sides - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    const elapsed = time - lastTime;
    if (elapsed < FPS_INTERVAL) return;
    lastTime = time - (elapsed % FPS_INTERVAL);

    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.save();
      ctx.globalAlpha = p.alpha;

      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.fillStyle = `rgba(${p.color}, 0.3)`;
      ctx.fill();

      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.strokeStyle = `rgba(${p.color}, 0.6)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    });

    // 接続線
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 192, 202, ${0.10 * (1 - dist / 180)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(animate);
  }

  init();
  window.addEventListener('resize', () => { resize(); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      lastTime = 0;
      animId = requestAnimationFrame(animate);
    }
  });
}

/* =============================================
   12. Problem タブ切替
   ============================================= */
function initProblemTabs() {
  const tabs = document.querySelectorAll('.problem__tab');
  const panels = document.querySelectorAll('.problem__panel');
  if (!tabs.length) return;

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.classList.remove('is-active');
      p.hidden = true;
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) {
      panel.classList.add('is-active');
      panel.hidden = false;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // 矢印キーナビゲーション（WAI-ARIA Tabs パターン）
  const tabList = tabs[0]?.parentElement;
  if (tabList) {
    tabList.addEventListener('keydown', e => {
      const tabArr = Array.from(tabs);
      const idx = tabArr.indexOf(document.activeElement);
      if (idx === -1) return;

      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % tabArr.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + tabArr.length) % tabArr.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = tabArr.length - 1;
      }

      if (next !== -1) {
        e.preventDefault();
        activateTab(tabArr[next]);
      }
    });
  }
}

/* =============================================
   13. Canvas: Problem 混沌パーティクル
   ============================================= */
function initChaosCanvas() {
  const canvas = document.getElementById('chaos-canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [], animId;
  let lastTime = 0;
  const FPS_INTERVAL = 1000 / 30;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function create() {
    const count = Math.min(30, Math.floor(w / 50));
    particles = [];
    for (let i = 0; i < count; i++) {
      const sides = 3 + Math.floor(Math.random() * 4); // 三角形～六角形
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 8 + 2,
        alpha: Math.random() * 0.08 + 0.02,
        sides: sides,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        // 混沌: ランダムな方向変化
        dirChangeTimer: Math.random() * 200,
        dirChangeInterval: 100 + Math.random() * 200,
      });
    }
  }

  function drawPolygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (Math.PI * 2 * i) / sides - Math.PI / 2;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    if (time - lastTime < FPS_INTERVAL) return;
    lastTime = time;

    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      // 混沌的な方向変化
      p.dirChangeTimer++;
      if (p.dirChangeTimer > p.dirChangeInterval) {
        p.vx += (Math.random() - 0.5) * 0.4;
        p.vy += (Math.random() - 0.5) * 0.4;
        p.vx = Math.max(-1, Math.min(1, p.vx));
        p.vy = Math.max(-1, Math.min(1, p.vy));
        p.dirChangeTimer = 0;
      }

      // 境界ラップ
      if (p.x < -15) p.x = w + 15;
      if (p.x > w + 15) p.x = -15;
      if (p.y < -15) p.y = h + 15;
      if (p.y > h + 15) p.y = -15;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.strokeStyle = 'rgba(139,192,202,0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    });

    // 壊れた接続線（途切れ途切れ）
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.save();
          ctx.globalAlpha = 0.04 * (1 - dist / 150);
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(139,192,202,0.5)';
          ctx.lineWidth = 0.4;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // IntersectionObserverで表示時のみ起動
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resize(); create();
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
}

/* =============================================
   14. Scale カウントアップ
   ============================================= */
function initCountUp() {
  const numbers = document.querySelectorAll('.scale__number');
  if (!numbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => observer.observe(el));

  function animateNumber(el) {
    if (prefersReducedMotion()) return;

    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimal = parseInt(el.dataset.decimal || 0, 10);
    const duration = 2000;
    const start = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = target * easedProgress;

      el.textContent = prefix + (decimal > 0
        ? current.toFixed(decimal)
        : Math.floor(current)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }
}

/* =============================================
   15. Scale トレンドライン描画
   ============================================= */
function initScaleTrendLines() {
  const items = document.querySelectorAll('.scale__item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  items.forEach(item => observer.observe(item));
}

/* =============================================
   16. About SVG ストローク描画
   ============================================= */
function initAboutDiagram() {
  const diagram = document.querySelector('.about__diagram');
  if (!diagram) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        diagram.classList.add('is-visible');
        observer.unobserve(diagram);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(diagram);
}

/* =============================================
   17. Features アニメーション群
   ============================================= */
function initFeaturesAnimations() {
  initNeuralNetworkPulse();
  initNodeGrowth();
  initWorkflowHighlight();
}

// AI ニューラルネットワークのシナプス発火強調
function initNeuralNetworkPulse() {
  const visual = document.getElementById('feature-ai-visual');
  if (!visual || prefersReducedMotion()) return;

  const connections = visual.querySelectorAll('.features__ai-connections line');
  if (!connections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ランダムにシナプスを強調発火
        setInterval(() => {
          const idx = Math.floor(Math.random() * connections.length);
          const line = connections[idx];
          const origOpacity = line.getAttribute('opacity') || '0.3';
          line.style.opacity = '0.9';
          line.style.strokeWidth = '1.5';
          setTimeout(() => {
            line.style.opacity = origOpacity;
            line.style.strokeWidth = '';
          }, 300);
        }, 800);
        observer.unobserve(visual);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(visual);
}

// ノード増殖（Feature 02: ネットワーク）
function initNodeGrowth() {
  const svg = document.getElementById('node-svg');
  const countEl = document.getElementById('node-count');
  if (!svg || !countEl) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !prefersReducedMotion()) {
        growNodes();
        observer.unobserve(svg);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(svg);

  function growNodes() {
    let count = 5; // 初期ノード5個
    const maxNodes = 18;
    const interval = setInterval(() => {
      if (count >= maxNodes) { clearInterval(interval); return; }
      count++;
      countEl.textContent = count;

      const angle = (Math.PI * 2 * count) / maxNodes + Math.random() * 0.3;
      const dist = 35 + Math.random() * 50;
      const cx = 100 + Math.cos(angle) * dist;
      const cy = 100 + Math.sin(angle) * dist;
      const r = 3 + Math.random() * 4;

      // 接続線
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '100');
      line.setAttribute('y1', '100');
      line.setAttribute('x2', cx.toString());
      line.setAttribute('y2', cy.toString());
      line.setAttribute('stroke', 'rgba(139,192,202,0.25)');
      line.setAttribute('stroke-width', '0.5');
      line.style.opacity = '0';
      line.style.transition = 'opacity 0.4s';
      svg.appendChild(line);
      requestAnimationFrame(() => { line.style.opacity = '1'; });

      // ノード
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', r.toString());
      circle.setAttribute('fill', 'rgba(139,192,202,0.08)');
      circle.setAttribute('stroke', 'rgba(139,192,202,0.4)');
      circle.setAttribute('stroke-width', '0.8');
      circle.style.opacity = '0';
      circle.style.transition = 'opacity 0.5s';
      svg.appendChild(circle);
      requestAnimationFrame(() => { circle.style.opacity = '1'; });
    }, 350);
  }
}

// ワークフローステップハイライト（Feature 03）
function initWorkflowHighlight() {
  const flow = document.getElementById('feature-flow');
  if (!flow) return;

  const steps = flow.querySelectorAll('.features__wf-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !prefersReducedMotion()) {
        let i = 0;
        const interval = setInterval(() => {
          steps.forEach(s => s.classList.remove('is-active'));
          steps[i].classList.add('is-active');
          i = (i + 1) % steps.length;
        }, 2000);
        observer.unobserve(flow);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(flow);
}

/* =============================================
   18. Voices カルーセル
   ============================================= */
function initVoicesCarousel() {
  const carousel = document.querySelector('.voices__carousel');
  if (!carousel) return;

  let isDown = false;
  let startX, scrollLeft;

  carousel.addEventListener('mousedown', e => {
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => { isDown = false; carousel.style.cursor = 'grab'; });
  carousel.addEventListener('mouseup', () => { isDown = false; carousel.style.cursor = 'grab'; });
  carousel.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // 自動スクロール
  if (!prefersReducedMotion()) {
    let autoScrollId;
    function startAutoScroll() {
      autoScrollId = setInterval(() => {
        carousel.scrollBy({ left: 1, behavior: 'auto' });
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2) {
          carousel.scrollLeft = 0;
        }
      }, 30);
    }
    function stopAutoScroll() { clearInterval(autoScrollId); }

    startAutoScroll();
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
    carousel.addEventListener('touchend', () => setTimeout(startAutoScroll, 3000));
  }
}

/* =============================================
   19. Canvas: CTA Mid パーティクル
   ============================================= */
function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [], animId;
  let lastTime = 0;
  const FPS_INTERVAL = 1000 / 30;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function create() {
    const count = Math.min(25, Math.floor(w / 50));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 6 + 2,
        alpha: Math.random() * 0.1 + 0.02,
        sides: Math.random() > 0.5 ? 6 : 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
      });
    }
  }

  function drawPolygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (Math.PI * 2 * i) / sides - Math.PI / 2;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    if (time - lastTime < FPS_INTERVAL) return;
    lastTime = time;

    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.strokeStyle = 'rgba(139,192,202,0.5)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resize(); create();
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
}

/* =============================================
   20. Flow アコーディオン
   ============================================= */
function initFlowAccordion() {
  const toggles = document.querySelectorAll('.flow__toggle');
  if (!toggles.length) return;

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const detail = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!detail) return;

      if (expanded) {
        toggle.setAttribute('aria-expanded', 'false');
        detail.hidden = true;
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        detail.hidden = false;
      }
    });
  });

  // タイムラインのドット活性化
  const steps = document.querySelectorAll('.flow__step');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
}

/* =============================================
   21. FAQ スムースアコーディオン
   ============================================= */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!summary || !answer) return;

    summary.addEventListener('click', e => {
      e.preventDefault();

      if (item.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          answer.style.paddingBottom = '0';
          answer.style.overflow = 'hidden';
          answer.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding-bottom 0.4s';
        });
        setTimeout(() => { item.open = false; answer.style = ''; }, 400);
      } else {
        item.open = true;
        const h = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(() => {
          answer.style.maxHeight = h + 'px';
        });
        setTimeout(() => { answer.style = ''; }, 400);
      }
    });
  });
}

/* =============================================
   22. カード3Dチルト
   ============================================= */
function initCardTilt() {
  if (prefersReducedMotion()) return;

  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -6;
      const tiltY = (x - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =============================================
   23. マグネティックボタン
   ============================================= */
function initMagneticButtons() {
  if (prefersReducedMotion()) return;

  const btns = document.querySelectorAll('.btn--magnetic');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* =============================================
   24. スムースアンカー
   ============================================= */
function initSmoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
}

/* =============================================
   25. Canvas: Final CTA 結晶集合パーティクル
   ============================================= */
function initFinalCanvas() {
  const canvas = document.getElementById('final-canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [], animId;
  let lastTime = 0;
  const FPS_INTERVAL = 1000 / 30;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function create() {
    const count = Math.min(35, Math.floor(w / 45));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        targetX: w / 2 + (Math.random() - 0.5) * 200,
        targetY: h / 2 + (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 8 + 3,
        alpha: Math.random() * 0.12 + 0.03,
        sides: Math.random() > 0.4 ? 6 : 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawPolygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (Math.PI * 2 * i) / sides - Math.PI / 2;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    if (time - lastTime < FPS_INTERVAL) return;
    lastTime = time;

    ctx.clearRect(0, 0, w, h);
    const t = time * 0.001;

    particles.forEach(p => {
      p.x += p.vx + Math.sin(t + p.phase) * 0.2;
      p.y += p.vy + Math.cos(t + p.phase) * 0.15;
      p.rotation += p.rotSpeed;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      ctx.save();
      ctx.globalAlpha = p.alpha;
      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.fillStyle = 'rgba(139,192,202,0.15)';
      ctx.fill();
      drawPolygon(p.x, p.y, p.size, p.sides, p.rotation);
      ctx.strokeStyle = 'rgba(139,192,202,0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    });

    // 接続線
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,192,202,${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resize(); create();
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
}

/* =============================================
   26. 固定CTAバー
   ============================================= */
function initStickyCta() {
  const stickyCta = document.querySelector('.sticky-cta');
  if (!stickyCta) return;

  // タブレット以下のみ表示
  if (window.innerWidth > 1024) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
}

/* =============================================
   27. スクロール連動パララックス（全浮遊装飾）
   ============================================= */
function initParallax() {
  if (prefersReducedMotion()) return;

  // 全セクションの浮遊装飾を収集
  const parallaxConfigs = [
    { selector: '.hero__float--1', speed: 0.12 },
    { selector: '.hero__float--2', speed: -0.08 },
    { selector: '.hero__float--3', speed: 0.1 },
    { selector: '.hero__float--5', speed: -0.06 },
    { selector: '.hero__float--7', speed: 0.07 },
    { selector: '.about__crystal-frag', speed: 0.15 },
    { selector: '.about__deco--1', speed: -0.08 },
    { selector: '.trust__deco--left', speed: 0.06 },
    { selector: '.trust__deco--right', speed: -0.05 },
    { selector: '.problem__deco--1', speed: 0.1 },
    { selector: '.problem__deco--2', speed: -0.08 },
    { selector: '.scale__deco--1', speed: 0.07 },
    { selector: '.scale__deco--2', speed: -0.06 },
    { selector: '.features__deco--1', speed: -0.1 },
    { selector: '.features__deco--2', speed: 0.08 },
    { selector: '.voices__deco--1', speed: 0.06 },
    { selector: '.cta-mid__deco--1', speed: 0.08 },
    { selector: '.cta-mid__deco--2', speed: -0.06 },
    { selector: '.flow__deco--1', speed: 0.07 },
    { selector: '.faq__deco--1', speed: -0.05 },
    { selector: '.final-cta__deco--1', speed: 0.09 },
    { selector: '.final-cta__deco--2', speed: -0.07 },
  ];

  const parallaxElements = parallaxConfigs
    .map(cfg => ({ el: document.querySelector(cfg.selector), speed: cfg.speed }))
    .filter(item => item.el);

  if (!parallaxElements.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(({ el, speed }) => {
        const parent = el.closest('section') || el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const offset = (scrollY - parent.offsetTop) * speed;
          el.style.transform = `translateY(${offset}px) rotate(${offset * 0.03}deg)`;
        }
      });
      ticking = false;
    });
  }, { passive: true });
}
