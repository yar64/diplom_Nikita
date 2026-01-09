'use client';

import { CheckCircle } from 'lucide-react';

export default function InstructorExpertise({ expertise }) {
    const expertiseAreas = [
        'Дизайн пользовательского опыта (UX)',
        'Дизайн пользовательского интерфейса (UI)',
        'Информационная архитектура',
        'Дизайн взаимодействия',
        'Визуальный дизайн',
        'Юзабилити-тестирование',
        'Вайрфрейминг и прототипирование',
        'Дизайн-мышление',
        'Фронтенд-разработка',
        'Адаптивный дизайн'
    ];

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-light-text-primary mb-4">Области экспертизы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {expertiseAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-light-green-500 flex-shrink-0" />
                        <span className="text-light-text-primary">{area}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}