import aiohttp
from app.config import GOOGLE_FACTCHECK_API_KEY

async def verify_with_google_factcheck(claim: str):
    """
    Query Google Fact Check API for evidence about a given claim.
    Returns a structured dict with verdict, confidence, sources, and evidence.
    """
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {"query": claim, "key": GOOGLE_FACTCHECK_API_KEY}

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as res:
                if res.status != 200:
                    return {
                        "verdict": "Unverified",
                        "confidence": 0.5,
                        "sources": [],
                        "evidence": [f"Google API returned status {res.status}."]
                    }

                data = await res.json()
                claims = data.get("claims", [])

                if not claims:
                    return {
                        "verdict": "Unverified",
                        "confidence": 0.5,
                        "sources": [],
                        "evidence": ["No related fact-checks found for this claim."]
                    }

                verified_sources = []
                for c in claims:
                    text = c.get("text", "")
                    claim_reviews = c.get("claimReview", [])
                    for review in claim_reviews:
                        source_name = review.get("publisher", {}).get("name", "Unknown")
                        rating = review.get("textualRating", "Unrated")
                        url = review.get("url", "")
                        verified_sources.append({
                            "text": text,
                            "source": source_name,
                            "rating": rating,
                            "url": url
                        })

                # Compute basic verdict confidence
                positive = [s for s in verified_sources if "True" in s["rating"] or "Correct" in s["rating"]]
                negative = [s for s in verified_sources if "False" in s["rating"] or "Fake" in s["rating"]]

                if len(positive) > len(negative):
                    verdict = "True"
                    confidence = 0.8
                elif len(negative) > len(positive):
                    verdict = "False"
                    confidence = 0.9
                else:
                    verdict = "Mixed"
                    confidence = 0.6

                evidence_texts = [f"{s['rating']} - {s['source']}" for s in verified_sources]

                return {
                    "verdict": verdict,
                    "confidence": confidence,
                    "sources": [s["source"] for s in verified_sources],
                    "evidence": evidence_texts
                }

    except Exception as e:
        return {
            "verdict": "Unverified",
            "confidence": 0.4,
            "sources": [],
            "evidence": [f"Evidence gathering failed: {str(e)}"]
        }
