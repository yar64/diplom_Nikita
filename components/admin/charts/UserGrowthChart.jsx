'use client';

export function UserGrowthChart({ data = [] }) {
  // Если нет данных, используем mock данные
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', users: 850 },
    { month: 'Feb', users: 920 },
    { month: 'Mar', users: 1050 },
    { month: 'Apr', users: 1120 },
    { month: 'May', users: 1240 },
    { month: 'Jun', users: 1340 }
  ];

  const maxUsers = Math.max(...chartData.map(d => d.users));
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-4">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div className="text-xs text-gray-600 font-medium">{item.users}</div>
          <div 
            className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
            style={{ height: `${(item.users / maxUsers) * 80}%` }}
            title={`${item.users} users in ${item.month}`}
          />
          <span className="text-xs text-gray-500">{item.month}</span>
        </div>
      ))}
    </div>
  );
}