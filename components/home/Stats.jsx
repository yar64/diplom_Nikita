// components/home/Stats.jsx
export default function Stats() {
    const stats = [
        {
            number: "250+",
            description: "Курсов от наших лучших менторов"
        },
        {
            number: "1000+",
            description: "Активных студентов"
        },
        {
            number: "15+",
            description: "Категорий обучения"
        },
        {
            number: "2400+",
            description: "Успешных историй"
        }
    ];

    return (
        <section className="py-16 bg-light-bg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-light-text-primary mb-3">
                                {stat.number}
                            </div>
                            <div className="text-light-text-secondary text-sm lg:text-base">
                                {stat.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}