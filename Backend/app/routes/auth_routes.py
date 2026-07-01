from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.auth_service import (
    register_user,
    verify_user,
    login_user,
    forgot_password,
    verify_otp_for_reset,
    reset_password,
)

router = APIRouter()


class RegisterRequest(BaseModel):
    email: str | None = None
    phone: str | None = None
    password: str | None = None


class VerifyRequest(BaseModel):
    identifier: str
    otp: str


class LoginRequest(BaseModel):
    identifier: str
    password: str | None = None


class ForgotPasswordRequest(BaseModel):
    email: str | None = None
    phone: str | None = None


class VerifyOtpForResetRequest(BaseModel):
    identifier: str
    otp: str


class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str


@router.post("/register")
def register(req: RegisterRequest):
    if not req.email and not req.phone:
        raise HTTPException(status_code=400, detail="Provide email or phone")

    result = register_user(email=req.email, phone=req.phone, password=req.password)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to register user")

    return {
        "success": True,
        "message": "OTP sent (dev: check server logs)",
        "otp": result.get("otp"),  # Return OTP for dev/testing
        "sent_via": result.get("sent_via"),
    }


@router.post("/verify")
def verify(req: VerifyRequest):
    res = verify_user(req.identifier, req.otp)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    if res is False:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"success": True, "token": res["token"]}


@router.post("/login")
def login(req: LoginRequest):
    if not req.identifier:
        raise HTTPException(status_code=400, detail="Provide an email or phone number")

    res = login_user(req.identifier, password=req.password)
    if res is None:
        payload = {}
        if "@" in req.identifier:
            payload["email"] = req.identifier
        else:
            payload["phone"] = req.identifier
        if req.password:
            payload["password"] = req.password

        result = register_user(**payload)
        if not result:
            raise HTTPException(status_code=500, detail="Failed to start verification flow")

        return {
            "success": True,
            "requires_verification": True,
            "message": "OTP sent to verify and create your account.",
        }

    if res.get("invalid_password"):
        raise HTTPException(status_code=401, detail="Invalid password")
    if res.get("requires_password"):
        raise HTTPException(status_code=401, detail="Password required for this account")

    return {"success": True, **res}


@router.post("/forgot-password")
def forgot_pwd(req: ForgotPasswordRequest):
    if not req.email and not req.phone:
        raise HTTPException(status_code=400, detail="Provide email or phone")

    res = forgot_password(email=req.email, phone=req.phone)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "success": True,
        "message": "OTP sent to your email or phone",
        "otp": res.get("otp"),  # Return OTP for dev/testing
        "sent_via": res.get("sent_via"),
    }


@router.post("/verify-otp-for-reset")
def verify_otp_reset(req: VerifyOtpForResetRequest):
    if not req.identifier or not req.otp:
        raise HTTPException(status_code=400, detail="Provide identifier and OTP")

    res = verify_otp_for_reset(req.identifier, req.otp)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    if res is False:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"success": True, "message": "OTP verified"}


@router.post("/reset-password")
def reset_pwd(req: ResetPasswordRequest):
    if not req.identifier or not req.otp or not req.new_password:
        raise HTTPException(status_code=400, detail="Provide identifier, OTP, and new password")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    res = reset_password(req.identifier, req.otp, req.new_password)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    if res is False:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"success": True, "token": res["token"], "message": "Password reset successful"}
