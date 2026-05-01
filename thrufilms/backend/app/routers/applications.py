from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.post import Post
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationOut
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["Applications"])


def enrich_application(app: Application) -> dict:
    data = {
        "id": app.id,
        "post_id": app.post_id,
        "applicant_id": app.applicant_id,
        "message": app.message or "",
        "applied_at": app.applied_at,
        "applicant_name": None,
        "applicant_role": None,
        "applicant_image": None,
        "applicant_location": None,
        "applicant_skills": [],
    }
    if app.applicant:
        data["applicant_role"] = app.applicant.role
        if app.applicant.profile:
            p = app.applicant.profile
            data["applicant_name"] = p.name
            data["applicant_image"] = p.profile_image_url
            data["applicant_location"] = p.location
            data["applicant_skills"] = p.skills or []
    return data


@router.post("/{post_id}/apply", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_post(
    post_id: int,
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot apply to your own post")

    existing = db.query(Application).filter(
        Application.post_id == post_id,
        Application.applicant_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this post")

    application = Application(
        post_id=post_id,
        applicant_id=current_user.id,
        message=data.message or "",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return ApplicationOut(**enrich_application(application))


@router.get("/{post_id}/applicants", response_model=List[ApplicationOut])
def get_applicants(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only post owner can view applicants")

    applications = db.query(Application).filter(Application.post_id == post_id).all()
    return [ApplicationOut(**enrich_application(a)) for a in applications]
