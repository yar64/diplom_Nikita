// components/course-detail/CourseReviews.jsx
'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

export default function CourseReviews() {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const ratingDistribution = [
        { stars: 5, percentage: 80 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 },
    ];

    const reviews = [
        {
            rating: 5,
            date: '22 марта 2024',
            text: 'Изначально я был настроен скептически, не имея никакого опыта в дизайне. Но инструктор, Джон Доу, проделал удивительную работу, разбивая сложные концепции на легко усваиваемые модули. Видеолекции были увлекательными, а примеры из реальной жизни действительно помогли закрепить понимание.',
            author: 'Алекс Джонсон',
        },
        {
            rating: 5,
            date: '20 марта 2024',
            text: 'Отличный курс! Контент хорошо структурирован, практические упражнения были очень полезными. Я уже начал применять то, что узнал, в своих текущих проектах.',
            author: 'Сара Миллер',
        },
        {
            rating: 4,
            date: '18 марта 2024',
            text: 'Отличное введение в UX дизайн. Курс охватывает все основы, и инструктор объясняет концепции ясно. Рекомендую новичкам.',
            author: 'Майкл Чен',
        },
    ];

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

    return (
        <div className="bg-white rounded-xl border border-light-border shadow-sm p-6">
            <h2 className="text-2xl font-bold text-light-text-primary mb-6">Отзывы студентов</h2>

            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="lg:w-1/3">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-light-text-primary mb-2">4.6</div>
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <div className="text-light-text-secondary">146,951 отзывов</div>
                    </div>

                    <div className="mt-6 space-y-2">
                        {ratingDistribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-3">
                                <div className="flex items-center w-16">
                                    <span className="text-sm text-light-text-secondary w-4">{item.stars}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-light-text-secondary w-10">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <div className="space-y-6">
                        {displayedReviews.map((review, index) => (
                            <div key={index} className="border-b border-light-border pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-light-text-secondary">Опубликовано {review.date}</span>
                                </div>

                                <p className="text-light-text-secondary mb-3">{review.text}</p>

                                <div className="text-sm text-light-text-primary font-medium">
                                    — {review.author}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="px-6 py-2 border border-light-border rounded-lg text-light-blue-600 hover:bg-light-accent transition"
                        >
                            {showAllReviews ? 'Показать меньше' : 'Показать больше отзывов'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}