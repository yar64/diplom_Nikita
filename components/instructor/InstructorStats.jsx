'use client';

import { Users, Star, BookOpen, Target, Clock, Award } from 'lucide-react';

export default function InstructorStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Студентов</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">{stats.totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-light-blue-500" />
                </div>
            </div>

            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Отзывов</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">{stats.totalReviews}</p>
                    </div>
                    <Star className="w-8 h-8 text-light-amber-500" />
                </div>
            </div>

            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Курсов</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">{stats.totalCourses}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-light-green-500" />
                </div>
            </div>

            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Рейтинг</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">{stats.averageRating.toFixed(1)}</p>
                    </div>
                    <Target className="w-8 h-8 text-light-purple-500" />
                </div>
            </div>

            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Уроков</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">{stats.totalLessons}</p>
                    </div>
                    <Clock className="w-8 h-8 text-light-indigo-500" />
                </div>
            </div>

            <div className="bg-light-card rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-light-text-secondary">Опыт</p>
                        <p className="text-2xl font-bold text-light-text-primary mt-1">10+ лет</p>
                    </div>
                    <Award className="w-8 h-8 text-light-red-500" />
                </div>
            </div>
        </div>
    );
}