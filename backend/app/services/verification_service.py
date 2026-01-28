def verify_claim(claim: str):
    """
    Simulated verification service — gather evidence (mocked URLs).
    """
    if not claim:
        return []
   
    return [
        "https://www.who.int/news-room/fact-sheets/detail/coffee-and-health",
        "https://www.nih.gov/news-events/nih-research-matters/coffee-consumption-and-health",
        "https://pubmed.ncbi.nlm.nih.gov/12345678/"
    ]
