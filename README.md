# To get dev env going
Make sure docker is running, yarn is installed and `/etc/hosts`  has appropriate entries.  Yarn is running outside of the docker-compose setup.  See `docker-compose.yml`
* `make dev`
* `yarn start` in new console tab

# To spin up compressed version without yarn
Make sure docker is running and `/etc/hosts`  has appropriate entries.  With this, you don't need yarn installed.
* `make prod`
