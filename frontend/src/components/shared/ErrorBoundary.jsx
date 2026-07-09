import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Application render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory text-charcoal flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <p className="eyebrow mb-4">Something went wrong</p>
            <h1 className="font-display text-4xl font-light mb-4">
              The page could not load
            </h1>
            <p className="text-slate leading-relaxed mb-8">
              Please refresh the page. If this keeps happening, restart the frontend and backend servers.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary"
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

export default ErrorBoundary;
