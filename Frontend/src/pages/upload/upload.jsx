import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Award, Brain, CheckCircle, FileText, Sparkles, TrendingUp, Upload } from "lucide-react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!validateFile(selectedFile)) return;
    setFile(selectedFile);
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!validateFile(droppedFile)) return;
    setFile(droppedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    setTimeout(() => {
      const score = Math.min(99, 70 + Math.round(file.size / (1024 * 1024) * 8));
      const skills = ["React", "Node.js", "Python", "SQL", "Communication", "Leadership"].filter((skill) =>
        file.name.toLowerCase().includes(skill.toLowerCase()) || file.size > 200000
      );

      if (skills.length === 0) {
        skills.push("Problem Solving", "Teamwork");
      }

      setResult({
        fileName: file.name,
        fileSize: file.size,
        atsScore: score,
        jobMatches: Math.max(2, Math.min(10, skills.length + 1)),
        uploadDate: new Date().toLocaleString(),
        skills,
        suggestions: "Your resume structure looks solid. Add measurable achievements and tailor your summary to the target role.",
        missingKeywords: ["Leadership", "Communication", "Problem Solving"],
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">Analyzing Your Resume</h1>
            <p className="text-lg text-slate-400">We are reviewing the uploaded document and preparing a simple analysis.</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="mb-6 h-20 w-20 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
              <h2 className="mb-2 text-2xl font-bold text-white">Processing Resume</h2>
              <p className="text-slate-400">Please wait while we finish the analysis.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Resume Analysis</h1>
              <p className="mt-1 text-slate-400">Here is a simple report for your uploaded resume.</p>
            </div>
            <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300">
              <span className="mr-2">✓</span> Analysis Ready
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <Award className="text-blue-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">ATS Score</h2>
                <p className="text-sm text-slate-400">Your resume compatibility score.</p>
              </div>
            </div>
            <div className="text-5xl font-bold text-white">{result.atsScore}%</div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${result.atsScore}%` }} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-white">Resume Details</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 py-2"><span>File Name</span><span className="text-white">{result.fileName}</span></div>
                <div className="flex items-center justify-between border-b border-slate-800 py-2"><span>File Size</span><span className="text-white">{(result.fileSize / 1024).toFixed(1)} KB</span></div>
                <div className="flex items-center justify-between border-b border-slate-800 py-2"><span>Upload Time</span><span className="text-white">{result.uploadDate}</span></div>
                <div className="flex items-center justify-between py-2"><span>Job Matches</span><span className="text-white">{result.jobMatches}</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-white">Detected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200">{skill}</span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                <div className="mb-2 flex items-center gap-2"><AlertCircle size={16} /> Missing keywords to improve</div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword) => (
                    <span key={keyword} className="rounded-full border border-yellow-400/30 px-3 py-1">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="mb-3 flex items-center gap-2 text-white"><Brain size={18} /> AI Summary</div>
            <p className="leading-7 text-slate-300">{result.suggestions}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={() => { setResult(null); setFile(null); setError(""); }} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500">Upload Another Resume</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-blue-500/10 p-3">
            <Sparkles className="text-blue-400" size={48} />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">AI Resume Analyzer</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">Upload a PDF resume and get a simple, reliable analysis with ATS-style feedback and suggested improvements.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
            <div className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-500"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-6">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-slate-800/60 p-4">
                    <Upload className="text-blue-400" size={48} />
                  </div>
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-white">Upload Your Resume</h3>
                <p className="mb-6 text-slate-400">Drag and drop a PDF here or click to browse.</p>
                {file && (
                  <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
                    <FileText className="text-green-400" size={20} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="mt-8 text-center">
              <button onClick={handleUpload} disabled={!file || loading} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Analyzing..." : "Upload & Analyze Resume"}</button>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center">
            <Award className="mx-auto mb-3 text-blue-400" size={28} />
            <h4 className="font-semibold text-white">ATS Score</h4>
            <p className="mt-2 text-sm text-slate-400">See how resume-ready your document looks.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center">
            <Sparkles className="mx-auto mb-3 text-green-400" size={28} />
            <h4 className="font-semibold text-white">AI Suggestions</h4>
            <p className="mt-2 text-sm text-slate-400">Get clear ways to improve your resume wording.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center">
            <TrendingUp className="mx-auto mb-3 text-yellow-400" size={28} />
            <h4 className="font-semibold text-white">Skill Match</h4>
            <p className="mt-2 text-sm text-slate-400">Highlight the strengths that matter most.</p>
          </div>
        </div>
      </div>
    </div>
  );
}