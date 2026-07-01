import Sidebar from "../components/ui/sidebar";
import Navbar from "../components/ui/navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>

    </div>
  );
}