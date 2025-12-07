// components/course-detail/CourseHeader.jsx
'use client';

import { ChevronRight, Star, Clock, BookOpen, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseHeader() {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Хлебные крошки */}
                <div className="flex items-center text-sm text-light-text-secondary mb-4">
                    <button
                        onClick={() => router.push('/')}
                        className="hover:text-light-blue-600"
                    >
                        Главная
                    </button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <button
                        onClick={() => router.push('/courses')}
                        className="hover:text-light-blue-600"
                    >
                        Категории
                    </button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-light-text-primary font-medium">
                        Введение в дизайн пользовательского опыта
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-light-text-primary mb-6">
                    Введение в дизайн пользовательского опыта
                </h1>

                <p className="text-lg text-light-text-secondary mb-8 max-w-3xl">
                    Этот курс тщательно разработан, чтобы предоставить вам фундаментальное понимание принципов, методологий и инструментов, которые обеспечивают исключительный пользовательский опыт в цифровой среде.
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="font-semibold text-light-text-primary">4.6</span>
                        <span className="text-light-text-secondary">(651,651 оценок)</span>
                    </div>

                    <div className="w-px h-6 bg-light-border hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-light-text-secondary" />
                        <span className="text-light-text-secondary">22 часа всего</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-light-text-secondary" />
                        <span className="text-light-text-secondary">155 лекций</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-light-text-secondary" />
                        <span className="text-light-text-secondary">Все уровни</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-light-text-secondary">Автор:</span>
                    <span className="font-semibold text-light-text-primary">Роналд Ричардс</span>
                </div>

                <div className="flex items-center gap-4 mt-4">
                    <span className="text-light-text-secondary">Языки:</span>
                    <div className="flex flex-wrap gap-2">
                        {['Английский', 'Испанский', 'Итальянский', 'Немецкий'].map((lang) => (
                            <span key={lang} className="px-3 py-1 bg-white border border-light-border rounded-full text-sm">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}