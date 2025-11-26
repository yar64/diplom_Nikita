// components/admin/charts/StudyActivityChart.jsx
'use client';

export function StudyActivityChart({ data = [] }) {
  // Данные по умолчанию из вашего изображения
  const chartData = data.length > 0 ? data : [
    { date: 'Thu', hours: 0 },
    { date: 'Fri', hours: 0 },
    { date: 'Sat', hours: 0 },
    { date: 'Sun', hours: 0 },
    { date: 'Mon', hours: 0 },
    { date: 'Tue', hours: 2.2 },
    { date: 'Wed', hours: 0 }
  ];

  const maxHours = Math.max(...chartData.map(d => d.hours), 1);
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-2">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div className="text-xs text-gray-600 font-medium">{item.hours}h</div>
          <div 
            className="w-8 bg-gradient-to-t from-green-400 to-green-600 rounded-t transition-all duration-300 hover:from-green-500 hover:to-green-700 cursor-pointer"
            style={{ 
              height: `${(item.hours / maxHours) * 100}%`,
              minHeight: item.hours === 0 ? '2px' : '20px'
            }}
            title={`${item.hours} hours on ${item.date}`}
          />
          <span className="text-xs text-gray-500 font-medium">{item.date}</span>
        </div>
      ))}
    </div>
  );
}