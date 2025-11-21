// components/home/Hero.jsx
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Левая часть - основной контент (без изменений) */}
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Раскройте свой потенциал с помощью Skills Tracker
                        </h1>

                        <p className="text-xl md:text-xl text-blue-100 leading-relaxed">
                            Добро пожаловать в Skills Tracker, где обучение не знает границ. Мы верим, что образование - это ключ к личному и профессиональному росту, и мы здесь для того, чтобы помочь вам на пути к успеху.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
                                Начни своё обучение
                            </button>
                        </div>
                    </div>

                    {/* Правая часть - ФОТКА вместо статистики */}
                    <div className="relative">
                        <Image
                            src="/Hero_frame.png"
                            alt="Learning illustration"
                            width={600}
                            height={500}
                            className=""
                            priority
                        />
                    </div>

                </div>
            </div>
        </section>
    )
}