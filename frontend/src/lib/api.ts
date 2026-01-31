

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'||'https://verisense-backend.onrender.com';

/**
 * Fetch latest news articles from backend
 */
export const fetchNews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/fetch`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};

/**
 * Full claim verification process
 * @param claimText The claim to verify
 * @param updateStep Callback to update UI progress
 */
export const verifyClaimProcess = async (
  claimText: string,
  updateStep: (step: number) => void
) => {
  try {
    // --- Step 1: Extract claim ---
    updateStep(1);
    const extractResp = await fetch(`${API_BASE_URL}/claims/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: claimText }),
    });
    if (!extractResp.ok) throw new Error("Claim extraction failed");
    const extractedData = await extractResp.json();

    let firstClaim: string | null = null;
    if (Array.isArray(extractedData)) firstClaim = extractedData[0]?.claim || null;
    else if (Array.isArray(extractedData.claims)) firstClaim = extractedData.claims[0] || null;

    if (!firstClaim) throw new Error("No claims could be extracted.");

    // --- Step 2: Verification / Evidence Gathering ---
    updateStep(2);
    const verifyResp = await fetch(`${API_BASE_URL}/verification/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: firstClaim }),
    });
    if (!verifyResp.ok) throw new Error("Evidence gathering failed");
    const verificationData = await verifyResp.json();
    const verificationResult = verificationData?.data?.[0] || verificationData?.data || {};

    // Ensure evidence is array of strings
    const evidenceArr: string[] = Array.isArray(verificationResult.evidence)
      ? verificationResult.evidence.map((e: any) => String(e))
      : [];

    // --- Step 3: AI Reasoning ---
    updateStep(3);
    const reasoningResp = await fetch(`${API_BASE_URL}/reasoning/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: firstClaim, evidence: evidenceArr }),
    });
    if (!reasoningResp.ok) throw new Error("AI reasoning failed");
    const reasoningData = await reasoningResp.json();

    const reasoningResult = reasoningData || {};

    updateStep(4);

    // --- Combine results ---
    return {
      claim: firstClaim,
      verdict: reasoningResult.verdict || verificationResult.verdict || "Unverified",
      confidence: reasoningResult.confidence || verificationResult.confidence || 0.5,
      sources: Array.isArray(verificationResult.sources) ? verificationResult.sources : [],
      evidence: evidenceArr,
      reasoning: Array.isArray(reasoningResult.reasoning)
        ? reasoningResult.reasoning
        : [String(reasoningResult.reasoning) || "No reasoning available"],
    };
  } catch (error: any) {
    console.error("Verification process failed:", error);
    throw new Error(error.message || "Verification process failed");
  }
};
