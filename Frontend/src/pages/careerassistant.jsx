import { useState } from "react";
import { GraduationCap, Sparkles } from "lucide-react";
import { postAI } from "@/lib/api";

export default function CareerAssistant() {
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!skills.trim()) {
      setError("Enter your skills or career interests first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await postAI("/ai/career", { skills });
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Unable to generate career guidance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <GraduationCap className="text-indigo-300" size={30} />
          <h1 className="text-3xl font-bold text-white">AI Career Assistant</h1>
        </div>
        <p className="mt-2 text-slate-400">
          Get a practical roadmap, project ideas, and next steps based on your skills.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <label className="text-sm font-medium text-slate-200">
          Your skills or career goal
        </label>
        <textarea
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
          rows={7}
          className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-indigo-500"
          placeholder="Example: Python, React, FastAPI, SQL. I want to become a full stack developer."
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles size={18} />
          {loading ? "Generating..." : "Get Career Plan"}
        </button>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-5 leading-7 text-slate-200">
          {result}
        </div>
      )}
    </div>
  );
}
