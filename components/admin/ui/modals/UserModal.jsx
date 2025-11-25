'use client';
import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Key,
  UserPlus,
  Edit3,
  Globe,
  Target,
  Eye,
  EyeOff,
  FileText
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
      email: userData?.email || '',
      username: userData?.username || '',
      password: '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      avatar: userData?.avatar || '',
      bio: userData?.bio || '',
      timezone: userData?.timezone || 'UTC',
      dailyGoal: userData?.dailyGoal || 60,
      isPublic: userData?.isPublic ?? true,
      role: userData?.role || 'USER'
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(user));
      setError('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;

      if (user) {
        // Обновление пользователя
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }

        result = await updateUser(user.id, updateData);
      } else {
        // Создание нового пользователя
        if (!formData.password) {
          setError('Password is required');
          setIsLoading(false);
          return;
        }
        result = await createUser(formData);
      }

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
        <div className="flex items-center animate-fade-in">
          {user ? <Edit3 className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
          {user ? 'Edit User' : 'Create New User'}
        </div>
      }
      submitLabel={user ? 'Update User' : 'Create User'}
      isSubmitting={isLoading}
      size="lg"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-shake">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {!user && (
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Daily Goal (minutes)
            </label>
            <input
              type="number"
              name="dailyGoal"
              value={formData.dailyGoal}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST</option>
              <option value="Europe/London">GMT</option>
              <option value="Asia/Tokyo">JST</option>
            </select>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '1s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex items-center animate-slide-up" style={{ animationDelay: '1.1s' }}>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
          />
          <label className="ml-2 text-sm text-gray-700 flex items-center">
            {formData.isPublic ? (
              <Eye className="w-4 h-4 mr-1 text-green-500 transition-all duration-200" />
            ) : (
              <EyeOff className="w-4 h-4 mr-1 text-gray-400 transition-all duration-200" />
            )}
            Public Profile
          </label>
        </div>
      </div>
    </FormModal>
  );
}