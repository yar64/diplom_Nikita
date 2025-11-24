// app/admin/not-found.js
'use client';
import { 
  FileSearch, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Иконка */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-10 h-10 text-gray-400" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Page not found
        </h1>
        
        {/* Описание */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Код ошибки */}
        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-gray-500 text-sm font-mono mb-8">
          404
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin"
            className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </button>
        </div>

        {/* Разделитель */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Быстрые ссылки */}
        <div className="text-sm text-gray-500">
          <p className="mb-3">Or navigate to:</p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/admin/users" 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Users
            </Link>
            <Link 
              href="/admin/skills" 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Skills
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}