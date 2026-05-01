from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import ProfileCreate, ProfileUpdate, ProfileOut, UserOut
from app.dependencies import get_current_user
from app.services.cloudinary_service import upload_image
from app.services.recommendation import get_recommendations

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/recommendations", response_model=List[UserOut])
def recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    users = get_recommendations(db, current_user)
    return users


@router.get("", response_model=List[UserOut])
def list_users(
    location: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(User).join(User.profile)

    if role:
        query = query.filter(User.role == role)
    if location:
        query = query.filter(Profile.location.ilike(f"%{location}%"))
    if skill:
        # JSON contains check — works for SQLite and PostgreSQL differently
        # Using basic LIKE for compatibility
        query = query.filter(Profile.skills.astext.contains(skill))

    return query.offset(skip).limit(limit).all()


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/profile", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
def create_profile(
    data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.profile:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")
    profile = Profile(user_id=current_user.id, **data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/profile", response_model=ProfileOut)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = current_user.profile
    if not profile:
        # Auto-create profile if missing
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(profile, key, val)

    db.commit()
    db.refresh(profile)
    return profile


@router.post("/upload-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images allowed")

    file_bytes = await file.read()
    url = await upload_image(file_bytes, f"user_{current_user.id}_{file.filename}")

    # Auto-save to profile
    profile = current_user.profile
    if profile:
        profile.profile_image_url = url
        db.commit()

    return {"url": url}
