from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import auth, users, posts, applications

# Import all models so they are registered with Base
from app.models.user import User  # noqa: F401
from app.models.profile import Profile  # noqa: F401
from app.models.post import Post  # noqa: F401
from app.models.application import Application  # noqa: F401
from app.models.vote import Vote  # noqa: F401
from app.models.comment import Comment  # noqa: F401

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ThruFilms API",
    description="Local film networking platform - Where Local Films Find Their Crew",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(applications.router)


@app.on_event("startup")
def startup_seed():
    """Startup event. Removed fake data seeding as per user request."""
    pass


@app.get("/", tags=["Health"])
def root():
    return {
        "app": "ThruFilms API",
        "tagline": "Where Local Films Find Their Crew",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
