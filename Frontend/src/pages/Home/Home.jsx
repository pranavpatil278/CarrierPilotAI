export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-600">
          🚀 CareerPilot AI
        </h1>
        <p className="mt-3 text-slate-600">
          AI Powered Career Assistant
        </p>

        <a
          href="/login"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}