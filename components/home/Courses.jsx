// components/home/Courses.jsx
'use client';

import { Star, Users, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Courses() {
    const router = useRouter();

    const courses = [
        {
            id: 1,
            title: "Руководство для начинающих по дизайну",
            instructor: "Рональд Ричардс",
            rating: 5,
            ratingsCount: 1200,
            studentsCount: 5400,
            duration: "22 часа",
            lectures: 155,
            level: "Начинающий",
            price: 149.9,
            discountPrice: 99.9,
            category: "Дизайн",
            hasCertificate: true
        },
        {
            id: 2,
            title: "Основы веб-разработки",
            instructor: "Анна Иванова",
            rating: 4.8,
            ratingsCount: 850,
            studentsCount: 3200,
            duration: "35 часов",
            lectures: 210,
            level: "Начинающий",
            price: 199.9,
            discountPrice: 149.9,
            category: "Разработка",
            hasCertificate: true
        },
        {
            id: 3,
            title: "Продвинутый JavaScript",
            instructor: "Максим Петров",
            rating: 4.9,
            ratingsCount: 650,
            studentsCount: 2800,
            duration: "45 часов",
            lectures: 180,
            level: "Продвинутый",
            price: 249.9,
            category: "Разработка",
            hasCertificate: true
        },
        {
            id: 4,
            title: "Мобильная разработка",
            instructor: "Елена Смирнова",
            rating: 4.7,
            ratingsCount: 720,
            studentsCount: 3100,
            duration: "40 часов",
            lectures: 195,
            level: "Средний",
            price: 229.9,
            discountPrice: 179.9,
            category: "Разработка",
            hasCertificate: true
        },
        {
            id: 5,
            title: "Data Science для начинающих",
            instructor: "Дмитрий Козлов",
            rating: 4.6,
            ratingsCount: 530,
            studentsCount: 2100,
            duration: "50 часов",
            lectures: 220,
            level: "Начинающий",
            price: 279.9,
            discountPrice: 199.9,
            category: "Data Science",
            hasCertificate: true
        },
        {
            id: 6,
            title: "UI/UX дизайн",
            instructor: "Ольга Новикова",
            rating: 4.8,
            ratingsCount: 890,
            studentsCount: 3800,
            duration: "30 часов",
            lectures: 165,
            level: "Средний",
            price: 189.9,
            category: "Дизайн",
            hasCertificate: true
        }
    ];

    const handleCourseClick = (id) => {
        router.push(`/courses/${id}`);
    };

    const formatPrice = (price) => {
        return `$${price}`;
    };

    return (
        <section className="py-16 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-light-text-primary">Топ курсы</h2>
                    <button
                        onClick={() => router.push('/courses')}
                        className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition flex items-center gap-2"
                    >
                        Смотреть все
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Сетка курсов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)}
                            className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-light-border flex flex-col h-full group"
                        >

                            {/* Категория */}
                            <div className="text-sm text-light-blue-600 font-medium mb-2">
                                {course.category}
                            </div>

                            {/* Заголовок курса */}
                            <h3 className="text-xl font-bold text-light-text-primary mb-3 line-clamp-2 min-h-[3rem] group-hover:text-light-blue-600 transition-colors">
                                {course.title}
                            </h3>

                            {/* Инструктор */}
                            <p className="text-light-text-secondary mb-4">
                                От <span className="font-medium text-light-text-primary">{course.instructor}</span>
                            </p>

                            {/* Рейтинг и студенты */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold ml-1">{course.rating}</span>
                                    <span className="text-light-text-secondary text-sm">
                                        ({course.ratingsCount})
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-light-text-secondary text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{course.studentsCount}</span>
                                </div>
                            </div>

                            {/* Детали курса */}
                            <div className="flex items-center gap-4 text-light-text-secondary text-sm mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{course.lectures} лекций</span>
                                </div>
                                <div className="bg-light-blue-50 text-light-blue-600 px-2 py-1 rounded text-xs">
                                    {course.level}
                                </div>
                            </div>

                            {/* Цена и кнопка */}
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-light-border">
                                <div>
                                    {course.discountPrice ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-light-text-primary">
                                                {formatPrice(course.discountPrice)}
                                            </span>
                                            <span className="text-light-text-secondary line-through">
                                                {formatPrice(course.price)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-light-text-primary">
                                            {formatPrice(course.price)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCourseClick(course.id);
                                    }}
                                    className="bg-light-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-light-blue-600 transition flex items-center gap-2 group/btn"
                                >
                                    Подробнее
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}