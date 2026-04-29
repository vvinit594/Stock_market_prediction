from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.db import Base


class Stock(Base):
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    symbol: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sector: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    price_history: Mapped[list["PriceHistory"]] = relationship(back_populates="stock")
    news_articles: Mapped[list["NewsArticle"]] = relationship(back_populates="stock")
    sentiments: Mapped[list["DailySentiment"]] = relationship(back_populates="stock")
    predictions: Mapped[list["Prediction"]] = relationship(back_populates="stock")


class PriceHistory(Base):
    __tablename__ = "price_history"
    __table_args__ = (UniqueConstraint("stock_id", "date", name="uq_pricehistory_stock_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date, index=True)
    open: Mapped[float] = mapped_column(Float)
    high: Mapped[float] = mapped_column(Float)
    low: Mapped[float] = mapped_column(Float)
    close: Mapped[float] = mapped_column(Float)
    volume: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="price_history")


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int | None] = mapped_column(ForeignKey("stocks.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(512))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str | None] = mapped_column(String(128), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    sentiment_label: Mapped[str | None] = mapped_column(String(16), nullable=True)
    sentiment_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="news_articles")


class DailySentiment(Base):
    __tablename__ = "daily_sentiment"
    __table_args__ = (UniqueConstraint("stock_id", "date", name="uq_sentiment_stock_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date, index=True)
    score: Mapped[float] = mapped_column(Float)
    positive_count: Mapped[int] = mapped_column(Integer, default=0)
    neutral_count: Mapped[int] = mapped_column(Integer, default=0)
    negative_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="sentiments")


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id", ondelete="CASCADE"))
    model_name: Mapped[str] = mapped_column(String(64), default="lstm")
    model_version: Mapped[str] = mapped_column(String(64), default="v1")
    signal: Mapped[str] = mapped_column(String(8))
    confidence: Mapped[float] = mapped_column(Float)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    predicted_for: Mapped[date] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    stock: Mapped["Stock"] = relationship(back_populates="predictions")


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    __table_args__ = (UniqueConstraint("symbol", name="uq_portfolio_symbol"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(16), index=True)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
