import { postAI } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) return alert("Enter email or phone");

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password: password || null }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Login failed");
      }

      const data = await res.json();

      if (data.requires_verification) {
        // store pending identifier and go to verify page
        localStorage.setItem("cp_pending_identifier", email);
        navigate("/verify");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("cp_user_email", email);
        // derive display name
        try {
          const raw = email.split("@")[0] || "User";
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

        navigate("/dashboard");
      }
    } catch (e) {
      // Backend unreachable — allow dev fallback so dashboard can be tested locally.
      console.warn("Auth backend unreachable — using dev fallback token", e);
      localStorage.setItem("token", "dev-dummy-token");
      localStorage.setItem("cp_user_email", email);
      try {
        const raw = email.split("@")[0] || "User";
        const name = raw
          .replace(/[._\-]/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");
        localStorage.setItem("cp_user_name", name || "User");
      } catch (e2) {
        localStorage.setItem("cp_user_name", "User");
      }
      navigate("/dashboard");
    }
  };

  const sendOtp = async () => {
    if (!email) return alert("Enter email or phone");

    try {
      const payload = email.includes("@")
        ? { email }
        : { phone: email };

      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.detail || "Failed to send OTP");
      }

      const data = await res.json();
      localStorage.setItem("cp_pending_identifier", email);
      
      // Show OTP for dev/testing if returned
      if (data.otp) {
        alert(`OTP sent!\n\nFor testing: ${data.otp}\n\nSent via: ${data.sent_via}`);
      }
      
      navigate("/verify");
    } catch (e) {
      console.error("OTP send error:", e);
      alert("Backend is not running. Check that the backend server is started at localhost:8000");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    caretColor: "white",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#94a3b8",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">CP</div>
          <div>
            <h1 className="text-2xl font-bold">CareerPilot AI</h1>
            <p className="text-slate-400 text-sm">Login to continue</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-slate-400 text-sm">Email or Phone</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="you@company.com or +1234567890"
              className="w-full mt-2 p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Password</label>
            <div className="relative mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (optional for OTP)"
                className="w-full p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button onClick={handleLogin} className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
            Login
          </button>

          <div className="flex flex-col gap-2">
            <button onClick={sendOtp} className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-sm font-semibold">
              Login with OTP (Email/Phone)
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/forgot-password')} className="text-sm text-sky-400 hover:underline">Forgot password?</button>
            <button onClick={() => navigate('/register')} className="text-sm text-sky-400 hover:underline">Create account</button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">Powered by CareerPilot AI</div>
      </div>
    </div>
  );
}