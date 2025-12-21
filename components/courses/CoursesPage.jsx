// components/courses/CoursesPage.jsx - УПРОЩЕННАЯ ВЕРСИЯ
'use client';

import { useState, useEffect } from 'react';
import CourseFilter from './CourseFilter';
import CourseCard from './CourseCard';
import { Filter, Search } from 'lucide-react';

export default function CoursesPageClient({
    initialCourses = [],
    initialCategories = []
}) {
    const [courses] = useState(initialCourses);
    const [filteredCourses, setFilteredCourses] = useState(initialCourses);

    const [filters, setFilters] = useState({
        rating: null,
        chapters: null,
        price: null,
        category: null,
    });

    useEffect(() => {
        filterCourses();
    }, [courses, filters]);

    const filterCourses = () => {
        let filtered = [...courses];

        if (filters.rating && filters.rating > 0) {
            filtered = filtered.filter(course => course.rating >= filters.rating);
        }

        if (filters.category) {
            filtered = filtered.filter(course => course.category === filters.category);
        }

        if (filters.price) {
            switch (filters.price) {
                case 'free':
                    filtered = filtered.filter(course => course.isFree || course.price === 0);
                    break;
                case 'under5000':
                    filtered = filtered.filter(course => course.price > 0 && course.price <= 5000);
                    break;
                case 'over5000':
                    filtered = filtered.filter(course => course.price > 5000);
                    break;
            }
        }

        setFilteredCourses(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value === prev[filterType] ? null : value
        }));
    };

    if (initialCourses.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h2 className="text-xl font-bold">Нет курсов</h2>
                    <p className="text-gray-600">Создайте курсы в админке</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-accent">
            <div className="bg-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">
                        Все курсы ({initialCourses.length})
                    </h1>
                    <p className="text-lg text-blue-100">
                        Через getSimpleCourses() Server Action
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Фильтры */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Фильтры
                                </h2>
                            </div>

                            <CourseFilter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                categories={initialCategories}
                            />
                        </div>
                    </div>

                    {/* Курсы */}
                    <div className="lg:w-3/4">
                        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                            ✅ Используется Server Action: <code>getSimpleCourses()</code>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск курсов..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                    onChange={(e) => {
                                        const search = e.target.value.toLowerCase();
                                        if (search) {
                                            const searched = courses.filter(c =>
                                                c.title.toLowerCase().includes(search) ||
                                                c.description.toLowerCase().includes(search)
                                            );
                                            setFilteredCourses(searched);
                                        } else {
                                            setFilteredCourses(courses);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div className="text-center p-8 mt-8 bg-white rounded-xl">
                                <p className="text-gray-600">Ничего не найдено</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}