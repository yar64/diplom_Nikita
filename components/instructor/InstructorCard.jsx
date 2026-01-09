'use client';

import { User, Star, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Функция для перевода ролей на русский
const translateRole = (role) => {
    const roleMap = {
        'ADMIN': 'Администратор',
        'MENTOR': 'Преподаватель',
        'USER': 'Пользователь',
        'STUDENT': 'Студент',
    };
    return roleMap[role] || role;
};

// Функция для определения цвета в зависимости от роли
const getRoleColor = (role) => {
    switch (role) {
        case 'ADMIN':
            return 'bg-light-blue-100 text-light-blue-700 border border-light-blue-200';
        case 'MENTOR':
            return 'bg-light-purple-100 text-light-purple-700 border border-light-purple-200';
        case 'USER':
            return 'bg-light-green-100 text-light-green-700 border border-light-green-200';
        default:
            return 'bg-light-gray-300 text-light-text-primary border border-light-border';
    }
};

export default function InstructorCard({ instructor }) {
    if (!instructor) return null;

    const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;
    const coursesCount = instructor._count?.authoredCourses || 0;

    return (
        <Link
            href={`/instructors/${instructor.id}`}
            className="group block bg-light-card rounded-xl shadow-sm hover:shadow-lg border border-light-border p-6 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex flex-col h-full">
                {/* Аватар и имя */}
                <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-light-blue-100 to-light-purple-100 flex items-center justify-center overflow-hidden ring-2 ring-light-border group-hover:ring-light-blue-300 transition-all">
                            {instructor.avatar ? (
                                <img
                                    src={instructor.avatar}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-light-blue-500" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-light-text-primary truncate group-hover:text-light-blue-500 transition-colors">
                            {fullName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleColor(instructor.role)}`}>
                                {translateRole(instructor.role)}
                            </span>
                            {instructor.settings?.occupation && (
                                <span className="text-sm text-light-text-secondary truncate">
                                    {instructor.settings.occupation}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Статистика */}
                <div className="mb-4">
                    <div className="flex items-center justify-between bg-light-accent rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-light-blue-500 flex-shrink-0" />
                            <div>
                                <span className="text-lg font-bold text-light-text-primary">
                                    {coursesCount}
                                </span>
                                <span className="text-sm text-light-text-secondary ml-1">
                                    {coursesCount === 1 ? 'курс' :
                                        coursesCount < 5 ? 'курса' : 'курсов'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-light-amber-500 fill-current flex-shrink-0" />
                            <div>
                                <span className="text-lg font-bold text-light-text-primary">4.8</span>
                                <span className="text-xs text-light-text-muted ml-1">рейтинг</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Биография */}
                {instructor.bio && (
                    <div className="flex-1 mb-4">
                        <p className="text-sm text-light-text-secondary line-clamp-3">
                            {instructor.bio}
                        </p>
                    </div>
                )}

                {/* Кнопка просмотра */}
                <div className="mt-auto pt-4 border-t border-light-border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-light-blue-500 group-hover:text-light-blue-600 transition-colors">
                            Подробнее о преподавателе
                        </span>
                        <ArrowRight className="w-4 h-4 text-light-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}