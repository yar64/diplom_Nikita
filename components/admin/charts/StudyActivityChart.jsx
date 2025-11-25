'use client';

export function StudyActivityChart({ data = [] }) {
  // Если нет данных, используем mock данные
  const chartData = data.length > 0 ? data : [
    { date: 'Mon', hours: 4.5 },
    { date: 'Tue', hours: 6.7 },
    { date: 'Wed', hours: 8.9 },
    { date: 'Thu', hours: 5.4 },
    { date: 'Fri', hours: 3.2 },
    { date: 'Sat', hours: 7.8 },
    { date: 'Sun', hours: 6.1 }
  ];

  const maxHours = Math.max(...chartData.map(d => d.hours));
  
  return (
    <div className="w-full h-full flex items-end justify-between px-4 pb-4">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div className="text-xs text-gray-600 font-medium">{item.hours}h</div>
          <div 
            className="w-8 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
            style={{ height: `${(item.hours / maxHours) * 80}%` }}
            title={`${item.hours} hours on ${item.date}`}
          />
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
      ))}
    </div>
  );
}