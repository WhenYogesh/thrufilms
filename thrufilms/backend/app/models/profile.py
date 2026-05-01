from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    bio = Column(Text, default="")
    location = Column(String, default="")
    skills = Column(JSON, default=[])  # list of strings
    profile_image_url = Column(String, default="")
    portfolio_urls = Column(JSON, default=[])  # list of strings (image/video URLs)

    user = relationship("User", back_populates="profile")
