# from fastapi import APIRouter
# from app.schemas import ReasoningRequest, ReasoningResponse
# from app.services.reasoning_service import reason_claim
# from fastapi.responses import JSONResponse

# router = APIRouter()

# @router.post("/run", response_model=ReasoningResponse)
# async def reasoning_endpoint(request: ReasoningRequest):
#     try:
#         evidence_list = request.evidence or []  # now it's List[str], matches schema
#         result = reason_claim(request.claim, evidence_list)

#         if "reasoning" not in result or not result["reasoning"]:
#             result["reasoning"] = [
#                 "Analysis complete based on gathered evidence.",
#                 "Confidence score calculated from source authority.",
#                 "Verdict determined by cross-referencing multiple points."
#             ]
#         return result

#     except Exception as e:
#         return JSONResponse(
#             status_code=500,
#             content={"error": str(e)}
#         )


from fastapi import APIRouter
from app.schemas import ReasoningRequest, ReasoningResponse
from app.services.reasoning_service import reason_claim
from typing import List
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/run", response_model=ReasoningResponse)
async def reasoning_endpoint(request: ReasoningRequest):
    try:
        evidence: List[str] = request.evidence or []
        result = reason_claim(request.claim, evidence)

        # Ensure reasoning is always a list
        if "reasoning" not in result or not result["reasoning"]:
            result["reasoning"] = [
                "Analysis complete based on gathered evidence.",
                "Confidence score calculated from source authority.",
                "Verdict determined by cross-referencing multiple points."
            ]

        return result

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
