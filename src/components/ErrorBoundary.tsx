'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
      <p className="text-red-600 text-sm mb-3">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {resetError && (
        <button 
          onClick={resetError}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorBoundary;
