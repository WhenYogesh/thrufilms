from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="unique_user_post_vote"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    vote_type = Column(Integer, nullable=False)  # 1 = upvote, -1 = downvote
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    post = relationship("Post", back_populates="votes")
