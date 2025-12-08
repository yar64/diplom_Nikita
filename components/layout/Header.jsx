// components/layout/Header.jsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, X, Menu, LogIn, UserPlus } from 'lucide-react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const handleLoginClick = () => {
        router.push('/login')
    }

    const handleRegisterClick = () => {
        router.push('/register')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Здесь можно добавить логику поиска
            console.log('Поиск:', searchQuery)
            // Например, перенаправление на страницу поиска
            // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Лого и навигация слева */}
                    <div className="flex items-center space-x-8">
                        {/* Логотип */}
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">SkillsTracker</span>
                        </Link>

                        {/* Навигация */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Главная
                            </Link>
                            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                                Курсы
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                                О нас
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                                Контакты
                            </Link>
                        </nav>
                    </div>

                    {/* Правая часть - поиск и кнопки */}
                    <div className="flex items-center space-x-4">

                        {/* Встроенный поиск */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100 hover:border-blue-200 transition-colors min-w-[300px]">
                            <div className="flex items-center space-x-2 flex-1">
                                <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Найти курсы, навыки, технологии..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 w-full"
                                />
                            </div>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button type="submit" className="hidden">Найти</button>
                        </form>

                        {/* Кнопки авторизации */}
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={handleLoginClick}
                                className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium hidden sm:block pl-6"
                            >
                                <LogIn className="w-4 h-4 flex-shrink-0 absolute left-0 top-1/2 transform -translate-y-1/2" />
                                <span>Войти</span>
                            </button>
                            <button
                                onClick={handleRegisterClick}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                            >
                                <UserPlus className="w-4 h-4 flex-shrink-0" />
                                <span>Создать аккаунт</span>
                            </button>
                        </div>

                        {/* Мобильное меню */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Мобильное меню (раскрывающееся) */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Главная
                            </Link>
                            <Link
                                href="/courses"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Курсы
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                О нас
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Контакты
                            </Link>

                            {/* Мобильный поиск */}
                            <div className="pt-2">
                                <form onSubmit={handleSearch} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                                    <Search className="w-4 h-4 text-blue-500" />
                                    <input
                                        type="text"
                                        placeholder="Поиск..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </form>
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <button
                                    onClick={() => {
                                        handleLoginClick()
                                        setIsMenuOpen(false)
                                    }}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium w-full justify-start"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Войти</span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleRegisterClick()
                                        setIsMenuOpen(false)
                                    }}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full justify-center"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Создать аккаунт</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}