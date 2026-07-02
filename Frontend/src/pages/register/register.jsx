import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAI } from "@/lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email && !phone) return alert("Provide email or phone");

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || null, phone: phone || null, password: password || null }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Registration failed");
      }

      // go to verify
      localStorage.setItem("cp_pending_identifier", email || phone);
      navigate("/verify");
    } catch (e) {
      alert("Registration error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <label className="text-slate-400">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded mt-2 bg-slate-800 mb-4"
          placeholder="you@company.com"
        />

        <label className="text-slate-400">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded mt-2 bg-slate-800 mb-4"
          placeholder="+1234567890"
        />

        <label className="text-slate-400">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full p-3 rounded mt-2 bg-slate-800 mb-4"
          placeholder="Create a password"
        />

        <div className="flex justify-end">
          <button onClick={handleRegister} className="px-4 py-2 bg-blue-600 rounded">Register</button>
        </div>
      </div>
    </div>
  );
}
