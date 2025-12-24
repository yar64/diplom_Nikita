'use client';

import { Users, Star, BookOpen, Target, Clock, Award } from 'lucide-react';

export default function InstructorStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Students</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Reviews</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalReviews}</p>
                    </div>
                    <Star className="w-8 h-8 text-amber-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Courses</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCourses}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageRating.toFixed(1)}</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Lessons</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLessons}</p>
                    </div>
                    <Clock className="w-8 h-8 text-indigo-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">10+ лет</p>
                    </div>
                    <Award className="w-8 h-8 text-red-500" />
                </div>
            </div>
        </div>
    );
}