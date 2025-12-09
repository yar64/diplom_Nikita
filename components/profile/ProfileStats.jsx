export default function ProfileStats() {
    const stats = [
        { label: 'Пройдено курсов', value: '5', progress: 75, color: 'bg-green-500' },
        { label: 'Часов обучения', value: '128', progress: 66, color: 'bg-blue-500' },
        { label: 'Навыки освоены', value: '12', progress: 50, color: 'bg-purple-500' },
    ];

    return (
        <div className="p-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Статистика</h3>
            <div className="space-y-3">
                {stats.map((stat, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{stat.label}</span>
                            <span className="font-medium">{stat.value}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${stat.color}`}
                                style={{ width: `${stat.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}