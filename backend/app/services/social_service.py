import aiohttp
import praw
from app.config import REDDIT_CLIENT_ID, REDDIT_SECRET, TWITTER_BEARER_TOKEN

reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_SECRET,
    user_agent="VeriSenseAgent"
)

async def fetch_reddit_posts(subreddit="worldnews", limit=10):
    posts = []
    for sub in reddit.subreddit(subreddit).hot(limit=limit):
        posts.append({"title": sub.title, "url": sub.url, "score": sub.score})
    return posts

async def fetch_twitter_trending(query="crisis", max_results=10):
    url = "https://api.twitter.com/2/tweets/search/recent"
    headers = {"Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"}
    params = {"query": query, "max_results": max_results}
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, params=params) as res:
            data = await res.json()
            return [{"text": t["text"], "id": t["id"]} for t in data.get("data", [])]
