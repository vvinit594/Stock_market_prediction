# StockAI Backend

FastAPI backend for StockAI (local-first setup).

## 1) Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
# optional ML training dependencies
pip install -r requirements-ml.txt
```

## 2) Environment

```bash
cp .env.example .env
```

Update `.env` values for:
- `DATABASE_URL`
- `REDIS_URL`
- `ALPHA_VANTAGE_API_KEY`
- `NEWS_API_KEY`
- `FINNHUB_API_KEY`

## 3) Run PostgreSQL + Redis locally

- PostgreSQL: create database `stockai`
- Redis: run on `localhost:6379`

## 4) Migrations

```bash
alembic revision --autogenerate -m "init schema"
alembic upgrade head
```

## 5) Run API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI: http://localhost:8000/docs

## 6) Available endpoints

- `GET /health`
- `GET /ready`
- `GET /api/dashboard/{symbol}`
- `GET /api/stock/{symbol}`
- `GET /api/news`
- `GET /api/news/{symbol}`
- `GET /api/sentiment/{symbol}`
- `GET /api/predict/{symbol}`
- `POST /api/portfolio/add`
- `GET /api/portfolio`
- `DELETE /api/portfolio/{symbol}`

## 7) Run tests

```bash
pytest -q
```

## 8) Training pipeline

```bash
# install optional ML deps first:
# pip install -r requirements-ml.txt
python -m ml_pipeline.dataset_builder
python -m ml_pipeline.train
python -m ml_pipeline.evaluate
```

Artifacts are written to `backend/artifacts/`.

## Notes

- Stock ingestion uses yfinance primary with AlphaVantage fallback.
- News ingestion uses NewsAPI primary with Finnhub fallback.
- Sentiment uses FinBERT when `USE_FINBERT=true`; otherwise a safe heuristic fallback is used.
- API caching uses Redis and degrades gracefully if Redis is unavailable.
