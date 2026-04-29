from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.cache import cache_delete_prefix
from app.database.db import get_db
from app.database.models import PortfolioItem
from app.database.schemas import PortfolioAddRequest, PortfolioItemResponse

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


@router.post("/add", response_model=PortfolioItemResponse)
def add_to_portfolio(payload: PortfolioAddRequest, db: Session = Depends(get_db)) -> PortfolioItemResponse:
    symbol = payload.symbol.upper()
    existing = db.query(PortfolioItem).filter(PortfolioItem.symbol == symbol).first()
    if existing:
        existing.is_active = True
        existing.company_name = payload.company_name or existing.company_name
        db.commit()
        db.refresh(existing)
        cache_delete_prefix("portfolio")
        return PortfolioItemResponse(
            symbol=existing.symbol,
            company_name=existing.company_name,
            added_at=existing.added_at,
        )
    row = PortfolioItem(symbol=symbol, company_name=payload.company_name, is_active=True)
    db.add(row)
    db.commit()
    db.refresh(row)
    cache_delete_prefix("portfolio")
    return PortfolioItemResponse(symbol=row.symbol, company_name=row.company_name, added_at=row.added_at)


@router.get("", response_model=list[PortfolioItemResponse])
def list_portfolio(db: Session = Depends(get_db)) -> list[PortfolioItemResponse]:
    rows = (
        db.query(PortfolioItem)
        .filter(PortfolioItem.is_active.is_(True))
        .order_by(PortfolioItem.added_at.desc())
        .all()
    )
    return [PortfolioItemResponse(symbol=r.symbol, company_name=r.company_name, added_at=r.added_at) for r in rows]


@router.delete("/{symbol}")
def remove_from_portfolio(symbol: str, db: Session = Depends(get_db)) -> dict:
    row = db.query(PortfolioItem).filter(PortfolioItem.symbol == symbol.upper()).first()
    if row:
        row.is_active = False
        db.commit()
        cache_delete_prefix("portfolio")
    return {"status": "ok", "removed_symbol": symbol.upper()}
