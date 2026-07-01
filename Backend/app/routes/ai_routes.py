from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import (
    analyze_resume,
    career_assistant,
    job_matcher,
    resume_builder,
)


router = APIRouter()


class TextRequest(BaseModel):
    text: str


class SkillsRequest(BaseModel):
    skills: str


def _clean(value):
    return value.strip()


def _raise_if_ai_error(result):
    if isinstance(result, dict) and result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result)


@router.post("/resume")
def resume_ai(data: TextRequest):
    text = _clean(data.text)
    if not text:
        raise HTTPException(status_code=400, detail="Missing 'text' field")

    result = analyze_resume(text)
    _raise_if_ai_error(result)

    return {
        "success": True,
        "type": "resume_analysis",
        "result": result,
    }


@router.post("/job")
def job_ai(data: SkillsRequest):
    skills = _clean(data.skills)
    if not skills:
        raise HTTPException(status_code=400, detail="Missing 'skills' field")

    result = job_matcher(skills)
    _raise_if_ai_error(result)

    return {
        "success": True,
        "type": "job_match",
        "result": result,
    }


@router.post("/career")
def career_ai(data: SkillsRequest):
    skills = _clean(data.skills)
    if not skills:
        raise HTTPException(status_code=400, detail="Missing 'skills' field")

    result = career_assistant(skills)
    _raise_if_ai_error(result)

    return {
        "success": True,
        "type": "career_advice",
        "result": result,
    }


@router.post("/builder")
def builder_ai(data: TextRequest):
    text = _clean(data.text)
    if not text:
        raise HTTPException(status_code=400, detail="Missing 'text' field")

    result = resume_builder(text)
    _raise_if_ai_error(result)

    return {
        "success": True,
        "type": "resume_builder",
        "result": result,
    }
