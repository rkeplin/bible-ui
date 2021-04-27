.PHONY: dev
dev:
	@echo "🤓 Spinning Up Dev Version"
	docker-compose up

.PHONY: pretty
pretty:
	yarn eslint ./src --ext .ts,.tsx --fix

.PHONY: down
down:
	@echo "💨 Taking Everything Down"
	docker-compose down --remove-orphans

.PHONY: logs
logs:
	@echo "🔎 Viewing Logs"
	docker-compose logs -f

.PHONY: build
build:
	@echo "🦾 Build Prod"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

.PHONY: prod
prod:
	@echo "🥳 Spinning Up Version For Prod"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

.PHONY: deploy
deploy:
	@echo "🚀 Deploying 🚀"
	./.deploy/deploy.sh
