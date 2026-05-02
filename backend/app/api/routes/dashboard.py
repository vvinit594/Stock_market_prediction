import logging

from fastapi import APIRouter, Query

from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.database.schemas import DashboardResponse
from app.services.news_service import NewsService
from app.services.prediction_service import PredictionService
from app.services.sentiment_service import SentimentService
from app.services.stock_service import StockService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
settings = get_settings()

stock_service = StockService()
news_service = NewsService()
sentiment_service = SentimentService()
prediction_service = PredictionService()


def _build_dashboard(symbol: str) -> DashboardResponse:
    sym = symbol.upper()
    cache_key = f"dashboard:{sym}"
    cached = cache_get(cache_key)
    if cached:
        return DashboardResponse(**cached)

    stock = stock_service.get_dashboard_snapshot(symbol=sym)
    news = news_service.get_news(symbol=sym)
    annotated = sentiment_service.annotate_news(news)
    sentiment_rollup = sentiment_service.aggregate_daily_sentiment(annotated)
    prices = stock_service.get_price_history(symbol=sym, days=90)
    sentiment_rows = [
        {
            "date": (item["published_at"][:10] if isinstance(item["published_at"], str) else str(item["published_at"])[:10]),
            "score": item["sentiment_score"] or 0.0,
        }
        for item in annotated
    ]
    prediction = prediction_service.predict_from_frames(sym, prices, sentiment_rows)
    response = DashboardResponse(
        symbol=stock["symbol"],
        current_price=stock["current_price"],
        daily_change=stock["daily_change"],
        sentiment_score=sentiment_rollup["score"],
        ai_signal=prediction["signal"],
        confidence=float(prediction["confidence"]),
    )
    cache_set(cache_key, response.model_dump(), ttl=settings.STOCK_CACHE_TTL_SECONDS)
    return response


@router.get("", response_model=list[DashboardResponse])
def list_dashboard(symbols: str = Query(..., description="Comma-separated tickers")) -> list[DashboardResponse]:
    parts = [s.strip().upper() for s in symbols.split(",") if s.strip()][:25]
    out: list[DashboardResponse] = []
    for sym in parts:
        try:
            out.append(_build_dashboard(sym))
        except Exception as exc:
            logger.warning("dashboard batch skip %s: %s", sym, exc)
    return out


@router.get("/{symbol}", response_model=DashboardResponse)
def get_dashboard(symbol: str) -> DashboardResponse:
    return _build_dashboard(symbol)
