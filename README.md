# grad_2025_backend

レアゾン HD の新卒エンジニア研修のバックエンドリポジトリです。

## 開発環境構築

#### 1.ライブラリをインストール

```sh
npm i
```

#### 2.Docker を立ち上げ

```sh
make init
```

以下の URL で立ち上がります
http://localhost:3000/

### tips

#### ライブラリを入れた時

`npm install <ライブラリ>`などでライブラリを追加したときは Docker の再ビルドが必要となります

```sh
make build
make up
```

#### DB のスキーマ変更

1. `src/db`内にスキーマを定義する
2. マイグレーションファイルを作成

```sh
make makemigration name=<マイグレーション名>
```

3. マイグレーションを実行

```sh
make migrate
```

#### Docker のボリュームを削除したいとき

DB のデータを削除したいときなどに使えます

docker が落ちているのを確認後に実行

```sh
make down
make clean
```

削除した後には、`make init`で Docker を立ち上げてください。
migration も合わせて実行されます

#### SQL コマンドを直打ちしたい

コンテナ立ち上げ直後ではエラーになる場合があります
しばらくしてからもう一度実行すれば入れます。

```sh
make mysql
```

#### OpenAPI で設定している API を見たい

Docker を立ち上げたのち以下のコマンドを実行
http://localhost:3000/swagger
