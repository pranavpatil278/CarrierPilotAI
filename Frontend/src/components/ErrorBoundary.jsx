import { postAI } from "@/lib/api";

export class ErrorBoundary {
  constructor(props) {
    this.props = props;
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
          <div className="max-w-2xl w-full bg-red-500/10 border border-red-500/40 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-red-200 mb-4">
              Something went wrong
            </h1>
            <p className="text-red-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <pre className="bg-slate-800 p-4 rounded-lg text-red-200 text-sm overflow-auto max-h-96 mb-4">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}