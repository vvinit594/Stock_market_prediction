from datetime import datetime, timedelta
from typing import Any

import httpx
import yfinance as yf
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.core.exceptions import ExternalServiceError

settings = get_settings()


class StockService:
    """Stock market ingestion: yfinance primary, Alpha Vantage secondary."""

    def get_dashboard_snapshot(self, symbol: str) -> dict:
        data = self.get_price_history(symbol=symbol, days=2)
        if len(data) < 2:
            raise ExternalServiceError("Not enough stock data for dashboard snapshot")
        current = data[-1]["close"]
        prev = data[-2]["close"]
        daily_change = ((current - prev) / prev) * 100 if prev else 0.0
        return {
            "symbol": symbol.upper(),
            "current_price": round(current, 2),
            "daily_change": round(daily_change, 2),
        }

    def get_price_history(self, symbol: str, days: int = 30) -> list[dict]:
        symbol = symbol.upper()
        if settings.USE_MOCK_MARKET_DATA:
            return self._fallback_history(symbol=symbol, days=days)

        history: list[dict] = []
        try:
            history = self._fetch_yfinance(symbol=symbol, days=days)
            if history:
                return history
        except Exception:
            pass
        try:
            history = self._fetch_alpha_vantage(symbol=symbol)
            if history:
                return history[-days:]
        except Exception:
            pass
        raise ExternalServiceError(f"No market data available for {symbol}")

    def get_ticker_metadata(self, symbol: str) -> dict[str, Any | None]:
        symbol = symbol.upper()
        if settings.USE_MOCK_MARKET_DATA:
            return {
                "company_name": f"{symbol} (mock)",
                "sector": None,
                "market_cap": None,
                "ceo": None,
            }
        try:
            t = yf.Ticker(symbol)
            info = t.info or {}
            cap = info.get("marketCap")
            cap_str = None
            if isinstance(cap, (int, float)) and cap > 0:
                if cap >= 1e12:
                    cap_str = f"${cap / 1e12:.2f}T"
                elif cap >= 1e9:
                    cap_str = f"${cap / 1e9:.2f}B"
                elif cap >= 1e6:
                    cap_str = f"${cap / 1e6:.2f}M"
                else:
                    cap_str = f"${cap:,.0f}"
            officers = info.get("companyOfficers") or []
            ceo = None
            if officers and isinstance(officers[0], dict):
                ceo = officers[0].get("name")
            return {
                "company_name": info.get("longName") or info.get("shortName") or symbol,
                "sector": info.get("sector"),
                "market_cap": cap_str,
                "ceo": ceo,
            }
        except Exception:
            return {"company_name": symbol, "sector": None, "market_cap": None, "ceo": None}

    def quote_from_history(self, history: list[dict]) -> dict[str, Any]:
        if not history:
            raise ExternalServiceError("Empty price history")
        last = history[-1]
        prev_close = history[-2]["close"] if len(history) >= 2 else last["close"]
        change_pct = ((last["close"] - prev_close) / prev_close) * 100 if prev_close else 0.0
        return {
            "current_price": round(float(last["close"]), 2),
            "change_percent": round(float(change_pct), 2),
            "volume": int(last.get("volume") or 0),
        }

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, min=1, max=4))
    def _fetch_yfinance(self, symbol: str, days: int) -> list[dict]:
        ticker = yf.Ticker(symbol)
        start_date = (datetime.utcnow() - timedelta(days=max(days * 2, 120))).date().isoformat()
        hist = ticker.history(start=start_date, interval="1d")
        if hist.empty:
            return []
        hist = hist.tail(days)
        rows: list[dict[str, Any]] = []
        for idx, row in hist.iterrows():
            rows.append(
                {
                    "date": idx.date().isoformat(),
                    "open": float(row["Open"]),
                    "high": float(row["High"]),
                    "low": float(row["Low"]),
                    "close": float(row["Close"]),
                    "volume": int(row["Volume"]),
                }
            )
        return rows

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.5, min=1, max=3))
    def _fetch_alpha_vantage(self, symbol: str) -> list[dict]:
        if not settings.ALPHA_VANTAGE_API_KEY:
            return []
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": settings.ALPHA_VANTAGE_API_KEY,
            "outputsize": "compact",
        }
        with httpx.Client(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            payload = resp.json()
        series = payload.get("Time Series (Daily)", {})
        rows: list[dict] = []
        for day, values in sorted(series.items()):
            rows.append(
                {
                    "date": day,
                    "open": float(values["1. open"]),
                    "high": float(values["2. high"]),
                    "low": float(values["3. low"]),
                    "close": float(values["4. close"]),
                    "volume": int(float(values["5. volume"])),
                }
            )
        return rows

    def _fallback_history(self, symbol: str, days: int) -> list[dict]:
        """Deterministic synthetic series for automated tests only (USE_MOCK_MARKET_DATA)."""
        now = datetime.utcnow()
        history: list[dict] = []
        base = 100 + (sum(ord(c) for c in symbol) % 50)
        for i in range(days):
            d = now - timedelta(days=days - i)
            close = base + (i * 0.15)
            history.append(
                {
                    "date": d.date().isoformat(),
                    "open": round(close - 0.5, 2),
                    "high": round(close + 0.8, 2),
                    "low": round(close - 0.9, 2),
                    "close": round(close, 2),
                    "volume": 1_000_000 + i * 5_000,
                }
            )
        return history
