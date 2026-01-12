"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  DollarSign,
  Search,
  Star,
  Folder,
  Tag,
  BarChart3,
  X,
  RefreshCw,
  Shield,
  LogOut,
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
import ActionButton from "../../../components/admin/ui/buttons/ActionButton";
import { CourseModal } from "../../../components/admin/ui/modals/CourseModal";
import { CategoryModal } from "../../../components/admin/ui/modals/CategoryModal";
import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";
import {
  getCourses,
  deleteCourse,
  getCourseCategories,
  getPopularCourses,
  getSimpleCourses,
} from "../../../server/course.actions";
import {
  getCategories,
  deleteCategory,
  updateAllCategoriesStats,
} from "../../../server/category.actions";
import { useAuth } from "../../../contexts/AuthContext"; // ИМПОРТ КОНТЕКСТА
import { logoutUser } from "../../../server/auth.actions"; // ИМПОРТ ВЫХОДА

const tabs = [
  { id: "courses", label: "Курсы", icon: <BookOpen className="w-4 h-4" /> },
  {
    id: "categories",
    label: "Категории",
    icon: <Folder className="w-4 h-4" />,
  },
];

const levelOptions = [
  { value: "", label: "Все уровни" },
  { value: "BEGINNER", label: "Начинающий" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
  { value: "EXPERT", label: "Эксперт" },
];

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "PUBLISHED", label: "Опубликованные" },
  { value: "DRAFT", label: "Черновики" },
  { value: "ARCHIVED", label: "Архивные" },
];

export default function CoursesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth(); // ИСПОЛЬЗУЕМ КОНТЕКСТ
  
  const [activeTab, setActiveTab] = useState("courses");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");

  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fullCategories, setFullCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Проверка авторизации и прав при загрузке
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Пользователь не авторизован
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        // Пользователь не администратор
        alert("Требуются права администратора");
        router.push('/profile');
      }
    }
  }, [authLoading, user, router]);

  // Загрузка категорий при монтировании
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadCategories();
    }
  }, [user]);

  // Загрузка данных при изменении фильтров
  useEffect(() => {
    if (activeTab === "courses" && user?.role === 'ADMIN') {
      loadData();
    }
  }, [activeTab, category, level, status, search, user]);

  // Функция выхода
  const handleLogout = async () => {
    try {
      await logoutUser(); // Очищаем сессию на сервере
      logout(); // Очищаем контекст
      router.push('/login');
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      const cats = await getCourseCategories();
      setCategories(cats);

      const fullCatsResult = await getCategories();
      if (fullCatsResult.success) {
        setFullCategories(fullCatsResult.categories || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
      setCategories([]);
      setFullCategories([]);
    }
  };

  // Загрузка данных
  const loadData = async () => {
    setLoading(true);

    try {
      const filters = {
        status: status || undefined,
        category: category || undefined,
        level: level || undefined,
        search: search || undefined,
        page: 1,
        limit: 100,
      };

      const result = await getCourses(filters);

      if (result && result.courses) {
        setCourses(result.courses);
      } else {
        setCourses([]);
      }

      try {
        const popularResult = await getPopularCourses(10);
        setPopularCourses(popularResult || []);
      } catch (popularError) {
        console.error("Ошибка загрузки популярных курсов:", popularError);
        setPopularCourses([]);
      }

      await loadStats();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setCourses([]);
      setPopularCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка статистики
  const loadStats = async () => {
    try {
      const result = await getSimpleCourses();

      if (result?.courses) {
        const totalCourses = result.total;
        const enrolledStudents = result.courses.reduce(
          (acc, course) => acc + (course.totalStudents || 0),
          0
        );

        const totalRevenue = result.courses.reduce((acc, course) => {
          const price = course.price || 0;
          const students = course.totalStudents || 0;
          return acc + price * students;
        }, 0);

        const avgRating =
          result.courses.length > 0
            ? result.courses.reduce(
                (acc, course) => acc + (course.averageRating || 0),
                0
              ) / result.courses.length
            : 0;

        setStats({
          totalCourses,
          enrolledStudents,
          totalRevenue,
          avgRating: parseFloat(avgRating.toFixed(1)),
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
    setStatus("");
  };

  // Проверка активных фильтров
  const hasActiveFilters = search || category || level || status;

  // Обновление статистики
  const handleRefreshStats = async () => {
    setRefreshing(true);
    try {
      const result = await updateAllCategoriesStats();
      if (result.success) {
        alert(result.message || "Статистика категорий обновлена");
        loadCategories();
      } else {
        alert(result.error || "Ошибка обновления статистики");
      }
    } catch (error) {
      console.error("Ошибка обновления статистики:", error);
      alert("Ошибка обновления статистики");
    } finally {
      setRefreshing(false);
    }
  };

  // Работа с курсами
  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleCourseSuccess = () => {
    handleCloseCourseModal();
    setTimeout(() => {
      loadData().catch(err => {
        console.error("Ошибка загрузки данных:", err);
      });
    }, 100);
  };

  // Работа с категориями
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySuccess = () => {
    handleCloseCategoryModal();
    setTimeout(() => {
      loadCategories().catch(err => {
        console.error("Ошибка загрузки категорий:", err);
      });
    }, 100);
  };

  // Удаление
  const handleDeleteClick = (course) => {
    console.log("Курс для удаления:", course);
    setDeletingCourse(course);
    setDeletingCategory(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategoryClick = (cat) => {
    console.log("Категория для удаления:", cat);
    setDeletingCategory(cat);
    setDeletingCourse(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      setDeletingCourse(null);
      setDeletingCategory(null);
      setIsDeleting(false);
    }, 100);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || !user) return;
    
    setIsDeleting(true);
    
    try {
      if (deletingCourse) {
        console.log("Удаление курса:", deletingCourse.id);
        console.log("Администратор:", user.email);
        
        // Используем ID текущего пользователя
        await deleteCourse(deletingCourse.id, user.id);
        
        // Обновляем список курсов
        setCourses(prev => prev.filter(course => course.id !== deletingCourse.id));
        
        // Обновляем статистику
        await loadStats();
        
        alert("Курс успешно удален");
        
      } else if (deletingCategory) {
        console.log("Удаление категории:", deletingCategory.id);
        const result = await deleteCategory(deletingCategory.id);
        
        if (result.success) {
          setFullCategories(
            fullCategories.filter((cat) => cat.id !== deletingCategory.id)
          );
          setCategories(
            categories.filter((cat) => cat !== deletingCategory.name)
          );
          
          alert("Категория успешно удалена");
        } else {
          alert(result.error || "Ошибка при удалении категории");
        }
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert(error.message || "Ошибка при удалении");
    } finally {
      handleCloseDeleteModal();
    }
  };

  // Вспомогательные функции отображения
  const renderRating = (rating, totalReviews) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
        </div>
        <span className="text-sm text-gray-500">({totalReviews})</span>
      </div>
    );
  };

  const renderPrice = (course) => {
    if (course.isFree || !course.price) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          Бесплатно
        </span>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-gray-900">
          {course.price?.toLocaleString("ru-RU")} ₽
        </span>
        {course.originalPrice && course.originalPrice > course.price && (
          <span className="text-sm text-gray-500 line-through">
            {course.originalPrice.toLocaleString("ru-RU")} ₽
          </span>
        )}
        {course.discountPercent && (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            -{course.discountPercent}%
          </span>
        )}
      </div>
    );
  };

  // Данные для таблицы курсов
  const getCoursesTableData = () => {
    const headers = [
      "Название курса",
      "Уровень",
      "Рейтинг",
      "Студенты",
      "Цена",
      "Статус",
      "Действия",
    ];

    const data = courses.map((course) => {
      let statusColor = "gray";
      let statusText = "Неизвестно";
      
      switch (course.status) {
        case 'PUBLISHED':
          statusColor = "green";
          statusText = "Опубликован";
          break;
        case 'DRAFT':
          statusColor = "yellow";
          statusText = "Черновик";
          break;
        case 'ARCHIVED':
          statusColor = "red";
          statusText = "В архиве";
          break;
      }

      return [
        <div key={course.id} className="flex items-center space-x-3">
          <div className="w-12 h-12 flex-shrink-0">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {course.title}
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
              <Tag className="w-3 h-3" />
              <span
                style={{
                  color: course.categoryColor || "#6366f1",
                  fontWeight: "500",
                }}
              >
                {course.categoryName || course.category || "Без категории"}
              </span>
              <span>•</span>
              <span>{course.totalChapters || 0} уроков</span>
              <span>•</span>
              <span>@{course.instructor?.username || "неизвестно"}</span>
            </div>
          </div>
        </div>,
        <div key={`${course.id}-level`}>
          <StatusBadge
            status={course.level}
            variant={
              course.level === "BEGINNER"
                ? "success"
                : course.level === "INTERMEDIATE"
                ? "warning"
                : course.level === "ADVANCED"
                ? "error"
                : "info"
            }
          />
        </div>,
        renderRating(course.averageRating || 0, course.totalReviews || 0),
        <div
          key={`${course.id}-students`}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{course.totalStudents || 0}</span>
        </div>,
        renderPrice(course),
        <div key={`${course.id}-status`}>
          <span className={`px-2 py-1 text-xs font-medium rounded-full 
            ${statusColor === 'green' ? 'bg-green-100 text-green-800' : 
              statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              statusColor === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}>
            {statusText}
          </span>
        </div>,
        <div key={`${course.id}-actions`}>
          <ActionButton
            actions={[
              {
                type: "edit",
                onClick: () => handleEditCourse(course),
                label: "Редактировать",
              },
              {
                type: "view",
                onClick: () => window.open(`/course/${course.slug}`, "_blank"),
                label: "Просмотреть",
              },
              {
                type: "delete",
                onClick: () => handleDeleteClick(course),
                label: "Удалить",
                disabled: user?.role !== 'ADMIN', // Отключаем если не админ
              },
            ]}
            variant="minimal"
          />
        </div>,
      ];
    });

    return { headers, data };
  };

  // Данные для таблицы категорий
  const getCategoriesTableData = () => {
    const categoriesToDisplay = fullCategories;

    const headers = [
      "Название категории",
      "Курсов",
      "Студентов",
      "Доход",
      "Действия",
    ];

    const data = categoriesToDisplay.map((cat) => {
      return [
        <div key={cat.id} className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: cat.color || "#6366f1" }}
          >
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{cat.name}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{cat.slug || "нет slug"}</span>
              <span>•</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  cat.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {cat.isActive ? "Активна" : "Неактивна"}
              </span>
            </div>
          </div>
        </div>,
        <div key={`${cat.id}-count`} className="text-center">
          <div className="text-lg font-bold text-blue-600">{cat.coursesCount || 0}</div>
          <div className="text-xs text-gray-500">курсов</div>
        </div>,
        <div key={`${cat.id}-students`} className="text-center">
          <div className="text-lg font-bold text-green-600">
            {cat.studentsCount || 0}
          </div>
          <div className="text-xs text-gray-500">студентов</div>
        </div>,
        <div key={`${cat.id}-revenue`} className="text-center">
          <div className="text-lg font-bold text-amber-600">
            {cat.revenue?.toLocaleString("ru-RU") || 0} ₽
          </div>
          <div className="text-xs text-gray-500">доход</div>
        </div>,
        <div key={`${cat.id}-actions`}>
          <ActionButton
            actions={[
              {
                type: "edit",
                onClick: () => handleEditCategory(cat),
                label: "Редактировать",
              },
              {
                type: "view",
                onClick: () => {
                  setCategory(cat.id);
                  setActiveTab("courses");
                },
                label: "Показать курсы",
              },
              {
                type: "delete",
                onClick: (e) => {
                  e?.stopPropagation?.();
                  e?.preventDefault?.();
                  handleDeleteCategoryClick(cat);
                },
                label: "Удалить",
                disabled: user?.role !== 'ADMIN', // Отключаем если не админ
              },
            ]}
            variant="minimal"
          />
        </div>,
      ];
    });

    return { headers, data };
  };

  // Рендер таба курсов
  const renderCoursesTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Загрузка курсов...</span>
        </div>
      );
    }

    const { headers, data } = getCoursesTableData();

    return (
      <div className="space-y-6">
        {/* ... существующий код для популярных курсов ... */}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-600">
            Показано {courses.length} курсов из {stats.totalCourses}
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                (применены фильтры)
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Сбросить фильтры
              </button>
            )}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все категории</option>
              {fullCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? "Курсы не найдены" : "Нет созданных курсов"}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? "Попробуйте изменить параметры фильтрации" 
                : "Создайте свой первый курс"}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сбросить фильтры
              </button>
            ) : (
              <button
                onClick={handleAddCourse}
                disabled={user?.role !== 'ADMIN'}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  user?.role !== 'ADMIN'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Создать первый курс
              </button>
            )}
          </div>
        ) : (
          <Table
            headers={headers}
            data={data}
            emptyMessage="Курсы не найдены"
            striped={true}
            hover={true}
          />
        )}
      </div>
    );
  };

  // Рендер таба категорий
  const renderCategoriesTab = () => {
    const categoriesToDisplay = fullCategories;

    const { headers, data } = getCategoriesTableData();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {categoriesToDisplay.length} категорий
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefreshStats}
              disabled={refreshing || user?.role !== 'ADMIN'}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center ${
                refreshing || user?.role !== 'ADMIN'
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Обновление..." : "Обновить статистику"}
            </button>
            <button
              onClick={handleAddCategory}
              disabled={user?.role !== 'ADMIN'}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center ${
                user?.role !== 'ADMIN'
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Folder className="w-4 h-4 mr-2" />
              Добавить категорию
            </button>
          </div>
        </div>

        {categoriesToDisplay.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Категории не найдены
            </h3>
            <p className="text-gray-500 mb-6">
              Создайте первую категорию для ваших курсов
            </p>
            <button
              onClick={handleAddCategory}
              disabled={user?.role !== 'ADMIN'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center mx-auto ${
                user?.role !== 'ADMIN'
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Folder className="w-4 h-4 mr-2" />
              Создать категорию
            </button>
          </div>
        ) : (
          <>
            <Table
              headers={headers}
              data={data}
              emptyMessage="Категории не найдены"
              striped={true}
              hover={true}
            />

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Статистика по категориям
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {categoriesToDisplay.length}
                  </div>
                  <div className="text-sm text-gray-600">Всего категорий</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {categoriesToDisplay.reduce((sum, cat) => sum + (cat.coursesCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Курсов в категориях
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {categoriesToDisplay.length > 0
                      ? Math.round(
                          categoriesToDisplay.reduce((sum, cat) => sum + (cat.coursesCount || 0), 0) / 
                          categoriesToDisplay.length
                        )
                      : 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Среднее курсов на категорию
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Рендер контента таба
  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return renderCoursesTab();
      case "categories":
        return renderCategoriesTab();
      default:
        return null;
    }
  };

  // Показываем загрузку при проверке авторизации
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если нет пользователя или не админ
  if (!user || user.role !== 'ADMIN') {
    return null; // useEffect уже перенаправит на login или профиль
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Панель информации об администраторе */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Панель администратора
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>{user.firstName} {user.lastName}</span>
                <span className="text-gray-400">•</span>
                <span>{user.email}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Мой профиль
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Курсы и категории
          </h1>
          <p className="text-gray-600 mt-1">
            Управление курсами и их категориями
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddCategory}
            disabled={user?.role !== 'ADMIN'}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center ${
              user?.role !== 'ADMIN'
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Folder className="w-4 h-4 mr-2" />
            Добавить категорию
          </button>
          <button
            onClick={handleAddCourse}
            disabled={user?.role !== 'ADMIN'}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center ${
              user?.role !== 'ADMIN'
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Создать курс
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего курсов"
          value={stats.totalCourses.toString()}
          subtitle="В каталоге"
          icon={<BookOpen className="w-6 h-6" />}
          color="blue"
          trend={{ isPositive: true, value: "8" }}
        />
        <StatCard
          title="Категорий"
          value={fullCategories.length.toString()}
          subtitle="Уникальных"
          icon={<Folder className="w-6 h-6" />}
          color="green"
          trend={{ isPositive: true, value: "2" }}
        />
        <StatCard
          title="Общая выручка"
          value={`${stats.totalRevenue.toLocaleString("ru-RU")} ₽`}
          subtitle="Общий доход"
          icon={<DollarSign className="w-6 h-6" />}
          color="amber"
          trend={{ isPositive: true, value: "8%" }}
        />
        <StatCard
          title="Средний рейтинг"
          value={stats.avgRating.toFixed(1)}
          subtitle="По всем курсам"
          icon={<Star className="w-6 h-6" />}
          color="purple"
          trend={{ isPositive: true, value: "+0.2" }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <Tabs tabs={tabs} defaultTab="courses" onTabChange={setActiveTab} />
        <div className="mt-6">{renderTabContent()}</div>
      </div>

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        course={editingCourse}
        onSuccess={handleCourseSuccess}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={editingCategory}
        onSuccess={handleCategorySuccess}
      />

      <ConfirmModal
        key={`delete-modal-${deletingCourse?.id || deletingCategory?.id || 'empty'}`}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={deletingCourse ? "Удаление курса" : "Удаление категории"}
        message={
          deletingCourse
            ? `Вы уверены, что хотите удалить курс "${deletingCourse?.title || 'этот курс'}"? Это действие нельзя отменить.`
            : `Вы уверены, что хотите удалить категорию "${deletingCategory?.name || 'эту категорию'}"? Все курсы этой категории останутся без категории.`
        }
        confirmLabel={isDeleting ? "Удаление..." : "Удалить"}
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}