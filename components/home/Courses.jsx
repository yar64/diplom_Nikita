// components/home/Courses.jsx
export default function Courses() {
    const courses = [
        {
            title: "Руководство для начинающих по дизайну",
            instructor: "Рональд Ричардс",
            rating: 5,
            ratingsCount: 1200,
            duration: "22 часа",
            lectures: 155,
            level: "Начинающий",
            price: "149.9$"
        },
        {
            title: "Основы веб-разработки",
            instructor: "Анна Иванова",
            rating: 5,
            ratingsCount: 850,
            duration: "35 часов",
            lectures: 210,
            level: "Начинающий",
            price: "199.9$"
        },
        {
            title: "Продвинутый JavaScript",
            instructor: "Максим Петров",
            rating: 5,
            ratingsCount: 650,
            duration: "45 часов",
            lectures: 180,
            level: "Продвинутый",
            price: "249.9$"
        },
        {
            title: "Мобильная разработка",
            instructor: "Елена Смирнова",
            rating: 5,
            ratingsCount: 720,
            duration: "40 часов",
            lectures: 195,
            level: "Средний",
            price: "229.9$"
        },
        {
            title: "Data Science для начинающих",
            instructor: "Дмитрий Козлов",
            rating: 5,
            ratingsCount: 530,
            duration: "50 часов",
            lectures: 220,
            level: "Начинающий",
            price: "279.9$"
        },
        {
            title: "UI/UX дизайн",
            instructor: "Ольга Новикова",
            rating: 5,
            ratingsCount: 890,
            duration: "30 часов",
            lectures: 165,
            level: "Средний",
            price: "189.9$"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Топ курсы</h2>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                        Смотреть все
                    </button>
                </div>

                {/* Сетка курсов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 hover:shadow-lg transition cursor-pointer border border-gray-200 flex flex-col h-full"
                        >
                            {/* Контент карточки (растягивается) */}
                            <div className="flex-grow">
                                {/* Заголовок курса */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
                                    {course.title}
                                </h3>

                                {/* Инструктор */}
                                <p className="text-gray-600 mb-4">
                                    От {course.instructor}
                                </p>

                                {/* Рейтинг */}
                                <div className="flex items-center mb-4">
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(course.rating)}
                                    </div>
                                    <span className="text-gray-600 ml-2">
                                        ({course.ratingsCount} оценок)
                                    </span>
                                </div>

                                {/* Детали курса */}
                                <div className="text-gray-600 mb-6">
                                    <p>{course.duration} • {course.lectures} лекций • {course.level}</p>
                                </div>
                            </div>

                            {/* Цена и кнопка (фиксированы внизу) */}
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                                    Записаться
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}