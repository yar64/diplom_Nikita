'use client';

import { Briefcase, Calendar, Building } from 'lucide-react';

export default function InstructorExperience({ instructorId }) {
    const experiences = [
        {
            company: "Tech Solutions Inc.",
            role: "Старший UX/UI Дизайнер и Преподаватель",
            period: "2018 - Настоящее время",
            description: "Руководил командой дизайнеров для корпоративных приложений и обучал начинающих дизайнеров. Создал более 50 курсов по принципам дизайна."
        },
        {
            company: "Creative Agency Co.",
            role: "Ведущий UI Дизайнер",
            period: "2015 - 2018",
            description: "Разрабатывал интерфейсы для мобильных и веб-приложений, используемых миллионами пользователей. Проводил мастер-классы по дизайну."
        },
        {
            company: "Digital Innovation Lab",
            role: "Продуктовый Дизайнер",
            period: "2013 - 2015",
            description: "Создавал дизайн-системы с нуля для стартап-продуктов. Начал преподавать основы дизайна онлайн."
        }
    ];

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-light-text-primary mb-6">Профессиональный опыт</h2>

            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-light-blue-100 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-light-blue-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-light-text-primary">{exp.role}</h3>
                                <span className="text-sm text-light-text-secondary bg-light-accent px-3 py-1 rounded-full">
                                    {exp.period}
                                </span>
                            </div>

                            <div className="flex items-center mt-1 space-x-2 text-light-text-secondary">
                                <Briefcase className="w-4 h-4" />
                                <span>{exp.company}</span>
                            </div>

                            <p className="mt-2 text-light-text-secondary">{exp.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}