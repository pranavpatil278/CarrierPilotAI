import sqlite3
import uuid
import random
import os
import hashlib
import smtplib
from email.message import EmailMessage
from pathlib import Path
from datetime import datetime, timedelta
import requests

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "users.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def _get_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT,
            phone TEXT,
            password_hash TEXT,
            verified INTEGER DEFAULT 0,
            otp TEXT,
            otp_expires_at TEXT,
            token TEXT
        )
        """
    )
    conn.commit()

    # Ensure password_hash column exists for older schema versions
    cur.execute("PRAGMA table_info(users)")
    columns = [row[1] for row in cur.fetchall()]
    if "password_hash" not in columns:
        cur.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
        conn.commit()

    conn.close()


def _send_email_otp(email: str, otp: str) -> bool:
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_from = os.getenv("SMTP_FROM")
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes")

    if smtp_host and smtp_user and smtp_pass and smtp_from:
        try:
            message = EmailMessage()
            message["Subject"] = "CareerPilot AI Verification Code"
            message["From"] = smtp_from
            message["To"] = email
            message.set_content(
                f"Your CareerPilot verification code is: {otp}\n\nIf you did not request this, ignore this message."
            )

            if use_tls:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.send_message(message)
            else:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                    server.login(smtp_user, smtp_pass)
                    server.send_message(message)

            return True
        except Exception as e:
            print(f"[OTP EMAIL ERROR] {e}")
            return False

    return False


def _hash_password(password: str):
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"


def _verify_password(password: str, stored_hash: str):
    if not stored_hash:
        return False
    try:
        salt, key_hex = stored_hash.split("$", 1)
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return key.hex() == key_hex
    except Exception:
        return False


def _generate_otp():
    return f"{random.randint(100000,999999)}"


def register_user(email: str = None, phone: str = None, password: str = None):
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    if not email and not phone:
        return None

    password_hash = _hash_password(password) if password else None

    # check existing
    if email:
        cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    else:
        cur.execute("SELECT * FROM users WHERE phone = ?", (phone,))

    row = cur.fetchone()

    otp = _generate_otp()
    expires = (datetime.utcnow() + timedelta(minutes=10)).isoformat()

    if row:
        values = [otp, expires]
        query = "UPDATE users SET otp = ?, otp_expires_at = ?, verified = 0"
        if password_hash:
            query += ", password_hash = ?"
            values.append(password_hash)
        query += " WHERE id = ?"
        values.append(row["id"])
        cur.execute(query, tuple(values))
        user_id = row["id"]
    else:
        cur.execute(
            "INSERT INTO users (email, phone, password_hash, otp, otp_expires_at, verified) VALUES (?, ?, ?, ?, ?, 0)",
            (email, phone, password_hash, otp, expires),
        )
        user_id = cur.lastrowid

    conn.commit()
    conn.close()

    sent_via = "console"
    tw_sid = os.getenv("TWILIO_ACCOUNT_SID")
    tw_token = os.getenv("TWILIO_AUTH_TOKEN")
    tw_from = os.getenv("TWILIO_FROM_NUMBER")
    if phone and tw_sid and tw_token and tw_from:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{tw_sid}/Messages.json"
            data = {"From": tw_from, "To": phone, "Body": f"Your CareerPilot OTP is: {otp}"}
            resp = requests.post(url, data=data, auth=(tw_sid, tw_token), timeout=10)
            if resp.status_code in (200, 201):
                sent_via = "sms"
            else:
                print(f"[OTP SMS FAILED] status={resp.status_code} body={resp.text}")
        except Exception as e:
            print(f"[OTP SMS ERROR] {e}")

    if email:
        sent_email = _send_email_otp(email, otp)
        if sent_email:
            sent_via = "email"

    if sent_via == "console":
        print(f"[DEV OTP] user={email or phone} otp={otp}")

    return {"id": user_id, "otp": otp, "sent_via": sent_via}


def _send_otp_notification(email: str | None, phone: str | None, otp: str) -> str:
    sent_via = "console"
    tw_sid = os.getenv("TWILIO_ACCOUNT_SID")
    tw_token = os.getenv("TWILIO_AUTH_TOKEN")
    tw_from = os.getenv("TWILIO_FROM_NUMBER")

    if phone and tw_sid and tw_token and tw_from:
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{tw_sid}/Messages.json"
            data = {"From": tw_from, "To": phone, "Body": f"Your CareerPilot OTP is: {otp}"}
            resp = requests.post(url, data=data, auth=(tw_sid, tw_token), timeout=10)
            if resp.status_code in (200, 201):
                sent_via = "sms"
            else:
                print(f"[OTP SMS FAILED] status={resp.status_code} body={resp.text}")
        except Exception as e:
            print(f"[OTP SMS ERROR] {e}")

    if email:
        sent_email = _send_email_otp(email, otp)
        if sent_email:
            sent_via = "email"

    if sent_via == "console":
        print(f"[DEV OTP] user={email or phone} otp={otp}")

    return sent_via


def verify_user(identifier: str, otp: str):
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = ? OR phone = ?", (identifier, identifier))
    row = cur.fetchone()
    if not row:
        conn.close()
        return None

    if not row["otp"] or row["otp"] != otp:
        conn.close()
        return False

    # check expiry
    try:
        expires = datetime.fromisoformat(row["otp_expires_at"])
        if datetime.utcnow() > expires:
            conn.close()
            return False
    except Exception:
        pass

    token = str(uuid.uuid4())
    cur.execute(
        "UPDATE users SET verified = 1, token = ?, otp = NULL, otp_expires_at = NULL WHERE id = ?",
        (token, row["id"]),
    )
    conn.commit()
    conn.close()

    return {"token": token, "id": row["id"]}


def login_user(identifier: str, password: str = None):
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = ? OR phone = ?", (identifier, identifier))
    row = cur.fetchone()
    if not row:
        conn.close()
        return None

    if password:
        if not row["password_hash"]:
            new_hash = _hash_password(password)
            cur.execute("UPDATE users SET password_hash = ? WHERE id = ?", (new_hash, row["id"]))
            conn.commit()
            row = dict(row)
            row["password_hash"] = new_hash

        if not _verify_password(password, row["password_hash"]):
            conn.close()
            return {"invalid_password": True}

        if not row["verified"]:
            otp = _generate_otp()
            expires = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
            cur.execute("UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?", (otp, expires, row["id"]))
            conn.commit()
            conn.close()
            _send_otp_notification(row["email"], row["phone"], otp)
            return {"requires_verification": True}

        token = row["token"]
        if not token:
            token = str(uuid.uuid4())
            cur.execute("UPDATE users SET token = ? WHERE id = ?", (token, row["id"]))
            conn.commit()

        conn.close()
        return {"token": token}

    if not row["verified"]:
        otp = _generate_otp()
        expires = (datetime.utcnow() + timedelta(minutes=10)).isoformat()
        cur.execute("UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?", (otp, expires, row["id"]))
        conn.commit()
        conn.close()
        _send_otp_notification(row["email"], row["phone"], otp)
        return {"requires_verification": True}

    if row["password_hash"]:
        conn.close()
        return {"requires_password": True}

    token = row["token"]
    if not token:
        token = str(uuid.uuid4())
        cur.execute("UPDATE users SET token = ? WHERE id = ?", (token, row["id"]))
        conn.commit()

    conn.close()
    return {"token": token}


def forgot_password(email: str = None, phone: str = None):
    """Send OTP for password reset"""
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    if not email and not phone:
        return None

    cur.execute("SELECT * FROM users WHERE email = ? OR phone = ?", (email or phone, phone or email))
    row = cur.fetchone()

    if not row:
        return None

    otp = _generate_otp()
    expires = (datetime.utcnow() + timedelta(minutes=10)).isoformat()

    cur.execute(
        "UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?",
        (otp, expires, row["id"]),
    )
    conn.commit()
    conn.close()

    sent_via = _send_otp_notification(row["email"], row["phone"], otp)
    return {"id": row["id"], "otp": otp, "sent_via": sent_via}


def verify_otp_for_reset(identifier: str, otp: str):
    """Verify OTP for password reset"""
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = ? OR phone = ?", (identifier, identifier))
    row = cur.fetchone()

    if not row:
        conn.close()
        return None

    if not row["otp"] or row["otp"] != otp:
        conn.close()
        return False

    # check expiry
    try:
        expires = datetime.fromisoformat(row["otp_expires_at"])
        if datetime.utcnow() > expires:
            conn.close()
            return False
    except Exception:
        pass

    conn.close()
    return {"id": row["id"], "valid": True}


def reset_password(identifier: str, otp: str, new_password: str):
    """Reset password after OTP verification"""
    init_db()
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = ? OR phone = ?", (identifier, identifier))
    row = cur.fetchone()

    if not row:
        conn.close()
        return None

    if not row["otp"] or row["otp"] != otp:
        conn.close()
        return False

    # check expiry
    try:
        expires = datetime.fromisoformat(row["otp_expires_at"])
        if datetime.utcnow() > expires:
            conn.close()
            return False
    except Exception:
        pass

    password_hash = _hash_password(new_password)
    token = str(uuid.uuid4())

    cur.execute(
        "UPDATE users SET password_hash = ?, otp = NULL, otp_expires_at = NULL, verified = 1, token = ? WHERE id = ?",
        (password_hash, token, row["id"]),
    )
    conn.commit()
    conn.close()

    return {"token": token, "id": row["id"]}
