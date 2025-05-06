# Dockerコマンドを簡略化するMakefile

# デフォルトのターゲット
.PHONY: help
help:
	@echo "使用可能なコマンド:"
	@echo "  make build      - Dockerイメージをビルドする"
	@echo "  make up         - コンテナを起動する"
	@echo "  make down       - コンテナを停止する"
	@echo "  make restart    - コンテナを再起動する"
	@echo "  make logs       - コンテナのログを表示する"
	@echo "  make sh         - アプリケーションコンテナのシェルに接続する"
	@echo "  make mysql      - MySQLコンテナに接続する"
	@echo "  make migrate    - データベースマイグレーションを実行する"
	@echo "  make test       - Playwrightテストを実行する"
	@echo "  make test-ui    - Playwrightのテストレポートを表示する"
	@echo "  make clean      - 未使用のDockerリソースをクリーンアップする"

# Dockerイメージをビルド
.PHONY: build
build:
	docker-compose build

# コンテナを起動（バックグラウンド）
.PHONY: up
up:
	docker-compose up -d

# コンテナを起動（フォアグラウンド、ログ表示）
.PHONY: upf
upf:
	docker-compose up

# コンテナを停止
.PHONY: down
down:
	docker-compose down

# コンテナを再起動
.PHONY: restart
restart:
	docker-compose restart

# コンテナのログを表示
.PHONY: logs
logs:
	docker-compose logs -f

# アプリケーションコンテナのシェルに接続
.PHONY: sh
sh:
	docker-compose exec app sh

# MySQLコンテナに接続
.PHONY: mysql
mysql:
	docker-compose exec db mysql -h db -u my_db_username -pmy_db_password my_dbname


# マイグレーションファイルを作成
.PHONY: makemigration
makemigration:
ifndef name
	$(error Please provide a migration name: make makemigration name=YourMigrationName)
endif
	npx drizzle-kit generate --name=$(name)


# マイグレーションを実行
.PHONY: migrate
migrate:
	npx drizzle-kit migrate

# データベースマイグレーションを実行
.PHONY: migrate
migrate:
	docker-compose exec app npm run migrate

# Playwrightテストを実行
.PHONY: test
test:
	docker-compose exec app npm run test

# Playwrightのテストレポートを表示
.PHONY: test-ui
test-ui:
	docker-compose exec app npx playwright show-report

# 未使用のDockerリソースをクリーンアップ
.PHONY: clean
clean:
	docker volume rm grad_2025_backend_db_data
