// types/admin.ts
export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'amber' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface TableProps {
  headers: string[];
  data: (string | number | React.ReactNode)[][];
  emptyMessage?: string;
  className?: string;
}

export interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

// types/dashboard.ts
export interface DashboardStats {
  totalUsers: string;
  activeSkills: string;
  ongoingProjects: string;
  studyHours: string;
}

export interface RecentUser {
  name: string;
  email: string;
  skillsCount: string;
  status: string;
}

export interface PopularSkill {
  name: string;
  category: string;
  learners: string;
  level: string;
}