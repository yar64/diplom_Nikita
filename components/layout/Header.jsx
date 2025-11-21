// components/layout/Header.jsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                                About us
                            </Link>
                            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                                Courses
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                                Contact us
                            </Link>
                            <Link href="/faq" className="text-gray-700 hover:text-blue-600 font-medium">
                                FAQ's
                            </Link>
                        </nav>
                    </div>

                    {/* Правая часть - поиск и кнопки */}
                    <div className="flex items-center space-x-4">

                        {/* Поиск и хлебные крошки */}
                        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                            <span>Want to learn?</span>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center space-x-1">
                                <span>Explore</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Кнопки авторизации */}
                        <div className="flex items-center space-x-3">
                            <button className="text-gray-700 hover:text-blue-600 font-medium hidden sm:block">
                                Sign in
                            </button>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition">
                                Create free account
                            </button>
                        </div>

                        {/* Мобильное меню */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Мобильное меню (раскрывающееся) */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-4">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Home
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                                About us
                            </Link>
                            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                                Courses
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                                Contact us
                            </Link>
                            <Link href="/faq" className="text-gray-700 hover:text-blue-600 font-medium">
                                FAQ's
                            </Link>
                            <div className="pt-4 border-t border-gray-200">
                                <button className="text-gray-700 hover:text-blue-600 font-medium w-full text-left">
                                    Sign in
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}