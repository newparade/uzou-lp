/* ============================================================
   UZOU LP v9 — Geometric Flow
   全インタラクション・アニメーション
   ============================================================ */
'use strict';

/* ---- 定数 ---- */
const EASE = [.16, 1, .3, 1];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. Canvasパーティクル — 幾何学的ノード&ライン
   広告主×メディアの接続を暗喩する幾何学ネットワーク
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || REDUCED) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles, animId, lastFrameTime = 0;
  const COUNT = 80;
  const CONNECT_DIST = 200;
  const SPEED = 0.45;
  const FPS_INTERVAL = 1000 / 30; /* 30fpsに制限（パフォーマンス最適化） */

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        size: Math.random() * 3.5 + 2.5,
        /* ティール系の色バリエーション */
        hue: 190 + Math.random() * 20,
        alpha: Math.random() * 0.4 + 0.25
      });
    }
  }

  function draw(timestamp) {
    animId = requestAnimationFrame(draw);
    /* 30fps制限 */
    if (timestamp && timestamp - lastFrameTime < FPS_INTERVAL) return;
    lastFrameTime = timestamp || 0;

    ctx.clearRect(0, 0, w, h);

    /* ライン描画 */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.strokeStyle = `rgba(139, 192, 202, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* ノード描画 */
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      /* 画面端でバウンス */
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle = `rgba(139, 192, 202, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resize();
  createParticles();
  animId = requestAnimationFrame(draw);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  /* ヒーローが見えなくなったら描画を止める */
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0 });
  heroObserver.observe(canvas.parentElement);
}


/* ============================================================
   2. スクロールアニメーション（IntersectionObserver）
   .reveal 要素のフェードイン + スタッガー
   ============================================================ */
function initReveal() {
  if (REDUCED) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ============================================================
   3. カウントアップ（Results数値）
   ============================================================ */
function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      if (!isFinite(target) || isNaN(decimal)) return;
      const duration = 2200;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        /* easeOutExpo */
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = (target * eased).toFixed(decimal);
        if (progress < 1) requestAnimationFrame(update);
      }

      if (!REDUCED) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimal);
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  els.forEach(el => observer.observe(el));
}


/* ============================================================
   4. ヘッダー — スクロール時の背景変化
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================================
   5. ハンバーガーメニュー
   ============================================================ */
function initBurger() {
  const burger = document.getElementById('headerBurger');
  const nav = document.getElementById('headerNav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ナビリンクをクリックしたらメニューを閉じる */
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ESCキーでメニューを閉じる */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }
  });
}


/* ============================================================
   6. 固定CTAバー — Hero通過後に表示
   ============================================================ */
function initStickyCta() {
  const bar = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(([entry]) => {
    bar.classList.toggle('is-visible', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(hero);
}


/* ============================================================
   7. マグネティックボタン
   CTA ボタンがマウスに吸い付くインタラクション
   ============================================================ */
function initMagnetic() {
  if (REDUCED || 'ontouchstart' in window) return;

  document.querySelectorAll('.btn--primary, .btn--white').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      btn.style.transition = 'transform 0.1s ease-out';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.45s cubic-bezier(.16,1,.3,1)';
    });
  });
}


/* ============================================================
   8. バーチャートアニメーション
   Feature03のバーが画面内に入ったら成長
   ============================================================ */
function initBarChart() {
  const bars = document.querySelectorAll('.feature__bar');
  if (!bars.length) return;

  const chart = bars[0].closest('.feature__bar-chart');
  if (!chart) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      bars.forEach(bar => bar.classList.add('animate'));
      observer.unobserve(chart);
    }
  }, { threshold: 0.3 });

  observer.observe(chart);
}


/* ============================================================
   9. FAQアコーディオン — アニメーション付き
   <details> のネイティブ動作にCSS transitionを補助
   ============================================================ */
function initFaq() {
  document.querySelectorAll('.faq__item').forEach(item => {
    const summary = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!summary || !answer) return;

    let isAnimating = false;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAnimating) return;
      isAnimating = true;

      if (item.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
        });
        answer.addEventListener('transitionend', () => {
          item.open = false;
          answer.style.maxHeight = '';
          answer.style.opacity = '';
          isAnimating = false;
        }, { once: true });
      } else {
        item.open = true;
        const h = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease';
        requestAnimationFrame(() => {
          answer.style.maxHeight = h + 'px';
          answer.style.opacity = '1';
        });
        answer.addEventListener('transitionend', () => {
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.transition = '';
          isAnimating = false;
        }, { once: true });
      }
    });
  });
}


/* ============================================================
   10. テキストスタガー — ヒーロータイトルの1行ずつ表示
   ============================================================ */
function initHeroTextReveal() {
  if (REDUCED) return;

  const lines = document.querySelectorAll('.hero__title-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(24px)';
    line.style.transition = `opacity .7s cubic-bezier(.16,1,.3,1) ${i * 0.18 + 0.3}s, transform .7s cubic-bezier(.16,1,.3,1) ${i * 0.18 + 0.3}s`;
  });

  /* ページ読み込み完了後にアニメーション開始 */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    });
  });

  /* サブテキスト・バッジ等もフェードイン */
  const heroEls = [
    '.hero__badges',
    '.hero__subtitle',
    '.hero__cta',
    '.hero__trust'
  ];
  heroEls.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity .6s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.12}s, transform .6s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  /* ダッシュボードモック */
  const dash = document.querySelector('.hero__dashboard');
  if (dash) {
    dash.style.opacity = '0';
    dash.style.transform = 'perspective(900px) rotateY(-3deg) rotateX(1.5deg) translateY(20px)';
    dash.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1) .4s, transform .9s cubic-bezier(.16,1,.3,1) .4s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dash.style.opacity = '1';
        dash.style.transform = 'perspective(900px) rotateY(-3deg) rotateX(1.5deg) translateY(0)';
      });
    });
  }
}


/* ============================================================
   11. スムーズスクロール — アンカーリンク
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !/^#[a-zA-Z0-9_-]+$/.test(href)) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10);
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============================================================
   12. Flowタイムライン — 接続線のアニメーション
   ============================================================ */
function initFlowTimeline() {
  const timeline = document.querySelector('.flow__timeline');
  if (!timeline || REDUCED) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      timeline.classList.add('is-animated');
      observer.unobserve(timeline);
    }
  }, { threshold: 0.2 });

  observer.observe(timeline);
}


/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initReveal();
  initCountUp();
  initHeader();
  initBurger();
  initStickyCta();
  initMagnetic();
  initBarChart();
  initFaq();
  initHeroTextReveal();
  initSmoothScroll();
  initFlowTimeline();
});
