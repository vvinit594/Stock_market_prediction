"""Symbol search: Finnhub when API key is set, else local CSV universe."""

from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

_DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "symbols_universe.csv"
settings = get_settings()


@lru_cache
def _load_local_universe() -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    if not _DATA_FILE.is_file():
        return rows
    with _DATA_FILE.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for line in reader:
            sym = (line.get("symbol") or "").strip().upper()
            name = (line.get("name") or "").strip()
            if sym and name:
                rows.append((sym, name))
    return rows


class SearchService:
    def search(self, query: str, limit: int = 20) -> list[dict[str, str]]:
        q = query.strip()
        if len(q) < 1:
            return []
        q_lower = q.lower()
        out: list[dict[str, str]] = []

        if settings.FINNHUB_API_KEY:
            try:
                remote = self._finnhub_search(q)
                if remote:
                    return remote[:limit]
            except Exception:
                pass

        for sym, name in _load_local_universe():
            if q_lower in sym.lower() or q_lower in name.lower():
                out.append({"symbol": sym, "company_name": name})
            if len(out) >= limit:
                break
        return out

    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.5, min=1, max=3))
    def _finnhub_search(self, query: str) -> list[dict[str, str]]:
        if not settings.FINNHUB_API_KEY:
            return []
        url = "https://finnhub.io/api/v1/search"
        params = {"q": query, "token": settings.FINNHUB_API_KEY}
        with httpx.Client(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
        rows: list[dict[str, str]] = []
        for item in data.get("result") or []:
            sym = (item.get("symbol") or "").split(".")[0].upper()
            desc = (item.get("description") or "").strip()
            if not sym:
                continue
            rows.append({"symbol": sym, "company_name": desc or sym})
        return rows

    def resolve_company_name(self, symbol: str) -> str | None:
        sym = symbol.strip().upper()
        for s, name in _load_local_universe():
            if s == sym:
                return name
        if settings.FINNHUB_API_KEY:
            try:
                hits = self._finnhub_search(sym)
                for h in hits:
                    if h["symbol"] == sym:
                        return h["company_name"]
            except Exception:
                pass
        return None
