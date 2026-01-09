// app/instructors/page.jsx
import { getAllInstructors } from '../../server/instructor.actions';
import InstructorCard from '../../components/instructor/InstructorCard'; // Импорт компонента
import { User } from 'lucide-react';

export default async function InstructorsPage() {
    const instructors = await getAllInstructors();

    return (
        <div className="min-h-screen bg-light-bg">
            {/* Hero секция (без изменений) */}
            <div className="bg-gradient-to-br from-light-blue-500 via-light-purple-500 to-light-emerald-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Наши преподаватели</h1>
                    <p className="text-lg md:text-xl text-light-blue-100 max-w-3xl mx-auto">
                        Учитесь у опытных профессионалов и экспертов индустрии
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {instructors.length === 0 ? (
                    <div className="text-center py-20">
                        <User className="w-20 h-20 text-light-border mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-light-text-primary mb-3">Пока нет преподавателей</h3>
                        <p className="text-light-text-secondary max-w-md mx-auto">
                            В системе еще нет пользователей с ролью администратора или преподавателя.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Заголовок и счетчик */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-light-text-primary mb-2">
                                    Наши эксперты
                                </h2>
                                <p className="text-light-text-secondary">
                                    Профессионалы с практическим опытом
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="bg-light-card rounded-lg px-4 py-3 border border-light-border">
                                    <span className="text-lg font-bold text-light-blue-500">{instructors.length}</span>
                                    <span className="text-light-text-secondary ml-2">
                                        {instructors.length === 1 ? 'преподаватель' :
                                            instructors.length < 5 ? 'преподавателя' : 'преподавателей'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Сетка с использованием компонента InstructorCard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {instructors.map((instructor) => (
                                <InstructorCard
                                    key={instructor.id}
                                    instructor={instructor}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Преподаватели - Skills Tracker',
    description: 'Просмотрите наших экспертов-преподавателей',
};