# LP設計書: UZOU LP v10 — Editorial Dark

---

## ブリーフ

- **業種**: AdTech / ネイティブ広告配信プラットフォーム（BtoB SaaS）
- **ターゲット**: 広告代理店のメディアバイヤー（30-40代）、事業会社マーケティング担当者、Webメディア収益責任者。ITリテラシー高め。LP慣れしており、AIテンプレ即見抜く目を持つ。
- **目的**: 資料ダウンロード（主CTA）、お問い合わせ（副CTA）
- **ブランドトーン**: プロフェッショナルだが堅すぎない / データ・テクノロジー重視 / 信頼感と先進性のバランス
- **ブランドカラー**: ライトティール `#8BC0CA` / ミドルティール `#34626F` / ディープティール `#2B4954` / ダークティール `#1F353E` / ブラック `#040404`
- **フォント**: Inter（英数字）+ Noto Sans JP（日本語）

---

## v9の問題点と解決戦略

| v9の問題 | v10の解決策 |
|---|---|
| 全セクション同一構造（label+title+コンテンツ） | セクションごとに異なる構造パターンを採用 |
| カード偏重（6セクションがカード型） | カード型を最大2セクションに限定。残りは別形式 |
| ティールグラデーションを全箇所に同じ強度で適用 | ティールを「点」で使う。7割はモノクロームのダーク |
| ヒーローのダッシュボードモックがAI生成SaaS LP典型 | ヒーローからビジュアルを「引く」。タイポグラフィで勝負 |
| 全てfade-in（下からY方向のみ） | セクションごとに異なるアニメーション手法（6種） |
| 全セクション中央揃えまたは左揃えで単調 | 意図的な非対称・クロップ・出血を複数箇所に |
| セクション間リズムが均一 | 密（情報密度高い）と疎（余白が支配的）を交互に |

---

## デザイン方針

ティールを光の「源」として扱う——広大な暗闇の中でダークティールが支配し、精密なグリッドラインが空間を区切り、ティールの光が戦略的な一点にだけ差し込む。タイポグラフィはエディトリアルマガジンのように振る舞い、コピーの密度とリズムがページに呼吸を与える。AIテンプレの「説明したがり」を捨て、各セクションが独立した「ページ」として完結するように設計する。

---

## リファレンス

1. **Linear (linear.app)** — ダーク背景での精密なグリッドライン表現、アンビエントグロー、「プロダクトが静かに主張する」構成の手本。ヒーローからダッシュボードを消す根拠として参照。
2. **Raycast (raycast.com)** — セクション単位での大胆な光（ダイアゴナルストライプ）、ガラスモーフィズムナビ、純黒背景上でのコントラスト表現。各セクションが独立した世界観を持つ設計。
3. **arflex 2025-26 Collection (arflex.co.jp)** — 「疎」の極致。余白がコンテンツになる感覚、テキストと空白のリズム、ラグジュアリーな読み体験。BtoB SaaSに「雑誌的呼吸」を持ち込む参照点。

---

## カラー・トークン

ベーステーマは既存の `style.css` を継承しつつ、使用ルールを根本から変える。

### カラー使用ルール（v10の根本変更）

```css
:root {
  /* ブランドカラー（変更なし） */
  --c-light: #8BC0CA;
  --c-primary: #34626F;
  --c-deep: #2B4954;
  --c-dark: #1F353E;
  --c-black: #040404;

  /* 背景 */
  --bg-base: #0a1215;        /* v10新規: ほぼ黒のダークティール */
  --bg-surface: #111c21;     /* v10新規: カード・パネル背景 */
  --bg-white: #ffffff;       /* ライトセクション用 */
  --bg-tint: #F0F7F8;        /* ライトセクション薄ティール */

  /* テキスト */
  --t1-dark: #e8f0f2;        /* ダーク背景上の主テキスト */
  --t2-dark: rgba(232,240,242,0.55); /* ダーク背景上のサブ */
  --t1-light: #0a1a1f;       /* ライト背景上の主テキスト */
  --t2-light: #3d5a63;       /* ライト背景上のサブ */

  /* ティールの使用量制限 */
  /* 使う場所: CTA主ボタン1か所、グラデーションテキスト1か所、アクセントライン数本のみ */
}
```

### ライト/ダーク切り替えルール

| セクション | 背景 | 理由 |
|---|---|---|
| Header | `#0a1215` → スクロール後ガラス | 没入感を最初から作る |
| Hero | `#0a1215` + グリッドライン | ダーク基調でLPの世界観を確立 |
| Media Trust | `#0a1215` | Heroからシームレスに接続 |
| About（フロー図） | `#ffffff` | 情報の明快さ。ダーク→ライトで「息継ぎ」 |
| Solution | `#0a1215` | ダーク戻し、課題の重さを空間で表現 |
| Features | `#0a1215` | ベントグリッドはダーク上で映える |
| Results | `#ffffff` | 数値はライトで清潔に見せる |
| Testimonials | `#F0F7F8` | ライトのまま余白で圧 |
| Flow | `#0a1215` | タイムラインはダーク上で縦線が映える |
| Final CTA | ティールグラデーション（`#2B4954`→`#34626F`） | LP内でティールが「解放」される唯一のセクション |
| Footer | `#040404` | 締める |

---

## セクション構成

---

### 1. ナビゲーション（Header）

- **パターン**: H-1（ガラスモーフィズムナビ）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/glass-card.css`（backdrop-filter手法の参照）
- **構造の変更点**:
  - 初期状態: 完全透明背景 + ロゴ左 + テキストリンク右 + CTAボタン右端
  - スクロール後: `backdrop-filter: blur(20px)` + `background: rgba(10,18,21,0.8)` + 下ボーダーに薄いティール線1px
  - ロゴ: 「UZOU」テキスト + ロゴマーク。スクロール後に縮小（72px → 60px）
  - ナビ項目: 5項目（UZOUとは / 特徴 / 実績 / 導入の流れ / FAQ）。ホバー時にティール下線がスライドイン
  - CTA: 「資料ダウンロード」のみをボタン化（アウトラインボタン、ホバーでティール塗りつぶし）。「お問い合わせ」はテキストリンク
- **テンプレ排除の根拠**: CTAを2ボタン並べる典型を破る。1ボタン＋1テキストリンクで視線が分散しない

---

### 2. Hero（FV）

- **パターン**: A-3（余白重視ミニマル型）をダークに読み替え + E-4（パワーコピー）の思想を適用
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/backgrounds/grid-lines.css`（`.bg-grid--dark` クラス）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/text-gradient.css`（グラデーションテキスト）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/ambient-glow.css`（ティールのアンビエント）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/stagger-in.js`（スタッガー出現）
- **トークン**: `data-theme="midnight-tech"` を参照した独自カスタマイズ（アクセントをティールに差し替え）

#### レイアウト戦略

ビジュアル要素（ダッシュボードモック）を完全に廃止する。テキストとキャンバスパーティクルのみで構成する。これがv10最大の差別化点。

```
[全幅ダーク背景: #0a1215]
[グリッドライン背景: bg-grid--dark / フェードマスク付き]
[アンビエントグロー: ティール2点 / 左上20% + 右下70%]
[Canvasパーティクル: 幾何学ノード / z-index: 0]

左寄せレイアウト（max-width: 1200px / padding-left: max(48px, 8vw)）

[バッジ行]     IT Review LEADER ● AI搭載
[主見出し]     メディア広告を         ← Inter 900 / 72-96px / letter-spacing: -0.05em
               もっとスマートに       ← 2行目にティールグラデーション適用
[ターゲット]   広告代理店・Webメディアの方へ  ← Inter 400 / 14px / letter-spacing: 0.1em / ティール色
[サブコピー]   AIが導く...            ← Noto Sans JP 400 / 18px / line-height: 1.9 / 最大540px幅
[CTA行]       [資料ダウンロード →]  [お問い合わせ]
               ↑ティール塗りボタン   ↑テキストリンク＋矢印
[安心3点]      完全無料 / 30秒で完了 / 営業電話なし

右側: なし（空白がパーティクルアニメーションの「宇宙」になる）
```

#### タイポグラフィ仕様

```
.hero__title {
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
  font-size: clamp(52px, 7.5vw, 96px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.05em;
  color: #e8f0f2;
}
.hero__title-accent {
  /* text-gradient.css の .text-gradient--static を適用 */
  /* --color-accent: #8BC0CA / --color-accent-2: #34626F */
  background: linear-gradient(135deg, #8BC0CA, #34626F);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### アニメーション

- パーティクル: Canvasノード&ライン（幾何学形状 / 三角形・六角形混在）/ 常時アニメーション / 30fps制限
- テキスト出現: スタッガー / 各行が0.1s遅延でY:-20pxからフェードイン
- バッジ: 最初に出現（delay: 0s）、見出し1行目（delay: 0.1s）、2行目（delay: 0.2s）、以降0.1s刻み
- グロー: ambient-glow.cssのアニメーション（20s無限ループ）

#### テンプレ排除の具体策

- ダッシュボードモックを完全廃止。「AIが何かを処理している」というパーティクルのメタファーで十分
- 左寄せ + 右余白の非対称構成（v9は左右対称2カラム）
- 主見出しのfont-sizeを現行の約1.5倍に引き上げる（clamp上限96px）

---

### 3. Media Trust（導入メディアマーキー）

- **パターン**: D-1（マーキー）+ D-9（ソーシャルプルーフバー）の組み合わせ
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/marquee.css`
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/social-proof.html`（数値部分のみ参照）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/counter-up.js`

#### レイアウト戦略

Heroからシームレスに接続。背景色はそのまま `#0a1215` を維持。セクション感のない「帯」として処理する。

```
[上辺: 薄いティール線 1px]
                                    ← padding: 40px 0（セクションとして独立させない）
[ラベル]   TRUSTED BY 500+ MEDIA    ← Inter 600 / 11px / 0.2em / ティール色 / 中央
[マーキー帯]  読売新聞 ● 朝日新聞 ● 東洋経済 ● 日経BP ● ORICON ● マイナビ ● Gunosy ...
              ← marquee.css を使用 / テキストのみ（ロゴ画像なし / Inter 400 / 14px）
              ← 逆方向に2列目（marquee--reverse）
[下辺: 薄いティール線 1px]
```

#### テンプレ排除の具体策

- ロゴ画像を使わない（グレースケールロゴ並びは典型的AIテンプレ）
- メディア名のテキストマーキーにする。フォントサイズと間隔で品格を作る
- 数値実績は Results セクションに集約し、ここでは繰り返さない

---

### 4. About（UZOUとは）

- **パターン**: C-5（セクションカラースイッチ）を使った白背景セクション + カスタム非対称レイアウト
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/layouts/split-hero.css`（2カラム分割の参照）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/scroll-reveal.js`（reveal手法）
- **新規CSS必要**: フロー図のSVGアニメーション（stroke-dashoffsetによる線描画）

#### レイアウト戦略（「意外性」ポイント: エディトリアル読み込み型）

このセクションはグリッドを意図的に「崩す」。左側に大きな余白を取り、右側にコピーを置く「余白圧」の構成。

```
[背景: #ffffff / ダーク→ライトの切り替わり]

grid: 1fr 1fr (desktop) / gap: 0 (意図的にゼロ)

[左カラム]                           [右カラム]
  英字縦書き                           section label: ABOUT
  "UZOU"                               h2: メディア・広告・ユーザーの
  writing-mode: vertical-rl            最適な循環をつくる。
  Inter 900 / #E8F2F4 / 超大型         ← Noto Sans JP 800 / clamp(32px,4vw,52px)
  (装飾的テキスト / aria-hidden)        ← letter-spacing: -0.03em
                                       
                                       本文（3行以内に収める）
                                       
                                       [フロー図: SVGアニメーション]
                                       広告主・代理店 ──→ UZOU ──→ メディア
                                       線が左から右へ描画されるアニメーション
```

#### タイポグラフィ仕様

```
.about__title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: #0a1a1f;
}
.about__deco {
  font-family: 'Inter', sans-serif;
  font-size: clamp(80px, 15vw, 200px);
  font-weight: 900;
  color: #E8F2F4;
  writing-mode: vertical-rl;
  line-height: 1;
  letter-spacing: -0.05em;
  user-select: none;
}
```

#### アニメーション

- フロー図のSVG線: IntersectionObserver + `stroke-dashoffset` で左から右に描画（0.8s / ease-out）
- 左の装飾テキスト: `data-parallax="-0.15"` でスクロール視差

#### テンプレ排除の具体策

- section__label + section__title + コンテンツの3層を破る。ラベルは右カラムの1要素として埋め込む
- 左カラムに「UZOU」縦書きを置く：これがv10の「おっ」ポイント1番目

---

### 5. Solution（課題解決）

- **パターン**: ダーク背景 + 左右2カラム課題リスト（タブ切替なし / 同時表示）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/backgrounds/noise-texture.css`（ダークセクションのグレイン）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/ambient-glow.css`（ティールアンビエント）
- **新規CSS必要**: 課題リストのカスタムスタイル（チェック型ではなく番号型）

#### レイアウト戦略（「密」セクション / 情報密度最大化）

カードを使わない。番号付きリストを2カラムで並べる。「箇条書きの密集」そのものが視覚的テクスチャになる。

```
[背景: #0a1215 + noise-texture + ティールアンビエント右上]

[セクション見出し: 全幅 / 中央揃え]
  h2: その課題、UZOUが解決します。
  ← Noto Sans JP 800 / clamp(36px,5vw,64px) / 白テキスト
  ← 「解決」の2文字のみティールグラデーション

grid: [Advertisers列] [Separatorライン] [Publishers列]
      1fr              1px                1fr

[Advertisers列]                    [Publishers列]
  見出し: Advertisers                見出し: Publishers
  ← Inter 600 / 13px / 0.15em / ティール色
  
  課題リスト（番号 + テキスト）:    課題リスト（同左）:
  01  新規メディア開拓の...         01  収益が頭打ちとなり...
  02  特定の媒体中心の...           02  規制やAIの影響で...
  03  成果のロジックや...           03  新施策を打ちたいが...
  04  独自性のある媒体...           04  特定プラットフォーム...
  05  CPAは維持できても...          05  データを活かした...

  ← 番号: Inter 700 / 11px / ティール色
  ← テキスト: Noto Sans JP 400 / 14px / --t2-dark
  ← 各行の上にボーダーライン（1px / rgba(255,255,255,0.08)）
  ← ホバー時に行全体がティール色に薄く光る（background: rgba(52,98,111,0.1)）

[中央区切り]: height: 100% / width: 1px / background: linear-gradient(transparent, rgba(139,192,202,0.3), transparent)
```

#### アニメーション

- reveal: `data-reveal="left"` と `data-reveal="right"` を左右に割り当て（X方向のスライドイン）
- 各行: `animation-delay` を 0.05s 刻みで設定（スタッガー効果 / 新規CSS）
- 中央区切り線: `scaleY(0→1)` のアニメーション（セクション進入時）

---

### 6. CTA Strip（3択CTA）

- **パターン**: カードではなく「水平テーブル」形式。カード型を意図的に避ける
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/glow-button.css`（`.btn-glow--outline` の参照）
- **新規CSS必要**: 水平3分割テーブル型CTA

#### レイアウト戦略（「疎」セクション）

背景白。3択を「カード」ではなく「横並びの行」として処理し、ボーダーで区切る。余白が主役。

```
[背景: #ffffff]

                    ← padding: clamp(80px,10vw,120px) 0

[3分割グリッド: 1fr 1fr 1fr / gap: 0 / border: 1px solid #E8F2F4]

[CTA-1]                    [CTA-2]                    [CTA-3]
サービス紹介資料を         費用・できることを         UZOUのUI/UXを
ダウンロードしたい         知りたい                   体験したい

↓                          ↓                          ↓

[資料ダウンロード →]       [お問い合わせ →]           [デモを申込む →]

右辺にボーダー(1px)       右辺にボーダー(1px)       ボーダーなし

```

各セルは上下に `padding: 48px 40px`。見出しは Noto Sans JP 700 / 20px / 色 `#0a1a1f`。
矢印ボタンはテキスト+SVG矢印。ティール色。ホバー時に矢印が右に8px移動。

#### テンプレ排除の具体策

- 「3連カード + ホバーシャドウ」という最も典型的なパターンを完全に破る
- ボーダーで区切られた水平テーブルという「書類的な」フォームが、B2B/AdTechの雰囲気に合う

---

### 7. Features（3つの特徴）

- **パターン**: C-4（ダークベントグリッド）+ features-bento.htmlの構造を流用
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/layouts/bento-grid.css`
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/sections/features-bento.html`（骨格参照）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/backgrounds/grid-lines.css`（`.bg-grid--dark` カード内に適用）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/glass-card.css`（大カードのガラス処理）

#### レイアウト戦略（「密」セクション）

3つの機能を等分カードで並べない。ベントグリッドで不等サイズに配置し、「AI最適化」を大カードとして圧倒的に強調する。

```
[背景: #0a1215]

[グリッド: 12カラム / gap: 12px]

[Feature-1: AI最適化配信エンジン]              [Feature-2: 高収益メディア]
grid-column: 1 / 8  (7/12)                      grid-column: 8 / 13 (5/12)
grid-row: 1                                     grid-row: 1
高さ: 380px                                     高さ: 380px

内容:                                           内容:
- 大型SVGアイコン（AI/ネットワーク）           - アイコン
- タイトル: AI最適化配信エンジン               - タイトル
- 本文3行                                       - 本文2行
- 下部に擬似パフォーマンスグラフ               - 「直接取引」の図解SVG
  （CSSアニメーション / バーチャート）
- glass-card.css適用

[Feature-3: ワンストップ]
grid-column: 1 / 13 (フル幅)
grid-row: 2
高さ: 240px（横長）
内容: アイコン + タイトル + 本文 / 右側に5ステップのミニフロー図
```

#### タイポグラフィ仕様

```
.feature-card__number {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #34626F;  /* ティール / ラベル代わり */
  text-transform: uppercase;
}
.feature-card__title {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: #e8f0f2;
  margin-top: 8px;
}
```

#### アニメーション

- カード出現: `data-stagger="0.12"` でカード3枚を時間差スタッガー（純粋なY方向）
- Feature-1のバーチャート: IntersectionObserver で高さアニメーション発動
- ホバー: `border-color` がティールに変わる（0.25s / bento-grid.cssのデフォルトを継承）

---

### 8. Results（実績数値）

- **パターン**: ライト背景 + 4カラム数値表示（D-9のsocial-proofを参照しつつ独自化）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/counter-up.js`
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/text-gradient.css`（数値にグラデーション適用）

#### レイアウト戦略（「疎」セクション / タイポグラフィが主役）

カードなし。数値を「ただ置く」。数値の圧倒的なサイズと余白だけで完結させる。

```
[背景: #ffffff]

上部パディング: 120px
下部パディング: 100px

[4カラム: 1fr 1fr 1fr 1fr / 各列中央揃えではなく左揃え]

[列1]              [列2]              [列3]              [列4]
500+               3.5億+             50億+              +34.8%
導入メディア数     月間IMP            月間広告            平均収益
                                      リクエスト          向上率

数値:
  Inter 800 / clamp(48px,7vw,88px) / ティールグラデーション(text-gradient--static)
  data-count属性でカウントアップ

単位 (+, 億+, %):
  Inter 400 / clamp(24px,4vw,48px) / color: #3d5a63

ラベル:
  Noto Sans JP 400 / 14px / line-height: 1.6 / color: #567078
  Interのセクションラベルを上に置く（"MEDIA COUNT" / "MONTHLY IMP" 等）
```

#### 列間区切り

右辺に `border-right: 1px solid #E8F2F4`（最終列除く）。縦線が4列を区切る。

#### アニメーション（「おっ」ポイント2番目）

数値が0から上昇するカウントアップに加え、数値テキストが一瞬「ブラー」から鮮明になるエフェクトを追加する。

```css
.result-number {
  animation: blurReveal 0.6s ease-out forwards;
  opacity: 0;
}
@keyframes blurReveal {
  from { opacity: 0; filter: blur(8px); }
  to   { opacity: 1; filter: blur(0); }
}
/* IntersectionObserver でis-visibleクラス付与時に発動 */
```

---

### 9. Testimonials（導入企業の声）

- **パターン**: ライトティント背景 + 水平スクロールなしの縦2列グリッド
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/scroll-reveal.js`（reveal）
- **新規CSS必要**: テスティモニアルカードの独自スタイル

#### レイアウト戦略（カード型を最小限で使う / 全体でカード型は2箇所目）

```
[背景: #F0F7F8]

[見出し: 左揃え / 余白で非対称を強調]
  Inter 11px / 0.18em / ティール: TESTIMONIALS
  Noto Sans JP 800 / clamp(28px,4vw,44px) / 黒: 実際に使われている言葉

[グリッド: 2カラム / 3行 = 最大6件]
各カード:
  背景: #ffffff
  border-left: 3px solid #34626F  ← カードの「顔」はこの左ティールライン
  padding: 28px 32px
  radius: 0  ← 意図的に角丸ゼロ（border-radiusを使わない）
  shadow: なし
  
  「"」引用符: Inter 900 / 48px / ティール / opacity: 0.15（装飾）
  テキスト: Noto Sans JP 400 / 15px / line-height: 2
  会社名: Noto Sans JP 700 / 13px / ティール
  役職: Noto Sans JP 400 / 12px / gray
```

#### テンプレ排除の具体策

- `border-radius: 0` + `box-shadow: なし` = 「カードっぽさ」を消す
- 左ボーダーラインのみでブロックを定義する（新聞の引用ブロック的な処理）

---

### 10. Flow（導入の流れ）

- **パターン**: ダーク背景 + 縦方向タイムライン（左辺の縦線 + 右に内容）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/backgrounds/noise-texture.css`
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/scroll-reveal.js`（各ステップのreveal）
- **新規CSS必要**: 縦タイムライン（左線 + 丸アイコン + 内容）

#### レイアウト戦略（エディトリアル「インタビュー記事」的な読み体験）

典型的な「横5カラムのステップアイコン」をやめる。縦タイムラインに切り替えることで、読者は「読む」体験をする。

```
[背景: #0a1215 + noise-texture]

[左右分割: 最大480px テキストブロック / 右側は背景装飾]

[左辺の縦線: width: 1px / background: linear-gradient(#34626F, #1F353E) / height: 100%]

STEP 01
  ├── [丸: 直径16px / border: 1px solid #34626F / bg: #0a1215] ← 縦線上に配置
  │
  ヒアリング
  課題と目標のヒアリング

  ↓（50px間隔）

STEP 02
  ├── [丸]
  │
  ご提案
  ...（以下5ステップ繰り返し）

番号: Inter 700 / 11px / 0.15em / ティール
タイトル: Noto Sans JP 700 / 22px / #e8f0f2
説明: Noto Sans JP 400 / 14px / --t2-dark / line-height: 1.9
```

#### アニメーション

- 各ステップ: `reveal` で下から出現（0.15s 間隔スタッガー）
- 縦線: `scaleY(0→1)` / `transform-origin: top center` / スクロール連動で伸びていく演出（IntersectionObserverで発動）

---

### 11. Reasons（選ばれる理由）

- **パターン**: ライト背景 + 非対称2×2グリッド（左列が広い）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/layouts/bento-grid.css`（グリッド参照）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/animations/scroll-reveal.js`
- **新規CSS必要**: 非対称グリッドの独自設定

#### レイアウト戦略（「疎」を意識 / 4カードを不均等配置）

「4連等分カード」という最もテンプレな構成を崩す。

```
[背景: #ffffff]

[グリッド: grid-template-columns: 2fr 1fr 1fr]

[Reason-1: 独自の商流基盤]              [Reason-2]   [Reason-3]
grid-column: 1 / 2 (大)                  各1カラム    各1カラム
grid-row: 1 / 3 (縦に2行分)

大カードの内容:
- 番号: 01
- タイトル（大）
- 本文（3-4行）
- SVG図解（商流フロー）

[Reason-4: 専任サポート]
grid-column: 2 / 4 (残り2カラム横長)
grid-row: 2
```

各カードのデザイン:
- 背景: `#F8FAFB`（ほぼ白）
- 上辺: `border-top: 2px solid #E8F2F4`（ライトティール）
- ホバー時: `border-top-color: #34626F` に変化（0.3s）
- radius: 4px（小さく）
- 番号: Inter 900 / 11px / ティール / 装飾的

---

### 12. FAQ

- **パターン**: ライト背景 + アコーディオン形式
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/faq-accordion.html`
- **新規CSS必要**: ティールブランドに合わせたスタイリング

#### レイアウト戦略（最もシンプルに処理する / 装飾排除）

FAQは「読まれるもの」。装飾一切なし。

```
[背景: #F0F7F8]

[2カラム: 左280px見出し / 右アコーディオンリスト]

[左: 見出しエリア]
  FREQUENTLY ASKED
  QUESTIONS
  ← Inter 700 / 13px / ティール + 黒の組み合わせ

[右: アコーディオン5問]
  各行: padding 24px 0 / border-bottom: 1px solid #E8F2F4
  質問: Noto Sans JP 700 / 16px / #0a1a1f
  + / − アイコン: ティール色 / アニメーション回転（0.3s）
  回答: Noto Sans JP 400 / 15px / #3d5a63 / line-height: 1.9
  開閉: max-height トランジション（0.35s ease-in-out）
```

#### テンプレ排除の具体策

- 左右2カラム分割でFAQを配置する構成（典型的な「FAQ全幅中央揃え」を崩す）

---

### 13. Final CTA

- **パターン**: ティールグラデーション背景（LP内でティールが「解放」される唯一の場所）
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/sections/cta-gradient.html`（骨格参照）
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/backgrounds/noise-texture.css`
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/components/glow-button.css`（`.btn-glow--outline` / 白ボタン）

#### レイアウト戦略（「おっ」ポイント3番目 / カラーの解放）

LP全体を通じてティールを抑制的に使ってきたことで、このセクションでの解放が最大のインパクトになる。

```
[背景: linear-gradient(135deg, #1F353E 0%, #2B4954 50%, #34626F 100%) + noise-texture]

[中央揃え / padding: clamp(100px,13vw,160px) 0]

[大型コピー]
  広告パフォーマンスを
  次のステージへ。
  ← Noto Sans JP 900 / clamp(40px,6vw,72px) / #ffffff
  ← letter-spacing: -0.03em

[サブ]
  まずはお気軽にご相談ください。
  ← Noto Sans JP 400 / 18px / rgba(255,255,255,0.75)

[CTAボタン行]
  [資料ダウンロード]       [お問い合わせ]
  白塗りボタン(pill型)     アウトラインボタン(pill型 / 白枠・白文字)

[安心3点]
  ✓ 完全無料  ✓ 30秒で完了  ✓ 営業電話なし
  ← Inter 400 / 13px / rgba(255,255,255,0.6)
```

#### アニメーション

- 背景にノイズテクスチャ（静的）
- 大型コピー: スタッガー出現（行ごとに0.12s遅延）
- ボタン: `btn-glow` のホバーグロー（白のシマーエフェクト継続）

---

### 14. Footer

- **パターン**: `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/sections/footer-modern.html` を参照
- **スニペット**:
  - `/Users/mackee/.gemini/antigravity/knowledge/lp-assets/snippets/sections/footer-modern.html`

#### レイアウト戦略

```
[背景: #040404]
[上辺: 1px solid rgba(139,192,202,0.15)]

[4カラム: ロゴ+コピー / サービス / サポート / 企業情報]

[固定CTAバー: Hero通過後に出現]
  背景: rgba(10,18,21,0.95) + blur(20px)
  内容: 「メディア広告をスマートに」+ [資料ダウンロード] ボタン
  位置: 下辺固定
```

---

## アニメーション全体戦略（セクション別マッピング）

v9との最大の違い: **全セクション同一手法を廃止**。6種のアニメーション手法を使い分ける。

| セクション | アニメーション手法 | スニペット |
|---|---|---|
| Hero | テキストスタッガー（Y: -20px / opacity） + Canvas パーティクル | `stagger-in.js` |
| About | パーティクルY視差 + SVGラインドロー（strokeDashoffset） | `parallax.js` + 新規 |
| Solution | X方向スライドイン（左列: 左から / 右列: 右から） | `scroll-reveal.js` カスタム |
| Features | スタッガー（Y方向 / 通常のfade） + バーチャート描画 | `stagger-in.js` + 新規 |
| Results | ブラーリビール + カウントアップ | 新規 + `counter-up.js` |
| Flow | 縦タイムライン線の伸び（scaleY） + ステップfade | 新規 + `scroll-reveal.js` |
| Final CTA | スタッガー（行ごと / Y: -30px） | `stagger-in.js` |

---

## タイポグラフィ全体仕様

### スケール定義（v10）

```
9xl: clamp(52px, 7.5vw, 96px)  — Hero見出し
8xl: clamp(40px, 6vw, 72px)   — Final CTA見出し
7xl: clamp(36px, 5vw, 64px)   — Solution見出し
6xl: clamp(32px, 4vw, 52px)   — About見出し
5xl: clamp(28px, 4vw, 44px)   — セクション見出し標準
4xl: clamp(22px, 3vw, 32px)   — サブ見出し
3xl: clamp(18px, 2.5vw, 24px) — カードタイトル
2xl: 20px                      — Feature カードタイトル
base: 16px                     — 標準本文（Noto Sans JP）
sm: 14px                       — 補助テキスト
xs: 13px                       — バッジ・ラベル
xxs: 11-12px                   — セクションラベル（uppercase）
```

### ウェイト使用ルール

- **900**: Hero見出し、Final CTA見出しのみ
- **800**: Abouth2、Resultsの大見出し
- **700**: セクション標準見出し、FAQ質問、カードタイトル
- **600**: ナビリンク、セクションラベル
- **400**: 全本文、サブテキスト

### 日英使い分け

- 見出し: Noto Sans JP（日本語LP / ターゲット30-40代）
- 数値・ラベル・英字キャプション: Inter
- 混合（日英混在コピー）: `font-family: 'Inter', 'Noto Sans JP', sans-serif`

---

## 非対称性の実装箇所（v10のanti-template宣言）

1. **Hero**: 右側ビジュアルを廃止 → 非対称キャンバス空間
2. **About**: 左に装飾縦書き「UZOU」+ 右にコンテンツ（左:右 = 1:1だが視線誘導は非対称）
3. **Reasons**: 2fr-1fr-1fr + 1-to-row-2のベントグリッド
4. **Features**: 7/12 + 5/12の分割 + フル幅行の混在
5. **Results**: 4列左揃え（中央揃えを破る）
6. **FAQ**: 左固定見出し + 右アコーディオンの2カラム分割

---

## 特記事項

### 技術制約への対応

- **stagger-in.jsはGSAP依存**: GSAPは使用不可のため、IntersectionObserver + CSS `animation-delay` による独自実装に変換。`data-stagger` 属性を使った同等機能をVanilla JSで実装する。
- **scroll-reveal.jsのGSAP版は除外**: Vanilla JS版（GSAP不要版）のみ使用。
- **parallax.js**: Vanilla JS版を使用。`requestAnimationFrame` ベースの実装で問題なし。

### レスポンシブ対応の優先順位

1. Hero見出しは `clamp()` で自動スケール。768px以下では `font-size: 52px` 固定
2. Resultsの4カラムは768px以下で2×2グリッドに変換
3. About・FAQ・Reasonsの2カラムは768px以下で1カラムに変換
4. Solution 2カラムは768px以下で縦積みに。Separatorラインは非表示
5. Featuresベントグリッドは768px以下で全て1カラムに変換

### アクセシビリティ対応

- About の縦書き「UZOU」には `aria-hidden="true"` を付与
- カウントアップ数値には `aria-label` で最終値を明示
- カラーコントラスト: ダーク背景上の `--t2-dark: rgba(232,240,242,0.55)` は WCAG AA 要確認。4.5:1を下回る場合は `rgba(232,240,242,0.7)` に修正
- `prefers-reduced-motion`: Canvas パーティクル停止 / アンビエントグロー停止 / SVGラインドロー即時表示 / カウントアップ即時最終値表示

### 既存コードとの差分概要

asset-assembler が参照すべき変更点:

1. `style.css`: CSS変数に `--bg-base: #0a1215` と `--bg-surface: #111c21` を追加。ヒーローの `bg-white` を `bg-base` に変更
2. `index.html`: Hero の `.hero__visual` / `.hero__dashboard` ブロックを完全削除。各セクションのHTML構造を設計書通りに再構築
3. `script.js`: `stagger-in.js` のGSAP依存部分をVanilla JS版に置換。`counter-up.js` のVanilla版を流用。`parallax.js` のVanilla版を流用

