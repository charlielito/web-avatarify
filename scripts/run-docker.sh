source scripts/env.sh
source secrets.sh

DOCKER_SERVICE="server"
for var in "$@"; do
    if [ $var == "--gpu" ]; then
        DOCKER_SERVICE="server-gpu"
        export PORT=80
        export SERVICE="avatarify"
    fi
done

docker-compose build $DOCKER_SERVICE
docker-compose up $DOCKER_SERVICE


