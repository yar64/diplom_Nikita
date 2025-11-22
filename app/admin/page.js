// app/admin/page.jsx
import { StatCard } from '../../components/admin/StatCard';
import { Table } from '../../components/admin/Table';
import { ChartContainer } from '../../components/admin/ChartContainer';

import { StudyActivityChart } from '../../components/admin/charts/StudyActivityChart';
import { ProgressChart } from '../../components/admin/charts/ProgressChart';
import { SkillDistributionChart } from '../../components/admin/charts/SkillDistributionChart';
import { UserGrowthChart } from '../../components/admin/charts/UserGrowthChart';

// Mock data
const statsData = {
  totalUsers: '1,234',
  activeSkills: '567',
  ongoingProjects: '89', 
  studyHours: '2,450',
};

const recentUsers = [
  ['John Doe', 'john@example.com', '12 skills', 'Active'],
  ['Jane Smith', 'jane@example.com', '8 skills', 'Active'],
  ['Mike Johnson', 'mike@example.com', '15 skills', 'Away'],
  ['Sarah Wilson', 'sarah@example.com', '6 skills', 'Active'],
];

const popularSkills = [
  ['React', 'Frontend', '234 learners', 'Advanced'],
  ['Node.js', 'Backend', '189 learners', 'Intermediate'],
  ['Python', 'Data Science', '156 learners', 'Beginner'],
  ['UI/UX Design', 'Design', '142 learners', 'Intermediate'],
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6" data-section="dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={statsData.totalUsers}
          subtitle="Registered users"
          color="blue"
          trend={{ value: 12, isPositive: true }}
          data-testid="total-users-card"
          data-admin="stat-card"
        />
        
        <StatCard
          title="Active Skills"
          value={statsData.activeSkills}
          subtitle="Being learned"
          color="green"
          trend={{ value: 8, isPositive: true }}
          data-testid="active-skills-card"
          data-admin="stat-card"
        />
        
        <StatCard
          title="Ongoing Projects"
          value={statsData.ongoingProjects}
          subtitle="In progress"
          color="purple"
          trend={{ value: 5, isPositive: true }}
          data-testid="projects-card"
          data-admin="stat-card"
        />
        
        <StatCard
          title="Study Hours"
          value={statsData.studyHours}
          subtitle="This month"
          color="amber"
          trend={{ value: 15, isPositive: true }}
          data-testid="study-hours-card"
          data-admin="stat-card"
        />
      </div>

      {/* Main Content - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Recent Users Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            <Table
              headers={['Name', 'Email', 'Skills', 'Status']}
              data={recentUsers}
              data-testid="recent-users-table"
              striped
              hover
            />
          </div>

          {/* Popular Skills Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Skills</h2>
            <Table
              headers={['Skill', 'Category', 'Learners', 'Level']}
              data={popularSkills}
              data-testid="popular-skills-table"
              striped
              hover
            />
          </div>

          {/* User Growth Chart */}
          <ChartContainer title="User Growth" data-testid="user-growth-chart">
            <div className="h-64">
              <UserGrowthChart />
            </div>
          </ChartContainer>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Study Activity Chart */}
          <ChartContainer title="Study Activity" data-testid="activity-chart">
            <div className="h-64">
              <StudyActivityChart />
            </div>
          </ChartContainer>

          {/* Progress Chart */}
          <ChartContainer title="Learning Progress" data-testid="progress-chart">
            <div className="h-64">
              <ProgressChart />
            </div>
          </ChartContainer>

          {/* Skill Distribution Chart */}
          <ChartContainer title="Skill Distribution" data-testid="distribution-chart">
            <div className="h-64">
              <SkillDistributionChart />
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}