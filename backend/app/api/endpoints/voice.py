from fastapi import APIRouter, UploadFile, File
from app.utils.stt import transcribe_audio
from app.utils.tts import generate_speech
from app.utils.extractor import extract_claims
from app.utils.verifier import verify_claim
from app.utils.reasoner import reason_claim
from fastapi.responses import FileResponse

router = APIRouter()

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())

    transcript = transcribe_audio(file_location)
    claims = extract_claims(transcript)
    results = []
    for c in claims:
        evidence = verify_claim(c)
        verdict = reason_claim(c)
        results.append({"claim": c, "evidence": evidence, "verdict": verdict})

    speech_file = generate_speech("All claims processed. Check the dashboard for details.")
    return {"transcript": transcript, "results": results, "speech_file": speech_file}

@router.get("/speech/{filename}")
async def get_speech_file(filename: str):
    return FileResponse(filename, media_type="audio/mpeg")
