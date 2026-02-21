# UZOU LP v9 制作プロジェクト

## プロジェクト概要
株式会社ヒトクセが運営する広告プラットフォーム「UZOU」のランディングページ v9。
過去バージョンのデザインにとらわれず、ゼロからデザイン・実装する。

## 制作対象
- `index.html` — LP全体のHTML
- `style.css` — 全スタイル
- `script.js` — 全インタラクション・アニメーション

## 必読ドキュメント
1. `docs/requirements.md` — 要件定義・セクション構成・コピーテキスト
2. `docs/brand.md` — ブランドカラー・フォント・制約
3. `docs/design-recipe.md` — デザインレシピ（B案 Geometric Flow 確定）
4. `docs/service-profile.md` — サービスプロファイル
5. `docs/design-review-10rounds.md` — AI専門家10ラウンドレビュー結果
6. `docs/quality-checklist-results.md` — 品質チェックリスト結果

## デザイン方針（B案「Geometric Flow」確定）
- 幾何学×流動的モーション: ノード&ラインパーティクル、軌道アニメーション、グリッドライン背景
- セクションカラースイッチ: 白 → ダーク → 白 のリズム（Apple/Stripe式）
- ティール系グラデーション: `#34626F` → `#8BC0CA` のグラデーションテキスト・ボタン
- ダークセクション: ノイズテクスチャ + アンビエントグロー
- 「テンプレート感」「AI生成感」を排除
- 贅沢な余白と洗練されたタイポグラフィ

## 技術制約
- Vanilla HTML/CSS/JS のみ（フレームワーク・CDN不使用）
- Google Fonts: Noto Sans JP + Inter
- レスポンシブ対応（Desktop 1024px+ / Tablet 768-1024px / Mobile -768px / 小型 -480px）
- prefers-reduced-motion 尊重（全CSSアニメーション + JSアニメーション）
- WCAG AA コントラスト準拠
- セマンティックHTML
- JSエラー0件を保証

## スキル参照状況
| スキル | 状態 | メモ |
|---|---|---|
| premium-design Phase 0 | ✅ 完了 | ナレッジベース参照済み |
| premium-design Phase A | ✅ 完了 | デザインレシピ生成済み（B案確定） |
| premium-design Phase C | ✅ 完了 | AI感排除 + プロ感加点チェック実施 |
| design-research Phase 1-3 | ✅ 完了 | service-profile + design-recipe 生成済み |
| web-animation | ✅ 完了 | 品質チェックリスト実施、11項目中9合格 |
| lp-graphics | ✅ 完了 | 品質チェックリスト実施、CSS/SVG中心のビジュアル戦略 |
| cdo | ✅ 参照済み | 体験全体の設計方針 |
| cmo | ✅ 参照済み | CVR最適化・ファネル設計 |
| design-review ワークフロー | 🟡 部分実行 | ナレッジベース読込済み、7軸スコアリングは未実行 |
| AI専門家10ラウンドレビュー | ✅ 完了 | 平均72.7/100点 → 改善反映中 |

## 改善のバックログ（10ラウンドレビュー + 品質チェックから）
### 🔴 最重要
- [ ] `#download` の実際のフォーム/遷移先を設定
- [ ] 導入企業ロゴセクション追加（社会的証明の強化）
- [ ] テスティモニアルの実データ差し替え（架空感排除）

### 🟡 重要
- [x] CTAボタンのシマーエフェクト追加
- [x] Resultsカードの差別化（featuredカード）
- [x] テキスト主体セクションにSVG背景装飾追加
- [x] Flowタイムライン接続線アニメーション
- [x] prefers-reduced-motion の全CSSアニメーション対応
- [ ] ダッシュボードモックのmacOS風ドット → UZOUブランド化
- [ ] Heroのターゲット明示（「広告代理店・メディア企業の方へ」）
- [ ] OGP / FAQPage構造化データ
- [ ] 幾何学モチーフのページ全体への浸透

### 🟢 あると尚良い
- [ ] パーティクルの幾何学形状化（三角形/六角形混在）
- [ ] ハンバーガーメニューのフォーカストラップ + ESCキー対応
- [ ] Featuresテキストのモバイル左揃え
- [ ] design-review 7軸100点スコアリング実行
