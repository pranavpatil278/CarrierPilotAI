import { motion } from "framer-motion";

export default function ProfessionalBadge({
  children,
  variant = "default",
  size = "md",
  className = "",
}) {
  const variants = {
    default: "bg-slate-700/50 text-slate-300 border-slate-600/50",
    primary: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    success: "bg-green-500/20 text-green-300 border-green-500/40",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    error: "bg-red-500/20 text-red-300 border-red-500/40",
    info: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex
        items-center
        gap-1.5
        font-medium
        rounded-full
        border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.span>
  );
}