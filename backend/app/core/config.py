from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "StockAI Backend"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/stockai"
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 300
    STOCK_CACHE_TTL_SECONDS: int = 45
    REQUEST_TIMEOUT_SECONDS: int = 12

    ALPHA_VANTAGE_API_KEY: str = ""
    NEWS_API_KEY: str = ""
    FINNHUB_API_KEY: str = ""
    FINBERT_MODEL_NAME: str = "ProsusAI/finbert"
    USE_FINBERT: bool = False
    USE_LIVE_MARKET_DATA: bool = True
    USE_MOCK_MARKET_DATA: bool = False

    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [item.strip() for item in self.BACKEND_CORS_ORIGINS.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
