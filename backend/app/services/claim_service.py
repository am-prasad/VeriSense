# from app.utils.extractor import extract_claims
# from app.services.verification_service import verify_claim
# from app.services.reasoning_service import reason_claim

# def process_claim(text: str):
#     """
#     Full pipeline: extract claims -> verify -> reason
#     """
#     claims = extract_claims(text)
#     results = []
#     for c in claims:
#         # Step 1: Verify the claim and get evidence
#         evidence = verify_claim(c)
        
#         # Step 2: Reason about the claim using the gathered evidence
#         # Note: We now pass the evidence to the reason_claim function.
#         reasoning = reason_claim(c, evidence)
        
#         results.append({
#             "claim": c,
#             "evidence": evidence,
#             "verdict": reasoning
#         })
#     return results


# from app.utils.extractor import extract_claims
# from app.services.factcheck_service import verify_with_google_factcheck
# from app.services.reasoning_service import reason_claim

# async def process_claim(text: str):
#     claims = extract_claims(text)
#     results = []
#     for claim in claims:
#         evidence = await verify_with_google_factcheck(claim)
#         reasoning = reason_claim(claim, evidence)
#         results.append({ "claim": claim, "evidence": evidence, **reasoning })
#     return results



# from datetime import datetime
# from app.utils.extractor import extract_claims
# from app.services.factcheck_service import verify_with_google_factcheck
# from app.services.reasoning_service import reason_claim


# async def process_claim(text: str):
#     """
#     Extracts claims, verifies them using Fact Check API,
#     and enriches with reasoning + confidence.
#     Returns a structured list of verified claims.
#     """
#     try:
#         claims = extract_claims(text)
#         if not claims:
#             return [{
#                 "claim": text,
#                 "verdict": "Unverified",
#                 "confidence": 0.5,
#                 "sources": [],
#                 "evidence": ["No distinct claim detected."],
#                 "reasoning": "Claim extraction failed.",
#                 "timestamp": datetime.utcnow().isoformat()
#             }]

#         results = []
#         for claim in claims:
#             # Step 1: Verify with Fact Check API
#             evidence = await verify_with_google_factcheck(claim)

#             # --- Safety check for None/failed evidence ---
#             if not evidence or "evidence" not in evidence:
#                 evidence = {
#                     "verdict": "Unverified",
#                     "confidence": 0.5,
#                     "sources": [],
#                     "evidence": ["Evidence gathering failed or no results found."],
#                     "reasoning": "Google Fact Check API returned no data.",
#                 }

#             # Step 2: Generate reasoning
#             reasoning = reason_claim(claim, evidence)

#             # Step 3: Combine
#             result = {
#                 "claim": claim,
#                 "verdict": evidence.get("verdict", "Unknown"),
#                 "confidence": evidence.get("confidence", 0.7),
#                 "sources": evidence.get("sources", []),
#                 "evidence": evidence.get("evidence", []),
#                 "reasoning": reasoning.get("explanation", evidence.get("reasoning")),
#                 "timestamp": datetime.utcnow().isoformat()
#             }

#             results.append(result)

#         return results

#     except Exception as e:
#         # Global fallback in case of total failure
#         return [{
#             "claim": text,
#             "verdict": "Error",
#             "confidence": 0.0,
#             "sources": [],
#             "evidence": [f"Process failed: {str(e)}"],
#             "reasoning": "Pipeline execution failed during verification or reasoning.",
#             "timestamp": datetime.utcnow().isoformat()
#         }]



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
            claims = [text]  # fallback if extraction fails

        results = []
        for claim in claims:
            # Step 1: Verify with Google FactCheck API
            evidence = await verify_with_google_factcheck(claim)

            # Step 2: Generate reasoning
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
        # Fallback for total failure
        return [{
            "claim": text,
            "verdict": "Error",
            "confidence": 0.0,
            "sources": [],
            "evidence": [f"Pipeline execution failed: {str(e)}"],
            "reasoning": "Verification pipeline failed.",
            "timestamp": datetime.utcnow().isoformat()
        }]
