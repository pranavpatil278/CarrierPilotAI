import { postAI } from "@/lib/api";

const JobMatcher = () => {
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!skills.trim()) {
      setError("Please enter your skills first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await postAI("/ai/job", { skills });
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Unable to get job matches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      
      {/* Header */}
      <h1 className="text-2xl font-semibold">
        Job Matcher
      </h1>

      <p className="text-slate-400 mt-1">
        Match jobs based on your skills and profile
      </p>

      {/* Card */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
        
        <h2 className="font-medium text-slate-200 mb-3">
          Enter your skills
        </h2>

        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="React, Node, Tailwind..."
        />

        <button
          type="button"
          onClick={handleMatch}
          disabled={loading}
          className="mt-4 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Matching..." : "Find Jobs"}
        </button>

        {skills && (
          <p className="text-slate-400 mt-3 text-sm">
            Skills: {skills}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-6 whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-200">
          {result}
        </div>
      )}
      </div>
  );
};

export default JobMatcher;
