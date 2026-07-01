import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function SkillsCard({ skills = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit
          className="text-indigo-400"
          size={28}
        />

        <h2 className="text-2xl font-bold text-white">
          Extracted Skills
        </h2>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.08,
              }}
              className="px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-500 text-indigo-300 font-medium"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-400">
            Upload a resume to extract skills.
          </p>
        </div>
      )}
    </motion.div>
  );
}