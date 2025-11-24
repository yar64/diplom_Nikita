'use client';
import { useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Server, 
  Network,
  Shield,
  FileText
} from 'lucide-react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Логируем ошибку в сервис мониторинга
    console.error('Application error:', error);
  }, [error]);

  // Функция для определения типа ошибки
  const getErrorDetails = (error) => {
    const statusCode = error.digest || error.statusCode || '500';
    const message = error.message || 'An unexpected error occurred';
    
    // Определяем тип ошибки по сообщению или статусу
    if (message.includes('Network') || message.includes('fetch') || message.includes('network')) {
      return {
        type: 'network',
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        icon: <Network className="w-12 h-12" />,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      };
    }

    if (message.includes('404') || message.includes('not found')) {
      return {
        type: 'not_found',
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has been moved.',
        icon: <FileText className="w-12 h-12" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }

    if (message.includes('500') || message.includes('server')) {
      return {
        type: 'server',
        title: 'Server Error',
        description: 'Our servers are experiencing issues. Please try again in a few moments.',
        icon: <Server className="w-12 h-12" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    if (message.includes('auth') || message.includes('permission') || message.includes('access')) {
      return {
        type: 'auth',
        title: 'Access Denied',
        description: 'You do not have permission to access this page. Please check your credentials.',
        icon: <Shield className="w-12 h-12" />,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    }

    // Общая ошибка
    return {
      type: 'general',
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred. Our team has been notified and is working on a fix.',
      icon: <Bug className="w-12 h-12" />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`rounded-2xl border-2 ${errorDetails.borderColor} ${errorDetails.bgColor} p-8 text-center shadow-sm`}>
          {/* Иконка ошибки */}
          <div className={`${errorDetails.color} mb-6 flex justify-center`}>
            {errorDetails.icon}
          </div>

          {/* Заголовок и описание */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {errorDetails.title}
          </h1>
          
          <p className="text-gray-600 mb-2 leading-relaxed">
            {errorDetails.description}
          </p>

          {/* Дополнительная информация для разработчиков */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Error Details
            </div>
            <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {error.message || 'Unknown error'}
            </code>
          </div>

          {/* Кнопки действий */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </div>

          {/* Дополнительные опции */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-2">
              <p>If the problem persists, you can:</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-500 hover:text-blue-600 underline text-sm"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="text-blue-500 hover:text-blue-600 underline text-sm"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Информация для поддержки */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-500">
            <span>Error ID: {error.digest || 'N/A'}</span>
            <span className="mx-2">•</span>
            <span>Time: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}