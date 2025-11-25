// components/home/JoinSection.jsx
import Image from 'next/image';

export default function JoinSection() {
    return (
        <section className="bg-white">

            
            {/* Первый CTA - Стать инструктором */}
            <div className="bg-white text-black py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Изображение */}
                        <div className="relative">
                            <Image
                                src="/instructor_join.png"
                                alt="Инструктор преподает"
                                width={500}
                                height={350}
                                className=""
                            />
                        </div>

                        {/* Текстовая часть */}
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold">
                                Станьте инструктором
                            </h2>
                            <p className="text-xl text-black leading-relaxed">
                                Инструкторы со всего мира обучают миллионы студентов на Skills Tracker.
                                Мы предоставляем инструменты и навыки, чтобы преподавать то, что вы любите.
                            </p>
                            <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center">
                                Начать путь инструктора
                                <Image
                                    src="/arrow_join.svg"
                                    alt="Стрелка"
                                    width={20}
                                    height={20}
                                    className="ml-2"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Второй CTA - Образование */}
            <div className="bg-white text-black py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Текстовая часть - СЛЕВА */}
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold">
                                Преобразите свою жизнь через образование
                            </h2>
                            <p className="text-xl text-black leading-relaxed">
                                Учащиеся по всему миру начинают новые карьеры, продвигаются в своих областях и обогащают свою жизнь.
                            </p>
                            <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition inline-flex items-center">
                                Смотреть курсы
                                <Image
                                    src="/arrow_join.svg"
                                    alt="Стрелка"
                                    width={20}
                                    height={20}
                                    className="ml-2"
                                />
                            </button>
                        </div>

                        {/* Фотка - СПРАВА */}
                        <div className="relative">
                            <Image
                                src="/education_join.png"
                                alt="Студенты обучаются"
                                width={600}
                                height={400}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}