# from fastapi import APIRouter
# from app.schemas import ClaimRequest, ClaimResponse
# from app.services.claim_service import process_claim

# router = APIRouter()

# @router.post("/extract", response_model=ClaimResponse)
# async def extract_claims_endpoint(request: ClaimRequest):
#     results = process_claim(request.text)
#     claims_texts = [r["claim"] for r in results]
#     return {"claims": claims_texts}


# from fastapi import APIRouter
# from app.schemas import ClaimRequest, ClaimResponse
# from app.utils.extractor import extract_claims  # simple extraction logic

# router = APIRouter()

# @router.post("/extract", response_model=ClaimResponse)
# async def extract_claims_endpoint(request: ClaimRequest):
#     """
#     Extract claims from the given text (without verification or reasoning).
#     """
#     text = request.text.strip()
#     if not text:
#         return {"claims": []}

#     claims = extract_claims(text)
#     return {"claims": claims}


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
