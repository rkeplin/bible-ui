NS ?= bible

.PHONY: dev down logs build pretty push

dev:
	docker-compose up

down:
	docker-compose down --remove-orphans

logs:
	docker-compose logs -f

build:
	docker-compose build

pretty:
	yarn eslint ./src --ext .ts,.tsx --fix

push:
	bin/push.sh

.PHONY: k8s-namespace
k8s-namespace:
	kubectl apply -f infra/k8s/namespace.yaml

.PHONY: k8s-deploy
k8s-deploy: k8s-namespace
	kubectl apply -f infra/k8s/deployment.yaml
	kubectl apply -f infra/k8s/ingress.yaml

.PHONY: k8s-delete
k8s-delete:
	-kubectl delete -f infra/k8s/ingress.yaml
	-kubectl delete -f infra/k8s/deployment.yaml

.PHONY: k8s-status
k8s-status:
	kubectl get all -n $(NS)
