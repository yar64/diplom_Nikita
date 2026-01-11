// components/admin/ui/modals/CategoryModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { 
  Folder,
  Hash,
  FileText,
  Edit3,
  Plus,
  Link,
  Eye,
  CheckCircle,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createCategory, updateCategory } from '../../../../server/category.actions';

export function CategoryModal({ 
  isOpen, 
  onClose, 
  category = null,
  onSuccess 
}) {
  const [formData, setFormData] = useState(getInitialFormData(category));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  function getInitialFormData(categoryData = null) {
    if (categoryData) {
      return {
        id: categoryData.id,
        name: categoryData.name || '',
        description: categoryData.description || '',
        icon: categoryData.icon || '',
        color: categoryData.color || '#6366f1',
        isActive: categoryData.isActive !== false,
        order: categoryData.order || 0,
        seoTitle: categoryData.seoTitle || '',
        seoDescription: categoryData.seoDescription || '',
        slug: categoryData.slug || '',
        coursesCount: categoryData.coursesCount || 0,
        studentsCount: categoryData.studentsCount || 0
      };
    }
    
    return {
      name: '',
      description: '',
      icon: '',
      color: '#6366f1',
      isActive: true,
      order: 0,
      seoTitle: '',
      seoDescription: '',
      slug: '',
      coursesCount: 0,
      studentsCount: 0
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(category));
      setError('');
      setValidationErrors({});
    }
  }, [category, isOpen]);

  // Предустановленные цвета для категорий
  const colorOptions = [
    { value: '#6366f1', label: 'Индиго', name: 'indigo' },
    { value: '#8b5cf6', label: 'Фиолетовый', name: 'purple' },
    { value: '#3b82f6', label: 'Синий', name: 'blue' },
    { value: '#10b981', label: 'Зеленый', name: 'green' },
    { value: '#f59e0b', label: 'Оранжевый', name: 'orange' },
    { value: '#ef4444', label: 'Красный', name: 'red' },
    { value: '#ec4899', label: 'Розовый', name: 'pink' },
    { value: '#14b8a6', label: 'Бирюзовый', name: 'teal' },
  ];

  // Валидация формы на клиенте
  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Название категории обязательно';
    } else if (formData.name.length > 100) {
      errors.name = 'Название слишком длинное (максимум 100 символов)';
    }

    if (!formData.slug || formData.slug.trim() === '') {
      errors.slug = 'URL-адрес (slug) обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'URL может содержать только строчные буквы, цифры и дефисы';
    } else if (formData.slug.length > 100) {
      errors.slug = 'URL слишком длинный (максимум 100 символов)';
    }

    if (formData.description && formData.description.length > 300) {
      errors.description = 'Описание слишком длинное (максимум 300 символов)';
    }

    if (formData.order < 0) {
      errors.order = 'Порядок не может быть отрицательным';
    }

    if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
      errors.color = 'Неверный формат цвета';
    }

    if (formData.seoTitle && formData.seoTitle.length > 60) {
      errors.seoTitle = 'SEO заголовок слишком длинный (максимум 60 символов)';
    }

    if (formData.seoDescription && formData.seoDescription.length > 160) {
      errors.seoDescription = 'SEO описание слишком длинное (максимум 160 символов)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация на клиенте
    if (!validateForm()) {
      setError('Пожалуйста, исправьте ошибки в форме');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setValidationErrors({});
  
    try {
      // Подготавливаем данные для отправки
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || '',
        color: formData.color,
        icon: formData.icon || '',
        isActive: formData.isActive,
        order: parseInt(formData.order) || 0,
        seoTitle: formData.seoTitle?.trim() || '',
        seoDescription: formData.seoDescription?.trim() || ''
      };
    
      let result;
      
      if (category?.id) {
        // Обновление существующей категории
        result = await updateCategory(category.id, categoryData);
      } else {
        // Создание новой категории
        result = await createCategory(categoryData);
      }
    
      if (result.success) {
        // Закрываем модалку
        onClose();
        
        // Вызываем onSuccess для обновления данных
        if (onSuccess) onSuccess();
        
        // Показываем уведомление об успехе
        const event = new CustomEvent('showNotification', {
          detail: { 
            message: category?.id 
              ? 'Категория успешно обновлена' 
              : 'Категория успешно создана', 
            type: 'success' 
          }
        });
        window.dispatchEvent(event);
      } else {
        // Ошибка от сервера
        const errorMessage = result.error || 
          (category?.id 
            ? 'Ошибка при обновлении категории' 
            : 'Ошибка при создании категории');
          
        setError(errorMessage);
          
        // Если есть ошибки валидации от сервера, добавляем их
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
        }
      }
    } catch (err) {
      console.error('Category modal error:', err);
      
      // Общая ошибка сети или сервера
      const errorMessage = err.message || 
        (err.code === 'ECONNREFUSED' 
          ? 'Сервер недоступен. Проверьте подключение.' 
          : 'Произошла непредвиденная ошибка. Попробуйте еще раз.');
        
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Очищаем ошибку для этого поля при изменении
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
    
    // Очищаем общую ошибку при изменении формы
    if (error) {
      setError('');
    }
  };

  // Вспомогательная функция для показа уведомлений
  const showNotification = (message, type = 'success') => {
    // Можно реализовать с помощью toast библиотеки или своего компонента
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: { message, type }
      });
      window.dispatchEvent(event);
    }
  };

  // Генерация slug из названия
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Обновляем slug при изменении названия
  useEffect(() => {
    if (formData.name && !formData.slug && !category?.id) {
      const newSlug = generateSlug(formData.name);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
    }
  }, [formData.name, category?.id]);

  // Функция для рендера ошибки поля
  const renderFieldError = (fieldName) => {
    if (!validationErrors[fieldName]) return null;
    
    return (
      <div className="flex items-center mt-1 text-red-600 text-xs">
        <AlertCircle className="w-3 h-3 mr-1" />
        <span>{validationErrors[fieldName]}</span>
      </div>
    );
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        <div className="flex items-center animate-fade-in">
          {category ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {category ? 'Редактировать категорию' : 'Создать новую категорию'}
        </div>
      }
      submitLabel={category ? 'Обновить категорию' : 'Создать категорию'}
      isSubmitting={isLoading}
      size="md"
      disableSubmit={isLoading}
    >
      {/* Общая ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-shake">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Ошибка</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('уже существует') && (
                <p className="text-xs text-red-600 mt-2">
                  Попробуйте изменить название или URL-адрес категории.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Folder className="w-5 h-5 mr-2" />
            Основная информация
          </h3>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Название категории *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Например: Веб-разработка"
              disabled={isLoading}
            />
            {renderFieldError('name')}
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Link className="w-4 h-4 mr-2" />
              URL-адрес (slug) *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">/category/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="web-development"
                disabled={isLoading}
              />
            </div>
            {renderFieldError('slug')}
            <p className="text-xs text-gray-500 mt-1">
              Только строчные буквы, цифры и дефисы. Например: "веб-разработка" → "web-razrabotka"
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Описание категории
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                validationErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Краткое описание категории для пользователей..."
              maxLength={300}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {renderFieldError('description')}
              </div>
              <div className="text-xs text-gray-500">
                {formData.description?.length || 0}/300 символов
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порядок отображения
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.order ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
                disabled={isLoading}
              />
              {renderFieldError('order')}
              <p className="text-xs text-gray-500 mt-1">
                Чем меньше число, тем выше в списке
              </p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет категории
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300 disabled:opacity-50"
                  disabled={isLoading}
                />
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.color ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              {renderFieldError('color')}
            </div>
          </div>
        </div>

        {/* SEO настройки */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            SEO настройки
          </h3>

          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.seoTitle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Например: Курсы по веб-разработке | Наша платформа"
              maxLength={60}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {renderFieldError('seoTitle')}
              </div>
              <div className="text-xs text-gray-500">
                {formData.seoTitle?.length || 0}/60 символов
              </div>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows="2"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                validationErrors.seoDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Например: Изучите современные технологии веб-разработки с лучшими курсами от практикующих специалистов..."
              maxLength={160}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {renderFieldError('seoDescription')}
              </div>
              <div className="text-xs text-gray-500">
                {formData.seoDescription?.length || 0}/160 символов
              </div>
            </div>
          </div>
        </div>

        {/* Статус категории */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Статус категории
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                formData.isActive 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  formData.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formData.isActive ? 'Активна' : 'Неактивна'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formData.isActive 
                      ? 'Категория отображается в каталоге' 
                      : 'Категория скрыта из каталога'}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center`} 
                    style={{ backgroundColor: formData.color }}
                  >
                    <Folder className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Порядок: #{formData.order}
                    </div>
                    <div className="text-xs text-gray-500">Позиция в списке</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Категория активна
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Если выключено, категория будет скрыта из каталога, но существующие курсы сохранятся
            </p>
          </div>
        </div>

        {/* Подсказки */}
        <div className="animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Советы по созданию категорий
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Используйте короткие и понятные названия категорий</li>
              <li>• Цвет должен соответствовать тематике категории</li>
              <li>• Порядок отображения определяет позицию в списке категорий</li>
              <li>• SEO настройки улучшают видимость в поисковых системах</li>
              <li>• Неактивные категории не отображаются в каталоге</li>
              <li>• URL-адрес должен быть уникальным и понятным</li>
            </ul>
          </div>
        </div>
      </div>
    </FormModal>
  );
}