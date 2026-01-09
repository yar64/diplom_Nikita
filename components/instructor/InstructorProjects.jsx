// components/instructor/InstructorProjects.jsx - СО СТАТИЧЕСКИМИ ДАННЫМИ
'use client';

import { ExternalLink, Github, FileText, Globe, Server, Smartphone, Database } from 'lucide-react';

export default function InstructorProjects({ projects = [] }) {
    // Статические данные для демонстрации
    const staticProjects = [
        {
            id: 1,
            title: "E-commerce Platform",
            description: "Полнофункциональная платформа электронной коммерции с панелью администратора, системой оплаты и аналитикой.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind"],
            repository: "https://github.com/skills-tracker/ecommerce",
            demoUrl: "https://ecommerce-demo.skillstracker.com",
            status: "completed",
            year: 2024,
            icon: Globe
        },
        {
            id: 2,
            title: "Learning Management System",
            description: "Система управления обучением с видео-лекциями, тестами, прогрессом студентов и сертификатами.",
            technologies: ["Next.js", "PostgreSQL", "Prisma", "AWS S3", "Vercel"],
            repository: "https://github.com/skills-tracker/lms",
            demoUrl: "https://lms.skillstracker.com",
            status: "completed",
            year: 2024,
            icon: Server
        },
        {
            id: 3,
            title: "Mobile Language Learning App",
            description: "Мобильное приложение для изучения языков с интерактивными упражнениями и отслеживанием прогресса.",
            technologies: ["React Native", "Firebase", "Redux", "Expo", "i18n"],
            repository: "https://github.com/skills-tracker/language-app",
            demoUrl: "https://expo.dev/@skills-tracker/language-app",
            status: "in-progress",
            year: 2024,
            icon: Smartphone
        },
        {
            id: 4,
            title: "Data Analytics Dashboard",
            description: "Панель аналитики для мониторинга метрик обучения с графиками, отчетами и прогнозами.",
            technologies: ["TypeScript", "D3.js", "Express", "Redis", "Docker"],
            repository: "https://github.com/skills-tracker/analytics-dashboard",
            demoUrl: "https://analytics.skillstracker.com",
            status: "completed",
            year: 2023,
            icon: Database
        }
    ];

    // Используем переданные projects или статические данные
    const displayProjects = projects.length > 0 ? projects : staticProjects;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-light-green-100 text-light-green-800';
            case 'in-progress':
                return 'bg-light-amber-100 text-light-amber-800';
            case 'planned':
                return 'bg-light-blue-100 text-light-blue-800';
            default:
                return 'bg-light-accent text-light-text-secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Завершён';
            case 'in-progress':
                return 'В разработке';
            case 'planned':
                return 'Запланирован';
            default:
                return status;
        }
    };

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-light-text-primary">Проекты и работы</h2>
                <span className="text-sm text-light-text-secondary bg-light-accent px-3 py-1 rounded-full">
                    {displayProjects.length} проектов
                </span>
            </div>

            <div className="space-y-6">
                {displayProjects.map((project) => {
                    const Icon = project.icon || Globe;

                    return (
                        <div
                            key={project.id}
                            className="border border-light-border rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-light-blue-400"
                        >
                            <div className="flex items-start gap-4">
                                {/* Иконка проекта */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-light-blue-100 to-light-purple-100 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-light-blue-500" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {/* Заголовок и статус */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg text-light-text-primary">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                                    {getStatusText(project.status)}
                                                </span>
                                                <span className="text-sm text-light-text-secondary">
                                                    {project.year} год
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Описание */}
                                    {project.description && (
                                        <p className="text-sm text-light-text-secondary mb-4">
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Технологии */}
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs px-2.5 py-1 bg-light-accent text-light-text-secondary rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Ссылки */}
                                    <div className="flex items-center space-x-4 pt-4 border-t border-light-border">
                                        {project.repository && (
                                            <a
                                                href={project.repository}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-sm text-light-text-secondary hover:text-light-text-primary transition-colors"
                                            >
                                                <Github className="w-4 h-4" />
                                                <span>Код</span>
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-sm text-light-blue-500 hover:text-light-blue-600 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                <span>Демо</span>
                                            </a>
                                        )}
                                        {project.documentation && (
                                            <a
                                                href={project.documentation}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 text-sm text-light-green-500 hover:text-light-green-600 transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>Документация</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Подсказка для реальных данных */}
            {projects.length === 0 && (
                <div className="mt-6 pt-6 border-t border-light-border text-center">
                    <p className="text-sm text-light-text-secondary italic">
                        * Это демонстрационные проекты. В реальном приложении проекты будут загружаться из базы данных.
                    </p>
                </div>
            )}
        </div>
    );
}