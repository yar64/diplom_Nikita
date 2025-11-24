// components/ui/ErrorBoundary.jsx
'use client';
import { Component } from 'react';
import { 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <div className="text-amber-500 mb-4 flex justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-medium text-amber-800 mb-2">
            Component Error
          </h3>
          
          <p className="text-amber-700 text-sm mb-4">
            This component encountered an error and couldn't be displayed.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={this.handleReset}
              className="flex items-center px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
            
            {this.props.fallback || (
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Reload Page
              </button>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-amber-600 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-amber-100 rounded text-xs text-amber-800 overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;