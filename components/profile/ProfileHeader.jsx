'use client';

import { Camera, Share2, Edit2, Mail, Phone, MapPin } from 'lucide-react';
import { User } from 'lucide-react';

export default function ProfileHeader({
    user,
    formData,
    onEditToggle,
    isEditing,
    onImageUpload
}) {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Аватар */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Аватар"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-white/70" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 transition">
                            <Camera className="w-4 h-4 text-gray-700" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Информация профиля */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">
                            {formData.firstName} {formData.lastName}
                        </h1>
                        <p className="text-blue-100 mb-4">{formData.headline}</p>
                        <p className="text-white/80 mb-6 max-w-2xl">{formData.description}</p>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{formData.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{formData.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{formData.location}</span>
                            </div>
                        </div>

                        {/* Кнопки действий */}
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                                <Share2 className="w-4 h-4" />
                                Поделиться профилем
                            </button>
                            <button
                                onClick={onEditToggle}
                                className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isEditing ? 'Отменить редактирование' : 'Редактировать профиль'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}