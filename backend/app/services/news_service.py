import aiohttp
from app.config import NEWS_API_KEY

NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

async def fetch_news():
    params = {
        "apiKey": NEWS_API_KEY,
        "country": "us",
        "pageSize": 10
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(NEWS_API_URL, params=params) as response:
            if response.status != 200:
                raise Exception(f"NewsAPI request failed with status {response.status}")
            data = await response.json()
            return data.get("articles", [])
