import { StatCard } from "../../components/admin/ui/data-display/StatCard";
import { Table } from "../../components/admin/share/Table";
import { ChartContainer } from "../../components/admin/layout/ChartContainer";
import { StudyActivityChart } from "../../components/admin/charts/StudyActivityChart";
import { UserGrowthChart } from "../../components/admin/charts/UserGrowthChart";
import { SkillDistributionChart } from "../../components/admin/charts/SkillDistributionChart";
import { LearningProgressChart } from "../../components/admin/charts/LearningProgressChart";
import { getDashboardStats } from "../../server/dashboard.actions";

export default async function AdminDashboard() {
  const dashboardData = await getDashboardStats();

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Unavailable
          </h1>
          <p className="text-gray-600">
            Failed to load dashboard data. Please check your database
            connection.
          </p>
        </div>
      </div>
    );
  }

  // Форматируем данные для таблиц на клиенте
  const recentUsersData = dashboardData.recentUsers.map((user) => [
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
      {user.skills.slice(0, 2).map((skill) => (
        <span
          key={skill.id}
          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
        >
          {skill.name}
        </span>
      ))}
      {user.skills.length > 2 && (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          +{user.skills.length - 2}
        </span>
      )}
    </div>,
    <span
      key={`status-${user.id}`}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
    >
      Active
    </span>,
  ]);

  const popularSkillsData = dashboardData.popularSkills.map((skill) => [
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time overview of learning platform
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          subtitle="Registered users"
          icon="👥"
          color="blue"
          trend={{ value: 12, isPositive: true }}
          data-testid="total-users-card"
        />

        <StatCard
          title="Active Skills"
          value={dashboardData.activeSkills}
          subtitle="Being learned"
          icon="🎯"
          color="green"
          trend={{ value: 8, isPositive: true }}
          data-testid="active-skills-card"
        />

        <StatCard
          title="Study Hours"
          value={dashboardData.studyHours}
          subtitle="This month"
          icon="⏱️"
          color="amber"
          trend={{ value: 15, isPositive: true }}
          data-testid="study-hours-card"
        />

        <StatCard
          title="Projects"
          value={dashboardData.ongoingProjects}
          subtitle="In progress"
          icon="🚀"
          color="purple"
          trend={{ value: 5, isPositive: true }}
          data-testid="projects-card"
        />
      </div>

      {/* Main Content - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Users Table */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Users
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </button>
            </div>
            <Table
              headers={["User", "Email", "Skills", "Status"]}
              data={recentUsersData}
              data-testid="recent-users-table"
              striped
              hover
            />
          </div>

          {/* User Growth Chart */}
          <ChartContainer
            title="User Growth"
            className="shadow-sm border-2 border-gray-100"
            data-testid="user-growth-chart"
          >
            <UserGrowthChart data={dashboardData.chartData?.userGrowth} />
          </ChartContainer>

          {/* Study Activity Chart */}
          <ChartContainer
            title="Study Activity"
            className="shadow-sm border-2 border-gray-100"
            data-testid="study-activity-chart"
          >
            <StudyActivityChart data={dashboardData.chartData?.studyActivity} />
          </ChartContainer>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Popular Skills Table */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Popular Skills
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </button>
            </div>
            <Table
              headers={["Skill", "Category", "Learners", "Level"]}
              data={popularSkillsData}
              data-testid="popular-skills-table"
              striped
              hover
            />
          </div>

          {/* Skill Distribution Chart */}
          <ChartContainer
            title="Skill Distribution"
            className="shadow-sm border-2 border-gray-100"
            data-testid="skill-distribution-chart"
          >
            <SkillDistributionChart
              data={dashboardData.chartData?.skillDistribution}
            />
          </ChartContainer>

          {/* Learning Progress Chart */}
          <ChartContainer
            title="Learning Progress"
            className="shadow-sm border-2 border-gray-100"
            data-testid="learning-progress-chart"
          >
            <LearningProgressChart />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
