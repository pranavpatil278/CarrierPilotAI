import os
from pathlib import Path

import requests
from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-4o-mini"


def _get_openrouter_api_key():
    return os.getenv("OPENROUTER_API_KEY")


def run_ai(messages, model=DEFAULT_MODEL):
    api_key = _get_openrouter_api_key()

    if not api_key:
        return {
            "status": "error",
            "message": "OPENROUTER_API_KEY is missing",
        }

    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://127.0.0.1:5173",
                "X-Title": "CareerPilot AI",
            },
            json={
                "model": model,
                "messages": messages,
            },
            timeout=60,
        )

        try:
            result = response.json()
        except ValueError:
            return {
                "status": "error",
                "message": "Invalid response from AI provider",
                "status_code": response.status_code,
                "details": response.text,
            }

        if response.status_code >= 400 or "error" in result:
            return {
                "status": "error",
                "message": "Model error",
                "status_code": response.status_code,
                "details": result,
            }

        return result["choices"][0]["message"]["content"]

    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": "Request timed out",
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Request failed",
            "details": str(e),
        }
    except (KeyError, IndexError, TypeError) as e:
        return {
            "status": "error",
            "message": "Unexpected AI response format",
            "details": str(e),
        }


def analyze_resume(resume_text):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a resume analyzer. Give concise, practical feedback "
                "on strengths, missing keywords, formatting, and improvements."
            ),
        },
        {
            "role": "user",
            "content": f"Analyze this resume:\n\n{resume_text}",
        },
    ]
    return run_ai(messages)


def job_matcher(skills):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a job matching assistant. Recommend suitable job roles "
                "and explain why they match the user's skills."
            ),
        },
        {
            "role": "user",
            "content": f"Match these skills to jobs:\n\n{skills}",
        },
    ]
    return run_ai(messages)


def career_assistant(skills):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a career assistant. Suggest a learning roadmap, project "
                "ideas, and next career steps based on the user's skills."
            ),
        },
        {
            "role": "user",
            "content": f"Give career advice for these skills:\n\n{skills}",
        },
    ]
    return run_ai(messages)


def resume_builder(text):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a resume writing assistant. Rewrite the user's raw "
                "details into clear, ATS-friendly resume bullet points."
            ),
        },
        {
            "role": "user",
            "content": f"Improve this resume content:\n\n{text}",
        },
    ]
    return run_ai(messages)
