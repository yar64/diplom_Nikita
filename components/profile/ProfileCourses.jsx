import { BookOpen } from 'lucide-react';

export default function ProfileCourses() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои курсы</h2>
            <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Вы еще не записались ни на один курс</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                    Посмотреть доступные курсы →
                </button>
            </div>
        </div>
    );
}