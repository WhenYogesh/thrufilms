from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class PostCreate(BaseModel):
    title: str
    description: str
    role_needed: str
    location: str
    budget_type: Literal["paid", "unpaid", "collaboration"] = "collaboration"
    contact: str
    gender: Optional[str] = None
    age_range: Optional[str] = None
    shoot_dates: Optional[str] = None
    compensation_details: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    role_needed: Optional[str] = None
    location: Optional[str] = None
    budget_type: Optional[str] = None
    contact: Optional[str] = None
    gender: Optional[str] = None
    age_range: Optional[str] = None
    shoot_dates: Optional[str] = None
    compensation_details: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class PostOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    role_needed: str
    location: str
    budget_type: str
    contact: str
    gender: Optional[str] = None
    age_range: Optional[str] = None
    shoot_dates: Optional[str] = None
    compensation_details: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime
    owner_name: Optional[str] = None
    owner_image: Optional[str] = None
    upvotes: int = 0
    downvotes: int = 0
    comment_count: int = 0
    user_vote: Optional[int] = None  # 1, -1, or None

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    posts: list[PostOut]
    total: int
    page: int
    per_page: int
