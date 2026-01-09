'use client';

import { Award, Trophy, Star, Target, Zap, Book, Calendar, ExternalLink } from 'lucide-react';

const DEFAULT_ACHIEVEMENTS = [
    {
        id: 1,
        title: 'Лучший преподаватель месяца',
        description: 'Награда за высокий рейтинг и активность',
        type: 'award',
        date: 'Декабрь 2024',
        issuer: 'Skills Tracker',
        completed: true
    },
    {
        id: 2,
        title: 'Сертифицированный специалист',
        description: 'Международная сертификация по разработке',
        type: 'certificate',
        date: 'Ноябрь 2024',
        issuer: 'Professional IT Association',
        completed: true
    }
];



// Типы достижений с соответствующими иконками и цветами
const achievementTypes = {
    certificate: {
        icon: Award,
        color: 'bg-light-blue-100 text-light-blue-600 border-light-blue-200',
        iconColor: 'text-light-blue-500'
    },
    award: {
        icon: Trophy,
        color: 'bg-light-amber-100 text-light-amber-600 border-light-amber-200',
        iconColor: 'text-light-amber-500'
    },
    rating: {
        icon: Star,
        color: 'bg-light-purple-100 text-light-purple-600 border-light-purple-200',
        iconColor: 'text-light-purple-500'
    },
    milestone: {
        icon: Target,
        color: 'bg-light-green-100 text-light-green-600 border-light-green-200',
        iconColor: 'text-light-green-500'
    },
    speed: {
        icon: Zap,
        color: 'bg-light-red-100 text-light-red-600 border-light-red-200',
        iconColor: 'text-light-red-500'
    },
    course: {
        icon: Book,
        color: 'bg-light-emerald-100 text-light-emerald-600 border-light-emerald-200',
        iconColor: 'text-light-emerald-500'
    }
};

export default function InstructorAchievements({ achievements = [] }) {
    // Дефолтные достижения, если нет данных
    const defaultAchievements = [
        {
            id: 1,
            title: 'Лучший преподаватель месяца',
            description: 'Награда за высокий рейтинг и активность',
            type: 'award',
            date: 'Декабрь 2024',
            issuer: 'Skills Tracker',
            icon: '🏆'
        },
        {
            id: 2,
            title: 'Сертифицированный специалист',
            description: 'Международная сертификация по разработке',
            type: 'certificate',
            date: 'Ноябрь 2024',
            issuer: 'Professional IT Association',
            icon: '📜'
        },
        {
            id: 3,
            title: '1000+ студентов',
            description: 'Помог более 1000 студентам освоить навыки',
            type: 'milestone',
            date: 'Октябрь 2024',
            issuer: 'Skills Tracker',
            icon: '🎯'
        },
        {
            id: 4,
            title: 'Рейтинг 4.8+',
            description: 'Стабильно высокий рейтинг от студентов',
            type: 'rating',
            date: '2024 год',
            issuer: 'Студенты',
            icon: '⭐'
        },
        {
            id: 5,
            title: 'Экспресс-курс',
            description: 'Создал самый популярный экспресс-курс',
            type: 'speed',
            date: 'Сентябрь 2024',
            issuer: 'Skills Tracker',
            icon: '⚡'
        },
        {
            id: 6,
            title: 'Автор 10+ курсов',
            description: 'Создал более 10 образовательных курсов',
            type: 'course',
            date: '2024 год',
            issuer: 'Skills Tracker',
            icon: '📚'
        }
    ];

    const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-light-text-primary">Достижения и награды</h2>
                    <p className="text-light-text-secondary mt-1">Признание и профессиональные успехи</p>
                </div>
                <div className="flex items-center space-x-2 text-light-amber-500">
                    <Trophy className="w-6 h-6" />
                    <span className="text-lg font-bold">{displayAchievements.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayAchievements.map((achievement) => {
                    const typeConfig = achievementTypes[achievement.type] || achievementTypes.certificate;
                    const IconComponent = typeConfig.icon;

                    return (
                        <div
                            key={achievement.id}
                            className={`border rounded-xl p-4 ${typeConfig.color} transition-transform hover:-translate-y-1`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${typeConfig.iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-light-text-primary">{achievement.title}</h3>
                                        {achievement.issuer && (
                                            <p className="text-xs text-light-text-muted mt-1">от {achievement.issuer}</p>
                                        )}
                                    </div>
                                </div>
                                {achievement.icon && (
                                    <span className="text-2xl">{achievement.icon}</span>
                                )}
                            </div>

                            <p className="text-sm text-light-text-secondary mb-3">
                                {achievement.description}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-opacity-30">
                                <div className="flex items-center space-x-1 text-sm text-light-text-muted">
                                    <Calendar className="w-4 h-4" />
                                    <span>{achievement.date}</span>
                                </div>
                                {achievement.link && (
                                    <a
                                        href={achievement.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 text-sm text-light-blue-500 hover:text-light-blue-600"
                                    >
                                        <span>Подробнее</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Прогресс-бар достижений (если есть) */}
            {achievements.length > 0 && (
                <div className="mt-8 pt-6 border-t border-light-border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-light-text-primary">Прогресс достижений</h3>
                        <span className="text-sm text-light-text-secondary">
                            {achievements.filter(a => a.completed).length} из {achievements.length}
                        </span>
                    </div>
                    <div className="h-2 bg-light-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-light-blue-500 to-light-purple-500 rounded-full"
                            style={{
                                width: `${(achievements.filter(a => a.completed).length / achievements.length) * 100}%`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Информация при отсутствии достижений */}
            {achievements.length === 0 && (
                <div className="mt-6 pt-6 border-t border-light-border">
                    <p className="text-sm text-light-text-secondary text-center">
                        Это стандартные достижения. Добавьте реальные достижения преподавателя через админ-панель.
                    </p>
                </div>
            )}
        </div>
    );
}