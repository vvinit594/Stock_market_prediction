from fastapi import APIRouter

from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.database.schemas import NewsItemResponse
from app.services.news_service import NewsService
from app.services.sentiment_service import SentimentService

router = APIRouter(prefix="/api/news", tags=["news"])
settings = get_settings()
news_service = NewsService()
sentiment_service = SentimentService()


@router.get("", response_model=list[NewsItemResponse])
def get_news() -> list[NewsItemResponse]:
    cache_key = "news:all"
    cached = cache_get(cache_key)
    if cached:
        return [NewsItemResponse(**item) for item in cached]
    rows = sentiment_service.annotate_news(news_service.get_news())
    cache_set(cache_key, rows, ttl=settings.STOCK_CACHE_TTL_SECONDS)
    return [NewsItemResponse(**item) for item in rows]


@router.get("/{symbol}", response_model=list[NewsItemResponse])
def get_news_by_symbol(symbol: str) -> list[NewsItemResponse]:
    cache_key = f"news:{symbol.upper()}"
    cached = cache_get(cache_key)
    if cached:
        return [NewsItemResponse(**item) for item in cached]
    rows = sentiment_service.annotate_news(news_service.get_news(symbol=symbol))
    cache_set(cache_key, rows, ttl=settings.STOCK_CACHE_TTL_SECONDS)
    return [NewsItemResponse(**item) for item in rows]
