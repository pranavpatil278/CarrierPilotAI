import { postAI } from "@/lib/api";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const email = localStorage.getItem("cp_user_email");
      if (email) setUserEmail(email);
    } catch (e) {
      // ignore
    }
  }, []);

  const emailName = userEmail ? userEmail.split("@")[0] : "Guest";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-20 px-8 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome Back
        </h1>

        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
          <CalendarDays size={15} />
          <span>{today}</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-3 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white">
            {emailName ? emailName.charAt(0).toUpperCase() : "G"}
          </div>

          <div className="hidden lg:block">
            <h3 className="text-white text-sm font-semibold">
              {emailName}
            </h3>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
