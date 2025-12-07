// components/home/Instructors.jsx
import {
    UserCircle,
    User,
    UserCheck,
    UserCog,
    UserPlus,
    GraduationCap,
    Code2,
    Palette,
    Smartphone,
    Database
} from 'lucide-react';

export default function Instructors() {
    const instructors = [
        {
            name: "Рональд Ричардс",
            specialization: "UI/UX Дизайнер",
            studentsCount: 2400,
            icon: Palette, // Иконка для дизайнера
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        },
        {
            name: "Анна Иванова",
            specialization: "Веб-разработчик",
            studentsCount: 1800,
            icon: Code2, // Иконка для веб-разработчика
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            name: "Максим Петров",
            specialization: "JavaScript эксперт",
            studentsCount: 2100,
            icon: GraduationCap, // Иконка для эксперта
            color: "text-amber-600",
            bgColor: "bg-amber-100"
        },
        {
            name: "Елена Смирнова",
            specialization: "Мобильный разработчик",
            studentsCount: 1600,
            icon: Smartphone, // Иконка для мобильного разработчика
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            name: "Дмитрий Козлов",
            specialization: "Data Scientist",
            studentsCount: 1400,
            icon: Database, // Иконка для Data Scientist
            color: "text-red-600",
            bgColor: "bg-red-100"
        }
    ];

    return (
        <section className="py-16 bg-light-card">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-light-text-primary">Топ инструкторы</h2>
                    <button className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition">
                        Смотреть все
                    </button>
                </div>

                {/* Сетка инструкторов - 5 в ряд */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {instructors.map((instructor, index) => {
                        const Icon = instructor.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 hover:bg-light-accent hover:shadow-lg transition-all duration-300 cursor-pointer border border-light-border text-center group"
                            >
                                {/* Аватар с иконкой */}
                                <div className={`w-20 h-20 rounded-full ${instructor.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300`}>
                                    <Icon className={`w-10 h-10 ${instructor.color}`} />
                                </div>

                                {/* Имя и специализация */}
                                <h3 className="text-lg font-semibold text-light-text-primary mb-2 group-hover:text-light-blue-600 transition-colors">
                                    {instructor.name}
                                </h3>
                                <p className="text-light-text-secondary text-sm mb-4">
                                    {instructor.specialization}
                                </p>

                                {/* Количество студентов */}
                                <div className="text-center">
                                    <div className="text-xl font-bold text-light-text-primary group-hover:text-light-blue-600 transition-colors">
                                        {instructor.studentsCount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-light-text-secondary">Студентов</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}