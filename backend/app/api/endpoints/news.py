from fastapi import APIRouter
from app.services.news_agent import get_combined_news

router = APIRouter()

@router.get("/")
async def get_news():
    data = await get_combined_news()
    return {"articles": data}
