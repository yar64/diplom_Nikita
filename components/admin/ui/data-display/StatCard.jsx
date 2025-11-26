import { 
  Users, 
  Code, 
  Clock, 
  Rocket, 
  BookOpen, 
  TrendingUp,
  Target
} from 'lucide-react';

const iconComponents = {
  '👥': Users,
  '🎯': Code,
  '⏱️': Clock,
  '🚀': Rocket,
  '📖': BookOpen,
  '🔥': TrendingUp,
  '📊': Target
};

const colorClasses = {
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    accent: 'bg-emerald-500',
    trend: 'text-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100', 
    text: 'text-blue-700',
    accent: 'bg-blue-500',
    trend: 'text-blue-600'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    accent: 'bg-amber-500',
    trend: 'text-amber-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-700',
    accent: 'bg-purple-500',
    trend: 'text-purple-600'
  }
};

// Получаем цвет по умолчанию
const getColors = (color) => {
  return colorClasses[color] || colorClasses.blue;
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue', 
  trend,
  className,
  'data-testid': testId,
  ...props 
}) {
  const colors = getColors(color);
  const IconComponent = iconComponents[icon];
  
  return (
    <div 
      className={`rounded-2xl border-2 ${colors.bg} ${colors.border} p-5 relative overflow-hidden ${className || ''}`}
      data-testid={testId}
      {...props}
    >
      {/* Акцентная полоска */}
      <div className={`absolute top-0 left-0 w-1 h-full ${colors.accent}`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold ${colors.text} opacity-90 mb-1`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${colors.text} mb-2`}>
            {value}
          </p>
          
          {trend && (
            <div className={`flex items-center ${colors.trend} text-sm font-medium`}>
              <span className={`inline-flex items-center px-2 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}%
              </span>
            </div>
          )}
          
          {subtitle && (
            <p className={`text-xs ${colors.text} opacity-70 mt-2`}>
              {subtitle}
            </p>
          )}
        </div>
        
        {IconComponent && (
          <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} ml-4`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}