'use client';

import { Camera, Upload, Save } from 'lucide-react';

export default function ProfileEdit({ formData, onSave, onCancel, onImageUpload }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            headline: form.headline.value,
            description: form.description.value,
            language: form.language.value,
            email: form.email.value,
            phone: form.phone.value,
            location: form.location.value,
            website: form.website.value
        };
        onSave(updatedData);
    };

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
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Редактирование профиля</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Имя */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Имя
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            defaultValue={formData.firstName}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Фамилия */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Фамилия
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            defaultValue={formData.lastName}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Заголовок */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Заголовок профиля
                        </label>
                        <input
                            type="text"
                            name="headline"
                            defaultValue={formData.headline}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Например: Frontend разработчик"
                        />
                    </div>

                    {/* Описание */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            О себе
                        </label>
                        <textarea
                            name="description"
                            defaultValue={formData.description}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Расскажите о себе..."
                        />
                    </div>

                    {/* Язык */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Язык
                        </label>
                        <select
                            name="language"
                            defaultValue={formData.language}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="Русский">Русский</option>
                            <option value="English">English</option>
                            <option value="Español">Español</option>
                        </select>
                    </div>

                    {/* Загрузка изображения */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Изображение профиля
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Загрузите новое изображение</p>
                            <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                                <Upload className="w-4 h-4" />
                                <span>Выбрать файл</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF до 5MB</p>
                        </div>
                    </div>

                    {/* Контактная информация */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={formData.email}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={formData.phone}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Местоположение
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    defaultValue={formData.location}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Веб-сайт
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    defaultValue={formData.website}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопки сохранения */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Save className="w-4 h-4" />
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    );
}