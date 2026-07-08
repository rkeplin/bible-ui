[![ESLint](https://github.com/rkeplin/bible-ui/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/rkeplin/bible-ui/actions/workflows/lint.yml)
[![TypeScript](https://github.com/rkeplin/bible-ui/actions/workflows/typecheck.yml/badge.svg?branch=main)](https://github.com/rkeplin/bible-ui/actions/workflows/typecheck.yml)

# bible-ui

React + TypeScript frontend for the [Bible Study](https://bible-ui.rkeplin.com) application. Built with Vite, served via Nginx in production, and deployed to Kubernetes.

## Stack

- **React 19** + TypeScript 5.7
- **Vite 6** (dev server + production bundler)
- **React Router v6**
- **Bootstrap 4**, FontAwesome 6, Chart.js 4, Axios 1

## Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose
- Sibling repos checked out alongside this one (the dev compose file references `../bible-go-api` and `../bible-php-api`)

```
projects/
  bible-ui/        # this repo
  bible-go-api/
  bible-php-api/
```

## Local Development

Start all services (UI + Go API + PHP API + MariaDB + Elasticsearch + Mongo + Redis):

```bash
docker compose up
```

The UI is available at [http://localhost](http://localhost) (port 80 → Vite dev server on 5173). Hot-reload is enabled via the bind-mounted volume.

To stop everything:

```bash
docker compose down --remove-orphans
# or
make down
```

## Linting & Type Checking

Run ESLint:

```bash
npm run lint
```

Run TypeScript type check (no emit):

```bash
npm run typecheck
```

Auto-fix lint issues:

```bash
npm run lint -- --fix
```

## Production Build

The production image is a two-stage Docker build: `node:22-alpine` compiles the Vite bundle, then `nginx:1.27-alpine` serves the static output.

API URLs are **baked in at build time** as build args:

```bash
docker build \
  --build-arg VITE_API_URL=https://your-go-api.example.com/v1 \
  --build-arg VITE_USER_API_URL=https://your-php-api.example.com/v1 \
  -t rkeplin/bible-react-ui:latest .
```

## Deploying to Kubernetes

### 1. Build and push the K8s image

`bin/push.sh` builds the image with the production API URLs, pushes it to Docker Hub, and rolls the deployment if it already exists:

```bash
# Defaults to the rkeplin.com k8s endpoints
./bin/push.sh

# Override API URLs
K8S_GO_API_URL=https://go-api.example.com/v1 \
K8S_PHP_API_URL=https://php-api.example.com/v1 \
./bin/push.sh
```

This tags the image as both `rkeplin/bible-react-ui:k8s-<sha>` and `rkeplin/bible-react-ui:k8s`.

### 2. Apply the Kubernetes manifests

On first deploy (creates the `bible` namespace, Deployment, Service, and Ingress):

```bash
make k8s-deploy
```

On subsequent deploys, `bin/push.sh` handles the rolling update automatically via `kubectl set image`.

### 3. Check status

```bash
make k8s-status
# equivalent to: kubectl get all -n bible
```

### 4. Tear down

```bash
make k8s-delete
```

### Kubernetes manifests

| File | Description |
|---|---|
| `infra/k8s/namespace.yaml` | `bible` namespace |
| `infra/k8s/deployment.yaml` | Deployment + Service (image: `rkeplin/bible-react-ui:k8s`) |
| `infra/k8s/ingress.yaml` | Nginx ingress with TLS via cert-manager |

The ingress is configured for `bible-ui.rkeplin.com` and `k8s-bible-ui.rkeplin.com` with Let's Encrypt TLS. Update `infra/k8s/ingress.yaml` for your own domain.

## Makefile Reference

| Command | Description |
|---|---|
| `make dev` | Start dev environment (`docker compose up`) |
| `make down` | Stop and remove containers |
| `make logs` | Tail compose logs |
| `make build` | Build compose images |
| `make k8s-deploy` | Apply k8s namespace + deployment + ingress |
| `make k8s-delete` | Delete k8s deployment and ingress |
| `make k8s-status` | Show all resources in the `bible` namespace |
| `make push` | Run `bin/push.sh` (build, push, roll) |
