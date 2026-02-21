# アートディレクション実装仕様書 — UZOU LP v10

**作成日**: 2026-02-22
**作成者**: art-director
**ステータス**: 確定版（asset-assembler実装用）

---

## 前提: コンセプト整合性の確認

creative-directorが確立したコンセプト「接続の闇市場」を、以下の3軸でビジュアルに翻訳する。

| コンセプト軸 | ビジュアル変換 |
|---|---|
| 深海の探査潜水艦 | `#0a1215` の深い暗色ベース + radial-gradient × ノイズ × アンビエントグローの3層 |
| 接続線は生きている | Canvas bezierCurveTo + stroke-dashoffset + ノードパルスアニメーション |
| 深海から光へのスクロール体験 | セクション背景をダーク→ライト→ダーク→ライトのリズムで設計 |

---

## Part 1: CSSデザイントークン（完全版）

asset-assemblerは `style.css` の冒頭に以下を配置する。

```css
/* =============================================
   UZOU LP v10 — デザイントークン
   "接続の闇市場" by creative-director
   ============================================= */
:root {
  /* ---- ブランドカラー（変更不可） ---- */
  --c-abyss:    #040404;   /* 深海の底: 最深背景、ページ全体の基底色 */
  --c-base:     #0a1215;   /* 深海: Hero・Results・Features・Footerの主背景 */
  --c-dark:     #1F353E;   /* 深淵: Solution・Flow・ダークカード背景 */
  --c-deep:     #2B4954;   /* フロー: グラデーション中間色・接続線色 */
  --c-primary:  #34626F;   /* 接触点: CTA Strip・ホバー・リンク */
  --c-light:    #8BC0CA;   /* 光/成果: グロー・数値強調・ホバー状態（全体5%上限） */

  /* ---- 拡張背景色 ---- */
  --bg-surface: #111c21;   /* カード・パネル内背景 */
  --bg-white:   #ffffff;   /* About・FAQ（ライトセクション） */
  --bg-tint:    #F0F7F8;   /* Testimonials・Flow（ライトティント） */
  --bg-tint2:   #E8F2F4;   /* Testimonialsグラデーション終点 */
  --bg-marquee: #0d1a1f;   /* Media Trust専用 */

  /* ---- テキスト（ダーク背景用） ---- */
  --t1-dark: #e2e8f0;                    /* 主テキスト（純白は使わない） */
  --t2-dark: rgba(226, 232, 240, 0.60); /* 副テキスト */
  --t3-dark: rgba(226, 232, 240, 0.38); /* ミュートテキスト */

  /* ---- テキスト（ライト背景用） ---- */
  --t1-light: #0a1a1f;   /* 主テキスト */
  --t2-light: #3d5a63;   /* 副テキスト */
  --t3-light: #6b8a92;   /* ミュートテキスト */

  /* ---- タイポグラフィスケール ---- */
  --font-display: 'Inter', sans-serif;
  --font-body:    'Noto Sans JP', sans-serif;

  --fs-display:  clamp(56px, 7vw, 88px);   /* Hero H1専用 */
  --fs-h1:       clamp(44px, 5.5vw, 68px); /* Final CTA H2 */
  --fs-h2:       clamp(30px, 3.5vw, 44px); /* 全セクション見出し */
  --fs-h3:       clamp(18px, 2vw, 24px);   /* カード見出し */
  --fs-body:     16px;
  --fs-caption:  12px;

  /* ---- フォントウェイト ---- */
  --fw-display: 900;  /* Inter Black — Hero H1のみ */
  --fw-h1:      800;  /* Inter ExtraBold */
  --fw-h2:      700;  /* Inter Bold */
  --fw-h3:      600;  /* Inter SemiBold */
  --fw-body:    400;  /* Noto Sans JP Regular */
  --fw-caption: 500;  /* Inter Medium */

  /* ---- レタースペーシング ---- */
  --ls-display: -0.05em;
  --ls-h1:      -0.04em;
  --ls-h2:      -0.03em;
  --ls-caption: 0.12em;   /* uppercase時 */

  /* ---- ラインハイト ---- */
  --lh-display: 1.0;
  --lh-heading: 1.2;
  --lh-body:    1.9;

  /* ---- ボーダー半径（階層的） ---- */
  --r-section: 0px;        /* セクション境界は直角 */
  --r-card:    16px;       /* カード */
  --r-inner:   12px;       /* カード内要素 */
  --r-button:  8px;        /* ボタン */
  --r-chip:    4px;        /* チップ・タグ */
  --r-full:    9999px;     /* バッジ・ピル */

  /* ---- ボーダー ---- */
  --border-dark:  1px solid rgba(255, 255, 255, 0.07); /* ダーク背景カード */
  --border-light: 1px solid rgba(10, 26, 31, 0.08);   /* ライト背景カード */
  --border-glow:  1px solid rgba(139, 192, 202, 0.20); /* ホバー時・強調 */

  /* ---- イージング ---- */
  --ease-reveal:    cubic-bezier(0.22, 1, 0.36, 1);   /* スクロールリビール */
  --ease-hover-in:  cubic-bezier(0.4, 0, 0.2, 1);     /* ホバーイン */
  --ease-hover-out: cubic-bezier(0.2, 0, 0, 1);       /* ホバーアウト */
  --ease-connect:   cubic-bezier(0, 0, 0.2, 1);       /* Canvas接続線 */

  /* ---- アニメーション時間 ---- */
  --dur-fast:   0.2s;
  --dur-normal: 0.4s;
  --dur-slow:   0.7s;
  --dur-reveal: 1.2s;

  /* ---- スタッガー ---- */
  --stagger: 80ms;

  /* ---- スペーシング ---- */
  --section-pad-xl: clamp(120px, 12vw, 180px); /* Hero・Final CTA */
  --section-pad-lg: clamp(80px, 9vw, 130px);   /* 標準セクション */
  --section-pad-md: clamp(60px, 6vw, 96px);    /* コンパクトセクション */
  --section-pad-sm: clamp(40px, 4vw, 64px);    /* Media Trust */
  --container:      1240px;
  --gutter:         clamp(20px, 5vw, 80px);

  /* ---- グロー効果 RGB分解（グロー計算用） ---- */
  --c-light-rgb: 139, 192, 202;
  --c-primary-rgb: 52, 98, 111;
}

/* ---- グローバルリセット ---- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--c-base);
  color: var(--t1-dark);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  overflow-x: hidden;
}

/* ---- セレクション色 ---- */
::selection {
  background: rgba(var(--c-light-rgb), 0.3);
  color: var(--t1-dark);
}

/* ---- スクロールバー ---- */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--c-abyss); }
::-webkit-scrollbar-thumb { background: var(--c-dark); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--c-deep); }

/* ---- フォーカスリング ---- */
:focus-visible {
  outline: 2px solid var(--c-light);
  outline-offset: 3px;
  border-radius: var(--r-chip);
}

/* ---- コンテナ ---- */
.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

/* ---- スクロールリビール基底 ---- */
[data-reveal] {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity var(--dur-slow) var(--ease-reveal),
    transform var(--dur-slow) var(--ease-reveal);
}
[data-reveal="left"] {
  transform: translateX(-48px);
}
[data-reveal="right"] {
  transform: translateX(48px);
}
[data-reveal="scale"] {
  transform: scale(0.95);
}
[data-reveal="blur"] {
  opacity: 0;
  filter: blur(12px);
  transform: translateY(16px);
  transition:
    opacity var(--dur-reveal) var(--ease-reveal),
    transform var(--dur-reveal) var(--ease-reveal),
    filter var(--dur-reveal) var(--ease-reveal);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
  filter: none;
}

/* ---- prefers-reduced-motion ---- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  [data-reveal] {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}

/* ---- セクションラベル（Caption）---- */
.section-label {
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--fs-caption);
  font-weight: var(--fw-caption);
  letter-spacing: var(--ls-caption);
  text-transform: uppercase;
  color: var(--c-light);
  margin-bottom: 20px;
}
.section-label--light {
  color: var(--c-primary);
}

/* ---- セクション見出し基底 ---- */
.section-title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: var(--fw-h2);
  letter-spacing: var(--ls-h2);
  line-height: var(--lh-heading);
  color: var(--t1-dark);
}
.section-title--light {
  color: var(--t1-light);
}

/* ---- グラデーション溶解セクション遷移 ---- */
.section-dissolve-bottom {
  position: relative;
}
.section-dissolve-bottom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  pointer-events: none;
  z-index: 1;
}
```

---

## Part 2: セクション別完全仕様

---

### SEC-00: Header（ガラスモーフィズムナビ）

**感情目標**: 没入感を壊さない透明な信頼感

**背景**: 初期 `transparent` → スクロール後 `rgba(10,18,21,0.88) + backdrop-filter: blur(24px)`

#### HTML骨格

```html
<header class="site-header" id="site-header" role="banner">
  <div class="container">
    <nav class="nav" aria-label="メインナビゲーション">

      <!-- ロゴ -->
      <a href="#" class="nav__logo" aria-label="UZOUトップへ">
        <span class="nav__logo-mark" aria-hidden="true">U</span>
        <span class="nav__logo-text">UZOU</span>
      </a>

      <!-- デスクトップリンク -->
      <ul class="nav__links" role="list">
        <li><a href="#about" class="nav__link">UZOUとは</a></li>
        <li><a href="#features" class="nav__link">特徴</a></li>
        <li><a href="#results" class="nav__link">実績</a></li>
        <li><a href="#flow" class="nav__link">導入の流れ</a></li>
        <li><a href="#faq" class="nav__link">FAQ</a></li>
      </ul>

      <!-- CTA群 -->
      <div class="nav__actions">
        <a href="#contact" class="nav__contact-link">お問い合わせ</a>
        <a href="#download" class="nav__cta btn-nav-primary">資料ダウンロード</a>
      </div>

      <!-- ハンバーガー（モバイル） -->
      <button class="nav__hamburger" aria-expanded="false" aria-controls="mobile-menu"
              aria-label="メニューを開く" type="button">
        <span class="nav__hamburger-line"></span>
        <span class="nav__hamburger-line"></span>
        <span class="nav__hamburger-line"></span>
      </button>
    </nav>
  </div>

  <!-- モバイルメニュー -->
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog"
       aria-label="ナビゲーションメニュー">
    <ul class="mobile-menu__links" role="list">
      <li><a href="#about" class="mobile-menu__link">UZOUとは</a></li>
      <li><a href="#features" class="mobile-menu__link">特徴</a></li>
      <li><a href="#results" class="mobile-menu__link">実績</a></li>
      <li><a href="#flow" class="mobile-menu__link">導入の流れ</a></li>
      <li><a href="#faq" class="mobile-menu__link">FAQ</a></li>
    </ul>
    <a href="#download" class="mobile-menu__cta">資料ダウンロード</a>
  </div>
</header>
```

#### CSS仕様

```css
/* --- Header --- */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0;
  transition: background var(--dur-normal) var(--ease-hover-in),
              box-shadow var(--dur-normal) var(--ease-hover-in);
}

.site-header.is-scrolled {
  background: rgba(10, 18, 21, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 1px 40px rgba(0, 0, 0, 0.4);
}

.nav {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 40px;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--t1-dark);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.nav__logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1.5px solid rgba(var(--c-light-rgb), 0.5);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 900;
  color: var(--c-light);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin-left: auto;
}

.nav__link {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  color: var(--t2-dark);
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;
  transition: color var(--dur-fast) var(--ease-hover-in);
}

.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--c-light);
  transition: width var(--dur-normal) var(--ease-reveal);
}

.nav__link:hover {
  color: var(--t1-dark);
}

.nav__link:hover::after {
  width: 100%;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.nav__contact-link {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  color: var(--t2-dark);
  text-decoration: none;
  transition: color var(--dur-fast);
}

.nav__contact-link:hover { color: var(--t1-dark); }

.btn-nav-primary {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: transparent;
  border: 1px solid rgba(var(--c-light-rgb), 0.35);
  border-radius: var(--r-button);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-light);
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease-hover-in),
    border-color var(--dur-fast) var(--ease-hover-in),
    box-shadow var(--dur-fast) var(--ease-hover-in),
    transform var(--dur-fast) var(--ease-hover-in);
}

.btn-nav-primary:hover {
  background: rgba(var(--c-light-rgb), 0.08);
  border-color: rgba(var(--c-light-rgb), 0.6);
  box-shadow: 0 0 16px rgba(var(--c-light-rgb), 0.15);
  transform: translateY(-1px);
}

/* モバイルハンバーガー */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
}

.nav__hamburger-line {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--t1-dark);
  transition: transform var(--dur-normal) var(--ease-reveal),
              opacity var(--dur-normal);
}

.nav__hamburger[aria-expanded="true"] .nav__hamburger-line:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.nav__hamburger[aria-expanded="true"] .nav__hamburger-line:nth-child(2) {
  opacity: 0;
}
.nav__hamburger[aria-expanded="true"] .nav__hamburger-line:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* モバイルメニュー */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0;
  background: rgba(10, 18, 21, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 24px var(--gutter) 32px;
  transform: translateY(-8px);
  opacity: 0;
  transition:
    transform var(--dur-normal) var(--ease-reveal),
    opacity var(--dur-normal) var(--ease-reveal);
}

.mobile-menu.is-open {
  display: flex;
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu__links { list-style: none; }

.mobile-menu__link {
  display: block;
  padding: 16px 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--t1-dark);
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.mobile-menu__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 14px 32px;
  background: var(--c-primary);
  color: #fff;
  border-radius: var(--r-button);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  text-align: center;
}

/* Fixed CTAバー（Hero通過後に表示） */
.fixed-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px var(--gutter);
  background: rgba(10, 18, 21, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255,255,255,0.08);
  transform: translateY(100%);
  transition: transform var(--dur-normal) var(--ease-reveal);
}

.fixed-cta-bar.is-visible {
  transform: translateY(0);
}

/* レスポンシブ */
@media (max-width: 1024px) {
  .nav__links { display: none; }
  .nav__actions { display: none; }
  .nav__hamburger { display: flex; }
}
```

#### JS仕様（script.js に追記）

```javascript
// --- Header スクロール検知 ---
function initHeader() {
  const header = document.getElementById('site-header');
  const fixedBar = document.querySelector('.fixed-cta-bar');
  const heroSection = document.getElementById('hero');

  const scrollHandler = () => {
    const scrollY = window.scrollY;

    // スクロール後の背景
    header.classList.toggle('is-scrolled', scrollY > 40);

    // Fixed CTAバー（Hero高さ通過後）
    if (heroSection && fixedBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      fixedBar.classList.toggle('is-visible', scrollY > heroBottom - 100);
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
}

// --- モバイルメニュー ---
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  const open = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.removeAttribute('aria-hidden');
    // フォーカストラップ
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

  // ESCキー
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });

  // モバイルリンクをクリックで閉じる
  menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', close);
  });
}
```

---

### SEC-01: Hero（最重要セクション）

**感情目標**: 「これは何だ？」衝撃・好奇心・「他と違う」

**背景**: `#0a1215` + グリッドライン + 2点アンビエントグロー（左上・右下）+ 薄いノイズ

**レイアウト**: スプリット2カラム（左テキスト 52% / 右Canvas 48%）

#### HTML骨格

```html
<section class="hero" id="hero" aria-labelledby="hero-title">

  <!-- 背景レイヤー（aria-hidden） -->
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__grid"></div>       <!-- グリッドライン -->
    <div class="hero__glow-tl"></div>    <!-- 左上アンビエントグロー -->
    <div class="hero__glow-br"></div>    <!-- 右下アンビエントグロー -->
    <div class="hero__noise"></div>      <!-- ノイズテクスチャ -->
  </div>

  <div class="container">
    <div class="hero__inner">

      <!-- 左カラム: テキスト -->
      <div class="hero__content">

        <!-- バッジ行 -->
        <div class="hero__badges" data-reveal data-reveal-delay="0">
          <span class="hero__badge">
            <span class="hero__badge-dot" aria-hidden="true"></span>
            IT Review LEADER 2025
          </span>
          <span class="hero__badge hero__badge--plain">
            東証スタンダード Speee
          </span>
        </div>

        <!-- ターゲット文 -->
        <p class="hero__target" data-reveal data-reveal-delay="0.05">
          広告代理店・Webメディアの方へ
        </p>

        <!-- H1メインコピー（Display） -->
        <h1 class="hero__title" id="hero-title" data-reveal data-reveal-delay="0.1">
          広告が、<br>メディアを救う。
        </h1>

        <!-- サブコピー -->
        <p class="hero__sub" data-reveal data-reveal-delay="0.18">
          500を超えるメディアが選んだ、接続の力。<br>
          広告主の成果と、メディアの収益を、同時に育てる。
        </p>

        <!-- CTA群 -->
        <div class="hero__cta" data-reveal data-reveal-delay="0.26">
          <a href="#download" class="btn-primary" id="hero-cta-primary">
            <span>資料をダウンロード</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="#contact" class="btn-ghost">お問い合わせ</a>
        </div>

        <!-- 安心3点 -->
        <ul class="hero__trust" data-reveal data-reveal-delay="0.32" role="list">
          <li class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            完全無料
          </li>
          <li class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            30秒で完了
          </li>
          <li class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            営業電話なし
          </li>
        </ul>
      </div>

      <!-- 右カラム: Connection Visualizer Canvas -->
      <div class="hero__visual" aria-hidden="true">
        <canvas class="hero__canvas" id="connection-canvas"
                role="img" aria-label="広告主とメディアの接続を表すインタラクティブ図">
        </canvas>
        <!-- Canvas説明ラベル（薄く表示） -->
        <div class="hero__canvas-label">
          <span class="hero__canvas-tag hero__canvas-tag--adv">ADVERTISERS</span>
          <span class="hero__canvas-tag hero__canvas-tag--uzou">UZOU</span>
          <span class="hero__canvas-tag hero__canvas-tag--media">MEDIA</span>
        </div>
      </div>

    </div>
  </div>

  <!-- 下部グラデーション溶解（Hero→Media Trust） -->
  <div class="hero__dissolve" aria-hidden="true"></div>
</section>
```

#### CSS仕様

```css
/* --- Hero --- */
.hero {
  position: relative;
  min-height: 100vh;
  background: var(--c-base);
  overflow: hidden;
  padding-top: 64px; /* header高さ分 */
}

/* 背景レイヤー */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* グリッドライン */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 60px 60px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 40%, transparent 100%);
}

/* 左上アンビエントグロー（2倍の存在感） */
.hero__glow-tl {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 60%;
  height: 70%;
  background: radial-gradient(ellipse at 30% 30%,
    rgba(var(--c-light-rgb), 0.12) 0%,
    rgba(var(--c-primary-rgb), 0.06) 40%,
    transparent 70%);
  animation: heroGlowFloat 18s ease-in-out infinite;
}

/* 右下アンビエントグロー */
.hero__glow-br {
  position: absolute;
  bottom: -10%;
  right: -5%;
  width: 55%;
  height: 65%;
  background: radial-gradient(ellipse at 70% 70%,
    rgba(var(--c-light-rgb), 0.08) 0%,
    rgba(var(--c-primary-rgb), 0.04) 40%,
    transparent 70%);
  animation: heroGlowFloat 24s ease-in-out infinite reverse;
}

/* ノイズ */
.hero__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 256px;
}

@keyframes heroGlowFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(3%, -2%) scale(1.05); }
  66% { transform: translate(-2%, 3%) scale(0.97); }
}

/* コンテンツレイアウト */
.hero__inner {
  display: grid;
  grid-template-columns: 52% 48%;
  align-items: center;
  min-height: calc(100vh - 64px);
  gap: 0;
  position: relative;
  z-index: 1;
}

/* 左カラム */
.hero__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: var(--section-pad-xl) 0 var(--section-pad-xl) 0;
}

/* バッジ */
.hero__badges {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: var(--r-full);
  border: 1px solid rgba(var(--c-light-rgb), 0.25);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 500;
  color: var(--c-light);
  letter-spacing: 0.04em;
}

.hero__badge--plain {
  color: var(--t3-dark);
  border-color: rgba(255,255,255,0.1);
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-light);
  box-shadow: 0 0 6px rgba(var(--c-light-rgb), 0.6);
  animation: badgePulse 2.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 6px rgba(var(--c-light-rgb), 0.6); }
  50% { box-shadow: 0 0 12px rgba(var(--c-light-rgb), 0.9); }
}

/* ターゲット文 */
.hero__target {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--t3-dark);
}

/* H1 — Display Typography */
.hero__title {
  font-family: var(--font-display);
  font-size: var(--fs-display);
  font-weight: var(--fw-display);
  letter-spacing: var(--ls-display);
  line-height: var(--lh-display);
  color: var(--t1-dark);
}

/* サブコピー */
.hero__sub {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.8;
  color: var(--t2-dark);
  max-width: 460px;
}

/* CTA群 */
.hero__cta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Primary ボタン（全セクション共通） */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 32px;
  background: #ffffff;
  color: var(--c-dark);
  border-radius: var(--r-button);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--dur-fast) var(--ease-hover-in),
    box-shadow var(--dur-fast) var(--ease-hover-in);
}

/* shimmerエフェクト */
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(var(--c-light-rgb), 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s var(--ease-connect);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(var(--c-light-rgb), 0.25);
}

.btn-primary:hover::after {
  transform: translateX(100%);
}

/* CTAパルス（3秒周期） */
@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--c-light-rgb), 0); }
  50% { box-shadow: 0 0 0 8px rgba(var(--c-light-rgb), 0.12); }
}
.btn-primary.has-pulse {
  animation: ctaPulse 3s ease-in-out infinite;
}

/* Ghost ボタン */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 24px;
  background: transparent;
  color: var(--t2-dark);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--r-button);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition:
    color var(--dur-fast),
    border-color var(--dur-fast),
    background var(--dur-fast),
    transform var(--dur-fast) var(--ease-hover-in);
}

.btn-ghost:hover {
  color: var(--t1-dark);
  border-color: rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.04);
  transform: translateY(-1px);
}

/* 安心3点 */
.hero__trust {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  flex-wrap: wrap;
}

.hero__trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--t3-dark);
}

.hero__trust-item svg { color: var(--c-light); flex-shrink: 0; }

/* 右カラム: Canvas */
.hero__visual {
  position: relative;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero__canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.hero__canvas-label {
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.hero__canvas-tag {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.4;
}

.hero__canvas-tag--adv { color: var(--t2-dark); }
.hero__canvas-tag--uzou { color: var(--c-light); opacity: 0.7; }
.hero__canvas-tag--media { color: var(--t2-dark); }

/* 下部溶解 */
.hero__dissolve {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140px;
  background: linear-gradient(to bottom, transparent, var(--bg-marquee));
  pointer-events: none;
  z-index: 2;
}

/* --- レスポンシブ --- */
@media (max-width: 1024px) {
  .hero__inner {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: var(--section-pad-lg) 0;
  }
  .hero__visual {
    height: 360px;
    order: -1;
    margin: 0 -var(--gutter);
  }
  .hero__content { gap: 20px; }
}

@media (max-width: 768px) {
  .hero__visual { height: 280px; }
  .hero__title { font-size: clamp(44px, 12vw, 64px); }
  .hero__cta { flex-direction: column; align-items: flex-start; }
  .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
}

@media (max-width: 480px) {
  .hero__badges { gap: 8px; }
  .hero__trust { gap: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__glow-tl,
  .hero__glow-br { animation: none; }
  .hero__badge-dot { animation: none; }
  .btn-primary.has-pulse { animation: none; }
}
```


---

### SEC-02: Media Trust（マーキー）

**感情目標**: 「あのメディアも使っている」即座の信頼

**背景**: `#0d1a1f` + 上下グラデーション境界

#### HTML骨格

```html
<section class="media-trust" id="media-trust" aria-label="導入メディア実績">
  <div class="media-trust__inner">

    <!-- ラベル -->
    <p class="media-trust__label">
      TRUSTED BY 500+ MEDIA
    </p>

    <!-- マーキー1行目（右方向） -->
    <div class="marquee media-trust__marquee" aria-hidden="true">
      <div class="marquee__track">
        <!-- 以下を2回繰り返す（ループ用） -->
        <span class="marquee__item">スポニチ Annex</span>
        <span class="marquee__item">livedoor NEWS</span>
        <span class="marquee__item">女性自身</span>
        <span class="marquee__item">文春オンライン</span>
        <span class="marquee__item">All About</span>
        <span class="marquee__item">日刊スポーツ</span>
        <span class="marquee__item">Smart FLASH</span>
        <span class="marquee__item">TRILL</span>
        <span class="marquee__item">J-CAST</span>
        <span class="marquee__item">grape</span>
        <span class="marquee__item">スポニチ Annex</span>
        <span class="marquee__item">livedoor NEWS</span>
        <span class="marquee__item">女性自身</span>
        <span class="marquee__item">文春オンライン</span>
        <span class="marquee__item">All About</span>
        <span class="marquee__item">日刊スポーツ</span>
        <span class="marquee__item">Smart FLASH</span>
        <span class="marquee__item">TRILL</span>
        <span class="marquee__item">J-CAST</span>
        <span class="marquee__item">grape</span>
      </div>
    </div>

    <!-- マーキー2行目（左方向） -->
    <div class="marquee marquee--reverse media-trust__marquee" aria-hidden="true">
      <div class="marquee__track">
        <span class="marquee__item">読売新聞オンライン</span>
        <span class="marquee__item">週刊女性PRIME</span>
        <span class="marquee__item">NEWSポストセブン</span>
        <span class="marquee__item">ORICON NEWS</span>
        <span class="marquee__item">マイナビニュース</span>
        <span class="marquee__item">東スポ Web</span>
        <span class="marquee__item">ニコニコニュース</span>
        <span class="marquee__item">excite ニュース</span>
        <span class="marquee__item">Infoseek ニュース</span>
        <span class="marquee__item">Walkerplus</span>
        <span class="marquee__item">読売新聞オンライン</span>
        <span class="marquee__item">週刊女性PRIME</span>
        <span class="marquee__item">NEWSポストセブン</span>
        <span class="marquee__item">ORICON NEWS</span>
        <span class="marquee__item">マイナビニュース</span>
        <span class="marquee__item">東スポ Web</span>
        <span class="marquee__item">ニコニコニュース</span>
        <span class="marquee__item">excite ニュース</span>
        <span class="marquee__item">Infoseek ニュース</span>
        <span class="marquee__item">Walkerplus</span>
      </div>
    </div>

    <p class="media-trust__caption">日本の優良メディアがUZOUを選ぶ理由がある。</p>
  </div>
</section>
```

#### CSS仕様

```css
/* --- Media Trust --- */
.media-trust {
  background: var(--bg-marquee);
  padding: var(--section-pad-sm) 0;
  position: relative;
  overflow: hidden;
}

.media-trust__inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.media-trust__label {
  text-align: center;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-light);
  margin-bottom: 4px;
}

.media-trust__caption {
  text-align: center;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--t3-dark);
  margin-top: 4px;
}

/* マーキー Override（UZOUカラー適用） */
.media-trust__marquee {
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.media-trust__marquee .marquee__track {
  animation-duration: 35s;
}

.media-trust__marquee .marquee__item {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--t2-dark);
  letter-spacing: 0.02em;
  padding: 12px 28px;
  gap: 28px;
}

.media-trust__marquee .marquee__item::after {
  content: '×';
  color: rgba(var(--c-light-rgb), 0.3);
  font-size: 10px;
}

/* 左右フェードマスク */
.media-trust__marquee::before,
.media-trust__marquee::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}

.media-trust__marquee::before {
  left: 0;
  background: linear-gradient(to right, var(--bg-marquee), transparent);
}

.media-trust__marquee::after {
  right: 0;
  background: linear-gradient(to left, var(--bg-marquee), transparent);
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
```

---

### SEC-03: Solution（課題共感）

**感情目標**: 「そうそう、これで困ってる」

**背景**: `#0a1215` + ノイズテクスチャ + 右上アンビエントグロー

**レイアウト**: タブ切替（Advertisers / Publishers）+ 課題リスト

**遷移**: Media Trust → Solution: 上部を `clip-path: polygon(0 0, 100% 5vw, 100% 100%, 0 100%)` で斜め切り

#### HTML骨格

```html
<section class="solution bg-noise" id="solution" aria-labelledby="solution-title">

  <!-- 右上アンビエントグロー -->
  <div class="solution__glow" aria-hidden="true"></div>

  <!-- 斜め上端 -->
  <div class="solution__skew-top" aria-hidden="true"></div>

  <div class="container">

    <div class="solution__header" data-reveal>
      <span class="section-label">THE PROBLEM</span>
      <h2 class="section-title" id="solution-title">
        広告業界の「見えない」コストを、<br>ご存知ですか。
      </h2>
    </div>

    <!-- タブUI -->
    <div class="solution__tabs" role="tablist" aria-label="ターゲット選択">
      <button class="solution__tab is-active" role="tab" aria-selected="true"
              aria-controls="tab-adv" id="tab-btn-adv">
        広告代理店・広告主の方
      </button>
      <button class="solution__tab" role="tab" aria-selected="false"
              aria-controls="tab-pub" id="tab-btn-pub">
        メディア運営者の方
      </button>
    </div>

    <!-- タブパネル: Advertisers -->
    <div class="solution__panel is-active" id="tab-adv" role="tabpanel"
         aria-labelledby="tab-btn-adv">
      <p class="solution__panel-lead">届くべき人に、届いていない。</p>
      <ol class="solution__list" data-reveal="stagger-list">
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">01</span>
          <div class="solution__item-body">
            新規メディア開拓に時間と調整コストがかかりすぎる
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">02</span>
          <div class="solution__item-body">
            特定媒体への集中から抜け出せず、成果改善の打ち手が尽きている
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">03</span>
          <div class="solution__item-body">
            配信ロジックの説明責任を果たせず、クライアントへの報告が苦しい
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">04</span>
          <div class="solution__item-body">
            他社との差別化になる媒体提案ができていない
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">05</span>
          <div class="solution__item-body">
            CPAは守れてもスケールさせる方法論が見つからない
          </div>
        </li>
      </ol>
    </div>

    <!-- タブパネル: Publishers -->
    <div class="solution__panel" id="tab-pub" role="tabpanel"
         aria-labelledby="tab-btn-pub" hidden>
      <p class="solution__panel-lead">収益の天井が、見えない。</p>
      <ol class="solution__list" data-reveal="stagger-list">
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">01</span>
          <div class="solution__item-body">
            広告収益が頭打ち。次の成長策が見えない
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">02</span>
          <div class="solution__item-body">
            サードパーティCookie廃止後の収益構造が不安定になっている
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">03</span>
          <div class="solution__item-body">
            新施策を試したいが、検証できるリソースがない
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">04</span>
          <div class="solution__item-body">
            特定プラットフォームへの依存度を下げられない
          </div>
        </li>
        <li class="solution__item">
          <span class="solution__item-num" aria-hidden="true">05</span>
          <div class="solution__item-body">
            持っているデータを収益につなげる方法がわからない
          </div>
        </li>
      </ol>
    </div>

  </div>
</section>
```

#### CSS仕様

```css
/* --- Solution --- */
.solution {
  background: var(--c-base);
  padding: var(--section-pad-lg) 0;
  position: relative;
  overflow: hidden;
}

.solution__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 50%;
  height: 60%;
  background: radial-gradient(ellipse at 70% 20%,
    rgba(var(--c-light-rgb), 0.07) 0%,
    transparent 65%);
  pointer-events: none;
}

.solution__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 680px;
  margin-bottom: 48px;
}

/* タブUI */
.solution__tabs {
  display: flex;
  gap: 0;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--r-button);
  width: fit-content;
  margin-bottom: 48px;
  overflow: hidden;
}

.solution__tab {
  padding: 12px 28px;
  background: transparent;
  border: none;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  color: var(--t2-dark);
  cursor: pointer;
  transition:
    background var(--dur-fast),
    color var(--dur-fast);
}

.solution__tab.is-active {
  background: rgba(var(--c-light-rgb), 0.1);
  color: var(--c-light);
}

.solution__tab:not(.is-active):hover {
  background: rgba(255,255,255,0.04);
  color: var(--t1-dark);
}

/* タブパネル */
.solution__panel { display: none; }
.solution__panel.is-active { display: block; }

.solution__panel-lead {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--c-light);
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

/* リスト */
.solution__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 800px;
}

.solution__item {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background var(--dur-fast);
}

.solution__item:first-child {
  border-top: 1px solid rgba(255,255,255,0.06);
}

.solution__item-num {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(var(--c-light-rgb), 0.4);
  flex-shrink: 0;
  padding-top: 3px;
  min-width: 24px;
}

.solution__item-body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--t2-dark);
  transition: color var(--dur-fast);
}

.solution__item:hover .solution__item-body {
  color: var(--t1-dark);
}

@media (max-width: 768px) {
  .solution__tabs {
    width: 100%;
    flex-direction: column;
  }
  .solution__tab { text-align: left; }
}
```

#### JS仕様

```javascript
// --- Solution タブ切替 ---
function initSolutionTabs() {
  const tabs = document.querySelectorAll('.solution__tab');
  const panels = document.querySelectorAll('.solution__panel');

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('hidden', '');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      panels[i].classList.add('is-active');
      panels[i].removeAttribute('hidden');

      // リビール再実行
      panels[i].querySelectorAll('.solution__item').forEach((item, j) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s, transform 0.4s var(--ease-reveal)';
          item.style.opacity = '1';
          item.style.transform = 'none';
        }, j * 60);
      });
    });
  });
}
```

---

### SEC-04: Results（実績・規模感）

**感情目標**: 「この規模感は本物だ」驚き

**背景**: `#0a1215` + SVGデータフローライン（静的装飾）

**レイアウト**: 非対称2カラム（左60% 主KPI / 右40% 縦積み3つ）

#### HTML骨格

```html
<section class="results" id="results" aria-labelledby="results-title">

  <!-- SVGデータフロー装飾 -->
  <svg class="results__flow-svg" aria-hidden="true" viewBox="0 0 1200 500"
       fill="none" preserveAspectRatio="xMidYMid slice">
    <path d="M1200 0 Q900 150 600 200 Q300 250 0 400"
          stroke="rgba(139,192,202,0.06)" stroke-width="1.5"/>
    <path d="M1200 100 Q850 220 550 260 Q250 300 0 500"
          stroke="rgba(139,192,202,0.04)" stroke-width="1"/>
    <path d="M1200 200 Q800 280 500 300 Q200 320 0 350"
          stroke="rgba(52,98,111,0.08)" stroke-width="1.5"/>
    <circle cx="600" cy="200" r="3" fill="rgba(139,192,202,0.3)"/>
    <circle cx="350" cy="300" r="2" fill="rgba(139,192,202,0.2)"/>
    <circle cx="850" cy="180" r="2.5" fill="rgba(139,192,202,0.2)"/>
  </svg>

  <div class="container">

    <div class="results__header" data-reveal>
      <span class="section-label">THE SCALE</span>
      <h2 class="section-title" id="results-title">数字が語る、接続の規模。</h2>
    </div>

    <div class="results__grid">

      <!-- 主KPI（左・大） -->
      <div class="results__kpi-main" data-reveal>
        <span class="results__kpi-value results__kpi-value--display">
          <span data-count="50" data-count-suffix="億+" data-count-duration="1.8"
                class="results__count">50億+</span>
        </span>
        <span class="results__kpi-label">月間、50億の接続。</span>
        <span class="results__kpi-unit">AD REQUESTS / MONTH</span>
        <p class="results__kpi-desc">
          国内最大級の配信規模が、精度の高い最適化を可能にする
        </p>
      </div>

      <!-- サブKPI群（右・縦積み） -->
      <div class="results__kpi-sub-group">

        <div class="results__kpi-sub" data-reveal data-reveal-delay="0.1">
          <span class="results__kpi-value">
            <span data-count="500" data-count-suffix="+"
                  data-count-duration="1.4" class="results__count">500+</span>
          </span>
          <span class="results__kpi-unit">MEDIA NETWORKS</span>
          <span class="results__kpi-subdesc">導入メディア数</span>
        </div>

        <div class="results__kpi-sub results__kpi-sub--divider"
             data-reveal data-reveal-delay="0.18">
          <span class="results__kpi-value">
            <span data-count="3.5" data-count-suffix="億+"
                  data-count-decimal="1" data-count-duration="1.6"
                  class="results__count">3.5億+</span>
          </span>
          <span class="results__kpi-unit">MONTHLY IMPRESSIONS</span>
          <span class="results__kpi-subdesc">月間インプレッション</span>
        </div>

        <div class="results__kpi-sub results__kpi-sub--divider"
             data-reveal data-reveal-delay="0.26">
          <span class="results__kpi-value results__kpi-value--accent">
            <span data-count="34.8" data-count-suffix="%"
                  data-count-decimal="1" data-count-duration="1.8"
                  class="results__count">+34.8%</span>
          </span>
          <span class="results__kpi-unit">AVG REVENUE LIFT</span>
          <span class="results__kpi-subdesc">平均収益向上率</span>
        </div>

      </div>
    </div>

  </div>
</section>
```

#### CSS仕様

```css
/* --- Results --- */
.results {
  background: var(--c-base);
  padding: var(--section-pad-xl) 0;
  position: relative;
  overflow: hidden;
}

.results__flow-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.results__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 64px;
}

/* 非対称グリッド */
.results__grid {
  display: grid;
  grid-template-columns: 58% 42%;
  gap: 0;
  align-items: center;
  min-height: 360px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--r-card);
  overflow: hidden;
}

/* 主KPI */
.results__kpi-main {
  padding: 56px 64px;
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255,255,255,0.01);
}

.results__kpi-value {
  font-family: var(--font-display);
  font-weight: 900;
  line-height: 1;
  color: var(--t1-dark);
}

.results__kpi-value--display {
  font-size: clamp(56px, 7vw, 96px);
  /* ブラーリビール: data-reveal="blur" で制御 */
  background: linear-gradient(135deg, #ffffff 0%, var(--c-light) 60%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.results__kpi-value--accent {
  font-size: clamp(44px, 5vw, 72px);
  color: var(--c-light);
}

.results__count { display: inline-block; }

.results__kpi-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--t2-dark);
  margin-top: 4px;
}

.results__kpi-unit {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(var(--c-light-rgb), 0.5);
}

.results__kpi-desc {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.7;
  color: var(--t3-dark);
  margin-top: 8px;
  max-width: 340px;
}

/* サブKPI群 */
.results__kpi-sub-group {
  display: flex;
  flex-direction: column;
}

.results__kpi-sub {
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.results__kpi-sub--divider {
  border-top: 1px solid rgba(255,255,255,0.06);
}

.results__kpi-sub .results__kpi-value {
  font-size: clamp(36px, 4vw, 56px);
}

.results__kpi-subdesc {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--t3-dark);
}

/* 下部グラデーション溶解（Results→About） */
.results::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(to bottom, transparent, var(--bg-white));
  pointer-events: none;
}

@media (max-width: 1024px) {
  .results__grid {
    grid-template-columns: 1fr;
  }
  .results__kpi-main {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 40px 32px;
  }
  .results__kpi-sub-group {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .results__kpi-sub {
    flex: 1;
    min-width: 160px;
  }
  .results__kpi-sub--divider {
    border-top: none;
    border-left: 1px solid rgba(255,255,255,0.06);
  }
}

@media (max-width: 768px) {
  .results__kpi-sub-group { flex-direction: column; }
  .results__kpi-sub--divider {
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
}
```

---

### SEC-05: About / Platform（仕組みの理解）

**感情目標**: 「なぜ実現できるのか」知的納得

**背景**: `#ffffff`（ライトセクション。ダーク連続後の呼吸）

**レイアウト**: 上部テキスト + フルワイドPlatform Diagram SVG

#### HTML骨格

```html
<section class="about" id="about" aria-labelledby="about-title">
  <div class="container">

    <div class="about__header" data-reveal>
      <span class="section-label section-label--light">WHAT IS UZOU</span>
      <h2 class="section-title section-title--light" id="about-title">
        形あるものと、形なきものをつなぐ。
      </h2>
    </div>

    <div class="about__body" data-reveal data-reveal-delay="0.1">
      <p class="about__text">
        UZOUという名前は「有象無象」から生まれた。<br>
        形あるもの（有象）——広告主、代理店、メディア。<br>
        形なきもの（無象）——ユーザーの注意、コンテンツとの共鳴、信頼の積み重ね。<br><br>
        その両方をつなぐことが、UZOUの仕事だ。
      </p>
      <p class="about__text">
        デジタル広告市場において、広告主とメディアは直接出会えない。調整コスト、情報の非対称性、プラットフォーム依存。UZOUはその空白に独自の商流基盤を築いた。500以上のメディアとの直接接続。AIによるリアルタイムマッチング。これが、広告主の成果とメディアの収益を同時に動かす理由だ。
      </p>
    </div>

    <!-- Platform Diagram（インタラクティブSVG） -->
    <div class="about__diagram" data-reveal data-reveal-delay="0.2">
      <svg class="platform-svg" id="platform-diagram"
           viewBox="0 0 900 400" fill="none"
           role="img" aria-label="広告主・UZOU・メディアの接続図">

        <!-- 背景グリッド（薄い） -->
        <defs>
          <pattern id="diag-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(10,26,31,0.06)" stroke-width="0.5"/>
          </pattern>
          <!-- 接続線グラデーション -->
          <linearGradient id="line-grad-adv" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#34626F" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#34626F" stop-opacity="0.8"/>
          </linearGradient>
          <linearGradient id="line-grad-media" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#34626F" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#34626F" stop-opacity="0.3"/>
          </linearGradient>
        </defs>

        <rect width="900" height="400" fill="url(#diag-grid)"/>

        <!-- 広告主ノード群（左） -->
        <g class="platform-adv-nodes">
          <circle cx="100" cy="120" r="28" fill="rgba(43,73,84,0.15)"
                  stroke="rgba(52,98,111,0.4)" stroke-width="1.5"/>
          <text x="100" y="125" text-anchor="middle" fill="rgba(10,26,31,0.6)"
                font-size="9" font-family="Inter" font-weight="600">ADV</text>
          <text x="100" y="165" text-anchor="middle" fill="rgba(10,26,31,0.4)"
                font-size="8" font-family="Inter">代理店A</text>

          <circle cx="80" cy="240" r="22" fill="rgba(43,73,84,0.12)"
                  stroke="rgba(52,98,111,0.35)" stroke-width="1.5"/>
          <text x="80" y="245" text-anchor="middle" fill="rgba(10,26,31,0.55)"
                font-size="8" font-family="Inter" font-weight="600">ADV</text>
          <text x="80" y="278" text-anchor="middle" fill="rgba(10,26,31,0.35)"
                font-size="7" font-family="Inter">広告主B</text>

          <circle cx="130" cy="330" r="18" fill="rgba(43,73,84,0.10)"
                  stroke="rgba(52,98,111,0.25)" stroke-width="1"/>
          <text x="130" y="335" text-anchor="middle" fill="rgba(10,26,31,0.45)"
                font-size="7" font-family="Inter" font-weight="500">ADV</text>
        </g>

        <!-- 接続線: 広告主→UZOU（スクロール時に描画） -->
        <g class="platform-lines-adv">
          <path class="platform-line" d="M 128 120 Q 300 140 430 200"
                stroke="url(#line-grad-adv)" stroke-width="1.5"
                stroke-dasharray="220" stroke-dashoffset="220"
                stroke-linecap="round"/>
          <path class="platform-line" d="M 102 240 Q 280 230 430 210"
                stroke="url(#line-grad-adv)" stroke-width="1.5"
                stroke-dasharray="180" stroke-dashoffset="180"
                stroke-linecap="round"/>
          <path class="platform-line" d="M 148 318 Q 310 290 430 230"
                stroke="url(#line-grad-adv)" stroke-width="1"
                stroke-dasharray="160" stroke-dashoffset="160"
                stroke-linecap="round" opacity="0.7"/>
        </g>

        <!-- UZOUコアノード（中央） -->
        <g class="platform-uzou-core">
          <circle cx="450" cy="200" r="60" fill="rgba(52,98,111,0.08)"
                  stroke="rgba(52,98,111,0.2)" stroke-width="1"/>
          <circle cx="450" cy="200" r="42"
                  fill="rgba(43,73,84,0.15)"
                  stroke="rgba(139,192,202,0.4)" stroke-width="1.5"/>
          <circle cx="450" cy="200" r="28"
                  fill="rgba(52,98,111,0.25)"
                  stroke="rgba(139,192,202,0.6)" stroke-width="1.5"/>
          <text x="450" y="196" text-anchor="middle"
                fill="#34626F" font-size="11"
                font-family="Inter" font-weight="700">UZOU</text>
          <text x="450" y="210" text-anchor="middle"
                fill="rgba(52,98,111,0.7)" font-size="7"
                font-family="Inter">PLATFORM</text>
        </g>

        <!-- 接続線: UZOU→メディア -->
        <g class="platform-lines-media">
          <path class="platform-line" d="M 470 185 Q 620 160 780 120"
                stroke="url(#line-grad-media)" stroke-width="1.5"
                stroke-dasharray="220" stroke-dashoffset="220"
                stroke-linecap="round"/>
          <path class="platform-line" d="M 474 205 Q 620 210 800 230"
                stroke="url(#line-grad-media)" stroke-width="1.5"
                stroke-dasharray="200" stroke-dashoffset="200"
                stroke-linecap="round"/>
          <path class="platform-line" d="M 468 220 Q 610 280 770 330"
                stroke="url(#line-grad-media)" stroke-width="1"
                stroke-dasharray="200" stroke-dashoffset="200"
                stroke-linecap="round" opacity="0.7"/>
        </g>

        <!-- メディアノード群（右） -->
        <g class="platform-media-nodes">
          <circle cx="800" cy="120" r="26" fill="rgba(139,192,202,0.08)"
                  stroke="rgba(139,192,202,0.35)" stroke-width="1.5"/>
          <text x="800" y="125" text-anchor="middle" fill="rgba(10,26,31,0.55)"
                font-size="9" font-family="Inter" font-weight="600">MEDIA</text>
          <text x="800" y="163" text-anchor="middle" fill="rgba(10,26,31,0.35)"
                font-size="8" font-family="Inter">文春オンライン</text>

          <circle cx="820" cy="230" r="22" fill="rgba(139,192,202,0.06)"
                  stroke="rgba(139,192,202,0.3)" stroke-width="1.5"/>
          <text x="820" y="235" text-anchor="middle" fill="rgba(10,26,31,0.5)"
                font-size="8" font-family="Inter" font-weight="600">MEDIA</text>
          <text x="820" y="268" text-anchor="middle" fill="rgba(10,26,31,0.3)"
                font-size="7" font-family="Inter">livedoor NEWS</text>

          <circle cx="790" cy="330" r="18" fill="rgba(139,192,202,0.05)"
                  stroke="rgba(139,192,202,0.2)" stroke-width="1"/>
          <text x="790" y="335" text-anchor="middle" fill="rgba(10,26,31,0.45)"
                font-size="7" font-family="Inter" font-weight="500">MEDIA</text>
        </g>

        <!-- ノード数ラベル -->
        <text x="820" y="380" text-anchor="middle" fill="rgba(52,98,111,0.5)"
              font-size="9" font-family="Inter">500+ MEDIA</text>

      </svg>
    </div>

  </div>
</section>
```

#### CSS仕様

```css
/* --- About --- */
.about {
  background: var(--bg-white);
  padding: var(--section-pad-xl) 0 var(--section-pad-lg);
  position: relative;
}

.about__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin-bottom: 40px;
}

.about__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 900px;
  margin-bottom: 64px;
}

.about__text {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.9;
  color: var(--t2-light);
}

/* Platform Diagram */
.about__diagram {
  background: linear-gradient(135deg,
    rgba(240, 247, 248, 0.8) 0%,
    rgba(232, 242, 244, 0.6) 100%);
  border: 1px solid rgba(52, 98, 111, 0.12);
  border-radius: var(--r-card);
  overflow: hidden;
  padding: 24px;
}

.platform-svg {
  width: 100%;
  height: auto;
  max-height: 440px;
}

/* 接続線アニメーション（IntersectionObserver起動） */
.platform-line {
  transition: stroke-dashoffset 1s var(--ease-reveal);
}

.about__diagram.is-animated .platform-line {
  stroke-dashoffset: 0;
}

/* About→Features 溶解 */
.about::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, var(--c-base));
  pointer-events: none;
}

@media (max-width: 768px) {
  .about__body { grid-template-columns: 1fr; gap: 24px; }
  .about__diagram { padding: 12px; }
}
```

#### JS仕様（Platform Diagram ライン描画）

```javascript
// --- About Platform Diagram スクロール連動 ---
function initPlatformDiagram() {
  const diagram = document.querySelector('.about__diagram');
  if (!diagram) return;

  // 各ラインのdelay設定
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
```


---

### SEC-06: Features（3つの強み）

**感情目標**: 「具体的にこう動くのか」強みの実感

**背景**: `#0a1215` + ダークベントグリッド

**レイアウト**: ベントグリッド（Feature-01: 7/12幅大 / Feature-02: 5/12幅 / Feature-03: フル幅）

#### HTML骨格

```html
<section class="features" id="features" aria-labelledby="features-title">
  <div class="container">

    <div class="features__header" data-reveal>
      <span class="section-label">HOW IT WORKS</span>
      <h2 class="section-title" id="features-title">接続を、精密に制御する。</h2>
    </div>

    <div class="features__grid">

      <!-- Feature-01: AI配信マッチング（大カード） -->
      <article class="features__card features__card--lg" data-reveal>
        <div class="features__card-bg-grid" aria-hidden="true"></div>
        <div class="features__card-content">
          <span class="features__card-num" aria-hidden="true">01</span>
          <h3 class="features__card-title">最適解は、毎秒更新される。</h3>
          <p class="features__card-desc">
            リアルタイムAIが配信先を選定。CTRではなく、「接続の質」を最大化する。
            独自AIがCTR・CVR・視認性を総合分析し、機械学習で精度を継続改善する。
          </p>
        </div>
        <!-- バーチャートアニメーション -->
        <div class="features__barchart" aria-hidden="true" id="feature-barchart">
          <div class="features__bar-group">
            <div class="features__bar-wrap">
              <div class="features__bar" style="--h: 65%"></div>
              <span class="features__bar-label">メディアA</span>
            </div>
            <div class="features__bar-wrap">
              <div class="features__bar features__bar--active" style="--h: 88%"></div>
              <span class="features__bar-label">メディアB</span>
            </div>
            <div class="features__bar-wrap">
              <div class="features__bar" style="--h: 42%"></div>
              <span class="features__bar-label">メディアC</span>
            </div>
            <div class="features__bar-wrap">
              <div class="features__bar" style="--h: 76%"></div>
              <span class="features__bar-label">メディアD</span>
            </div>
            <div class="features__bar-wrap">
              <div class="features__bar" style="--h: 55%"></div>
              <span class="features__bar-label">メディアE</span>
            </div>
          </div>
          <div class="features__bar-legend">REALTIME OPTIMIZATION</div>
        </div>
      </article>

      <!-- Feature-02: メディアネットワーク（小カード） -->
      <article class="features__card" data-reveal data-reveal-delay="0.1">
        <div class="features__card-content">
          <span class="features__card-num" aria-hidden="true">02</span>
          <h3 class="features__card-title">500の接点が、あなたのリーチになる。</h3>
          <p class="features__card-desc">
            厳選された優良メディアとの直接取引。中間コストを削り、価値を届ける。
          </p>
        </div>
        <!-- ノード増殖SVGアニメーション -->
        <div class="features__node-visual" aria-hidden="true">
          <svg class="features__node-svg" id="node-growth-svg"
               viewBox="0 0 240 180" fill="none">
            <!-- ノードは JS で動的に追加 -->
            <circle cx="120" cy="90" r="10"
                    fill="rgba(139,192,202,0.2)"
                    stroke="rgba(139,192,202,0.8)" stroke-width="1.5"/>
            <text x="120" y="95" text-anchor="middle"
                  fill="rgba(139,192,202,0.9)" font-size="7"
                  font-family="Inter" font-weight="700">U</text>
          </svg>
          <span class="features__node-count">
            <span id="node-count-display">1</span> / 500+ MEDIA
          </span>
        </div>
      </article>

      <!-- Feature-03: ワンストップ（フル幅カード） -->
      <article class="features__card features__card--full" data-reveal data-reveal-delay="0.2">
        <div class="features__card-content features__card-content--horizontal">
          <div class="features__card-text">
            <span class="features__card-num" aria-hidden="true">03</span>
            <h3 class="features__card-title">入口から出口まで、UZOUが設計する。</h3>
            <p class="features__card-desc">
              企画・配信・分析・改善。全工程を一つのプラットフォームで完結させる。
              専任担当者の伴走サポート + リアルタイムダッシュボード。
            </p>
          </div>
          <!-- フロー図 -->
          <div class="features__flow" aria-hidden="true" id="feature-flow">
            <div class="features__flow-step" data-step="0">
              <span class="features__flow-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M6 10l3 3 5-5" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="features__flow-label">企画</span>
            </div>
            <div class="features__flow-arrow" aria-hidden="true">→</div>
            <div class="features__flow-step" data-step="1">
              <span class="features__flow-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="3" width="14" height="14" rx="2"
                        stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 10h6M10 7v6" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round"/>
                </svg>
              </span>
              <span class="features__flow-label">設定</span>
            </div>
            <div class="features__flow-arrow" aria-hidden="true">→</div>
            <div class="features__flow-step" data-step="2">
              <span class="features__flow-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="features__flow-label">配信</span>
            </div>
            <div class="features__flow-arrow" aria-hidden="true">→</div>
            <div class="features__flow-step" data-step="3">
              <span class="features__flow-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round"/>
                </svg>
              </span>
              <span class="features__flow-label">分析</span>
            </div>
            <div class="features__flow-arrow" aria-hidden="true">→</div>
            <div class="features__flow-step" data-step="4">
              <span class="features__flow-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v3M10 14v3M3 10h3M14 10h3"
                        stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round"/>
                  <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </span>
              <span class="features__flow-label">改善</span>
            </div>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- Features --- */
.features {
  background: var(--c-base);
  padding: var(--section-pad-xl) 0;
  position: relative;
}

.features__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

/* ベントグリッド */
.features__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.features__card {
  grid-column: span 12;
  background: rgba(255,255,255,0.025);
  border: var(--border-dark);
  border-radius: var(--r-card);
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition:
    border-color var(--dur-normal) var(--ease-hover-in),
    transform var(--dur-normal) var(--ease-hover-in),
    box-shadow var(--dur-normal) var(--ease-hover-in);
}

.features__card:hover {
  border-color: rgba(var(--c-light-rgb), 0.25);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
}

.features__card--lg { grid-column: span 7; }
.features__card:nth-child(2) { grid-column: span 5; }
.features__card--full { grid-column: 1 / -1; }

/* カード内グリッドライン背景 */
.features__card-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  pointer-events: none;
}

.features__card-num {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(var(--c-light-rgb), 0.4);
  display: block;
  margin-bottom: 16px;
}

.features__card-title {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: var(--fw-h3);
  letter-spacing: -0.02em;
  color: var(--t1-dark);
  margin-bottom: 12px;
  line-height: 1.3;
}

.features__card-desc {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.8;
  color: var(--t2-dark);
  max-width: 380px;
}

/* バーチャート */
.features__barchart {
  margin-top: 32px;
  background: rgba(0,0,0,0.2);
  border-radius: var(--r-inner);
  border: var(--border-dark);
  padding: 20px 20px 16px;
  position: relative;
  z-index: 1;
}

.features__bar-group {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 100px;
}

.features__bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
}

.features__bar {
  width: 100%;
  height: var(--h, 50%);
  background: rgba(var(--c-primary-rgb), 0.3);
  border-radius: 3px 3px 0 0;
  transition: height 0.5s var(--ease-reveal), background 0.3s;
  border-top: 1px solid rgba(var(--c-primary-rgb), 0.6);
}

.features__bar--active {
  background: rgba(var(--c-light-rgb), 0.35);
  border-top-color: var(--c-light);
  box-shadow: 0 -4px 16px rgba(var(--c-light-rgb), 0.2);
}

.features__bar-label {
  font-family: var(--font-display);
  font-size: 9px;
  color: var(--t3-dark);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}

.features__bar-legend {
  font-family: var(--font-display);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(var(--c-light-rgb), 0.4);
  text-align: right;
  margin-top: 12px;
}

/* ノード増殖 */
.features__node-visual {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.features__node-svg {
  width: 100%;
  max-width: 240px;
  height: 180px;
}

.features__node-count {
  font-family: var(--font-display);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(var(--c-light-rgb), 0.5);
}

/* フロー図 */
.features__card-content--horizontal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.features__flow {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  background: rgba(0,0,0,0.15);
  border-radius: var(--r-inner);
  border: var(--border-dark);
  padding: 24px 20px;
}

.features__flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--r-chip);
  transition: background var(--dur-fast), color var(--dur-fast);
}

.features__flow-step.is-active {
  background: rgba(var(--c-light-rgb), 0.1);
}

.features__flow-step.is-active .features__flow-icon {
  color: var(--c-light);
}

.features__flow-step.is-active .features__flow-label {
  color: var(--c-light);
}

.features__flow-icon {
  color: var(--t3-dark);
  transition: color var(--dur-fast);
}

.features__flow-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 500;
  color: var(--t3-dark);
  transition: color var(--dur-fast);
}

.features__flow-arrow {
  font-size: 14px;
  color: rgba(var(--c-light-rgb), 0.25);
  padding: 0 4px;
}

@media (max-width: 1024px) {
  .features__card--lg { grid-column: span 12; }
  .features__card:nth-child(2) { grid-column: span 12; }
  .features__card-content--horizontal {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .features__flow { justify-content: center; }
}
```

#### JS仕様（Feature-01バーチャート / Feature-02ノード増殖 / Feature-03フローハイライト）

```javascript
// --- Features アニメーション群 ---
function initFeaturesAnimations() {
  initBarChart();
  initNodeGrowth();
  initFlowHighlight();
}

// Feature-01: バーチャート変動（setInterval）
function initBarChart() {
  const bars = document.querySelectorAll('.features__bar');
  if (!bars.length) return;

  const baseHeights = Array.from(bars).map(b => parseFloat(b.style.getPropertyValue('--h')));

  const randomize = () => {
    bars.forEach((bar, i) => {
      const variation = (Math.random() - 0.5) * 30; // ±15%
      const newH = Math.max(20, Math.min(95, baseHeights[i] + variation));
      bar.style.setProperty('--h', newH + '%');
      // activeは最大値のbarへ
    });
    // 最大barを再計算してactive付与
    const heights = Array.from(bars).map(b =>
      parseFloat(b.style.getPropertyValue('--h')));
    const maxIdx = heights.indexOf(Math.max(...heights));
    bars.forEach((b, i) => b.classList.toggle('features__bar--active', i === maxIdx));
  };

  // IntersectionObserverで起動
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

// Feature-02: ノード増殖
function initNodeGrowth() {
  const svg = document.getElementById('node-growth-svg');
  const counter = document.getElementById('node-count-display');
  if (!svg || !counter) return;

  const cx = 120, cy = 90;
  const maxNodes = 12;
  let count = 1;

  const addNode = () => {
    if (count >= maxNodes) return;
    const angle = (Math.random() * Math.PI * 2);
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

// Feature-03: フローハイライト
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
```

---

### SEC-07: Testimonials（声・社会的証明）

**感情目標**: 「実際に使っている人が言う」確信

**背景**: `#F0F7F8` → `#E8F2F4` グラデーション（ライトセクション）

**レイアウト**: フィーチャー型（中央1枚大 + 左右1枚ずつ小）

#### HTML骨格

```html
<section class="testimonials" id="testimonials" aria-labelledby="testimonials-title">
  <div class="container">

    <div class="testimonials__header" data-reveal>
      <span class="section-label section-label--light">TRUSTED BY</span>
      <h2 class="section-title section-title--light" id="testimonials-title">
        500のメディアが、実証している。
      </h2>
    </div>

    <div class="testimonials__grid">

      <!-- 左サイドカード -->
      <article class="testimonials__card testimonials__card--side" data-reveal>
        <div class="testimonials__card-metric">収益 <span>4倍</span></div>
        <blockquote class="testimonials__quote">
          UZOU導入後、ネット広告収益が約4倍に伸長。
          3rd party cookie廃止後も収益が安定しています。
        </blockquote>
        <footer class="testimonials__source">
          <span class="testimonials__role">大手出版社系Webメディア</span>
          <span class="testimonials__position">広告担当</span>
        </footer>
      </article>

      <!-- 中央メインカード -->
      <article class="testimonials__card testimonials__card--main" data-reveal data-reveal-delay="0.1">
        <div class="testimonials__card-metric">CPA <span>32%</span> 改善</div>
        <blockquote class="testimonials__quote testimonials__quote--main">
          oCPC導入後、目標CPAに対して実績CPAが継続的に改善。
          ウォールドガーデン以外のメディア開拓が一括で進み、
          運用コストが大幅に下がりました。
        </blockquote>
        <footer class="testimonials__source">
          <span class="testimonials__category">広告代理店</span>
          <span class="testimonials__role">メディアプランナー</span>
          <span class="testimonials__position">EC・健康食品領域</span>
        </footer>
      </article>

      <!-- 右サイドカード -->
      <article class="testimonials__card testimonials__card--side" data-reveal data-reveal-delay="0.2">
        <div class="testimonials__card-metric">導入 <span>1週間</span></div>
        <blockquote class="testimonials__quote">
          タグを設置するだけで配信が始まり、運用の手離れが良い。
          法令遵守の配信姿勢が編集部からの信頼につながっています。
        </blockquote>
        <footer class="testimonials__source">
          <span class="testimonials__role">地方新聞社</span>
          <span class="testimonials__position">デジタル事業部</span>
        </footer>
      </article>

    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- Testimonials --- */
.testimonials {
  background: linear-gradient(160deg, var(--bg-tint) 0%, var(--bg-tint2) 100%);
  padding: var(--section-pad-xl) 0;
  position: relative;
}

.testimonials__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 56px;
  text-align: center;
  align-items: center;
}

/* フィーチャーグリッド */
.testimonials__grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
  align-items: start;
}

/* カード基底 */
.testimonials__card {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: var(--border-light);
  border-radius: var(--r-card);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition:
    transform var(--dur-normal) var(--ease-hover-in),
    box-shadow var(--dur-normal) var(--ease-hover-in);
}

.testimonials__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(10, 26, 31, 0.1);
}

/* 数値強調 */
.testimonials__card-metric {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--t1-light);
  letter-spacing: -0.03em;
}

.testimonials__card-metric span {
  color: var(--c-primary);
  font-weight: 900;
}

.testimonials__card--main .testimonials__card-metric {
  font-size: 40px;
}

.testimonials__card--main .testimonials__card-metric span {
  font-size: 52px;
}

/* 引用 */
.testimonials__quote {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.85;
  color: var(--t2-light);
  font-style: normal;
}

.testimonials__quote--main {
  font-size: 15px;
}

/* ソース */
.testimonials__source {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(10,26,31,0.06);
}

.testimonials__category {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-primary);
}

.testimonials__role {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--t1-light);
}

.testimonials__position {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--t3-light);
}

@media (max-width: 1024px) {
  .testimonials__grid {
    grid-template-columns: 1fr 1fr;
  }
  .testimonials__card--main {
    grid-column: 1 / -1;
    order: -1;
  }
}

@media (max-width: 768px) {
  .testimonials__grid { grid-template-columns: 1fr; }
  .testimonials__card--main { order: 0; }
}
```

---

### SEC-08: CTA Strip（第1刈り取りポイント）

**感情目標**: 「今すぐ動きたい」即時行動の誘発

**背景**: `#34626F` → `#2B4954` グラデーション + アンビエントグロー

**レイアウト**: フルセンタード 1主CTA集中

#### HTML骨格

```html
<section class="cta-strip" id="download" aria-labelledby="cta-strip-title">

  <!-- アンビエントグロー -->
  <div class="cta-strip__glow" aria-hidden="true"></div>

  <div class="container">
    <div class="cta-strip__inner">
      <p class="cta-strip__sub" data-reveal>まず、接続してみることから始まる。</p>
      <h2 class="cta-strip__title" id="cta-strip-title" data-reveal data-reveal-delay="0.08">
        資料を、今すぐ手に入れる。
      </h2>
      <p class="cta-strip__desc" data-reveal data-reveal-delay="0.14">
        30分の会話で、あなたのメディア・広告に何が起きるかがわかる。
      </p>
      <div class="cta-strip__actions" data-reveal data-reveal-delay="0.2">
        <a href="#" class="btn-cta-primary has-pulse">
          資料ダウンロード（無料）
        </a>
        <a href="#contact" class="cta-strip__contact-link">
          担当者に相談する →
        </a>
      </div>
      <ul class="cta-strip__trust" data-reveal data-reveal-delay="0.26" role="list">
        <li>完全無料</li>
        <li>30秒で完了</li>
        <li>営業電話なし</li>
      </ul>
    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- CTA Strip --- */
.cta-strip {
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-deep) 100%);
  padding: var(--section-pad-xl) 0;
  position: relative;
  overflow: hidden;
}

.cta-strip__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.cta-strip__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  max-width: 640px;
  margin: 0 auto;
}

.cta-strip__sub {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(255,255,255,0.65);
}

.cta-strip__title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: var(--fw-h1);
  letter-spacing: var(--ls-h1);
  line-height: 1.15;
  color: #ffffff;
}

.cta-strip__desc {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
}

.cta-strip__actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

/* CTA Strip 専用ボタン */
.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 48px;
  background: #ffffff;
  color: var(--c-dark);
  border-radius: var(--r-button);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--dur-fast) var(--ease-hover-in),
    box-shadow var(--dur-fast) var(--ease-hover-in);
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}

.cta-strip__contact-link {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  transition: color var(--dur-fast);
}

.cta-strip__contact-link:hover { color: #ffffff; }

/* 安心3点 */
.cta-strip__trust {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-strip__trust li {
  font-family: var(--font-display);
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  position: relative;
}

.cta-strip__trust li:not(:last-child)::after {
  content: '/';
  position: absolute;
  right: -12px;
  color: rgba(255,255,255,0.25);
}
```


---

### SEC-09: Flow（導入の流れ）

**感情目標**: 「最短1週間、導入ハードルは低い」

**背景**: `#1F353E` + ノイズテクスチャ

**レイアウト**: 縦タイムライン。各STEPドットに大小変化。ホバーで詳細展開

#### HTML骨格

```html
<section class="flow bg-noise" id="flow" aria-labelledby="flow-title">
  <div class="container">

    <div class="flow__layout">

      <!-- 左固定見出し -->
      <div class="flow__header" data-reveal>
        <span class="section-label">GET STARTED</span>
        <h2 class="section-title" id="flow-title">
          接続は、5つのステップで完成する。
        </h2>
        <p class="flow__header-note">最短1週間で、配信が始まる。</p>
      </div>

      <!-- 右タイムライン -->
      <ol class="flow__timeline" aria-label="導入ステップ一覧">

        <li class="flow__step" data-reveal>
          <div class="flow__step-indicator" aria-hidden="true">
            <div class="flow__step-dot"></div>
            <div class="flow__step-line"></div>
          </div>
          <div class="flow__step-body">
            <button class="flow__step-header" aria-expanded="false"
                    aria-controls="flow-step-1-detail">
              <span class="flow__step-num">STEP 01</span>
              <span class="flow__step-title">接続の診断</span>
              <span class="flow__step-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="flow__step-detail" id="flow-step-1-detail" hidden>
              現在の広告配信・収益構造の「見えない部分」をヒアリング。
              課題と目標を丁寧にお伺いします。
            </div>
          </div>
        </li>

        <li class="flow__step" data-reveal data-reveal-delay="0.08">
          <div class="flow__step-indicator" aria-hidden="true">
            <div class="flow__step-dot"></div>
            <div class="flow__step-line"></div>
          </div>
          <div class="flow__step-body">
            <button class="flow__step-header" aria-expanded="false"
                    aria-controls="flow-step-2-detail">
              <span class="flow__step-num">STEP 02</span>
              <span class="flow__step-title">接続の設計</span>
              <span class="flow__step-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="flow__step-detail" id="flow-step-2-detail" hidden>
              あなたに最適なメディア・広告主のネットワークを提案。
              ヒアリング内容をもとに最適な配信プランとメディア構成をご提示します。
            </div>
          </div>
        </li>

        <li class="flow__step" data-reveal data-reveal-delay="0.16">
          <div class="flow__step-indicator" aria-hidden="true">
            <div class="flow__step-dot"></div>
            <div class="flow__step-line"></div>
          </div>
          <div class="flow__step-body">
            <button class="flow__step-header" aria-expanded="false"
                    aria-controls="flow-step-3-detail">
              <span class="flow__step-num">STEP 03</span>
              <span class="flow__step-title">接続の実装</span>
              <span class="flow__step-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="flow__step-detail" id="flow-step-3-detail" hidden>
              タグ設置とアカウント設定。最短1週間で完了。
              専任担当者が全工程をサポートするため、技術的な負担は最小限です。
            </div>
          </div>
        </li>

        <li class="flow__step" data-reveal data-reveal-delay="0.24">
          <div class="flow__step-indicator" aria-hidden="true">
            <div class="flow__step-dot"></div>
            <div class="flow__step-line"></div>
          </div>
          <div class="flow__step-body">
            <button class="flow__step-header" aria-expanded="false"
                    aria-controls="flow-step-4-detail">
              <span class="flow__step-num">STEP 04</span>
              <span class="flow__step-title">接続の開始</span>
              <span class="flow__step-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="flow__step-detail" id="flow-step-4-detail" hidden>
              AIが毎秒最適化。配信開始と同時に学習が始まる。
              開始直後から成果の改善が始まります。
            </div>
          </div>
        </li>

        <li class="flow__step flow__step--last" data-reveal data-reveal-delay="0.32">
          <div class="flow__step-indicator" aria-hidden="true">
            <div class="flow__step-dot flow__step-dot--final"></div>
          </div>
          <div class="flow__step-body">
            <button class="flow__step-header" aria-expanded="false"
                    aria-controls="flow-step-5-detail">
              <span class="flow__step-num">STEP 05</span>
              <span class="flow__step-title">接続の深化</span>
              <span class="flow__step-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor"
                        stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </button>
            <div class="flow__step-detail" id="flow-step-5-detail" hidden>
              定期レポートと改善提案。接続はさらに精密になっていく。
              専任担当者が月次でレポートと改善提案を伴走します。
            </div>
          </div>
        </li>

      </ol>
    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- Flow --- */
.flow {
  background: var(--c-dark);
  padding: var(--section-pad-xl) 0;
  position: relative;
}

.flow__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

/* 左固定見出し */
.flow__header {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flow__header-note {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--c-light);
  letter-spacing: -0.01em;
}

/* タイムライン */
.flow__timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.flow__step {
  display: flex;
  gap: 24px;
}

.flow__step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.flow__step-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(var(--c-light-rgb), 0.4);
  background: var(--c-dark);
  transition:
    border-color var(--dur-normal),
    box-shadow var(--dur-normal),
    transform var(--dur-normal);
  flex-shrink: 0;
  margin-top: 2px;
}

.flow__step:hover .flow__step-dot {
  border-color: var(--c-light);
  box-shadow: 0 0 12px rgba(var(--c-light-rgb), 0.4);
  transform: scale(1.3);
}

.flow__step-dot--final {
  border-color: var(--c-light);
  background: rgba(var(--c-light-rgb), 0.15);
  box-shadow: 0 0 16px rgba(var(--c-light-rgb), 0.3);
}

.flow__step-line {
  width: 1px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(to bottom,
    rgba(var(--c-light-rgb), 0.25),
    rgba(var(--c-light-rgb), 0.05));
  margin: 6px 0;
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 0.8s var(--ease-reveal);
}

.flow__step.is-visible .flow__step-line {
  transform: scaleY(1);
}

.flow__step--last .flow__step-indicator { }

/* ステップ本体 */
.flow__step-body {
  flex: 1;
  padding-bottom: 32px;
}

.flow__step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  padding: 4px 0;
}

.flow__step-num {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(var(--c-light-rgb), 0.45);
  flex-shrink: 0;
}

.flow__step-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--t1-dark);
  flex: 1;
  transition: color var(--dur-fast);
}

.flow__step-header:hover .flow__step-title {
  color: var(--c-light);
}

.flow__step-chevron {
  color: var(--t3-dark);
  transition: transform var(--dur-normal) var(--ease-reveal);
  flex-shrink: 0;
}

.flow__step-header[aria-expanded="true"] .flow__step-chevron {
  transform: rotate(180deg);
}

.flow__step-detail {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.85;
  color: var(--t2-dark);
  padding-top: 12px;
  padding-left: 0;
  max-width: 400px;
}

@media (max-width: 1024px) {
  .flow__layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .flow__header { position: static; }
}
```

#### JS仕様（Flow アコーディオン）

```javascript
// --- Flow アコーディオン ---
function initFlowAccordion() {
  const headers = document.querySelectorAll('.flow__step-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const detailId = header.getAttribute('aria-controls');
      const detail = document.getElementById(detailId);
      if (!detail) return;

      header.setAttribute('aria-expanded', !isExpanded);
      if (isExpanded) {
        detail.setAttribute('hidden', '');
      } else {
        detail.removeAttribute('hidden');
      }
    });
  });
}
```

---

### SEC-10: FAQ（疑問解消）

**感情目標**: 「もう不安はない」

**背景**: `#ffffff`（ライトセクション）

**レイアウト**: 左固定見出し（グラデーションテキスト） + 右アコーディオン

#### HTML骨格

```html
<section class="faq" id="faq" aria-labelledby="faq-heading">
  <div class="container">
    <div class="faq__layout">

      <!-- 左固定見出し -->
      <div class="faq__sidebar" data-reveal>
        <div class="faq__sidebar-title" aria-hidden="true">
          <span class="faq__sidebar-line">FREQUENTLY</span>
          <span class="faq__sidebar-line faq__sidebar-line--gradient">ASKED</span>
          <span class="faq__sidebar-line">QUESTIONS</span>
        </div>
        <h2 class="sr-only" id="faq-heading">よくあるご質問</h2>
        <p class="faq__sidebar-caption">接続する前に、よくある問いを。</p>
        <a href="#contact" class="faq__sidebar-link">
          他にご質問がある場合は →
        </a>
      </div>

      <!-- 右アコーディオン -->
      <div class="faq__list" data-reveal data-reveal-delay="0.1">

        <details class="faq__item">
          <summary class="faq__question">
            UZOUの導入にはどのくらい時間がかかりますか？
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25l4.5-4.5"
                      stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq__answer">
            最短1週間。タグ設置とアカウント設定のみで完了します。
            専任担当者が全工程をサポートします。
          </div>
        </details>

        <details class="faq__item">
          <summary class="faq__question">
            最低出稿金額はありますか？
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25l4.5-4.5"
                      stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq__answer">
            予算やニーズに合わせて柔軟に対応しています。まずはご相談ください。
          </div>
        </details>

        <details class="faq__item">
          <summary class="faq__question">
            どのような業種に対応していますか？
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25l4.5-4.5"
                      stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq__answer">
            EC、金融、不動産、人材、教育など幅広い業種に対応。
            500以上のメディアネットワークから各業種に最適な配信先を自動選定します。
          </div>
        </details>

        <details class="faq__item">
          <summary class="faq__question">
            レポートはどのくらいの頻度で共有されますか？
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25l4.5-4.5"
                      stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq__answer">
            リアルタイムダッシュボードでいつでも確認可能。
            加えて月次の詳細レポートと改善提案を専任担当者からお届けします。
          </div>
        </details>

        <details class="faq__item">
          <summary class="faq__question">
            既存の広告運用と併用できますか？
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 6.75L9 11.25l4.5-4.5"
                      stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq__answer">
            可能です。既存チャネルを継続しながら、UZOUを追加の配信チャネルとしてご活用いただけます。
          </div>
        </details>

      </div>
    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- FAQ --- */
.faq {
  background: var(--bg-white);
  padding: var(--section-pad-xl) 0;
  position: relative;
}

.faq__layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 80px;
  align-items: start;
}

/* 左サイドバー */
.faq__sidebar {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq__sidebar-title {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq__sidebar-line {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--t1-light);
  line-height: 1.15;
  display: block;
}

/* グラデーションテキスト */
.faq__sidebar-line--gradient {
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.faq__sidebar-caption {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--t3-light);
  line-height: 1.7;
}

.faq__sidebar-link {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  color: var(--c-primary);
  text-decoration: none;
  transition: color var(--dur-fast);
}

.faq__sidebar-link:hover {
  color: var(--c-deep);
}

/* スクリーンリーダー専用 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* FAQアコーディオン */
.faq__list {
  display: flex;
  flex-direction: column;
}

.faq__item {
  border-bottom: 1px solid rgba(10,26,31,0.08);
}

.faq__item:first-child {
  border-top: 1px solid rgba(10,26,31,0.08);
}

.faq__question {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  color: var(--t1-light);
  cursor: pointer;
  list-style: none;
  transition: color var(--dur-fast);
}

.faq__question::-webkit-details-marker { display: none; }

.faq__question:hover {
  color: var(--c-primary);
}

.faq__icon {
  color: var(--t3-light);
  flex-shrink: 0;
  transition: transform var(--dur-normal) var(--ease-reveal);
  margin-top: 2px;
}

details[open] .faq__icon {
  transform: rotate(180deg);
}

details[open] .faq__question {
  color: var(--c-primary);
}

.faq__answer {
  padding: 0 0 24px;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.85;
  color: var(--t2-light);
  max-width: 620px;
}

@media (max-width: 1024px) {
  .faq__layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .faq__sidebar { position: static; }
  .faq__sidebar-line { font-size: 22px; }
}
```

---

### SEC-11: Final CTA（決断）

**感情目標**: 「やる」という意志決定の後押し

**背景**: `#34626F` → `#2B4954` → `#1F353E` 3段グラデーション + ノイズテクスチャ + マウス追従パーティクル

**レイアウト**: フルセンタード（ダークセクション）

#### HTML骨格

```html
<section class="final-cta bg-noise" id="final-cta" aria-labelledby="final-cta-title">

  <!-- Canvas（マウス追従パーティクル） -->
  <canvas class="final-cta__canvas" id="final-cta-canvas" aria-hidden="true"></canvas>

  <!-- アンビエントグロー -->
  <div class="final-cta__glow" aria-hidden="true"></div>

  <div class="container">
    <div class="final-cta__inner">

      <p class="final-cta__eyebrow" data-reveal>
        500社が証明した、広告の新しい選択肢
      </p>

      <h2 class="final-cta__title" id="final-cta-title" data-reveal data-reveal-delay="0.08">
        接続が、広告を変える。
      </h2>

      <p class="final-cta__sub" data-reveal data-reveal-delay="0.14">
        あなたのメディア・広告が、次の接続を待っている。<br>
        まずはお気軽にご連絡ください。
      </p>

      <div class="final-cta__actions" data-reveal data-reveal-delay="0.2">
        <a href="#" class="btn-cta-primary has-pulse">
          今すぐ接続を始める
        </a>
        <a href="#contact" class="btn-ghost btn-ghost--white">
          お問い合わせ
        </a>
      </div>

      <ul class="final-cta__trust" data-reveal data-reveal-delay="0.26" role="list">
        <li>完全無料</li>
        <li>30秒で完了</li>
        <li>営業電話なし</li>
      </ul>

      <p class="final-cta__company" data-reveal data-reveal-delay="0.3">
        株式会社Speee（東証スタンダード 4499）が運営
      </p>

    </div>
  </div>
</section>
```

#### CSS仕様

```css
/* --- Final CTA --- */
.final-cta {
  background: linear-gradient(
    160deg,
    var(--c-primary) 0%,
    var(--c-deep)    45%,
    var(--c-dark)    100%
  );
  padding: var(--section-pad-xl) 0;
  position: relative;
  overflow: hidden;
}

.final-cta__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.final-cta__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 30%,
      rgba(var(--c-light-rgb), 0.12) 0%,
      transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.final-cta__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  max-width: 640px;
  margin: 0 auto;
}

.final-cta__eyebrow {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--c-light-rgb), 0.65);
}

.final-cta__title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: var(--fw-h1);
  letter-spacing: var(--ls-h1);
  line-height: 1.1;
  color: #ffffff;
}

.final-cta__sub {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.85;
  color: rgba(255,255,255,0.65);
}

.final-cta__actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.btn-ghost--white {
  color: rgba(255,255,255,0.75);
  border-color: rgba(255,255,255,0.2);
}

.btn-ghost--white:hover {
  color: #ffffff;
  border-color: rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.06);
}

.final-cta__trust {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}

.final-cta__trust li {
  font-family: var(--font-display);
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  position: relative;
}

.final-cta__trust li:not(:last-child)::after {
  content: '/';
  position: absolute;
  right: -12px;
  color: rgba(255,255,255,0.2);
}

.final-cta__company {
  font-family: var(--font-display);
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.04em;
  margin-top: 8px;
}

/* FAQ→FinalCTA 溶解（FAQ::after で処理） */
.faq::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, var(--c-primary));
  pointer-events: none;
}
```

---

### SEC-12: Footer

#### HTML骨格

```html
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer__inner">

      <div class="footer__brand">
        <a href="#" class="footer__logo" aria-label="UZOUトップへ">
          <span class="nav__logo-mark" aria-hidden="true">U</span>
          <span>UZOU</span>
        </a>
        <p class="footer__company">株式会社Speee</p>
        <p class="footer__tagline">形あるものと、形なきものをつなぐ。</p>
      </div>

      <nav class="footer__nav" aria-label="フッターナビゲーション">
        <div class="footer__nav-group">
          <h3 class="footer__nav-title">サービス</h3>
          <ul role="list">
            <li><a href="#features" class="footer__nav-link">特徴</a></li>
            <li><a href="#results" class="footer__nav-link">実績</a></li>
            <li><a href="#flow" class="footer__nav-link">導入の流れ</a></li>
          </ul>
        </div>
        <div class="footer__nav-group">
          <h3 class="footer__nav-title">サポート</h3>
          <ul role="list">
            <li><a href="#faq" class="footer__nav-link">FAQ</a></li>
            <li><a href="#contact" class="footer__nav-link">お問い合わせ</a></li>
          </ul>
        </div>
        <div class="footer__nav-group">
          <h3 class="footer__nav-title">企業情報</h3>
          <ul role="list">
            <li><a href="#" class="footer__nav-link">会社概要</a></li>
            <li><a href="#" class="footer__nav-link">プライバシーポリシー</a></li>
          </ul>
        </div>
      </nav>

    </div>

    <div class="footer__bottom">
      <p class="footer__copy">© 2025 Speee, Inc. All rights reserved.</p>
    </div>
  </div>
</footer>
```

#### CSS仕様

```css
/* --- Footer --- */
.site-footer {
  background: var(--c-base);
  padding: var(--section-pad-lg) 0 40px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
  margin-bottom: 64px;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--t1-dark);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
}

.footer__company {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--t3-dark);
}

.footer__tagline {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--t3-dark);
  line-height: 1.7;
  max-width: 200px;
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer__nav-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--t3-dark);
  margin-bottom: 16px;
}

.footer__nav-group ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

.footer__nav-link {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--t2-dark);
  text-decoration: none;
  transition: color var(--dur-fast);
}

.footer__nav-link:hover { color: var(--t1-dark); }

.footer__bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer__copy {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--t3-dark);
}

@media (max-width: 768px) {
  .footer__inner { grid-template-columns: 1fr; gap: 40px; }
  .footer__nav { grid-template-columns: 1fr 1fr; gap: 24px; }
}
```


---

## Part 3: Canvasパーティクル設計書（Hero Connection Visualizer）

### 概要

Hero右半分に配置するインタラクティブCanvas。「広告主・UZOUコア・メディア」の3種類のノードが存在し、ベジェ曲線でつながれる。接続線が毎秒更新され、「接続の実況中継」として見える。

### ノード設計

#### ノード種別と視覚的区別

| 種別 | 個数 | サイズ | 色 | グロー | 意味 |
|---|---|---|---|---|---|
| 広告主 (ADV) | 6-8個 | radius 6-10px | `rgba(52,98,111,0.8)` | なし | 左側に配置 |
| UZOUコア | 1個 | radius 18px | `rgba(139,192,202,0.9)` | 強い | 中央固定 |
| メディア (MEDIA) | 6-8個 | radius 5-9px | `rgba(139,192,202,0.65)` | 弱い | 右側に配置 |

#### 座標アルゴリズム

```javascript
function generateNodes(canvasW, canvasH) {
  const nodes = [];

  // UZOUコアノード（中央固定）
  nodes.push({
    id: 'uzou-core',
    type: 'uzou',
    x: canvasW * 0.5,
    y: canvasH * 0.5,
    radius: 18,
    vx: 0, vy: 0,
    baseX: canvasW * 0.5,
    baseY: canvasH * 0.5,
    pulsePhase: 0,
  });

  // 広告主ノード（左1/3エリアにランダム配置）
  const advCount = window.innerWidth < 768 ? 4 : 7;
  for (let i = 0; i < advCount; i++) {
    const x = canvasW * 0.05 + Math.random() * canvasW * 0.30;
    const y = canvasH * 0.1 + Math.random() * canvasH * 0.80;
    nodes.push({
      id: `adv-${i}`,
      type: 'adv',
      x, y,
      radius: 5 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: x, baseY: y,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // メディアノード（右1/3エリアにランダム配置）
  const mediaCount = window.innerWidth < 768 ? 4 : 7;
  for (let i = 0; i < mediaCount; i++) {
    const x = canvasW * 0.65 + Math.random() * canvasW * 0.30;
    const y = canvasH * 0.1 + Math.random() * canvasH * 0.80;
    nodes.push({
      id: `media-${i}`,
      type: 'media',
      x, y,
      radius: 4 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: x, baseY: y,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  return nodes;
}
```

### ベジェ曲線接続線の描画ロジック

接続線は「直線は使わない」（creative-directorの指示）。`bezierCurveTo` で有機的に湾曲させる。

```javascript
function drawConnection(ctx, n1, n2, alpha, isActive) {
  // 制御点: 中間点から垂直方向にずらす
  const mx = (n1.x + n2.x) / 2;
  const my = (n1.y + n2.y) / 2;
  const dx = n2.x - n1.x;
  const dy = n2.y - n1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const curveOffset = len * 0.18 * (Math.random() > 0.5 ? 1 : -1);

  // 法線方向に制御点をずらす
  const cpx = mx - (dy / len) * curveOffset;
  const cpy = my + (dx / len) * curveOffset;

  ctx.beginPath();
  ctx.moveTo(n1.x, n1.y);
  ctx.quadraticCurveTo(cpx, cpy, n2.x, n2.y);

  if (isActive) {
    // アクティブ接続: ティールのグロー
    ctx.strokeStyle = `rgba(139, 192, 202, ${alpha * 0.85})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(139, 192, 202, 0.5)';
  } else {
    // 通常接続: 半透明ティール
    ctx.strokeStyle = `rgba(52, 98, 111, ${alpha * 0.5})`;
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 0;
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}
```

### マウスインタラクションの物理シミュレーション

ホバーポイントから200px以内のノードが「バネ係数0.05」で引き寄せられる。ノードは完全にマウスに追従しない（深海生物が水の抵抗を受けながら動く感覚）。

```javascript
function applyMouseAttraction(node, mouseX, mouseY) {
  const dx = mouseX - node.x;
  const dy = mouseY - node.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ATTRACT_RADIUS = 200;
  const SPRING = 0.05;

  if (dist < ATTRACT_RADIUS && dist > 0) {
    const force = (ATTRACT_RADIUS - dist) / ATTRACT_RADIUS;
    node.vx += dx / dist * force * SPRING;
    node.vy += dy / dist * force * SPRING;
  }

  // 元の位置に戻る復元力（バネ）
  const RETURN_SPRING = 0.02;
  node.vx += (node.baseX - node.x) * RETURN_SPRING;
  node.vy += (node.baseY - node.y) * RETURN_SPRING;

  // 速度減衰（摩擦）
  node.vx *= 0.92;
  node.vy *= 0.92;

  node.x += node.vx;
  node.y += node.vy;
}
```

### 完全なCanvas実装コード（script.js）

```javascript
function initConnectionVisualizer() {
  const canvas = document.getElementById('connection-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let mouseX = -999, mouseY = -999;
  let lastTime = 0;
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  // アクティブ接続管理
  let activeConnections = new Set();
  let lastConnectionUpdate = 0;
  const CONNECTION_UPDATE_INTERVAL = 3000; // 3秒ごとに更新

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

    for (let i = 0; i < advCount; i++) {
      const bx = w * 0.05 + Math.random() * w * 0.28;
      const by = h * 0.08 + Math.random() * h * 0.84;
      arr.push({
        id: `adv-${i}`, type: 'adv',
        x: bx, y: by, radius: 5 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseX: bx, baseY: by,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < mediaCount; i++) {
      const bx = w * 0.65 + Math.random() * w * 0.28;
      const by = h * 0.08 + Math.random() * h * 0.84;
      arr.push({
        id: `media-${i}`, type: 'media',
        x: bx, y: by, radius: 4 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseX: bx, baseY: by,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    return arr;
  }

  // アクティブ接続を更新（3-5秒周期でランダム選定）
  function updateActiveConnections() {
    activeConnections.clear();
    const coreNode = nodes.find(n => n.type === 'uzou');
    if (!coreNode) return;

    const advNodes = nodes.filter(n => n.type === 'adv');
    const mediaNodes = nodes.filter(n => n.type === 'media');

    // ランダムに2-3本の接続を光らせる
    const pickCount = 2 + Math.floor(Math.random() * 2);
    const allNonCore = [...advNodes, ...mediaNodes];
    const shuffled = allNonCore.sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(pickCount, shuffled.length); i++) {
      activeConnections.add(shuffled[i].id);
    }
  }

  // ノード描画
  function drawNode(node, time) {
    const pulseFactor = 1 + Math.sin(time * 0.002 + node.pulsePhase) * 0.15;

    if (node.type === 'uzou') {
      // UZOUコア: 3層グロー
      const outerGlow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 3
      );
      outerGlow.addColorStop(0, 'rgba(139, 192, 202, 0.15)');
      outerGlow.addColorStop(1, 'rgba(139, 192, 202, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // コア本体
      const coreGrad = ctx.createRadialGradient(
        node.x - 3, node.y - 3, 0,
        node.x, node.y, node.radius * pulseFactor
      );
      coreGrad.addColorStop(0, 'rgba(139, 192, 202, 0.9)');
      coreGrad.addColorStop(1, 'rgba(52, 98, 111, 0.7)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
      ctx.fill();

      // リング
      ctx.strokeStyle = 'rgba(139, 192, 202, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseFactor + 6, 0, Math.PI * 2);
      ctx.stroke();

    } else if (node.type === 'adv') {
      // 広告主ノード
      ctx.fillStyle = `rgba(52, 98, 111, ${0.6 + Math.sin(time * 0.001 + node.pulsePhase) * 0.2})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 98, 111, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();

    } else if (node.type === 'media') {
      // メディアノード: 軽いグロー
      if (activeConnections.has(node.id)) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(139, 192, 202, 0.5)';
      }
      ctx.fillStyle = `rgba(139, 192, 202, ${0.5 + Math.sin(time * 0.0015 + node.pulsePhase) * 0.15})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 192, 202, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // 接続線描画
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

      // ベジェ曲線
      const mx = (node.x + coreNode.x) / 2;
      const my = (node.y + coreNode.y) / 2;
      const len = Math.sqrt(dx * dx + dy * dy);
      const curveOffset = len * 0.2 * (node.id.includes('adv') ? -0.8 : 0.8);
      const cpx = mx - (dy / (len || 1)) * curveOffset;
      const cpy = my + (dx / (len || 1)) * curveOffset;

      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.quadraticCurveTo(cpx, cpy, coreNode.x, coreNode.y);

      if (isActive) {
        // アクティブ: アニメーション光
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

  // メインループ
  function loop(timestamp) {
    if (!document.getElementById('connection-canvas')) return;

    const elapsed = timestamp - lastTime;
    if (elapsed >= FRAME_INTERVAL) {
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // アクティブ接続更新
      if (timestamp - lastConnectionUpdate > CONNECTION_UPDATE_INTERVAL) {
        updateActiveConnections();
        lastConnectionUpdate = timestamp;
      }

      // 物理更新・描画
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

  function applyMouseAttractionToNode(node, mx, my) {
    if (mx < -900) return; // マウスなし
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

    node.vx += (node.baseX - node.x) * 0.02;
    node.vy += (node.baseY - node.y) * 0.02;
    node.vx *= 0.92;
    node.vy *= 0.92;
    node.x += node.vx;
    node.y += node.vy;
  }

  // イベント
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

  // prefers-reduced-motion チェック
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 静止画: ノードのみ描画、アニメーションなし
    resize();
    nodes.forEach(node => drawNode(node, 0));
    drawConnections(0);
    return;
  }

  resize();
  updateActiveConnections();
  requestAnimationFrame(loop);

  // ResizeObserver
  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
}

// --- Final CTA マウス追従パーティクル ---
function initFinalCtaParticles() {
  const canvas = document.getElementById('final-cta-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  let mouseX = 0.5, mouseY = 0.5; // 正規化座標
  let lastTime = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  // パーティクル生成
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      size: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.3,
      speed: 0.0002 + Math.random() * 0.0003,
      angle: Math.random() * Math.PI * 2,
    });
  }

  function loop(timestamp) {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach(p => {
      // マウスへの引力
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        p.x += dx * 0.0008;
        p.y += dy * 0.0008;
      }

      // 自律移動
      p.angle += 0.02;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // 境界折り返し
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      // 描画
      ctx.beginPath();
      ctx.arc(p.x * rect.width, p.y * rect.height, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 192, 202, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  canvas.closest('.final-cta').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  });

  resize();
  requestAnimationFrame(loop);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
}
```

### パフォーマンス制御

| 制御項目 | 実装方法 | 値 |
|---|---|---|
| FPS制限 | `performance.now()` でフレームスキップ | 30fps |
| モバイルノード数削減 | `window.innerWidth < 600` で分岐 | デスクトップ: 15個 / モバイル: 9個 |
| devicePixelRatio上限 | `Math.min(dpr, 2)` | 最大2x |
| shadowBlur | アクティブ接続のみ | blur: 6px |
| prefers-reduced-motion | 静止画フォールバック | アニメーション停止 |

---

## Part 4: AIテンプレ排除チェックリスト

v9で該当していた9項目に対して、v10での回避策を明記する。

| # | 問題 | v9の症状 | v10での回避策 |
|---|---|---|---|
| 3 | 装飾なし白背景+テキストだけ | About/Testimonials/FAQが白地にテキストのみ | About: Platform Diagram SVG / Testimonials: ティールグラデーション背景 + フィーチャー型カード / FAQ: グラデーションテキストの縦書き見出し |
| 7 | テキスト+ボタンだけのヒーロー | Hero右半分が空虚 | **Canvas Connection Visualizer**（12-15ノード + ベジェ接続線）を右半分フル配置 |
| 9 | 全セクション同じpadding | 全セクション `padding: 100-120px` 均一 | Hero・Final CTA: `--section-pad-xl`（120-180px）/ 通常: `--section-pad-lg`（80-130px）/ Media Trust: `--section-pad-sm`（40-64px）の3段階 |
| 10 | 全カード同じ大きさ | 3カード均等Testimonials | Testimonials: 中央1.5fr + 左右各1frのフィーチャー型 / Features: 7:5:12 ベントグリッド |
| 12 | 区切りが直線・単純背景切替 | セクション境界が瞬時切替 | 各セクション下部に `::after` グラデーション溶解（height: 120-160px）/ CTA Stripは `clip-path` なしでグラデーションが「滲む」設計 |
| 13 | 写真なし（人間的ぬくもりゼロ） | テキストのみ | Testimonialsに数値（CPA 32%、収益4倍）を大きく表示し「結果という実在」として人間性を補完。Platform Diagram SVGに人物タグ（代理店A・文春オンライン等）を記載 |
| 14 | ホバーが色変化のみ | CTA Stripリンクが色変化のみ | 全ボタン: `transform: translateY(-2〜-3px)` + `box-shadow拡大` + shimmer同時変化 / カード: `translateY(-4px)` + `border-color` 変化 |
| 15 | 全セクション同じレイアウト構造 | 全セクション「ラベル→見出し→コンテンツ」同パターン | Hero: 左右スプリット / Media Trust: フルワイドマーキー / Solution: タブ切替 / Results: 非対称2カラム / About: 上部テキスト+フルワイドSVG / Features: 7:5:12ベントグリッド / Testimonials: フィーチャー型 / CTA Strip: フルセンタード / Flow: 左固定見出し+右タイムライン / FAQ: 左固定+右アコーディオン / Final CTA: フルセンタードダーク |
| 追加: Heroコピー「もっとスマートに」 | 陳腐ワード使用 | 「広告が、メディアを救う。」（逆説的・記憶に残る）に変更 |

### 追加問題の対処

| 追加問題 | 対処 |
|---|---|
| Heroが弱すぎる（右半分空虚） | Canvas Visualizer でビジュアルインパクト最大化 |
| ダークセクションが単色で奥行きなし | `radial-gradient × ノイズテクスチャ × アンビエントグロー` の3層構造 |
| Resultsがフラット | 非対称グリッド + 主KPI 96px表示 + グラデーションテキスト + ブラーリビール |
| Testimonialsに人間がいない | 数値を人間の声の証拠として前面に。役職・メディアカテゴリを明示 |
| タイポグラフィ階層が4段 | Display(900/88px) / H1(800/68px) / H2(700/44px) / Body(400/16px) / Caption(500/12px) の5段階確立 |
| CTAコピーが弱い | 「広告市場に、新しい流れをつくる。」→「接続が、広告を変える。」（Heroとの対句構造） |

---

## Part 5: スニペット活用マップ

### 使用スニペット一覧

| スニペットファイル | 使用セクション | 使い方 | 改変内容 |
|---|---|---|---|
| `backgrounds/grid-lines.css` `.bg-grid--dark` | Hero | Hero__grid として適用 | mask-image を `ellipse 80% 70% at 60% 40%` に変更（右半分重点） |
| `backgrounds/noise-texture.css` `.bg-noise` | Solution / Flow / Final CTA | セクションに `bg-noise` クラス付与 | opacity を 0.04 に調整（標準より薄く） |
| `animations/ambient-glow.css` | Hero / Solution / CTA Strip / Final CTA | カスタム変数でティールに差し替え | グロー色を `rgba(139,192,202,0.12)` と `rgba(52,98,111,0.06)` に変更 |
| `components/glow-button.css` | Hero CTA / CTA Strip / Final CTA | `btn-primary` の基礎として参照 | 色・サイズ・shimmer・pulse アニメーションを全面書き直し |
| `components/glass-card.css` | Header / Testimonials | Header: `backdrop-filter` 部分のみ参照 / Testimonials: `.glass-card--light` を参照 | UZOUカラー(`rgba(255,255,255,0.72)`) に差し替え |
| `components/marquee.css` | Media Trust | `.marquee` / `.marquee--reverse` をそのまま使用 | 色・フォント・border を Media Trust 専用に上書き |
| `layouts/split-hero.css` | Hero | `split-hero__inner` のグリッド比率を参照 | `grid-template-columns: 52% 48%` に変更 / モバイル対応を逆順で |
| `layouts/bento-grid.css` | Features | `.bento-grid` の基礎構造を参照 | `grid-template-columns: repeat(12, 1fr)` に変更してカラム数を増やす |
| `animations/scroll-reveal.js` | 全セクション | `initScrollReveal()` の Observer ロジックを参照 | `data-reveal` 属性に `left / right / scale / blur` バリエーションを追加 |
| `animations/counter-up.js` | Results | `initCountUp()` をそのまま使用 | blur リビールを組み合わせた拡張版を追加実装 |
| `animations/text-gradient.css` `.text-gradient--static` | Results 主KPI / FAQ サイドバー | 静的グラデーション版を使用 | カラーを `#ffffff → #8BC0CA` グラデーションに変更 |
| `animations/magnetic-button.js` | Hero CTA（オプション）| Vanilla JS版の `mousemove` ロジックを参照 | strength を 0.2 に抑える（過度に動かない） |

### 新規実装が必要な箇所

| 機能 | 実装難度 | コード行数目安 | 参照スニペット |
|---|---|---|---|
| Canvas Connection Visualizer | 高 | ~180行 | なし（完全新規）|
| Solution タブUI | 中 | ~30行 | なし |
| About Platform Diagram SVG + 描画アニメーション | 中 | SVG: ~80行 / JS: ~20行 | なし |
| Feature-01 バーチャート変動 | 低 | ~30行 | counter-up.js 参照 |
| Feature-02 ノード増殖SVG | 中 | ~50行 | なし |
| Feature-03 フローハイライト | 低 | ~20行 | なし |
| Flow アコーディオン | 低 | ~20行 | なし（`details/summary`） |
| Final CTA マウス追従パーティクル | 中 | ~60行 | なし |

---

## アートディレクターからの実装注意事項（asset-assemblerへ）

### 絶対に守ること

1. **`#8BC0CA` の使用を全体の5%に抑える**: 数値ハイライト・グロー・ホバー状態・UZOUコアノードのみ。本文・見出し・背景には使わない

2. **接続線は bezierCurveTo を使う**: `lineTo` の直線は使わない。UZOUの「有機的なフロー」コンセプトと矛盾する

3. **ダークセクションは3層**: `radial-gradient` + ノイズ `.bg-noise` + アンビエントグロー `div.hero__glow-*` の3つを必ず重ねる。単色ベタ塗りは不合格

4. **Hero H1は Inter 900 / 72px以上**: `font-size: var(--fs-display)` = `clamp(56px, 7vw, 88px)` / `font-weight: 900` を厳守

5. **セクション遷移は `::after` グラデーション溶解**: 背景色の急激な切替は禁止。各セクション末尾に `height: 100-160px` のグラデーション溶解を配置

6. **全アニメーションに `prefers-reduced-motion` 対応**: CSS: `@media (prefers-reduced-motion: reduce)` / JS: `window.matchMedia` チェック

7. **ボタンホバーは3要素同時変化**: `transform: translateY(-2px)` + `box-shadow拡大` + shimmer（`::after` translateX）の3つを必ず組み合わせる

8. **各セクションのレイアウトが異なること**: 同じ「ラベル → 見出し → コンテンツ」の繰り返しを絶対に避ける

### コード品質チェックリスト

実装完了後、以下を確認する:

- [ ] コンソールエラー 0件
- [ ] `#8BC0CA` の使用箇所を数え、全体の5%以内に収まっているか
- [ ] Hero Canvas がモバイル(375px)で動作するか（ノード8個以下に削減されているか）
- [ ] `prefers-reduced-motion` 設定時に全アニメーションが停止するか
- [ ] 全CTAボタンのホバーで3要素同時変化が発生するか
- [ ] Solution タブが正しくARIA属性を更新するか（`aria-selected`, `aria-controls`）
- [ ] Flow アコーディオンが `aria-expanded` を正しく更新するか
- [ ] FAQ `details/summary` がキーボードで操作できるか
- [ ] スクロールリビールが全セクションで発火するか
- [ ] Results カウントアップがブラーリビールと同期するか
- [ ] Fixed CTAバーがHeroセクション通過後に表示されるか
- [ ] モバイルメニューがESCキーで閉じるか

