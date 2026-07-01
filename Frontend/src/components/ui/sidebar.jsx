import { postAI } from "@/lib/api";

export default function Sidebar() {
  const [userName, setUserName] = ("CareerPilot User");

  React.useEffect(() => {
    try {
      const name = localStorage.getItem("cp_user_name");
      if (name) setUserName(name);
    } catch (e) {
      // ignore
    }
  }, []);

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Upload Resume",
      icon: Upload,
      path: "/upload",
    },
    {
      name: "Job Matcher",
      icon: Briefcase,
      path: "/job-matcher",
    },
    {
      name: "AI Tools",
      icon: Bot,
      path: "/ai-tools",
    },
      // Career Assistant and Resume Builder removed from sidebar
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between"
    >
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-violet-600 p-3 rounded-xl shadow-lg">
              <Sparkles size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-white text-xl font-bold">
                CareerPilot AI
              </h1>

              <p className="text-slate-400 text-xs">
                AI Resume Analyzer
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              item.path && location.pathname.startsWith(item.path);

            return (
              <motion.button
                whileHover={{
                  scale: 1.03,
                  x: 5,
                }}
                whileTap={{ scale: 0.98 }}
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
