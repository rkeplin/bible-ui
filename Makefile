.PHONY: dev
dev:
	@echo "============= Spin Up Dev Version ============="
	docker-compose up

.PHONY: down
down:
	@echo "============= Taking Everything Down ============="
	docker-compose down --remove-orphans

.PHONY: logs
logs:
	@echo "============= View Logs ============="
	docker-compose logs -f

.PHONY: build
build:
	@echo "============= Build Prod ============="
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

.PHONY: prod
prod:
	@echo "============= Spin Up Prod Version ============="
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
