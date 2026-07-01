import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";

import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/statcard";
import Button from "../../components/ui/Button";
import OnboardingModal from "../../components/ui/OnboardingModal";
import { postAI } from "../../lib/api";

function loadResumeHistory() {
  try {
    const raw = localStorage.getItem("cp_resume_history");
    const history = raw ? JSON.parse(raw) : [];
    return Array.isArray(history) ? history : [];
  } catch (err) {
    console.warn("Unable to load resume history", err);
    return [];
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [careerTip, setCareerTip] = useState("");
  const [tipLoading, setTipLoading] = useState(true);
  const [tipError, setTipError] = useState("");

  useEffect(() => {
    setHistory(loadResumeHistory());
    try {
      const name = localStorage.getItem("cp_user_name");
      const email = localStorage.getItem("cp_user_email");
      if (name) setUserName(name);
      if (email) setUserEmail(email);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchCareerTip = async () => {
      try {
        setTipLoading(true);
        setTipError("");
        
        // Get skills from latest resume or use default skills
        const latestResume = history[0];
        const skills = latestResume?.skills?.length > 0 
          ? latestResume.skills.join(", ")
          : "JavaScript, React, Node.js, Python, Communication, Leadership";

        const data = await postAI("/ai/career", {
          skills: skills,
        });

        if (data?.result) {
          setCareerTip(data.result);
        } else {
          setCareerTip("Add measurable achievements like 'Improved application performance by 40%' instead of simply listing responsibilities.");
        }
      } catch (err) {
        console.error("Failed to fetch career tip:", err);
        setTipError("Unable to load career tip at the moment");
        setCareerTip("Add measurable achievements like 'Improved application performance by 40%' instead of simply listing responsibilities.");
      } finally {
        setTipLoading(false);
      }
    };

    fetchCareerTip();
  }, [history]);

  const stats = useMemo(() => {
    const analyzed = history.length;
    const averageScore =
      analyzed > 0
        ? Math.round(
            history.reduce((sum, entry) => sum + (entry.atsScore || 0), 0) /
              analyzed
          )
        : 0;
    const jobMatches = history.reduce(
      (sum, entry) => sum + (entry.jobMatches || 0),
      0
    );

    return {
      atsScore: analyzed > 0 ? `${averageScore}%` : "--",
      analyzed: analyzed.toString(),
      jobMatches: jobMatches.toString(),
      latest: history[0] || null,
      recent: history.slice(0, 3),
    };
  }, [history]);

  return (
    <>
      <OnboardingModal />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold">Welcome, {userName}</h1>

        <p className="text-blue-100 mt-3 max-w-2xl">
          Analyze your resume, improve ATS score, discover job opportunities,
          and receive AI-powered career guidance.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button variant="secondary" onClick={() => navigate("/ai-tools")}>
            Explore AI Tools
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard title="ATS Score" value={stats.atsScore} />
        <StatCard title="Resumes Analyzed" value={stats.analyzed} />
        <StatCard title="Job Matches" value={stats.jobMatches} />
      </motion.div>

      {/* Quick Actions removed: duplicated in sidebar */}

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-400" />
              <h2 className="text-lg font-semibold">Resume History</h2>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllHistory((prev) => !prev)}
                className="text-sky-400 hover:text-sky-200 text-sm"
              >
                {showAllHistory ? "Show latest 3" : "Show all uploads"}
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-4">
              {(showAllHistory ? history : stats.recent).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900 rounded-xl p-4"
                >
                  <p className="font-medium">{entry.fileName}</p>
                  <p className="text-slate-400 text-sm">
                    ATS: {entry.atsScore}% · Job matches: {entry.jobMatches}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    Uploaded {entry.uploadDate}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl p-4 text-slate-400">
              No resumes analyzed yet. Upload your first resume to see stats.
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="text-yellow-400" />
            <h2 className="text-lg font-semibold">AI Career Tip</h2>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5">
            {tipLoading ? (
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2 className="animate-spin" size={20} />
                <span>Loading personalized career tip...</span>
              </div>
            ) : tipError ? (
              <div>
                <p className="text-red-400 text-sm mb-2">{tipError}</p>
                <p className="text-slate-300 leading-7">
                  Add measurable achievements like "Improved application
                  performance by 40%" instead of simply listing responsibilities.
                </p>
              </div>
            ) : (
              <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                {careerTip}
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
