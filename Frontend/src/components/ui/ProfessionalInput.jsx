import { postAI } from "@/lib/api";

export default function ProfessionalInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            px-4
            py-3
            ${Icon ? 'pl-12' : ''}
            bg-slate-800/50
            border
            ${error ? 'border-red-500/50' : 'border-slate-700/50'}
            rounded-xl
            text-white
            placeholder-slate-500
            focus:outline-none
            focus:ring-2
            ${error ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'}
            focus:border-transparent
            transition-all
            duration-200
          `}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}