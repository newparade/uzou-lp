# BtoB LP デザインパターン調査レポート

> 調査日: 2026-02-24
> 調査対象: SmartHR, KARTE, Sansan, freee, Yappli, Repro, HERP, Plaid(KARTE), LayerX
> 調査目的: UZOU LP v10の装飾・アニメーション・レイアウト改善のためのパターン収集

---

## 調査サマリー

### 各サイトの概要分析

| サイト | 技術スタック | ヒーロータイプ | 背景手法 | 特徴的な装飾 |
|---|---|---|---|---|
| SmartHR | Astro | イラスト×メッセージ | 白ベース + ブランドカラー帯 | カスタムイラスト、ブランドカラー（#00C4CC）の大胆使い |
| KARTE | Gatsby | プロダクトUI紹介型 | 白 + グリーン（#2AAB9F） | メガメニュー、プロダクトカードグリッド |
| Sansan | WordPress | フルワイド写真×テキスト | 写真ベース + グラデーション | TypeKit書体、ニュースフィード統合 |
| freee | Gatsby | スライダー型（写真+コピー） | 白ベース + 動画背景 | セクション区切りの大型画像、動画背景 |
| Yappli | jQuery + 独自 | フルスクリーン動画型 | Vimeo動画埋め込み | SVGタイポアニメーション、スクロール連動表示 |
| Repro | HubSpot | ロゴスライダー + CTA型 | 白 + ダーク切替 | Slickスライダー、メガメニュー、ロゴグリッド |
| HERP | Nuxt(Studio) | ミニマル + ミッション強調 | 白ベース + グラデーション | カスタムフォント（TypeSquare）、ゴシック系混在 |
| Plaid | Next.js | テキスト×抽象ビジュアル | ダーク（#181D22） + グラデーション | Gotham SSm書体、ダークモード基調、IR統合 |
| LayerX | WordPress | ミッション×プロダクト紹介 | 白ベース + FontPlus | 日本語Webフォント（FontPlus）、ベントグリッド的カード |

---

## 1. 装飾・グラフィックパターン（15パターン）

### DEC-01: カスタムイラスト型ヒーロー装飾
**使用サイト**: SmartHR, freee
**手法**: ブランド専用イラストを大胆に配置。写真ではなくイラストで世界観を統一
**CSS/JS実装**:
```css
/* イラスト要素のアニメーション出現 */
.hero__illustration {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero__illustration.is-visible {
  opacity: 1;
  transform: none;
}
```
**UZOUへの適用案**: 幾何学的なSVGイラスト（ネットワーク図）をヒーロー右側に配置
**実装難易度**: 中 / **インパクト**: 高

### DEC-02: ロゴマーキー（信頼帯）
**使用サイト**: SmartHR, Repro, Yappli, Sansan
**手法**: 導入企業ロゴを無限ループスクロールで表示。「N社以上が導入」のコピーと組合せ
**CSS/JS実装**:
```css
.logo-marquee {
  overflow: hidden;
  white-space: nowrap;
}
.logo-marquee__track {
  display: inline-flex;
  animation: marquee-slide 30s linear infinite;
}
.logo-marquee__item {
  display: inline-flex;
  align-items: center;
  padding: 0 40px;
  filter: grayscale(1);
  opacity: 0.5;
  transition: filter 0.3s, opacity 0.3s;
}
.logo-marquee__item:hover {
  filter: grayscale(0);
  opacity: 1;
}
```
**UZOUへの適用案**: 既存のマーキーを強化。ロゴ画像追加 + グレースケール→カラーのホバー
**実装難易度**: 低 / **インパクト**: 高

### DEC-03: SVG背景パターン（ドット・グリッド・サーキット）
**使用サイト**: KARTE, Plaid, LayerX
**手法**: セクション背景にSVGパターンを敷く。テック感の演出
**CSS/JS実装**:
```css
/* サーキットボード風パターン */
.bg-circuit {
  background-image: url("data:image/svg+xml,...");
  background-size: 200px 200px;
  opacity: 0.04;
}
/* ドットパターン + マスク */
.bg-dots {
  background-image: radial-gradient(circle, rgba(52,98,111,0.15) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 100%);
}
```
**UZOUへの適用案**: Aboutセクションにサーキットボード風SVGパターン追加
**実装難易度**: 低 / **インパクト**: 中

### DEC-04: グラデーションメッシュ背景
**使用サイト**: Plaid, KARTE, HERP
**手法**: 複数のradial-gradientを重ねてメッシュ状のグラデーション
**CSS/JS実装**:
```css
.bg-mesh {
  background:
    radial-gradient(ellipse at 20% 30%, rgba(139,192,202,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(52,98,111,0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(43,73,84,0.08) 0%, transparent 60%);
}
```
**UZOUへの適用案**: Solutionセクション背景をメッシュグラデーションに変更
**実装難易度**: 低 / **インパクト**: 中

### DEC-05: セクション境界のグラデーション溶解
**使用サイト**: Plaid, freee, SmartHR
**手法**: セクション間を急な線で区切らず、背景色をグラデーションで溶け合わせる
**CSS/JS実装**:
```css
.section-dissolve {
  position: relative;
}
.section-dissolve::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  height: 160px;
  background: linear-gradient(
    to bottom,
    var(--current-section-bg),
    var(--next-section-bg)
  );
  z-index: 1;
}
```
**UZOUへの適用案**: 白→ティント→白のセクション遷移を80px幅のグラデーションに
**実装難易度**: 低 / **インパクト**: 中

### DEC-06: アクセントカラーの光彩（アンビエントグロー拡張）
**使用サイト**: Plaid, KARTE
**手法**: セクション背景に大きなぼかし円を配置し、アンビエントな光を演出
**CSS/JS実装**:
```css
.section-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,192,202,0.20) 0%, transparent 70%);
  filter: blur(80px);
  animation: glowDrift 20s ease-in-out infinite alternate;
}
@keyframes glowDrift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, -20px); }
}
```
**UZOUへの適用案**: 各セクションにアンビエントグローを追加（既存の改良版）
**実装難易度**: 低 / **インパクト**: 中

### DEC-07: データビジュアライゼーション装飾
**使用サイト**: Sansan, Repro, KARTE
**手法**: ミニチャート、グラフ、フロー図をセクション内のアクセントとして配置
**CSS/JS実装**:
```css
/* ミニ棒グラフ装飾 */
.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 40px;
}
.mini-chart__bar {
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(to top, var(--c-primary), var(--c-light));
  animation: barGrow 1.2s var(--ease-reveal) forwards;
  transform-origin: bottom;
}
@keyframes barGrow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
```
**UZOUへの適用案**: Resultsセクションのカード内にミニチャートSVG追加
**実装難易度**: 中 / **インパクト**: 高

### DEC-08: 動画背景ヒーロー
**使用サイト**: Yappli, freee
**手法**: ヒーローにループ動画を背景として配置。テキストはオーバーレイ
**CSS/JS実装**:
```css
.hero-video {
  position: absolute;
  inset: 0;
  object-fit: cover;
  z-index: 0;
}
.hero-video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(31,53,62,0.85) 0%, rgba(52,98,111,0.6) 100%);
  z-index: 1;
}
```
**UZOUへの適用案**: ヒーロー背景にネットワーク接続のアニメーション動画追加（現在のCanvasに追加して代替可能）
**実装難易度**: 高 / **インパクト**: 高

### DEC-09: 幾何学的アイコンセット
**使用サイト**: LayerX, SmartHR, KARTE
**手法**: 機能紹介にストローク系のカスタムSVGアイコンを使用。線幅統一、角丸統一
**CSS/JS実装**:
```css
.feature-icon {
  width: 48px;
  height: 48px;
  stroke: var(--c-primary);
  stroke-width: 1.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
/* スクロール時のストロークドローイン */
.feature-icon path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 1s var(--ease-reveal);
}
.is-visible .feature-icon path {
  stroke-dashoffset: 0;
}
```
**UZOUへの適用案**: Featuresカードにアイコン追加。ストロークドローアニメーション付き
**実装難易度**: 中 / **インパクト**: 高

### DEC-10: ノイズ+グレインテクスチャ（ダークセクション強化）
**使用サイト**: Plaid, LayerX
**手法**: ダークセクションにSVGノイズフィルターを重ねて写真的な質感を出す
**CSS/JS実装**:
```css
.dark-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.03'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 512px;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```
**UZOUへの適用案**: CTA Strip / Final CTAのノイズテクスチャを強化（mix-blend-mode: overlay）
**実装難易度**: 低 / **インパクト**: 中

### DEC-11: 数字ハイライト装飾（大型数値＋単位分離）
**使用サイト**: SmartHR, Repro, Sansan
**手法**: 実績数値を超大型フォントで表示し、単位を小さく分離。グラデーションテキスト
**CSS/JS実装**:
```css
.stat-number {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 900;
  background: linear-gradient(135deg, var(--c-dark), var(--c-primary), var(--c-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.stat-unit {
  font-size: 0.3em;
  font-weight: 600;
  -webkit-text-fill-color: var(--c-primary);
  margin-left: 4px;
}
```
**UZOUへの適用案**: Resultsの数値表現をさらに大胆に（単位分離 + グラデーション強化）
**実装難易度**: 低 / **インパクト**: 高

### DEC-12: プロダクトカード装飾（アイコン＋グラデーションボーダー）
**使用サイト**: Repro, KARTE, LayerX
**手法**: カードの上辺にグラデーションボーダーを追加して差別化
**CSS/JS実装**:
```css
.product-card {
  position: relative;
  border: 1px solid rgba(10,26,31,0.08);
  border-radius: 16px;
  overflow: hidden;
}
.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--c-primary), var(--c-light));
}
```
**UZOUへの適用案**: Featuresカードの上辺にグラデーションボーダーを追加
**実装難易度**: 低 / **インパクト**: 中

### DEC-13: フローティングUIモック
**使用サイト**: SmartHR, KARTE, Repro
**手法**: プロダクトのUI画面をCSS製のモックとして浮遊表示
**CSS/JS実装**:
```css
.ui-mock {
  background: var(--bg-white);
  border: 1px solid rgba(10,26,31,0.12);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(10,26,31,0.08),
    0 2px 8px rgba(10,26,31,0.04);
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(0.5deg); }
}
```
**UZOUへの適用案**: Aboutセクションにダッシュボード風UIモックを追加
**実装難易度**: 高 / **インパクト**: 高

### DEC-14: テキスト装飾ハイライト（下線アニメーション）
**使用サイト**: SmartHR, HERP
**手法**: キーワードに下線またはマーカーアニメーションを付与
**CSS/JS実装**:
```css
.text-highlight {
  position: relative;
  display: inline;
}
.text-highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 0;
  height: 8px;
  background: rgba(var(--c-light-rgb), 0.3);
  border-radius: 2px;
  transition: width 0.6s var(--ease-reveal);
  z-index: -1;
}
.is-visible .text-highlight::after {
  width: 100%;
}
```
**UZOUへの適用案**: ヒーローやCTAのキーフレーズにマーカーハイライト追加
**実装難易度**: 低 / **インパクト**: 中

### DEC-15: 接続線デコレーション（SVGパス）
**使用サイト**: KARTE, Repro
**手法**: セクション間をSVGの曲線で接続し、データフローを暗示
**CSS/JS実装**:
```css
.connection-line {
  stroke: var(--c-primary);
  stroke-width: 1;
  stroke-dasharray: 8 4;
  fill: none;
  opacity: 0.3;
  animation: dashFlow 3s linear infinite;
}
@keyframes dashFlow {
  to { stroke-dashoffset: -24; }
}
```
**UZOUへの適用案**: 既存のconnection-spineを強化。破線アニメーション追加
**実装難易度**: 低 / **インパクト**: 中

---

## 2. アニメーションパターン（15パターン）

### ANI-01: スタッガードフェードイン（時間差リビール）
**使用サイト**: SmartHR, Yappli, HERP, Plaid
**手法**: 複数要素を時間差で順番にフェードイン。カードグリッドやリスト項目に効果的
**CSS/JS実装**:
```css
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease-reveal), transform 0.6s var(--ease-reveal);
}
[data-reveal-stagger].is-visible > *:nth-child(1) { transition-delay: 0ms; }
[data-reveal-stagger].is-visible > *:nth-child(2) { transition-delay: 80ms; }
[data-reveal-stagger].is-visible > *:nth-child(3) { transition-delay: 160ms; }
[data-reveal-stagger].is-visible > *:nth-child(4) { transition-delay: 240ms; }
[data-reveal-stagger].is-visible > * {
  opacity: 1;
  transform: none;
}
```
**UZOUへの適用案**: Featuresカード、Solution項目にスタッガー適用
**実装難易度**: 低 / **インパクト**: 高

### ANI-02: カウントアップ + イージング強化
**使用サイト**: SmartHR, Sansan, Repro, LayerX
**手法**: 数値がゼロから目標値まで加速→減速でカウントアップ
**CSS/JS実装**:
```javascript
// ease-out-expo イージング
function countUp(el, target, duration = 1500) {
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
```
**UZOUへの適用案**: 既存カウントアップのイージング強化 + ロケール対応（カンマ区切り）
**実装難易度**: 低 / **インパクト**: 中

### ANI-03: SVGストロークドローイン
**使用サイト**: KARTE, Plaid, Yappli
**手法**: SVGパスをスクロールに合わせて描画。フロー図やアイコンに使用
**CSS/JS実装**:
```css
.svg-draw path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  transition: stroke-dashoffset 1.2s var(--ease-reveal);
}
.svg-draw.is-visible path {
  stroke-dashoffset: 0;
}
```
```javascript
// パス長を自動計算
document.querySelectorAll('.svg-draw path').forEach(path => {
  const len = path.getTotalLength();
  path.style.setProperty('--path-length', len);
});
```
**UZOUへの適用案**: Platform Diagramの描画アニメーションを強化。パス長自動計算追加
**実装難易度**: 低 / **インパクト**: 高

### ANI-04: パララックスセクション（多層速度差）
**使用サイト**: Yappli, Plaid, freee
**手法**: 前景・背景要素をスクロール速度差で動かし奥行感を演出
**CSS/JS実装**:
```javascript
function parallax(el, speed) {
  const rect = el.getBoundingClientRect();
  const center = rect.top + rect.height / 2 - window.innerHeight / 2;
  el.style.transform = `translateY(${center * speed}px)`;
}
// 複数レイヤーに異なる速度を設定
// speed: 0.02 (ゆっくり) ～ 0.08 (速い)
```
**UZOUへの適用案**: 既存のセクションパララックスを3層化（背景装飾/コンテンツ/前景装飾）
**実装難易度**: 低 / **インパクト**: 中

### ANI-05: ホバーチルト効果（3D回転）
**使用サイト**: Plaid, KARTE, LayerX
**手法**: カードにマウスオーバーすると微妙に3D回転してライティングが変化
**CSS/JS実装**:
```javascript
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = `
    perspective(800px)
    rotateY(${x * 6}deg)
    rotateX(${-y * 6}deg)
    scale(1.02)
  `;
});
```
**UZOUへの適用案**: 既存のTestimonialsチルトをFeaturesカードにも拡張
**実装難易度**: 低 / **インパクト**: 中

### ANI-06: テキストスプリット＋ウェーブ
**使用サイト**: Yappli, HERP, Plaid
**手法**: 見出しテキストを1文字ずつ分割し、ウェーブ状に出現
**CSS/JS実装**:
```javascript
function splitText(el) {
  const text = el.textContent;
  el.innerHTML = text.split('').map((char, i) => {
    if (char === ' ') return ' ';
    return `<span style="
      display:inline-block;
      opacity:0;
      transform:translateY(30px) rotate(5deg);
      transition: opacity 0.5s ${i * 0.04}s, transform 0.5s ${i * 0.04}s;
      transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    ">${char}</span>`;
  }).join('');
  // トリガー後
  setTimeout(() => {
    el.querySelectorAll('span').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'none';
    });
  }, 200);
}
```
**UZOUへの適用案**: 既存のHeroテキストスプリットに回転を追加してウェーブ感を強化
**実装難易度**: 低 / **インパクト**: 中

### ANI-07: スクロール進捗バー
**使用サイト**: SmartHR, Sansan
**手法**: ページ上部にスクロール進捗を示す細いバーを表示
**CSS/JS実装**:
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--c-primary), var(--c-light));
  z-index: 9999;
  transform-origin: left;
  transition: transform 0.1s;
}
```
```javascript
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  bar.style.transform = `scaleX(${progress})`;
}, { passive: true });
```
**UZOUへの適用案**: ヘッダー下部にスクロール進捗バーを追加
**実装難易度**: 低 / **インパクト**: 中

### ANI-08: セクション進入時の背景色トランジション
**使用サイト**: Plaid, freee
**手法**: スクロールでセクションが画面に入ると背景色がスムーズに変化
**CSS/JS実装**:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.body.style.transition = 'background-color 0.6s';
      document.body.style.backgroundColor = entry.target.dataset.bgColor;
    }
  });
}, { threshold: 0.5 });
```
**UZOUへの適用案**: 既存のセクションカラースイッチに滑らかなトランジション追加
**実装難易度**: 中 / **インパクト**: 中

### ANI-09: ホバーボーダーグロー
**使用サイト**: KARTE, Plaid, LayerX
**手法**: カードホバー時にボーダーが光る効果。ダーク背景で特に効果的
**CSS/JS実装**:
```css
.glow-card {
  border: 1px solid rgba(139,192,202,0.1);
  transition: border-color 0.4s, box-shadow 0.4s;
}
.glow-card:hover {
  border-color: rgba(139,192,202,0.4);
  box-shadow:
    0 0 20px rgba(139,192,202,0.1),
    0 8px 32px rgba(10,26,31,0.12);
}
```
**UZOUへの適用案**: Featuresカードのホバーにグロー効果を強化
**実装難易度**: 低 / **インパクト**: 中

### ANI-10: スクロールトリガー型タイムライン進行
**使用サイト**: SmartHR, Repro, Sansan
**手法**: タイムラインの接続線がスクロールに合わせてリアルタイムに伸びる
**CSS/JS実装**:
```javascript
function updateTimeline() {
  const timeline = document.querySelector('.timeline-line');
  const steps = document.querySelectorAll('.timeline-step');
  const container = timeline.parentElement;
  const containerRect = container.getBoundingClientRect();
  const viewportCenter = window.innerHeight * 0.6;

  // スクロール位置に応じて線の長さを計算
  const progress = Math.max(0, Math.min(1,
    (viewportCenter - containerRect.top) / containerRect.height
  ));
  timeline.style.transform = `scaleY(${progress})`;
}
```
**UZOUへの適用案**: 既存Flowタイムラインの線をスクロール連動でリアルタイム伸長に変更
**実装難易度**: 中 / **インパクト**: 高

### ANI-11: マウス追従グラデーション
**使用サイト**: Plaid, KARTE
**手法**: マウスの位置に応じて背景グラデーションの中心が追従
**CSS/JS実装**:
```javascript
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});
```
```css
.interactive-bg {
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(139,192,202,0.08) 0%,
    transparent 100%
  );
}
```
**UZOUへの適用案**: ヒーロー背景にマウス追従グラデーション追加
**実装難易度**: 低 / **インパクト**: 高

### ANI-12: カルーセル型テスティモニアル
**使用サイト**: SmartHR, Repro, Yappli, Sansan
**手法**: テスティモニアルを横スクロールカルーセルで表示。自動送り+ドラッグ対応
**CSS/JS実装**:
```css
.testimonial-carousel {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.testimonial-carousel::-webkit-scrollbar { display: none; }
.testimonial-carousel__card {
  flex: 0 0 360px;
  scroll-snap-align: start;
}
```
**UZOUへの適用案**: 現在の3カラムグリッドに加え、モバイルで横スクロール対応を追加
**実装難易度**: 低 / **インパクト**: 中

### ANI-13: ページ読み込みシーケンス
**使用サイト**: Yappli, Plaid, HERP
**手法**: ページ読み込み時にロゴ→背景→テキスト→CTAの順でリビール
**CSS/JS実装**:
```css
.load-seq-1 { animation: loadReveal 0.6s 0.2s both; }
.load-seq-2 { animation: loadReveal 0.6s 0.4s both; }
.load-seq-3 { animation: loadReveal 0.6s 0.6s both; }
.load-seq-4 { animation: loadReveal 0.6s 0.8s both; }
@keyframes loadReveal {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
```
**UZOUへの適用案**: Heroセクションに読み込みシーケンス追加
**実装難易度**: 低 / **インパクト**: 中

### ANI-14: インタラクティブSVG図解
**使用サイト**: KARTE, Repro
**手法**: サービス構造をSVG図解で表現し、ホバーでハイライト切替
**CSS/JS実装**:
```javascript
const nodes = document.querySelectorAll('.diagram-node');
nodes.forEach(node => {
  node.addEventListener('mouseenter', () => {
    nodes.forEach(n => n.classList.remove('is-active'));
    node.classList.add('is-active');
    // 関連する接続線をハイライト
    const connId = node.dataset.connection;
    document.querySelectorAll(`.diagram-line[data-connection="${connId}"]`)
      .forEach(line => line.classList.add('is-active'));
  });
});
```
**UZOUへの適用案**: Platform DiagramのSVGノードにホバーインタラクション追加
**実装難易度**: 中 / **インパクト**: 高

### ANI-15: スクロールスナップセクション
**使用サイト**: Yappli, Plaid
**手法**: 各セクションがスクロールスナップでピタリと止まる（フルスクリーン演出）
**CSS/JS実装**:
```css
.snap-container {
  scroll-snap-type: y proximity;
}
.snap-section {
  scroll-snap-align: start;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
```
**UZOUへの適用案**: CTA Strip / Final CTAセクションにscroll-snap適用
**実装難易度**: 低 / **インパクト**: 中

---

## 3. レイアウトパターン（12パターン）

### LAY-01: ベントグリッド（不等サイズカード配置）
**使用サイト**: LayerX, KARTE, SmartHR
**手法**: 機能紹介を不等サイズのカードでグリッド配置。大カード+小カードの組合せ
**CSS/JS実装**:
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
.bento-card--lg { grid-column: span 7; }
.bento-card--sm { grid-column: span 5; }
.bento-card--full { grid-column: 1 / -1; }
.bento-card--half { grid-column: span 6; }
```
**UZOUへの適用案**: 既存のFeaturesベントグリッドをさらに変化（3列目に小カード2枚追加等）
**実装難易度**: 低 / **インパクト**: 中

### LAY-02: 左固定 + 右スクロール（スティッキーサイドバー）
**使用サイト**: SmartHR, KARTE, Sansan
**手法**: 左にセクション見出しを固定し、右側のコンテンツだけがスクロール
**CSS/JS実装**:
```css
.sticky-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 80px;
}
.sticky-layout__sidebar {
  position: sticky;
  top: 100px;
  align-self: start;
}
```
**UZOUへの適用案**: 既存のFAQ、Flowで使用中。Aboutセクションにも拡張可能
**実装難易度**: 低 / **インパクト**: 中

### LAY-03: フルワイドカラーバンド
**使用サイト**: Repro, Sansan, freee
**手法**: コンテンツ幅を超えて背景色がフルワイドに広がるセクション
**CSS/JS実装**:
```css
.full-band {
  position: relative;
}
.full-band::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  background: var(--band-color);
  z-index: -1;
}
```
**UZOUへの適用案**: CTA Stripの背景をフルワイドグラデーションに強化
**実装難易度**: 低 / **インパクト**: 低

### LAY-04: メガメニュー型ナビゲーション
**使用サイト**: Repro, KARTE, Sansan
**手法**: ナビゲーションのドロップダウンがフルワイドのメガメニューに展開
**CSS/JS実装**:
```css
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.98);
  backdrop-filter: blur(20px);
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s;
}
.nav-item:hover .mega-menu {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
```
**UZOUへの適用案**: 単ページLPでは不要。将来的な製品ページ展開時に検討
**実装難易度**: 中 / **インパクト**: 低

### LAY-05: CTA3連カード型
**使用サイト**: Repro, KARTE, SmartHR
**手法**: 「資料DL」「問い合わせ」「デモ」の3種CTAをカードとして横並び
**CSS/JS実装**:
```css
.cta-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.cta-card {
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(10,26,31,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.cta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(10,26,31,0.12);
}
```
**UZOUへの適用案**: CTA Stripを3連カード型にリデザイン（資料DL/問い合わせ/機能紹介）
**実装難易度**: 中 / **インパクト**: 高

### LAY-06: タブ切替コンテンツ
**使用サイト**: Repro, KARTE, SmartHR
**手法**: ユースケース/ペルソナごとにタブで切替表示
**CSS/JS実装**: 既存のSolutionタブを参照
**UZOUへの適用案**: 既に実装済み。タブ数の追加（広告主/媒体主/代理店の3タブ化）を検討
**実装難易度**: 低 / **インパクト**: 中

### LAY-07: 非対称2カラム（テキスト×ビジュアル交互）
**使用サイト**: freee, Sansan, LayerX
**手法**: 左テキスト+右画像 → 右テキスト+左画像 を交互に配置
**CSS/JS実装**:
```css
.alternate-section:nth-child(even) {
  direction: rtl;
}
.alternate-section:nth-child(even) > * {
  direction: ltr;
}
/* または grid-template-columns を反転 */
.alternate-section:nth-child(even) .grid-layout {
  grid-template-columns: 45% 55%;
}
.alternate-section:nth-child(odd) .grid-layout {
  grid-template-columns: 55% 45%;
}
```
**UZOUへの適用案**: Featuresの大カードを左右交互配置に変更
**実装難易度**: 低 / **インパクト**: 中

### LAY-08: フッター情報密度（多カラム型）
**使用サイト**: Repro, KARTE, Sansan, SmartHR
**手法**: 3-4カラムのフッターナビ + 会社情報 + SNSリンク + 法的リンク
**CSS/JS実装**: 既存の3カラムフッターで十分
**UZOUへの適用案**: 現状維持で良い
**実装難易度**: 低 / **インパクト**: 低

### LAY-09: テスティモニアル非対称グリッド（ピンタレスト型）
**使用サイト**: SmartHR, KARTE
**手法**: テスティモニアルカードの高さを不揃いにし、Masonry風に配置
**CSS/JS実装**:
```css
.testimonials-masonry {
  columns: 3;
  column-gap: 24px;
}
.testimonials-masonry__card {
  break-inside: avoid;
  margin-bottom: 24px;
}
```
**UZOUへの適用案**: 既存の3カラムグリッドをMasonry風に変更（カードの高さを不揃いに）
**実装難易度**: 低 / **インパクト**: 中

### LAY-10: 数値ハイライトセクション（横並び大数値）
**使用サイト**: SmartHR, Repro, Sansan, LayerX
**手法**: 主要KPIを4列で大きく横並び表示
**CSS/JS実装**:
```css
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid rgba(10,26,31,0.08);
  border-radius: 16px;
  overflow: hidden;
}
.kpi-item {
  padding: 40px 32px;
  text-align: center;
  border-right: 1px solid rgba(10,26,31,0.06);
}
.kpi-item:last-child { border-right: none; }
```
**UZOUへの適用案**: 既存のResults非対称レイアウトと組合せ可能（下部にKPI横並び追加）
**実装難易度**: 低 / **インパクト**: 中

### LAY-11: ロゴグリッド（導入企業ロゴ整列表示）
**使用サイト**: Repro, KARTE, SmartHR
**手法**: マーキーだけでなく、グリッド整列でも導入企業ロゴを見せる
**CSS/JS実装**:
```css
.logo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: rgba(10,26,31,0.06);
  border-radius: 12px;
  overflow: hidden;
}
.logo-grid__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-white);
}
```
**UZOUへの適用案**: マーキー下部にロゴグリッドセクション追加
**実装難易度**: 低 / **インパクト**: 中

### LAY-12: インラインフォーム CTA
**使用サイト**: SmartHR, Repro, KARTE
**手法**: ボタンクリック → 別ページ遷移ではなく、インラインでフォームを展開
**CSS/JS実装**: 既にUZOUで実装済み
**UZOUへの適用案**: 現状維持
**実装難易度**: - / **インパクト**: -

---

## 4. 実装難易度 x インパクト マトリクス

### 高インパクト × 低難易度（最優先）
| # | パターン | カテゴリ |
|---|---|---|
| ANI-01 | スタッガードフェードイン | アニメーション |
| ANI-11 | マウス追従グラデーション | アニメーション |
| DEC-02 | ロゴマーキー強化 | 装飾 |
| DEC-11 | 数字ハイライト装飾 | 装飾 |
| ANI-03 | SVGストロークドローイン | アニメーション |

### 高インパクト × 中難易度
| # | パターン | カテゴリ |
|---|---|---|
| DEC-01 | カスタムイラスト型装飾 | 装飾 |
| DEC-07 | データビジュアライゼーション装飾 | 装飾 |
| DEC-09 | 幾何学的アイコンセット | 装飾 |
| ANI-10 | スクロールトリガー型タイムライン | アニメーション |
| ANI-14 | インタラクティブSVG図解 | アニメーション |
| LAY-05 | CTA3連カード型 | レイアウト |

### 高インパクト × 高難易度
| # | パターン | カテゴリ |
|---|---|---|
| DEC-08 | 動画背景ヒーロー | 装飾 |
| DEC-13 | フローティングUIモック | 装飾 |

### 中インパクト × 低難易度（手軽に追加可能）
| # | パターン | カテゴリ |
|---|---|---|
| DEC-03 | SVG背景パターン | 装飾 |
| DEC-04 | グラデーションメッシュ | 装飾 |
| DEC-05 | セクション境界の溶解 | 装飾 |
| DEC-06 | アンビエントグロー拡張 | 装飾 |
| DEC-10 | ノイズテクスチャ強化 | 装飾 |
| DEC-12 | グラデーションボーダー | 装飾 |
| DEC-14 | テキスト装飾ハイライト | 装飾 |
| DEC-15 | 接続線デコレーション | 装飾 |
| ANI-02 | カウントアップ強化 | アニメーション |
| ANI-04 | パララックス多層化 | アニメーション |
| ANI-05 | ホバーチルト効果 | アニメーション |
| ANI-06 | テキストスプリット強化 | アニメーション |
| ANI-07 | スクロール進捗バー | アニメーション |
| ANI-09 | ホバーボーダーグロー | アニメーション |
| ANI-12 | カルーセル型テスティモニアル | アニメーション |
| ANI-13 | ページ読み込みシーケンス | アニメーション |

---

## 5. 推奨 Top 10 パターン

UZOU LP v10への適用優先度順。全てVanilla HTML/CSS/JSで実装可能。

### 1位: ANI-11 マウス追従グラデーション背景
**理由**: ヒーローのインタラクティブ性が大幅に向上。CSS変数 + mousemoveイベントのみで実装可能。既存のCanvasパーティクルと組合せるとプレミアム感が出る。
**工数**: 30分

### 2位: DEC-09 幾何学的アイコンセット + ストロークドローイン（ANI-03併用）
**理由**: Featuresカードに「顔」が欲しい。テキストだけのカードにアイコン追加+ストロークドローアニメーションで「おっ」ポイントを作れる。
**工数**: 2時間

### 3位: ANI-01 スタッガードフェードイン
**理由**: 現在のdata-revealは全要素同時リビール。スタッガー（時間差）を追加するだけでプロ感が格段に上がる。
**工数**: 30分

### 4位: DEC-11 数字ハイライト装飾
**理由**: Resultsセクションの数値をさらにインパクトのあるものに。単位分離、フォントサイズ拡大、グラデーション強化。
**工数**: 30分

### 5位: DEC-12 グラデーションボーダー（カード上辺）
**理由**: Featuresカードの差別化。CSSのみ。各カードに異なる色のグラデーションボーダーを付ければ個性が出る。
**工数**: 15分

### 6位: ANI-10 スクロールトリガー型タイムライン
**理由**: Flowセクションのタイムライン線が「ただ存在する」だけでなく、スクロールに連動してリアルタイムに伸びるとストーリー性が生まれる。
**工数**: 1時間

### 7位: DEC-07 データビジュアライゼーション装飾
**理由**: ResultsセクションにミニチャートSVGを追加。「500+」の数字の横にトレンドラインがあると説得力が増す。
**工数**: 1.5時間

### 8位: ANI-07 スクロール進捗バー
**理由**: ヘッダー直下にティールグラデーションの進捗バー。ページ全体の位置感覚が改善。
**工数**: 20分

### 9位: DEC-14 テキスト装飾ハイライト
**理由**: ヒーローの「ネイティブアド配信」やCTAの「無料で資料ダウンロード」にマーカーハイライトを追加。視線誘導に効果的。
**工数**: 20分

### 10位: ANI-13 ページ読み込みシーケンス
**理由**: Heroセクションの読み込みが一斉ではなく、バッジ→タイトル→サブコピー→CTAの順にリビールされると上質な印象。
**工数**: 30分

---

## 6. 日本のBtoB LPトレンド所見（2025-2026）

### 1. 「信頼構築ファースト」の設計
- 全サイトで「導入企業ロゴ」がファーストビューの直下に配置
- 数字（導入社数、継続率、削減率）を極めて大きく表示
- ← UZOUは既に対応済み（マーキー + Results）

### 2. タブ切替によるペルソナ分岐
- KARTE、Reproはタブで「Webマーケティング/アプリ/メール」等を切替
- 単一LPで複数ペルソナに対応する手法
- ← UZOUは広告主/媒体主のタブ切替で対応済み

### 3. ダークモードの部分使用
- Plaidのように全面ダークではなく、1-2セクションだけダーク
- 白→ダーク→白のリズムが主流
- ← UZOUは既に対応済み（CTA Strip, Final CTA）

### 4. 動画・インタラクティブ要素の増加
- Yappli、freeeで動画背景
- 静止画ベースのLPは2026年には少数派に
- ← UZOUはCanvasパーティクルで対応。さらに強化の余地あり

### 5. 日本語Webフォントの積極活用
- LayerX（FontPlus）、HERP（TypeSquare）が独自日本語フォント
- Noto Sans JP + Inter の組合せは安定だが個性に欠ける
- ← UZOUはNoto Sans JP + Interで問題ないが、見出しにOptional書体追加を検討

### 6. メガメニュー＋多層ナビゲーションの標準化
- Repro、KARTE、Sansanは複雑なプロダクト体系をメガメニューで整理
- ← UZOUは単一LPのため現時点では不要

### 7. アクセシビリティ対応の進展
- SmartHR（Astro）は構造化マークアップが充実
- WCAG AA対応はもはや前提条件
- ← UZOUはprefers-reduced-motion, :focus-visible, セマンティックHTML対応済み

---

## 7. 既存カタログとの差分

以下は既存catalog.mdに存在しない新規パターン:

| 新規パターン | カタログ追記先 |
|---|---|
| マウス追従グラデーション | G. アニメーション G-5 |
| スタッガードフェードイン | G. アニメーション G-6 |
| スクロール進捗バー | H. ナビゲーション H-4 |
| グラデーションボーダーカード | D. コンポーネント D-11 |
| テキストハイライトマーカー | E. タイポグラフィ E-6 |
| ページ読み込みシーケンス | G. アニメーション G-7 |
| スクロール連動タイムライン | G. アニメーション G-8 |
| ミニチャートSVG装飾 | D. コンポーネント D-12 |
| インタラクティブSVG図解 | D. コンポーネント D-13 |
