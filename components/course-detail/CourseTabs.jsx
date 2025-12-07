// components/course-detail/CourseTabs.jsx
'use client';

import { useState } from 'react';
import { BookOpen, User, ListOrdered, Star, Award } from 'lucide-react';

export default function CourseTabs() {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Описание', icon: BookOpen },
        { id: 'instructor', label: 'Инструктор', icon: User },
        { id: 'syllabus', label: 'Программа', icon: ListOrdered },
        { id: 'reviews', label: 'Отзывы', icon: Star },
    ];

    const syllabus = [
        { title: 'Введение в UX дизайн', lessons: 5, duration: '1 час' },
        { title: 'Основы пользовательского дизайна', lessons: 5, duration: '1 час' },
        { title: 'Элементы пользовательского опыта', lessons: 5, duration: '1 час' },
        { title: 'Принципы визуального дизайна', lessons: 5, duration: '1 час' },
    ];

    return (
        <div className="bg-white rounded-xl border border-light-border shadow-sm p-6 mb-8">
            <div className="flex border-b border-light-border mb-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium text-lg border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? 'border-light-blue-600 text-light-blue-600'
                                    : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'description' && (
                    <div>
                        <h2 className="text-2xl font-bold text-light-text-primary mb-4">Описание курса</h2>
                        <p className="text-light-text-secondary mb-6">
                            Этот интерактивный электронный курс познакомит вас с дизайном пользовательского опыта (UX) —
                            искусством создания продуктов и услуг, которые являются интуитивно понятными, приятными и удобными
                            для пользователей. Получите прочную основу в принципах UX и научитесь применять их в реальных
                            сценариях с помощью увлекательных модулей и интерактивных упражнений.
                        </p>

                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-start gap-3 mb-3">
                                <Award className="w-6 h-6 text-blue-600 mt-1" />
                                <h3 className="text-xl font-bold text-light-text-primary">Сертификация</h3>
                            </div>
                            <p className="text-light-text-secondary">
                                В SkillTracker мы понимаем важность официального признания вашего упорного труда и
                                преданности непрерывному обучению. После успешного завершения наших курсов вы получите
                                престижный сертификат, который не только подтвердит вашу экспертизу, но и откроет новые
                                возможности в выбранной вами области.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'instructor' && (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-bold text-light-text-primary mb-4">Инструктор</h2>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-light-text-primary">Роналд Ричардс</h3>
                                    <p className="text-light-blue-600 font-medium mb-2">UI/UX Дизайнер</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-light-text-secondary">
                                        <span>40,445 отзывов</span>
                                        <span>500 студентов</span>
                                        <span>15 курсов</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-light-text-secondary">
                                С более чем десятилетним опытом работы в индустрии, Роналд приносит в класс богатые
                                практические знания. Он сыграл ключевую роль в разработке пользовательских интерфейсов
                                для известных технологических компаний, обеспечивая бесшовный и увлекательный
                                пользовательский опыт.
                            </p>
                        </div>

                        <div className="md:w-1/3">
                            <div className="bg-gray-50 rounded-xl p-6 border border-light-border">
                                <h4 className="font-bold text-light-text-primary mb-4">Статистика инструктора</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-light-text-secondary">Рейтинг курса</span>
                                            <span className="font-bold">4.8/5</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full w-4/5"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-light-text-secondary">Удовлетворённость студентов</span>
                                            <span className="font-bold">96%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-9/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'syllabus' && (
                    <div>
                        <h2 className="text-2xl font-bold text-light-text-primary mb-6">Программа курса</h2>
                        <div className="space-y-4">
                            {syllabus.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border border-light-border rounded-lg hover:bg-light-accent transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-light-text-primary">{item.title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-light-text-secondary">
                                        <span>{item.lessons} уроков</span>
                                        <span>{item.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <p className="text-light-text-secondary">
                            Здесь будут отображаться отзывы о курсе. Подробные отзывы смотрите в компоненте CourseReviews.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}