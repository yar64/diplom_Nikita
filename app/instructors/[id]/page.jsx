// app/instructors/[id]/page.jsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import { notFound } from 'next/navigation';
import {
    getInstructorById,
    getInstructorStats,
    getInstructorCourses
} from '../../../server/instructor.actions';
import InstructorHeader from '../../../components/instructor/InstructorHeader';
import InstructorStats from '../../../components/instructor/InstructorStats';
import InstructorAbout from '../../../components/instructor/InstructorAbout';
import InstructorExpertise from '../../../components/instructor/InstructorExpertise';
import InstructorExperience from '../../../components/instructor/InstructorExperience';
import InstructorCourses from '../../../components/instructor/InstructorCourses';
import InstructorProjects from '../../../components/instructor/InstructorProjects';
import InstructorReviews from '../../../components/instructor/InstructorReviews';
import InstructorAchievements from '../../../components/instructor/InstructorAchievements';

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
            averageRating: 0,
            totalLessons: 10
        };

        const coursesData = courses.status === 'fulfilled' ? courses.value : [];

        const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;

        // Заглушки для отзывов и достижений (можно потом заменить на реальные данные)
        // Если будут реальные данные, передаем их в компоненты
        // Если нет - компоненты покажут свои дефолтные данные
        const reviewsData = []; // Здесь будут реальные отзывы из БД
        const achievementsData = []; // Здесь будут реальные достижения из БД

        return (
            <div className="min-h-screen bg-light-bg">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <InstructorHeader instructor={instructor} />

                    {/* Stats */}
                    <div className="my-8">
                        <InstructorStats stats={statsData} />
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <InstructorAbout bio={instructor.bio} />

                            {/* Expertise */}
                            <InstructorExpertise expertise={instructor.expertise} />

                            {/* Experience */}
                            <InstructorExperience instructorId={id} />

                            {/* Projects */}
                            <InstructorProjects projects={instructor.projects} />

                            {/* Achievements */}
                            <InstructorAchievements
                                achievements={achievementsData}
                            />

                            {/* Reviews */}
                            <InstructorReviews
                                reviews={reviewsData}
                                instructorName={fullName}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Courses */}
                            <InstructorCourses
                                courses={coursesData}
                                instructorName={fullName}
                            />

                            {/* Contact Info */}
                            {instructor.email && (
                                <div className="bg-light-card rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-light-text-primary mb-4">Контакты</h2>
                                    <div className="space-y-3">
                                        <a
                                            href={`mailto:${instructor.email}`}
                                            className="flex items-center space-x-3 text-light-blue-500 hover:text-light-blue-600 transition-colors"
                                        >
                                            <span className="text-lg">📧</span>
                                            <span className="text-sm">{instructor.email}</span>
                                        </a>
                                        {instructor.settings?.company && (
                                            <div className="flex items-center space-x-3 text-light-text-secondary">
                                                <span className="text-lg">🏢</span>
                                                <span className="text-sm">{instructor.settings.company}</span>
                                            </div>
                                        )}
                                        {instructor.settings?.location && (
                                            <div className="flex items-center space-x-3 text-light-text-secondary">
                                                <span className="text-lg">📍</span>
                                                <span className="text-sm">{instructor.settings.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
                title: 'Преподаватель не найден',
                description: 'Преподаватель не найден'
            };
        }

        const instructor = await getInstructorById(id);

        if (!instructor) {
            return {
                title: 'Преподаватель не найден',
                description: 'Преподаватель не найден'
            };
        }

        const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;

        return {
            title: `${fullName} - Преподаватель | Skills Tracker`,
            description: instructor.bio || `Обучайтесь у ${fullName}`,
        };
    } catch (error) {
        return {
            title: 'Преподаватель не найден',
            description: 'Преподаватель не найден'
        };
    }
}