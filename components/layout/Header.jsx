'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X, Menu, LogIn, UserPlus, User, LogOut, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleLoginClick = () => {
        router.push('/login')
    }

    const handleRegisterClick = () => {
        router.push('/register')
    }

    const handleProfileClick = () => {
        router.push('/profile')
    }

    const handleInstructorsClick = () => {
        router.push('/instructors')
    }

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Лого и навигация слева */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            SkillsTracker
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                                Курсы
                            </Link>
                            <Link href="/instructors" className="text-gray-700 hover:text-blue-600 font-medium">
                                Преподаватели
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                                О нас
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                                Контакты
                            </Link>
                        </nav>
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center space-x-4">
                        {/* Поиск */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-3 bg-gradient-to-r from-blue-100 px-4 py-2 rounded-full border border-blue-100 hover:border-blue-200 transition-colors min-w-[300px]">
                            <div className="flex items-center space-x-2 flex-1">
                                <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Найти курсы, преподавателей, навыки..."
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

                        {/* Кнопка преподавателей для мобильных */}
                        <Link
                            href="/instructors"
                            className="md:hidden flex items-center p-2 text-gray-700 hover:text-blue-600"
                            title="Преподаватели"
                        >
                            <Users className="w-5 h-5" />
                        </Link>

                        {/* Кнопки авторизации или профиль */}
                        <div className="flex gap-3 items-center">
                            {user ? (
                                <>
                                    <button
                                        onClick={handleProfileClick}
                                        className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{user.firstName || user.username || 'Профиль'}</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Выйти</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLoginClick}
                                        className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Войти</span>
                                    </button>
                                    <button
                                        onClick={handleRegisterClick}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Регистрация</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Мобильное меню */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Мобильное меню */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 space-y-4">
                        <form onSubmit={handleSearch} className="flex items-center bg-blue-50 px-4 py-2 rounded-lg mx-4">
                            <Search className="w-4 h-4 text-blue-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Поиск курсов, преподавателей..."
                                className="bg-transparent outline-none text-sm w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        <Link
                            href="/courses"
                            className="flex items-center px-4 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            📚 Курсы
                        </Link>
                        <Link
                            href="/instructors"
                            className="flex items-center px-4 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            👨‍🏫 Преподаватели
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center px-4 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            ℹ️ О нас
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center px-4 text-gray-700 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            📞 Контакты
                        </Link>

                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        handleProfileClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left px-4 text-gray-700 hover:text-blue-600"
                                >
                                    👤 Профиль
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left px-4 text-gray-700 hover:text-red-600"
                                >
                                    🚪 Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        handleLoginClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center w-full text-left px-4 text-gray-700 hover:text-blue-600"
                                >
                                    🔑 Войти
                                </button>
                                <button
                                    onClick={() => {
                                        handleRegisterClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center mx-4 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    📝 Регистрация
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}