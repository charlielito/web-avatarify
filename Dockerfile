FROM python:3.7

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

WORKDIR /code

COPY app ./app

CMD uvicorn app.server:app --port $PORT --workers 1 --host 0.0.0.0