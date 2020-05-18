source scripts/env.sh
source secrets.sh

uvicorn app.server:app --host 0.0.0.0 --reload --port $PORT 