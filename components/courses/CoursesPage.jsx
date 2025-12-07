// components/courses/CoursesPage.jsx
'use client'

import { useState } from 'react'
import { Filter, Star, ChevronDown, Search } from 'lucide-react'
import CourseFilter from './CourseFilter'
import CourseCard from './CourseCard'

export default function CoursesPage() {
    const [filters, setFilters] = useState({
        rating: null,
        chapters: null,
        price: null,
        category: null,
    })

    // Моковые данные для курсов
    const courses = [
        {
            id: 1,
            title: 'React с нуля до PRO',
            description: 'Полный курс по React с хуками, контекстом и Next.js',
            instructor: 'Иван Петров',
            rating: 4.8,
            students: 1250,
            chapters: 15,
            price: 12900,
            category: 'Программирование',
            image: '/course-react.jpg',
            isFeatured: true,
        },
        {
            id: 2,
            title: 'UI/UX Дизайн',
            description: 'Современный дизайн интерфейсов в Figma',
            instructor: 'Анна Смирнова',
            rating: 4.9,
            students: 890,
            chapters: 12,
            price: 9900,
            category: 'Дизайн',
            image: '/course-design.jpg',
            isFeatured: true,
        },
        {
            id: 3,
            title: 'Python для анализа данных',
            description: 'Pandas, NumPy и визуализация данных',
            instructor: 'Дмитрий Козлов',
            rating: 4.7,
            students: 2100,
            chapters: 20,
            price: 14900,
            category: 'Data Science',
            image: '/course-python.jpg',
            isFeatured: false,
        },
        {
            id: 4,
            title: 'React с нуля до PRO',
            description: 'Полный курс по React с хуками, контекстом и Next.js',
            instructor: 'Иван Петров',
            rating: 4.8,
            students: 1250,
            chapters: 15,
            price: 12900,
            category: 'Программирование',
            image: '/course-react.jpg',
            isFeatured: true,
        },
        {
            id: 5,
            title: 'UI/UX Дизайн',
            description: 'Современный дизайн интерфейсов в Figma',
            instructor: 'Анна Смирнова',
            rating: 4.9,
            students: 890,
            chapters: 12,
            price: 9900,
            category: 'Дизайн',
            image: '/course-design.jpg',
            isFeatured: true,
        },
        {
            id: 6,
            title: 'Python для анализа данных',
            description: 'Pandas, NumPy и визуализация данных',
            instructor: 'Дмитрий Козлов',
            rating: 4.7,
            students: 2100,
            chapters: 20,
            price: 14900,
            category: 'Data Science',
            image: '/course-python.jpg',
            isFeatured: false,
        },
        {
            id: 7,
            title: 'Python для анализа данных',
            description: 'Pandas, NumPy и визуализация данных',
            instructor: 'Дмитрий Козлов',
            rating: 4.7,
            students: 2100,
            chapters: 20,
            price: 14900,
            category: 'Data Science',
            image: '/course-python.jpg',
            isFeatured: false,
        },
        // Добавьте больше курсов по аналогии
    ]

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value === prev[filterType] ? null : value
        }))
    }

    const filteredCourses = courses.filter(course => {
        if (filters.rating && course.rating < filters.rating) return false
        if (filters.chapters && course.chapters < filters.chapters) return false
        if (filters.category && course.category !== filters.category) return false
        return true
    })

    return (
        <div className="min-h-screen bg-light-accent">
            {/* Заголовок */}
            <div className="bg-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Все курсы</h1>
                    <p className="text-lg text-blue-100">
                        Найдите идеальный курс для развития ваших навыков
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Левая панель - Фильтры */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Фильтры
                                </h2>
                                <button
                                    onClick={() => setFilters({})}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Сбросить все
                                </button>
                            </div>

                            {/* Компонент фильтра */}
                            <CourseFilter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    {/* Правая панель - Курсы */}
                    <div className="lg:w-3/4">
                        {/* Панель поиска и сортировки */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Поиск курсов..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600">{filteredCourses.length} курсов</span>
                                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                                        <option>Сортировать по</option>
                                        <option>Рейтингу</option>
                                        <option>Цене</option>
                                        <option>Новизне</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Карточки курсов */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {/* Кнопка "Показать еще" */}
                        {filteredCourses.length > 6 && (
                            <div className="text-center mt-8">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition">
                                    Показать еще
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    )
}