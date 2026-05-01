import logging
from contextlib import asynccontextmanager
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

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # ── Startup ──
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
    except Exception as exc:
        logger.error("Failed to create database tables: %s", exc)
        raise
    yield
    # ── Shutdown ──


app = FastAPI(
    title="ThruFilms API",
    description="Local film networking platform - Where Local Films Find Their Crew",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(applications.router)


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
