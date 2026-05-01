from pydantic import BaseModel
from typing import Literal


class VoteCreate(BaseModel):
    vote_type: Literal[1, -1]  # 1 = upvote, -1 = downvote


class VoteOut(BaseModel):
    post_id: int
    vote_type: int
    total_upvotes: int
    total_downvotes: int

    class Config:
        from_attributes = True
