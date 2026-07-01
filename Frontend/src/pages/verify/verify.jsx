import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [identifierInput, setIdentifierInput] = useState("");
  const navigate = useNavigate();
  const storedIdentifier = localStorage.getItem("cp_pending_identifier") || "";
  const identifier = storedIdentifier || identifierInput;

  const handleVerify = async () => {
    if (!identifier) return alert("No identifier found. Please enter your email or phone.");
    if (!otp) return alert("Enter OTP");

    try {
      const res = await fetch("http://localhost:8000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Verification failed");
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("cp_user_email", identifier);
        // set display name from identifier
        try {
          const raw = identifier.split("@")[0] || "User";
          const name = raw
            .replace(/[._\-]/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ");
          localStorage.setItem("cp_user_name", name || "User");
        } catch (e) {
          localStorage.setItem("cp_user_name", "User");
        }

        localStorage.removeItem("cp_pending_identifier");
        navigate("/dashboard");
      }
    } catch (e) {
      alert("Verify error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Verify Account</h2>

        <p className="text-slate-400 mb-4">
          Enter the OTP sent to {storedIdentifier || "your email or phone"}
        </p>

        {!storedIdentifier && (
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2">
              Email or Phone
            </label>
            <input
              value={identifierInput}
              onChange={(e) => setIdentifierInput(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 text-white"
              placeholder="you@company.com or +1234567890"
            />
          </div>
        )}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded mt-2 bg-slate-800 mb-4"
          placeholder="Enter verification code"
        />

        <div className="flex justify-end">
          <button onClick={handleVerify} className="px-4 py-2 bg-blue-600 rounded">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
