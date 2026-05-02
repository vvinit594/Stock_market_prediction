from datetime import date, datetime

from pydantic import BaseModel


class PortfolioAddRequest(BaseModel):
    symbol: str
    company_name: str | None = None


class PortfolioItemResponse(BaseModel):
    symbol: str
    company_name: str | None
    added_at: datetime


class PredictionResponse(BaseModel):
    signal: str
    confidence: float
    explanation: str
    model_breakdown: dict | None = None


class DashboardResponse(BaseModel):
    symbol: str
    current_price: float
    daily_change: float
    sentiment_score: float
    ai_signal: str
    confidence: float


class StockDetailResponse(BaseModel):
    symbol: str
    company_name: str | None = None
    sector: str | None = None
    market_cap: str | None = None
    ceo: str | None = None
    current_price: float
    change_percent: float
    volume: int | None = None
    history: list[dict]
    indicators: dict
    prediction: PredictionResponse
    sentiment_timeline: list[dict]


class SearchHit(BaseModel):
    symbol: str
    company_name: str


class NewsItemResponse(BaseModel):
    title: str
    description: str | None
    source: str | None
    published_at: datetime
    sentiment_label: str | None
    sentiment_score: float | None


class DailySentimentResponse(BaseModel):
    symbol: str
    date: date
    score: float
