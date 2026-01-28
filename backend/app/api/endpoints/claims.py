from fastapi import APIRouter
from app.schemas import ClaimRequest, ClaimResponse
from app.utils.extractor import extract_claims

router = APIRouter()

@router.post("/extract", response_model=ClaimResponse)
async def extract_claims_endpoint(request: ClaimRequest):
    """
    Step 1: Extract claims from text using spaCy NER.
    Returns a list of sentences that contain verifiable entities.
    """
    claims_texts = extract_claims(request.text)
    return {"claims": claims_texts}
