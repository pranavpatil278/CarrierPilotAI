import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Upload Resume" },
  { to: "/job-matcher", label: "Job Matcher" },
  { to: "/ai-tools", label: "AI Tools" },
];

export default function MainLayout() {
  const [userLabel, setUserLabel] = useState("Guest");

  useEffect(() => {
    try {
      const email = localStorage.getItem("cp_user_email");
      const name = localStorage.getItem("cp_user_name");
      const fallbackName = email ? email.split("@")[0] : "";
      setUserLabel(name || fallbackName || "Guest");
    } catch (error) {
      console.warn("Unable to read user info for logout", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("cp_user_email");
      localStorage.removeItem("cp_user_name");
      localStorage.removeItem("cp_pending_identifier");
    } catch (error) {
      console.warn("Unable to clear auth data on logout", error);
    }

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-full max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800 bg-slate-900/80 p-6 lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">CareerPilot AI</h1>
            <p className="mt-1 text-sm text-slate-400">Your AI career workspace</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Welcome back</h2>
              <p className="text-sm text-slate-400">Everything you need to grow your career in one place.</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Log out • {userLabel}
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}