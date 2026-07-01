import { postAI } from "@/lib/api";

export default function StatCard({ title, value }) {
  const getIcon = () => {
    switch (title) {
      case "ATS Score":
        return <Award size={24} />;
      case "Resumes Analyzed":
        return <FileText size={24} />;
      case "Job Matches":
        return <Briefcase size={24} />;
      default:
        return <TrendingUp size={24} />;
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl hover:border-blue-500/40 hover:shadow-blue-500/20"
    >
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          {getIcon()}
        </div>

        {/* Title */}
        <p className="text-slate-400 text-sm mt-5">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2 text-white">
          {value}
        </h2>

        {/* Trend */}
        <div className="flex items-center gap-2 mt-5 text-green-400 text-sm">
          <TrendingUp size={16} />
          <span>+12% this month</span>
        </div>

      </div>
    </motion.div>
  );
}
