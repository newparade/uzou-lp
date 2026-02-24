# UZOU LP v12 制作プロジェクト

## プロジェクト概要
株式会社Speee（東証スタンダード 4499）が運営するネイティブアド配信プラットフォーム「UZOU」のランディングページ。
v12 "Crystal Formation" コンセプトで全面再設計。

## 制作対象
- `index.html` — LP全体のHTML
- `style.css` — 全スタイル
- `script.js` — 全インタラクション・アニメーション
- `assets/crystal-cluster.png` — メインビジュアル（3Dクリスタルクラスター）

## 必読ドキュメント
1. `docs/creative-concept-v12.md` — v12 Crystal Formationコンセプト定義
2. `docs/requirements.md` — 要件定義・セクション構成・コピーテキスト
3. `docs/brand.md` — ブランドカラー・フォント・制約
4. `docs/service-profile.md` — サービスプロファイル

## デザイン方針（v12 "Crystal Formation"）
- **コンセプト**: 「混沌から、結晶へ。」— 広告市場の混沌からUZOUが結晶構造を生み出す
- **メインビジュアル**: 3Dクリスタルクラスター画像（`assets/crystal-cluster.png`）
- **ビジュアルDNA**: ティール系結晶ポリゴン、Glass-morphism、Canvasパーティクル
- **カラースイッチ**: 白 → ダーク → 白 のリズム（Problem/CTA Mid/Final CTAがダーク）
- **Crystal gradient**: `linear-gradient(135deg, #2B4954, #34626F, #8BC0CA)`
- **Glass-morphism**: `backdrop-filter:blur(20px)` + 半透明白 + crystal border
- **モーション**: テキストスプリット、スタッガーリビール、3Dチルト、マグネティックボタン、結晶パーティクル
- **禁止事項**: 丸いバブル/ブロブ、波線区切り、汎用ドットパターン、テンプレ感フラットアイコン

## セクション構成（12セクション）
1. Hero — 結晶の覚醒（左テキスト50% + 右クリスタル画像50%）
2. Trust — 結晶の証明（2列マーキー、frosted glass帯）
3. Problem — 結晶化前の混沌（ダーク、タブ切替）
4. Scale — 結晶の規模（4列大数値、crystal gradientテキスト）
5. About — 結晶の起源（左テキスト + 右SVG接続図）
6. Features — 結晶の構造（非対称ベントグリッド、glass-card）
7. Voices — 結晶の反響（横スクロールカルーセル）
8. CTA Mid — 結晶への招待（ダーク、Canvasパーティクル）
9. Flow — 結晶の成長（左固定見出し + 右タイムライン）
10. FAQ — 結晶の断面（左グラデーントタイトル + 右アコーディオン）
11. Final CTA — 結晶の完成（ダーク、結晶集合パーティクル）
12. Footer — 3カラムナビ + ブランド

## 技術制約
- Vanilla HTML/CSS/JS のみ（フレームワーク・CDN不使用）
- Google Fonts: Noto Sans JP + Inter
- レスポンシブ対応（Desktop 1024px+ / Tablet 768-1024px / Mobile -768px / 小型 -480px）
- prefers-reduced-motion 尊重（全CSSアニメーション + JSアニメーション）
- WCAG AA コントラスト準拠
- セマンティックHTML
- JSエラー0件を保証
- Canvas 30fps制限

## 実装済み機能
- [x] Crystal Formation全面再設計（HTML/CSS/JS完全書き換え）
- [x] クリスタルクラスター画像をHeroメインビジュアルに配置
- [x] Glass-morphismカードシステム（backdrop-filter:blur）
- [x] Crystal shimmerボタンエフェクト
- [x] Canvas結晶パーティクル（Hero/CTA Mid/Final CTA）
- [x] テキストスプリットアニメーション（Hero見出し）
- [x] マウス追従グロー（Hero背景）
- [x] 2列マーキーメディア名スクロール（Trust）
- [x] タブ切替（Problem: 広告主/メディア）
- [x] カウントアップアニメーション（Scale数値）
- [x] SVG接続線ストローク描画（About図解）
- [x] バーチャート変動 / ノード増殖SVG / フローハイライト（Features）
- [x] 横スクロールカルーセル + ドラッグ + 自動スクロール（Voices）
- [x] タイムラインアコーディオン（Flow）
- [x] スムースアコーディオン（FAQ）
- [x] カード3Dチルト（glass-card）
- [x] マグネティックボタン（CTA）
- [x] スクロール進捗バー
- [x] ヘッダーダークセクション自動検知
- [x] モバイルメニュー（フォーカストラップ + ESCキー）
- [x] スムースアンカースクロール
- [x] prefers-reduced-motion完全対応
- [x] OGP / FAQPage構造化データ
- [x] :focus-visible フォーカスリング
- [x] セマンティックHTML（main, header, footer, nav, section）
