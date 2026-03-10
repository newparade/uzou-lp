/**
 * UZOU LP - proposal1
 * Vanilla JS: アニメーション・インタラクション
 */

// ========================================
// prefers-reduced-motion 判定
// ========================================
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// スクロール進捗バー
// ========================================
(function initProgressBar() {
  var bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(to right,#34626F,#009A8B);z-index:9999;transition:none;pointer-events:none;';
  document.body.appendChild(bar);

  if (prefersReducedMotion) { bar.style.display = 'none'; return; }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ========================================
// ヘッダー: スクロール検知でスタイル変更
// ========================================
(function initHeader() {
  var header = document.querySelector('.header');
  if (!header) return;

  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ========================================
// Hero: 段階的リビールアニメーション
// ========================================
(function initHeroReveal() {
  var headline = document.querySelector('.hero__headline');
  var sub = document.querySelector('.hero__sub');
  var badges = document.querySelector('.hero__badges');
  var cta = document.querySelector('.hero__cta-group');
  var crystal = document.querySelector('.hero__crystal');

  if (!headline) return;

  if (prefersReducedMotion) {
    [headline, sub, badges, cta].forEach(function (el) {
      if (el) el.classList.add('is-revealed');
    });
    if (crystal) crystal.classList.add('is-revealed');
    return;
  }

  // 段階的に表示
  var els = [headline, sub, badges, cta].filter(Boolean);
  els.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';

    setTimeout(function () {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.classList.add('is-revealed');
    }, 200 + i * 150);
  });

  // クリスタル画像のスライドイン
  if (crystal) {
    crystal.style.opacity = '0';
    crystal.style.transform = 'translateX(40px) scale(0.95)';
    crystal.style.transition = 'opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)';

    setTimeout(function () {
      crystal.style.opacity = '1';
      crystal.style.transform = 'translateX(0) scale(1)';
      crystal.classList.add('is-revealed');
    }, 100);
  }
})();




// ========================================
// スクロールリビール（inline style方式 — CSS競合なし）
// Heroリビールと同じ手法: JSで直接style操作
// ========================================
(function initScrollReveal() {
  if (prefersReducedMotion) return;

  // アニメーション対象の定義
  var items = [
    // [セレクタ, from方向, delay(ms)]
    { sel: '.partners__heading', dir: 'up' },
    { sel: '.partners__grid', dir: 'up', delay: 100 },
    { sel: '.about__visual', dir: 'left', scale: true },
    { sel: '.about__content', dir: 'right' },
    { sel: '.problems__header', dir: 'up', scale: true },
    { sel: '.issues[aria-label="媒体主の課題リスト"]', dir: 'up', stagger: true },
    { sel: '.solutions[aria-label="媒体主向けソリューション"]', dir: 'up', stagger: true },
    { sel: '.issues[aria-label="広告主の課題リスト"]', dir: 'up', stagger: true },
    { sel: '.solutions[aria-label="広告主向けソリューション"]', dir: 'up', stagger: true },
    { sel: '.news-portal__columns', dir: 'up', stagger: true },
    { sel: '.cases__heading', dir: 'up' },
    { sel: '.cases__cards', dir: 'up', stagger: true },
    { sel: '.footer__brand', dir: 'up' },
    { sel: '.footer__nav', dir: 'up', delay: 150 }
  ];

  var easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

  function getFromStyle(dir, useScale) {
    var base = { opacity: '0' };
    switch (dir) {
      case 'up': base.transform = 'translateY(32px)' + (useScale ? ' scale(0.96)' : ''); break;
      case 'left': base.transform = 'translateX(-32px)' + (useScale ? ' scale(0.96)' : ''); break;
      case 'right': base.transform = 'translateX(32px)' + (useScale ? ' scale(0.96)' : ''); break;
      default: base.transform = 'translateY(32px)'; break;
    }
    return base;
  }

  function revealElement(el, dir, delay, useScale) {
    var from = getFromStyle(dir, useScale);
    el.style.opacity = from.opacity;
    el.style.transform = from.transform;
    el.style.transition = 'none';

    // 1フレーム待ってからtransitionを設定してアニメーション開始
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var dur = useScale ? '0.9s' : '0.7s';
        el.style.transition = 'opacity ' + dur + ' ' + easing + ', transform ' + dur + ' ' + easing;
        el.style.transitionDelay = (delay || 0) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) translateX(0) scale(1)';
      });
    });
  }

  function revealStagger(container, dir, useScale) {
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      revealElement(children[i], dir, i * 100, useScale);
    }
  }

  // 各ターゲットにobserverを設定
  items.forEach(function (item) {
    var el = document.querySelector(item.sel);
    if (!el) return;

    // 初期状態: 非表示にしない（observerが発火するまで通常表示）
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (item.stagger) {
          revealStagger(el, item.dir, item.scale);
        } else {
          revealElement(el, item.dir, item.delay || 0, item.scale);
        }
        observer.unobserve(el);
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    observer.observe(el);
  });
})();

// ========================================
// カウントアップ（バッジ数値）
// ========================================
(function initCountUp() {
  if (prefersReducedMotion) return;

  var numEl = document.querySelector('.badge__label-num');
  if (!numEl) return;

  var target = 90;
  var started = false;

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      var current = 0;
      var step = Math.ceil(target / 30);
      var interval = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        numEl.textContent = current + '%';
      }, 30);
      observer.unobserve(numEl);
    }
  }, { threshold: 0.5 });

  numEl.textContent = '0%';
  observer.observe(numEl);
})();

// ========================================
// パララックス: クリスタル画像の微小移動
// ========================================
(function initParallax() {
  if (prefersReducedMotion) return;

  var crystal = document.querySelector('.hero__crystal');
  var aboutVisual = document.querySelector('.about__visual');
  if (!crystal && !aboutVisual) return;

  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        if (crystal && scrollY < 1000) {
          crystal.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
        }

        if (aboutVisual) {
          var rect = aboutVisual.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            aboutVisual.style.transform = 'translateY(' + ((progress - 0.5) * -20) + 'px)';
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ========================================
// カード3Dチルトエフェクト（マウス追従）
// ========================================
(function initCardTilt() {
  if (prefersReducedMotion) return;

  var cards = document.querySelectorAll('.case-card, .solution');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-2px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

// ========================================
// マグネティックボタン（CTAボタン吸い付き）
// ========================================
(function initMagneticButtons() {
  if (prefersReducedMotion) return;

  var buttons = document.querySelectorAll('.btn--lg');
  buttons.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

// ========================================
// テキストハイライトアニメーション（サブコピー下線）
// ========================================
(function initHighlightReveal() {
  if (prefersReducedMotion) return;

  var highlights = document.querySelectorAll('.hero__sub-highlight');
  highlights.forEach(function (el, i) {
    var after = el.querySelector('::after');
    el.style.backgroundSize = '0% 2px';
    el.style.backgroundPosition = '0 100%';
    el.style.backgroundRepeat = 'no-repeat';

    setTimeout(function () {
      el.style.transition = 'background-size 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
      el.style.backgroundSize = '100% 2px';
    }, 800 + i * 200);
  });
})();

// ========================================
// スムーズスクロール（ヘッダー高さ考慮）
// ========================================
(function initSmoothScroll() {
  var header = document.querySelector('.header');

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var headerHeight = header ? header.offsetHeight : 80;
      var targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();
