from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApplicationCreate(BaseModel):
    message: Optional[str] = ""


class ApplicationOut(BaseModel):
    id: int
    post_id: int
    applicant_id: int
    message: str
    applied_at: datetime
    applicant_name: Optional[str] = None
    applicant_role: Optional[str] = None
    applicant_image: Optional[str] = None
    applicant_location: Optional[str] = None
    applicant_skills: Optional[list] = []

    class Config:
        from_attributes = True
