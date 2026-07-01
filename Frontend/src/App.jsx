import { postAI } from "@/lib/api";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected + Layout Routes */}
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
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
