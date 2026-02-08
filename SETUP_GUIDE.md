# WEIGHT COACH - GitHubに公開する手順

## 📋 準備するもの
- GitHubアカウント
- Git（インストール済みであること）

## 🚀 手順

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名: `weight-coach` を入力
4. Description: `科学的な減量管理とメンタルサポート - 格闘家専用の体重管理アプリ`
5. Public を選択（誰でも見れるようにする）
6. 「Create repository」をクリック

### 2. ローカルでGitの初期化とプッシュ

ダウンロードした`weight-coach-github`フォルダに移動して、以下のコマンドを実行：

```bash
# フォルダに移動
cd weight-coach-github

# Gitを初期化
git init

# すべてのファイルを追加
git add .

# 最初のコミット
git commit -m "🥊 Initial commit: WEIGHT COACH app"

# リモートリポジトリを追加（YOUR_USERNAMEを自分のGitHubユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/weight-coach.git

# メインブランチに変更
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### 3. GitHub Pagesで公開（オプション）

みんながブラウザで直接使えるようにする場合：

1. GitHubのリポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. Source: 「GitHub Actions」を選択
4. `.github/workflows/deploy.yml`ファイルを作成：

```bash
# フォルダを作成
mkdir -p .github/workflows
```

以下の内容を`.github/workflows/deploy.yml`として保存：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v2
```

5. コミット＆プッシュ：

```bash
git add .
git commit -m "✨ Add GitHub Pages deployment"
git push
```

6. 数分後、`https://YOUR_USERNAME.github.io/weight-coach/` でアプリが公開されます！

---

**WEIGHT COACH** - 科学的な減量で、あなたの勝利をサポート 🥊
