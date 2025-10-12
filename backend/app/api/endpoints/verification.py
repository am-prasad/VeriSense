from fastapi import APIRouter, HTTPException
from app.services.claim_service import process_claim

router = APIRouter()

@router.post("/")
async def verify_claim_api(data: dict):
    text = data.get("claim")
    if not text:
        raise HTTPException(status_code=400, detail="No claim text provided")
    try:
        result = await process_claim(text)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

# Alias for frontend
@router.post("/run")
async def verify_claim_run(data: dict):
    return await verify_claim_api(data)
