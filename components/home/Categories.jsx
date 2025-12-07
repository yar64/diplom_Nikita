// components/home/Categories.jsx
import { Star, Code, TrendingUp, Atom } from 'lucide-react';

export default function Categories() {
    const categories = [
        {
            name: "Астрология",
            coursesCount: 11,
            icon: Star
        },
        {
            name: "Разработка",
            coursesCount: 12,
            icon: Code
        },
        {
            name: "Маркетинг",
            coursesCount: 12,
            icon: TrendingUp
        },
        {
            name: "Физика",
            coursesCount: 14,
            icon: Atom
        }
    ];

    return (
        <section className="py-16 bg-light-card">
            <div className="max-w-7xl mx-auto px-4">
                {/* Заголовок и кнопка */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-light-text-primary">Популярные категории</h2>
                    <button className="text-light-blue-500 font-semibold hover:text-light-blue-600 transition">
                        Смотреть все
                    </button>
                </div>

                {/* Сетка категорий */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-8 hover:bg-light-accent hover:shadow-md transition cursor-pointer border border-light-border text-center flex flex-col items-center"
                            >
                                {/* Голубой кружок с иконкой в центре - увеличенный */}
                                <div className="w-20 h-20 rounded-full bg-light-blue-100 flex items-center justify-center mb-6">
                                    <Icon className="w-10 h-10 text-light-blue-600" />
                                </div>

                                <h3 className="text-xl font-semibold text-light-text-primary mb-3">
                                    {category.name}
                                </h3>
                                <p className="text-light-text-secondary">
                                    {category.coursesCount} курсов
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}