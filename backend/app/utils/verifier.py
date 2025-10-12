import os
from googleapiclient.discovery import build
from app.config import GOOGLE_FACTCHECK_API_KEY

GOOGLE_FACTCHECK_API_KEY = os.getenv("GOOGLE_FACTCHECK_API_KEY")

def verify_claim(claim):
    service = build("factchecktools", "v1alpha1", developerKey=GOOGLE_FACTCHECK_API_KEY)
    response = service.claims().search(query=claim).execute()
    if "claims" in response:
        return response["claims"]
    return []
