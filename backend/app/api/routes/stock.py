from fastapi import APIRouter
import pandas as pd

from app.core.cache import cache_get, cache_set
from app.database.schemas import StockDetailResponse
from app.services.news_service import NewsService
from app.services.prediction_service import PredictionService
from app.services.sentiment_service import SentimentService
from app.services.stock_service import StockService
from app.utils.preprocessing import build_feature_frame

router = APIRouter(prefix="/api/stock", tags=["stock"])

stock_service = StockService()
news_service = NewsService()
sentiment_service = SentimentService()
prediction_service = PredictionService()


@router.get("/{symbol}", response_model=StockDetailResponse)
def get_stock_detail(symbol: str) -> StockDetailResponse:
    cache_key = f"stock_detail:{symbol.upper()}"
    cached = cache_get(cache_key)
    if cached:
        return StockDetailResponse(**cached)

    history = stock_service.get_price_history(symbol=symbol, days=30)
    news = sentiment_service.annotate_news(news_service.get_news(symbol=symbol))
    sentiment_rows = [
        {"date": (item["published_at"][:10] if isinstance(item["published_at"], str) else item["published_at"].date().isoformat()), "score": item["sentiment_score"] or 0.0}
        for item in news
    ]
    feature_df = build_feature_frame(pd.DataFrame(history), pd.DataFrame(sentiment_rows))
    last = feature_df.iloc[-1]
    indicators = {
        "ma10": round(float(last["ma10"]), 4),
        "ma50": round(float(last["ma50"]), 4),
        "rsi": round(float(last["rsi"]), 4),
        "macd": round(float(last["macd"]), 4),
        "bollinger": {"upper": round(float(last["bb_upper"]), 4), "lower": round(float(last["bb_lower"]), 4)},
    }
    sentiment_timeline = [{"date": item["date"], "score": item["score"]} for item in sentiment_rows[-14:]]
    prediction = prediction_service.predict_from_frames(symbol, history, sentiment_timeline)
    response = StockDetailResponse(
        symbol=symbol.upper(),
        history=history,
        indicators=indicators,
        prediction=prediction,
        sentiment_timeline=sentiment_timeline,
    )
    cache_set(cache_key, response.model_dump())
    return response
