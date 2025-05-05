FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ビルドを実行
RUN npm run build

# ポートを公開
EXPOSE 3000

# 開発用コマンドを実行
CMD [ "node", "--inspect=0.0.0.0:9229", "./dist/index.js" ]