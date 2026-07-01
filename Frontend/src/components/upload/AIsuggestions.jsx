import { motion } from "framer-motion";
import {
  Sparkles,
  CircleCheck,
  TriangleAlert,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function AISuggestions({
  suggestions = [],
  missingKeywords = [],
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  // Parse suggestions into organized sections
  const parseSuggestions = () => {
    try {
      if (!suggestions) return [];

      let text = typeof suggestions === "string" ? suggestions : (Array.isArray(suggestions) ? suggestions.join(" ") : String(suggestions));
      
      if (!text || text.trim().length === 0) return [];

      // Split by section markers like **Section Name:**
      const sections = [];
      const regex = /\*\*([^*]+)\*\*:\s*([^*]*?)(?=\*\*|$)/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const title = match[1] ? match[1].trim() : "Section";
        const content = match[2] ? match[2].trim() : "";

        if (!content) continue;

        // Split content by numbers or bullets
        const items = content
          .split(/\n|(\d+\.\s+)|•\s+/)
          .map((s) => s ? s.trim() : "")
          .filter((s) => s && s.length > 3 && !s.match(/^\d+\.?$/));

        if (items.length > 0) {
          sections.push({
            title,
            items,
          });
        }
      }

      if (sections.length > 0) return sections;

      // Fallback: treat entire text as one section
      const fallbackItems = text
        .split(/\n|•|(\d+\.)/)
        .map((s) => s ? s.trim() : "")
        .filter((s) => s && s.length > 3);

      if (fallbackItems.length > 0) {
        return [
          {
            title: "Suggestions",
            items: fallbackItems,
          },
        ];
      }

      return [];
    } catch (err) {
      console.error("Error parsing suggestions:", err);
      return [];
    }
  };

  const sections = parseSuggestions();

  const SectionCard = ({ section, index }) => {
    const isExpanded = expandedSection === index;
    const isLongContent = section.items.length > 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors"
      >
        <button
          onClick={() => setExpandedSection(isExpanded ? null : index)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-750"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <CircleCheck className="text-green-400 flex-shrink-0" size={20} />
            <h3 className="text-white font-semibold text-lg">{section.title}</h3>
            <span className="ml-auto text-slate-400 text-sm">
              ({section.items.length} {section.items.length === 1 ? "item" : "items"})
            </span>
          </div>

          {isLongContent && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="text-slate-400" size={20} />
            </motion.div>
          )}
        </button>

        {/* Content - Show first item always, rest if expanded */}
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: isExpanded ? "auto" : isLongContent ? "auto" : "auto",
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t border-slate-700"
        >
          <div className="px-6 py-4 space-y-3">
            {(isExpanded || !isLongContent
              ? section.items
              : section.items.slice(0, 2)
            ).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 text-slate-200"
              >
                <span className="text-green-400 font-bold flex-shrink-0 mt-0.5">
                  •
                </span>
                <p className="text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}

            {isLongContent && !isExpanded && (
              <p className="text-slate-400 text-sm italic pt-2">
                Click to see all {section.items.length} items
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Sparkles size={28} className="text-yellow-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Suggestions
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Click sections to expand and read detailed improvements
          </p>
        </div>
      </div>

      {/* Suggestion Sections */}
      <div className="space-y-4 mb-8">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <SectionCard key={index} section={section} index={index} />
          ))
        ) : (
          <div className="text-slate-400 text-center py-6">
            No AI suggestions available.
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      {missingKeywords && missingKeywords.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <TriangleAlert className="text-yellow-400" size={22} />
            <h3 className="text-lg font-semibold text-white">
              Missing Keywords
            </h3>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-200 text-sm mb-3">
              Add these keywords to improve your ATS score:
            </p>
            <div className="flex flex-wrap gap-2">
              {(typeof missingKeywords === "string"
                ? missingKeywords.split(/[,\n•]/).map((k) => k.trim())
                : missingKeywords
              )
                .filter((k) => k && k.length > 0)
                .map((keyword, index) => (
                  <motion.span
                    key={index}
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                    }}
                    className="px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                  >
                    {keyword}
                  </motion.span>
                ))}
            </div>
          </div>
        </>
      )}

      {/* AI Tip */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex gap-4">
        <Lightbulb
          className="text-indigo-400 flex-shrink-0 mt-0.5"
          size={20}
        />

        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm mb-2">
            💡 Pro Tip
          </h4>

          <p className="text-slate-300 text-sm leading-relaxed">
            Implement these suggestions systematically. Start with the most
            impactful changes (keywords and formatting) to maximize your ATS
            score and get noticed by recruiters.
          </p>
        </div>
      </div>
    </motion.div>
  );
}