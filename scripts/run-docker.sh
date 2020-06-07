source scripts/env.sh
source secrets.sh

docker-compose build server-gpu
docker-compose up "$@" server-gpu


