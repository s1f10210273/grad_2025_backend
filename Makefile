

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


.PHONY: makemigration
makemigration:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a migration name: make makemigration name=YourMigrationName"; \
		exit 1; \
	fi
	npx drizzle-kit generate --name=$(name)

.PHONY: migrate
migrate:
	npx drizzle-kit migrate

# Playwrightテストを実行
.PHONY: test
test:
	docker-compose exec app npm run test

# Playwrightのテストレポートを表示
.PHONY: test-ui
test-ui:
	docker-compose exec app npx playwright show-report

.PHONY: clean
clean:
	docker volume rm grad_2025_backend_db_data

.PHONY: init
init:build up migrate
