'use client';

import { User, Mail, Globe, Briefcase } from 'lucide-react';

export default function InstructorHeader({ instructor }) {
    if (!instructor) return null;

    const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.username;

    return (
        <div className="bg-light-card rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-light-blue-100 to-light-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {instructor.avatar ? (
                            <img src={instructor.avatar} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-20 h-20 text-light-blue-500" />
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-light-text-primary">{fullName}</h1>
                            <p className="text-lg text-light-blue-500 font-medium mt-1">
                                {instructor.settings?.occupation || 'Преподаватель'}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            {instructor.role === 'ADMIN' && (
                                <span className="px-3 py-1 bg-light-blue-100 text-light-blue-800 text-sm font-medium rounded-full">Админ</span>
                            )}
                            {instructor.role === 'MENTOR' && (
                                <span className="px-3 py-1 bg-light-green-100 text-light-green-800 text-sm font-medium rounded-full">Ментор</span>
                            )}
                            <span className="px-3 py-1 bg-light-purple-100 text-light-purple-800 text-sm font-medium rounded-full">Преподаватель</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 text-light-text-secondary">
                        {instructor.email && (
                            <a href={`mailto:${instructor.email}`} className="flex items-center space-x-2 hover:text-light-blue-500">
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
                        <p className="mt-4 text-light-text-secondary line-clamp-2">
                            {instructor.bio}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-light-accent text-light-text-primary text-sm rounded-full">Преподаватель</span>
                        {instructor._count?.authoredCourses > 0 && (
                            <span className="px-3 py-1 bg-light-blue-100 text-light-blue-700 text-sm rounded-full">
                                {instructor._count.authoredCourses} курсов
                            </span>
                        )}
                        {instructor.stats?.skillsLearned > 0 && (
                            <span className="px-3 py-1 bg-light-green-100 text-light-green-700 text-sm rounded-full">
                                {instructor.stats.skillsLearned} навыков
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}