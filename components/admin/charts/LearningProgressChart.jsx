'use client';

export function LearningProgressChart() {
  // Mock данные для прогресса обучения
  const progressData = [
    { skill: 'JavaScript', progress: 75 },
    { skill: 'Python', progress: 60 },
    { skill: 'React', progress: 85 },
    { skill: 'Node.js', progress: 45 },
    { skill: 'TypeScript', progress: 55 }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center space-y-4 px-4">
      {progressData.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-24 text-sm text-gray-600 truncate">{item.skill}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <div className="w-8 text-sm font-medium text-gray-700 text-right">
            {item.progress}%
          </div>
        </div>
      ))}
    </div>
  );
}