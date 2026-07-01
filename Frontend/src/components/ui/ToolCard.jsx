import React from "react";

export default function ToolCard({ tool, onClick }) {
  const Icon = tool.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-500 w-full"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-300">
          <Icon size={24} />
        </div>

        <h2 className="text-xl font-semibold text-white">{tool.title}</h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{tool.description}</p>
    </button>
  );
}
