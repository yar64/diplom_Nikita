// components/layout/Footer.jsx

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Лого и описание */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Skills Tracker</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Отслеживайте ваш прогресс в обучении и развивайте навыки систематически.
                            Skills Tracker - платформа для управления вашим образовательным путем
                            и достижения профессиональных целей.
                        </p>
                    </div>

                    {/* Навигация */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Навигация</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/" className="hover:text-white transition">
                                    Главная
                                </a>
                            </li>
                            <li>
                                <a href="/skills" className="hover:text-white transition">
                                    Мои навыки
                                </a>
                            </li>
                            <li>
                                <a href="/goals" className="hover:text-white transition">
                                    Цели
                                </a>
                            </li>
                            <li>
                                <a href="/progress" className="hover:text-white transition">
                                    Прогресс
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Обучение */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Обучение</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/learning-paths" className="hover:text-white transition">
                                    Пути обучения
                                </a>
                            </li>
                            <li>
                                <a href="/projects" className="hover:text-white transition">
                                    Проекты
                                </a>
                            </li>
                            <li>
                                <a href="/study-sessions" className="hover:text-white transition">
                                    Учебные сессии
                                </a>
                            </li>
                            <li>
                                <a href="/analytics" className="hover:text-white transition">
                                    Аналитика
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Контакты</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <div className="flex items-start space-x-2">
                                    <span>📍</span>
                                    <span>ул. Главная, 123, Москва, 12345</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center space-x-2">
                                    <span>📞</span>
                                    <span>+7 (123) 456-7890</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center space-x-2">
                                    <span>✉️</span>
                                    <span>skills.tracker@edu.ru</span>
                                </div>
                            </li>
                        </ul>

                        {/* Социальные сети */}
                        <div className="mt-4">
                            <h4 className="text-md font-medium mb-3">Мы в соцсетях</h4>
                            <div className="flex space-x-3">
                                <a
                                    href="https://vk.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-400 hover:bg-blue-600 p-1.5 rounded-lg transition-all duration-200"
                                    aria-label="ВКонтакте"
                                >
                                    <img src="/vk-social-logo.svg" alt="VK" className="w-8 h-8" />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-400 hover:bg-red-600 p-1.5 rounded-lg transition-all duration-200"
                                    aria-label="YouTube"
                                >
                                    <img src="/youtube-logo.svg" alt="YouTube" className="w-8 h-8" />
                                </a>
                                <a
                                    href="https://wa.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-400 hover:bg-green-500 p-1.5 rounded-lg transition-all duration-200"
                                    aria-label="WhatsApp"
                                >
                                    <img src="/whatsapp-logo.svg" alt="WhatsApp" className="w-8 h-8" />
                                </a>
                                <a
                                    href="https://telegram.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-400 hover:bg-blue-500 p-1.5 rounded-lg transition-all duration-200"
                                    aria-label="Telegram"
                                >
                                    <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8" />
                                </a>
                                <a
                                    href="https://google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-400 hover:bg-yellow-500 p-1.5 rounded-lg transition-all duration-200"
                                    aria-label="Google"
                                >
                                    <img src="/google-logo.svg" alt="Google" className="w-8 h-8" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Нижняя часть футера */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Skills Tracker. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}