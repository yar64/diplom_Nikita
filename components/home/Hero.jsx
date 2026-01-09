// components/home/Hero.jsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Trophy, TrendingUp, Star, CheckCircle } from 'lucide-react';

// Компонент плавающей карточки статистики
const FloatingStatCard = ({ icon: Icon, value, label, description, position, color }) => {
    const positionClasses = {
        'top-left': '-top-6 -left-6',
        'top-right': '-top-6 -right-6',
        'bottom-left': '-bottom-6 -left-6',
        'bottom-right': '-bottom-6 -right-6',
        'center-left': 'top-1/2 -left-6 -translate-y-1/2',
        'center-right': 'top-1/2 -right-6 -translate-y-1/2'
    };

    const colorClasses = {
        'white': 'white',
    };

    return (
        <div
            className={`absolute ${positionClasses[position]} bg-gradient-to-br ${colorClasses[color]} border rounded-2xl shadow-lg p-5 max-w-xs hidden lg:block transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                    <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[0].replace('from-', 'text-')}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{value}</span>
                        {label && <span className="text-sm font-medium opacity-80">{label}</span>}
                    </div>
                    <p className="text-sm mt-2 opacity-90">{description}</p>
                </div>
            </div>
        </div>
    );
};

// Компонент карточки с отзывом
const TestimonialCard = ({ name, role, text, avatar, position }) => {
    const positionClasses = {
        'top-left': '-top-8 -left-8',
        'top-right': '-top-8 -right-8',
        'bottom-left': '-bottom-8 -left-8',
        'bottom-right': '-bottom-8 -right-8'
    };

    return (
        <div
            className={`absolute ${positionClasses[position]} bg-white rounded-2xl shadow-xl p-5 max-w-sm hidden lg:block transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-light-purple-100 to-light-blue-100 rounded-full flex items-center justify-center">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-xl">👤</span>
                    )}
                </div>
                <div>
                    <p className="font-bold text-light-text-primary">{name}</p>
                    <p className="text-xs text-light-text-muted">{role}</p>
                </div>
            </div>
            <p className="text-light-text-secondary italic text-sm leading-relaxed">"{text}"</p>
            <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className="w-4 h-4 text-light-amber-500 fill-current"
                    />
                ))}
            </div>
        </div>
    );
};

export default function Hero() {
    return (
        <section className="bg-gradient-to-b from-white to-light-bg text-black py-16 md:py-24 px-4">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Левая часть - основной контент */}
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-light-text-primary">
                            Раскройте свой потенциал с помощью <span className="text-light-blue-500">Skills Tracker</span>
                        </h1>

                        <p className="text-lg md:text-xl text-light-text-secondary leading-relaxed">
                            Добро пожаловать в Skills Tracker, где обучение не знает границ. Мы верим, что образование - это ключ к личному и профессиональному росту, и мы здесь для того, чтобы помочь вам на пути к успеху.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/profile"
                                className="group bg-gradient-to-r from-light-blue-500 to-light-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-light-blue-200 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                Начни своё обучение
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/courses"
                                className="bg-light-card text-light-text-primary border-2 border-light-border px-8 py-4 rounded-xl font-semibold text-lg hover:bg-light-accent transition-colors"
                            >
                                Смотреть курсы
                            </Link>
                        </div>

                        {/* Мини-статистика в ряд */}
                        <div className="flex flex-wrap gap-6 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-light-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-light-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-2xl text-light-text-primary">1200+</p>
                                    <p className="text-sm text-light-text-muted">Активных студентов</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-light-green-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-light-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-2xl text-light-text-primary">87.6%</p>
                                    <p className="text-sm text-light-text-muted">Завершение курсов</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-light-amber-100 rounded-xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-light-amber-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-2xl text-light-text-primary">100K+</p>
                                    <p className="text-sm text-light-text-muted">Проданных курсов</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - Изображение с плавающими карточками */}
                    <div className="relative flex justify-center items-center">
                        {/* Основной контейнер для всей правой части */}
                        <div className="relative w-full max-w-2xl mx-auto">

                            {/* Контейнер для изображения с прямоугольным фоном */}
                            <div className="relative w-full lg:w-4/5 h-[250px] lg:h-[450px] mx-auto">
                                {/* Прямоугольный бирюзовый градиентный фон (широкий, но низкий) */}
                                <div className="absolute inset-0 bottom-0 h-[200px] lg:h-[480px] bg-blue-300 rounded-2xl lg:rounded-3xl shadow-xl"></div>

                                {/* Контейнер для изображения (центрирован поверх фона) */}
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 lg:w-3/4 h-[400px] lg:h-[550px]">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/Hero_frame.png"
                                            alt="Студенты обучаются с помощью Skills Tracker"
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 100vw"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Плавающие карточки */}

                            {/* Плавающая карточка 1: Процент завершения курсов (ВЕРХНИЙ ЛЕВЫЙ УГОЛ) */}
                            <div className="absolute -top-2 -left-2 lg:-top-6 lg:-left-8">
                                <FloatingStatCard
                                    position="top-left"
                                    color="white"
                                    icon={TrendingUp}
                                    value="87.6%"
                                    label="завершения"
                                    description="Процент завершения наших курсов студентами"
                                />
                            </div>

                            

                            {/* Карточка с отзывом (НИЖНИЙ ПРАВЫЙ УГОЛ) - ПЕРЕМЕЩЕНА */}
                            <div className="absolute -bottom-2 -right-2 lg:-bottom-6 lg:-right-8 lg:translate-x-16 lg:translate-y-14">
                                <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm hidden lg:block transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-light-purple-100 to-light-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl">👤</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-light-text-primary">Анна Петрова</p>
                                            <p className="text-xs text-light-text-muted">Бывший бухгалтер, теперь фронтенд-разработчик</p>
                                        </div>
                                    </div>
                                    <p className="text-light-text-secondary italic text-sm leading-relaxed">
                                        "Skills Tracker помог мне сменить профессию за 6 месяцев! Курсы структурированы и дают реальные навыки."
                                    </p>
                                    <div className="flex mt-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-4 h-4 text-light-amber-500 fill-current"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Плавающая карточка 3: Продажи курсов (НИЖНИЙ ЛЕВЫЙ УГОЛ) - ПЕРЕМЕЩЕНА */}
                            <div className="absolute -bottom-2 -left-2 lg:-bottom-6 lg:-left-8">
                                <FloatingStatCard
                                    position="bottom-left"
                                    color="white"
                                    icon={Trophy}
                                    value="100K+"
                                    label="курсов"
                                    description="Количество проданных курсов"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}