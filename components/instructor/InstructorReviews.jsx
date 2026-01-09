'use client';

import { Star, User, Calendar } from 'lucide-react';
import { useState } from 'react';

// Моковые данные внутри компонента
const DEFAULT_REVIEWS = [
    {
        id: '1',
        rating: 5,
        comment: 'Отличный преподаватель! Объясняет сложные темы очень доступно. Рекомендую всем, кто хочет разобраться в теме.',
        createdAt: '2024-12-15',
        student: {
            name: 'Анна Иванова',
            avatar: null
        },
        course: {
            title: 'Основы программирования'
        }
    },
    {
        id: '2',
        rating: 4.5,
        comment: 'Хороший курс, много практических заданий. Иногда хотелось бы более подробных объяснений некоторых моментов.',
        createdAt: '2024-12-10',
        student: {
            name: 'Петр Сидоров',
            avatar: null
        },
        course: {
            title: 'Продвинутый JavaScript'
        }
    }
];



export default function InstructorReviews({ reviews: propReviews, instructorName }) {
    // Используем переданные отзывы или дефолтные
    const reviews = propReviews && propReviews.length > 0 ? propReviews : DEFAULT_REVIEWS;
    const [visibleReviews, setVisibleReviews] = useState(3);

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-light-card rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-light-text-primary">Отзывы студентов</h2>
                    <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-light-amber-500 fill-current" />
                        <span className="text-lg font-bold text-light-text-primary">5.0</span>
                        <span className="text-sm text-light-text-muted">(0 отзывов)</span>
                    </div>
                </div>
                <div className="text-center py-8">
                    <Star className="w-12 h-12 text-light-border mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-light-text-primary mb-2">Пока нет отзывов</h3>
                    <p className="text-light-text-secondary">Будьте первым, кто оставит отзыв о {instructorName || 'преподавателе'}</p>
                </div>
            </div>
        );
    }

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => Math.round(r.rating) === stars).length,
        percentage: (reviews.filter(r => Math.round(r.rating) === stars).length / reviews.length) * 100
    }));

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            {/* Заголовок и общий рейтинг */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-light-text-primary">Отзывы студентов</h2>
                    <p className="text-light-text-secondary mt-1">{reviews.length} отзывов</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-light-text-primary">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-light-amber-500 fill-current' : 'text-light-border'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Распределение рейтингов */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-light-text-primary mb-3">Распределение оценок</h3>
                <div className="space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center">
                            <div className="flex items-center w-16">
                                <span className="text-sm text-light-text-secondary w-4">{stars}</span>
                                <Star className="w-4 h-4 text-light-amber-500 fill-current ml-1" />
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="h-2 bg-light-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-light-amber-500 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-sm text-light-text-secondary ml-4 w-12 text-right">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Список отзывов */}
            <div className="space-y-6">
                <h3 className="text-sm font-semibold text-light-text-primary mb-2">Последние отзывы</h3>
                {reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.id} className="border-b border-light-border pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-light-accent flex items-center justify-center">
                                    {review.student?.avatar ? (
                                        <img
                                            src={review.student.avatar}
                                            alt={review.student.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-light-text-secondary" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-light-text-primary">
                                        {review.student?.name || 'Анонимный студент'}
                                    </h4>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-light-amber-500 fill-current' : 'text-light-border'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-light-text-muted">{review.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            {review.createdAt && (
                                <div className="flex items-center space-x-1 text-light-text-muted text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-light-text-secondary whitespace-pre-line">{review.comment}</p>
                        {review.course && (
                            <div className="mt-3 inline-flex items-center px-3 py-1 bg-light-blue-100 text-light-blue-700 text-sm rounded-full">
                                Курс: {review.course.title}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Кнопка "Показать больше" */}
            {reviews.length > visibleReviews && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setVisibleReviews(prev => prev + 3)}
                        className="px-6 py-2 bg-light-accent text-light-text-primary font-medium rounded-lg hover:bg-light-border transition-colors"
                    >
                        Показать еще {Math.min(3, reviews.length - visibleReviews)} отзывов
                    </button>
                </div>
            )}
        </div>
    );
}