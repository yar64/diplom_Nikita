// components/home/Instructors.jsx
import Link from 'next/link';
import { ArrowRight, User, BookOpen, Star, Code2, Palette, Database, Smartphone, GraduationCap } from 'lucide-react';
import { getAllInstructors } from '../../server/instructor.actions';

// Функция для получения иконки и цвета по специализации
const getInstructorStyle = (occupation) => {
    const lowerOccupation = occupation?.toLowerCase() || '';

    if (lowerOccupation.includes('дизайн') || lowerOccupation.includes('ui/ux')) {
        return {
            icon: Palette,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        };
    }
    if (lowerOccupation.includes('frontend') || lowerOccupation.includes('веб') || lowerOccupation.includes('javascript')) {
        return {
            icon: Code2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        };
    }
    if (lowerOccupation.includes('мобильн') || lowerOccupation.includes('mobile')) {
        return {
            icon: Smartphone,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        };
    }
    if (lowerOccupation.includes('data') || lowerOccupation.includes('аналитик')) {
        return {
            icon: Database,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        };
    }

    // По умолчанию
    return {
        icon: GraduationCap,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100'
    };
};

export default async function Instructors() {
    try {
        // Получаем реальных преподавателей из БД
        const instructors = await getAllInstructors();

        // Берем первых 5 преподавателей (или меньше)
        const displayInstructors = instructors.slice(0, 5);

        return (
            <section className="py-16 bg-light-card">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Заголовок и кнопка - ТОЧНО КАК БЫЛО */}
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary">Топ преподаватели</h2>
                        <Link
                            href="/instructors"
                            className="flex items-center gap-2 text-light-blue-500 font-semibold hover:text-light-blue-600 hover:gap-3 transition-all duration-300 group"
                        >
                            Смотреть все
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Сетка инструкторов - 5 в ряд КАК БЫЛО */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {displayInstructors.map((instructor) => {
                            const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.email;
                            const coursesCount = instructor._count?.authoredCourses || 0;
                            const occupation = instructor.settings?.occupation || 'Преподаватель';

                            // Получаем стиль в зависимости от специализации
                            const { icon: Icon, color, bgColor } = getInstructorStyle(occupation);

                            return (
                                <Link
                                    key={instructor.id}
                                    href={`/instructors/${instructor.id}`}
                                    className="block bg-white rounded-xl p-6 hover:bg-light-accent hover:shadow-lg transition-all duration-300 cursor-pointer border border-light-border text-center group"
                                >
                                    {/* Аватар с иконкой - КАК БЫЛО */}
                                    <div className={`w-20 h-20 rounded-full ${bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300`}>
                                        {instructor.avatar ? (
                                            <img
                                                src={instructor.avatar}
                                                alt={fullName}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <Icon className={`w-10 h-10 ${color}`} />
                                        )}
                                    </div>

                                    {/* Имя и специализация - КАК БЫЛО */}
                                    <h3 className="text-lg font-semibold text-light-text-primary mb-2 group-hover:text-light-blue-600 transition-colors">
                                        {fullName}
                                    </h3>
                                    <p className="text-light-text-secondary text-sm mb-4">
                                        {occupation}
                                    </p>

                                    {/* Количество студентов - КАК БЫЛО, но теперь курсы вместо студентов */}
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-light-text-primary group-hover:text-light-blue-600 transition-colors">
                                            {coursesCount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-light-text-secondary">
                                            {coursesCount === 1 ? 'Курс' :
                                                coursesCount < 5 ? 'Курса' : 'Курсов'}
                                        </div>
                                    </div>

                                    {/* Рейтинг (если есть) - дополнительно */}
                                    {instructor.rating && (
                                        <div className="flex items-center justify-center mt-2 gap-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-medium">
                                                {instructor.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Если нет преподавателей - показываем заглушку */}
                    {displayInstructors.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Пока нет преподавателей
                            </h3>
                            <p className="text-gray-500">
                                Добавьте преподавателей в админке
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        console.error('Ошибка загрузки преподавателей:', error);

        // Заглушка при ошибке
        return (
            <section className="py-16 bg-light-card">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary">Топ преподаватели</h2>
                        <button className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition">
                            Смотреть все
                        </button>
                    </div>

                    <div className="text-center py-12">
                        <p className="text-gray-500">Не удалось загрузить преподавателей</p>
                    </div>
                </div>
            </section>
        );
    }
}