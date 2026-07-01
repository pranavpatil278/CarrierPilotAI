import { postAI } from "@/lib/api";

export default function ProfessionalCard({
  children,
  className = "",
  variant = "default",
  hover = true,
}) {
  const variants = {
    default: "bg-slate-800/50 border-slate-700/50",
    primary: "bg-blue-500/10 border-blue-500/30",
    success: "bg-green-500/10 border-green-500/30",
    warning: "bg-yellow-500/10 border-yellow-500/30",
    error: "bg-red-500/10 border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative
        rounded-2xl
        border
        backdrop-blur-xl
        shadow-xl
        overflow-hidden
        ${variants[variant]}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}