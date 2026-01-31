from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import news, social, claims, verification, reasoning, voice

app = FastAPI(title="VeriSense")


origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://verisense.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to VeriSense Backend! Access API endpoints at /news, /claims, /voice, etc."}


app.include_router(news.router, prefix="/news", tags=["News"])
app.include_router(social.router, prefix="/social", tags=["Social Media"])
app.include_router(claims.router, prefix="/claims", tags=["Claims"])
app.include_router(verification.router, prefix="/verification", tags=["Verification"])
app.include_router(reasoning.router, prefix="/reasoning", tags=["Reasoning"])
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
