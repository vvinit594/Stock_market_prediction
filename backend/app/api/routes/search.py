from fastapi import APIRouter, Query

from app.database.schemas import SearchHit
from app.services.search_service import SearchService

router = APIRouter(prefix="/api/search", tags=["search"])
search_service = SearchService()


@router.get("", response_model=list[SearchHit])
def search_stocks(
    q: str = Query(..., min_length=1, description="Company or ticker fragment"),
    limit: int = Query(20, ge=1, le=50),
) -> list[SearchHit]:
    rows = search_service.search(q, limit=limit)
    return [SearchHit(**row) for row in rows]
