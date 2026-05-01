from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProfileCreate(BaseModel):
    name: str
    bio: Optional[str] = ""
    location: Optional[str] = ""
    skills: Optional[List[str]] = []
    profile_image_url: Optional[str] = ""
    portfolio_urls: Optional[List[str]] = []


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    profile_image_url: Optional[str] = None
    portfolio_urls: Optional[List[str]] = None


class ProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    bio: str
    location: str
    skills: List[str]
    profile_image_url: str
    portfolio_urls: List[str]

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime
    profile: Optional[ProfileOut] = None

    class Config:
        from_attributes = True
