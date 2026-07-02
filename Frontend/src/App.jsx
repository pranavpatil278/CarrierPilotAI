import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home/Home";
import Login from "@/pages/login/login";
import Register from "@/pages/register/register";
import Verify from "@/pages/verify/verify";
import ForgotPassword from "@/pages/forgotpassword/forgotpassword";
import Dashboard from "@/pages/dashboard/dashboard";
import Upload from "@/pages/upload/upload";
import AITools from "@/pages/aitools";
import JobMatcher from "@/pages/jobmatcher";
import CareerAssistant from "@/pages/careerassistant";
import ResumeBuilder from "@/pages/resumebuilder";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/job-matcher" element={<JobMatcher />} />
            <Route path="/career-assistant" element={<CareerAssistant />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
