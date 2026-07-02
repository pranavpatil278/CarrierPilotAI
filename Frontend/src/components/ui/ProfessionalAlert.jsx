import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export default function ProfessionalAlert({
  type = "info",
  title,
  message,
  dismissible = false,
  onDismiss,
  className = "",
}) {
  const types = {
    info: {
      icon: Info,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-300",
      iconColor: "text-blue-400",
    },
    success: {
      icon: CheckCircle,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-300",
      iconColor: "text-green-400",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-300",
      iconColor: "text-yellow-400",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-300",
      iconColor: "text-red-400",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        relative
        ${config.bg}
        ${config.border}
        border
        rounded-xl
        p-4
        backdrop-blur-xl
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={24} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${config.text} mb-1`}>{title}</h4>}
          {message && <p className={`text-sm ${config.text}`}>{message}</p>}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`${config.iconColor} hover:opacity-70 transition-opacity`}
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}