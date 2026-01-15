// components/courses/CourseFilter.jsx
'use client'

import { Star, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getHierarchicalCategories, searchCategories } from '../../server/category.actions'

export default function CourseFilter({ filters, onFilterChange }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedCategories, setExpandedCategories] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    // Загружаем категории при монтировании
    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        try {
            setLoading(true)
            const data = await getHierarchicalCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error loading categories:', error)
            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    // Поиск категорий
    async function handleSearch(query) {
        setSearchQuery(query)

        if (!query.trim()) {
            setSearchResults([])
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        try {
            const results = await searchCategories(query)
            setSearchResults(results)
        } catch (error) {
            console.error('Error searching categories:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    // Выбор категории из результатов поиска
    function handleSearchResultClick(categoryId) {
        onFilterChange('category', categoryId)
        setSearchQuery('')
        setSearchResults([])
    }

    // Рендер загрузки
    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h3 className="font-semibold mb-3 text-gray-800 text-lg">Категории</h3>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Категории */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800 text-lg">Категории</h3>

                {/* Поиск */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Поиск категории..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Результаты поиска */}
                {searchResults.length > 0 && (
                    <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                            Результаты поиска:
                        </div>
                        <div className="space-y-1">
                            {searchResults.map(result => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSearchResultClick(result.id)}
                                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex justify-between items-center"
                                >
                                    <span className="text-gray-700">
                                        {result.name}
                                        {result.parentName && (
                                            <span className="text-gray-500 text-xs ml-2">
                                                ({result.parentName})
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {result.coursesCount} курсов
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Список категорий (показываем если не ищем или пустой поиск) */}
                {(!searchQuery || searchResults.length === 0) && (
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                        {categories.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                Категории не найдены
                            </div>
                        ) : (
                            categories.map(category => {
                                const isExpanded = expandedCategories[category.id]
                                const hasChildren = category.children?.length > 0

                                return (
                                    <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
                                        {/* Главная категория */}
                                        <div
                                            className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            onClick={() => hasChildren && setExpandedCategories(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`font-medium ${filters.category === category.id ? 'text-blue-600' : 'text-gray-800'}`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 bg-white px-2 py-0.5 rounded">
                                                    {category.count}
                                                </span>
                                                {hasChildren && (
                                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Подкатегории */}
                                        {hasChildren && isExpanded && (
                                            <div className="bg-white p-3 border-t border-gray-200 space-y-3">
                                                {category.children.map(subCategory => (
                                                    <div key={subCategory.id} className="ml-3">
                                                        <div
                                                            className="flex items-center justify-between p-2.5 rounded hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => onFilterChange('category', subCategory.id)}
                                                        >
                                                            <div>
                                                                <span className={`text-sm ${filters.category === subCategory.id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                                                    {subCategory.name}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                {subCategory.count}
                                                            </span>
                                                        </div>

                                                        {/* Внучатые категории */}
                                                        {subCategory.children?.length > 0 && (
                                                            <div className="ml-6 mt-2 space-y-1.5">
                                                                {subCategory.children.map(child => (
                                                                    <div
                                                                        key={child.id}
                                                                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer text-sm"
                                                                        onClick={() => onFilterChange('category', child.id)}
                                                                    >
                                                                        <span className={`${filters.category === child.id ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                                                            {child.name}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {child.count}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}

                        {/* Кнопка сброса фильтра */}
                        {filters.category && (
                            <button
                                onClick={() => onFilterChange('category', null)}
                                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 py-2 px-3 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                                Сбросить категорию
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Другие фильтры */}
            <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-gray-800 text-lg">Другие фильтры</h3>

                {/* Рейтинг */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">Рейтинг</h4>
                    <div className="space-y-2">
                        {[5, 4, 3].map(rating => (
                            <label key={rating} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.rating === rating}
                                    onChange={() => onFilterChange('rating', rating)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 ${filters.rating === rating ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {filters.rating === rating && (
                                        <div className="w-2 h-2 bg-white rounded"></div>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-700 text-sm">
                                        {rating}+ звезд
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Уровень сложности */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">Уровень</h4>
                    <div className="space-y-2">
                        {[
                            { label: 'Начинающий', value: 'beginner' },
                            { label: 'Средний', value: 'intermediate' },
                            { label: 'Продвинутый', value: 'advanced' }
                        ].map(level => (
                            <label key={level.value} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.level === level.value}
                                    onChange={() => onFilterChange('level', level.value)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 ${filters.level === level.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {filters.level === level.value && (
                                        <div className="w-2 h-2 bg-white rounded"></div>
                                    )}
                                </div>
                                <span className="text-gray-700 text-sm">{level.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Цена */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">Цена</h4>
                    <div className="space-y-2">
                        {[
                            { label: 'Бесплатно', value: 'free' },
                            { label: 'До 5 000 ₽', value: '5000' },
                            { label: '5 000 - 10 000 ₽', value: '5000-10000' },
                            { label: 'Более 10 000 ₽', value: '10000+' },
                        ].map(price => (
                            <label key={price.value} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.price === price.value}
                                    onChange={() => onFilterChange('price', price.value)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 ${filters.price === price.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {filters.price === price.value && (
                                        <div className="w-2 h-2 bg-white rounded"></div>
                                    )}
                                </div>
                                <span className="text-gray-700 text-sm">{price.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Кнопка сброса всех фильтров */}
                {(filters.category || filters.rating || filters.level || filters.price) && (
                    <button
                        onClick={() => {
                            onFilterChange('category', null)
                            onFilterChange('rating', null)
                            onFilterChange('level', null)
                            onFilterChange('price', null)
                            setSearchQuery('')
                            setSearchResults([])
                        }}
                        className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Сбросить все фильтры
                    </button>
                )}
            </div>
        </div>
    )
}