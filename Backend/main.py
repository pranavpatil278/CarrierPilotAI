from pathlib import Path
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# Load environment variables before importing routes/services.
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

from app.routes.ai_routes import router as ai_router
from app.routes.auth_routes import router as auth_router


app = FastAPI(
    title="CareerPilot AI Backend",
    description="AI-powered Resume Analyzer, Job Matcher, Career Assistant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_router, prefix="/ai", tags=["AI Tools"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])


@app.get("/")
def home():
    return {
        "success": True,
        "message": "CareerPilot AI Backend is running",
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
        "service": "AI Backend Working",
    }


@app.on_event("startup")
def startup_event():
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if not openrouter_key:
        print("Warning: OPENROUTER_API_KEY not found in environment variables")
    else:
        print("Environment variables loaded successfully")
