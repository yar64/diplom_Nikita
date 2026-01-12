// components/home/Stats.jsx
import {
    Users,
    CheckCircle,
    Award,
    Trophy
} from 'lucide-react';

export default function Stats() {
    const stats = [
        {
            number: "1000+",
            description: "Активных студентов",
            icon: Users,
            iconColor: "text-light-blue-600",
            bgColor: "bg-light-blue-100"
        },
        {
            number: "87,6%",
            description: "Завершение курсов",
            icon: CheckCircle,
            iconColor: "text-light-green-600",
            bgColor: "bg-light-green-100"
        },
        {
            number: "15+",
            description: "Категорий обучения",
            icon: Award,
            iconColor: "text-light-amber-600",
            bgColor: "bg-light-amber-100"
        },
        {
            number: "2400+",
            description: "Успешных историй",
            icon: Trophy,
            iconColor: "text-light-purple-600",
            bgColor: "bg-light-purple-100"
        }
    ];

    return (
        <section className="py-16 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="flex items-center gap-4">
                                {/* Иконка слева */}
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                </div>

                                {/* Текст справа */}
                                <div>
                                    {/* Число */}
                                    <div className="text-4xl lg:text-5xl font-bold text-light-text-primary mb-1">
                                        {stat.number}
                                    </div>

                                    {/* Описание */}
                                    <div className="text-light-text-secondary text-sm leading-tight">
                                        {stat.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}