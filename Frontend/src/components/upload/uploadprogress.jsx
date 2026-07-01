import { motion } from "framer-motion";
import { Brain, FileText, Search, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <FileText size={20} />,
    title: "Reading Resume",
  },
  {
    icon: <Search size={20} />,
    title: "Extracting Text",
  },
  {
    icon: <Brain size={20} />,
    title: "Analyzing ATS Score",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Generating AI Suggestions",
  },
];

export default function UploadProgress({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
    >
      <h2 className="text-xl font-bold text-white mb-6">
        AI Analysis
      </h2>

      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.4,
          }}
        />
      </div>

      <p className="mt-3 text-blue-400 font-semibold">
        {progress}% Completed
      </p>

      <div className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: index * 0.15,
            }}
            className="flex items-center gap-4 p-3 rounded-xl bg-slate-800"
          >
            <div className="text-blue-400">
              {step.icon}
            </div>

            <p className="text-slate-300">
              {step.title}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}