# import requests
# import json
# import os
# from typing import List
# from app.config import GROQ_API_KEY # Import the new Groq key

# # Groq's OpenAI-compatible API endpoint
# API_URL = "https://api.groq.com/openai/v1/chat/completions"
# MODEL_ID = "llama3-70b-8192" # The model you requested
# HEADERS = {
#     "Authorization": f"Bearer {GROQ_API_KEY}",
#     "Content-Type": "application/json"
# }

# def reason_claim(claim: str, evidence: List[str]):
#     """
#     Generate structured reasoning verdict using the Groq API with Llama 3.
#     """
#     evidence_text = "\\n".join(evidence) if evidence else "No evidence provided."

#     # The entire prompt, including system instructions and data, goes into the 'user' role for Groq's API.
#     # The Llama 3 special tokens will structure the prompt for the model itself.
#     prompt_content = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
# You are a factual reasoning assistant. Respond ONLY with a single, valid JSON object that follows this exact structure:
# {{"verdict": "True" | "False" | "Needs Review", "reasoning": ["<A short explanation for your verdict.>"], "confidence": <float between 0.0 and 1.0>}}<|eot_id|><|start_header_id|>user<|end_header_id|>
# Claim: "{claim}"
# Evidence:
# {evidence_text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

#     try:
#         # Correct OpenAI-compatible payload structure
#         payload = {
#             "model": MODEL_ID,
#             "messages": [
#                 # The full prompt is sent as the content of the user message
#                 {"role": "user", "content": prompt_content}
#             ],
#             "max_tokens": 350, # Increased slightly for the large model
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"} # Ask Groq for guaranteed JSON output
#         }

#         response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
#         response.raise_for_status() # This will raise an error for 4xx or 5xx responses

#         response_data = response.json()
        
#         assistant_message = response_data['choices'][0]['message']['content']
#         parsed = json.loads(assistant_message)

#         return {
#             "verdict": parsed.get("verdict", "Needs Review"),
#             "confidence": parsed.get("confidence", 0.6),
#             "reasoning": parsed.get("reasoning", ["No reasoning provided."])
#         }

#     except Exception as e:
#         print(f"FINAL SUBMISSION FAILED WITH GROQ: {str(e)}")
#         # This is the safe fallback so your app does not crash during the demo.
#         return {
#             "verdict": "Needs Review",
#             "confidence": 0.5,
#             "reasoning": ["The AI reasoning model is currently under heavy load. The verdict is based on a simplified analysis."]
#         }


import json
from typing import List
from groq import Groq
from app.config import GROQ_API_KEY

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

MODEL_ID = "qwen/qwen3-32b"

def reason_claim(claim: str, evidence: List[str]):
    """
    Generate structured reasoning verdict using Groq's Qwen3 model with reasoning.
    """
    evidence_text = "\n".join(evidence) if evidence else "No evidence provided."

    system_prompt = """You are a factual reasoning assistant with advanced reasoning capabilities. 
Analyze the claim and evidence carefully, then respond with ONLY a valid JSON object in this exact format:
{"verdict": "True" or "False" or "Needs Review", "reasoning": "Brief but thorough explanation", "confidence": 0.95}

Do not include any text outside the JSON object."""

    user_message = f"""Claim: "{claim}"

Evidence:
{evidence_text}

Analyze this claim using step-by-step reasoning and respond with only the JSON object."""

    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            max_completion_tokens=2048,
            top_p=0.9,
            reasoning_effort="default",  # Use default reasoning
            stream=False  # Set to False to get complete response at once
        )

        assistant_message = completion.choices[0].message.content.strip()
        
        # Extract JSON from response
        parsed = _extract_json(assistant_message)

        return {
            "verdict": parsed.get("verdict", "Needs Review"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "reasoning": [parsed.get("reasoning", "No reasoning provided.")]
        }

    except Exception as e:
        print(f"Groq Qwen3 reasoning failed: {str(e)}")
        return _fallback_reasoning(claim, evidence)


def reason_claim_streaming(claim: str, evidence: List[str]):
    """
    Streaming version for real-time reasoning output.
    Useful for long-form reasoning from Qwen3.
    """
    evidence_text = "\n".join(evidence) if evidence else "No evidence provided."

    system_prompt = """You are a factual reasoning assistant. Analyze the claim and evidence step-by-step.
After your reasoning, provide the final verdict as a JSON object:
{"verdict": "True" or "False" or "Needs Review", "reasoning": "explanation", "confidence": 0.0-1.0}"""

    user_message = f"""Claim: "{claim}"

Evidence:
{evidence_text}

Provide step-by-step reasoning, then end with the JSON verdict object."""

    try:
        full_response = ""
        
        with client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
            max_completion_tokens=2048,
            top_p=0.9,
            reasoning_effort="default",
            stream=True
        ) as completion:
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    print(content, end="", flush=True)  # Real-time output
        
        print()  # New line after streaming
        
        # Extract JSON from the full response
        parsed = _extract_json(full_response)

        return {
            "verdict": parsed.get("verdict", "Needs Review"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "reasoning": [parsed.get("reasoning", "No reasoning provided.")],
            "full_reasoning": full_response  # Include full reasoning chain
        }

    except Exception as e:
        print(f"\nGroq streaming reasoning failed: {str(e)}")
        return _fallback_reasoning(claim, evidence)


def _extract_json(text: str):
    """
    Extract JSON object from text, handling various formats.
    """
    try:
        # Try parsing the entire text first
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Try to find JSON object in the text
    start = text.find('{')
    end = text.rfind('}') + 1
    
    if start != -1 and end > start:
        try:
            json_str = text[start:end]
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # If all else fails, return a template
    return {
        "verdict": "Needs Review",
        "reasoning": "Could not parse structured response",
        "confidence": 0.3
    }


def _fallback_reasoning(claim: str, evidence: List[str]):
    """
    Fallback reasoning using simple heuristics when API fails.
    """
    has_evidence = len(evidence) > 0 and any(e.strip() for e in evidence)
    claim_length = len(claim.split())
    
    if not has_evidence:
        verdict = "Needs Review"
        confidence = 0.3
        reasoning = "No supporting evidence provided. Manual verification required."
    elif claim_length > 50:
        verdict = "Needs Review"
        confidence = 0.4
        reasoning = "Complex claim requires expert evaluation."
    else:
        verdict = "Needs Review"
        confidence = 0.5
        reasoning = "Reasoning model unavailable. Requires manual fact-checking."
    
    return {
        "verdict": verdict,
        "confidence": confidence,
        "reasoning": [reasoning]
    }