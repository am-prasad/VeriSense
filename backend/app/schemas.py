# from pydantic import BaseModel
# from typing import List

# class ClaimRequest(BaseModel):
#     text: str

# class ClaimResponse(BaseModel):
#     claims: List[str]

# class ReasoningRequest(BaseModel):
#     claim: str

# class ReasoningResponse(BaseModel):
#     claim: str
#     verdict: str
#     confidence: float

# class VerificationRequest(BaseModel):
#     claim: str

# class VerificationResponse(BaseModel):
#     claim: str
#     evidence: List[str]

from pydantic import BaseModel
from typing import List, Optional


# --- Step 1: Claim Extraction ---
class ClaimRequest(BaseModel):
    text: str


class ClaimResponse(BaseModel):
    claims: List[str]


# --- Step 2: Verification (Evidence Gathering) ---
class VerificationRequest(BaseModel):
    claim: str


class VerificationResponse(BaseModel):
    claim: str
    evidence: List[str]  # list of text snippets or URLs


# --- Step 3: AI Reasoning ---
class ReasoningRequest(BaseModel):
    claim: str
    evidence: Optional[List[str]] = []  # evidence may come from verification step


class ReasoningResponse(BaseModel):
    verdict: str  # e.g., "True", "False", or "Needs Review"
    confidence: float  # value between 0.0 and 1.0
    reasoning: List[str]  # explanation sentences
