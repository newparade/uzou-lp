# UZOU LP v11 デザイン仕様書

**作成日**: 2026-02-24
**作成者**: art-director
**ステータス**: 確定版（asset-assemblerへの実装指示書）
**基となるコンセプト**: creative-concept-v11.md「Precision Lattice（精密な格子）」

---

## Part 1: コンセプトレビュー（art-director 7軸評価）

### 総合スコア: 86/100 — 合格

| # | 軸 | スコア | 評価 |
|---|---|---|---|
| 1 | 視覚的インパクト | 13/15 | ◎ |
| 2 | 装飾の質と密度 | 13/15 | ◎ |
| 3 | アニメーション多様性 | 12/15 | ○ |
| 4 | レイアウト立体感 | 12/15 | ○ |
| 5 | ブランド一貫性 | 9/10 | ◎ |
| 6 | 技術的実現性 | 13/15 | ◎ |
| 7 | AI/テンプレート感排除 | 14/15 | ◎ |

### 軸別レビュー

#### 1. 視覚的インパクト (13/15)

**強み**: Heroの「Split Hero + Canvas Connection Visualizer + グリッドライン + ラジアルグロー」の4層構成は、ファーストビューの視覚密度としてYappli動画Heroに対抗できる水準。「精密機器のショールーム」メタファーが白ベースのリッチさを正当化している点は秀逸。

**改善指示**: Canvas右半分のノードがまだ「小さい幾何学が散らばっている」印象。中央のUZOUコアノードの六角形を**r=22（現18→22）**に拡大し、外側リング（パルス）を2層→3層に増やす。接続線のstroke-widthをアクティブ時に1.5→2.0に太くし、shadowBlurを6→10に強化。ノード描画のfillStyleのalpha値も+0.1底上げする。これにより「接続の実況中継」としての存在感が出る。

#### 2. 装飾の質と密度 (13/15)

**強み**: 10セクション×3層=30装飾要素の網羅的マッピングは、実装の抜け漏れを防ぐ優れた設計。opacity範囲（L1: 0.03-0.10 / L2: 0.10-0.40 / L3: 0.40-1.0）の厳密制御は層間干渉を避ける合理的な設計。

**改善指示**: CTA StripのL1背景にグリッドラインが欠けている。ダークセクションであるSolutionとFinal CTAにはノイズテクスチャが指定されているが、CTA Stripは「ティールのラジアルグラデーション」のみ。CTA Stripの背景に**白のグリッドライン（opacity 0.04）**を追加し、全ティール系セクションの統一感を出す。

#### 3. アニメーション多様性 (12/15)

**強み**: 7パターンの明確な定義と各セクションへの割り当ては、「スクロールの旅」としてのバリエーションを保証する。Stroke Draw（About/Flow）とBlur Unveil（Results）の差別化は特に効果的。

**改善指示**:
- TestimonialsのScale Upのscale開始値0.9は控えめすぎる。**0.85→1.0**に変更し、スケール変化量を増やすことで「カードが浮き上がる」感を強化。
- FAQのアコーディオン開閉にspring感が足りない。`cubic-bezier(0.34, 1.56, 0.64, 1)`のオーバーシュートイージングを使い、開閉時に1-2px行き過ぎてから戻る「呼吸」を入れる。
- Parallax Driftの移動量は±20pxと指定されているが、SVG装飾の種類によって**三角形SVG: ±15px / 同心円SVG: ±25px / ドットグリッド: ±10px**と差をつけ、「前景/中景/後景」の奥行き感を作る。

#### 4. レイアウト立体感 (12/15)

**強み**: Featuresのベントグリッド（7:5 + フル幅）、Flow/FAQのsticky左+スクロール右は、均等グリッドのテンプレート感を排除する有効な手法。Results非対称2カラム（58:42）もKPI主従の明確化に成功している。

**改善指示**:
- Testimonialsの3カラムグリッドはまだ均等配置。中央の`--featured`カードが`grid-row: span 2`で大きくなっているが、左右2枚の**上下オフセット（左列: padding-top 0 / 右列: padding-top 40px）**を追加し、非対称のリズムを出す。
- Solution課題リストが5項目の単調な縦並び。各項目の番号（01-05）に**左ボーダー（ティールグラデーション、3px幅）**を追加し、ホバー時に左に4pxスライドする動きを加える。

#### 5. ブランド一貫性 (9/10)

**強み**: ティール5色+背景4色のカラー体系がv9/v10から一貫。「Precision Lattice」の幾何学モチーフ（グリッドライン、六角形、三角形）がCanvasノード、SVG装飾、カード内背景に統一的に使用されている。

**改善指示**: `#8BC0CA`（ライトティール）の使用比率5%ルールは正しいが、グラデーション方向「135deg統一」がやや機械的。HeroとFinal CTAのみ**160deg**に変更し、「ページの入口と出口が呼応する」構造を作る。中間セクションは135degのまま。

#### 6. 技術的実現性 (13/15)

**強み**: 全施策がVanilla HTML/CSS/JS + Canvas API + SVGで実装可能。IntersectionObserver + data-reveal属性のパターンは既存コードとの親和性が高く、段階的実装が可能。

**改善指示**:
- Feature-02のノード増殖SVGは現在`setInterval(addNode, 400)`で12ノードまで追加するが、スクロール連動（進入→カウント開始→離脱で停止）に変更し、パフォーマンスを改善。
- Flow タイムラインの `scaleY` アニメーションは既に実装済み（`.flow__step.is-visible .flow__step-line { transform: scaleY(1) }`）。これをスクロール進捗連動（viewportCenterとコンテナ位置から`progress`を計算して`scaleY(progress)`）に強化する指示が必要。

#### 7. AI/テンプレート感排除 (14/15)

**強み**: ベントグリッド、sticky left + scroll right、非対称2カラム、Canvas Connection Visualizer、幾何学混在ノード（六角形/三角形/円）——これらの組み合わせは「Bootstrap/Tailwind UIのテンプレートではない」ことを明確に証明する。特にCanvas内の幾何学形状混在と曲線接続線は、UZOUでしか見られないビジュアル言語。

**改善指示**: セクションラベル（`// THE PROBLEM`等）の`//`プレフィックスにアンダーライン装飾を追加する指示はあるが、具体的なCSSが不足。`::after`疑似要素で**幅40px、高さ2px、ティールグラデーション**のアンダーラインを追加し、セクションラベルの「印字された感」を強化する。

### art-directorの一言

> 「Precision Lattice」は、白い空間にインテリジェンスを宿らせるコンセプトとして正しい方向にある。Canvasの接続ビジュアライゼーションは他社にない固有のビジュアル言語だ。しかし「精密」であるがゆえに、現状は「おとなしい」。精密であっても、光は強く、影は深くあるべきだ。この仕様書では、コンセプトの骨格はそのまま活かしつつ、光の強度、影の深度、動きのメリハリを1段引き上げる。「白いのにリッチ」を「白いのに息を呑む」に昇華させる。

---

## Part 2: 実装用デザイン仕様書

---

### 1. デザイントークン変更一覧

#### 1-1. 追加するCSS変数

```css
:root {
  /* --- v11追加トークン --- */

  /* グラデーション方向（セクション別） */
  --grad-hero:       160deg;  /* Hero/Final CTA: 入口と出口の呼応 */
  --grad-default:    135deg;  /* 中間セクション共通 */

  /* アニメーション追加イージング */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);   /* FAQ開閉・Scale Up */
  --ease-blur:       cubic-bezier(0.22, 1, 0.36, 1);       /* Blur Unveil（既存ease-revealと同値） */

  /* Parallax速度トークン */
  --parallax-far:    0.02;   /* 後景（ドットグリッド） */
  --parallax-mid:    0.04;   /* 中景（同心円） */
  --parallax-near:   0.06;   /* 前景（三角形） */

  /* 装飾opacity制御 */
  --deco-l1-min:     0.03;
  --deco-l1-max:     0.10;
  --deco-l2-min:     0.10;
  --deco-l2-max:     0.40;
  --deco-l3-min:     0.40;
  --deco-l3-max:     1.00;
}
```

#### 1-2. 変更するCSS変数

| 変数 | v10値 | v11値 | 理由 |
|---|---|---|---|
| `--stagger` | `80ms` | `80ms` | 変更なし（適正値） |
| `--dur-reveal` | `1.2s` | `1.0s` | Blur Unveilとの組み合わせで微調整 |

#### 1-3. 変更なしで維持する主要トークン

カラー8色（`--c-abyss`, `--c-base`, `--c-dark`, `--c-deep`, `--c-primary`, `--c-light`, `--bg-surface`, `--bg-tint`, `--bg-tint2`, `--bg-marquee`）、タイポグラフィ5段階、イージング4種（`--ease-reveal`, `--ease-hover-in`, `--ease-hover-out`, `--ease-connect`）——全て変更なし。

---

### 2. セクション別HTML変更仕様

> 差分形式: 追加する要素・属性のみ記載。既存HTML構造は維持。

#### 2-1. 全セクション共通: data-reveal属性拡張

既存の `data-reveal` 属性に新しいバリエーションを追加:

```html
<!-- 既存 -->
<div data-reveal>              <!-- translateY(32px) → 0 -->
<div data-reveal="left">       <!-- translateX(-48px) → 0 -->
<div data-reveal="right">      <!-- translateX(48px) → 0 -->
<div data-reveal="scale">      <!-- scale(0.95) → 1 -->
<div data-reveal="blur">       <!-- blur(12px) + translateY(16px) → 0 -->

<!-- v11追加 -->
<div data-reveal="scale-up">   <!-- scale(0.85) → 1（Testimonials用） -->
<div data-reveal="slide-left"> <!-- translateX(-60px) → 0（Features大カード） -->
<div data-reveal="slide-right"><!-- translateX(60px) → 0（Features小カード） -->
```

#### 2-2. セクションラベル装飾（全セクション共通）

**変更箇所**: 全 `.section-label` 要素
**方法**: CSSのみで実現（HTML変更不要）

#### 2-3. Solution: 課題リスト左ボーダー追加

**変更箇所**: `.solution__item`
**方法**: CSSのみで実現（HTML変更不要）

#### 2-4. Testimonials: data-reveal変更

```html
<!-- 変更前 -->
<article class="testimonials__card" data-reveal>
<!-- 変更後 -->
<article class="testimonials__card" data-reveal="scale-up">
```

全5枚のTestimonialsカードの `data-reveal` を `data-reveal="scale-up"` に変更。

#### 2-5. Features: data-reveal変更

```html
<!-- Feature-01（大カード）: 変更前 -->
<article class="features__card features__card--lg" data-reveal>
<!-- 変更後 -->
<article class="features__card features__card--lg" data-reveal="slide-left">

<!-- Feature-02（小カード）: 変更前 -->
<article class="features__card" data-reveal data-reveal-delay="0.1">
<!-- 変更後 -->
<article class="features__card" data-reveal="slide-right" data-reveal-delay="0.1">
```

#### 2-6. CTA Strip: グリッドライン背景要素追加

```html
<!-- cta-strip__glow の後に追加 -->
<div class="cta-strip__grid" aria-hidden="true"></div>
```

#### 2-7. Solution: data-reveal属性に左ボーダー用クラス（CSS変更のみ）

HTML変更不要。`.solution__item` のCSSに左ボーダーを追加。

---

### 3. セクション別CSS仕様

#### 3-1. セクションラベル装飾強化（全セクション共通）

```css
/* セクションラベルのアンダーライン装飾 */
.section-label {
  position: relative;
  padding-bottom: 12px;
}
.section-label::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--c-primary), var(--c-light));
  border-radius: 1px;
  opacity: 0.6;
}
/* ダークセクション用 */
.section-label--dark::after {
  opacity: 0.4;
}
```

#### 3-2. スクロールリビール追加パターン

```css
/* Scale Up — Testimonials用（scale変化量を拡大） */
[data-reveal="scale-up"] {
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.7s var(--ease-spring),
    transform 0.7s var(--ease-spring);
}
[data-reveal="scale-up"].is-visible {
  opacity: 1;
  transform: scale(1);
}

/* Slide In Left — Features大カード用 */
[data-reveal="slide-left"] {
  opacity: 0;
  transform: translateX(-60px);
  transition:
    opacity 0.7s var(--ease-reveal),
    transform 0.7s var(--ease-reveal);
}
[data-reveal="slide-left"].is-visible {
  opacity: 1;
  transform: none;
}

/* Slide In Right — Features小カード用 */
[data-reveal="slide-right"] {
  opacity: 0;
  transform: translateX(60px);
  transition:
    opacity 0.7s var(--ease-reveal),
    transform 0.7s var(--ease-reveal);
}
[data-reveal="slide-right"].is-visible {
  opacity: 1;
  transform: none;
}
```

#### 3-3. Hero グリッドライン・グロー強化

```css
/* グリッドライン opacity 0.04→0.06 に引き上げ */
.hero__grid {
  background-image:
    linear-gradient(rgba(var(--c-primary-rgb), 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--c-primary-rgb), 0.06) 1px, transparent 1px);
  background-size: 40px 40px; /* 60px→40px: 格子の密度を上げる */
}

/* 右上ラジアルグラデーション追加 */
.hero__glow-tr {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 40%;
  height: 50%;
  background: radial-gradient(circle at 80% 20%,
    rgba(var(--c-light-rgb), 0.15) 0%,
    transparent 60%);
  pointer-events: none;
}
```

**HTML追加**: `.hero__bg` 内に追加:
```html
<div class="hero__glow-tr" aria-hidden="true"></div>
```

#### 3-4. Solution: 課題リスト左ボーダー + ホバースライド

```css
/* 課題リスト左ボーダー（ティールグラデーション） */
.solution__item {
  border-left: 3px solid transparent;
  border-image: linear-gradient(
    to bottom,
    rgba(var(--c-primary-rgb), 0.30),
    rgba(var(--c-light-rgb), 0.30)
  ) 1;
  padding-left: 20px;
  transition:
    padding-left var(--dur-normal) var(--ease-reveal),
    background var(--dur-fast);
}
.solution__item:hover {
  padding-left: 24px;
  background: rgba(var(--c-primary-rgb), 0.03);
}

/* 番号のグロー強化（ホバー時） */
.solution__item:hover .solution__item-num {
  color: var(--c-primary);
  text-shadow: 0 0 12px rgba(var(--c-primary-rgb), 0.25);
}
```

#### 3-5. Results: KPIカードホバーグロー

```css
/* KPIカード全体のホバーグロー */
.results__kpi-main,
.results__kpi-sub {
  transition: box-shadow var(--dur-normal) var(--ease-hover-in);
}
.results__kpi-main:hover {
  box-shadow: inset 0 0 40px rgba(var(--c-light-rgb), 0.06);
}
.results__kpi-sub:hover {
  box-shadow: inset 0 0 30px rgba(var(--c-light-rgb), 0.05);
}

/* サブKPI間ディバイダーをグラデーションに */
.results__kpi-sub--divider {
  border-top: none;
  position: relative;
}
.results__kpi-sub--divider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(var(--c-primary-rgb), 0.12),
    rgba(var(--c-light-rgb), 0.12),
    transparent);
}
```

#### 3-6. Testimonials: 非対称オフセット + グラデーションボーダー

```css
/* 左右オフセットで非対称リズム */
.testimonials__grid {
  align-items: start;
}
/* 3列目（右側）を40px下にオフセット */
.testimonials__card:nth-child(3n) {
  margin-top: 40px;
}

/* フィーチャーカードのグラデーションボーダー */
.testimonials__card--featured {
  border: none;
  position: relative;
}
.testimonials__card--featured::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--r-card);
  padding: 1.5px;
  background: linear-gradient(135deg,
    rgba(var(--c-primary-rgb), 0.35),
    rgba(var(--c-light-rgb), 0.35));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

#### 3-7. CTA Strip: グリッドライン背景

```css
.cta-strip__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%);
}
```

#### 3-8. Features: 3D Tiltエフェクト（CSS部分）

```css
/* 3D Tiltのbase transform-style */
.features__card {
  transform-style: preserve-3d;
  will-change: transform;
}
/* ホバー時の基本スタイルを上書き */
.features__card:hover {
  /* JSで動的にtransformを設定するため、CSSのtranslateY(-6px)はJS側で統合 */
  box-shadow: 0 20px 60px rgba(10,26,31,0.10);
}

/* タッチデバイスのフォールバック */
@media (hover: none) {
  .features__card:active {
    transform: scale(1.02);
    transition: transform 0.2s var(--ease-hover-in);
  }
}
```

#### 3-9. FAQ: スプリングイージング開閉

```css
/* FAQ回答のスムーズheight遷移 */
.faq__answer {
  overflow: hidden;
  transition: max-height 0.5s var(--ease-spring),
              padding 0.5s var(--ease-spring),
              opacity 0.3s;
}
/* 質問ホバー時のティールカラー変化 */
.faq__question:hover {
  color: var(--c-primary);
}
```

#### 3-10. Final CTA: H2グラデーションテキスト

```css
.final-cta__title {
  background: linear-gradient(160deg,
    #ffffff 0%,
    rgba(var(--c-light-rgb), 1) 60%,
    #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 6s ease-in-out infinite;
}
```

#### 3-11. prefers-reduced-motion 追加対応

```css
@media (prefers-reduced-motion: reduce) {
  /* v11追加アニメーション全てのフォールバック */
  [data-reveal="scale-up"],
  [data-reveal="slide-left"],
  [data-reveal="slide-right"] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .final-cta__title {
    animation: none;
    background-size: 100% 100%;
  }

  .faq__answer {
    transition: none;
  }

  .solution__item {
    transition: none;
  }

  .testimonials__card--featured::before {
    /* グラデーションボーダーは静的表示（減衰不要） */
  }
}
```

---

### 4. アニメーションJS仕様

#### 4-1. 7パターンのアニメーションマッピング

| # | パターン | CSS/JS | data属性 | セクション |
|---|---|---|---|---|
| 1 | Stagger Reveal | CSS transition + JS delay | `data-reveal` + `data-reveal-delay` | Hero, 全見出し, Solution |
| 2 | Blur Unveil | CSS transition | `data-reveal="blur"` | Results主要KPI |
| 3 | Slide In Left | CSS transition | `data-reveal="slide-left"` | Features大カード |
| 4 | Slide In Right | CSS transition | `data-reveal="slide-right"` | Features小カード |
| 5 | Scale Up | CSS transition | `data-reveal="scale-up"` | Testimonials全カード |
| 6 | Stroke Draw | CSS + JS IO | `.platform-line` | About Diagram, Flow Timeline |
| 7 | Parallax Drift | JS scroll | なし（JS直接制御） | 全セクション背景SVG |

#### 4-2. 既存 initScrollReveal() への追加

```javascript
// initScrollReveal() 内、既存の observer設定はそのまま維持。
// 新しいdata-reveal値は CSS で定義済みのため、JS変更不要。
// IntersectionObserverが is-visible クラスを付与 → CSS transitionが発動。
```

**変更不要**: 既存のinitScrollReveal()はdata-reveal属性の値に関わらず`is-visible`クラスを付与するため、CSS側の追加のみで7パターンが動作する。

#### 4-3. Features 3D Tilt（initCardTilt 新規追加）

```javascript
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // タッチデバイスでは無効

  const cards = document.querySelectorAll('.features__card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 ~ 0.5
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
```

**DOMContentLoaded内に追加**: `initCardTilt();`

#### 4-4. CTAボタン シマーエフェクト（既存実装を確認）

既存のCSS `.btn-primary::after` と `.btn-cta-primary::after` でシマーは実装済み。ホバー時に `transform: translateX(-100%) → translateX(100%)` で光が横に走る。**変更不要**。

#### 4-5. Flow タイムライン スクロール連動強化

```javascript
function initFlowTimelineScroll() {
  const timelineSteps = document.querySelectorAll('.flow__step');
  const flowSection = document.querySelector('.flow');
  if (!timelineSteps.length || !flowSection) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const updateTimeline = () => {
    const containerRect = flowSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;

    // セクション全体の進捗（0→1）
    const sectionProgress = Math.max(0, Math.min(1,
      (viewportCenter - containerRect.top) / containerRect.height
    ));

    timelineSteps.forEach((step, i) => {
      const stepProgress = (i + 1) / timelineSteps.length;
      const dot = step.querySelector('.flow__step-dot');
      const line = step.querySelector('.flow__step-line');

      if (sectionProgress >= stepProgress * 0.8) {
        // ドットのハイライト（ティールグロー）
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

      // ラインのscaleY（スクロール連動）
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
```

**DOMContentLoaded内に追加**: `initFlowTimelineScroll();`

#### 4-6. Parallax Drift（既存 initSectionParallax 修正）

```javascript
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
```

#### 4-7. Connection Spine パルス速度スクロール連動

```javascript
// 既存 initConnectionSpine() の update() 内に追加:
// パルスのアニメーション速度をスクロール位置に連動

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

    const pulseY = progress * (window.innerHeight - 8);
    pulse.style.transform = `translateY(${pulseY}px)`;

    // パルスサイズをスクロール中盤で最大化
    const sizeFactor = 1 + Math.sin(progress * Math.PI) * 0.5;
    pulse.style.width = `${8 * sizeFactor}px`;
    pulse.style.height = `${8 * sizeFactor}px`;

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
```

#### 4-8. Hero Canvas ノード強化

```javascript
// initConnectionVisualizer() 内の変更点:

// 1. UZOUコアノードの半径を拡大
// generateNodes() 内:
//   radius: 18 → radius: 22

// 2. コアノードの描画強化（drawNode関数内の 'uzou' ケース）
//   外リングを3層に:
//   - 既存2層はそのまま
//   - 3層目追加: opacity 0.08, radius * pulseFactor + 22

// 3. アクティブ接続線の強化
//   isActive時:
//   ctx.lineWidth = 1.5 → 2.0
//   ctx.shadowBlur = 6 → 10

// 4. ノード描画のfillStyle alpha底上げ
//   adv: 0.25 → 0.30
//   media: 0.35 → 0.40
```

具体的な変更コード（initConnectionVisualizer内）:

```javascript
// generateNodes内、UZOUコアノード:
arr.push({
  id: 'uzou-core', type: 'uzou',
  x: w * 0.5, y: h * 0.5,
  radius: 22,  // 18→22
  vx: 0, vy: 0,
  baseX: w * 0.5, baseY: h * 0.5,
  pulsePhase: 0,
});

// drawNode内、'uzou'ケースに3層目リング追加:
// （既存2層の後に）
ctx.strokeStyle = 'rgba(52, 98, 111, 0.08)';
ctx.lineWidth = 0.3;
drawHexagon(node.x, node.y, node.radius * pulseFactor + 22);
ctx.stroke();

// drawConnections内、isActiveの場合:
if (isActive) {
  const flowAlpha = 0.5 + Math.sin(time * 0.004) * 0.2;
  ctx.strokeStyle = `rgba(52, 98, 111, ${alpha * flowAlpha})`;
  ctx.lineWidth = 2.0;    // 1.5→2.0
  ctx.shadowBlur = 10;    // 6→10
  ctx.shadowColor = 'rgba(52, 98, 111, 0.30)';  // 0.25→0.30
}

// drawNode内、'adv'ケース:
ctx.fillStyle = `rgba(52, 98, 111, ${0.30 + Math.sin(time * 0.001 + node.pulsePhase) * 0.1})`;
// 0.25→0.30

// drawNode内、'media'ケース:
ctx.fillStyle = `rgba(139, 192, 202, ${0.40 + Math.sin(time * 0.0015 + node.pulsePhase) * 0.15})`;
// 0.35→0.40
```

#### 4-9. FAQ アコーディオン スムーズ height 遷移

```javascript
// 既存の initFlowAccordion() とは別に、FAQ用のスムーズアコーディオンを追加

function initFaqSmoothAccordion() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const summary = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!summary || !answer) return;

    // detailsのデフォルト動作をオーバーライド
    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (item.open) {
        // 閉じる
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
        // 開く
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
```

**注意**: この実装では `<details>` のネイティブ開閉をJSでオーバーライドする。`prefers-reduced-motion: reduce` 時はネイティブ挙動のまま（CSS transition-duration: 0.01ms で即座に開閉）。

---

### 5. SVG装飾仕様

#### 5-1. 各セクションSVG装飾の一覧と変更

| セクション | 装飾名 | 既存/新規 | 変更内容 |
|---|---|---|---|
| Hero | グリッドライン | 既存（CSS） | 間隔60px→40px、opacity 0.04→0.06 |
| Hero | ラジアルグロー（右上） | **新規** | `hero__glow-tr` CSSで実装 |
| Solution | 六角形SVG（左下） | 既存 | 変更なし |
| Solution | 同心円SVG（右上） | 既存 | 変更なし |
| Results | データフローSVGライン | 既存 | 5本目のpath追加 |
| About | 同心円SVG（右上） | 既存 | 変更なし |
| Features | 三角形SVG（右上） | 既存 | 変更なし |
| Features | ドットグリッドSVG（左下） | 既存 | 変更なし |
| Testimonials | ドットパターンSVG（左上） | 既存 | 変更なし |
| Flow | 曲線SVG（右） | 既存 | 変更なし |

#### 5-2. Results データフローSVG 5本目追加

```html
<!-- 既存の4つのpath + circlesの後に追加 -->
<path d="M0 200 Q300 180 600 250 Q900 320 1200 280"
      stroke="rgba(139,192,202,0.10)" stroke-width="1"
      stroke-dasharray="6 10"/>
<!-- 散布ドット追加 -->
<circle cx="450" cy="240" r="2.5" fill="rgba(139,192,202,0.20)"/>
<circle cx="750" cy="260" r="2" fill="rgba(52,98,111,0.15)"/>
```

---

### 6. ホバー・インタラクション仕様

#### 6-1. Features 3D Tilt

- **トリガー**: `mousemove` on `.features__card`
- **動作**: `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px) scale(1.01)`
- **復帰**: `mouseleave` → 500ms `var(--ease-reveal)` で戻る
- **タッチデバイス**: 無効（`'ontouchstart' in window` チェック）
- **reduced-motion**: 無効

#### 6-2. マグネティックボタン（既存維持）

- **対象**: `.btn-primary`, `.btn-cta-primary`, `.btn-nav-primary`
- **動作**: `translate(${x * 0.15}px, ${y * 0.15}px)` マウス追従
- **復帰**: 400ms `var(--ease-reveal)`
- **変更なし**: 既存実装で品質十分

#### 6-3. Testimonials チルト（既存維持）

- **対象**: `.testimonials__card`
- **動作**: `translateY(-8px) scale(1.01) perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`
- **変更なし**: 既存実装で品質十分

#### 6-4. Solution 課題リスト ホバースライド

- **トリガー**: CSS `:hover` on `.solution__item`
- **動作**: `padding-left: 20px → 24px` + 背景色変化
- **実装**: CSS のみ（Section 3-4参照）

#### 6-5. マーキーホバー減速（既存維持）

- **対象**: `.marquee:hover .marquee__track`
- **動作**: `animation-play-state: paused`
- **変更なし**

---

### 7. レスポンシブ対応

#### 7-1. ブレークポイント別対応一覧

| 要素 | Desktop (1024px+) | Tablet (768-1024px) | Mobile (-768px) | 小型 (-480px) |
|---|---|---|---|---|
| Hero Grid | 40px間隔 | 40px間隔 | 60px間隔（密度下げ） | 非表示 |
| Hero Canvas | 全ノード（7+1+7） | 全ノード | 4+1+4ノード | 4+1+4ノード |
| Features 3D Tilt | 有効 | 有効 | 無効（タップフォールバック） | 無効 |
| Testimonials オフセット | 右列+40px | 無効 | 無効 | 無効 |
| Flow Sticky | 有効 | 無効（通常フロー） | 無効 | 無効 |
| FAQ Sticky | 有効 | 無効 | 無効 | 無効 |
| Parallax Drift | 全要素 | 全要素 | 無効 | 無効 |
| SVG装飾 | 全表示 | 全表示 | 50%非表示 | 70%非表示 |

#### 7-2. モバイル固有のCSS

```css
@media (max-width: 768px) {
  /* Testimonials オフセット無効化 */
  .testimonials__card:nth-child(3n) {
    margin-top: 0;
  }

  /* Hero Grid密度下げ */
  .hero__grid {
    background-size: 60px 60px;
  }

  /* SVG装飾の非表示（モバイルパフォーマンス） */
  .features__deco,
  .testimonials__deco {
    display: none;
  }

  /* Slide系アニメーションを通常のフェードインに縮退 */
  [data-reveal="slide-left"],
  [data-reveal="slide-right"] {
    transform: translateY(24px);
  }
}

@media (max-width: 480px) {
  /* 追加SVG装飾の非表示 */
  .solution__deco,
  .hero__glow-tr {
    display: none;
  }

  .hero__grid {
    display: none;
  }
}
```

---

### 8. prefers-reduced-motion 対応

#### 8-1. 全アニメーションのフォールバック一覧

| アニメーション | 通常動作 | reduced-motion |
|---|---|---|
| Stagger Reveal | translateY(32px)→0 + opacity | opacity 0→1（即座） |
| Blur Unveil | blur(12px) + scale(0.96) → 0 | opacity 0→1（即座） |
| Slide In L/R | translateX(±60px) → 0 | opacity 0→1（即座） |
| Scale Up | scale(0.85) → 1 | opacity 0→1（即座） |
| Stroke Draw | dashoffset → 0 | 即座にdashoffset: 0 |
| Parallax Drift | scroll連動translateY | 無効（transform: none） |
| 3D Tilt | mousemove perspective rotate | 無効 |
| Magnetic Button | mousemove translate | 無効 |
| Canvas (Hero) | 30fps requestAnimationFrame | 静止画（1フレーム描画） |
| Canvas (Final CTA) | requestAnimationFrame | 無効（非表示） |
| Connection Spine | scroll連動pulse | 非表示 |
| Bar Chart変動 | setInterval randomize | 無効（初期値固定） |
| Node Growth | setInterval addNode | 最終状態を即表示 |
| Flow Highlight | setInterval cycle | 最初のステップのみ点灯 |
| FAQ開閉 | spring transition | 即座に開閉（transition: none） |
| Gradient Shift | background-position animation | 静止（animation: none） |
| Hero Glow Float | transform animation | 静止（animation: none） |
| Badge Pulse | box-shadow animation | 静止（animation: none） |
| CTA Pulse | box-shadow animation | 静止（animation: none） |
| Marquee Scroll | translateX animation | 静止（animation: none） |

#### 8-2. JSでの prefers-reduced-motion チェック

```javascript
// 全JSアニメーション関数の冒頭に配置（既存パターン）
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

---

### 9. 実装優先度（asset-assembler向け）

#### Phase 1: 最優先（ファーストインプレッション直結）

| # | 施策 | ファイル | 工数目安 |
|---|---|---|---|
| P1-1 | Hero Grid 40px化 + opacity 0.06 | style.css | 5min |
| P1-2 | Hero右上グロー追加 | index.html + style.css | 10min |
| P1-3 | Canvas UZOUノード拡大 + 接続線強化 | script.js | 20min |
| P1-4 | data-reveal追加パターン3種（CSS） | style.css | 15min |
| P1-5 | Testimonials data-reveal="scale-up" | index.html | 5min |
| P1-6 | Features data-reveal="slide-left/right" | index.html | 5min |
| P1-7 | セクションラベル アンダーライン装飾 | style.css | 10min |
| P1-8 | CTAボタンシマー（既存確認のみ） | — | 0min |

#### Phase 2: 高優先（セクション個別リッチ化）

| # | 施策 | ファイル | 工数目安 |
|---|---|---|---|
| P2-1 | Solution 左ボーダー + ホバースライド | style.css | 15min |
| P2-2 | Results KPIホバーグロー + ディバイダーグラデーション | style.css | 15min |
| P2-3 | Features 3D Tilt | script.js | 20min |
| P2-4 | Testimonials 非対称オフセット + グラデーションボーダー | style.css | 20min |
| P2-5 | CTA Strip グリッドライン | index.html + style.css | 10min |
| P2-6 | Final CTA H2グラデーションテキスト | style.css | 5min |
| P2-7 | Results SVG 5本目追加 | index.html | 5min |

#### Phase 3: 中優先（動きの品格）

| # | 施策 | ファイル | 工数目安 |
|---|---|---|---|
| P3-1 | Flow タイムライン スクロール連動 | script.js | 30min |
| P3-2 | Parallax Drift 速度差別化 | script.js | 15min |
| P3-3 | Connection Spine パルスサイズ連動 | script.js | 10min |
| P3-4 | FAQ スムーズ height 遷移 | script.js + style.css | 30min |

#### Phase 4: 仕上げ（prefers-reduced-motion + レスポンシブ）

| # | 施策 | ファイル | 工数目安 |
|---|---|---|---|
| P4-1 | prefers-reduced-motion CSS追加 | style.css | 10min |
| P4-2 | レスポンシブ縮退CSS | style.css | 20min |
| P4-3 | 全体通しテスト | — | 30min |

---

### 10. 品質ゲート

asset-assemblerの実装完了後、art-directorが以下の基準でレビューする:

1. **7パターンのアニメーション**: 各セクションで異なるパターンが使用されていること
2. **3層装飾**: 全セクションにL1/L2/L3の装飾が存在すること
3. **opacity制御**: L1(0.03-0.10) / L2(0.10-0.40) / L3(0.40-1.0) の範囲内であること
4. **prefers-reduced-motion**: 全アニメーションがフォールバックしていること
5. **Canvas品質**: UZOUコアノードのサイズ・グロー、接続線の太さが仕様通りであること
6. **レスポンシブ**: モバイルでSVG装飾の非表示、3D Tilt無効化が機能していること

---

*この仕様書は「精密な格子が白い舞台の上で光っている」というイメージに基づいている。判断に迷った場合は、「より精密に、より光を強く」の方向で決定せよ。*
