from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    post_id: int
    user_id: int
    content: str
    created_at: datetime
    author_name: Optional[str] = None
    author_image: Optional[str] = None
    author_role: Optional[str] = None

    class Config:
        from_attributes = True
