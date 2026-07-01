import { postAI } from "@/lib/api";

export default function ResumeBuilder() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuild = async () => {
    if (!text.trim()) {
      setError("Add your resume notes or rough experience details first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await postAI("/ai/builder", {
        text: text.slice(0, 12000),
      });
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Unable to build resume content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <FileText className="text-blue-400" size={32} />
            </div>
            <div>
          <h1 className="text-4xl font-bold text-white">AI Resume Builder</h1>
          <p className="text-slate-400 mt-1">
            Transform your rough notes into resume bullet points
          </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProfessionalCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <WandSparkles className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Notes</h2>
                  <p className="text-slate-400 text-sm">
                    Paste your rough experience or theory
                  </p>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={12}
                className="w-full resize-none rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="Example: Built a React dashboard with real-time analytics, created FastAPI backend services, improved application performance by 40%, managed a team of 5 developers, implemented CI/CD pipelines..."
              />

              {error && (
                <ProfessionalAlert
                  type="error"
                  message={error}
                  className="mt-4"
                />
              )}

              <ProfessionalButton
                onClick={handleBuild}
                disabled={loading || !text.trim()}
                loading={loading}
                variant="primary"
                size="lg"
                icon={WandSparkles}
                className="w-full mt-6"
              >
                {loading ? "Building Resume..." : "Convert to Bullets"}
              </ProfessionalButton>
            </ProfessionalCard>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfessionalCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Sparkles className="text-green-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Resume Content</h2>
                  <p className="text-slate-400 text-sm">
                    AI-generated bullet points and definitions
                  </p>
                </div>
              </div>

              {result ? (
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-sm">
                      {result}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-700/50 p-12 text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl mb-4">
                    <FileText className="text-slate-500" size={48} />
                  </div>
                  <p className="text-slate-400">
                    Your resume content will appear here
                  </p>
                </div>
              )}
            </ProfessionalCard>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <ProfessionalCard variant="primary" className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  How It Works
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Paste your rough notes, experiences, or theoretical knowledge</li>
                  <li>• AI will convert them into actionable bullet points</li>
                  <li>• Get proper definitions and quantifiable achievements</li>
                  <li>• Perfect for resume sections like Experience, Projects, or Skills</li>
                </ul>
              </div>
            </div>
          </ProfessionalCard>
        </motion.div>
      </div>
    </div>
  );
}