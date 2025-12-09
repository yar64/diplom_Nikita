'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Facebook,
    Mail as MicrosoftIcon,
    ArrowRight,
    Check
} from 'lucide-react';
import { registerUser } from '../../server/user.actions';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth(); // ← получаем функцию login из контекста
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        if (!formData.firstName.trim()) newErrors.firstName = 'Имя обязательно';
        if (!formData.lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
        if (!formData.username.trim()) newErrors.username = 'Имя пользователя обязательно';
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const result = await registerUser({
                email: formData.email,
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            });

            if (result.success) {
                // ИСПРАВЛЯЕМ: используем login из контекста вместо localStorage.setItem
                login({
                    id: result.user.id,
                    email: result.user.email,
                    username: result.user.username,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    role: result.user.role
                });

                // Перенаправляем на страницу профиля
                router.push('/profile');
            } else {
                setErrors({
                    submit: result.error || 'Ошибка регистрации. Попробуйте снова.'
                });
            }
        } catch (error) {
            setErrors({ submit: 'Ошибка сети. Попробуйте снова.' });
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Создать аккаунт</h1>
                        <p className="text-gray-600">Присоединяйтесь к нашему обучающему сообществу</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Полное имя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Полное имя
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Имя"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Фамилия"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Имя пользователя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Имя пользователя
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Имя пользователя"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email адрес"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Пароли */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Пароль
                                    </label>
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Подтвердите пароль
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Подтвердите пароль"
                                            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Кнопка */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Создание аккаунта...
                                </>
                            ) : (
                                <>
                                    Создать аккаунт
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

                    {/* Соцсети */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Или зарегистрируйтесь через</span>
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
                                className="w-full py-3 px-4 border border-gray-300 bg-gray-300 rounded-lg hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
                            >
                                <img src="/telegram-logo.svg" alt="Telegram" className="w-6 h-6" />
                                <span className="text-sm font-medium">Telegram</span>
                            </button>
                        </div>
                    </div>

                    {/* Ссылка на вход */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Уже есть аккаунт?{' '}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Войти
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Правая часть */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                                <Check className="h-8 w-8 text-blue-600" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Начните свой путь обучения
                            </h2>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Отслеживайте развитие навыков</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Присоединяйтесь к обучающим сообществам</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Ставьте и достигайте цели проектов</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Следите за прогрессом с аналитикой</span>
                                </li>
                            </ul>

                            <div className="bg-blue-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Для учебного проекта</h3>
                                <p className="text-sm text-gray-600">
                                    Это демонстрационная версия для дипломного проекта.
                                    Регистрация сохраняет данные только в localStorage.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}