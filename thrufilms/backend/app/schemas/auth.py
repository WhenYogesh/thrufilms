from pydantic import BaseModel, EmailStr
from typing import Literal


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["actor", "crew", "filmmaker"] = "actor"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
