source scripts/env.sh
source secrets.sh

SERVICE="server"
for var in "$@"; do
    if [ $var == "--gpu" ]; then
        SERVICE="server-gpu"
        export PORT=80
    fi
done

docker-compose build $SERVICE
docker-compose up $SERVICE


