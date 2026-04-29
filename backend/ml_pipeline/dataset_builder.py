"""Build train/eval datasets from stock + sentiment merged features."""

from pathlib import Path

import pandas as pd

from app.services.news_service import NewsService
from app.services.sentiment_service import SentimentService
from app.services.stock_service import StockService
from app.utils.preprocessing import build_feature_frame


def build_dataset(symbols: list[str] | None = None, out_path: str = "artifacts/dataset.csv") -> pd.DataFrame:
    symbols = symbols or ["AAPL", "TSLA", "MSFT", "GOOGL", "NVDA"]
    stock_service = StockService()
    news_service = NewsService()
    sentiment_service = SentimentService()
    frames: list[pd.DataFrame] = []
    for symbol in symbols:
        price = stock_service.get_price_history(symbol, days=180)
        if not price:
            continue
        news = sentiment_service.annotate_news(news_service.get_news(symbol=symbol))
        sent_df = pd.DataFrame(
            [
                {
                    "date": (
                        item["published_at"][:10]
                        if isinstance(item["published_at"], str)
                        else item["published_at"].date().isoformat()
                    ),
                    "score": item["sentiment_score"] or 0.0,
                }
                for item in news
            ]
        )
        if sent_df.empty:
            sent_df = pd.DataFrame(columns=["date", "score"])
        feature_df = build_feature_frame(pd.DataFrame(price), sent_df)
        feature_df["symbol"] = symbol
        feature_df["target"] = (feature_df["close"].shift(-1) > feature_df["close"]).astype(int).fillna(0)
        frames.append(feature_df)
    dataset = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
    target = Path(out_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(target, index=False)
    return dataset


if __name__ == "__main__":
    df = build_dataset()
    print(f"dataset rows={len(df)}")
