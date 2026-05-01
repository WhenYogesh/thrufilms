from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, default="")
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("Post", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
