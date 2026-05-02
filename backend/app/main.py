import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes import dashboard, news, portfolio, prediction, search, sentiment, stock
from app.core.cache import get_redis
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.database.db import SessionLocal

settings = get_settings()
configure_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.APP_DEBUG,
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(search.router)
app.include_router(stock.router)
app.include_router(news.router)
app.include_router(sentiment.router)
app.include_router(prediction.router)
app.include_router(portfolio.router)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/ready")
def readiness_check() -> dict:
    db_ok = False
    redis_ok = False
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    finally:
        try:
            db.close()
        except Exception:
            pass

    try:
        get_redis().ping()
        redis_ok = True
    except Exception:
        redis_ok = False

    return {"status": "ok" if (db_ok and redis_ok) else "degraded", "database": db_ok, "redis": redis_ok}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s: %s", request.url.path, str(exc))
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
