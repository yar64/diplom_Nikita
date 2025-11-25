"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Search, 
  Plus,
  Edit3,
  Eye,
  BarChart3
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { FilterBar } from "../../../components/admin/forms/FilterBar";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";

// Mock data
const mockSkills = [
  [
    <div key="name" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-bold">JS</span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">JavaScript</div>
        <div className="text-sm text-gray-500">Frontend Development</div>
      </div>
    </div>,
    <div key="category" className="text-gray-700">
      Frontend
    </div>,
    <StatusBadge key="diff" status="Intermediate" variant="warning" />,
    <div key="users" className="flex items-center space-x-3">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">+86</span>
        </div>
      </div>
      <span className="text-gray-700 font-medium">89</span>
    </div>,
    <div key="resources" className="text-center">
      <span className="text-blue-600 font-semibold">23</span>
    </div>,
    <div key="actions" className="flex items-center space-x-2">
      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
        <Edit3 className="w-4 h-4 mr-1" />
        Edit
      </button>
      <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
      <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
        <BarChart3 className="w-4 h-4 mr-1" />
        Stats
      </button>
    </div>,
  ],
  [
    <div key="name" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-bold">PY</span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">Python</div>
        <div className="text-sm text-gray-500">Backend Development</div>
      </div>
    </div>,
    <div key="category" className="text-gray-700">
      Backend
    </div>,
    <StatusBadge key="diff" status="Beginner" variant="success" />,
    <div key="users" className="flex items-center space-x-3">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">+73</span>
        </div>
      </div>
      <span className="text-gray-700 font-medium">76</span>
    </div>,
    <div key="resources" className="text-center">
      <span className="text-blue-600 font-semibold">18</span>
    </div>,
    <div key="actions" className="flex items-center space-x-2">
      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
        <Edit3 className="w-4 h-4 mr-1" />
        Edit
      </button>
      <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
      <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
        <BarChart3 className="w-4 h-4 mr-1" />
        Stats
      </button>
    </div>,
  ],
];

const mockLearningPaths = [
  [
    <div key="title" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">🚀</span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">Full Stack Developer</div>
        <div className="text-sm text-gray-500">@alex_ivanov</div>
      </div>
    </div>,
    <div key="skills" className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {["🟢", "🟢", "🟢", "🟢", "⚪"].map((dot, i) => (
          <span key={i}>{dot}</span>
        ))}
      </div>
      <span className="text-sm text-gray-600">5 skills</span>
    </div>,
    <div key="participants" className="text-center">
      <span className="text-gray-700 font-medium">24</span>
    </div>,
    <div key="progress" className="flex items-center space-x-3">
      <div className="w-20 bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: "70%" }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600">70%</span>
    </div>,
    <div key="actions" className="flex items-center space-x-2">
      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
        <Edit3 className="w-4 h-4 mr-1" />
        Edit
      </button>
      <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
    </div>,
  ],
];

const mockStudySessions = [
  [
    <div key="user" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
      <span className="font-medium text-gray-900">@alex_ivanov</span>
    </div>,
    <span key="skill" className="text-gray-700">JavaScript</span>,
    <div key="duration" className="flex items-center space-x-2 text-green-600 font-medium">
      <Clock className="w-4 h-4" />
      <span>2h 30m</span>
    </div>,
    <StatusBadge key="type" status="Theory" variant="info" />,
    <div key="efficiency" className="flex items-center space-x-2">
      <div className="flex">
        {[1, 2, 3, 4].map((star) => (
          <span key={star} className="text-amber-400">⭐</span>
        ))}
        <span className="text-gray-300">⭐</span>
      </div>
      <span className="text-sm font-medium text-gray-600">80%</span>
    </div>,
    <span key="date" className="text-gray-600">15 Dec, 10:30</span>,
  ],
];

const mockResources = [
  [
    <div key="title" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">📚</span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">React Official Docs</div>
        <div className="text-sm text-gray-500">Documentation</div>
      </div>
    </div>,
    <StatusBadge key="type" status="Docs" variant="info" />,
    <span key="skill" className="text-gray-700">React</span>,
    <StatusBadge key="diff" status="Intermediate" variant="warning" />,
    <div key="rating" className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-amber-400">⭐</span>
      ))}
    </div>,
    <div key="views" className="text-center">
      <span className="text-gray-700 font-medium">1.2K</span>
    </div>,
    <div key="actions" className="flex items-center space-x-2">
      <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
        <Edit3 className="w-4 h-4 mr-1" />
        Edit
      </button>
      <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
    </div>,
  ],
];

const tabs = [
  { id: "skills", label: "Skills Management" },
  { id: "paths", label: "Learning Paths" },
  { id: "sessions", label: "Study Sessions" },
  { id: "resources", label: "Resources" },
];

// Filter options
const categoryOptions = [
  { value: "", label: "Все категории" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
];

const sortOptions = [
  { value: "popularity", label: "Популярность" },
  { value: "name", label: "Название" },
];

const periodOptions = [
  { value: "7days", label: "7 дней" },
  { value: "30days", label: "30 дней" },
];

const typeOptions = [
  { value: "", label: "Все типы" },
  { value: "theory", label: "Theory" },
  { value: "practice", label: "Practice" },
];

const difficultyOptions = [
  { value: "", label: "Все сложности" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
];

export default function SkillsLearningPage() {
  const [activeTab, setActiveTab] = useState("skills");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [period, setPeriod] = useState("7days");
  const [sessionType, setSessionType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const renderTabContent = () => {
    switch (activeTab) {
      case "skills":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {mockSkills.length} of {mockSkills.length} skills
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
              data={mockSkills}
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
                Showing {mockLearningPaths.length} of {mockLearningPaths.length} paths
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
              data={mockLearningPaths}
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
                Showing {mockStudySessions.length} of {mockStudySessions.length} sessions
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
              data={mockStudySessions}
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
                Showing {mockResources.length} of {mockResources.length} resources
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

            <Table
              headers={[
                "Ресурс",
                "Тип",
                "Навык",
                "Сложность",
                "Рейтинг",
                "Просмотры",
                "Действия",
              ]}
              data={mockResources}
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
            <BookOpen className="w-8 h-8 mr-3" />
            Skills & Learning
          </h1>
          <p className="text-gray-600 mt-1">
            Управление навыками и обучением
          </p>
        </div>
        <button
          onClick={() => console.log("Add new skill")}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить навык
        </button>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего навыков"
          value="156"
          subtitle="Total skills"
          icon={<BookOpen className="w-6 h-6" />}
          color="blue"
          trend={{ isPositive: true, value: "8" }}
        />
        <StatCard
          title="Активные ученики"
          value="324"
          subtitle="Active learners"
          icon={<Users className="w-6 h-6" />}
          color="green"
          trend={{ isPositive: true, value: "12" }}
        />
        <StatCard
          title="Часы обучения"
          value="2,847"
          subtitle="Study hours"
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          trend={{ isPositive: true, value: "8" }}
        />
        <StatCard
          title="Ресурсы"
          value="847"
          subtitle="Learning resources"
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
    </div>
  );
}