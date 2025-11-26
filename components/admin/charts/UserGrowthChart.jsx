// components/admin/charts/UserGrowthChart.jsx
'use client';

export function UserGrowthChart({ data = [] }) {
  // Данные по умолчанию из вашего изображения
  const chartData = data.length > 0 ? data : [
    { month: 'Jun', users: 0 },
    { month: 'Jul', users: 0 },
    { month: 'Aug', users: 0 },
    { month: 'Sep', users: 0 },
    { month: 'Oct', users: 0 },
    { month: 'Nov', users: 8 }
  ];

  const maxUsers = Math.max(...chartData.map(d => d.users), 1);
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-2">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div className="text-xs text-gray-600 font-medium">{item.users}</div>
          <div 
            className="w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-700 cursor-pointer"
            style={{ 
              height: `${(item.users / maxUsers) * 100}%`,
              minHeight: item.users === 0 ? '2px' : '20px'
            }}
            title={`${item.users} users in ${item.month}`}
          />
          <span className="text-xs text-gray-500 font-medium">{item.month}</span>
        </div>
      ))}
    </div>
  );
}