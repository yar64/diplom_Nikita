'use client';

import { User, BookOpen, Users, MessageSquare, Star } from 'lucide-react';

export default function ProfileTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
        { id: 'courses', label: 'Мои курсы', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'teachers', label: 'Преподаватели', icon: <Users className="w-4 h-4" /> },
        { id: 'messages', label: 'Сообщения', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'reviews', label: 'Мои отзывы', icon: <Star className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <nav className="space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left transition ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {tab.icon}
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}