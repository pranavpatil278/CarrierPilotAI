import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

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
        dragActive
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-slate-700 bg-slate-900/70"
      } backdrop-blur-md shadow-xl`}
    >
      {/* Floating Upload Icon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
      >
        <UploadCloud
          size={70}
          className="mx-auto text-indigo-400"
        />
      </motion.div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold mt-5 text-white">
        Upload Your Resume
      </h2>

      <p className="text-slate-400 mt-3">
        Drag & Drop your PDF resume or click below
      </p>

      {/* Upload Area */}
      <label className="block mt-8 cursor-pointer">
        <div className="border border-slate-700 hover:border-indigo-500 rounded-2xl p-8 transition">
          <FileText
            size={40}
            className="mx-auto text-indigo-400 mb-3"
          />

          <p className="text-slate-300">
            Select Resume PDF
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </label>

      {/* Selected File */}
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-slate-800 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />

            <div className="text-left">
              <p className="font-medium text-white">
                {file.name}
              </p>

              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-8 px-6 py-3 rounded-xl font-semibold transition-all ${
          loading
            ? "bg-slate-700 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105"
        }`}
      >
        {loading
          ? "Analyzing Resume..."
          : "Upload & Analyze"}
      </button>
    </motion.div>
  );
}