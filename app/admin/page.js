import { StatCard } from "../../components/admin/ui/data-display/StatCard";
import { Table } from "../../components/admin/share/Table";
import { ChartContainer } from "../../components/admin/layout/ChartContainer";
import { StudyActivityChart } from "../../components/admin/charts/StudyActivityChart";
import { UserGrowthChart } from "../../components/admin/charts/UserGrowthChart";
import { SkillDistributionChart } from "../../components/admin/charts/SkillDistributionChart";
import { LearningProgressChart } from "../../components/admin/charts/LearningProgressChart";
import { getDashboardStats } from "../../server/dashboard.actions";

// Фиксированные данные на основе изображения
const fallbackData = {
  totalUsers: 8,
  activeSkills: 18,
  studyHours: 2.2,
  ongoingProjects: 0,
  recentUsers: [
    {
      id: 1,
      firstName: "Иван",
      lastName: "Иванов",
      username: "ivanov",
      email: "ivan@example.com",
      skills: [
        { id: 1, name: "JavaScript" },
        { id: 2, name: "React" }
      ]
    }
  ],
  popularSkills: [
    {
      id: 1,
      name: "JavaScript",
      category: "Программирование",
      userCount: 15,
      difficulty: "Средний"
    },
    {
      id: 2,
      name: "Python",
      category: "Программирование", 
      userCount: 12,
      difficulty: "Начальный"
    }
  ],
  chartData: {
    userGrowth: [
      { month: 'Июнь', users: 0 },
      { month: 'Июль', users: 0 },
      { month: 'Авг', users: 0 },
      { month: 'Сен', users: 0 },
      { month: 'Окт', users: 0 },
      { month: 'Ноя', users: 8 }
    ],
    studyActivity: [
      { date: 'Чт', hours: 0 },
      { date: 'Пт', hours: 0 },
      { date: 'Сб', hours: 0 },
      { date: 'Вс', hours: 0 },
      { date: 'Пн', hours: 0 },
      { date: 'Вт', hours: 2.2 },
      { date: 'Ср', hours: 0 }
    ],
    skillDistribution: [
      { skill: 'Backend', count: 1 },
      { skill: 'Frontend', count: 1 },
      { skill: 'Бизнес', count: 2 },
      { skill: 'Дизайн', count: 2 },
      { skill: 'Кулинария', count: 2 },
      { skill: 'Музыка', count: 2 },
      { skill: 'Программирование', count: 2 },
      { skill: 'Спорт', count: 2 },
      { skill: 'Фотография', count: 2 },
      { skill: 'Языки', count: 2 }
    ]
  }
};

export default async function AdminDashboard() {
  let dashboardData;
  let dataError = false;

  try {
    dashboardData = await getDashboardStats();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    dataError = true;
    dashboardData = fallbackData;
  }

  // Если данных нет, используем fallback
  if (!dashboardData || dataError) {
    dashboardData = fallbackData;
  }

  // Форматируем данные для таблиц
  const recentUsersData = (dashboardData.recentUsers || []).map((user) => [
    <div key={user.id} className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {user.firstName?.[0]}
          {user.lastName?.[0] || user.username?.[0]}
        </span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username}
        </div>
        <div className="text-xs text-gray-500">@{user.username}</div>
      </div>
    </div>,
    user.email,
    <div key={`skills-${user.id}`} className="flex space-x-1">
      {(user.skills || []).slice(0, 2).map((skill) => (
        <span
          key={skill.id}
          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
        >
          {skill.name}
        </span>
      ))}
      {(user.skills || []).length > 2 && (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          +{(user.skills || []).length - 2}
        </span>
      )}
    </div>,
    <span
      key={`status-${user.id}`}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
    >
      Активен
    </span>,
  ]);

  const popularSkillsData = (dashboardData.popularSkills || []).map((skill) => [
    <div key={skill.id} className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {skill.name.substring(0, 2).toUpperCase()}
        </span>
      </div>
      <div>
        <div className="font-semibold text-gray-900">{skill.name}</div>
        <div className="text-xs text-gray-500">{skill.category}</div>
      </div>
    </div>,
    skill.category,
    <div key={`learners-${skill.id}`} className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-white"></div>
        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">+{skill.userCount - 1}</span>
        </div>
      </div>
      <span className="text-emerald-700 font-semibold">{skill.userCount}</span>
    </div>,
    <span
      key={`level-${skill.id}`}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
    >
      {skill.difficulty}
    </span>,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-section="dashboard">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-2">
          Обзор платформы обучения в реальном времени
        </p>
        {dataError && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-700 text-sm">
            Используются демо-данные. Ошибка подключения к серверу.
          </div>
        )}
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Всего пользователей"
          value={dashboardData.totalUsers || 0}
          subtitle="Зарегистрировано"
          icon="👥"
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Активные навыки"
          value={dashboardData.activeSkills || 0}
          subtitle="Изучаются"
          icon="🎯"
          color="green"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Часы обучения"
          value={dashboardData.studyHours || 0}
          subtitle="В этом месяце"
          icon="⏱️"
          color="amber"
          trend={{ value: 15, isPositive: true }}
        />

        <StatCard
          title="Проекты"
          value={dashboardData.ongoingProjects || 0}
          subtitle="В процессе"
          icon="🚀"
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Основной контент - 2 колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-6">
          {/* Таблица недавних пользователей */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Недавние пользователи
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Посмотреть все →
              </button>
            </div>
            {recentUsersData.length > 0 ? (
              <Table
                headers={["Пользователь", "Email", "Навыки", "Статус"]}
                data={recentUsersData}
                striped
                hover
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет данных о пользователях
              </div>
            )}
          </div>

          {/* График роста пользователей */}
          <ChartContainer
            title="Рост пользователей"
            className="shadow-sm border-2 border-gray-100"
          >
            <UserGrowthChart data={dashboardData.chartData?.userGrowth} />
          </ChartContainer>

          {/* График учебной активности */}
          <ChartContainer
            title="Учебная активность"
            className="shadow-sm border-2 border-gray-100"
          >
            <StudyActivityChart data={dashboardData.chartData?.studyActivity} />
          </ChartContainer>
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Таблица популярных навыков */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Популярные навыки
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Посмотреть все →
              </button>
            </div>
            {popularSkillsData.length > 0 ? (
              <Table
                headers={["Навык", "Категория", "Учатся", "Уровень"]}
                data={popularSkillsData}
                striped
                hover
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет данных о навыках
              </div>
            )}
          </div>

          {/* График распределения навыков */}
          <ChartContainer
            title="Распределение навыков"
            className="shadow-sm border-2 border-gray-100"
          >
            <SkillDistributionChart data={dashboardData.chartData?.skillDistribution} />
          </ChartContainer>

          {/* График прогресса обучения */}
          <ChartContainer
            title="Прогресс обучения"
            className="shadow-sm border-2 border-gray-100"
          >
            <LearningProgressChart />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}