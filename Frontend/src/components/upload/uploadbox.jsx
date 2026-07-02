import { motion } from "framer-motion";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";

export default function UploadBox({
  file,
  dragActive,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  handleUpload,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-3xl border-2 border-dashed p-8 md:p-10 text-center transition-all duration-300 ${
        dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900/70"
      } backdrop-blur-md shadow-xl`}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <UploadCloud size={70} className="mx-auto text-indigo-400" />
      </motion.div>

      <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">Upload Your Resume</h2>
      <p className="mt-3 text-slate-400">Drag and drop a PDF resume or click below to choose one.</p>

      <label className="mt-8 block cursor-pointer">
        <div className="rounded-2xl border border-slate-700 p-8 transition hover:border-indigo-500">
          <FileText size={40} className="mx-auto mb-3 text-indigo-400" />
          <p className="text-slate-300">Select Resume PDF</p>
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </div>
      </label>

      {file && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center justify-between rounded-2xl bg-slate-800 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />
            <div className="text-left">
              <p className="font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </motion.div>
      )}

      <button onClick={handleUpload} disabled={loading} className={`mt-8 rounded-xl px-6 py-3 font-semibold transition-all ${loading ? "cursor-not-allowed bg-slate-700" : "bg-indigo-600 hover:scale-105 hover:bg-indigo-500"}`}>
        {loading ? "Analyzing Resume..." : "Upload & Analyze"}
      </button>
    </motion.div>
  );
}