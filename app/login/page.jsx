'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Facebook,
    Mail as MicrosoftIcon,
    ArrowRight,
    User
} from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email или имя пользователя обязательно';
        }
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Заглушка для демонстрации
            console.log('Вход пользователя:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Сохраняем в localStorage для простоты
            localStorage.setItem('user', JSON.stringify({
                email: formData.email,
                username: formData.email.split('@')[0] || 'user',
                firstName: 'Тестовый',
                lastName: 'Пользователь'
            }));

            router.push('/dashboard');
        } catch (error) {
            setErrors({ submit: 'Ошибка входа. Попробуйте снова.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light-accent flex items-center justify-center p-4">
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Левая часть - Форма */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Вход в аккаунт</h1>
                        <p className="text-gray-600">Войдите, чтобы продолжить обучение</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email или имя пользователя
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email или имя пользователя"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Пароль */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Пароль
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Забыли пароль?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Введите пароль"
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Запомнить меня */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Запомнить меня
                            </label>
                        </div>

                        {/* Кнопка входа */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Вход...
                                </>
                            ) : (
                                <>
                                    Войти
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {errors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 text-center">{errors.submit}</p>
                            </div>
                        )}
                    </form>

                    {/* Вход через соцсети */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Или войдите через</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                className="w-full py-3 px-4 border border-gray-300 bg-gray-300 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                <img src="/vk-social-logo.svg" alt="VK" className="w-6 h-6" />
                                <span className="text-sm font-medium">VK</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => console.log('Google login')}
                                className="w-full py-3 px-4 border border-gray-300 bg-gray-300 rounded-lg hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
                            >
                                <img src="/google-logo.svg" alt="Google" className="w-7 h-7" />
                                <span className="text-sm font-medium">Google</span>
                            </button>

                            <button
                                type="button"
                                className="w-full py-3 px-4 border border-gray-300 bg-gray-300 rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                            >
                                <img src="/telegram-logo.svg" alt="Telegram" className="w-6 h-6" />
                                <span className="text-sm font-medium">Telegram</span>
                            </button>
                        </div>
                    </div>

                    {/* Ссылка на регистрацию */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Нет аккаунта?{' '}
                            <Link
                                href="/register"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Зарегистрируйтесь
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Правая часть - Информация */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-green-50 to-emerald-100 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                                <User className="h-8 w-8 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Добро пожаловать обратно!
                            </h2>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Продолжите отслеживать свой прогресс</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Доступ к вашим курсам и проектам</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Общайтесь с сообществом</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">Получайте персонализированные рекомендации</span>
                                </li>
                            </ul>

                            <div className="bg-green-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Ваш прогресс сохранен</h3>
                                <p className="text-sm text-gray-600">
                                    Все ваши достижения, пройденные курсы и развитые навыки ждут вас.
                                    Продолжайте двигаться к своим целям!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}