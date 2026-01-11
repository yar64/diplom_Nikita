"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Search,
  Plus,
  Star,
  Folder,
  Tag,
  BarChart3,
  Download,
  RefreshCw,
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
import { enrollInCourse } from "../../../server/course-progress.actions";

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

  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = "mock-user-id";

  useEffect(() => {
    loadData();
  }, [activeTab, category, level, status]);

  useEffect(() => {
    loadCategories();
  }, []);

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

  const loadData = async () => {
    setLoading(true);

    try {
      if (activeTab === "courses") {
        const filters = {
          status: status || undefined,
          category: category || undefined,
          level: level || undefined,
          search: search || undefined,
          page: 1,
          limit: 50,
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

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = {
        courses,
        categories: fullCategories,
        stats,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `courses-export-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Данные успешно экспортированы");
    } catch (error) {
      console.error("Ошибка экспорта:", error);
      alert("Ошибка при экспорте данных");
    } finally {
      setExporting(false);
    }
  };

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
    console.log("Курс успешно создан/обновлен, обновляю данные...");
    loadData();
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    console.log('Закрытие модалки категории'); // Отладка
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Упрощенная версия - просто загружает данные
  const handleCategorySuccess = () => {
    console.log("Категория успешно создана/обновлена, обновляю данные...");
    loadCategories();
  };

  const handleDeleteClick = (course) => {
    setDeletingCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategoryClick = (cat) => {
    setDeletingCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCourse(null);
    setDeletingCategory(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      if (deletingCourse) {
        const instructorId = "mock-instructor-id";
        await deleteCourse(deletingCourse.id, instructorId);
        setCourses(courses.filter((course) => course.id !== deletingCourse.id));

        // Показываем уведомление об успешном удалении
        const event = new CustomEvent("showNotification", {
          detail: {
            message: "Курс успешно удален",
            type: "success",
          },
        });
        window.dispatchEvent(event);
      } else if (deletingCategory) {
        const result = await deleteCategory(deletingCategory.id);
        if (result.success) {
          setFullCategories(
            fullCategories.filter((cat) => cat.id !== deletingCategory.id)
          );
          setCategories(
            categories.filter((cat) => cat !== deletingCategory.name)
          );

          // Показываем уведомление об успешном удалении
          const event = new CustomEvent("showNotification", {
            detail: {
              message: "Категория успешно удалена",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        } else {
          alert(result.error);
        }
      }

      handleCloseDeleteModal();
    } catch (error) {
      alert(error.message || "Ошибка при удалении");
      handleCloseDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      await enrollInCourse(courseId, userId);
      alert("Вы успешно записались на курс!");
      loadData();
    } catch (error) {
      alert(error.message || "Ошибка при записи на курс");
    }
  };

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

  const getCoursesTableData = () => {
    const headers = [
      "Название курса",
      "Уровень",
      "Рейтинг",
      "Студенты",
      "Цена",
      "Действия",
    ];

    const data = courses.map((course) => {
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
              <span>{course.totalLessons || 0} уроков</span>
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
                : "error"
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
        <ActionButton
          key={`${course.id}-actions`}
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
              type: "add",
              onClick: () => handleEnrollCourse(course.id),
              label: "Записаться",
            },
            {
              type: "delete",
              onClick: () => handleDeleteClick(course),
              label: "Удалить",
            },
          ]}
          variant="minimal"
        />,
      ];
    });

    return { headers, data };
  };

  const getCategoriesTableData = () => {
    const categoriesToDisplay =
      fullCategories.length > 0
        ? fullCategories
        : categories.map((cat) => ({
            name: cat,
            id: cat,
            color: "#6366f1",
            isActive: true,
            coursesCount: 0,
            studentsCount: 0,
            revenue: 0,
          }));

    const headers = [
      "Название категории",
      "Курсов",
      "Студентов",
      "Доход",
      "Действия",
    ];

    const data = categoriesToDisplay.map((cat) => {
      const stats = {
        count: cat.coursesCount || 0,
        students: cat.studentsCount || 0,
        revenue: cat.revenue || 0,
      };

      return [
        <div key={cat.id || cat.name} className="flex items-center space-x-3">
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
          <div className="text-lg font-bold text-blue-600">{stats.count}</div>
          <div className="text-xs text-gray-500">курсов</div>
        </div>,
        <div key={`${cat.id}-students`} className="text-center">
          <div className="text-lg font-bold text-green-600">
            {stats.students}
          </div>
          <div className="text-xs text-gray-500">студентов</div>
        </div>,
        <div key={`${cat.id}-revenue`} className="text-center">
          <div className="text-lg font-bold text-amber-600">
            {stats.revenue.toLocaleString("ru-RU")} ₽
          </div>
          <div className="text-xs text-gray-500">доход</div>
        </div>,
        <ActionButton
          key={`${cat.id}-actions`}
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
              onClick: () => handleDeleteCategoryClick(cat),
              label: "Удалить",
            },
          ]}
          variant="minimal"
        />,
      ];
    });

    return { headers, data };
  };

  const renderCoursesTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const { headers, data } = getCoursesTableData();

    return (
      <div className="space-y-6">
        {/* Блок популярных курсов */}
        {popularCourses.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Популярные курсы
                </h3>
                <p className="text-sm text-gray-600">
                  Топ курсов по популярности
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-3 h-3 mr-1" />
                        <span>{course.averageRating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <Users className="w-3 h-3 inline mr-1" />
                      {course.totalStudents || 0}
                    </div>
                    <button
                      onClick={() => handleEnrollCourse(course.id)}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Записаться
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Фильтры и поиск */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-600">
            Показано {courses.length} курсов
          </div>
          <div className="flex flex-col md:flex-row gap-3">
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

        {/* Таблица курсов */}
        {courses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Курсы не найдены
            </h3>
            <p className="text-gray-500 mb-6">
              Попробуйте изменить параметры фильтрации
            </p>
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать первый курс
            </button>
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

  const renderCategoriesTab = () => {
    const categoriesToDisplay =
      fullCategories.length > 0
        ? fullCategories
        : categories.map((cat) => ({
            name: cat,
            id: cat,
            color: "#6366f1",
            isActive: true,
            coursesCount: 0,
            studentsCount: 0,
            revenue: 0,
          }));

    const { headers, data } = getCategoriesTableData();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {categoriesToDisplay.length} категорий
          </div>
          <div className="flex gap-3">
            <ActionButton
              type="refresh"
              onClick={handleRefreshStats}
              disabled={refreshing}
              variant="minimal"
              size="sm"
              showLabels={true}
              className={refreshing ? "opacity-50 cursor-not-allowed" : ""}
            >
              {refreshing ? "Обновление..." : "Обновить статистику"}
            </ActionButton>
            <ActionButton
              type="add"
              onClick={handleAddCategory}
              variant="solid"
              size="sm"
              showLabels={true}
            >
              Добавить категорию
            </ActionButton>
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
            <ActionButton
              type="add"
              onClick={handleAddCategory}
              variant="solid"
              size="md"
              showLabels={true}
            >
              Создать категорию
            </ActionButton>
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

            {/* Статистика по категориям */}
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
                    {
                      courses.filter((c) => categories.includes(c.category))
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    Курсов в категориях
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {categoriesToDisplay.length > 0
                      ? Math.round(
                          courses.filter((c) => categories.includes(c.category))
                            .length / categoriesToDisplay.length
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Заголовок страницы с кнопками */}
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
          <ActionButton
            type="add"
            onClick={handleAddCategory}
            variant="minimal"
            size="sm"
            showLabels={true}
          >
            Добавить категорию
          </ActionButton>
          <ActionButton
            type="add"
            onClick={handleAddCourse}
            variant="solid"
            size="sm"
            showLabels={true}
          >
            Создать курс
          </ActionButton>
        </div>
      </div>

      {/* Статистические карточки */}
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

      {/* Основной контент с табами */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Навигация табами */}
        <Tabs tabs={tabs} defaultTab="courses" onTabChange={setActiveTab} />

        {/* Контент табов */}
        <div className="mt-6">{renderTabContent()}</div>
      </div>

      {/* Модальные окна */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        course={editingCourse}
        onSuccess={handleCourseSuccess}
      />

      {/* CategoryModal - передаем handleCategorySuccess который только обновляет данные */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={editingCategory}
        onSuccess={handleCategorySuccess}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={deletingCourse ? "Удаление курса" : "Удаление категории"}
        message={
          deletingCourse
            ? `Вы уверены, что хотите удалить курс "${deletingCourse?.title}"? Это действие нельзя отменить.`
            : `Вы уверены, что хотите удалить категорию "${deletingCategory?.name}"? Все курсы этой категории останутся без категории.`
        }
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}