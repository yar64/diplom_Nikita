// server/category.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

// Типы для данных категории
interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order?: number
  isActive?: boolean
  seoTitle?: string
  seoDescription?: string
}

interface UpdateCategoryData {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  order?: number
  isActive?: boolean
  seoTitle?: string
  seoDescription?: string
}

// Генерация slug из названия
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// server/category.actions.ts
export async function createCategory(categoryData: any) {
  try {
    // Валидация обязательных полей
    if (!categoryData.name || !categoryData.name.trim()) {
      return {
        success: false,
        error: 'Название категории обязательно',
        validationErrors: { name: 'Название категории обязательно' }
      };
    }

    if (!categoryData.slug || !categoryData.slug.trim()) {
      return {
        success: false,
        error: 'URL-адрес (slug) обязателен',
        validationErrors: { slug: 'URL-адрес (slug) обязателен' }
      };
    }

    // Проверяем уникальность slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categoryData.slug }
    });

    if (existingCategory) {
      return {
        success: false,
        error: 'Категория с таким URL уже существует',
        validationErrors: { slug: 'URL уже используется другой категорией' }
      };
    }

    // Создаем категорию
    const category = await prisma.category.create({
      data: {
        name: categoryData.name.trim(),
        slug: categoryData.slug.trim(),
        description: categoryData.description?.trim() || '',
        color: categoryData.color || '#6366f1',
        icon: categoryData.icon || '',
        isActive: categoryData.isActive !== false,
        order: parseInt(categoryData.order) || 0,
        seoTitle: categoryData.seoTitle?.trim() || '',
        seoDescription: categoryData.seoDescription?.trim() || '',
        coursesCount: 0,
        studentsCount: 0,
        revenue: 0
      }
    });

    revalidatePath('/admin/courses');
    revalidatePath('/courses');

    return {
      success: true,
      category,
      message: 'Категория успешно создана'
    };
  } catch (error: any) {
    console.error('Ошибка создания категории:', error);

    // Обработка специфических ошибок Prisma
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('slug')) {
        return {
          success: false,
          error: 'Категория с таким URL уже существует',
          validationErrors: { slug: 'URL уже используется' }
        };
      } else if (target?.includes('name')) {
        return {
          success: false,
          error: 'Категория с таким названием уже существует',
          validationErrors: { name: 'Название уже используется' }
        };
      }
    }

    // Общая ошибка базы данных
    if (error.code?.startsWith('P')) {
      return {
        success: false,
        error: 'Ошибка базы данных. Попробуйте еще раз.'
      };
    }

    return {
      success: false,
      error: error.message || 'Ошибка при создании категории'
    };
  }
}

export async function updateCategory(id: string, categoryData: UpdateCategoryData) {
  try {
    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return { 
        success: false, 
        error: 'Категория не найдена' 
      };
    }

    // Проверяем уникальность slug (если изменился)
    if (categoryData.slug && categoryData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (slugExists) {
        return { 
          success: false, 
          error: 'Категория с таким URL уже существует' 
        };
      }
    }

    // Подготавливаем данные для обновления
    const updateData: any = {}
    
    if (categoryData.name !== undefined) updateData.name = categoryData.name
    if (categoryData.slug !== undefined) updateData.slug = categoryData.slug
    if (categoryData.description !== undefined) updateData.description = categoryData.description
    if (categoryData.color !== undefined) updateData.color = categoryData.color
    if (categoryData.icon !== undefined) updateData.icon = categoryData.icon
    if (categoryData.isActive !== undefined) updateData.isActive = categoryData.isActive
    if (categoryData.order !== undefined) updateData.order = categoryData.order
    if (categoryData.seoTitle !== undefined) updateData.seoTitle = categoryData.seoTitle
    if (categoryData.seoDescription !== undefined) updateData.seoDescription = categoryData.seoDescription

    // Обновляем категорию
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    
    return { 
      success: true, 
      category: updatedCategory,
      message: 'Категория успешно обновлена' 
    };
  } catch (error: any) {
    console.error('Ошибка обновления категории:', error);
    
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: 'Категория с таким названием или URL уже существует' 
      };
    }
    
    return { 
      success: false, 
      error: 'Ошибка при обновлении категории' 
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Сначала обнуляем категории у курсов
    await prisma.course.updateMany({
      where: { categoryId: id },
      data: { categoryId: null }
    });

    // Удаляем категорию
    await prisma.category.delete({
      where: { id }
    });

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    
    return { 
      success: true,
      message: 'Категория успешно удалена' 
    };
  } catch (error: any) {
    console.error('Ошибка удаления категории:', error);
    return { 
      success: false, 
      error: 'Ошибка при удалении категории' 
    };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });

    // Преобразуем данные для фронтенда
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      order: category.order,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      coursesCount: category.coursesCount,
      // Используем реальное количество курсов из отношения
      actualCoursesCount: category._count?.courses || 0,
      studentsCount: category.studentsCount,
      revenue: category.revenue, // Теперь это поле существует
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return { 
      success: true, 
      categories: formattedCategories 
    };
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return { 
      success: false, 
      error: 'Ошибка при загрузке категорий',
      categories: [] 
    };
  }
}

export async function updateAllCategoriesStats() {
  try {
    const categories = await prisma.category.findMany();

    for (const category of categories) {
      // Получаем все курсы этой категории
      const courses = await prisma.course.findMany({
        where: { categoryId: category.id },
        select: {
          totalStudents: true,
          price: true,
          isFree: true
        }
      });

      // Рассчитываем статистику
      const coursesCount = courses.length;
      const studentsCount = courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0);
      const revenue = courses.reduce((sum, course) => {
        if (course.isFree || !course.price) return sum;
        return sum + (course.price * (course.totalStudents || 0));
      }, 0);

      // Обновляем категорию
      await prisma.category.update({
        where: { id: category.id },
        data: {
          coursesCount,
          studentsCount,
          revenue
        }
      });
    }

    revalidatePath('/admin/courses')
    
    return { 
      success: true, 
      message: 'Статистика категорий успешно обновлена' 
    };
  } catch (error) {
    console.error('Ошибка обновления статистики категорий:', error);
    return { 
      success: false, 
      error: 'Ошибка при обновлении статистики категорий' 
    };
  }
}

// Получение категории по ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true }
        },
        courses: {
          take: 10,
          select: {
            id: true,
            title: true,
            slug: true,
            totalStudents: true,
            averageRating: true,
            status: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Категория не найдена' }
    }

    return { success: true, category }
  } catch (error) {
    console.error('Error fetching category:', error)
    return { success: false, error: 'Не удалось загрузить категорию' }
  }
}

// Получение категории по slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { courses: true }
        },
        courses: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnailUrl: true,
            totalStudents: true,
            averageRating: true,
            totalReviews: true,
            level: true,
            price: true,
            isFree: true,
            instructor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Категория не найдена' }
    }

    return { success: true, category }
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return { success: false, error: 'Не удалось загрузить категорию' }
  }
}

// Обновление статистики категории
export async function updateCategoryStats(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        courses: {
          select: {
            totalStudents: true,
            price: true,
            isFree: true
          }
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Категория не найдена' }
    }

    // Подсчитываем курсы и студентов
    const coursesCount = category.courses.length
    const studentsCount = category.courses.reduce(
      (sum, course) => sum + (course.totalStudents || 0), 
      0
    )
    
    // Рассчитываем доход
    const revenue = category.courses.reduce((sum, course) => {
      if (course.isFree || !course.price) return sum;
      return sum + (course.price * (course.totalStudents || 0));
    }, 0)

    // Обновляем статистику
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        coursesCount,
        studentsCount,
        revenue
      }
    })

    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating category stats:', error)
    return { success: false, error: 'Ошибка обновления статистики' }
  }
}

// Перемещение курсов между категориями
export async function moveCoursesToCategory(
  oldCategoryId: string,
  newCategoryId: string
) {
  try {
    // Проверяем существование категорий
    const [oldCategory, newCategory] = await Promise.all([
      prisma.category.findUnique({ where: { id: oldCategoryId } }),
      prisma.category.findUnique({ where: { id: newCategoryId } })
    ])

    if (!oldCategory) {
      return { success: false, error: 'Исходная категория не найдена' }
    }
    if (!newCategory) {
      return { success: false, error: 'Новая категория не найдена' }
    }

    // Получаем количество курсов в старой категории
    const coursesCount = await prisma.course.count({
      where: { categoryId: oldCategoryId }
    })

    // Перемещаем курсы
    await prisma.course.updateMany({
      where: { categoryId: oldCategoryId },
      data: { categoryId: newCategoryId }
    })

    // Обновляем статистику обеих категорий
    await Promise.all([
      updateCategoryStats(oldCategoryId),
      updateCategoryStats(newCategoryId)
    ])

    revalidatePath('/admin/courses')
    
    return {
      success: true,
      message: `${coursesCount} курсов перемещено из "${oldCategory.name}" в "${newCategory.name}"`
    }
  } catch (error) {
    console.error('Error moving courses between categories:', error)
    return { success: false, error: 'Ошибка перемещения курсов' }
  }
}

// Простая функция для получения названий категорий (для обратной совместимости)
export async function getCourseCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, id: true },
      orderBy: { order: 'asc' }
    });
    
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('Ошибка получения категорий курсов:', error);
    return [];
  }
}