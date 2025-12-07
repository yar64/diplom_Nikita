// components/course-detail/CourseSidebar.jsx
'use client';

import { Share2, Tag, CheckCircle, ShoppingCart, CreditCard } from 'lucide-react';

export default function CourseSidebar() {
    const handleAddToCart = () => {
        console.log('Добавлено в корзину');
    };

    const handleBuyNow = () => {
        console.log('Купить сейчас');
    };

    const handleShare = (platform) => {
        console.log(`Поделиться в ${platform}`);
    };

    return (
        <div className="sticky top-8 bg-white rounded-xl border border-light-border shadow-sm p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-light-text-primary">$49.5</span>
                    <span className="text-lg text-light-text-secondary line-through">$99</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                        50% скидка
                    </span>
                </div>
                <div className="text-sm text-light-text-secondary">
                    Предложение ограничено по времени
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-light-blue-600 text-white font-semibold rounded-lg hover:bg-light-blue-700 transition duration-300 flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    В корзину
                </button>
                <button
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-white border-2 border-light-blue-600 text-light-blue-600 font-semibold rounded-lg hover:bg-light-blue-50 transition duration-300 flex items-center justify-center gap-2"
                >
                    <CreditCard className="w-5 h-5" />
                    Купить сейчас
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 text-light-text-secondary mb-3">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Поделиться</span>
                </div>
                <div className="flex gap-3">
                    {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((social) => (
                        <button
                            key={social}
                            onClick={() => handleShare(social)}
                            className="flex-1 py-2 border border-light-border rounded-lg text-sm hover:bg-light-accent transition"
                        >
                            {social}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-light-text-primary">30-дневная гарантия возврата</div>
                        <div className="text-sm text-light-text-secondary">Полный возврат, если не удовлетворены</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-light-text-primary">Полный пожизненный доступ</div>
                        <div className="text-sm text-light-text-secondary">Доступ в любое время, в любом месте</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-light-text-primary">Сертификат об окончании</div>
                        <div className="text-sm text-light-text-secondary">Сертификат для общего доступа</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-light-border">
                <div className="flex items-center gap-2 text-light-text-secondary mb-3">
                    <Tag className="w-5 h-5" />
                    <span className="font-medium">Теги</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['UX Дизайн', 'UI Дизайн', 'Веб-дизайн', 'Исследование пользователей', 'Прототипирование'].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-light-accent text-light-text-secondary rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}