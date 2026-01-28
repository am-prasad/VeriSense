from datetime import datetime
from app.utils.extractor import extract_claims
from app.services.factcheck_service import verify_with_google_factcheck
from app.services.reasoning_service import reason_claim

async def process_claim(text: str):
    """
    Full pipeline: extract claims -> verify -> reason
    Returns a structured list of verified claims with evidence and reasoning.
    """
    try:
        claims = extract_claims(text)
        if not claims:
            claims = [text]  

        results = []
        for claim in claims:
            
            evidence = await verify_with_google_factcheck(claim)

            
            reasoning = reason_claim(claim, evidence)

            results.append({
                "claim": claim,
                "verdict": evidence.get("verdict", "Unverified"),
                "confidence": evidence.get("confidence", 0.5),
                "sources": evidence.get("sources", []),
                "evidence": evidence.get("evidence", []),
                "reasoning": reasoning.get("explanation", "No reasoning provided."),
                "timestamp": datetime.utcnow().isoformat()
            })

        return results

    except Exception as e:
        
        return [{
            "claim": text,
            "verdict": "Error",
            "confidence": 0.0,
            "sources": [],
            "evidence": [f"Pipeline execution failed: {str(e)}"],
            "reasoning": "Verification pipeline failed.",
            "timestamp": datetime.utcnow().isoformat()
        }]
