import spacy
from typing import List

# spaCy model to use
MODEL_NAME = "en_core_web_sm"

# Named Entity labels considered verifiable claims
VERIFIABLE_ENTITY_LABELS = ["PERSON", "ORG", "GPE", "DATE", "EVENT"]

# Load NLP model once at import
try:
    nlp = spacy.load(MODEL_NAME)
except OSError:
    print(f"Error loading spaCy model '{MODEL_NAME}'. Run: python -m spacy download {MODEL_NAME}")
    raise

def extract_claims(text: str) -> List[str]:
    """
    Extracts sentences containing verifiable entities (PERSON, ORG, GPE, DATE, EVENT)
    as candidate claims for verification.

    Args:
        text (str): Input text containing potential claims.

    Returns:
        List[str]: Extracted claim sentences.
    """
    if not text:
        return []

    doc = nlp(text)

    # Filter sentences with at least one verifiable entity
    claims = [
        sent.text.strip()
        for sent in doc.sents
        if any(ent.label_ in VERIFIABLE_ENTITY_LABELS for ent in sent.ents)
    ]

    # Fallback: if no claim detected, treat the full text as one claim
    if not claims:
        claims = [text.strip()]

    return claims
