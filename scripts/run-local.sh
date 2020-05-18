# get API_TOKEN and EXPORT_DIR env app vars
source scripts/env.sh

uvicorn app.server:app --host 0.0.0.0 --reload --port $PORT 