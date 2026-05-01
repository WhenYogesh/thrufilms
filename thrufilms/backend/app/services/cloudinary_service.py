import cloudinary
import cloudinary.uploader
from app.config import settings
import io

# Configure Cloudinary if credentials are set
_cloudinary_configured = False

def _ensure_configured():
    global _cloudinary_configured
    if not _cloudinary_configured and settings.CLOUDINARY_CLOUD_NAME:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )
        _cloudinary_configured = True
    return _cloudinary_configured


async def upload_image(file_bytes: bytes, filename: str, folder: str = "thrufilms") -> str:
    """Upload image to Cloudinary. Returns URL. Falls back to placeholder if not configured."""
    if not _ensure_configured():
        # Stub mode: return a placeholder avatar
        seed = abs(hash(filename)) % 1000
        return f"https://api.dicebear.com/7.x/initials/svg?seed={seed}&backgroundColor=1a1a2e"

    result = cloudinary.uploader.upload(
        io.BytesIO(file_bytes),
        folder=folder,
        resource_type="auto",
        public_id=filename.rsplit(".", 1)[0],
        overwrite=True,
    )
    return result.get("secure_url", "")
