// app/courses/[id]/page.js
'use client';

import CourseHeader from '../../../components/course-detail/CourseHeader';
import CourseSidebar from '../../../components/course-detail/CourseSidebar';
import CourseTabs from '../../../components/course-detail/CourseTabs';
import CourseReviews from '../../../components/course-detail/CourseReviews';
import Testimonials from '../../../components/home/Testimonials';
import SimilarCourses from '../../../components/course-detail/SimilarCourses';

export default function CourseDetailPage({ params }) {
    const { id } = params;

    return (
        <div className="min-h-screen bg-light-bg">
            <CourseHeader />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-full">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Основной контент */}
                            <div className="lg:w-2/3">
                                <CourseTabs />
                                <CourseReviews />
                            </div>

                            {/* Сайдбар */}
                            <div className="lg:w-1/3">
                                <CourseSidebar />
                            </div>
                        </div>

                        {/* Похожие курсы */}
                        <div className="mt-16">
                            <SimilarCourses />
                        </div>

                        {/* Отзывы студентов */}
                        <div className="mt-16">
                            <Testimonials />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}