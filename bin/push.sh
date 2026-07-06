#!/bin/bash
# Build + push the bible-ui image for K8S and roll the deployment.
#
# The React app bakes API URLs in at BUILD time (.env.production).
# CRA gives .env.production.local higher priority than .env.production,
# so we drop one in with the k8s-* domains for this build, then remove it.
set -euo pipefail

REPO_SLUG="rkeplin/bible-react-ui"
TAG="k8s-$(git rev-parse --short HEAD)"

GO_API_URL="${K8S_GO_API_URL:-https://k8s-bible-go-api.rkeplin.com/v1}"
PHP_API_URL="${K8S_PHP_API_URL:-https://k8s-bible-php-api.rkeplin.com/v1}"

ENV_LOCAL=".env.production.local"
cleanup() { rm -f "$ENV_LOCAL"; }
trap cleanup EXIT

cat > "$ENV_LOCAL" <<EOF
REACT_APP_API_URL=$GO_API_URL
REACT_APP_USER_API_URL=$PHP_API_URL
EOF

docker build --platform linux/amd64 -t "$REPO_SLUG:$TAG" -t "$REPO_SLUG:k8s" .
docker push "$REPO_SLUG:$TAG"
docker push "$REPO_SLUG:k8s"

if kubectl -n bible get deploy/bible-ui >/dev/null 2>&1; then
  kubectl -n bible set image deploy/bible-ui ui="$REPO_SLUG:$TAG"
  kubectl -n bible rollout status deploy/bible-ui
else
  echo "deploy/bible-ui not found yet — skipping rollout (run 'make k8s-deploy' first)"
fi
