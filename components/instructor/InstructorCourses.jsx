'use client';

import Link from 'next/link';
import { Star, Users, BookOpen } from 'lucide-react';

export default function InstructorCourses({ courses, instructorName }) {
    if (!courses || courses.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Courses by {instructorName}</h2>
                <p className="text-gray-500 text-center py-8">No courses published yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Courses by {instructorName}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {courses.length} courses
                </span>
            </div>

            <div className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                    <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
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
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-500" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {course.excerpt || course.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="font-medium">{course.averageRating?.toFixed(1) || '0.0'}</span>
                                        </div>

                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-600">{course.totalStudents?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm font-semibold">
                                        {course.isFree ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : course.price ? (
                                            <span className="text-blue-600">${course.price}</span>
                                        ) : (
                                            <span className="text-gray-500">Free</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {courses.length > 3 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                        href={`/courses?instructor=${instructorName}`}
                        className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        View all {courses.length} courses →
                    </Link>
                </div>
            )}
        </div>
    );
}