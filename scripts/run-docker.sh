# get API_TOKEN and EXPORT_DIR env app vars
source scripts/env.sh

# pip freeze > requirements.txt

docker-compose build server
docker-compose up "$@" server


