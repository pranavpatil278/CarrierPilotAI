import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, GraduationCap } from "lucide-react";
import ToolCard from "../components/ui/ToolCard";
import RightDrawer from "../components/ui/RightDrawer";

const tools = [
  {
    title: "Career Assistant",
    description: "Get a roadmap, project ideas, and next steps for your career path.",
    icon: GraduationCap,
    path: "/career-assistant",
  },
  {
    title: "Resume Builder",
    description: "Turn rough resume notes into polished, ATS-friendly bullet points.",
    icon: FileText,
    path: "/resume-builder",
  },
];

export default function AITools() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Tools</h1>
        <p className="mt-2 text-slate-400">
          Choose a tool to analyze, improve, or plan your career profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((tool) => {
          return (
            <ToolCard
              key={tool.title}
              tool={tool}
              onClick={() => {
                setSelected(tool);
                setOpen(true);
              }}
            />
          );
        })}
      </div>

      <RightDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={selected?.title}
      >
        <p className="text-slate-400 mb-4">{selected?.description}</p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setOpen(false);
              if (selected) navigate(selected.path);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Open {selected?.title}
          </button>

          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
          >
            Close
          </button>
        </div>
      </RightDrawer>
    </div>
  );
}
