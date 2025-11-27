"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Search, 
  Plus
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
import ActionButton from "../../../components/admin/ui/buttons/ActionButton";
import { getSkills, deleteSkill } from "../../../server/skill.actions";
import { getLearningPaths, deleteLearningPath } from "../../../server/learning-path.actions";
import { getUserSessions } from "../../../server/studySession.actions";
import { SkillModal } from "../../../components/admin/ui/modals/SkillModal";
import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";

const tabs = [
  { id: "skills", label: "Управление навыками" },
  { id: "paths", label: "Пути обучения" },
  { id: "sessions", label: "Учебные сессии" },
  { id: "resources", label: "Ресурсы" },
];

// Опции фильтров
const categoryOptions = [
  { value: "", label: "Все категории" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps" },
  { value: "database", label: "Database" },
];

const sortOptions = [
  { value: "popularity", label: "Популярность" },
  { value: "name", label: "Название" },
  { value: "difficulty", label: "Сложность" },
];

const periodOptions = [
  { value: "7days", label: "7 дней" },
  { value: "30days", label: "30 дней" },
  { value: "all", label: "Все время" },
];

const typeOptions = [
  { value: "", label: "Все типы" },
  { value: "THEORY", label: "Теория" },
  { value: "PRACTICE", label: "Практика" },
];

const difficultyOptions = [
  { value: "", label: "Все сложности" },
  { value: "BEGINNER", label: "Начинающий" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
];

export default function SkillsLearningPage() {
  const [activeTab, setActiveTab] = useState("skills");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [period, setPeriod] = useState("7days");
  const [sessionType, setSessionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  
  // Состояния для реальных данных
  const [skills, setSkills] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSkills: 0,
    activeLearners: 0,
    studyHours: 0,
    resources: 0
  });

  // Состояния для модальных окон
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "skills":
          const skillsResult = await getSkills();
          if (skillsResult.success) {
            setSkills(skillsResult.skills || []);
          } else {
            console.error("Ошибка загрузки навыков:", skillsResult.error);
          }
          break;
        case "paths":
          const pathsResult = await getLearningPaths();
          if (pathsResult.success) {
            setLearningPaths(pathsResult.learningPaths || []);
          } else {
            console.error("Ошибка загрузки путей обучения:", pathsResult.error);
          }
          break;
        case "sessions":
          // Здесь нужно передать конкретный userId, пока используем mock
          const sessionsResult = await getUserSessions("user-id");
          if (sessionsResult.success) {
            setStudySessions(sessionsResult.sessions || []);
          } else {
            console.error("Ошибка загрузки учебных сессий:", sessionsResult.error);
          }
          break;
      }
      
      // Загрузка статистики
      await loadStats();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Вычисляем статистику на основе загруженных данных
    const totalSkills = skills.length;
    
    // Считаем общее количество пользователей, изучающих навыки
    const activeLearners = skills.reduce((acc, skill) => 
      acc + (skill.userSkills?.length || 0), 0
    );
    
    // Считаем общее количество часов обучения
    const studyHours = Math.round(
      studySessions.reduce((acc, session) => acc + (session.duration || 0), 0) / 60
    );
    
    // Считаем общее количество ресурсов
    const resources = skills.reduce((acc, skill) => 
      acc + (skill.learningResources?.length || 0), 0
    );
    
    setStats({
      totalSkills,
      activeLearners,
      studyHours,
      resources
    });
  };

  // Функции для работы с модальными окнами навыков
  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleCloseSkillModal = () => {
    setIsSkillModalOpen(false);
    setEditingSkill(null);
  };

  const handleSkillSuccess = () => {
    loadData(); // Перезагружаем данные после успешного создания/обновления
  };

  // Функции для удаления навыков
  const handleDeleteClick = (skill) => {
    setDeletingSkill(skill);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingSkill(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSkill) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteSkill(deletingSkill.id);
      if (result.success) {
        setSkills(skills.filter(skill => skill.id !== deletingSkill.id));
        handleCloseDeleteModal();
      } else {
        alert(result.error);
        handleCloseDeleteModal();
      }
    } catch (error) {
      alert("Ошибка при удалении навыка");
      handleCloseDeleteModal();
    }
  };

  // Функции для работы с путями обучения
  const handleDeleteLearningPath = async (pathId, pathTitle) => {
    if (window.confirm(`Вы уверены, что хотите удалить путь обучения "${pathTitle}"?`)) {
      try {
        const result = await deleteLearningPath(pathId);
        if (result.success) {
          setLearningPaths(learningPaths.filter(path => path.id !== pathId));
        } else {
          alert(result.error);
        }
      } catch (error) {
        alert("Ошибка при удалении пути обучения");
      }
    }
  };

  // Функция для отображения аватаров пользователей
  const renderUserAvatars = (userSkills, totalUsers) => {
    if (!userSkills || userSkills.length === 0) {
      return (
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">+0</span>
            </div>
          </div>
          <span className="text-gray-700 font-medium">0</span>
        </div>
      );
    }

    const visibleUsers = userSkills.slice(0, 3);
    const remainingUsers = Math.max(0, totalUsers - 3);

    return (
      <div className="flex items-center space-x-3">
        <div className="flex -space-x-2">
          {visibleUsers.map((userSkill, index) => (
            <div 
              key={userSkill.id}
              className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              title={userSkill.user?.name || userSkill.user?.email}
            >
              {(userSkill.user?.name?.[0] || userSkill.user?.email?.[0] || 'U').toUpperCase()}
            </div>
          ))}
          {remainingUsers > 0 && (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">+{remainingUsers}</span>
            </div>
          )}
        </div>
        <span className="text-gray-700 font-medium">{totalUsers}</span>
      </div>
    );
  };

  // Преобразование данных для таблицы навыков
  const getSkillsTableData = () => {
    return skills.map(skill => {
      const userSkillsCount = skill.userSkills?.length || 0;
      const resourcesCount = skill.learningResources?.length || 0;

      return [
        <div key={skill.id} className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {skill.icon || skill.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{skill.name}</div>
            <div className="text-sm text-gray-500">{skill.description || "Нет описания"}</div>
          </div>
        </div>,
        <div key={`${skill.id}-category`} className="text-gray-700 capitalize">
          {skill.category}
        </div>,
        <StatusBadge 
          key={`${skill.id}-diff`} 
          status={skill.difficulty} 
          variant={
            skill.difficulty === 'BEGINNER' ? 'success' : 
            skill.difficulty === 'INTERMEDIATE' ? 'warning' : 'error'
          } 
        />,
        renderUserAvatars(skill.userSkills, userSkillsCount),
        <div key={`${skill.id}-resources`} className="text-center">
          <span className="text-blue-600 font-semibold">{resourcesCount}</span>
        </div>,
        <ActionButton
          key={`${skill.id}-actions`}
          actions={[
            {
              type: "edit",
              onClick: () => handleEditSkill(skill),
            },
            {
              type: "view",
              onClick: () => console.log("Просмотр навыка", skill.name),
            },
            {
              type: "stats",
              onClick: () => console.log("Статистика для", skill.name),
            },
            {
              type: "delete",
              onClick: () => handleDeleteClick(skill),
            },
          ]}
          variant="default"
          size="sm"
        />,
      ];
    });
  };

  // Преобразование данных для таблицы путей обучения
  const getLearningPathsTableData = () => {
    return learningPaths.map(path => [
      <div key={path.id} className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm">🚀</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{path.title}</div>
          <div className="text-sm text-gray-500">@{path.user?.name || path.user?.email?.split('@')[0] || 'неизвестно'}</div>
        </div>
      </div>,
      <div key={`${path.id}-skills`} className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {["🟢", "🟢", "🟢", "🟢", "⚪"].map((dot, i) => (
            <span key={i}>{dot}</span>
          ))}
        </div>
        <span className="text-sm text-gray-600">{path.milestones?.length || 0} этапов</span>
      </div>,
      <div key={`${path.id}-participants`} className="text-center">
        <span className="text-gray-700 font-medium">0</span>
      </div>,
      <div key={`${path.id}-progress`} className="flex items-center space-x-3">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: "70%" }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">70%</span>
      </div>,
      <ActionButton
        key={`${path.id}-actions`}
        actions={[
          {
            type: "edit",
            onClick: () => console.log("Редактировать путь обучения", path.title),
          },
          {
            type: "view",
            onClick: () => console.log("Просмотреть путь обучения", path.title),
          },
          {
            type: "delete",
            onClick: () => handleDeleteLearningPath(path.id, path.title),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  // Преобразование данных для таблицы сессий обучения
  const getStudySessionsTableData = () => {
    return studySessions.map(session => [
      <div key={session.id} className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
        <span className="font-medium text-gray-900">@{session.userId?.substring(0, 8) || 'неизвестно'}</span>
      </div>,
      <span key={`${session.id}-skill`} className="text-gray-700">
        {session.userSkill?.skill?.name || 'Неизвестный навык'}
      </span>,
      <div key={`${session.id}-duration`} className="flex items-center space-x-2 text-green-600 font-medium">
        <Clock className="w-4 h-4" />
        <span>{Math.round((session.duration || 0) / 60)}ч {(session.duration || 0) % 60}м</span>
      </div>,
      <StatusBadge key={`${session.id}-type`} status={session.sessionType} variant="info" />,
      <div key={`${session.id}-efficiency`} className="flex items-center space-x-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={star <= Math.floor(((session.efficiency || 0) / 20)) ? "text-amber-400" : "text-gray-300"}
            >
              ⭐
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-600">{session.efficiency || 0}%</span>
      </div>,
      <span key={`${session.id}-date`} className="text-gray-600">
        {session.date ? new Date(session.date).toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Неизвестная дата'}
      </span>,
    ]);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "skills":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {skills.length} из {skills.length} навыков
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск навыков..."
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
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Навык",
                "Категория",
                "Сложность",
                "Изучают",
                "Ресурсы",
                "Действия",
              ]}
              data={getSkillsTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "paths":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {learningPaths.length} из {learningPaths.length} путей
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск путей..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
            </div>

            <Table
              headers={[
                "Название пути",
                "Навыки",
                "Участники",
                "Прогресс",
                "Действия",
              ]}
              data={getLearningPathsTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "sessions":
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">
                Активность обучения
              </h3>
              <div className="flex items-center space-x-4 text-xs">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(
                  (day, index) => (
                    <div
                      key={day}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div
                        className="w-3 bg-gradient-to-t from-green-400 to-green-500 rounded-full"
                        style={{
                          height: `${
                            [45, 67, 89, 54, 32, 78, 61][index] / 2
                          }px`,
                        }}
                      />
                      <span className="text-gray-600">{day}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {studySessions.length} из {studySessions.length} сессий
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск сессий..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Пользователь",
                "Навык",
                "Длительность",
                "Тип",
                "Эффективность",
                "Дата",
              ]}
              data={getStudySessionsTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "resources":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано 0 из 0 ресурсов
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск ресурсов..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficultyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center py-12">
              <p className="text-gray-500">Ресурсы будут доступны в следующем обновлении</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Заголовок страницы */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Навыки и обучение
          </h1>
          <p className="text-gray-600 mt-1">
            Управление навыками и обучением
          </p>
        </div>
        <ActionButton
          type="add"
          onClick={handleAddSkill}
          variant="solid"
          size="md"
          showLabels={true}
        >
          Добавить навык
        </ActionButton>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего навыков"
          value={stats.totalSkills.toString()}
          subtitle="Всего навыков"
          icon={<BookOpen className="w-6 h-6" />}
          color="blue"
          trend={{ isPositive: true, value: "8" }}
        />
        <StatCard
          title="Активные ученики"
          value={stats.activeLearners.toString()}
          subtitle="Активные ученики"
          icon={<Users className="w-6 h-6" />}
          color="green"
          trend={{ isPositive: true, value: "12" }}
        />
        <StatCard
          title="Часы обучения"
          value={stats.studyHours.toString()}
          subtitle="Часы обучения"
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          trend={{ isPositive: true, value: "8" }}
        />
        <StatCard
          title="Ресурсы"
          value={stats.resources.toString()}
          subtitle="Учебные ресурсы"
          icon={<FileText className="w-6 h-6" />}
          color="purple"
          trend={{ isPositive: true, value: "15" }}
        />
      </div>

      {/* Основной контент с табами */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Навигация табами */}
        <Tabs tabs={tabs} defaultTab="skills" onTabChange={setActiveTab} />

        {/* Контент табов */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Модальные окна */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={handleCloseSkillModal}
        skill={editingSkill}
        onSuccess={handleSkillSuccess}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Удаление навыка"
        message={`Вы уверены, что хотите удалить навык "${deletingSkill?.name}"? Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}