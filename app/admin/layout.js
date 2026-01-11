'use client';
import { useState, useEffect } from 'react';
import "../globals.css";
import { AdminSidebar } from "../../components/admin/layout/AdminSideBar";
import { Notification } from "../../components/ui/Notification";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Обработчик для показа уведомлений
  useEffect(() => {
    const handleNotification = (event) => {
      const { message, type = 'info' } = event.detail;
      setNotifications(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        message, 
        type 
      }]);
    };

    window.addEventListener('showNotification', handleNotification);
    
    return () => {
      window.removeEventListener('showNotification', handleNotification);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          {/* Логотип с плавающим эффектом */}
          <div className="relative mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-gray-100 animate-float">
              <div className="text-gray-800 font-bold text-3xl tracking-tight">
                <span className="animate-fade-in opacity-100">S</span>
                <span className="animate-fade-in opacity-100">T</span>
              </div>
            </div>
            
            {/* Свечение вокруг лого */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-3xl blur-xl animate-pulse-glow"></div>
            
            {/* Вращающееся кольцо */}
            <div className="absolute -inset-6 border border-blue-200/50 rounded-full animate-spin-slow"></div>
          </div>

          {/* Текст с поэтапным появлением */}
          <div className="space-y-4">
            <h1 className="text-4xl font-light text-gray-800 tracking-wide">
              <span className="animate-slide-up opacity-100 inline-block">Skills</span>
              {' '}
              <span className="animate-slide-up opacity-100 inline-block">Tracker</span>
            </h1>
            
            {/* Анимированная разделительная линия */}
            <div className="animate-fade-in opacity-100">
              <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping-slow"></div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm font-light animate-fade-in opacity-100">
              Administrative System
            </p>
          </div>

          {/* Элегантный индикатор прогресса */}
          <div className="mt-12 animate-fade-in opacity-100">
            <div className="flex flex-col items-center space-y-3">
              {/* Прыгающие точки */}
              <div className="flex items-center justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-gentle"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              
              {/* Анимированный прогресс-бар */}
              <div className="w-32 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-progress-flow"></div>
              </div>
              
              <span className="text-xs text-gray-500 font-medium">Loading dashboard...</span>
            </div>
          </div>

          {/* Фоновые декоративные элементы */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-200 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-200 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
      
      {/* Компонент уведомлений */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}