import { Star } from 'lucide-react';

export default function ProfileReviews() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои отзывы</h2>
            <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Вы еще не оставляли отзывов</p>
            </div>
        </div>
    );
}