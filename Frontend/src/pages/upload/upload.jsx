import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Upload, FileText, Sparkles, TrendingUp, Award } from "lucide-react";

import ProfessionalCard from "../../components/ui/ProfessionalCard";
import ProfessionalButton from "../../components/ui/ProfessionalButton";
import ProfessionalBadge from "../../components/ui/ProfessionalBadge";
import ProfessionalProgress from "../../components/ui/ProfessionalProgress";
import ProfessionalAlert from "../../components/ui/ProfessionalAlert";
import UploadProgress from "../../components/upload/uploadprogress";
import AISuggestions from "../../components/upload/AIsuggestions";
import { postAI } from "../../lib/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!validateFile(selectedFile)) return;
    setFile(selectedFile);
    setResult(null);
    setError("");
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
    const droppedFile = e.dataTransfer.files[0];
    if (!validateFile(droppedFile)) return;
    setFile(droppedFile);
    setResult(null);
    setError("");
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      return text;
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Failed to read PDF file. Please try another file.");
    }
  };

  const saveResumeHistory = (entry) => {
    try {
      const raw = localStorage.getItem("cp_resume_history");
      const existing = raw ? JSON.parse(raw) : [];
      const history = Array.isArray(existing) ? existing : [];
      const updated = [entry, ...history];
      localStorage.setItem("cp_resume_history", JSON.stringify(updated.slice(0, 20)));
    } catch (err) {
      console.warn("Could not save resume history", err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");
    setProgress(0);

    try {
      console.log("Starting upload...");
      setProgress(10);

      const resumeText = await extractTextFromPDF(file);
      if (!resumeText.trim()) {
        throw new Error("No readable text found in this PDF.");
      }
      console.log("Text extracted, length:", resumeText.length);
      setProgress(30);

      const score = Math.min(100, Math.max(60, Math.floor(resumeText.length / 20)));

      const commonSkills = [
        "JavaScript", "React", "Node.js", "Express", "Python", "Java", "C++",
        "HTML", "CSS", "Tailwind", "Bootstrap", "SQL", "MongoDB", "MySQL",
        "Git", "GitHub", "Docker", "AWS", "REST API", "Firebase",
      ];
      const extractedSkills = commonSkills.filter((skill) =>
        resumeText.toLowerCase().includes(skill.toLowerCase())
      );
      console.log("Skills extracted:", extractedSkills);
      setProgress(50);

      let suggestions = "Resume analysis complete. Please review the skills and keywords sections for detailed insights.";
      try {
        const aiData = await postAI("/ai/resume", {
          text: resumeText.slice(0, 12000),
        });
        console.log("AI API Response:", aiData);
        if (aiData?.result) {
          suggestions = aiData.result;
        }
      } catch (aiError) {
        console.warn("AI API failed:", aiError);
        suggestions = "AI analysis unavailable at the moment. Review your resume content manually or try again later.";
      }
      setProgress(80);

      const missingKeywords = [];
      ["Leadership", "Communication", "Problem Solving", "Teamwork"].forEach(
        (keyword) => {
          if (!resumeText.toLowerCase().includes(keyword.toLowerCase())) {
            missingKeywords.push(keyword);
          }
        }
      );

      setProgress(100);

      const timestamp = Date.now();
      const jobMatches = Math.min(12, Math.max(1, extractedSkills.length + Math.floor(score / 20)));

      const entry = {
        id: timestamp,
        fileName: file.name,
        fileSize: file.size,
        atsScore: score,
        jobMatches,
        uploadDate: new Date().toLocaleString(),
        timestamp,
        skills: extractedSkills,
        suggestions: suggestions || "Analysis complete. Review your resume details above.",
        missingKeywords: missingKeywords || [],
      };

      console.log("Setting result:", entry);
      setResult(entry);
      saveResumeHistory(entry);
      
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to analyze resume. Please try again with a different PDF.");
      setResult(null);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Analyzing Your Resume</h1>
            <p className="text-slate-400 text-lg">Our AI is reviewing your resume...</p>
          </motion.div>

          <ProfessionalCard variant="primary" className="p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-2">Processing Your Resume</h3>
              <p className="text-slate-400 mb-8">Please wait while we analyze your document...</p>
              <div className="w-full max-w-md">
                <ProfessionalProgress progress={progress} size="lg" />
              </div>
            </div>
          </ProfessionalCard>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Upload Resume</h1>
            <p className="text-slate-400 text-lg">AI-Powered Resume Analysis</p>
          </motion.div>

          <ProfessionalAlert
            type="error"
            title="Analysis Failed"
            message={error}
            dismissible
            onDismiss={() => setError("")}
            className="mb-8"
          />

          <ProfessionalCard>
            <div className="p-8">
              <UploadBox
                file={file}
                dragActive={dragActive}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                loading={loading}
              />
            </div>
          </ProfessionalCard>
        </div>
      </div>
    );
  }

  // Render results
  if (result && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Resume Analysis</h1>
              <p className="text-slate-400 text-lg">Here's what we found</p>
            </div>
            <div className="flex items-center gap-3">
              <ProfessionalBadge variant="success" size="lg">
                <CheckCircle size={18} />
                Analysis Complete
              </ProfessionalBadge>
            </div>
          </motion.div>

          {/* ATS Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProfessionalCard variant="primary" className="p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Award className="text-blue-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">ATS Score</h3>
                    <p className="text-slate-400 text-sm">Applicant Tracking System Compatibility</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-2">{result.atsScore}%</div>
                  <ProfessionalBadge 
                    variant={result.atsScore >= 80 ? "success" : result.atsScore >= 60 ? "warning" : "error"}
                  >
                    {result.atsScore >= 80 ? "Excellent" : result.atsScore >= 60 ? "Good" : "Needs Improvement"}
                  </ProfessionalBadge>
                </div>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.atsScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg"
                />
              </div>
            </ProfessionalCard>
          </motion.div>

          {/* File Info & Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProfessionalCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <FileText className="text-slate-300" size={24} />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Resume Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">File Name</span>
                    <span className="text-white font-medium text-sm">{result.fileName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">File Size</span>
                    <span className="text-white font-medium text-sm">{(result.fileSize / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">Upload Date</span>
                    <span className="text-white font-medium text-sm">{result.uploadDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 text-sm">Job Matches</span>
                    <span className="text-white font-medium text-sm">{result.jobMatches}</span>
                  </div>
                </div>
              </ProfessionalCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProfessionalCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Sparkles className="text-yellow-400" size={24} />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Skills Detected</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.skills.length > 0 ? (
                    result.skills.map((skill, i) => (
                      <ProfessionalBadge key={i} variant="primary" size="sm">
                        {skill}
                      </ProfessionalBadge>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">No specific skills detected</p>
                  )}
                </div>
              </ProfessionalCard>
            </motion.div>
          </div>

          {/* AI Suggestions */}
          {result.suggestions && result.suggestions.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <AISuggestions
                suggestions={result.suggestions}
                missingKeywords={result.missingKeywords}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <ProfessionalButton
              onClick={() => {
                setResult(null);
                setFile(null);
                setError("");
                window.scrollTo(0, 0);
              }}
              variant="primary"
              size="lg"
              icon={Upload}
            >
              Upload Another Resume
            </ProfessionalButton>
            <ProfessionalButton
              onClick={() => window.print()}
              variant="secondary"
              size="lg"
              icon={FileText}
            >
              Print Analysis
            </ProfessionalButton>
          </motion.div>
        </div>
      </div>
    );
  }

  // Default - Upload Box
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6">
            <Sparkles className="text-blue-400" size={48} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">AI Resume Analyzer</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your resume and get detailed AI-powered analysis with ATS score, skill detection, and personalized improvement suggestions
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfessionalCard variant="primary" className="p-8">
            <div
              className={`
                relative
                rounded-2xl
                border-2
                border-dashed
                p-12
                text-center
                transition-all
                duration-300
                ${dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-600 hover:border-slate-500"
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl">
                    <Upload className="text-blue-400" size={48} />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  Upload Your Resume
                </h3>
                <p className="text-slate-400 mb-6">
                  Drag & drop your PDF resume here, or click to browse
                </p>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 inline-flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <FileText className="text-green-400" size={24} />
                    <div className="text-left">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </motion.div>
                )}
              </label>
            </div>

            {/* Upload Button */}
            <div className="mt-8 text-center">
              <ProfessionalButton
                onClick={handleUpload}
                disabled={!file || loading}
                loading={loading}
                variant="primary"
                size="lg"
                icon={TrendingUp}
                className="w-full md:w-auto"
              >
                {loading ? "Analyzing..." : "Upload & Analyze Resume"}
              </ProfessionalButton>
            </div>
          </ProfessionalCard>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-3">
              <Award className="text-blue-400" size={28} />
            </div>
            <h4 className="text-white font-semibold mb-2">ATS Score</h4>
            <p className="text-slate-400 text-sm">Get your resume compatibility score</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-xl mb-3">
              <Sparkles className="text-green-400" size={28} />
            </div>
            <h4 className="text-white font-semibold mb-2">AI Analysis</h4>
            <p className="text-slate-400 text-sm">Receive personalized suggestions</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-xl mb-3">
              <TrendingUp className="text-yellow-400" size={28} />
            </div>
            <h4 className="text-white font-semibold mb-2">Skill Detection</h4>
            <p className="text-slate-400 text-sm">Identify your key strengths</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}