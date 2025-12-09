import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ProfileInfo({ formData }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Информация профиля</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Имя
                        </label>
                        <p className="text-gray-900 font-medium">{formData.firstName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Фамилия
                        </label>
                        <p className="text-gray-900 font-medium">{formData.lastName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Заголовок
                        </label>
                        <p className="text-gray-900">{formData.headline}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            О себе
                        </label>
                        <p className="text-gray-900">{formData.description}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Язык
                        </label>
                        <p className="text-gray-900">{formData.language}</p>
                    </div>
                </div>

                {/* Контактная информация */}
                <div className="md:col-span-2 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{formData.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Телефон</p>
                                <p className="font-medium">{formData.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Местоположение</p>
                                <p className="font-medium">{formData.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Веб-сайт</p>
                                <a
                                    href={formData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {formData.website}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}