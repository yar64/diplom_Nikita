// components/admin/ui/modals/UserModal.js
'use client';
import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Globe,
  Calendar,
  Target,
  Edit3,
  Plus
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createUser, updateUser } from '../../../../server/user.actions';

export function UserModal({ 
  isOpen, 
  onClose, 
  user = null,
  onSuccess
}) {
  const [formData, setFormData] = useState(getInitialFormData(user));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(userData = null) {
    return {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      username: userData?.username || '',
      email: userData?.email || '',
      password: '',
      role: userData?.role || 'USER',
      timezone: userData?.timezone || 'UTC',
      isPublic: userData?.isPublic ?? true,
      dailyGoal: userData?.dailyGoal || 30
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(user));
      setError('');
    }
  }, [user, isOpen]);

  const roleOptions = [
    { value: 'USER', label: 'Пользователь' },
    { value: 'ADMIN', label: 'Администратор' },
    { value: 'MENTOR', label: 'Наставник' }
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/Moscow', label: 'Москва' },
    { value: 'Europe/London', label: 'Лондон' },
    { value: 'America/New_York', label: 'Нью-Йорк' },
    { value: 'Asia/Tokyo', label: 'Токио' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (user) {
        // При обновлении отправляем пароль только если он был изменен
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        result = await updateUser(user.id, updateData);
      } else {
        result = await createUser(formData);
      }

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Операция не удалась');
      }
    } catch (err) {
      setError('Произошла непредвиденная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        <div className="flex items-center">
          {user ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {user ? 'Редактировать пользователя' : 'Создать нового пользователя'}
        </div>
      }
      submitLabel={user ? 'Обновить пользователя' : 'Создать пользователя'}
      isSubmitting={isLoading}
      size="md"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Имя
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Фамилия
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите фамилию"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Имя пользователя *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите имя пользователя"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Пароль {!user && '*'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={user ? "Оставьте пустым для сохранения текущего пароля" : "Введите пароль"}
          />
          {user && (
            <p className="text-xs text-gray-500 mt-1">
              Оставьте поле пустым, чтобы сохранить текущий пароль
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Часовой пояс
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezoneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Дневная цель (минут)
          </label>
          <input
            type="number"
            name="dailyGoal"
            value={formData.dailyGoal}
            onChange={handleChange}
            min="1"
            max="480"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="30"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">
            Публичный профиль
          </label>
        </div>
      </div>
    </FormModal>
  );
}