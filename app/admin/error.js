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
    console.error('Ошибка приложения:', error);
  }, [error]);

  // Функция для определения типа ошибки
  const getErrorDetails = (error) => {
    const statusCode = error.digest || error.statusCode || '500';
    const message = error.message || 'Произошла непредвиденная ошибка';
    
    // Определяем тип ошибки по сообщению или статусу
    if (message.includes('Network') || message.includes('fetch') || message.includes('network')) {
      return {
        type: 'network',
        title: 'Ошибка сети',
        description: 'Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету и попробуйте снова.',
        icon: <Network className="w-12 h-12" />,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      };
    }

    if (message.includes('404') || message.includes('not found')) {
      return {
        type: 'not_found',
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не существует или была перемещена.',
        icon: <FileText className="w-12 h-12" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }

    if (message.includes('500') || message.includes('server')) {
      return {
        type: 'server',
        title: 'Ошибка сервера',
        description: 'Наши серверы испытывают проблемы. Пожалуйста, попробуйте снова через несколько минут.',
        icon: <Server className="w-12 h-12" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    if (message.includes('auth') || message.includes('permission') || message.includes('access')) {
      return {
        type: 'auth',
        title: 'Доступ запрещен',
        description: 'У вас нет прав для доступа к этой странице. Пожалуйста, проверьте ваши учетные данные.',
        icon: <Shield className="w-12 h-12" />,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    }

    // Общая ошибка
    return {
      type: 'general',
      title: 'Что-то пошло не так',
      description: 'Произошла непредвиденная ошибка. Наша команда уведомлена и работает над исправлением.',
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
              Детали ошибки
            </div>
            <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {error.message || 'Неизвестная ошибка'}
            </code>
          </div>

          {/* Кнопки действий */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              На главную
            </button>
          </div>

          {/* Дополнительные опции */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-2">
              <p>Если проблема сохраняется, вы можете:</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-500 hover:text-blue-600 underline text-sm"
                >
                  Перезагрузить страницу
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="text-blue-500 hover:text-blue-600 underline text-sm"
                >
                  Вернуться назад
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Информация для поддержки */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-500">
            <span>ID ошибки: {error.digest || 'Н/Д'}</span>
            <span className="mx-2">•</span>
            <span>Время: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}