// components/courses/CourseCard.jsx
import { Star, Users, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'

export default function CourseCard({ course }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                {/* Картинка курса */}
                <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                        <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <span className="text-lg font-semibold text-gray-800">{course.category}</span>
                    </div>
                </div>

                {/* Бейдж "Популярный" */}
                {course.isFeatured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Популярный
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Заголовок и рейтинг */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{course.rating}</span>
                            <span className="text-gray-500 text-sm">({course.students})</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatPrice(course.price)}</span>
                    </div>
                </div>

                {/* Описание */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>

                {/* Информация о курсе */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students} студентов</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.chapters} глав</span>
                    </div>
                </div>

                {/* Инструктор и кнопка */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Инструктор</p>
                        <p className="font-medium">{course.instructor}</p>
                    </div>
                    <Link
                        href={`/courses/${course.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    )
}