'use client';

import Link from 'next/link';
import { Star, Users, BookOpen } from 'lucide-react';

export default function InstructorCourses({ courses, instructorName }) {
    if (!courses || courses.length === 0) {
        return (
            <div className="bg-light-card rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-light-text-primary mb-4">Курсы от {instructorName}</h2>
                <p className="text-light-text-muted text-center py-8">Пока нет опубликованных курсов.</p>
            </div>
        );
    }

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-light-text-primary">Курсы от {instructorName}</h2>
                <span className="text-sm text-light-text-secondary bg-light-accent px-3 py-1 rounded-full">
                    {courses.length} курсов
                </span>
            </div>

            <div className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="block border border-light-border rounded-lg p-4 hover:border-light-blue-400 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-start space-x-4">
                            {course.thumbnailUrl ? (
                                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                                    <img
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-light-blue-100 to-light-blue-100 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-light-blue-500" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-light-text-primary hover:text-light-blue-500 transition-colors line-clamp-1">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-light-text-secondary mt-1 line-clamp-2">
                                    {course.excerpt || course.description || 'Нет описания'}
                                </p>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-light-amber-500 fill-light-amber-500" />
                                            <span className="font-medium">{course.averageRating?.toFixed(1) || '0.0'}</span>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4 text-light-blue-500" />
                                            <span className="text-light-text-secondary">{course.totalStudents?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm font-semibold">
                                        {course.isFree ? (
                                            <span className="text-light-green-600">БЕСПЛАТНО</span>
                                        ) : course.price ? (
                                            <span className="text-light-blue-600">${course.price}</span>
                                        ) : (
                                            <span className="text-light-text-muted">Бесплатно</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {courses.length > 3 && (
                <div className="mt-6 pt-6 border-t border-light-border">
                    <Link
                        href={`/courses?instructor=${instructorName}`}
                        className="flex items-center justify-center gap-2 text-light-blue-500 hover:text-light-blue-600 font-medium text-sm"
                    >
                        Показать все {courses.length} курсов →
                    </Link>
                </div>
            )}
        </div>
    );
}