import json
from typing import Any

import redis

from app.core.config import get_settings

settings = get_settings()
_redis_client: redis.Redis | None = None


def get_redis() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=0.2,
            socket_timeout=0.2,
            retry_on_timeout=False,
        )
    return _redis_client


def cache_get(key: str) -> Any | None:
    try:
        client = get_redis()
        raw = client.get(key)
    except Exception:
        return None
    if raw is None:
        return None
    return json.loads(raw)


def cache_set(key: str, value: Any, ttl: int | None = None) -> None:
    try:
        client = get_redis()
        ttl = ttl or settings.CACHE_TTL_SECONDS
        client.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        return


def cache_delete_prefix(prefix: str) -> None:
    try:
        client = get_redis()
        keys = client.keys(f"{prefix}*")
        if keys:
            client.delete(*keys)
    except Exception:
        return
