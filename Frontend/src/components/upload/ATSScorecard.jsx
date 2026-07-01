import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function ATSScoreCard({ score }) {
  const getColor = () => {
    if (score >= 85) return "#22c55e"; // Green
    if (score >= 70) return "#facc15"; // Yellow
    return "#ef4444"; // Red
  };

  const getMessage = () => {
    if (score >= 85) return "Excellent Resume";
    if (score >= 70) return "Good Resume";
    return "Needs Improvement";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <Award className="text-yellow-400" size={28} />

        <h2 className="text-2xl font-bold text-white">
          ATS Score
        </h2>
      </div>

      <div className="w-52 h-52 mx-auto">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: getColor(),
            textColor: "#ffffff",
            trailColor: "#1e293b",
            textSize: "18px",
          })}
        />
      </div>

      <div className="mt-8 text-center">
        <h3
          className="text-2xl font-bold"
          style={{ color: getColor() }}
        >
          {getMessage()}
        </h3>

        <p className="text-slate-400 mt-3">
          Your resume has been analyzed successfully.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-green-400">
        <TrendingUp size={18} />

        <span>
          Higher ATS score increases interview chances.
        </span>
      </div>
    </motion.div>
  );
}