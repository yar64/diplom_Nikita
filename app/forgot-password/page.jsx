'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Логика отправки email для восстановления
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitted(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-light-accent flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {!isSubmitted ? (
                    <>
                        <div className="mb-8">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Назад к входу
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Восстановление пароля</h1>
                            <p className="text-gray-600 mt-2">
                                Введите ваш email, и мы отправим ссылку для сброса пароля
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ваш email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Отправка...' : 'Отправить ссылку'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Проверьте ваш email</h2>
                        <p className="text-gray-600 mb-6">
                            Мы отправили ссылку для сброса пароля на адрес <strong>{email}</strong>
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться к входу
                        </Link>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        Нужна помощь?{' '}
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                            Свяжитесь с поддержкой
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}