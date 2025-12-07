// components/course-detail/SimilarCourses.jsx
'use client';

import { Star, Users, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimilarCourses() {
    const router = useRouter();

    const similarCourses = [
        {
            id: 2,
            title: "UI/UX Дизайн: от теории к практике",
            instructor: "Рональд Ричардс",
            rating: 4.8,
            ratingsCount: 850,
            studentsCount: 3200,
            duration: "28 часов",
            lectures: 145,
            level: "Средний",
            price: 179.9,
            discountPrice: 129.9,
            category: "Дизайн"
        },
        {
            id: 3,
            title: "Прототипирование в Figma",
            instructor: "Ольга Новикова",
            rating: 4.9,
            ratingsCount: 720,
            studentsCount: 2900,
            duration: "18 часов",
            lectures: 95,
            level: "Начинающий",
            price: 149.9,
            discountPrice: 99.9,
            category: "Дизайн"
        },
        {
            id: 4,
            title: "Дизайн мобильных приложений",
            instructor: "Елена Смирнова",
            rating: 4.7,
            ratingsCount: 610,
            studentsCount: 2700,
            duration: "35 часов",
            lectures: 180,
            level: "Средний",
            price: 199.9,
            category: "Дизайн"
        },
        {
            id: 5,
            title: "Визуальная коммуникация в дизайне",
            instructor: "Дмитрий Козлов",
            rating: 4.6,
            ratingsCount: 430,
            studentsCount: 1800,
            duration: "25 часов",
            lectures: 120,
            level: "Продвинутый",
            price: 229.9,
            discountPrice: 179.9,
            category: "Дизайн"
        }
    ];

    const handleCourseClick = (id) => {
        router.push(`/courses/${id}`);
    };

    const formatPrice = (price) => {
        return `$${price}`;
    };

    return (
        <section className="py-">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-light-text-primary mb-2">
                            Похожие курсы
                        </h2>
                        <p className="text-light-text-secondary">
                            Изучите другие курсы в этой категории
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/courses')}
                        className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition flex items-center gap-2"
                    >
                        Все курсы
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Сетка похожих курсов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarCourses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)}
                            className="bg-white rounded-xl border border-light-border p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            {/* Категория */}
                            <div className="text-sm text-light-blue-600 font-medium mb-2">
                                {course.category}
                            </div>

                            {/* Заголовок */}
                            <h3 className="font-bold text-light-text-primary mb-3 line-clamp-2 group-hover:text-light-blue-600 transition-colors">
                                {course.title}
                            </h3>

                            {/* Инструктор */}
                            <p className="text-sm text-light-text-secondary mb-3">
                                {course.instructor}
                            </p>

                            {/* Рейтинг */}
                            <div className="flex items-center gap-1 mb-3">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{course.rating}</span>
                                <span className="text-light-text-secondary text-sm">
                                    ({course.ratingsCount})
                                </span>
                            </div>

                            {/* Детали */}
                            <div className="flex flex-wrap gap-2 text-sm text-light-text-secondary mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{course.lectures}</span>
                                </div>
                                <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {course.level}
                                </div>
                            </div>

                            {/* Цена */}
                            <div className="pt-4 border-t border-light-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        {course.discountPrice ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-light-text-primary">
                                                    {formatPrice(course.discountPrice)}
                                                </span>
                                                <span className="text-light-text-secondary text-sm line-through">
                                                    {formatPrice(course.price)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-light-text-primary">
                                                {formatPrice(course.price)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCourseClick(course.id);
                                        }}
                                        className="text-light-blue-600 hover:text-light-blue-700 text-sm font-medium"
                                    >
                                        Подробнее →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}