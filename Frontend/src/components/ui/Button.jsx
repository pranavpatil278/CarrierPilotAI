import { postAI } from "@/lib/api";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const base =
    "px-5 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none";

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500",

    secondary:
      "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700",

    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500",

    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${styles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}