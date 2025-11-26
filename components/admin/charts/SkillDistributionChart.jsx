// components/admin/charts/SkillDistributionChart.jsx
'use client';

export function SkillDistributionChart({ data = [] }) {
  // Данные должны быть в формате: [{ skill: string, count: number }]
  const chartData = data.length > 0 ? data : [
    { skill: 'Backend', count: 1 },
    { skill: 'Frontend', count: 1 },
    { skill: 'Бизнес', count: 2 },
    { skill: 'Дизайн', count: 2 },
    { skill: 'Кулинария', count: 2 },
    { skill: 'Музыка', count: 2 },
    { skill: 'Программирование', count: 2 },
    { skill: 'Спорт', count: 2 },
    { skill: 'Фотография', count: 2 },
    { skill: 'Языки', count: 2 }
  ];

  const totalSkills = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Цвета для сегментов диаграммы
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#14B8A6', '#F43F5E', '#8B5CF6', '#06B6D4', '#84CC16'
  ];

  // Рассчитываем параметры для круговой диаграммы
  let currentAngle = 0;
  const segments = chartData.map((item, index) => {
    const percentage = (item.count / totalSkills) * 100;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      angle,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: colors[index % colors.length]
    };
    currentAngle += angle;
    return segment;
  });

  // Функция для расчета координат точки на окружности
  const getCoordinates = (angle, radius) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad)
    };
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6 p-4">
      {/* Круговая диаграмма */}
      <div className="relative w-48 h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => {
            const start = getCoordinates(segment.startAngle, 40);
            const end = getCoordinates(segment.endAngle, 40);
            const largeArcFlag = segment.angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${start.x} ${start.y}`,
              `A 40 40 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
              `Z`
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                title={`${segment.skill}: ${segment.count} (${segment.percentage.toFixed(1)}%)`}
              />
            );
          })}
          
          {/* Центральный круг */}
          <circle cx="50" cy="50" r="20" fill="white" />
        </svg>
        
        {/* Центральная текстовая информация */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{totalSkills}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="flex-1 max-w-xs">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {segments.map((segment, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              title={`${segment.skill}: ${segment.count} (${segment.percentage.toFixed(1)}%)`}
            >
              <div 
                className="w-4 h-4 rounded flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {segment.skill}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${segment.percentage}%`,
                      backgroundColor: segment.color
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
                  {segment.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}