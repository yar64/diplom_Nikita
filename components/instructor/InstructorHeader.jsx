'use client';

import { User, Mail, Globe, Briefcase } from 'lucide-react';

export default function InstructorHeader({ instructor }) {
    if (!instructor) return null;

    const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.username;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {instructor.avatar ? (
                            <img src={instructor.avatar} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-20 h-20 text-blue-500" />
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                            <p className="text-lg text-blue-600 font-medium mt-1">
                                {instructor.settings?.occupation || 'Instructor'}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            {instructor.role === 'ADMIN' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">Admin</span>
                            )}
                            {instructor.role === 'MENTOR' && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Mentor</span>
                            )}
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">Instructor</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 text-gray-600">
                        {instructor.email && (
                            <a href={`mailto:${instructor.email}`} className="flex items-center space-x-2 hover:text-blue-600">
                                <Mail className="w-4 h-4" />
                                <span>{instructor.email}</span>
                            </a>
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

                    {instructor.bio && (
                        <p className="mt-4 text-gray-600 line-clamp-2">
                            {instructor.bio}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Instructor</span>
                        {instructor._count?.authoredCourses > 0 && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                {instructor._count.authoredCourses} курсов
                            </span>
                        )}
                        {instructor.stats?.skillsLearned > 0 && (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                                {instructor.stats.skillsLearned} навыков
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}