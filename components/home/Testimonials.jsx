// components/home/Testimonials.jsx
import Image from 'next/image';


export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            text: "Курсы по технологиям от Skills Tracker просто великолепны! Как человек, который всегда стремится быть впереди в быстро развивающемся технологическом мире, я ценю актуальный контент и увлекательные мультимедийные материалы.",
            author: "Джейн Доу",
            position: "Дизайнер"
        },
        {
            id: 2,
            text: "Курсы по технологиям от Skills Tracker просто великолепны! Как человек, который всегда стремится быть впереди в быстро развивающемся технологическом мире, я ценю актуальный контент и увлекательные мультимедийные материалы.",
            author: "Джейн Доу",
            position: "Дизайнер"
        },
        {
            id: 3,
            text: "Курсы по технологиям от Skills Tracker просто великолепны! Как человек, который всегда стремится быть впереди в быстро развивающемся технологическом мире, я ценю актуальный контент и увлекательные мультимедийные материалы.",
            author: "Джейн Доу",
            position: "Дизайнер"
        },
        {
            id: 4,
            text: "Невероятная платформа! Курсы помогли мне сменить профессию и начать карьеру в IT.",
            author: "Алексей Петров",
            position: "Frontend разработчик"
        },
        {
            id: 5,
            text: "Лучшая инвестиция в свое образование. Преподаватели - практики с огромным опытом.",
            author: "Мария Иванова",
            position: "UX/UI дизайнер"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок секции */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Что говорят наши студенты
                    </h2>
                    <p className="text-xl text-gray-600">
                        О нас
                    </p>
                </div>

                {/* Горизонтальный скролл карточек - ШИРОКИЕ КАРТОЧКИ */}
                <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-shrink-0 w-[500px] bg-white rounded-xl p-8 shadow-lg border border-gray-200"
                        >
                            {/* Кавычка */}
                            <div className="mb-6">
                                <Image
                                    src="/quotation_marks.svg"
                                    alt="Кавычки"
                                    width={40}
                                    height={40}
                                />
                            </div>

                            {/* Текст отзыва */}
                            <p className="text-lg text-black  leading-relaxed">
                                {testimonial.text}
                            </p>

                            {/* Автор с аватаркой */}
                            <div className="border-t border-gray-100 pt-2">
                                <div className="flex items-center space-x-4">
                                    {/* Аватарка */}
                                    <Image
                                        src="/user_avatar.jpg" // или путь к твоей фотке профиля
                                        alt={testimonial.author}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-lg">
                                            {testimonial.author}
                                        </div>
                                        <div className="text-gray-600">
                                            {testimonial.position}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Индикаторы прокрутки (точки) */}
                <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.slice(0, 3).map((_, index) => (
                        <button
                            key={index}
                            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}