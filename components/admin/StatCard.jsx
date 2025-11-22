// components/admin/StatCard.jsx


const colorClasses = {
  green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700', 
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
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
  'data-admin': admin,
  ...props 
}) {
  return (
    <div 
      className={`rounded-2xl border p-6 ${colorClasses[color]} ${className || ''}`}
      data-testid={testId}
      data-admin={admin}
      data-variant={color}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
          
          {trend && (
            <div 
              className={`flex items-center mt-2 text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
              data-state={trend.isPositive ? 'positive' : 'negative'}
            >
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span className="ml-1">{trend.value}%</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div 
            className="p-3 bg-white rounded-xl shadow-sm"
            data-icon="stat"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}