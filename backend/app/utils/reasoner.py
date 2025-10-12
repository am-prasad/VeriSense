from typing import List

# Simplified rule-based claim reasoner that relies on evidence found by the verifier.
# This eliminates dependency on external ML models that were causing 401 errors.

def reason_claim(claim: str, evidence: List[str]):
    """
    Assigns a verdict and confidence based on the textual evidence provided by the verifier.

    Args:
        claim (str): The claim text being evaluated.
        evidence (List[str]): A list of textual ratings or URLs found by the fact-checker.

    Returns:
        dict: A dictionary containing the claim, verdict, and confidence score.
    """
    # 1. Check for clear "False" or "Misleading" ratings in the evidence.
    false_keywords = ["false", "misleading", "fake", "hoax", "unproven"]
    
    for item in evidence:
        if any(keyword in item.lower() for keyword in false_keywords):
            return {
                "claim": claim,
                "verdict": "False",
                "confidence": 0.95  # High confidence based on strong evidence rating
            }

    # 2. Check for "True" or "Accurate" ratings.
    true_keywords = ["true", "accurate", "correct"]
    for item in evidence:
        if any(keyword in item.lower() for keyword in true_keywords):
            return {
                "claim": claim,
                "verdict": "True",
                "confidence": 0.90  # High confidence based on strong evidence rating
            }

    # 3. If there is evidence, but no clear rating, mark as Needs Review.
    if evidence:
        return {
            "claim": claim,
            "verdict": "Needs Review",
            "confidence": 0.60
        }

    # 4. If no evidence was found at all.
    return {
        "claim": claim,
        "verdict": "Unverified",
        "confidence": 0.50
    }
