'use client';
import { useState, useEffect, useRef } from 'react';
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
  CheckCircle,
  AlertCircle,
  Info,
  User,
  Search,
  ChevronDown,
  Loader2,
  X,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createCourse, updateCourse } from '../../../../server/course.actions';
import { getUsers } from '../../../../server/user.actions';

export function CourseModal({ 
  isOpen, 
  onClose, 
  course = null,
  onSuccess,
  currentInstructorId = null
}) {
  const [formData, setFormData] = useState(getInitialFormData(course));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const modalContentRef = useRef(null);

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
      skillIds: courseData?.courseSkills?.map(cs => cs.skillId) || [],
      instructorId: courseData?.instructorId || currentInstructorId || ''
    };
  }

  // Загружаем пользователей при открытии модалки
  useEffect(() => {
    if (isOpen) {
      console.log('Открытие модалки курса');
      setFormData(getInitialFormData(course));
      setError('');
      setValidationErrors({});
      setSelectedInstructor(null);
      loadUsers();
    }
  }, [course, isOpen, currentInstructorId]);

  // Установка преподавателя после загрузки пользователей
  useEffect(() => {
    if (users.length > 0 && formData.instructorId) {
      const instructor = users.find(user => user.id === formData.instructorId);
      if (instructor) {
        setSelectedInstructor(instructor);
      }
    }
  }, [users, formData.instructorId]);

  // Загружаем список пользователей
  const loadUsers = async () => {
    if (isLoadingUsers) return;
    
    setIsLoadingUsers(true);
    try {
      console.log('Загрузка пользователей...');
      const result = await getUsers();
      if (result.success && result.users) {
        const formattedUsers = result.users.map(user => ({
          id: user.id,
          name: user.username || user.email,
          displayName: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName} (${user.username || user.email})`
            : user.username || user.email,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          stats: user.stats,
          _count: user._count,
          createdAt: user.createdAt
        }));
        setUsers(formattedUsers);
        console.log(`Загружено ${formattedUsers.length} пользователей`);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const categories = [
    { value: 'programming', label: 'Программирование', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'design', label: 'Дизайн', icon: <Filter className="w-4 h-4" /> },
    { value: 'marketing', label: 'Маркетинг', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'business', label: 'Бизнес', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'language', label: 'Языки', icon: <Globe className="w-4 h-4" /> },
    { value: 'data-science', label: 'Data Science', icon: <Target className="w-4 h-4" /> },
    { value: 'music', label: 'Музыка', icon: <Award className="w-4 h-4" /> },
    { value: 'photography', label: 'Фотография', icon: <Eye className="w-4 h-4" /> }
  ];

  const levels = [
    { value: 'BEGINNER', label: 'Начинающий', icon: <Plus className="w-4 h-4" /> },
    { value: 'INTERMEDIATE', label: 'Средний', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'ADVANCED', label: 'Продвинутый', icon: <Award className="w-4 h-4" /> },
    { value: 'EXPERT', label: 'Эксперт', icon: <Target className="w-4 h-4" /> }
  ];

  const languages = [
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'en', label: 'Английский', flag: '🇬🇧' },
    { value: 'es', label: 'Испанский', flag: '🇪🇸' },
    { value: 'fr', label: 'Французский', flag: '🇫🇷' },
    { value: 'de', label: 'Немецкий', flag: '🇩🇪' },
    { value: 'zh', label: 'Китайский', flag: '🇨🇳' },
    { value: 'ja', label: 'Японский', flag: '🇯🇵' },
    { value: 'ko', label: 'Корейский', flag: '🇰🇷' }
  ];

  const statuses = [
    { value: 'DRAFT', label: 'Черновик', icon: <EyeOff className="w-4 h-4" /> },
    { value: 'PUBLISHED', label: 'Опубликован', icon: <Eye className="w-4 h-4" /> },
    { value: 'ARCHIVED', label: 'Архивный', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'SCHEDULED', label: 'Запланирован', icon: <Calendar className="w-4 h-4" /> }
  ];

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Название курса обязательно';
    } else if (formData.title.length < 3) {
      errors.title = 'Название должно содержать минимум 3 символа';
    } else if (formData.title.length > 100) {
      errors.title = 'Название не должно превышать 100 символов';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'URL-адрес (slug) обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug может содержать только латинские буквы в нижнем регистре, цифры и дефисы';
    } else if (formData.slug.length < 3) {
      errors.slug = 'Slug должен содержать минимум 3 символа';
    } else if (formData.slug.length > 50) {
      errors.slug = 'Slug не должен превышать 50 символов';
    }

    if (!formData.category) {
      errors.category = 'Выберите категорию';
    }

    if (!formData.instructorId) {
      errors.instructorId = 'Выберите преподавателя';
    }

    if (formData.excerpt && formData.excerpt.length > 200) {
      errors.excerpt = 'Краткое описание не должно превышать 200 символов';
    }

    if (formData.description && formData.description.length > 5000) {
      errors.description = 'Полное описание не должно превышать 5000 символов';
    }

    if (!formData.isFree) {
      if (formData.price && isNaN(parseFloat(formData.price))) {
        errors.price = 'Введите корректную цену';
      } else if (formData.price && parseFloat(formData.price) < 0) {
        errors.price = 'Цена не может быть отрицательной';
      }

      if (formData.originalPrice && isNaN(parseFloat(formData.originalPrice))) {
        errors.originalPrice = 'Введите корректную оригинальную цену';
      } else if (formData.originalPrice && parseFloat(formData.originalPrice) < 0) {
        errors.originalPrice = 'Оригинальная цена не может быть отрицательной';
      }

      if (formData.price && formData.originalPrice && parseFloat(formData.price) > parseFloat(formData.originalPrice)) {
        errors.price = 'Цена не может быть больше оригинальной цены';
      }

      if (formData.discountPercent && (parseInt(formData.discountPercent) < 0 || parseInt(formData.discountPercent) > 100)) {
        errors.discountPercent = 'Скидка должна быть от 0 до 100%';
      }
    }

    if (formData.duration && (parseInt(formData.duration) < 0 || parseInt(formData.duration) > 10000)) {
      errors.duration = 'Длительность должна быть от 0 до 10000 минут';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Функция для парсинга ошибок Prisma
  const parsePrismaError = (errorMessage) => {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes('foreign key constraint')) {
      if (lowerMessage.includes('instructorid')) {
        return 'Выбранный преподаватель не найден в системе. Пожалуйста, выберите другого преподавателя.';
      }
      return 'Ошибка связи данных. Проверьте корректность выбранных опций.';
    }
    
    if (lowerMessage.includes('unique constraint')) {
      if (lowerMessage.includes('slug')) {
        return 'Курс с таким URL-адресом уже существует. Пожалуйста, выберите другой slug.';
      }
      return 'Запись с такими данными уже существует.';
    }
    
    if (lowerMessage.includes('курс с таким url уже существует')) {
      return 'Курс с таким URL-адресом уже существует. Пожалуйста, выберите другой slug.';
    }
    
    if (lowerMessage.includes('required')) {
      return 'Не все обязательные поля заполнены.';
    }
    
    return errorMessage || 'Произошла непредвиденная ошибка. Попробуйте еще раз.';
  };

  // В функции handleSubmit в CourseModal.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Отправка формы курса...');
  
  // Валидация формы
  if (!validateForm()) {
    setError('Пожалуйста, исправьте ошибки в форме');
    return;
  }

  setIsLoading(true);
  setError('');
  setValidationErrors({});

  try {
    // Преобразуем пустые строки в числа/undefined
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : (formData.isFree ? 0 : undefined),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      tags: formData.tags || '',
      category: formData.category // Передаем категорию
    };

    console.log('Данные для отправки:', processedData);

    let result;
    
    if (course) {
      console.log('Обновление курса:', course.id);
      result = await updateCourse(course.id, processedData, processedData.instructorId);
    } else {
      console.log('Создание нового курса');
      result = await createCourse(processedData, processedData.instructorId);
    }

    console.log('Результат операции:', result);

    if (result.id) {
      console.log('Курс успешно создан/обновлен, закрытие модалки');
      onSuccess?.();
      onClose();
      
      // Показываем сообщение об успехе
      const event = new CustomEvent('showNotification', {
        detail: { 
          message: result.message || (course ? 'Курс успешно обновлен' : 'Курс успешно создан'), 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
      
      return;
    } else {
      setError(result.error || 'Операция не удалась. Попробуйте еще раз.');
    }
  } catch (err) {
    // Парсим и показываем понятную ошибку
    const userFriendlyError = parsePrismaError(err.message);
    setError(userFriendlyError);
    
    console.error('Ошибка создания/обновления курса:', err);
  } finally {
    setIsLoading(false);
  }
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'instructorId') {
      const instructor = users.find(user => user.id === value);
      setSelectedInstructor(instructor || null);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку для этого поля при изменении
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Очистка выбранного преподавателя
  const handleClearInstructor = () => {
    setFormData(prev => ({
      ...prev,
      instructorId: ''
    }));
    setSelectedInstructor(null);
    if (validationErrors.instructorId) {
      setValidationErrors(prev => ({
        ...prev,
        instructorId: ''
      }));
    }
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
    if (formData.title && !formData.slug && !course) {
      const slug = generateSlug(formData.title);
      if (slug.length <= 50) {
        setFormData(prev => ({
          ...prev,
          slug: slug
        }));
      }
    }
  }, [formData.title, course]);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Функция для форматирования времени обучения
  const formatStudyTime = (minutes) => {
    if (!minutes) return '0 мин';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ч ${remainingMinutes} мин`;
  };

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
      size="xl"
    >
      {/* Блок глобальных ошибок */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-shake">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">Ошибка</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div ref={modalContentRef} className="space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Основная информация
          </h3>

          {/* Преподаватель */}
          <div className="animate-slide-up block" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Преподаватель *
            </label>
            <div className="relative">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                  <span className="text-gray-600">Загрузка пользователей...</span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <select
                      name="instructorId"
                      value={formData.instructorId}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none pr-10 ${
                        validationErrors.instructorId ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Выберите преподавателя...</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.displayName} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {formData.instructorId && (
                    <button
                      type="button"
                      onClick={handleClearInstructor}
                      onMouseDown={(e) => e.preventDefault()}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Очистить выбор
                    </button>
                  )}
                </>
              )}
              
              {validationErrors.instructorId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.instructorId}
                </p>
              )}
            </div>
          </div>

          {/* Название и категория */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Введите название курса"
                maxLength={100}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.title}
                </p>
              )}
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.title.length}/100 символов
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.category}
                </p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Link className="w-4 h-4 mr-2" />
              URL-адрес (slug) *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2 flex-shrink-0">/course/</span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="react-fundamentals"
              />
              <button
                type="button"
                onClick={() => {
                  if (formData.title) {
                    setFormData(prev => ({
                      ...prev,
                      slug: generateSlug(prev.title)
                    }));
                  }
                }}
                onMouseDown={(e) => e.preventDefault()}
                className="ml-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                Генерировать
              </button>
            </div>
            {validationErrors.slug && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.slug}
              </p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Только латинские буквы, цифры и дефисы
              </p>
              <div className="text-xs text-gray-500">
                {formData.slug.length}/50 символов
              </div>
            </div>
          </div>

          {/* Описания */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Краткое описание
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="2"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                validationErrors.excerpt ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Краткое описание для карточки курса"
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                {formData.excerpt?.length || 0}/200 символов
              </div>
              {validationErrors.excerpt && (
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.excerpt}
                </p>
              )}
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Полное описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                validationErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Полное описание курса"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                {formData.description?.length || 0}/5000 символов
              </div>
              {validationErrors.description && (
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.description}
                </p>
              )}
            </div>
          </div>

          {/* Теги */}
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
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
            <p className="mt-1 text-xs text-gray-500">
              Перечислите теги через запятую. Например: React, JavaScript, Frontend
            </p>
          </div>
        </div>

        {/* Блок предварительного просмотра преподавателя */}
        {selectedInstructor && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Выбранный преподаватель
              </h4>
              <div className="text-xs px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">
                ID: {selectedInstructor.id.substring(0, 8)}...
              </div>
            </div>
            <div className="flex items-center">
              {selectedInstructor.avatar ? (
                <img 
                  src={selectedInstructor.avatar} 
                  alt={selectedInstructor.name}
                  className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 text-white border-2 border-white shadow">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{selectedInstructor.displayName}</div>
                    <div className="text-sm text-gray-600">{selectedInstructor.email}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedInstructor.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    selectedInstructor.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedInstructor.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {selectedInstructor.stats && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">Обучение</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatStudyTime(selectedInstructor.stats.totalStudyTime || 0)}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedInstructor._count?.skills && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">Навыки</div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedInstructor._count.skills}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedInstructor._count?.projects && (
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-green-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">Проекты</div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedInstructor._count.projects}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedInstructor.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">Создан</div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(selectedInstructor.createdAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Детали курса */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Детали курса
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Уровень сложности
              </label>
              <div className="relative">
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="mt-2">
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

            <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Язык курса
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
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
                max="10000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="300"
              />
              {validationErrors.duration && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.duration}
                </p>
              )}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '1.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус курса
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* URL обложки */}
          <div className="animate-slide-up" style={{ animationDelay: '1.2s' }}>
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
              <div className="mt-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Превью обложки:</div>
                <div className="w-full max-w-xs h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                          <AlertCircle class="w-8 h-8 text-gray-300 mb-2" />
                          <div class="text-sm text-gray-400">Не удалось загрузить изображение</div>
                          <div class="text-xs text-gray-400 mt-1">Проверьте URL адрес</div>
                        </div>
                      `;
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

          <div className="animate-slide-up" style={{ animationDelay: '1.3s' }}>
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
                <div className="animate-slide-up" style={{ animationDelay: '1.4s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена (₽) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="12900"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₽
                    </span>
                  </div>
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.price}
                    </p>
                  )}
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '1.5s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Старая цена (₽)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.originalPrice ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="14900"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₽
                    </span>
                  </div>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: '1.6s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Скидка (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountPercent"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.discountPercent ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="15"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                  {validationErrors.discountPercent && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.discountPercent}
                    </p>
                  )}
                </div>
              </div>

              {/* Расчет скидки */}
              {formData.price && formData.originalPrice && formData.originalPrice > formData.price && (
                <div className="animate-slide-up bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Расчет скидки
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="text-gray-600 text-xs mb-1">Старая цена:</div>
                      <div className="font-medium text-gray-900 line-through">
                        {parseFloat(formData.originalPrice).toLocaleString('ru-RU', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} ₽
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="text-gray-600 text-xs mb-1">Новая цена:</div>
                      <div className="font-medium text-green-600">
                        {parseFloat(formData.price).toLocaleString('ru-RU', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} ₽
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="text-gray-600 text-xs mb-1">Экономия:</div>
                      <div className="font-medium text-red-600">
                        {(parseFloat(formData.originalPrice) - parseFloat(formData.price)).toLocaleString('ru-RU', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} ₽
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <div className="text-gray-600 text-xs mb-1">Скидка:</div>
                      <div className="font-medium text-blue-600">
                        {Math.round((1 - parseFloat(formData.price) / parseFloat(formData.originalPrice)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Избранный курс */}
          <div className="animate-slide-up" style={{ animationDelay: '1.7s' }}>
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
          <div className="animate-slide-up" style={{ animationDelay: '1.8s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Превью категории
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white shadow">
                {categories.find(cat => cat.value === formData.category)?.icon || <BookOpen className="w-6 h-6" />}
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

          <div className="animate-slide-up" style={{ animationDelay: '1.9s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Превью уровня
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 text-white shadow">
                {levels.find(level => level.value === formData.level)?.icon || <Plus className="w-6 h-6" />}
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

        {/* Информация о курсе */}
        <div className="animate-slide-up" style={{ animationDelay: '2.0s' }}>
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Информация о курсе
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className="font-medium text-gray-900">
                    {statuses.find(s => s.value === formData.status)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Язык:</span>
                  <span className="font-medium text-gray-900">
                    {languages.find(l => l.value === formData.language)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Цена:</span>
                  <span className="font-medium text-gray-900">
                    {formData.isFree ? 'Бесплатно' : `${formData.price || '0'} ₽`}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Избранный:</span>
                  <span className={`font-medium ${formData.isFeatured ? 'text-green-600' : 'text-gray-600'}`}>
                    {formData.isFeatured ? 'Да' : 'Нет'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Длительность:</span>
                  <span className="font-medium text-gray-900">
                    {formData.duration ? `${formData.duration} мин` : 'Не указано'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Теги:</span>
                  <span className="font-medium text-gray-900">
                    {formData.tags ? formData.tags.split(',').length : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
}