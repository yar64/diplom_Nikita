'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Rocket, 
  Users2, 
  Settings,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { logoutUser } from '../../../server/auth.actions';
import { useState } from 'react';

const menuItems = [
  { 
    name: 'Панель управления', 
    href: '/admin', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Пользователи', 
    href: '/admin/users', 
    icon: Users 
  },
  { 
    name: 'Навыки и обучение', 
    href: '/admin/skills_learning', 
    icon: Target 
  },
  { 
    name: 'Проекты и цели', 
    href: '/admin/project_goal', 
    icon: Rocket 
  },
  { 
    name: 'Сообщества', 
    href: '/admin/communities', 
    icon: Users2 
  },
  { 
    name: 'Система', 
    href: '/admin/settings', 
    icon: Settings 
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logoutUser(); // Очищаем сессию на сервере
      logout(); // Очищаем контекст
      router.push('/login');
    } catch (error) {
      console.error("Ошибка выхода:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Шапка */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Панель администратора</h1>
            <p className="text-xs text-gray-500">Трекер навыков</p>
          </div>
        </div>
      </div>
      
      {/* Навигация */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <IconComponent 
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} 
                />
                {item.name}
              </div>
              
              <ChevronRight 
                className={`w-4 h-4 transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 opacity-100' 
                    : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                }`} 
              />
            </Link>
          );
        })}
      </nav>

      {/* Подвал с информацией об администраторе */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-4">
          {/* Блок информации об администраторе */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            
            {/* Статистика или информация */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="text-center p-2 bg-white rounded border border-gray-100">
                <div className="text-xs text-gray-500">Сессия</div>
                <div className="text-sm font-medium text-green-600">Активна</div>
              </div>
              <div className="text-center p-2 bg-white rounded border border-gray-100">
                <div className="text-xs text-gray-500">Доступ</div>
                <div className="text-sm font-medium text-blue-600">Полный</div>
              </div>
            </div>
          </div>

          {/* Кнопка выхода */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center px-4 py-2.5 text-sm rounded-lg transition-colors gap-2 ${
              isLoggingOut 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
            }`}
          >
            <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
            {isLoggingOut ? 'Выход...' : 'Выйти из системы'}
          </button>
        </div>
      </div>
    </div>
  );
}