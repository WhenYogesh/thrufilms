from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import Profile
from typing import List


def get_recommendations(db: Session, current_user: User, limit: int = 10) -> List[User]:
    """
    Recommend users based on:
    1. Same location as current user
    2. Matching skills (if current user has a profile with skills)
    """
    if not current_user.profile:
        # No profile yet: return recent users excluding self
        return (
            db.query(User)
            .filter(User.id != current_user.id)
            .join(User.profile)
            .order_by(User.created_at.desc())
            .limit(limit)
            .all()
        )

    user_location = current_user.profile.location or ""
    user_skills = set(current_user.profile.skills or [])

    # Get all users with profiles excluding self
    candidates = (
        db.query(User)
        .filter(User.id != current_user.id)
        .join(User.profile)
        .all()
    )

    def score(user: User) -> int:
        s = 0
        if user.profile:
            if user_location and user.profile.location == user_location:
                s += 10
            candidate_skills = set(user.profile.skills or [])
            s += len(user_skills & candidate_skills) * 2
        return s

    ranked = sorted(candidates, key=score, reverse=True)
    return ranked[:limit]
