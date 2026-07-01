import { postAI } from "@/lib/api";

export default function ProfessionalProgress({
  progress,
  size = "md",
  variant = "primary",
  showLabel = true,
  className = "",
}) {
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variants = {
    primary: "from-blue-600 to-blue-400",
    success: "from-green-600 to-green-400",
    warning: "from-yellow-600 to-yellow-400",
    error: "from-red-600 to-red-400",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-300">Progress</span>
          <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/50 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`
            h-full
            bg-gradient-to-r
            ${variants[variant]}
            rounded-full
            shadow-lg
          `}
        />
      </div>
    </div>
  );
}