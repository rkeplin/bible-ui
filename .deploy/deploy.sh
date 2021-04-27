#!/bin/bash
# Build the latest image
sed -i "" -E 's/local/com/g' .env.local
make build
sed -i "" -E 's/com/local/g' .env.local

# Get the latest commit hash
GIT_COMMIT=$(git rev-parse --short HEAD)
DOCKER_ID=rkeplin
DOCKER_REPO_SLUG=rkeplin/bible-react-ui

# Push image, tagging most recent git commit and latest
docker login -u "$DOCKER_ID" --password-stdin
docker build -t $DOCKER_REPO_SLUG:$GIT_COMMIT -t $DOCKER_REPO_SLUG:latest .
docker push $DOCKER_REPO_SLUG:$GIT_COMMIT
docker push $DOCKER_REPO_SLUG:latest

ssh -t -i ~/.ssh/id_rsa_rkeplin_sites_travis travis@jersey1.rkeplin.com 'sed -i "s/image: rkeplin\/bible-react-ui:[a-z0-9]*/image: rkeplin\/bible-react-ui:'"$GIT_COMMIT"'/g" /opt/stacks/bible.yml'
ssh -t -i ~/.ssh/id_rsa_rkeplin_sites_travis travis@jersey1.rkeplin.com 'docker stack deploy -c /opt/stacks/bible.yml bible'

docker logout
