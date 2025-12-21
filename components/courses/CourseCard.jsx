// components/courses/CourseCard.jsx
'use client';

import { Star, Users, BookOpen, Award, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseCard({ course }) {
    const router = useRouter();

    const formatPrice = (price) => {
        if (!price && price !== 0) return 'Бесплатно';
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCardClick = (e) => {
        if (!e.target.closest('a, button')) {
            router.push(`/courses/${course.id}`);
        }
    };

    const handleDetailsClick = (e) => {
        e.stopPropagation();
        router.push(`/courses/${course.id}`);
    };

    // Рассчитываем цену со скидкой
    const getDiscountedPrice = () => {
        if (!course.price || course.isFree) return null;
        if (course.discountPercent) {
            return course.price * (1 - course.discountPercent / 100);
        }
        return null;
    };

    const discountedPrice = getDiscountedPrice();

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-200 group"
        >
            <div className="relative">
                {/* Картинка курса */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                    {course.thumbnailUrl ? (
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-lg font-semibold text-gray-800">{course.category}</span>
                        </div>
                    )}
                </div>

                {/* Бейдж "Популярный" */}
                {course.isFeatured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Популярный
                    </div>
                )}

                {/* Бейдж скидки */}
                {course.discountPercent && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        -{course.discountPercent}%
                    </div>
                )}

                {/* Бейдж "Бесплатно" */}
                {course.isFree && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Бесплатно
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Заголовок и рейтинг */}
                <div className="mb-4">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold ml-1">{course.rating || 0}</span>
                            <span className="text-gray-500 text-sm">
                                ({course.reviews || course.students || 0})
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            {/* Отображение цены */}
                            {course.isFree ? (
                                <span className="font-bold text-lg text-green-600">
                                    Бесплатно
                                </span>
                            ) : discountedPrice ? (
                                <>
                                    <span className="font-bold text-lg text-red-600">
                                        {formatPrice(discountedPrice)}
                                    </span>
                                    <span className="text-gray-400 text-sm line-through">
                                        {formatPrice(course.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="font-bold text-lg text-blue-600">
                                    {formatPrice(course.price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Описание */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || 'Описание отсутствует'}
                </p>

                {/* Информация о курсе */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{(course.students || 0).toLocaleString()} студентов</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.chapters || 0} глав</span>
                    </div>
                </div>

                {/* Инструктор и кнопка */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Инструктор</p>
                            <p className="font-medium text-sm">{course.instructor || 'Не указан'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDetailsClick}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition group/btn"
                    >
                        Подробнее
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Сертификат бейдж */}
            {course.hasCertificate && (
                <div className="px-6 pb-6">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <Award className="w-4 h-4" />
                        <span>Выдаётся сертификат</span>
                    </div>
                </div>
            )}
        </div>
    );
}