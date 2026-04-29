from fastapi import APIRouter

from app.services.news_service import NewsService
from app.database.schemas import PredictionResponse
from app.services.prediction_service import PredictionService
from app.services.sentiment_service import SentimentService
from app.services.stock_service import StockService

router = APIRouter(prefix="/api/predict", tags=["prediction"])
prediction_service = PredictionService()
stock_service = StockService()
news_service = NewsService()
sentiment_service = SentimentService()


@router.get("/{symbol}", response_model=PredictionResponse)
def predict(symbol: str) -> PredictionResponse:
    prices = stock_service.get_price_history(symbol=symbol, days=90)
    annotated_news = sentiment_service.annotate_news(news_service.get_news(symbol=symbol))
    sentiment_rows = [
        {"date": item["published_at"][:10], "score": item["sentiment_score"] or 0.0}
        for item in annotated_news
    ]
    payload = prediction_service.predict_from_frames(symbol, prices, sentiment_rows)
    return PredictionResponse(**payload)
