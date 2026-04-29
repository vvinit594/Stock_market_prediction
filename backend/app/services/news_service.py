from datetime import datetime

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

settings = get_settings()


class NewsService:
    """News ingestion service with NewsAPI primary and Finnhub fallback."""

    def get_news(self, symbol: str | None = None) -> list[dict]:
        if not settings.USE_LIVE_MARKET_DATA:
            return self._fallback_news()
        query = symbol.upper() if symbol else "stock market"
        try:
            rows = self._fetch_newsapi(query)
            if rows:
                return rows
        except Exception:
            pass
        try:
            rows = self._fetch_finnhub(query)
            if rows:
                return rows
        except Exception:
            pass
        return self._fallback_news()

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.5, min=1, max=3))
    def _fetch_newsapi(self, query: str) -> list[dict]:
        if not settings.NEWS_API_KEY:
            return []
        params = {
            "q": query,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 10,
            "apiKey": settings.NEWS_API_KEY,
        }
        with httpx.Client(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.get("https://newsapi.org/v2/everything", params=params)
            resp.raise_for_status()
            data = resp.json()
        rows = []
        for item in data.get("articles", []):
            rows.append(
                {
                    "title": item.get("title") or "",
                    "description": item.get("description"),
                    "source": (item.get("source") or {}).get("name"),
                    "published_at": item.get("publishedAt") or datetime.utcnow().isoformat(),
                    "sentiment_label": None,
                    "sentiment_score": None,
                }
            )
        return rows

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.5, min=1, max=3))
    def _fetch_finnhub(self, query: str) -> list[dict]:
        if not settings.FINNHUB_API_KEY:
            return []
        params = {"q": query, "token": settings.FINNHUB_API_KEY}
        with httpx.Client(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.get("https://finnhub.io/api/v1/news", params=params)
            if resp.status_code >= 400:
                return []
            data = resp.json()
        rows = []
        for item in data[:10]:
            rows.append(
                {
                    "title": item.get("headline") or "",
                    "description": item.get("summary"),
                    "source": item.get("source"),
                    "published_at": datetime.utcfromtimestamp(item.get("datetime", 0)).isoformat()
                    if item.get("datetime")
                    else datetime.utcnow().isoformat(),
                    "sentiment_label": None,
                    "sentiment_score": None,
                }
            )
        return rows

    def _fallback_news(self) -> list[dict]:
        return [
            {
                "title": "Tech sector rally continues on AI optimism",
                "description": "Large-cap technology names gain after upbeat guidance.",
                "source": "Reuters",
                "published_at": datetime.utcnow().isoformat(),
                "sentiment_label": "positive",
                "sentiment_score": 1.0,
            },
            {
                "title": "Markets await Fed commentary for rate guidance",
                "description": "Investors remain cautious before policy remarks.",
                "source": "Bloomberg",
                "published_at": datetime.utcnow().isoformat(),
                "sentiment_label": "neutral",
                "sentiment_score": 0.0,
            },
        ]
