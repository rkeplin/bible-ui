#!/bin/bash
# Get the latest commit hash
GIT_COMMIT=$(git rev-parse --short HEAD)
DOCKER_ID=rkeplin
DOCKER_REPO_SLUG=rkeplin/bible-react-ui

# Login to docker
docker login -u "$DOCKER_ID"

# Tag the image
docker build -t $DOCKER_REPO_SLUG:$GIT_COMMIT -t $DOCKER_REPO_SLUG:latest .

# Push the image
docker push $DOCKER_REPO_SLUG:$GIT_COMMIT
docker push $DOCKER_REPO_SLUG:latest

# Logout of docker
docker logout

# Restart swarm stack
ssh -t -i /home/rob/.ssh/travis_id_rsa travis@jersey1.rkeplin.com 'sed -i "s/image: rkeplin\/bible-react-ui:[a-z0-9]*/image: rkeplin\/bible-react-ui:'"$GIT_COMMIT"'/g" /opt/stacks/bible.yml'
ssh -t -i /home/rob/.ssh/travis_id_rsa travis@jersey1.rkeplin.com 'docker stack deploy -c /opt/stacks/bible.yml bible'
