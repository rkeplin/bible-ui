#!/bin/bash
# Get the latest commit hash
GIT_COMMIT=$(git rev-parse --short HEAD)
DOCKER_ID=rkeplin
DOCKER_REPO_SLUG=rkeplin/bible-react-ui

# Login to docker
docker login -u "$DOCKER_ID"

# Tag the image
sed -i "" -E 's/http:/https:/g' .env.local
sed -i "" -E 's/local/com/g' .env.local
docker build -t $DOCKER_REPO_SLUG:$GIT_COMMIT -t $DOCKER_REPO_SLUG:latest .
sed -i "" -E 's/https:/http:/g' .env.local

# Push the image
docker push $DOCKER_REPO_SLUG:$GIT_COMMIT
docker push $DOCKER_REPO_SLUG:latest

# Logout of docker
docker logout

# Restart swarm stack
ssh -t -i ~/.ssh/id_rsa_rkeplin_sites_travis travis@jersey1.rkeplin.com 'sed -i "s/image: rkeplin\/bible-react-ui:[a-z0-9]*/image: rkeplin\/bible-react-ui:'"$GIT_COMMIT"'/g" /opt/stacks/bible.yml'
ssh -t -i ~/.ssh/id_rsa_rkeplin_sites_travis travis@jersey1.rkeplin.com 'docker stack deploy -c /opt/stacks/bible.yml bible'
