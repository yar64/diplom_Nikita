// components/courses/CourseFilter.jsx
import { Star } from 'lucide-react'

export default function CourseFilter({ filters, onFilterChange }) {
    const categories = [
        'Программирование',
        'Дизайн',
        'Data Science',
        'Маркетинг',
        'Бизнес',
        'Языки',
        'Музыка',
        'Фотография',
    ]

    return (
        <div className="space-y-6">
            {/* Рейтинг */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Рейтинг</h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2].map(rating => (
                        <label key={rating} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.rating === rating}
                                onChange={() => onFilterChange('rating', rating)}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${filters.rating === rating ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
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
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Количество глав */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Количество глав</h3>
                <div className="space-y-2">
                    {[
                        { label: '1-10', value: 10 },
                        { label: '10-15', value: 15 },
                        { label: '15-20', value: 20 },
                        { label: '20-25', value: 25 },
                    ].map(range => (
                        <label key={range.value} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.chapters === range.value}
                                onChange={() => onFilterChange('chapters', range.value)}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${filters.chapters === range.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {filters.chapters === range.value && (
                                    <div className="w-2 h-2 bg-white rounded"></div>
                                )}
                            </div>
                            <span className="text-gray-700">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Цена */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Цена</h3>
                <div className="space-y-2">
                    {[
                        { label: 'Бесплатно', value: 'free' },
                        { label: 'До 5 000 ₽', value: '5000' },
                        { label: '5 000 - 10 000 ₽', value: '10000' },
                        { label: 'Более 10 000 ₽', value: '10000+' },
                    ].map(price => (
                        <label key={price.value} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.price === price.value}
                                onChange={() => onFilterChange('price', price.value)}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${filters.price === price.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {filters.price === price.value && (
                                    <div className="w-2 h-2 bg-white rounded"></div>
                                )}
                            </div>
                            <span className="text-gray-700">{price.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Категории */}
            <div>
                <h3 className="font-semibold mb-3 text-gray-800">Категории</h3>
                <div className="space-y-2">
                    {categories.map(category => (
                        <label key={category} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.category === category}
                                onChange={() => onFilterChange('category', category)}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-2 ${filters.category === category ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {filters.category === category && (
                                    <div className="w-2 h-2 bg-white rounded"></div>
                                )}
                            </div>
                            <span className="text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}