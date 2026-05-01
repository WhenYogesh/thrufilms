from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func
from typing import Optional, List
from app.database import get_db
from app.models.post import Post
from app.models.profile import Profile
from app.models.vote import Vote
from app.models.comment import Comment
from app.schemas.post import PostCreate, PostUpdate, PostOut, PostListResponse
from app.schemas.vote import VoteCreate, VoteOut
from app.schemas.comment import CommentCreate, CommentOut
from app.dependencies import get_current_user
from app.models.user import User
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import decode_access_token

router = APIRouter(prefix="/posts", tags=["Posts"])

bearer_scheme = HTTPBearer(auto_error=False)


def _get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Get current user if token provided, otherwise return None."""
    if credentials is None:
        return None
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


def enrich_post(post: Post, current_user_id: Optional[int] = None, db: Optional[Session] = None) -> dict:
    # Count votes
    upvotes = 0
    downvotes = 0
    user_vote = None

    if db:
        upvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post.id, Vote.vote_type == 1).scalar() or 0
        downvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post.id, Vote.vote_type == -1).scalar() or 0
        comment_count = db.query(sql_func.count(Comment.id)).filter(Comment.post_id == post.id).scalar() or 0

        if current_user_id:
            vote = db.query(Vote).filter(Vote.post_id == post.id, Vote.user_id == current_user_id).first()
            if vote:
                user_vote = vote.vote_type
    else:
        comment_count = 0

    data = {
        "id": post.id,
        "user_id": post.user_id,
        "title": post.title,
        "description": post.description,
        "role_needed": post.role_needed,
        "location": post.location,
        "budget_type": post.budget_type,
        "contact": post.contact,
        "gender": post.gender,
        "age_range": post.age_range,
        "shoot_dates": post.shoot_dates,
        "compensation_details": post.compensation_details,
        "lat": post.lat,
        "lng": post.lng,
        "created_at": post.created_at,
        "owner_name": None,
        "owner_image": None,
        "upvotes": upvotes,
        "downvotes": downvotes,
        "comment_count": comment_count,
        "user_vote": user_vote,
    }
    if post.owner and post.owner.profile:
        data["owner_name"] = post.owner.profile.name
        data["owner_image"] = post.owner.profile.profile_image_url
    return data


@router.get("", response_model=PostListResponse)
def list_posts(
    location: Optional[str] = Query(None),
    role_needed: Optional[str] = Query(None),
    budget_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, le=50),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(_get_optional_user),
):
    query = db.query(Post)

    if location:
        query = query.filter(Post.location.ilike(f"%{location}%"))
    if role_needed:
        query = query.filter(Post.role_needed.ilike(f"%{role_needed}%"))
    if budget_type:
        query = query.filter(Post.budget_type == budget_type)

    total = query.count()
    posts = query.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    current_user_id = current_user.id if current_user else None

    return PostListResponse(
        posts=[PostOut(**enrich_post(p, current_user_id, db)) for p in posts],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.post("", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    data: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = Post(user_id=current_user.id, **data.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return PostOut(**enrich_post(post, current_user.id, db))


@router.get("/{post_id}", response_model=PostOut)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(_get_optional_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    current_user_id = current_user.id if current_user else None
    return PostOut(**enrich_post(post, current_user_id, db))


@router.put("/{post_id}", response_model=PostOut)
def update_post(
    post_id: int,
    data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(post, key, val)

    db.commit()
    db.refresh(post)
    return PostOut(**enrich_post(post, current_user.id, db))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(post)
    db.commit()


# ========== VOTES ==========

@router.post("/{post_id}/vote", response_model=VoteOut)
def vote_on_post(
    post_id: int,
    data: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_vote = db.query(Vote).filter(
        Vote.post_id == post_id,
        Vote.user_id == current_user.id,
    ).first()

    if existing_vote:
        if existing_vote.vote_type == data.vote_type:
            # Toggle off — remove vote
            db.delete(existing_vote)
            db.commit()
            upvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post_id, Vote.vote_type == 1).scalar() or 0
            downvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post_id, Vote.vote_type == -1).scalar() or 0
            return VoteOut(post_id=post_id, vote_type=0, total_upvotes=upvotes, total_downvotes=downvotes)
        else:
            # Change vote direction
            existing_vote.vote_type = data.vote_type
            db.commit()
    else:
        vote = Vote(user_id=current_user.id, post_id=post_id, vote_type=data.vote_type)
        db.add(vote)
        db.commit()

    upvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post_id, Vote.vote_type == 1).scalar() or 0
    downvotes = db.query(sql_func.count(Vote.id)).filter(Vote.post_id == post_id, Vote.vote_type == -1).scalar() or 0
    return VoteOut(post_id=post_id, vote_type=data.vote_type, total_upvotes=upvotes, total_downvotes=downvotes)


# ========== COMMENTS ==========

@router.get("/{post_id}/comments", response_model=List[CommentOut])
def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()

    result = []
    for c in comments:
        data = {
            "id": c.id,
            "post_id": c.post_id,
            "user_id": c.user_id,
            "content": c.content,
            "created_at": c.created_at,
            "author_name": None,
            "author_image": None,
            "author_role": None,
        }
        if c.user:
            data["author_role"] = c.user.role
            if c.user.profile:
                data["author_name"] = c.user.profile.name
                data["author_image"] = c.user.profile.profile_image_url
        result.append(CommentOut(**data))
    return result


@router.post("/{post_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(user_id=current_user.id, post_id=post_id, content=data.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)

    author_name = None
    author_image = None
    author_role = current_user.role
    if current_user.profile:
        author_name = current_user.profile.name
        author_image = current_user.profile.profile_image_url

    return CommentOut(
        id=comment.id,
        post_id=comment.post_id,
        user_id=comment.user_id,
        content=comment.content,
        created_at=comment.created_at,
        author_name=author_name,
        author_image=author_image,
        author_role=author_role,
    )
