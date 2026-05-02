from datetime import date

from fastapi import APIRouter

from app.database.schemas import DailySentimentResponse
from app.services.news_service import NewsService
from app.services.sentiment_service import SentimentService

router = APIRouter(prefix="/api/sentiment", tags=["sentiment"])
sentiment_service = SentimentService()
news_service = NewsService()


@router.get("/{symbol}/timeline")
def sentiment_timeline(symbol: str) -> list[dict]:
    news = news_service.get_news(symbol=symbol)
    annotated = sentiment_service.annotate_news(news)
    return sentiment_service.timeline_from_news(annotated)


@router.get("/{symbol}", response_model=DailySentimentResponse)
def get_sentiment(symbol: str) -> DailySentimentResponse:
    news = news_service.get_news(symbol=symbol)
    annotated = sentiment_service.annotate_news(news)
    rollup = sentiment_service.aggregate_daily_sentiment(annotated)
    return DailySentimentResponse(
        symbol=symbol.upper(),
        date=date.today(),
        score=rollup["score"],
    )
