'use client';

import { User, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function InstructorsList({ instructors }) {
    if (!instructors || instructors.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Instructors Found</h3>
                <p className="text-gray-500">Check back soon for new instructors!</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                    Showing <span className="font-semibold">{instructors.length}</span> instructors
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
                            className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all border border-gray-200 hover:border-blue-200"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                        {instructor.avatar ? (
                                            <img
                                                src={instructor.avatar}
                                                alt={fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-blue-500" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                        {fullName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {instructor.settings?.occupation || instructor.role}
                                    </p>

                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center space-x-1">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium">
                                                {coursesCount} {coursesCount === 1 ? 'course' : 'courses'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-medium">4.8</span>
                                        </div>
                                    </div>

                                    {instructor.bio && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {instructor.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {instructor.stats?.totalStudents || 0} students
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                                            View Profile →
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