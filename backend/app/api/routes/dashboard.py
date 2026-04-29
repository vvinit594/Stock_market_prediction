from fastapi import APIRouter

from app.core.cache import cache_get, cache_set
from app.database.schemas import DashboardResponse
from app.services.news_service import NewsService
from app.services.prediction_service import PredictionService
from app.services.sentiment_service import SentimentService
from app.services.stock_service import StockService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

stock_service = StockService()
news_service = NewsService()
sentiment_service = SentimentService()
prediction_service = PredictionService()


@router.get("/{symbol}", response_model=DashboardResponse)
def get_dashboard(symbol: str) -> DashboardResponse:
    cache_key = f"dashboard:{symbol.upper()}"
    cached = cache_get(cache_key)
    if cached:
        return DashboardResponse(**cached)

    stock = stock_service.get_dashboard_snapshot(symbol=symbol)
    news = news_service.get_news(symbol=symbol)
    annotated = sentiment_service.annotate_news(news)
    sentiment_rollup = sentiment_service.aggregate_daily_sentiment(annotated)
    prediction = prediction_service.predict(symbol=symbol)
    response = DashboardResponse(
        symbol=stock["symbol"],
        current_price=stock["current_price"],
        daily_change=stock["daily_change"],
        sentiment_score=sentiment_rollup["score"],
        ai_signal=prediction["signal"],
        confidence=prediction["confidence"],
    )
    cache_set(cache_key, response.model_dump())
    return response
