from pydantic import BaseModel
from typing import List, Optional

class Claim(BaseModel):
    text: str
    source: Optional[str] = None
    verdict: Optional[str] = "Needs Review"
    evidence: Optional[List[str]] = []

class ReasoningResult(BaseModel):
    claim: str
    verdict: str
    confidence: float

class VerificationResult(BaseModel):
    claim: str
    evidence: List[str]
