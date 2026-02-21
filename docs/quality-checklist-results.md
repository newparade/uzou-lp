# 品質チェック結果

**対象**: UZOU LP v9
**実施日**: 2026-02-22
**対象ファイル**:
- `index.html`
- `style.css`
- `script.js`

---

## 1. AI感排除チェック（premium-design Phase C）

| # | 項目 | 判定 | 根拠 | 修正案 |
|---|---|---|---|---|
| 1 | 全要素が同じサイズ/同じ間隔で並んでいないか | ⚠️ 部分的 | Resultsカード4枚、Reasonsカード4枚、Testimonialsカード3枚がそれぞれ完全に同サイズ・同間隔で等分グリッド配置。Featureセクションは番号付きで交互レイアウト（reverse）があり変化がある。Solutionの2カラムも均等。CTA Stripの3カラムも均等。全体として均一グリッドの反復が多い。 | Resultsカードに強調カードを作る。例えば「平均収益向上率」を他の3倍サイズにする。Reasonsは2+2ではなく1大+3小のレイアウトにする。<br><br>```css
/* Resultsカード: 強調カードを大きくする */
.results__grid {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
}
.results__card:last-child {
  grid-column: span 2;
  background: linear-gradient(135deg, var(--c-primary), var(--c-deep));
  color: #fff;
  padding: 48px 32px;
}
.results__card:last-child .results__value {
  font-size: clamp(48px, 6vw, 72px);
  background: none;
  -webkit-text-fill-color: #fff;
}
.results__card:last-child .results__label {
  color: rgba(255,255,255,.7);
}

/* Reasonsカード: 1大+3小レイアウト */
.reasons__grid {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
}
.reasons__card:first-child {
  grid-row: span 2;
  padding: clamp(36px, 4vw, 56px) 28px;
}
``` |
| 2 | 色が3色以下で単調になっていないか | ✅ 合格 | ティールを基調に5段階の明暗（`--c-light` #8BC0CA / `--c-primary` #34626F / `--c-deep` #2B4954 / `--c-dark` #1F353E / `--c-black` #040404）+ 背景tint2色（#F0F7F8, #E8F2F4）+ ダッシュボードの緑（#10b981）、ドットの赤/黄/青。グラデーション使用も複数箇所。 | ― |
| 3 | 装飾が0になっていないか | ✅ 合格 | Heroにグリッドライン背景 + Canvasパーティクル、ダークセクションにノイズテクスチャ + アンビエントグロー、Feature内にノードグリッド・軌道アニメ・バーチャート。スクロールインジケーターも装飾として機能。 | ― |
| 4 | フォントがシステムデフォルトになっていないか | ✅ 合格 | Google Fontsで `Inter`（欧文） + `Noto Sans JP`（和文）をプリコネクト付きで読み込み。CSS変数 `--ff-en` / `--ff-ja` で分離管理。 | ― |
| 5 | ホバー等のインタラクションが0ではないか | ✅ 合格 | ボタン全種にhover（translateY + box-shadow変化）、ナビリンクにアンダーライン伸長、カード群にtranslateY + box-shadow、ダッシュボードに3Dパースペクティブ変化、FAQ toggleにopen/close回転、マグネティックボタン（JS）、フローステップ番号の色反転。 | ― |
| 6 | 「このデザインどこかで見たことある」感がないか | ⚠️ 部分的 | BEM命名規則やセクション構成（Hero/About/Features/Results/Testimonials/Flow/FAQ/CTA）はB2B SaaS LPの典型パターン。ただし、Canvasパーティクル、ダッシュボードモック、幾何学ノードグリッド、軌道アニメーション、ノイズテクスチャ等により独自性はある。Testimonialの3カードレイアウト、Flowのタイムラインは見慣れたパターン。 | Testimonialをカードグリッドではなく横スクロールカルーセルにする。Flowタイムラインに接続線アニメーションを追加する。<br><br>```css
/* Testimonial: 横スクロール化 */
.testimonials__grid {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
}
.testimonials__card {
  min-width: 340px;
  flex-shrink: 0;
  scroll-snap-align: start;
}

/* Flow: 接続線アニメーション */
.flow__timeline::before {
  background: linear-gradient(to bottom, transparent, var(--c-primary), transparent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 1.5s cubic-bezier(.16,1,.3,1);
}
.flow__timeline.is-visible::before {
  transform: scaleY(1);
}
``` |
| 7 | ヒーローセクションにインパクトがあるか | ✅ 合格 | Canvasパーティクル（幾何学ネットワーク）+ グリッドライン背景 + グラデーション背景 + 3Dパースペクティブ付きダッシュボードモック + チャートラインのドロー描画アニメ + テキストスタッガー表示 + バッジ + スクロールインジケーター。視覚要素が豊富でファーストビューにインパクトあり。 | ― |
| 8 | 数値やデータに視覚的な強調があるか | ✅ 合格 | Resultsの数値は `clamp(36px, 5vw, 56px)` + `font-weight: 800` + グラデーションテキスト（`background-clip: text`）で大型表示。カウントアップアニメーション付き。ダッシュボード内の数値も20px/700weightで強調。Feature番号は72px/800weightのグラデーションテキスト。 | ― |

**AI感排除チェック合計: 6/8合格、2/8部分的**

---

## 2. プロ感加点チェック（premium-design Phase C）

| # | 項目 | 判定 | 根拠 | 修正案 |
|---|---|---|---|---|
| 1 | 余白にリズムがあるか | ✅ 合格 | セクション間: `clamp(88px, 11vw, 148px)`、グループ間: 56px（`.features .section__title { margin-bottom: 56px }`等）、要素間: 10-20px（カード間gap: 20px、リスト項目間gap: 10px）の3段階が明確。Feature内のpadding 56pxとcontent内の20px gapにも差がある。 | ― |
| 2 | 1つ以上の「おっ」ポイントがあるか | ✅ 合格 | Heroのダッシュボードモック（3Dパースペクティブ + チャートドローイン）、Canvasパーティクルネットワーク、マグネティックボタン。いずれも「おっ」ポイントとして機能。 | ― |
| 3 | カラーに意図があるか | ✅ 合格 | ティール系でプロフェッショナル感・信頼感を表現。`--c-primary` は行動喚起（ボタン、リンク、アクセント）、`--c-light` は装飾・サブ要素、`--c-deep`/`--c-dark` はダーク背景。`#10b981` の緑は「上昇」を意味するダッシュボード指標にのみ使用。色の使い分けに情報設計の意図がある。 | ― |
| 4 | タイポグラフィに3段階以上の階層があるか | ✅ 合格 | H1: clamp(38px, 5.5vw, 64px)/900weight、H2: clamp(28px, 4.2vw, 46px)/800weight、H3（Feature Title）: clamp(24px, 3vw, 34px)/800weight、本文: 15-16px/400weight、キャプション/ラベル: 11-13px/500-600weight、セクションラベル（英語）: 12px/600weight/letter-spacing .18em。6段階以上の階層。 | ― |
| 5 | 画像や図が十分なサイズで使われているか | ⚠️ 部分的 | Feature のビジュアル（ノードグリッド・軌道・バーチャート）は max-width: 380px のCSS図形。Heroダッシュボードはグリッドの半分を占め十分なサイズ。ただし、写真やイラスト等の「画像」は一切使用されておらず、全てCSS/SVG/Canvas。Testimonialにアバター画像がなく40pxイニシャル丸のみ。視覚的リッチさにはやや欠ける。 | Feature ビジュアルのmax-widthを拡大し、実際のスクリーンショットやイラストの追加を検討。<br><br>```css
/* Feature ビジュアルの拡大 */
.feature__graphic {
  max-width: 480px;
  aspect-ratio: 4/3;
}
```<br><br>```html
<!-- Testimonialにアバター画像を追加 -->
<div class="testimonials__avatar">
  <img src="images/avatar-tanaka.webp" alt="田中 翔太" width="40" height="40" loading="lazy">
</div>
``` |
| 6 | ファーストビューで世界観が伝わるか | ✅ 合格 | ティールのグラデーション背景、幾何学パーティクルネットワーク（広告×メディアの接続を暗喩）、ダッシュボードモック（プロダクトの世界観）、バッジ（IT Review LEADER / AI搭載）、テキストスタッガーアニメーション。スクロール前に「テック/データドリブン/洗練」の世界観が伝わる。 | ― |

**プロ感加点チェック合計: 5/6合格、1/6部分的**

---

## 3. web-animation 品質チェック

| # | 項目 | 判定 | 根拠 | 修正案 |
|---|---|---|---|---|
| 1 | Phase 0を実行し、モーションレシピを生成したか | ⚠️ 部分的 | `design-recipe.md` は存在するが、Phase 0で定義される「モーションレシピ」（セクション別アニメーション設計表・新規テクニック一覧）の形式としては不完全。コード上では実際に多彩なアニメーションが実装されているため、結果として品質は確保されている。 | Phase 0のモーションレシピをドキュメントとして明文化することを推奨。ただし実装品質自体は問題なし。 |
| 2 | 新規テクニックが2つ以上あるか | ✅ 合格 | (1) Canvasパーティクルネットワーク（ノード間接続線の動的描画）、(2) マグネティックボタン（マウス追従）、(3) ダッシュボードのチャートライン SVGドローイン（stroke-dashoffset）。ベースラインパターン（reveal/countup/stagger）以外に3つの独自テクニックあり。 | ― |
| 3 | ヒーローセクションに3つ以上のアニメーションがあるか | ✅ 合格 | (1) Canvasパーティクル（常時）、(2) テキストスタッガー（hero__title-lineの順次フェードイン）、(3) サブ要素フェードイン（badges/subtitle/cta/trustの時間差表示）、(4) ダッシュボードのフェードイン + 3Dトランスフォーム、(5) チャートラインのドローイン（drawLine）、(6) チャートエリアのフェードイン、(7) スクロールインジケーターのパルス。7つ以上。 | ― |
| 4 | スクロールで新しいセクションが見えるたびに何かが動くか | ✅ 合格 | 全セクションに `.reveal` クラスが配置されており、IntersectionObserverによるフェードイン+translateYが発火。About（フローノード）、Solution（カラム）、CTA Strip（カード）、Features（コンテンツ+バーチャート）、Results（カウントアップ）、Testimonials（カード）、Flow（ステップ）、Reasons（カード）、FAQ（アイテム）、Final CTA。全セクション対応。 | ― |
| 5 | カードやボタンにホバーエフェクトがあるか | ✅ 合格 | ボタン: translateY(-2px) + box-shadow変化（全4種）。カード: CTA Strip（translateY-4px + box-shadow + border変化）、Results（translateY-4px + box-shadow）、Testimonials（translateY-4px + box-shadow）、Reasons（translateY-6px + box-shadow + border変化）、Solution（border-color変化）。ダッシュボード: 3D回転変化。FAQアイテム: box-shadow。ナビリンク: アンダーライン伸長。 | ― |
| 6 | 同じセクション内の要素にスタッガー（時間差）があるか | ✅ 合格 | CSS: `.reveal.is-visible:nth-child(2/3/4)` に `transition-delay: .08s/.16s/.24s`。JS: Hero要素スタッガー（0.6s + i * 0.12s）。バーチャート（.05s/.12s/.19s/.26s/.33s/.4s）。カウントアップも各カードのrevealスタッガーで時間差発火。 | ― |
| 7 | イージングにcubic-bezierを使っているか | ✅ 合格 | グローバル変数 `--ease: cubic-bezier(.16,1,.3,1)` を定義し、全アニメーションで一貫使用。JS側でも `cubic-bezier(.16,1,.3,1)` を直接指定。FAQアニメーションでも同値を使用。カウントアップにはeaseOutExpo（`1 - Math.pow(2, -10 * progress)`）を実装。 | ― |
| 8 | 数値表示にカウントアップが入っているか | ✅ 合格 | `initCountUp()` で `[data-count]` 属性を持つ全要素に対しeaseOutExpoのカウントアップを実装。小数対応（`data-decimal`）あり。IntersectionObserver（threshold: 0.4）で画面内進入時に発火。prefers-reduced-motion時は即値表示。 | ― |
| 9 | 背景に最低1つの動く装飾があるか | ✅ 合格 | (1) Heroの Canvasパーティクル（常時移動するノード+接続線）、(2) ダークセクションのアンビエントグロー（`ambientDrift` 24秒サイクル）、(3) Featureのノードパルス（`nodePulse` 3.5秒）、(4) Feature軌道回転（`spin` 22秒/16秒）。4つの動く背景装飾。 | ― |
| 10 | CTAボタンに注目を引く動きがあるか | ⚠️ 部分的 | マグネティックボタン（マウス追従）があるが、`btn--primary` と `btn--white` のみ対象。CTAボタンに**自動的な注目喚起アニメーション**（パルス、シマー、グロウ等）がない。ユーザーがホバーしなければ動きがない。固定CTAバー（sticky-cta）はスライドインのみで、ボタン自体のアテンション動作なし。 | CTAボタンにシマー（光沢スライド）エフェクトを追加する。<br><br>```css
/* CTAボタンのシマーエフェクト */
.btn--primary {
  position: relative;
  overflow: hidden;
}
.btn--primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.18),
    transparent
  );
  transform: skewX(-20deg);
  animation: shimmer 4s ease-in-out infinite;
}
@keyframes shimmer {
  0%, 100% { left: -100%; }
  50% { left: 150%; }
}

/* Fixed CTAバーのボタンにもパルスグロウ */
.sticky-cta .btn--primary {
  animation: ctaPulse 3s ease-in-out infinite;
}
@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52,98,111,.4); }
  50% { box-shadow: 0 0 0 8px rgba(52,98,111,0); }
}

/* prefers-reduced-motion対応 */
@media (prefers-reduced-motion: reduce) {
  .btn--primary::after { animation: none; }
  .sticky-cta .btn--primary { animation: none; }
}
``` |
| 11 | prefers-reduced-motion でアクセシビリティ対応を入れているか | ✅ 合格 | CSS: `@media(prefers-reduced-motion:reduce)` で `.reveal` のopacity/transform/transitionを無効化。JS: グローバル定数 `REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches` を定義し、Canvasパーティクル停止、reveal即時表示、カウントアップ即値表示、マグネティック無効、テキストスタッガー無効。包括的に対応。 | ― |

**web-animation品質チェック合計: 9/11合格、2/11部分的**

---

## 4. lp-graphics 品質チェック

| # | 項目 | 判定 | 根拠 | 修正案 |
|---|---|---|---|---|
| 1 | Phase 0を実行したか | ⚠️ 部分的 | `docs/design-recipe.md` が存在しデザインレシピは作成されているが、lp-graphicsスキルが定義する「ビジュアルレシピ」（セクション別ビジュアル設計表・手段選定）の厳密な形式ではない。結果的にCSS/SVGベースのビジュアル戦略は一貫しているため、品質には大きな問題なし。 | ビジュアルレシピを正式なフォーマットで追記することを推奨。 |
| 2 | ビジュアルレシピがリファレンス分析に基づいているか | ⚠️ 部分的 | design-recipe.md にはデザインレシピが記載されているが、リファレンス分析の記録（分析したサイトURLと抽出したビジュアル手法の対応表）が品質チェック時点で確認できない。 | リファレンス分析結果をdocs/に追記することを推奨。 |
| 3 | 全セクションにビジュアルがあるか | ⚠️ 部分的 | Hero: ダッシュボードモック+Canvas。About: フロー図（SVGアイコン+矢印）。Solution: アイコン+番号付きリスト。CTA Strip: アイコン。Features: ノードグリッド/軌道/バーチャート。Results: 数値カウントアップ（グラデーションテキスト）。**Testimonials: テキスト主体でビジュアルが弱い**（40pxイニシャル丸のみ）。Flow: 番号タイムライン。Reasons: アイコン。FAQ: テキストのみ（アコーディオン）。Final CTA: テキストのみ。 | TestimonialsとFAQにビジュアル要素を追加する。<br><br>```html
<!-- Testimonials: 企業ロゴ風装飾を追加 -->
<div class="testimonials__company-badge">
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect width="48" height="48" rx="12" fill="var(--bg-tint2)"/>
    <text x="24" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="var(--c-primary)" font-family="var(--ff-en)">MG</text>
  </svg>
</div>
```<br><br>```css
/* FAQ: 背景装飾を追加 */
.faq::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139,192,202,.08), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Final CTA: 幾何学装飾 */
.final-cta__inner::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-light), transparent);
}
``` |
| 4 | プレースホルダーが残っていないか | ✅ 合格 | グレーボックス、「Image Here」、placeholder.com等のプレースホルダーは一切なし。全ビジュアルがCSS/SVG/Canvasで実体的に描画されている。 | ― |
| 5 | generate_imageの画像がビジュアルレシピのトーンと合っているか | ― N/A | generate_image（AI画像生成）は使用されていない。全ビジュアルがCSS/SVG/Canvasで構成。このアプローチ自体はテック系SaaS LPとして適切。 | ― |
| 6 | アイコンのスタイルが統一されているか | ✅ 合格 | 全アイコンがインラインSVGで統一。stroke-width: 1.5-2px、stroke-linecap: round、stroke-linejoin: round で一貫。fill: none + stroke: currentColor の線アイコンスタイルで統一。色はCSS変数 `var(--c-primary)` / `currentColor` で制御。 | ― |
| 7 | カラーパレットが全ビジュアルで統一されているか | ✅ 合格 | CSS変数で一元管理。Canvasパーティクル: `rgba(52, 98, 111, ...)` = `--c-primary`相当。ノードグリッド: `var(--c-light)` / `var(--c-primary)`。軌道: `var(--c-light)` / `var(--c-primary)`。バーチャート: `var(--c-primary)` to `var(--c-light)` グラデーション。全ビジュアルでティールパレット統一。 | ― |
| 8 | 背景装飾が最低2セクションに入っているか | ✅ 合格 | (1) Hero: グリッドライン背景（`::before`）+ Canvasパーティクル + グラデーション背景。(2) Solution（dark）: ノイズテクスチャ（`::after`）+ アンビエントグロー（`::before`）。(3) Final CTA（dark）: 同様のノイズ+グロー。3セクション以上に背景装飾あり。 | ― |
| 9 | 画像内にテキストを焼き込んでいないか | ✅ 合格 | 画像生成（generate_image）を使用していないため該当なし。全テキストがHTML/CSSで描画されており、SVG内のテキストも `aria-hidden="true"` の装飾的な文字のみ。 | ― |

**lp-graphics品質チェック合計: 5/8合格（N/A除く）、3/8部分的**

---

## 総合: 不合格項目の修正優先度リスト

### 🔴 最重要（ユーザー体験・コンバージョンに直接影響）

| 優先度 | チェック | 項目 | 対応内容 |
|---|---|---|---|
| 🔴-1 | animation #10 | CTAボタンに自動注目喚起の動きがない | `btn--primary` にシマーエフェクト追加 + sticky-ctaボタンにパルスグロウ追加。CTAのクリック率に直接影響する最重要改善。 |
| 🔴-2 | AI感 #1 | Resultsカード/Reasonsカードが均一グリッド | 強調カード（収益向上率+34.8%）を大きくするか色を変えてヒーロー数値化。視覚的ヒエラルキーを作りCVポイントへ誘導。 |

### 🟡 重要（デザイン品質・差別化に影響）

| 優先度 | チェック | 項目 | 対応内容 |
|---|---|---|---|
| 🟡-1 | graphics #3 | Testimonials/FAQ/Final CTAのビジュアル不足 | Testimonialsに企業ロゴバッジ追加。FAQに背景装飾（ラディアルグラデーション）追加。Final CTAに装飾ライン追加。 |
| 🟡-2 | AI感 #6 | Testimonials/Flowが見慣れたパターン | Testimonialsを横スクロールカルーセル化。Flowタイムラインに接続線のスクロール連動アニメーション追加。 |
| 🟡-3 | premium #5 | 画像（写真/イラスト）が一切ない | Feature セクションのビジュアル拡大。将来的にはスクリーンショットやカスタムイラストの追加でリッチさ向上。 |

### 🟢 あると尚良い（ドキュメント・プロセス品質）

| 優先度 | チェック | 項目 | 対応内容 |
|---|---|---|---|
| 🟢-1 | animation #1 | モーションレシピの明文化 | docs/motion-recipe.md を作成し、セクション別アニメーション設計を記録。今後の保守・改修時に有用。 |
| 🟢-2 | graphics #1,#2 | ビジュアルレシピ/リファレンス分析の明文化 | docs/visual-recipe.md を作成。リファレンスURLと分析結果を記録。 |

---

## サマリー

| チェックリスト | 合格 | 部分的 | 不合格 | N/A | 合格率 |
|---|---|---|---|---|---|
| 1. AI感排除 (8項目) | 6 | 2 | 0 | 0 | 75% |
| 2. プロ感加点 (6項目) | 5 | 1 | 0 | 0 | 83% |
| 3. web-animation (11項目) | 9 | 2 | 0 | 0 | 82% |
| 4. lp-graphics (9項目) | 5 | 3 | 0 | 1 | 63% |
| **合計 (34項目)** | **25** | **8** | **0** | **1** | **76%** |

**総評**: 完全不合格（❌）の項目は0件。基本的な品質水準は高い。特にアニメーション実装（prefers-reduced-motion対応、cubic-bezierイージング、カウントアップ、スタッガー等）とカラー設計は優秀。改善すべきは (1) CTAボタンの自動注目喚起、(2) グリッドレイアウトの視覚的ヒエラルキー強化、(3) テキスト主体セクションへのビジュアル補強の3点。これらを修正すれば90%以上の合格率を達成できる。
