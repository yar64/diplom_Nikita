'use client';

export function SkillDistributionChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { category: 'Frontend', count: 45 },
    { category: 'Backend', count: 35 },
    { category: 'Mobile', count: 15 },
    { category: 'Data Science', count: 25 },
    { category: 'DevOps', count: 10 }
  ];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {chartData.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const circumference = 2 * Math.PI * 40;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const offset = chartData.slice(0, index).reduce((sum, prevItem) => {
              return sum + (prevItem.count / total) * circumference;
            }, 0);

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors[index]}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-offset}
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Skills</div>
          </div>
        </div>
      </div>
      
      <div className="ml-6 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm text-gray-700">{item.category}</span>
            <span className="text-sm text-gray-500">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}