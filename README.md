# WEIGHT COACH

**科学的な減量管理とメンタルサポート - 格闘家専用の体重管理アプリ**

## 🥊 概要

WEIGHT COACHは、格闘技選手のための科学的な体重管理アプリです。データに基づいた減量計画、栄養管理、AIコーチによるメンタルサポートを統合したオールインワンアプリ。

## ✨ 主な機能

### 📊 体重管理
- 体重記録とグラフ表示
- 試合日までのカウントダウン
- 目標体重との差分表示
- 体重推移の可視化

### 🍽️ 栄養管理
- 食事記録（100品目以上のデータベース）
- PFCバランスの円グラフ表示
- カロリー・マクロ栄養素の自動計算
- コンビニ・外食メニュー対応

### 💧 水分管理
- 1日の水分摂取量記録
- 過去7日間のグラフ表示
- 訂正機能付き（-250mlボタン）

### 💪 適正階級診断
- 身長、体脂肪率、リーチなどから科学的に診断
- ボクシング・キックボクシング対応
- 除脂肪体重を考慮した最適階級の提案

### 🤖 AIコーチ機能
- 毎日の調子チェック
- 気分に応じた励ましメッセージ
- パーソナライズされたアドバイス

## 🚀 セットアップ

### 必要なもの
- Node.js (v18以上推奨)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/weight-coach.git
cd weight-coach

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドしたファイルをプレビュー
npm run preview
```

## 📁 プロジェクト構成

```
weight-coach/
├── public/              # 静的ファイル
├── src/
│   ├── App.jsx         # メインアプリケーション
│   ├── main.jsx        # エントリーポイント
│   └── index.css       # グローバルスタイル
├── index.html          # HTMLテンプレート
├── package.json        # 依存関係
├── vite.config.js      # Vite設定
├── tailwind.config.js  # Tailwind CSS設定
└── README.md
```

## 🛠️ 技術スタック

- **React** - UIフレームワーク
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング
- **Recharts** - グラフ描画
- **Lucide React** - アイコン
- **LocalStorage** - データ永続化

## 📱 対応ブラウザ

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

モバイルブラウザにも完全対応。

## 🎯 使い方

1. **新規登録**: アプリを開いて新規登録
2. **オンボーディング**: 目的、身体データ、試合予定を入力
3. **日々の記録**: 体重、食事、水分、メンタルを記録
4. **進捗確認**: グラフとダッシュボードで進捗を可視化
5. **AIコーチ**: 毎日の調子を入力してパーソナライズされたアドバイスを受け取る

## 🔒 プライバシー

すべてのデータはブラウザのLocalStorageに保存されます。外部サーバーには送信されません。

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

格闘技を愛するすべての人のために。

## 🤝 コントリビューション

Pull Requestを歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📞 サポート

問題や提案がある場合は、[Issues](https://github.com/YOUR_USERNAME/weight-coach/issues)を開いてください。

---

**WEIGHT COACH** - 科学的な減量で、あなたの勝利をサポート 🥊
