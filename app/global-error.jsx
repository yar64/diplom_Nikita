// app/global-error.jsx
'use client';
import { useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home,
  Server
} from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center shadow-sm">
              {/* Иконка ошибки */}
              <div className="text-red-500 mb-6 flex justify-center">
                <Server className="w-16 h-16" />
              </div>

              {/* Заголовок и описание */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Critical Application Error
              </h1>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                The application encountered a critical error and needs to reload. 
                All unsaved progress may be lost.
              </p>

              {/* Предупреждение */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-red-100">
                <div className="flex items-center justify-center text-sm text-red-600 mb-1">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical System Error
                </div>
                <code className="text-xs text-red-400">
                  {error.message || 'Fatal application error'}
                </code>
              </div>

              {/* Кнопки действий */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Reload Application
                </button>
                
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>

              {/* Контактная информация */}
              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="text-sm text-red-600">
                  <p>If this error continues, please contact support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}