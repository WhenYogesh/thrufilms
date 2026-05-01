from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class BudgetType(str):
    paid = "paid"
    unpaid = "unpaid"
    collaboration = "collaboration"


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    role_needed = Column(String, nullable=False)
    location = Column(String, nullable=False)
    budget_type = Column(String, nullable=False, default="collaboration")
    contact = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    age_range = Column(String, nullable=True)
    shoot_dates = Column(String, nullable=True)
    compensation_details = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="posts")
    applications = relationship("Application", back_populates="post", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
