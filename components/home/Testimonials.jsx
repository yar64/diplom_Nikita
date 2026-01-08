// components/home/Testimonials.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startTranslateRef = useRef(0);

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

    // Рассчитываем сколько слайдов можно показывать на текущем экране
    useEffect(() => {
        const updateSlidesToShow = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setSlidesToShow(1);
            } else if (width < 1024) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        };

        updateSlidesToShow();
        window.addEventListener('resize', updateSlidesToShow);
        return () => window.removeEventListener('resize', updateSlidesToShow);
    }, []);

    // Получаем ширину контейнера
    useEffect(() => {
        const updateContainerWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width);
            }
        };

        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);
        return () => window.removeEventListener('resize', updateContainerWidth);
    }, []);

    // Рассчитываем максимальный индекс для слайдов
    const getMaxIndex = () => {
        if (!containerWidth || !wrapperRef.current) return 0;

        const wrapper = wrapperRef.current;
        const totalWidth = wrapper.scrollWidth;
        const visibleWidth = containerWidth;

        if (totalWidth <= visibleWidth) return 0;

        // Ширина одной карточки с gap
        const cardWidth = getCardWidth() + 24;
        const maxTranslate = totalWidth - visibleWidth;
        return Math.ceil(maxTranslate / cardWidth);
    };

    // Получаем ширину карточки в зависимости от количества слайдов
    const getCardWidth = () => {
        if (slidesToShow === 1) {
            return Math.min(500, containerWidth * 0.9);
        } else if (slidesToShow === 2) {
            return 450;
        } else {
            return 500;
        }
    };

    const maxIndex = getMaxIndex();

    // Получаем текущий translate
    const getCurrentTranslate = () => {
        if (!wrapperRef.current) return 0;
        const style = window.getComputedStyle(wrapperRef.current);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return matrix.m41; // translateX значение
    };

    // Переход к слайду
    const goToSlide = (index) => {
        const newIndex = Math.max(0, Math.min(index, maxIndex));
        setCurrentIndex(newIndex);

        if (wrapperRef.current && containerWidth > 0) {
            const wrapper = wrapperRef.current;
            const totalWidth = wrapper.scrollWidth;
            const visibleWidth = containerWidth;

            const maxTranslate = Math.max(0, totalWidth - visibleWidth);
            const translatePercent = maxIndex > 0 ? (newIndex / maxIndex) * maxTranslate : 0;

            wrapper.style.transform = `translateX(-${translatePercent}px)`;
            wrapper.style.transition = 'transform 0.4s ease';
        }
    };

    // Следующий слайд
    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        }
    };

    // Предыдущий слайд
    const prevSlide = () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    };

    // Drag функции - УПРОЩЕННЫЕ
    const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        startTranslateRef.current = getCurrentTranslate();

        if (wrapperRef.current) {
            wrapperRef.current.style.transition = 'none';
        }

        document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || !wrapperRef.current) return;

        const deltaX = e.clientX - startXRef.current;
        const newTranslate = startTranslateRef.current + deltaX;

        // Ограничиваем перемещение
        const wrapper = wrapperRef.current;
        const totalWidth = wrapper.scrollWidth;
        const maxTranslate = Math.max(0, totalWidth - containerWidth);
        const limitedTranslate = Math.max(-maxTranslate, Math.min(0, newTranslate));

        wrapper.style.transform = `translateX(${limitedTranslate}px)`;
    };

    const handleMouseUp = (e) => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;
        document.body.style.cursor = '';

        const deltaX = e.clientX - startXRef.current;
        const cardWidth = getCardWidth() + 24;

        // ВАЖНО: Считаем НА СКОЛЬКО СЛАЙДОВ сдвинули
        // Используем деление на ширину карточки, а не порог 30%
        const slidesMoved = Math.round(deltaX / cardWidth) * -1;

        if (Math.abs(slidesMoved) > 0) {
            const newIndex = currentIndex + slidesMoved;
            const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
            goToSlide(clampedIndex);
        } else {
            // Если сдвиг меньше половины слайда - возвращаем на текущий
            goToSlide(currentIndex);
        }
    };

    // Touch события
    const handleTouchStart = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].clientX;
        startTranslateRef.current = getCurrentTranslate();

        if (wrapperRef.current) {
            wrapperRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current || !wrapperRef.current) return;
        e.preventDefault();

        const deltaX = e.touches[0].clientX - startXRef.current;
        const newTranslate = startTranslateRef.current + deltaX;

        const wrapper = wrapperRef.current;
        const totalWidth = wrapper.scrollWidth;
        const maxTranslate = Math.max(0, totalWidth - containerWidth);
        const limitedTranslate = Math.max(-maxTranslate, Math.min(0, newTranslate));

        wrapper.style.transform = `translateX(${limitedTranslate}px)`;
    };

    const handleTouchEnd = (e) => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;
        const deltaX = e.changedTouches[0].clientX - startXRef.current;
        const cardWidth = getCardWidth() + 24;

        // То же самое для touch
        const slidesMoved = Math.round(deltaX / cardWidth) * -1;

        if (Math.abs(slidesMoved) > 0) {
            const newIndex = currentIndex + slidesMoved;
            const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
            goToSlide(clampedIndex);
        } else {
            goToSlide(currentIndex);
        }
    };

    // Глобальные обработчики
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDraggingRef.current) {
                handleMouseMove(e);
            }
        };

        const handleGlobalMouseUp = (e) => {
            if (isDraggingRef.current) {
                handleMouseUp(e);
            }
        };

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [currentIndex, maxIndex, containerWidth, slidesToShow]);

    // Инициализация
    useEffect(() => {
        if (containerWidth > 0) {
            goToSlide(0);
        }
    }, [containerWidth, slidesToShow]);

    return (
        <section className="py-16 bg-light-bg relative">
            <div className="max-w-7xl mx-auto px-4 relative">
                {/* Заголовок секции */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-light-text-primary mb-4">
                        Что говорят наши студенты
                    </h2>
                    <p className="text-xl text-light-text-secondary">
                        О нас
                    </p>
                </div>

                {/* Контейнер с карточками */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden"
                >
                    {/* Карточки */}
                    <div
                        ref={wrapperRef}
                        className="flex space-x-6 transition-transform duration-400 ease-out"
                        style={{
                            cursor: 'grab'
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={`flex-shrink-0 ${slidesToShow === 1 ? 'w-[calc(100vw-4rem)] max-w-[500px]' :
                                    slidesToShow === 2 ? 'w-[450px]' :
                                        'w-[500px]'
                                    } bg-light-card rounded-xl p-8 shadow-lg border border-light-border`}
                                style={{ userSelect: 'none' }}
                            >
                                {/* Кавычка */}
                                <div className="mb-6">
                                    <Image
                                        src="/quotation_marks.svg"
                                        alt="Кавычки"
                                        width={40}
                                        height={40}
                                        draggable="false"
                                    />
                                </div>

                                {/* Текст отзыва */}
                                <p className="text-lg text-light-text-primary leading-relaxed select-none">
                                    {testimonial.text}
                                </p>

                                {/* Автор с аватаркой */}
                                <div className="border-t border-light-border pt-6 mt-6">
                                    <div className="flex items-center space-x-4 select-none">
                                        {/* Аватарка */}
                                        <div className="relative w-12 h-12">
                                            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                                                <Image
                                                    src="/user_avatar.jpg"
                                                    alt={testimonial.author}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-light-text-primary text-lg">
                                                {testimonial.author}
                                            </div>
                                            <div className="text-light-text-secondary">
                                                {testimonial.position}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Точки индикации */}
                {maxIndex > 0 && (
                    <div className="flex justify-center space-x-3 mt-8">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${index === currentIndex
                                    ? 'bg-blue-600 w-8'
                                    : 'bg-gray-300 w-3 hover:bg-gray-400'
                                    }`}
                                aria-label={`Перейти к позиции ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Инструкция */}
                <div className="text-center mt-4">
                    <p className="text-sm text-light-text-secondary">
                        {maxIndex > 0
                            ? 'Зажмите и перетащите мышкой или используйте стрелки'
                            : 'Все отзывы показаны'
                        }
                    </p>
                </div>
            </div>

            {/* СТРЕЛКИ */}
            {maxIndex > 0 && (
                <>
                    <button
                        onClick={prevSlide}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                        aria-label="Предыдущий слайд"
                        style={{ left: 'calc((100% - min(100%, 80rem)) / 2 - 40px)' }}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition ${currentIndex === maxIndex ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                        aria-label="Следующий слайд"
                        style={{ right: 'calc((100% - min(100%, 80rem)) / 2 - 40px)' }}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </>
            )}
        </section>
    );
}