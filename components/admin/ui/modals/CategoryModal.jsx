'use client';
import { useState, useEffect } from 'react';
import { 
  Folder,
  Hash,
  Grid3x3,
  FileText,
  Edit3,
  Plus,
  Link,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';

export function CategoryModal({ 
  isOpen, 
  onClose, 
  category = null,
  onSuccess 
}) {
  const [formData, setFormData] = useState(getInitialFormData(category));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(categoryData = null) {
    return {
      name: categoryData || '',
      description: '',
      icon: '',
      color: '#6366f1', // По умолчанию индиго
      isActive: true,
      order: 0,
      seoTitle: '',
      seoDescription: ''
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(category));
      setError('');
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

  // Предустановленные иконки
  const iconOptions = [
    { value: 'Code', label: 'Код', icon: <CodeIcon /> },
    { value: 'Design', label: 'Дизайн', icon: <DesignIcon /> },
    { value: 'Marketing', label: 'Маркетинг', icon: <MarketingIcon /> },
    { value: 'Business', label: 'Бизнес', icon: <BusinessIcon /> },
    { value: 'Language', label: 'Языки', icon: <LanguageIcon /> },
    { value: 'Data', label: 'Данные', icon: <DataIcon /> },
    { value: 'Music', label: 'Музыка', icon: <MusicIcon /> },
    { value: 'Science', label: 'Наука', icon: <ScienceIcon /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // В реальном приложении здесь будет вызов серверного экшена
      // createCategory или updateCategory
      console.log('Отправка данных категории:', formData);
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // В реальном приложении проверка результата
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Произошла непредвиденная ошибка при сохранении категории');
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
    if (formData.name && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [formData.name]);

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
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-shake">
          <p className="text-red-700 text-sm">{error}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Введите название категории"
            />
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
                value={formData.slug || generateSlug(formData.name)}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="url-kategorii"
              />
            </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Введите описание категории"
              maxLength={300}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.description?.length || 0}/300 символов
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
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
                  className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300"
                />
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Опционально: заголовок для SEO"
              maxLength={60}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.seoTitle?.length || 0}/60 символов
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Опционально: описание для SEO"
              maxLength={160}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.seoDescription?.length || 0}/160 символов
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
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className={`w-4 h-4 rounded-full mr-3 ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {formData.isActive ? 'Активна' : 'Неактивна'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formData.isActive ? 'Категория отображается в каталоге' : 'Категория скрыта из каталога'}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center`} style={{ backgroundColor: formData.color }}>
                    <Folder className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Порядок: #{formData.order}</div>
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
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

        {/* Превью категории */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Превью категории
          </h3>

          <div className="animate-slide-up" style={{ animationDelay: '1.1s' }}>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center`} style={{ backgroundColor: formData.color }}>
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{formData.name || 'Название категории'}</div>
                    <div className="text-sm text-gray-500">0 курсов • 0 студентов</div>
                  </div>
                </div>
                {formData.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Активна
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    Неактивна
                  </span>
                )}
              </div>
              
              {formData.description && (
                <div className="text-sm text-gray-600 mb-3 border-l-2 border-gray-300 pl-3 py-1">
                  {formData.description}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <div className="font-bold text-blue-600">0</div>
                  <div className="text-gray-500">Курсов</div>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <div className="font-bold text-green-600">0</div>
                  <div className="text-gray-500">Студентов</div>
                </div>
                <div className="bg-amber-50 rounded p-2 text-center">
                  <div className="font-bold text-amber-600">0 ₽</div>
                  <div className="text-gray-500">Доход</div>
                </div>
              </div>
            </div>
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
            </ul>
          </div>
        </div>
      </div>
    </FormModal>
  );
}

// Компоненты иконок для предпросмотра
function CodeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

function MarketingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function ScienceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}