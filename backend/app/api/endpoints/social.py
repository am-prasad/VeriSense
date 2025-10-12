from fastapi import APIRouter
from app.services.social_service import fetch_reddit_posts, fetch_twitter_trending

router = APIRouter()

@router.get("/")
async def get_social():
    reddit = await fetch_reddit_posts()
    twitter = await fetch_twitter_trending()
    return {"reddit": reddit, "twitter": twitter}
