'use client';
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  Globe,
  Filter,
  TrendingUp,
  Award,
  Target,
  FileText,
  Edit3,
  Plus,
  Users,
  Clock,
  Tag,
  Link,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createCourse, updateCourse } from '../../../../server/course.actions';

export function CourseModal({ 
  isOpen, 
  onClose, 
  course = null,
  onSuccess 
}) {
  const [formData, setFormData] = useState(getInitialFormData(course));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(courseData = null) {
    return {
      title: courseData?.title || '',
      description: courseData?.description || '',
      excerpt: courseData?.excerpt || '',
      thumbnailUrl: courseData?.thumbnailUrl || '',
      category: courseData?.category || 'programming',
      tags: courseData?.tags || '',
      price: courseData?.price || '',
      originalPrice: courseData?.originalPrice || '',
      discountPercent: courseData?.discountPercent || '',
      isFree: courseData?.isFree || false,
      level: courseData?.level || 'BEGINNER',
      language: courseData?.language || 'ru',
      duration: courseData?.duration || '',
      status: courseData?.status || 'DRAFT',
      isFeatured: courseData?.isFeatured || false,
      slug: courseData?.slug || '',
      skillIds: courseData?.courseSkills?.map(cs => cs.skillId) || []
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(course));
      setError('');
    }
  }, [course, isOpen]);

  // Mock instructorId - в реальном приложении нужно получить из сессии
  const instructorId = "mock-instructor-id";

  const categories = [
    { value: 'programming', label: 'Программирование', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'design', label: 'Дизайн', icon: <Filter className="w-4 h-4" /> },
    { value: 'marketing', label: 'Маркетинг', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'business', label: 'Бизнес', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'language', label: 'Языки', icon: <Globe className="w-4 h-4" /> },
    { value: 'data-science', label: 'Data Science', icon: <Target className="w-4 h-4" /> }
  ];

  const levels = [
    { value: 'BEGINNER', label: 'Начинающий', icon: <Plus className="w-4 h-4" /> },
    { value: 'INTERMEDIATE', label: 'Средний', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'ADVANCED', label: 'Продвинутый', icon: <Award className="w-4 h-4" /> },
    { value: 'EXPERT', label: 'Эксперт', icon: <Target className="w-4 h-4" /> }
  ];

  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'Английский' },
    { value: 'es', label: 'Испанский' },
    { value: 'fr', label: 'Французский' },
    { value: 'de', label: 'Немецкий' }
  ];

  const statuses = [
    { value: 'DRAFT', label: 'Черновик', icon: <EyeOff className="w-4 h-4" /> },
    { value: 'PUBLISHED', label: 'Опубликован', icon: <Eye className="w-4 h-4" /> },
    { value: 'ARCHIVED', label: 'Архивный', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Преобразуем пустые строки в числа/undefined
      const processedData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined
      };

      let result;
      
      if (course) {
        // Обновление курса
        result = await updateCourse(course.id, processedData, instructorId);
      } else {
        // Создание нового курса
        result = await createCourse(processedData, instructorId);
      }

      if (result.id) {
        onSuccess?.();
        onClose();
      } else {
        setError('Операция не удалась');
      }
    } catch (err) {
      setError(err.message || 'Произошла непредвиденная ошибка');
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
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Обновляем slug при изменении названия
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }));
    }
  }, [formData.title]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        <div className="flex items-center animate-fade-in">
          {course ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {course ? 'Редактировать курс' : 'Создать новый курс'}
        </div>
      }
      submitLabel={course ? 'Обновить курс' : 'Создать курс'}
      isSubmitting={isLoading}
      size="lg"
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
            <BookOpen className="w-5 h-5 mr-2" />
            Основная информация
          </h3>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Название курса *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Введите название курса"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Link className="w-4 h-4 mr-2" />
                URL-адрес (slug) *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">/course/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="url-kursa"
                />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Категория *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Краткое описание
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Краткое описание для карточки курса"
              maxLength={200}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.excerpt?.length || 0}/200 символов
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Полное описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Полное описание курса"
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Теги (через запятую)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="React, JavaScript, Frontend, Web Development"
            />
          </div>
        </div>

        {/* Детали курса */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Детали курса
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Уровень сложности
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Язык курса
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Длительность (минут)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="300"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус курса
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL обложки курса
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/course-image.jpg"
            />
            {formData.thumbnailUrl && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Превью обложки:</div>
                <div className="w-32 h-20 border border-gray-300 rounded overflow-hidden">
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Не удалось загрузить</div>';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Цена и доступ */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Цена и доступ
          </h3>

          <div className="animate-slide-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFree" className="ml-2 text-sm font-medium text-gray-700">
                Бесплатный курс
              </label>
            </div>
          </div>

          {!formData.isFree && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="animate-slide-up" style={{ animationDelay: '1.3s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="12900"
                  />
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '1.4s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Старая цена (₽)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="14900"
                  />
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '1.5s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Скидка (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Расчет скидки */}
              {formData.price && formData.originalPrice && formData.originalPrice > formData.price && (
                <div className="animate-slide-up bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Расчет скидки:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Старая цена:</div>
                      <div className="font-medium text-gray-900">{parseFloat(formData.originalPrice).toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Новая цена:</div>
                      <div className="font-medium text-green-600">{parseFloat(formData.price).toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Экономия:</div>
                      <div className="font-medium text-red-600">
                        {parseFloat(formData.originalPrice - formData.price).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Скидка:</div>
                      <div className="font-medium text-blue-600">
                        {Math.round((1 - formData.price / formData.originalPrice) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="animate-slide-up" style={{ animationDelay: '1.6s' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                Показать в рекомендуемых курсах
              </label>
            </div>
          </div>
        </div>

        {/* Превью категории и уровня */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
          <div className="animate-slide-up" style={{ animationDelay: '1.7s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Превью категории
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white">
                {categories.find(cat => cat.value === formData.category)?.icon || <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {categories.find(cat => cat.value === formData.category)?.label}
                </div>
                <div className="text-xs text-gray-500">
                  Категория курса
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.8s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Превью уровня
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 text-white">
                {levels.find(level => level.value === formData.level)?.icon || <Plus className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {levels.find(level => level.value === formData.level)?.label}
                </div>
                <div className="text-xs text-gray-500">
                  Уровень сложности
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
}