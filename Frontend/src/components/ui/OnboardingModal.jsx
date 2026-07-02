import { useEffect, useState } from "react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("cp_onboarding_seen");
      if (!seen) setOpen(true);
    } catch (e) {
      setOpen(true);
    }
  }, []);

  function close() {
    try {
      localStorage.setItem("cp_onboarding_seen", "1");
    } catch (e) {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <div className="relative bg-slate-900 w-full max-w-2xl rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome to CareerPilot AI</h2>
        <p className="text-slate-400 mb-4">
          Quick start: Upload a resume, check ATS score, and explore our AI
          tools to improve your job search.
        </p>

        <ol className="list-decimal list-inside text-slate-400 space-y-2 mb-4">
          <li>Upload your resume via the Upload tool.</li>
          <li>Use Resume Builder to refine bullets.</li>
          <li>Open Career Assistant for a personalized roadmap.</li>
        </ol>

        <div className="flex justify-end">
          <button
            onClick={close}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
