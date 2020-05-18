source scripts/env.sh
source secrets.sh

docker-compose build server
docker-compose up "$@" server


