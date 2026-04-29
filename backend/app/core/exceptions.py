from fastapi import HTTPException, status


class ExternalServiceError(HTTPException):
    def __init__(self, detail: str = "External service unavailable") -> None:
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail)


class NotFoundError(HTTPException):
    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
