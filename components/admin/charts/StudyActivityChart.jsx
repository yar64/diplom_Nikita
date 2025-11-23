// components/admin/charts/StudyActivityChart.jsx
'use client';

export function StudyActivityChart({ data = [] }) {
  // Если нет данных, показываем сообщение
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">No activity data available</p>
      </div>
    );
  }

  const maxHours = Math.max(...data.map(d => d.hours));
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-6 bg-green-500 rounded-t transition-all duration-500"
            style={{ height: `${(item.hours / maxHours) * 80}%` }}
          />
          <span className="text-xs text-gray-500 mt-2">{item.date}</span>
        </div>
      ))}
    </div>
  );
}