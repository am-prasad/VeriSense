import aiohttp
import feedparser
from app.config import NEWS_API_KEY, NEWSDATA_API_KEY

async def fetch_newsapi(query="crisis", country="us"):
    url = "https://newsapi.org/v2/top-headlines"
    params = {"apiKey": NEWS_API_KEY, "q": query, "country": country, "pageSize": 10}
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as res:
            data = await res.json()
            return data.get("articles", [])

async def fetch_newsdataio(query="india crisis"):
    url = f"https://newsdata.io/api/1/news?apikey={NEWSDATA_API_KEY}&q={query}&country=in"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as res:
            return (await res.json()).get("results", [])

def fetch_pib_rss():
    url = "https://pib.gov.in/rssfeed.aspx"
    feed = feedparser.parse(url)
    return [{"title": e.title, "link": e.link, "published": e.published} for e in feed.entries]

async def get_combined_news():
    data = []
    data.extend(await fetch_newsapi())
    data.extend(await fetch_newsdataio())
    data.extend(fetch_pib_rss())
    return data
