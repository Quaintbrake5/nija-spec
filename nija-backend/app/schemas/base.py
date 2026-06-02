from typing import TypeVar, Generic, List, Optional
from pydantic import BaseModel

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    """
    Standard API response wrapper.
    """
    data: T
    message: Optional[str] = None

class PaginatedResponse(BaseModel, Generic[T]):
    """
    Standard paginated response wrapper.
    """
    data: List[T]
    total: int
    page: int
    pageSize: int
    totalPages: int
