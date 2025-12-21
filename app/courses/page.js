// app/courses/page.js
import CoursesPageClient from '../../components/courses/CoursesPage';
import { getSimpleCourses } from '../../server/course.actions'; // ← Импортируем ПРОСТУЮ версию

export default async function CoursesPage() {
    try {
        console.log('🔄 Загрузка курсов через getSimpleCourses()...');

        // Используем готовую простую функцию
        const result = await getSimpleCourses();

        console.log('✅ Получено курсов:', result.courses.length);

        // Форматируем для клиента (можно упростить, если getSimpleCourses уже всё форматирует)
        const formattedCourses = result.courses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            instructor: course.instructor.username, // уже отформатировано в getSimpleCourses
            rating: course.averageRating || 0,
            students: course.totalStudents || 0,
            chapters: 0, // в простой версии нет, можно добавить потом
            price: course.price || 0,
            originalPrice: null,
            discountPercent: null,
            category: course.category || 'Без категории',
            isFeatured: false, // в простой версии нет
            level: 'BEGINNER', // в простой версии нет
            slug: course.id, // используем ID как slug
            thumbnailUrl: '',
            isFree: course.isFree || false,
            totalReviews: 0,
            hasCertificate: false,
            createdAt: new Date()
        }));

        // Получаем уникальные категории из курсов
        const categories = [...new Set(result.courses
            .map(c => c.category)
            .filter(Boolean))];

        return (
            <CoursesPageClient
                initialCourses={formattedCourses}
                initialCategories={categories}
                initialTotal={result.total}
            />
        );

    } catch (error) {
        console.error('❌ Ошибка в getSimpleCourses():', error);

        return (
            <div className="min-h-screen bg-red-50 p-8">
                <h1 className="text-3xl font-bold text-red-600">Ошибка Server Action</h1>
                <pre className="bg-white p-4 rounded mt-4 overflow-auto text-sm">
                    {error.message}
                </pre>
                <div className="mt-6">
                    <h2 className="font-bold mb-2">Что делать:</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Проверь, что Turbopak отключён</li>
                        <li>Убедись, что в БД есть курсы</li>
                        <li>Попробуй использовать старый endpoint подход</li>
                    </ol>
                </div>
            </div>
        );
    }
}