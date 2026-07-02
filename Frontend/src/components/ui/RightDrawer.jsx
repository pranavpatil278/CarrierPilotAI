import { X } from "lucide-react";

export default function RightDrawer({ open, onClose, title, children }) {
  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`pointer-events-auto absolute right-0 top-0 h-full w-full md:w-1/3 bg-slate-950 shadow-2xl transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X />
          </button>
        </div>

        <div className="p-5 overflow-auto">{children}</div>
      </aside>
    </div>
  );
}
