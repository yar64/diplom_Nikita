// components/home/Courses.jsx
import { Star, Users, Clock, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getSimpleCourses } from '../../server/course.actions';

export default async function Courses() {
    try {
        // Получаем курсы через Server Action
        const result = await getSimpleCourses();

        // Если нет курсов, показываем заглушку
        if (!result.courses || result.courses.length === 0) {
            return (
                <section className="py-16 bg-light-bg">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-light-text-primary mb-12">Топ курсы</h2>
                        <div className="text-center py-12 bg-white rounded-xl">
                            <p className="text-light-text-secondary">Нет доступных курсов</p>
                        </div>
                    </div>
                </section>
            );
        }

        // Берем только 6 курсов для главной страницы
        const topCourses = result.courses.slice(0, 6).map((course, index) => ({
            id: course.id,
            title: course.title || 'Без названия',
            instructor: course.instructor?.username || 'Не указан',
            rating: course.averageRating || 4.5, // дефолтное значение
            ratingsCount: course.totalStudents || 100, // примерное значение
            studentsCount: course.totalStudents || 0,
            duration: "22 часа", // можно добавить в модель
            lectures: course.totalChapters || 10, // используем chapters как lectures
            level: course.level || 'Начинающий',
            price: course.isFree ? 0 : (course.price || 99.9),
            discountPrice: course.discountPercent
                ? (course.price || 99.9) * (1 - course.discountPercent / 100)
                : null,
            category: course.category || 'Без категории',
            hasCertificate: true // можно добавить в модель
        }));

        const formatPrice = (price) => {
            if (price === 0) return 'Бесплатно';
            return `${price.toLocaleString('ru-RU')} ₽`;
        };

        return (
            <section className="py-16 bg-light-bg">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Заголовок и кнопка */}
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary">Топ курсы</h2>
                        <Link
                            href="/courses"
                            className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition flex items-center gap-2"
                        >
                            Смотреть все
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Сетка курсов */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topCourses.map((course) => (
                            <div
                                key={course.id}
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
                                        <span className="font-semibold ml-1">{course.rating.toFixed(1)}</span>
                                        <span className="text-light-text-secondary text-sm">
                                            ({course.ratingsCount})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-light-text-secondary text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>{course.studentsCount.toLocaleString()}</span>
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
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="bg-light-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-light-blue-600 transition flex items-center gap-2 group/btn"
                                    >
                                        Подробнее
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error loading courses for home page:', error);

        // Fallback: показываем статические данные при ошибке
        return <CoursesFallback />;
    }
}

// Fallback компонент со статическими данными
function CoursesFallback() {
    const courses = [
        // ... твои статические данные из примера
    ];

    const formatPrice = (price) => {
        return `$${price}`;
    };

    return (
        <section className="py-16 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-light-text-primary">Топ курсы</h2>
                    <Link
                        href="/courses"
                        className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition flex items-center gap-2"
                    >
                        Смотреть все
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-light-border flex flex-col h-full group"
                        >
                            {/* ... остальной код из твоего примера ... */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}