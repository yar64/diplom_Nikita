// components/admin/charts/UserGrowthChart.jsx
'use client';

export function UserGrowthChart({ data = [] }) {
  // Если нет данных, показываем сообщение
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">No growth data available</p>
      </div>
    );
  }

  const maxUsers = Math.max(...data.map(d => d.users));
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 bg-blue-500 rounded-t transition-all duration-500"
            style={{ height: `${(item.users / maxUsers) * 80}%` }}
          />
          <span className="text-xs text-gray-500 mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );
}