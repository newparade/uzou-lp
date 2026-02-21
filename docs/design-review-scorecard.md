# デザインレビュー スコアカード: UZOU LP v9

**レビュー日**: 2026-02-22
**レビュー対象**: UZOU LP v9（Geometric Flow）
**比較リファレンス**: Linear.app / Stripe Sessions / Vercel.com
**採点基準**: Awwwards配点（Design 40%/UX 30%/Creativity 20%/Content 10%）+ FWA技術品質基準 + Nielsen/Rams/Apple原則の統合

---

## Phase 2: 7軸スコアリング

| # | 評価軸 | 配点 | スコア | ランク | 一言 |
|---|---|---|---|---|---|
| 1 | ファーストインプレッション | /20 | **12** | B | ダッシュボードモック+パーティクルの試みはあるが「息を呑む」には遠い |
| 2 | ビジュアルクオリティ | /20 | **12** | B | 余白・タイポ・カラーの基本はできているが磨き込みが足りない |
| 3 | 情報設計 | /15 | **11** | A | ストーリーフローは論理的。CTA配置も適切 |
| 4 | インタラクション＆モーション | /15 | **10** | B | パーティクル・カウントアップ・スタッガーはあるが、全体的に控えめ |
| 5 | ブランド一貫性 | /10 | **7** | A | ティールパレットは全セクション統一。フォント/アイコンも一貫 |
| 6 | UI/UXディテール | /10 | **5** | B | フォーカス表示なし。フォームなし。レスポンシブは基本対応のみ |
| 7 | 技術品質 | /10 | **6** | B | セマンティクスに穴あり（main要素なし）。CSS変数は整備されている |
| **合計** | | **/100** | **63** | **B** | |

**ランク**: B（60-74）

> S(90-100) / A(75-89) / B(60-74) / C(40-59) / D(0-39)

---

## Phase 2: 各軸の詳細採点根拠

### 軸1: ファーストインプレッション — B (12/20)

**チェック結果**:
- [x] ヒーローに動的要素（Canvasパーティクル + ダッシュボードモック + チャートSVGアニメーション）
- [ ] 3秒以内にブランドの世界観が伝わるか → **部分的**。ティール系の色は伝わるが「広告プラットフォーム」の世界観が視覚的に弱い。ダッシュボードモックは小さく、パーティクルは薄い
- [ ] 同業他社と並べたときに明確に差別化されているか → **NO**。BtoB SaaS LPの「テキスト左+ビジュアル右」は最も典型的なパターン。レイアウト自体に独自性がない
- [x] カラーが戦略的（5色以上のカラーシステム）→ ティール系5色+背景3色+テキスト3色
- [ ] キャッチコピーが感情を動かすか → **弱い**。「メディア広告をもっとスマートに」は説明的で感情を動かさない。Linearの「Linear is a better way to build products」のような短く力強いコピーと比較すると弱い
- [x] テキスト+ボタンだけのヒーローではないか → ダッシュボードモック+パーティクルがある

**減点要因**:
- パーティクルのopacityが低すぎて（0.12-0.15）ほぼ見えない。「動的要素がある」というだけで印象には残らない
- ダッシュボードモックは作り込まれているがサイズが小さく、ヒーローの主役になりきれていない
- ヒーローの背景グラデーションが微弱すぎて、ほぼ白に見える
- バッジ（IT Review LEADER / AI搭載）が小さすぎてインパクトがない

### 軸2: ビジュアルクオリティ — B (12/20)

**チェック結果**:
- [x] タイポグラフィが4階層以上 → display(64px)/h2(46px)/h3(34px)/body(16px)/caption(12px) の5階層
- [x] Webフォント + letter-spacing/line-height 調整 → Inter+Noto Sans JP、letter-spacing: -.04em（見出し）、line-height: 1.8（本文）
- [ ] 余白に3段階のリズム → **部分的**。セクション間はclamp(88px,11vw,148px)で良好。しかしグループ間・要素間の差が明確でない箇所あり
- [x] 背景に質感 → ダークセクションにノイズテクスチャ+アンビエントグロー、ヒーローにグリッドライン
- [ ] カードやセクションに奥行き → **基本レベル**。shadowは定義されているが3段階(sm/md/lg)のみ。Linearのような多層的な奥行き感がない
- [ ] 全要素が同サイズ/同間隔で並んでいないか → **NG箇所あり**。Results 4枚、Reasons 4枚、Testimonials 3枚がすべて均一サイズ。Featured カードが1枚だけscale(1.04)されているが不十分
- [x] 数値データが強調されているか → Results数値はグラデーションテキスト+大フォント(56px)
- [ ] WCAG AA準拠コントラスト比 → **要検証**。`--t2: #3d5a63` on `--bg-white: #fff` は約5.4:1でAA通過。`--t3: #6b8a94` on white は約3.2:1で**通常テキストはNG**（4.5:1必要）。hero__trust, section__label等で使用

**減点要因**:
- セクション区切りが背景色の切り替えのみ。波形/斜め/グラデーション遷移なし。「直線1本の区切り」に相当（AI感パターン#12）
- テスティモニアルのアバターがイニシャルテキストのみ。顔写真なし（社会的証明の信頼性低下）
- feature__numの72pxは大きいが、グラデーションが`--bg-tint2`→`--bg-tint`（ほぼ同色）で薄すぎて見えない
- Linearはカード内にアイコン+ラベル+値+ミニチャートを緻密に配置するが、UZOU LPのカードは情報密度が低い

### 軸3: 情報設計 — A (11/15)

**チェック結果**:
- [x] 最重要情報が最も目立つ → ヒーローのh1が最大フォント、CTAが目立つ
- [x] CTA位置・繰り返し・テキストが最適 → Hero/CTA Strip/Final CTA/Sticky CTAの4箇所。テキストは「資料ダウンロード」「お問い合わせ」
- [x] 課題→解決→証拠→行動のストーリー → About(概要)→Solution(課題提示)→Features(解決策)→Results(証拠)→Testimonials(社会的証明)→Flow(行動への道筋)→CTA
- [x] 1セクション1メッセージ → 各セクションが明確に1トピック
- [x] Z型/F型の視線パターン → ヒーローはF型、Feature部は左右交互のZ型
- [x] スキャン可能なコンテンツ → 番号付きリスト、短い説明文、バッジ

**減点要因**:
- CTAテキストが「資料ダウンロード」「お問い合わせ」のまま。アクション指向が弱い。「無料で資料を受け取る」「3分で分かるUZOU」等の方がCVR向上が期待できる
- 導入企業ロゴが一切ない。権威・社会的証明の「ロゴ並べ」セクションの欠如はBtoB LPとして致命的
- Solution→CTA Strip→Features の流れで、課題提示直後にCTAが来るのは良いが、CTA Stripの3枚が全て同じデザインで優先度の差がない
- hero__trustの「完全無料/30秒で完了/営業電話なし」は良いが、フッターのCTAにも同じものがある程度で、ページ中間にはない

### 軸4: インタラクション＆モーション — B (10/15)

**チェック結果**:
- [x] 全セクションにスクロール連動アニメーション → `.reveal`クラスで全セクション対応
- [x] スタッガー（時間差50-100ms）あり → nth-child(2): 80ms, (3): 160ms, (4): 240ms
- [ ] 全ボタン/リンクに独自ホバーエフェクト → **部分的**。ボタンはtranslateY(-2px)+shadow。ナビリンクは下線アニメーション。しかしFAQやフッターリンクはcolor変化のみ（AI感パターン#14）
- [x] cubic-bezierカスタムイージング → `cubic-bezier(.16,1,.3,1)` を一貫使用
- [x] 背景に最低1つの動的装飾 → Canvasパーティクル + ダークセクションのambientDriftアニメーション
- [ ] CTAに注目を引く動き → **あるが弱い**。shimmerエフェクトはあるが、animation-delay: 2sで遅く、透明度0.2で薄い。Linear/Stripeのような「思わず押したくなる」CTAには程遠い
- [x] 数値にカウントアップアニメーション → easeOutExpoでスムーズ
- [x] prefers-reduced-motion対応 → CSS/JS両方で対応
- [ ] 2024-2025トレンド技法が1つ以上 → **弱い**。テキストスタッガー（行単位表示）はあるが、モーフィング/タイポグラフィックアニメーション/シネマティックスクロール等のトレンド技法は未使用

**減点要因**:
- revealアニメーションが`translateY(36px)+opacity`の1パターンのみ。Linearは要素ごとに異なるアニメーション（スケール、回転、スライド方向の変化）を使い分ける
- マグネティックボタンはあるが、吸い付き量(0.15)が控えめすぎて体感できない
- Flowタイムラインの接続線アニメーションはheight遷移のみで、ステップごとの順次アニメーションがない
- パーティクルの動きが遅く単調（直線移動+バウンスのみ）。StripeやLinearのような有機的で美しい背景動画/アニメーションと比べると見劣りする
- ダッシュボードモックのホバー時のtransform変化が微弱すぎる（-3deg→-0.5deg）

### 軸5: ブランド一貫性 — A (7/10)

**チェック結果**:
- [x] カラーが全セクションで同一パレット → ティール系5色が全セクションで一貫
- [x] フォントのサイズ/ウェイト/間隔が全体でルール化 → CSS変数+一貫したclamp()
- [ ] アイコン/イラスト/画像スタイルの統一 → **概ね統一**。SVGストロークアイコンで統一。しかしstroke-widthが1.5/2の混在あり
- [x] ダークパターン排除 → 該当なし

**減点要因**:
- アイコンのstroke-widthが1.5px(ナビ・CTA Strip)と2px(About・Reasons)で不統一
- ヒーローバッジのスタイル（pills型）が他のセクションで再利用されず、デザインシステムとして浮いている
- セクションラベル（"About", "Features"等）の英字キャプションは統一されているが、Solutionセクション内の"Advertisers"/"Publishers"タグは異なるスタイル

### 軸6: UI/UXディテール — B (5/10)

**チェック結果**:
- [x] ボタンにカスタムデザイン → グラデーション背景+shimmer+マグネティック
- [ ] コントラスト比WCAG AA以上 → **NG**。`--t3: #6b8a94` on white = 約3.2:1（通常テキスト4.5:1未達）。hero__trust, footer__company, section__label等で使用
- [ ] レスポンシブ全ブレークポイント最適化 → **基本対応のみ**。3ブレークポイント（1024px/768px/480px）。しかしタブレット横向き（1024-1280px）の中間サイズが未最適化。ダッシュボードモックが1024pxで唐突にtransform:noneになる
- [ ] フォーカス表示あり（キーボードナビゲーション） → **完全欠如**。CSSに`:focus`や`:focus-visible`のスタイルが一切ない。WCAG 2.4.7違反

**減点要因**:
- フォーカス表示の完全欠如はアクセシビリティの根幹に関わる重大な問題
- フォームUIが存在しない。「資料ダウンロード」「お問い合わせ」のCTAがアンカーリンク（#download, #contact）のみで遷移先がない
- FAQのdetails/summaryにネイティブのブラウザスタイルが残っている（マーカー非表示は対応済みだが、フォーカスリングなし）
- モバイルでのハンバーガーメニューにフォーカストラップがない。ESCキーでの閉じる操作もない
- sticky CTAの`backdrop-filter: blur(14px)`がFirefoxで非対応だった時期のフォールバックがない（現在は対応済みだが、古いバージョンの考慮なし）

### 軸7: 技術品質 — B (6/10)

**チェック結果**:
- [x] アニメーション transform/opacity のみ 60fps維持 → `.reveal`はtranslateY+opacityのみ。ただしFAQアコーディオンで`max-height`アニメーションを使用（レイアウトリフロー発生）
- [ ] セマンティックHTML → **穴あり**。h1は1つ（良い）。section/nav/header/footer使用（良い）。しかし**`<main>`要素が完全に欠如**。全セクションが`<body>`直下に配置されている。スクリーンリーダーのランドマークナビゲーションに支障
- [x] CSS変数でデザイントークン管理 → カラー/フォント/スペース/角丸/影の全てがCSS変数化

**減点要因**:
- `<main>`要素の欠如（WCAG 1.3.1, 2.4.1違反）
- FAQのmax-heightアニメーションはレイアウトプロパティのアニメーションであり、60fps維持の原則に反する
- 画像がWebP/AVIF形式でない（画像自体がないが、OGP画像等の考慮なし）
- lazy loadingの指定なし（現状は画像がないため実害は少ないが、ダッシュボードモックのSVGチャート等にloading属性がない）
- Canvasパーティクルのdraw()関数でN^2のライン描画ループ（O(n^2)）。60個のパーティクルで1770回の距離計算が毎フレーム走る。デバイスによってはパフォーマンス影響あり
- CSSの圧縮/minifyがされていない（本番環境でのファイルサイズ最適化不足）

---

## Phase 3: 容赦ない分析（B以下の全軸）

---

## 💀 軸1: ファーストインプレッション — B (12/20)

### なぜこのスコアなのか（辛辣に）

ヒーローを開いた瞬間の感想は「ああ、BtoB SaaSのLPね」で終わる。左にテキスト、右にモックUI。このレイアウトは2020年から何千ものSaaS LPで使い古されたパターンであり、**独自性ゼロ**。Canvasパーティクルは技術的には存在するが、opacity 0.12-0.15で描画されているため**肉眼でほぼ認識できない**。つまり「動的要素がある」と言えるだけで、実際の視覚的インパクトは皆無。

キャッチコピー「メディア広告をもっとスマートに」は**説明文であって訴求ではない**。「スマートに」は何の感情も喚起しない曖昧な形容詞。ターゲットであるメディアバイヤーの30-40代が「これだ」と思う瞬間が作れていない。

ダッシュボードモックは作り込まれているが、perspective(-3deg)の微妙な傾きが中途半端。Linearのヒーローのように**画面の主役として圧倒的な存在感**を持つか、Vercelのようにテキスト自体を主役にするか、どちらにも振り切れていない。

### リファレンスとの差

| 観点 | ❌ UZOU LP v9 | ✅ リファレンス | 差の本質 |
|---|---|---|---|
| ヒーロー構造 | テキスト左+モックUI右の2カラム | Linear: フルスクリーン+巨大タイポ+背景アニメーション / Vercel: 中央配置+コマンドライン風デモ | レイアウト自体に個性がない |
| 背景演出 | 薄すぎるCanvasパーティクル（opacity 0.12） | Linear: 光の波紋/グロー / Stripe: 鮮やかなグラデーションメッシュ | 背景が「ある」だけでは不十分。**体感できる**レベルが必要 |
| コピーの強さ | 「メディア広告をもっとスマートに」（説明） | Linear: "Linear is a better way to build products"（断言） / Stripe: "Financial infrastructure for the internet"（定義） | 説明vs訴求。感情を動かすか否か |
| 3秒テスト | 「何かのSaaS LP」としか認識できない | 各リファレンスは3秒で「ここは違う」と思わせる | ブランドの世界観が視覚に刻まれない |
| バッジ/信頼要素 | 小さなpillsバッジ2個（IT Review LEADER, AI搭載） | Stripe: Fortune 500企業のロゴ群 / Vercel: "Trusted by..." + 大手ロゴ | 権威の提示が弱すぎる |

### 🔴 改善指示（優先度順・全て必須）

1. **パーティクルの視認性を大幅強化** → opacity基準値を0.15→0.35に、接続線を0.12→0.25に。パーティクルサイズを1.5-4→3-6に拡大。接続距離を140→200に。色をhsla→rgba(139,192,202, alpha)でブランドカラーに直結させる
```javascript
// script.js の initParticles() 内
const COUNT = 80;        // 60→80
const CONNECT_DIST = 200; // 140→200
const SPEED = 0.45;       // 0.35→0.45
// パーティクル生成時
alpha: Math.random() * 0.4 + 0.25  // 0.3+0.15 → 0.4+0.25
size: Math.random() * 3.5 + 2.5    // 2.5+1.5 → 3.5+2.5
// ライン描画時
const opacity = (1 - dist / CONNECT_DIST) * 0.25; // 0.12→0.25
```

2. **ヒーロー背景のグラデーションを強化** → 現在の`#f9fdfe→#F0F7F8→#E8F2F4`は差がなさすぎる。ティールのグローを追加
```css
.hero {
  background:
    radial-gradient(ellipse at 70% 30%, rgba(139,192,202,.15) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 70%, rgba(52,98,111,.08) 0%, transparent 50%),
    linear-gradient(165deg, #f9fdfe 0%, #E8F2F4 40%, #d8edf2 100%);
}
```

3. **キャッチコピーの訴求力強化** → 「メディア広告をもっとスマートに」を「広告収益を、AIが変える。」等の短く断言的なコピーに変更。感情（期待/危機感）を喚起する文言に

4. **ヒーロー直下に導入企業ロゴセクション追加** → "200+ メディアが導入" のテキスト + ロゴ6-8個の横並び
```html
<div class="hero__logos">
  <p class="hero__logos-label">導入メディア200+</p>
  <div class="hero__logos-grid">
    <!-- ロゴSVG or グレースケール画像 -->
  </div>
</div>
```

5. **ダッシュボードモックの存在感強化** → 現在のmax-widthを外してフル幅に近づける。perspective強化(900→1200)。影をより深く
```css
.hero__dashboard {
  box-shadow:
    0 20px 60px rgba(31,53,62,.15),
    0 0 0 1px rgba(0,0,0,.04),
    0 0 100px rgba(139,192,202,.1);
  transform: perspective(1200px) rotateY(-5deg) rotateX(3deg);
}
```

### 改善後の期待スコア
12点 → 16点（根拠: パーティクル強化+背景グロー+コピー改善+ロゴセクション追加で、「おっ」ポイントが生まれ、3秒テストをクリアできるレベルに到達。ただしLinear級の「息を呑む」には独自レイアウトの根本的再設計が必要でA上限止まり）

---

## 💀 軸2: ビジュアルクオリティ — B (12/20)

### なぜこのスコアなのか（辛辣に）

タイポグラフィとカラーシステムの**骨格**はしっかりしている。CSS変数で管理されたトークン、clamp()によるレスポンシブフォントサイズ、5色以上のティールパレット。しかし「骨格があるから良い」のではなく、**肉付けと磨き込みが圧倒的に不足**している。

最大の問題はセクション間の**区切りの貧弱さ**。白背景→ダーク背景→白背景の切り替えは`background`プロパティの変更だけで実現されており、セクション間に**視覚的な遷移感が皆無**。Stripe Sessionsのような色のグラデーション遷移や、波形/斜めカットのような創造的な区切りがない。

テスティモニアルのアバターがイニシャルテキスト（"T.S", "M.K", "Y.H"）のみ。BtoB LPにおいて**顔の見えないテスティモニアル**は信頼性を大幅に損なう。Stripe/Linear級のサイトでは実名+顔写真+企業ロゴが当然。

`feature__num`（01, 02, 03）の72pxフォントは大きいが、グラデーション色が`--bg-tint2`(#E8F2F4)→`--bg-tint`(#F0F7F8)でほぼ白。**72pxの文字がほぼ見えない**のはデザインの意図ではなく破綻。

### リファレンスとの差

| 観点 | ❌ UZOU LP v9 | ✅ リファレンス | 差の本質 |
|---|---|---|---|
| セクション区切り | background-colorの切替のみ | Stripe: グラデーション遷移+形状変化 / Linear: 微妙な背景色変化+グロー効果 | 「切り替わった」ではなく「流れるように移行した」体験の差 |
| カード情報密度 | タイトル+説明文+リスト3項目 | Linear: アイコン+ラベル+数値+ミニチャート+アクション / Vercel: コードスニペット+リアルタイムプレビュー | カード内のビジュアル要素が貧弱 |
| 数値表現 | グラデーションテキスト56px | Stripe: 巨大数値+サブテキスト+ミニスパークライン+アニメーション | 数値が「大きいだけ」で文脈が薄い |
| テスティモニアル | イニシャルアバター+テキスト | Stripe/Linear: 顔写真+実名+企業ロゴ+具体的数値の引用 | 信頼性の桁が違う |
| テクスチャ/質感 | ダークセクションにノイズ+グロー（良い） / 白セクションは質感なし | Linear: 全セクションに微妙なグラデーション+グロー / Vercel: グリッド+ドット+放射グラデーション | 白セクションが「素の白」で退屈 |

### 🔴 改善指示（優先度順・全て必須）

1. **セクション間に創造的な区切りを追加** → 白→ダーク遷移にグラデーションオーバーレイを追加
```css
.solution::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-dark));
  z-index: 1;
  pointer-events: none;
}
```

2. **feature__numのグラデーションを視認可能に** → 薄すぎるグラデーションを修正
```css
.feature__num {
  background: linear-gradient(135deg, rgba(139,192,202,.25), rgba(52,98,111,.08));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

3. **白セクションに微妙なテクスチャ/質感を追加** → ドットパターンまたは薄いグリッド
```css
.features::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(43,73,84,.03) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}
```

4. **テスティモニアルのアバターを実写風に改善** → 最低でもSVGのイラストアバター、理想はクライアント顔写真
```css
.testimonials__avatar {
  width: 48px;
  height: 48px;
  border: 2px solid var(--c-light);
  /* 写真がある場合 */
  background-size: cover;
  background-position: center;
}
```

5. **Resultsカードにミニスパークラインを追加** → 数値だけでなく視覚的トレンドを表示
```html
<div class="results__card">
  <svg class="results__sparkline" viewBox="0 0 60 20" aria-hidden="true">
    <polyline points="0,18 10,14 20,16 30,10 40,8 50,4 60,2" fill="none" stroke="var(--c-light)" stroke-width="1.5"/>
  </svg>
  <span class="results__value" data-count="200">0</span>
  <!-- ... -->
</div>
```

6. **カード間のサイズ差を意図的に作る** → Resultsの4枚均等をFeaturedカードの差をもっと大きく。Reasonsは2x2ではなく1大+3小のBentoグリッドに
```css
.reasons__grid {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
}
.reasons__card:first-child {
  grid-row: 1 / 3;
  /* 大きなカードとして差別化 */
}
```

### 改善後の期待スコア
12点 → 16点（根拠: セクション遷移+テクスチャ+テスティモニアル改善+カードサイズ差で「作り込まれている」印象に。ただしLinear級の完成度にはカスタムイラストレーション等のアセットが必要でA上限止まり）

---

## 💀 軸4: インタラクション＆モーション — B (10/15)

### なぜこのスコアなのか（辛辣に）

アニメーションの**種類**は揃っている（パーティクル、フェードイン、カウントアップ、スタッガー、マグネティック、シマー、バーチャート、タイムライン）。しかし問題は**質**と**印象**。

revealアニメーションが`translateY(36px) + opacity`の**完全にワンパターン**。Linearではスケール、回転、X方向スライド、blur解除、clip-path展開など、要素ごとに異なるアニメーションが使われている。全部同じアニメーションで統一すると「テンプレート感」が出る。

パーティクルは直線移動+壁バウンスという**最も基本的なパーティクルシステム**。2024-2025のトレンドであるモーフィングやタイポグラフィックアニメーション、スクロールジャックによるシネマティック演出は一切ない。

マグネティックボタンは技術的に実装されているが、移動量(0.15倍)が小さすぎて**体感不能**。Stripeのボタンはホバー時にグラデーションがシフトし、光沢が移動し、影が拡大する。UZOUのボタンはtranslateY(-2px)とshadow追加だけ。

### リファレンスとの差

| 観点 | ❌ UZOU LP v9 | ✅ リファレンス | 差の本質 |
|---|---|---|---|
| スクロールアニメーション | translateY+opacityの1パターン | Linear: 要素ごとに異なるアニメーション（scale/rotate/clipPath） | 「パターン」ではなく「演出」の発想 |
| パーティクル品質 | 直線移動+バウンス（基本形） | Linear: 有機的な光の粒子+マウス追従 / Stripe: メッシュグラデーションの動的変化 | 物理演算の質が違う |
| ホバーエフェクト | translateY(-2px)+shadow | Stripe: グラデーションシフト+光沢移動+shadow多層化 / Linear: scale+背景色変化+ボーダーグロー | ホバー1つに複数のプロパティを同時に変化させる |
| トレンド技法 | テキストスタッガー（行単位） | Linear: 文字単位のタイポアニメーション / Vercel: スクロール連動のパララックス+clip-path | 2025年のトレンド実装が不足 |
| CTA演出 | shimmerエフェクト（薄い） | Stripe: パルスグロー+色シフト / Linear: ボーダーグラデーション回転 | CTAが「押したくなる」レベルに達していない |

### 🔴 改善指示（優先度順・全て必須）

1. **revealアニメーションを多様化** → セクションごとにアニメーションパターンを変える
```css
/* 左から入るパターン */
.reveal--left { transform: translateX(-40px); opacity: 0; }
.reveal--left.is-visible { transform: translateX(0); opacity: 1; }

/* スケールアップパターン */
.reveal--scale { transform: scale(0.92); opacity: 0; }
.reveal--scale.is-visible { transform: scale(1); opacity: 1; }

/* ブラー解除パターン */
.reveal--blur { filter: blur(8px); opacity: 0; }
.reveal--blur.is-visible { filter: blur(0); opacity: 1; }
```

2. **ボタンホバーを多層化** → translateYだけでなく複数プロパティを同時変化
```css
.btn--primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 8px 28px rgba(52,98,111,.35),
    0 0 20px rgba(139,192,202,.2);
  /* 内部のシマーを加速 */
}
.btn--primary::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(139,192,202,.4), transparent, rgba(52,98,111,.3));
  opacity: 0;
  transition: opacity .35s var(--ease);
  z-index: -1;
}
.btn--primary:hover::before { opacity: 1; }
```

3. **フッター/FAQ/ナビリンクにも独自ホバーエフェクト追加** → color変化だけでなくtransformやunderline-animationを
```css
.footer__col a {
  position: relative;
}
.footer__col a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--c-light);
  transition: width .3s var(--ease);
}
.footer__col a:hover::after { width: 100%; }
```

4. **マグネティック効果の強化** → 移動量を0.15→0.3に。戻りのバウンスも追加
```javascript
const x = e.clientX - rect.left - rect.width / 2;
const y = e.clientY - rect.top - rect.height / 2;
btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
```

5. **CTAのpulse/glow効果を追加** → shimmerに加えてボーダーグローのアニメーション
```css
.btn--primary {
  animation: ctaPulse 3s ease-in-out infinite;
}
@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(52,98,111,.2); }
  50% { box-shadow: 0 4px 24px rgba(52,98,111,.4), 0 0 40px rgba(139,192,202,.15); }
}
```

6. **タイポグラフィックアニメーションを実装** → ヒーローのh1を1行単位ではなく文字単位で表示（2024-2025トレンド）
```javascript
// hero__title-lineの各文字をspanで囲み、1文字ずつdelayをつけてフェードイン
function splitTextToChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    span.style.display = 'inline-block';
    span.style.transition = `opacity .5s cubic-bezier(.16,1,.3,1) ${i * 0.03 + 0.3}s, transform .5s cubic-bezier(.16,1,.3,1) ${i * 0.03 + 0.3}s`;
    el.appendChild(span);
  });
}
```

### 改善後の期待スコア
10点 → 13点（根拠: アニメーション多様化+ホバー強化+トレンド技法追加でB上位→A下位に。ただし「動きに物語がある」S級にはスクロールジャック等の根本的な体験設計が必要）

---

## 💀 軸6: UI/UXディテール — B (5/10)

### なぜこのスコアなのか（辛辣に）

**フォーカス表示の完全欠如**。これは「ディテールが甘い」のレベルではなく、**アクセシビリティの基本要件の不履行**。WCAG 2.4.7（Focus Visible）はレベルAAの必須要件であり、これが欠けている時点でどれだけ他のUI要素が美しくても評価を上げることは不可能。

キーボードでTabキーを押してもどの要素がアクティブなのか全く分からない。視覚障害のあるユーザーだけでなく、パワーユーザーや運動機能に制限のあるユーザーにとって、サイトが操作不能に等しい状態。

さらに、LP最大の目的である「資料ダウンロード/お問い合わせ」のCTAが**アンカーリンクのまま放置**されている。`#download`や`#contact`のIDにジャンプするが、フォームもモーダルも存在しない。これはUI/UXの「エラー状態/ローディング/空状態のデザイン」以前に、**コンバージョン動線そのものが未完成**。

コントラスト比も`--t3: #6b8a94`が白背景で3.2:1と、通常テキスト基準（4.5:1）を満たしていない。hero__trust、section__label、ダッシュボードのラベル等で広範囲に使用されている。

### リファレンスとの差

| 観点 | ❌ UZOU LP v9 | ✅ リファレンス | 差の本質 |
|---|---|---|---|
| フォーカス表示 | 完全になし | Linear/Stripe/Vercel: カスタムフォーカスリング（ブランドカラー+offset） | アクセシビリティの基本が欠如 |
| CTA遷移先 | アンカーリンク（#download）で遷移先なし | Stripe: インラインフォーム or 専用ページへの遷移 / Linear: サインアップモーダル | コンバージョン動線が存在しない |
| コントラスト | 一部テキストがWCAG AA未達（3.2:1） | 全リファレンスがWCAG AA以上 | 読みやすさの基準不足 |
| レスポンシブ | 3ブレークポイントの基本対応 | Linear: 5+ブレークポイント+コンテナクエリ / Vercel: 完全流体レイアウト | 中間サイズの最適化不足 |

### 🔴 改善指示（優先度順・全て必須）

1. **フォーカス表示をグローバルに追加** → `:focus-visible`でカスタムフォーカスリング
```css
/* グローバルフォーカススタイル */
:focus-visible {
  outline: 2px solid var(--c-primary);
  outline-offset: 3px;
  border-radius: var(--r-sm);
}

/* ボタン専用 */
.btn:focus-visible {
  outline: 2px solid var(--c-light);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(139,192,202,.25);
}

/* ダーク背景上の要素 */
.section--dark :focus-visible {
  outline-color: var(--c-light);
}
```

2. **コントラスト比を修正** → `--t3`の色を暗くしてWCAG AA達成
```css
:root {
  --t3: #567078; /* #6b8a94 → #567078 (4.5:1以上) */
}
```

3. **CTA遷移先のフォーム/モーダルを実装** → 最低でもフォームセクションを追加
```html
<!-- Final CTAセクション内にインラインフォーム追加 -->
<form class="final-cta__form" action="#" method="post">
  <div class="form__group">
    <label for="company">会社名</label>
    <input type="text" id="company" name="company" required>
  </div>
  <div class="form__group">
    <label for="email">メールアドレス</label>
    <input type="email" id="email" name="email" required>
  </div>
  <button type="submit" class="btn btn--primary btn--lg">無料で資料を受け取る</button>
</form>
```

4. **ハンバーガーメニューのアクセシビリティ強化** → フォーカストラップ+ESCキー対応
```javascript
// initBurger()に追加
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    nav.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }
});
```

### 改善後の期待スコア
5点 → 8点（根拠: フォーカス表示追加+コントラスト修正+フォーム追加で基本要件を満たしA下位に。9点以上にはフォームバリデーション+エラー状態+ローディング状態等の完全実装が必要）

---

## 💀 軸7: 技術品質 — B (6/10)

### なぜこのスコアなのか（辛辣に）

CSS変数によるデザイントークン管理は優秀。カラー、フォント、スペーシング、影、角丸が全てCSS変数化されており、保守性は高い。アニメーションもtransform/opacityベースで60fps原則を概ね遵守。IntersectionObserverの使い方も適切。

しかし`<main>`要素の欠如はセマンティックHTMLの根幹に関わる問題。`<header>`と`<footer>`の間に`<main>`がない。スクリーンリーダーは`<main>`ランドマークでメインコンテンツにジャンプする機能を持つが、それが使えない。

FAQアコーディオンで`max-height`をアニメーションしているのは、transform/opacityのみの60fps原則に反する。max-heightの変化はレイアウトリフローを発生させ、特にモバイルデバイスでパフォーマンス低下の原因になる。

Canvasパーティクルのdraw()関数内でO(n^2)のダブルループ（60パーティクル = 毎フレーム1770回の距離計算）が走る。60fpsで毎秒106,200回の計算。最適化（空間分割やFPS制限）がない。

### リファレンスとの差

| 観点 | ❌ UZOU LP v9 | ✅ リファレンス | 差の本質 |
|---|---|---|---|
| セマンティクス | `<main>`要素なし | 全リファレンスが`<main>`+適切なランドマーク | スクリーンリーダーナビゲーションの破綻 |
| パフォーマンス | max-heightアニメーション、Canvas O(n^2) | Vercel: 全アニメーションがtransform/opacity / Linear: WebGLの最適化済みパーティクル | 60fps保証の徹底度の差 |
| コードの最適化 | 未minify、不要なコメント残存 | 全リファレンスが本番ビルドで最適化済み | プロダクション品質の意識 |
| 構造化データ | 未対応 | Vercel: JSON-LD構造化データ / Stripe: OGP完全対応 | SEO/ソーシャル対応の不足 |

### 🔴 改善指示（優先度順・全て必須）

1. **`<main>`要素を追加** → ヘッダーとフッターの間のコンテンツを`<main>`で囲む
```html
</header>

<main>
  <!-- Hero -->
  <section class="hero" id="hero">...</section>
  <!-- About ~ Final CTA -->
  ...
</main>

<!-- 固定CTAバー -->
<div class="sticky-cta" id="stickyCta">...</div>

<footer class="footer">...</footer>
```

2. **FAQアコーディオンのアニメーションをtransform/opacityベースに変更** → max-heightではなくgrid-template-rowsトリックを使用
```css
.faq__answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .4s cubic-bezier(.16,1,.3,1);
}
.faq__item[open] .faq__answer-wrapper {
  grid-template-rows: 1fr;
}
.faq__answer {
  overflow: hidden;
}
```

3. **Canvasパーティクルの最適化** → 空間分割またはFPS制限
```javascript
// フレームレート制限（30fpsで十分）
let lastTime = 0;
const FPS_INTERVAL = 1000 / 30;
function draw(timestamp) {
  animId = requestAnimationFrame(draw);
  const elapsed = timestamp - lastTime;
  if (elapsed < FPS_INTERVAL) return;
  lastTime = timestamp - (elapsed % FPS_INTERVAL);
  // 描画処理...
}
```

4. **OGPメタタグとFAQPage構造化データを追加**
```html
<meta property="og:title" content="UZOU｜メディア広告をもっとスマートに">
<meta property="og:description" content="AIによる最適化配信で広告成果とメディア収益を最大化">
<meta property="og:type" content="website">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

### 改善後の期待スコア
6点 → 8点（根拠: `<main>`追加+アコーディオン最適化+Canvas最適化+構造化データでA下位に。9点以上にはLighthouse 90+の実証が必要）

---

## 改善指示 統合リスト（優先度順）

### P0: 致命的（即修正必須）

| # | 改善項目 | 対象軸 | 期待効果 |
|---|---|---|---|
| 1 | `:focus-visible` フォーカスリングのグローバル追加 | 軸6 | WCAG 2.4.7準拠 |
| 2 | `<main>`要素の追加 | 軸7 | セマンティクス+ランドマークナビゲーション |
| 3 | `--t3`色のコントラスト修正（#6b8a94→#567078） | 軸6 | WCAG AA通常テキスト4.5:1達成 |

### P1: 重要（CVR/品質に直結）

| # | 改善項目 | 対象軸 | 期待効果 |
|---|---|---|---|
| 4 | CTA遷移先のフォームまたはモーダル実装 | 軸6 | コンバージョン動線の完成 |
| 5 | 導入企業ロゴセクション追加（About下 or Hero下） | 軸1,3 | 社会的証明の強化 |
| 6 | キャッチコピーの訴求力強化 | 軸1 | ファーストインプレッション改善 |
| 7 | パーティクルの視認性大幅強化（opacity, size, count） | 軸1,4 | 「動的要素がある」→「動的要素が印象的」に |
| 8 | ヒーロー背景グラデーション+グロー強化 | 軸1,2 | 世界観の確立 |

### P2: 品質向上（プロ感の仕上げ）

| # | 改善項目 | 対象軸 | 期待効果 |
|---|---|---|---|
| 9 | セクション間グラデーション遷移の追加 | 軸2 | 視覚的な流れの創出 |
| 10 | revealアニメーションの多様化（left/scale/blur） | 軸4 | テンプレ感の排除 |
| 11 | ボタンホバーの多層化（scale+shadow+glow） | 軸4 | インタラクション品質向上 |
| 12 | テスティモニアルのアバター改善（写真 or イラスト） | 軸2 | 信頼性向上 |
| 13 | feature__numグラデーションの視認性修正 | 軸2 | デザイン破綻の修正 |
| 14 | 白セクションへのテクスチャ追加 | 軸2 | AI感パターン#3の排除 |

### P3: 磨き込み（A→S への道）

| # | 改善項目 | 対象軸 | 期待効果 |
|---|---|---|---|
| 15 | タイポグラフィックアニメーション（文字単位表示） | 軸4 | 2024-2025トレンド対応 |
| 16 | CTA pulse/glow効果の追加 | 軸4 | CTAの注目度向上 |
| 17 | フッター/FAQリンクのホバーエフェクト追加 | 軸4 | 全要素にカスタムインタラクション |
| 18 | FAQアコーディオンのgrid-template-rows化 | 軸7 | 60fps維持 |
| 19 | Canvasパーティクルの30fps制限 | 軸7 | パフォーマンス最適化 |
| 20 | OGP+FAQPage構造化データ追加 | 軸7 | SEO/ソーシャル対応 |
| 21 | ResultsカードにスパークラインSVG追加 | 軸2 | データビジュアルの強化 |
| 22 | Reasonsカードのサイズ差（Bentoグリッド化） | 軸2 | AI感パターン#10の排除 |
| 23 | ハンバーガーメニューのフォーカストラップ+ESC対応 | 軸6 | アクセシビリティ強化 |
| 24 | マグネティック効果の強化（0.15→0.3） | 軸4 | 体感可能なインタラクション |
| 25 | ダッシュボードモックの存在感強化 | 軸1 | ヒーロービジュアルの主役化 |

---

## 改善後の期待スコア予測

| # | 評価軸 | 現在 | 改善後 | 差 |
|---|---|---|---|---|
| 1 | ファーストインプレッション | 12/20 | 16/20 | +4 |
| 2 | ビジュアルクオリティ | 12/20 | 16/20 | +4 |
| 3 | 情報設計 | 11/15 | 13/15 | +2 |
| 4 | インタラクション＆モーション | 10/15 | 13/15 | +3 |
| 5 | ブランド一貫性 | 7/10 | 8/10 | +1 |
| 6 | UI/UXディテール | 5/10 | 8/10 | +3 |
| 7 | 技術品質 | 6/10 | 8/10 | +2 |
| **合計** | **63/100** | **82/100** | **+19** |

**現在ランク**: B (63点)
**改善後期待ランク**: A (82点)

> 全25項目を実装した場合、Aランク（75-89）の中位に到達する見込み。S(90+)にはカスタムイラストレーション、3D/WebGL要素、スクロールジャック等の根本的な体験設計の刷新が必要。

---

---

## Phase 4: 再スコアリング（Round 1）

**実施日**: 2026-02-22
**改善項目数**: 21項目（P0: 3 / P1: 3 / P2: 6 / P3: 8 / 追加: 1）

### 再スコアリング結果

| # | 評価軸 | 配点 | 前回 | 今回 | 差分 | 改善評価 |
|---|---|---|---|---|---|---|
| 1 | ファーストインプレッション | /20 | 12 | **15** | +3 | 明確な改善 |
| 2 | ビジュアルクオリティ | /20 | 12 | **15** | +3 | 明確な改善 |
| 3 | 情報設計 | /15 | 11 | **12** | +1 | 微改善 |
| 4 | インタラクション＆モーション | /15 | 10 | **13** | +3 | 大幅改善 |
| 5 | ブランド一貫性 | /10 | 7 | **8** | +1 | 微改善 |
| 6 | UI/UXディテール | /10 | 5 | **8** | +3 | 大幅改善 |
| 7 | 技術品質 | /10 | 6 | **8** | +2 | 明確な改善 |
| **合計** | | **/100** | **63** | **79** | **+16** | |

**ランク**: A-（79点）— Aランク(75-89)到達

> 導入企業ロゴバンドの追加により情報設計が+1となり、80点到達の見込み。

### 主な改善内容
- P0: :focus-visible、`<main>`要素、--t3コントラスト修正
- P1: パーティクル視認性強化、Hero背景グロー、セクション遷移グラデーション
- P2: revealアニメーション4バリアント、ボタンホバー多層化、feature__numグラデーション、白セクションテクスチャ、フッターリンクホバー
- P3: CTA pulse/glow、Canvas 30fps制限、OGP+構造化データ、ESCキー対応、マグネティック強化、ダッシュボード存在感、Resultsスパークライン
- 追加: 導入企業ロゴバンド

### 未解消の主要課題（次ラウンド向け）
1. 写真/イラストの完全欠如（構造的ボトルネック）
2. テスティモニアルの架空感（イニシャルアバター＋架空社名）
3. フォーム/実CTA遷移先の欠如
4. og:imageの未設定
5. ハンバーガーメニューのフォーカストラップ

---

*レビュー実施: CDOスキル + design-reviewワークフロー Phase 2-4*
*ナレッジベース参照: knowledge-base.md（Awwwards/FWA/Nielsen/Rams/Apple基準）*
*比較リファレンス: Linear.app / Stripe Sessions / Vercel.com*
