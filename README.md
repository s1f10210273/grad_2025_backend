# grad_2025_backend

レアゾン HD の新卒エンジニア研修のバックエンドリポジトリです。

## 開発環境構築

#### 1.ライブラリをインストール

```sh
npm i
```

#### 2.Docker をビルド

```sh
make build
```

#### 3.Docker Up

```sh
make up
```

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

```sh
make clean
```

#### SQL コマンドを直打ちしたい

```sh
make mysql
```

#### OpenAPI で設定している API を見たい

Docker を立ち上げたのち以下のコマンドを実行
http://localhost:3000/swagger
