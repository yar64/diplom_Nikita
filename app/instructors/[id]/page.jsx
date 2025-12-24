import { notFound } from 'next/navigation';
import { getInstructorById, getInstructorStats, getInstructorCourses } from '../../../server/instructor.actions';
import { User, Mail, Globe, Briefcase, Star, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function InstructorPage({ params }) {
    try {
        const { id } = await params;

        console.log('📌 Instructor page ID:', id);

        if (!id || id === 'undefined' || id === 'null') {
            console.error('❌ Invalid ID:', id);
            notFound();
        }

        const instructor = await getInstructorById(id);
        console.log('📌 Instructor found:', !!instructor);

        if (!instructor) {
            console.error('❌ Instructor not found for ID:', id);
            notFound();
        }

        const [stats, courses] = await Promise.allSettled([
            getInstructorStats(id),
            getInstructorCourses(id)
        ]);

        const statsData = stats.status === 'fulfilled' ? stats.value : {
            totalStudents: 0,
            totalReviews: 0,
            totalCourses: 0,
            averageRating: 0
        };

        const coursesData = courses.status === 'fulfilled' ? courses.value : [];

        const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                    {instructor.avatar ? (
                                        <img
                                            src={instructor.avatar}
                                            alt={fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-20 h-20 text-blue-500" />
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                                <p className="text-lg text-blue-600 font-medium mt-1">
                                    {instructor.settings?.occupation || instructor.role}
                                </p>

                                {/* Contact */}
                                <div className="mt-6 flex flex-wrap gap-4 text-gray-600">
                                    {instructor.email && (
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{instructor.email}</span>
                                        </div>
                                    )}
                                    {instructor.settings?.location && (
                                        <div className="flex items-center space-x-2">
                                            <Globe className="w-4 h-4" />
                                            <span>{instructor.settings.location}</span>
                                        </div>
                                    )}
                                    {instructor.settings?.company && (
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{instructor.settings.company}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bio */}
                                {instructor.bio && (
                                    <p className="mt-4 text-gray-600">{instructor.bio}</p>
                                )}

                                {/* Tags */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 text-sm rounded-full ${instructor.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                            instructor.role === 'MENTOR' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {instructor.role}
                                    </span>
                                    {instructor._count?.authoredCourses > 0 && (
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                            {instructor._count.authoredCourses} курсов
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{statsData.totalStudents}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900">{statsData.totalReviews}</p>
                                </div>
                                <Star className="w-8 h-8 text-amber-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Courses</p>
                                    <p className="text-2xl font-bold text-gray-900">{statsData.totalCourses}</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{statsData.averageRating}</p>
                                </div>
                                <Star className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            {instructor.bio && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                    <p className="text-gray-600">{instructor.bio}</p>
                                </div>
                            )}

                            {/* Expertise */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Expertise</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>User Experience (UX) Design</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>User Interface (UI) Design</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Web Development</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Courses */}
                            {coursesData.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Courses</h2>
                                    <div className="space-y-4">
                                        {coursesData.slice(0, 3).map((course) => (
                                            <Link
                                                key={course.id}
                                                href={`/courses/${course.id}`}
                                                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                                {course.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Users className="w-4 h-4" />
                                                        <span>{course._count?.enrollments || 0} students</span>
                                                    </div>
                                                    <span className="text-sm font-semibold">
                                                        {course.isFree ? 'FREE' : `$${course.price || '0'}`}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {coursesData.length > 3 && (
                                        <div className="mt-4 text-center">
                                            <Link
                                                href={`/courses?instructor=${instructor.id}`}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                View all courses →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contact */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                                {instructor.email && (
                                    <a
                                        href={`mailto:${instructor.email}`}
                                        className="flex items-center space-x-3 text-blue-600 hover:text-blue-800"
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span>{instructor.email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('❌ Error in InstructorPage:', error);
        notFound();
    }
}

export async function generateMetadata({ params }) {
    try {
        const { id } = await params;

        if (!id) {
            return {
                title: 'Instructor Not Found',
                description: 'Instructor not found'
            };
        }

        const instructor = await getInstructorById(id);

        if (!instructor) {
            return {
                title: 'Instructor Not Found',
                description: 'Instructor not found'
            };
        }

        const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;

        return {
            title: `${fullName} - Instructor`,
            description: instructor.bio || `Learn from ${fullName}`,
        };
    } catch (error) {
        return {
            title: 'Instructor Not Found',
            description: 'Instructor not found'
        };
    }
}