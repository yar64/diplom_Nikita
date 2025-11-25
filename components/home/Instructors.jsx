// components/home/Instructors.jsx
export default function Instructors() {
    const instructors = [
        {
            name: "Рональд Ричардс",
            specialization: "UI/UX Дизайнер",
            studentsCount: 2400,
            avatar: "👨‍💼"
        },
        {
            name: "Анна Иванова",
            specialization: "Веб-разработчик",
            studentsCount: 1800,
            avatar: "👩‍💻"
        },
        {
            name: "Максим Петров",
            specialization: "JavaScript эксперт",
            studentsCount: 2100,
            avatar: "👨‍🎓"
        },
        {
            name: "Елена Смирнова",
            specialization: "Мобильный разработчик",
            studentsCount: 1600,
            avatar: "👩‍🔬"
        },
        {
            name: "Дмитрий Козлов",
            specialization: "Data Scientist",
            studentsCount: 1400,
            avatar: "👨‍🔧"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Топ инструкторы</h2>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                        Смотреть все
                    </button>
                </div>

                {/* Сетка инструкторов - 5 в ряд */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {instructors.map((instructor, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-md transition cursor-pointer border border-gray-200 text-center"
                        >
                            {/* Аватар */}
                            <div className="text-5xl mb-4">{instructor.avatar}</div>

                            {/* Имя и специализация */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {instructor.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {instructor.specialization}
                            </p>

                            {/* Количество студентов */}
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">
                                    {instructor.studentsCount}
                                </div>
                                <div className="text-sm text-gray-600">Студентов</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}