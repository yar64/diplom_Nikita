// components/home/Categories.jsx
export default function Categories() {
    const categories = [
        {
            name: "Астрология",
            coursesCount: 11,
            icon: "🔮"
        },
        {
            name: "Разработка",
            coursesCount: 12,
            icon: "💻"
        },
        {
            name: "Маркетинг",
            coursesCount: 12,
            icon: "📊"
        },
        {
            name: "Физика",
            coursesCount: 14,
            icon: "⚛️"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Популярные категории</h2>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                        Смотреть все
                    </button>
                </div>

                {/* Сетка категорий */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-md transition cursor-pointer border border-gray-200"
                        >
                            <div className="text-3xl mb-4">{category.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {category.name}
                            </h3>
                            <p className="text-gray-600">
                                {category.coursesCount} курсов
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}