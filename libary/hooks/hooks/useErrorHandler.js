// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Error handled by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm font-medium">
              Operation Failed
            </span>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Dismiss
          </button>
        </div>
        <p className="text-red-600 text-sm mt-1">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
    );
  };

  return {
    error,
    handleError,
    clearError,
    ErrorDisplay
  };
}