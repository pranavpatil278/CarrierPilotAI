import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAI } from "@/lib/api";

export default function ForgotPassword() {
  const [step, setStep] = useState("identifier"); // identifier, verify, reset
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!identifier) return alert("Enter email or phone number");

    setLoading(true);
    try {
      const payload = identifier.includes("@")
        ? { email: identifier }
        : { phone: identifier };

      const res = await fetch("http://localhost:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Failed to send OTP");
      }

      const data = await res.json();
      localStorage.setItem("cp_reset_identifier", identifier);
      
      // Show OTP for dev/testing if returned
      if (data.otp) {
        setMessage(`OTP: ${data.otp} (Sent via: ${data.sent_via})`);
      } else {
        setMessage("OTP sent successfully!");
      }
      
      setStep("verify");
    } catch (e) {
      console.error("Send OTP error:", e);
      alert("Backend is not running. Check that the backend server is started at localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/verify-otp-for-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Invalid OTP");
      }

      setMessage("OTP verified! Set your new password.");
      setStep("reset");
    } catch (e) {
      console.error("Verify OTP error:", e);
      alert("Backend error. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Enter new password");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          otp,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Failed to reset password");
      }

      alert("Password reset successful! Please login with your new password.");
      localStorage.removeItem("cp_reset_identifier");
      navigate("/login");
    } catch (e) {
      console.error("Reset password error:", e);
      alert("Backend error. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
            CP
          </div>
          <div>
            <h1 className="text-2xl font-bold">CareerPilot AI</h1>
            <p className="text-slate-400 text-sm">Reset your password</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
            {message}
          </div>
        )}

        <div className="mt-4 space-y-4">
          {step === "identifier" && (
            <>
              <div>
                <label className="text-slate-400 text-sm">Email or Phone</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type="text"
                  placeholder="you@company.com or +1234567890"
                  className="w-full mt-2 p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-semibold"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <div>
                <label className="text-slate-400 text-sm">
                  OTP sent to {identifier}
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full mt-2 p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-semibold"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={() => setStep("identifier")}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm"
              >
                Back
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <div>
                <label className="text-slate-400 text-sm">New Password</label>
                <div className="relative mt-2">
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm">Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full mt-2 p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-semibold"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-sm"
          >
            Back to Login
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Powered by CareerPilot AI
        </div>
      </div>
    </div>
  );
}
