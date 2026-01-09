'use client';

import { User, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function InstructorsList({ instructors }) {
    if (!instructors || instructors.length === 0) {
        return (
            <div className="text-center py-16 bg-light-card rounded-2xl shadow-sm">
                <User className="w-16 h-16 text-light-border mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-light-text-primary mb-2">Преподаватели не найдены</h3>
                <p className="text-light-text-secondary">Загляните позже, чтобы увидеть новых преподавателей!</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <div className="text-light-text-secondary">
                    Показано <span className="font-semibold">{instructors.length}</span> преподавателей
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((instructor) => {
                    const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.username;
                    const coursesCount = instructor._count?.authoredCourses || 0;

                    return (
                        <Link
                            key={instructor.id}
                            href={`/instructors/${instructor.id}`}
                            className="block bg-light-card rounded-xl shadow-sm p-6 hover:shadow-lg transition-all border border-light-border hover:border-light-blue-400"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-light-blue-100 to-light-purple-100 flex items-center justify-center overflow-hidden">
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

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-light-text-primary line-clamp-1">
                                        {fullName}
                                    </h3>
                                    <p className="text-sm text-light-text-secondary mb-2">
                                        {instructor.settings?.occupation || instructor.role}
                                    </p>

                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center space-x-1">
                                            <BookOpen className="w-4 h-4 text-light-blue-500" />
                                            <span className="text-sm font-medium">
                                                {coursesCount} {coursesCount === 1 ? 'курс' : 'курсов'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-light-amber-500 fill-light-amber-500" />
                                            <span className="text-sm font-medium">4.8</span>
                                        </div>
                                    </div>

                                    {instructor.bio && (
                                        <p className="text-sm text-light-text-secondary mb-4 line-clamp-2">
                                            {instructor.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-light-text-secondary">
                                            {instructor.stats?.totalStudents || 0} Студентов
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-light-blue-100 text-light-blue-700">
                                            Показать профиль →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}