import { getAllInstructors } from '../../server/instructor.actions';
import { User, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function InstructorsPage() {
    const instructors = await getAllInstructors();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-6">Our Instructors</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Learn from experienced professionals
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {instructors.length === 0 ? (
                    <div className="text-center py-16">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Instructors</h3>
                        <p className="text-gray-500">Add users with role ADMIN or MENTOR</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {instructors.length} Instructors
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {instructors.map((instructor) => {
                                const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;
                                const coursesCount = instructor._count?.authoredCourses || 0;

                                return (
                                    <Link
                                        key={instructor.id}
                                        href={`/instructors/${instructor.id}`}
                                        className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md border border-gray-200"
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                    {instructor.avatar ? (
                                                        <img
                                                            src={instructor.avatar}
                                                            alt={fullName}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <User className="w-8 h-8 text-blue-500" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900">{fullName}</h3>

                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className={`px-2 py-1 text-xs rounded ${instructor.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {instructor.role}
                                                    </span>
                                                    {instructor.settings?.occupation && (
                                                        <span className="text-sm text-gray-600">
                                                            {instructor.settings.occupation}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center space-x-4 mt-4">
                                                    <div className="flex items-center space-x-1">
                                                        <BookOpen className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm font-medium">
                                                            {coursesCount} {coursesCount === 1 ? 'course' : 'courses'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-amber-500" />
                                                        <span className="text-sm font-medium">4.8</span>
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                {instructor.bio && (
                                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                        {instructor.bio}
                                                    </p>
                                                )}

                                                <div className="mt-4">
                                                    <span className="text-sm font-medium text-blue-600">
                                                        View Profile →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Instructors - Skills Tracker',
    description: 'Browse our expert instructors',
};