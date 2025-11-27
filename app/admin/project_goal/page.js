// app/admin/projects-goals/page.js
"use client";

import { useState, useEffect } from "react";
import { 
  Target, 
  Briefcase, 
  Search, 
  Plus,
  Calendar,
  User,
  Code,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
import ActionButton from "../../../components/admin/ui/buttons/ActionButton";
import { getProjects, deleteProject } from "../../../server/project.actions";
import { getGoals, deleteGoal, completeGoal } from "../../../server/goal.actions";
import { getSkills } from "../../../server/skill.actions";
import { ProjectModal } from "../../../components/admin/ui/modals/ProjectModal";
import { GoalModal } from "../../../components/admin/ui/modals/GoalModal";
import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";

const tabs = [
  { id: "projects", label: "Управление проектами" },
  { id: "goals", label: "Управление целями" },
];

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "PLANNED", label: "Запланирован" },
  { value: "IN_PROGRESS", label: "В процессе" },
  { value: "COMPLETED", label: "Завершен" },
  { value: "ON_HOLD", label: "На паузе" },
  { value: "CANCELLED", label: "Отменен" },
];

const completionOptions = [
  { value: "", label: "Все цели" },
  { value: "completed", label: "Завершенные" },
  { value: "active", label: "Активные" },
];

export default function ProjectsGoalsPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [completion, setCompletion] = useState("");
  
  // Состояния для данных
  const [projects, setProjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalGoals: 0,
    completedGoals: 0
  });

  // Состояния для модальных окон
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsResult, goalsResult, skillsResult] = await Promise.all([
        getProjects(),
        getGoals(),
        getSkills()
      ]);

      if (projectsResult.success) {
        setProjects(projectsResult.projects || []);
      }
      if (goalsResult.success) {
        setGoals(goalsResult.goals || []);
      }
      if (skillsResult.success) {
        setSkills(skillsResult.skills || []);
      }

      await loadStats();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.isCompleted).length;
    
    setStats({
      totalProjects,
      activeProjects,
      totalGoals,
      completedGoals
    });
  };

  // Функции для проектов
  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectSuccess = () => {
    loadData();
  };

  // Функции для целей
  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleGoalSuccess = () => {
    loadData();
  };

  // Функции для удаления
  const handleDeleteClick = (item, type) => {
    setDeletingItem({ ...item, type });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    
    setIsDeleting(true);
    try {
      let result;
      if (deletingItem.type === 'project') {
        result = await deleteProject(deletingItem.id);
        if (result.success) {
          setProjects(projects.filter(project => project.id !== deletingItem.id));
        }
      } else if (deletingItem.type === 'goal') {
        result = await deleteGoal(deletingItem.id);
        if (result.success) {
          setGoals(goals.filter(goal => goal.id !== deletingItem.id));
        }
      }

      if (result && !result.success) {
        alert(result.error);
      }
      
      handleCloseDeleteModal();
    } catch (error) {
      alert("Ошибка при удалении");
      handleCloseDeleteModal();
    }
  };

  // Функция для завершения цели
  const handleCompleteGoal = async (goal) => {
    try {
      const result = await completeGoal(goal.id);
      if (result.success) {
        setGoals(goals.map(g => g.id === goal.id ? { ...g, isCompleted: true, completedAt: new Date() } : g));
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при завершении цели");
    }
  };

  // Преобразование данных для таблицы проектов
  const getProjectsTableData = () => {
    return projects.map(project => [
      <div key={project.id} className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{project.title}</div>
          <div className="text-sm text-gray-500">{project.description || "Нет описания"}</div>
        </div>
      </div>,
      <div key={`${project.id}-user`} className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">{project.user?.username || project.user?.email}</span>
      </div>,
      <div key={`${project.id}-skills`} className="flex items-center space-x-2">
        <Code className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">{project._count?.skills || 0} навыков</span>
      </div>,
      <StatusBadge 
        key={`${project.id}-status`} 
        status={project.status} 
        variant={
          project.status === 'COMPLETED' ? 'success' : 
          project.status === 'IN_PROGRESS' ? 'warning' : 
          project.status === 'PLANNED' ? 'info' : 'error'
        } 
      />,
      <div key={`${project.id}-dates`} className="text-sm text-gray-600">
        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Не начат'}
      </div>,
      <ActionButton
        key={`${project.id}-actions`}
        actions={[
          {
            type: "edit",
            onClick: () => handleEditProject(project),
          },
          {
            type: "view",
            onClick: () => console.log("Просмотр проекта", project.title),
          },
          {
            type: "delete",
            onClick: () => handleDeleteClick(project, 'project'),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  // Преобразование данных для таблицы целей
  const getGoalsTableData = () => {
    return goals.map(goal => [
      <div key={goal.id} className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          goal.isCompleted 
            ? 'bg-gradient-to-br from-green-400 to-green-600' 
            : 'bg-gradient-to-br from-amber-400 to-amber-600'
        }`}>
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{goal.title}</div>
          <div className="text-sm text-gray-500">{goal.description || "Нет описания"}</div>
        </div>
      </div>,
      <div key={`${goal.id}-user`} className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">{goal.user?.username || goal.user?.email}</span>
      </div>,
      <div key={`${goal.id}-skill`} className="text-gray-700">
        {goal.skill?.name || 'Нет навыка'}
      </div>,
      <div key={`${goal.id}-status`} className="flex items-center">
        {goal.isCompleted ? (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Завершена</span>
          </div>
        ) : new Date(goal.targetDate) < new Date() ? (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Просрочена</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Активна</span>
          </div>
        )}
      </div>,
      <div key={`${goal.id}-date`} className="text-sm text-gray-600">
        {new Date(goal.targetDate).toLocaleDateString()}
      </div>,
      <ActionButton
        key={`${goal.id}-actions`}
        actions={[
          {
            type: "edit",
            onClick: () => handleEditGoal(goal),
          },
          ...(goal.isCompleted ? [] : [{
            type: "complete",
            onClick: () => handleCompleteGoal(goal),
          }]),
          {
            type: "view",
            onClick: () => console.log("Просмотр цели", goal.title),
          },
          {
            type: "delete",
            onClick: () => handleDeleteClick(goal, 'goal'),
          },
        ]}
        variant="default"
        size="sm"
      />,
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
      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {projects.length} из {projects.length} проектов
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск проектов..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Проект",
                "Пользователь",
                "Навыки",
                "Статус",
                "Дата начала",
                "Действия",
              ]}
              data={getProjectsTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {goals.length} из {goals.length} целей
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск целей..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={completion}
                  onChange={(e) => setCompletion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {completionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Цель",
                "Пользователь",
                "Навык",
                "Статус",
                "Целевая дата",
                "Действия",
              ]}
              data={getGoalsTableData()}
              striped={true}
              hover={true}
            />
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
            <Target className="w-8 h-8 mr-3" />
            Проекты и цели
          </h1>
          <p className="text-gray-600 mt-1">
            Управление проектами и целями пользователей
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === "projects" && (
            <ActionButton
              type="add"
              onClick={handleAddProject}
              variant="solid"
              size="md"
              showLabels={true}
            >
              Добавить проект
            </ActionButton>
          )}
          {activeTab === "goals" && (
            <ActionButton
              type="add"
              onClick={handleAddGoal}
              variant="solid"
              size="md"
              showLabels={true}
            >
              Добавить цель
            </ActionButton>
          )}
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего проектов"
          value={stats.totalProjects.toString()}
          subtitle="Всего проектов"
          icon={<Briefcase className="w-6 h-6" />}
          color="blue"
          trend={{ isPositive: true, value: "5" }}
        />
        <StatCard
          title="Активные проекты"
          value={stats.activeProjects.toString()}
          subtitle="Активные проекты"
          icon={<Code className="w-6 h-6" />}
          color="green"
          trend={{ isPositive: true, value: "3" }}
        />
        <StatCard
          title="Всего целей"
          value={stats.totalGoals.toString()}
          subtitle="Всего целей"
          icon={<Target className="w-6 h-6" />}
          color="amber"
          trend={{ isPositive: true, value: "12" }}
        />
        <StatCard
          title="Завершенные цели"
          value={stats.completedGoals.toString()}
          subtitle="Завершенные цели"
          icon={<CheckCircle className="w-6 h-6" />}
          color="purple"
          trend={{ isPositive: true, value: "8" }}
        />
      </div>

      {/* Основной контент с табами */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Навигация табами */}
        <Tabs tabs={tabs} defaultTab="projects" onTabChange={setActiveTab} />

        {/* Контент табов */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Модальные окна */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        project={editingProject}
        onSuccess={handleProjectSuccess}
        skills={skills}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={handleCloseGoalModal}
        goal={editingGoal}
        onSuccess={handleGoalSuccess}
        skills={skills}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={`Удаление ${deletingItem?.type === 'project' ? 'проекта' : 'цели'}`}
        message={`Вы уверены, что хотите удалить ${deletingItem?.type === 'project' ? 'проект' : 'цель'} "${deletingItem?.title}"? Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}