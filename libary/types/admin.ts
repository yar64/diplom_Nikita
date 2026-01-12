export interface TableProps {
  headers: string[];
  data: React.ReactNode[][];
  emptyMessage?: string | React.ReactNode;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  'data-testid'?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'green' | 'blue' | 'amber' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  'data-testid'?: string;
  'data-admin'?: string;
}

export interface TabsProps {
  tabs: {
    id: string;
    label: string;
  }[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  'data-testid'?: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export interface FilterBarProps {
  search: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: {
    key: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  }[];
  className?: string;
  'data-testid'?: string;
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

interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  difficulty: string;
  _count: {
    userSkills: number;
    learningResources: number;
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  milestones: any[];
}

interface StudySession {
  id: string;
  duration: number;
  description: string | null;
  date: Date;
  sessionType: string;
  efficiency: number | null;
  userId: string;
  userSkillId: string;
  userSkill: {
    skill: {
      name: string;
    };
  };
}
