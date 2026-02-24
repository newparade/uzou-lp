# UZOU LP v12 — クリエイティブコンセプト

## コンセプト名: "Crystal Formation" (結晶生成)

### タグライン
**「混沌から、結晶へ。」**

広告市場の混沌（有象無象）から、UZOUが美しい結晶構造（最適な接続）を生み出す。
結晶ポリゴンは「秩序ある接続」「最適化の結果」「成長する構造体」のメタファー。

---

## 1. ビジュアルDNA

### メインビジュアル: 3Dクリスタルクラスター
- `assets/crystal-cluster.png` をヒーロー右側に大きく配置
- ティール系グラデーション（#8BC0CA → #34626F → #2B4954）
- 半透明の重なり、奥行き、ファセット（面取り）テクスチャ

### 展開方法

| 要素 | 手法 |
|---|---|
| ヒーロー | crystal-cluster.png（実画像）+ Canvas結晶パーティクル |
| セクション背景 | SVGポリゴンワイヤーフレーム（opacity 0.04-0.10） |
| カード | backdrop-filter:blur + 半透明白 + crystal border |
| ボタン | クリスタルシマーエフェクト（linear-gradient sweep） |
| アイコン | polygon clip-pathで六角形/五角形にマスク |
| セクション遷移 | clip-path: polygon() でクリスタルカットな切り替え |
| 数値 | 結晶テクスチャのテキストフィル（background-clip:text） |
| ダークセクション | 結晶のシルエット + 内部にほのかなティールグロー |

### 禁止事項
- 丸いバブル/ブロブ（結晶は角張っている）
- 波線/曲線のセクション区切り
- 汎用的なドットパターン/クロスハッチ
- テンプレート感のあるフラットアイコン

---

## 2. セクション構成（全面再設計）

### 01. Hero — 「結晶の覚醒」
**レイアウト**: 左テキスト(45%) + 右クリスタル画像(55%)
**特徴**:
- crystal-cluster.png が右側から画面の55%を占める
- 背景: 薄いグリッドライン + マウス追従ラジアルグロー
- テキスト: 1文字ずつスタッガードリビール + 回転
- バッジ: frosted glass風
- CTA: クリスタルシマーエフェクト
- 下部: 結晶の破片がCanvasで浮遊

### 02. Media Trust — 「結晶の証明」
**レイアウト**: フルワイド frosted glass バンド
**特徴**:
- backdrop-filter: blur(20px) の帯にメディア名マーキー
- 上下にSVGポリゴンフレーム装飾
- 「500+ MEDIA」をcrystal textureで表示

### 03. Problem — 「結晶化前の混沌」（ダーク）
**レイアウト**: フルワイドダーク、中央揃え
**特徴**:
- ダーク背景に散乱するポリゴン破片のCanvas
- タブ切替で広告主/メディアの課題表示
- 課題項目: 左ボーダーにグラデーション + スタッガードイン
- 背景: noise texture + ポリゴンワイヤーフレーム

### 04. Scale — 「結晶の規模」
**レイアウト**: フルワイド白、4列大数値
**特徴**:
- 50億+ / 500+ / 3.5億+ / +34.8% を巨大タイポで横並び
- 数値にcrystal gradient テキスト効果
- カウントアップ + シマーアニメーション
- 各数値の下に小さなSVGトレンドライン

### 05. About — 「結晶の起源」
**レイアウト**: 左テキスト(50%) + 右図解(50%) 非対称
**特徴**:
- 「有象無象」のストーリーを editorial 風に
- Platform Diagramを結晶ノードで再構築
- 右上に小さな結晶画像のフラグメント

### 06. Features — 「結晶の構造」
**レイアウト**: 非対称ベントグリッド（大1 + 小2 + フル1）
**特徴**:
- 各カード: glass-morphism + 上辺グラデーションボーダー
- カードホバー: 3D tilt + ボーダーグロー
- SVGアイコン: ストロークドローインアニメーション
- カード内にインタラクティブビジュアル

### 07. Testimonials — 「結晶の反響」
**レイアウト**: 横スクロールカルーセル（CSS scroll-snap）
**特徴**:
- glass-morphism カード
- Featured カード: crystal gradient border
- 自動スクロール + ドラッグ対応
- 各カードの指標: 大きなcrystal gradientテキスト

### 08. CTA Strip — 「結晶への招待」（ダーク）
**レイアウト**: フルワイドダーク、中央揃え
**特徴**:
- 背景: ポリゴンワイヤーフレーム + 結晶グロー
- CTA: フルワイドで目立つ crystal shimmer button

### 09. Flow — 「結晶の成長」
**レイアウト**: 左固定見出し + 右タイムライン
**特徴**:
- 各ステップ: 結晶の成長段階のメタファー
- 接続線: SVGストロークがスクロールで描画される
- ステップアイコン: polygon clip-path

### 10. FAQ — 「結晶の断面」
**レイアウト**: 左グラデーントタイトル + 右アコーディオン
**特徴**:
- クリーンで余白たっぷり
- アコーディオン開閉: smooth height transition

### 11. Final CTA — 「結晶の完成」（ダーク）
**レイアウト**: フルワイドダーク、中央揃え
**特徴**:
- Canvas: crystal-cluster.pngを分解→再構築アニメーション的表現
- 結晶パーティクルが集合するCanvasアニメーション
- 大きなCTA

### 12. Footer
**レイアウト**: 3カラムナビ + ブランド
**特徴**: シンプル、クリーン

---

## 3. モーションデザイン戦略

### ページロード
1. ヘッダー fade in (0.2s)
2. Crystal cluster slide-in from right (0.6s, ease-out)
3. Hero text stagger reveal (0.8s, 1文字ずつ)
4. CTA buttons fade up (1.0s)
5. Crystal particles begin floating (1.2s)

### スクロール連動
- **Crystal particles**: 常時浮遊、スクロール速度に連動して加速
- **Section reveal**: clip-path: polygon() でクリスタルカット遷移
- **Parallax**: 結晶装飾が3層速度差で移動
- **Progress bar**: ヘッダー下にcrystal gradientの進捗バー
- **Timeline**: Flowの接続線がリアルタイムに伸長
- **Counter**: 数値がスクロール到達時にカウントアップ

### ホバー
- **Cards**: perspective 3D tilt + border glow
- **Buttons**: crystal shimmer sweep (135deg gradient animation)
- **Links**: underline slide-in from left
- **Magnetic**: CTA buttons が若干マウスに吸い寄せられる

### 要素リビール
- **Default**: translateY(30px) + opacity:0 → visible
- **Scale**: scale(0.95) → 1 + blur(8px) → 0
- **Slide left/right**: 非対称方向からスライド
- **Stagger**: 子要素に80ms間隔のディレイ

---

## 4. カラーシステム

### Light sections (75%)
- 背景: #ffffff / #f5fafb
- テキスト: #0a1a1f (primary), #3d5a63 (secondary)
- アクセント: #34626F → #8BC0CA gradient
- カード: rgba(255,255,255,0.7) + backdrop-filter:blur(20px)

### Dark sections (25%)
- 背景: #1F353E
- テキスト: #e2e8f0 (primary), rgba(226,232,240,0.6) (secondary)
- アクセント: #8BC0CA glow
- カード: rgba(255,255,255,0.05) + border glow

### Crystal gradient
```css
background: linear-gradient(135deg, #2B4954, #34626F, #8BC0CA);
```

---

## 5. 技術アプローチ

| 要素 | 技術 |
|---|---|
| 結晶パーティクル | Canvas 2D（五角形/六角形ポリゴン描画） |
| 結晶画像 | PNG <img> + CSS transform:rotate/scale |
| Glass-morphism | backdrop-filter:blur(20px) + border:1px solid rgba |
| Crystal border | conic-gradient border-image |
| クリスタルカット遷移 | clip-path: polygon() animation |
| テキストfill | background-clip:text + crystal gradient |
| SVGアイコン | stroke-dasharray/dashoffset animation |
| 3D tilt | CSS perspective + JS mousemove |
| マウスグロー | CSS custom properties + JS mousemove |
| Scroll progress | CSS scaleX + JS scroll event |
| Count-up | JS requestAnimationFrame + ease-out |
| Smooth accordion | JS height animation + CSS transition |
