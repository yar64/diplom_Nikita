// actions/course.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

// Типы
export type CourseFilters = {
  category?: string // Теперь это ID категории
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  isFeatured?: boolean
  isFree?: boolean
  minPrice?: number
  maxPrice?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  search?: string
  page?: number
  limit?: number
}

export type CourseFormData = {
  title: string;
  description?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  tags?: string | string[];
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  isFree?: boolean;
  level: string;
  language: string;
  duration?: number;
  status: string;
  isFeatured?: boolean;
  slug: string;
  instructorId: string;
  category?: string;
  categoryId?: string;
  skillIds?: string[];
};

// Получить все курсы с фильтрацией
export async function getCourses(filters?: CourseFilters) {
  try {
    const {
      category: categoryId,
      level,
      isFeatured,
      isFree,
      minPrice,
      maxPrice,
      status, // Убрали значение по умолчанию
      search,
      page = 1,
      limit = 100 // Увеличили лимит
    } = filters || {}

    const skip = (page - 1) * limit
    
    const where: any = {}

    // Фильтры
    if (categoryId) where.categoryId = categoryId
    if (level) where.level = level
    if (isFeatured !== undefined) where.isFeatured = isFeatured
    if (isFree !== undefined) where.isFree = isFree
    if (status) where.status = status // Только если передан явно
    
    // Фильтр по цене
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    
    // Поиск для SQLite (без mode: 'insensitive')
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { excerpt: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    // Сначала получить курсы
    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true, // Включаем категорию
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            chapters: {
              where: {
                lessons: {
                  some: {}
                }
              }
            },
            reviews: true,
            enrollments: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' } // Сначала новые
      ],
      skip,
      take: limit
    })

    // Затем получить общее количество и отзывы
    const [total, allReviews] = await Promise.all([
      prisma.course.count({ where }),
      prisma.courseReview.findMany({
        where: {
          course: {
            id: {
              in: courses.map(c => c.id)
            }
          }
        },
        select: {
          courseId: true,
          rating: true
        }
      })
    ])

    // Рассчитать средний рейтинг для каждого курса
    const courseRatings = allReviews.reduce((acc, review) => {
      if (!acc[review.courseId]) {
        acc[review.courseId] = { sum: 0, count: 0 }
      }
      acc[review.courseId].sum += review.rating
      acc[review.courseId].count += 1
      return acc
    }, {} as Record<string, { sum: number; count: number }>)

    // Добавить статистику к курсам
    const coursesWithStats = courses.map(course => {
      const ratings = courseRatings[course.id]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      return {
        ...course,
        averageRating,
        totalReviews: course._count.reviews,
        totalStudents: course._count.enrollments,
        totalChapters: course._count.chapters,
        // Для обратной совместимости добавляем category как строку
        categoryName: course.category?.name || '',
        categoryColor: course.category?.color || '#6366f1'
      }
    })

    return {
      courses: coursesWithStats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }

  } catch (error) {
    console.error('Error fetching courses:', error)
    return {
      courses: [],
      total: 0,
      page: 1,
      totalPages: 1,
      hasMore: false
    }
  }
}

// Получить курс по slug
export async function getCourseBySlug(slug: string, userId?: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: true, // Включаем категорию
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        },
        chapters: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        courseSkills: {
          include: {
            skill: true
          }
        },
        enrollments: userId ? {
          where: { userId }
        } : false,
        _count: {
          select: {
            reviews: true,
            enrollments: true
          }
        }
      }
    })

    if (!course) {
      throw new Error('Курс не найден')
    }

    // Получить отзывы отдельно
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: course.id },
      include: {
        user: {
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
    })

    // Рассчитать статистику
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 
      ? parseFloat((totalRating / reviews.length).toFixed(1))
      : 0

    const totalLessons = course.chapters?.reduce((sum, chapter) => sum + (chapter.lessons?.length || 0), 0) || 0
    const totalDuration = course.chapters?.reduce((sum, chapter) => {
      return sum + (chapter.lessons?.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0) || 0)
    }, 0) || 0

    const userEnrollment = course.enrollments?.[0] || null

    return {
      ...course,
      reviews,
      averageRating,
      totalLessons,
      totalDuration,
      totalReviews: course._count.reviews,
      totalStudents: course._count.enrollments,
      userEnrollment,
      skills: course.courseSkills?.map(cs => cs.skill) || [],
      categoryName: course.category?.name || ''
    }

  } catch (error) {
    console.error('Error fetching course:', error)
    throw new Error('Не удалось загрузить курс')
  }
}

// Создать курс
export async function createCourse(data: CourseFormData, instructorId: string) {
  try {
    // Генерируем уникальный slug если он уже существует
    let slug = data.slug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug }
      });

      if (!existingCourse) {
        isUnique = true;
      } else {
        // Добавляем суффикс к slug
        slug = `${data.slug}-${counter}`;
        counter++;
        
        // Защита от бесконечного цикла
        if (counter > 100) {
          throw new Error('Не удалось сгенерировать уникальный URL для курса');
        }
      }
    }

    // Подготовка данных
    const courseData: any = {
      title: data.title,
      description: data.description,
      excerpt: data.excerpt,
      thumbnailUrl: data.thumbnailUrl,
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
      price: data.isFree ? null : data.price,
      originalPrice: data.originalPrice,
      discountPercent: data.discountPercent,
      isFree: data.isFree,
      level: data.level,
      language: data.language,
      duration: data.duration,
      status: data.status,
      isFeatured: data.isFeatured,
      slug: slug, // Используем уникальный slug
      instructorId
    }

    // Если указана категория, добавляем связь
    if (data.categoryId) {
      courseData.category = {
        connect: { id: data.categoryId }
      }
    } else if (data.category) {
      // Если передано имя категории, находим или создаем
      const category = await prisma.category.findFirst({
        where: { 
          OR: [
            { slug: data.category },
            { name: data.category }
          ]
        }
      });
      
      if (category) {
        courseData.category = {
          connect: { id: category.id }
        }
      }
    }

    // Если указаны навыки, добавляем их
    if (data.skillIds && data.skillIds.length > 0) {
      courseData.courseSkills = {
        create: data.skillIds.map(skillId => ({ skillId }))
      }
    }

    const course = await prisma.course.create({
      data: courseData,
      include: {
        category: true,
        courseSkills: {
          include: {
            skill: true
          }
        }
      }
    })

    revalidatePath('/courses')
    revalidatePath(`/instructor/courses`)
    
    return {
      id: course.id,
      slug: course.slug,
      message: `Курс "${course.title}" создан с URL: /course/${course.slug}`
    }

  } catch (error: any) {
    console.error('Error creating course:', error)
    
    // Более информативное сообщение об ошибке
    if (error.code === 'P2002') {
      throw new Error('Курс с таким URL уже существует. Попробуйте изменить slug или название.');
    } else if (error.code === 'P2025') {
      throw new Error('Связанная запись не найдена. Проверьте выбранного преподавателя и категорию.');
    }
    
    throw new Error(error.message || 'Не удалось создать курс. Проверьте все обязательные поля.');
  }
}

// Обновить курс
export async function updateCourse(id: string, data: CourseFormData, instructorId: string) {
  try {
    // Проверяем, изменился ли slug
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    let slug = data.slug;
    
    // Если slug изменился, проверяем уникальность
    if (existingCourse?.slug !== data.slug) {
      let counter = 1;
      let isUnique = false;
      let baseSlug = data.slug;

      while (!isUnique) {
        const courseWithSameSlug = await prisma.course.findUnique({
          where: { slug }
        });

        if (!courseWithSameSlug || courseWithSameSlug.id === id) {
          isUnique = true;
        } else {
          slug = `${baseSlug}-${counter}`;
          counter++;
          
          if (counter > 100) {
            throw new Error('Не удалось сгенерировать уникальный URL для курса');
          }
        }
      }
    }

    // Подготовка данных для обновления
    const updateData: any = {
      title: data.title,
      description: data.description,
      excerpt: data.excerpt,
      thumbnailUrl: data.thumbnailUrl,
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
      price: data.isFree ? null : data.price,
      originalPrice: data.originalPrice,
      discountPercent: data.discountPercent,
      isFree: data.isFree,
      level: data.level,
      language: data.language,
      duration: data.duration,
      status: data.status,
      isFeatured: data.isFeatured,
      slug: slug,
      instructorId
    };

    // Обновляем связь с категорией если изменилась
    if (data.categoryId) {
      updateData.category = {
        connect: { id: data.categoryId }
      };
    } else if (data.category) {
      const category = await prisma.category.findFirst({
        where: { 
          OR: [
            { slug: data.category },
            { name: data.category }
          ]
        }
      });
      
      if (category) {
        updateData.category = {
          connect: { id: category.id }
        };
      } else {
        // Отключаем категорию если не найдена
        updateData.category = {
          disconnect: true
        };
      }
    }

    // Обновляем курс
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        courseSkills: {
          include: {
            skill: true
          }
        }
      }
    });

    revalidatePath('/courses');
    revalidatePath(`/course/${course.slug}`);
    revalidatePath(`/instructor/courses`);
    
    return {
      id: course.id,
      slug: course.slug,
      message: `Курс "${course.title}" обновлен`
    };

  } catch (error: any) {
    console.error('Error updating course:', error);
    
    if (error.code === 'P2002') {
      throw new Error('Курс с таким URL уже существует. Пожалуйста, выберите другой slug.');
    } else if (error.code === 'P2025') {
      throw new Error('Запись не найдена или у вас нет прав для редактирования этого курса.');
    }
    
    throw new Error(error.message || 'Не удалось обновить курс. Проверьте все поля.');
  }
}


export async function deleteCourse(id: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Проверки прав...
    
    // 2. Удаление в транзакции
    const deletedCourse = await tx.course.delete({
      where: { id }
    });

    // 3. Обновление статистики категории если нужно
    if (deletedCourse.categoryId) {
      await tx.category.update({
        where: { id: deletedCourse.categoryId },
        data: {
          coursesCount: { decrement: 1 },
          studentsCount: { decrement: deletedCourse.totalStudents },
          revenue: { decrement: (deletedCourse.price || 0) * deletedCourse.totalStudents }
        }
      });
    }

    return deletedCourse;
  });
}
// Получить категории курсов (старая версия для обратной совместимости)
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

// Получить популярные курсы
export async function getPopularCourses(limit = 6) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        category: true,
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
      orderBy: [
        { totalStudents: 'desc' },
        { averageRating: 'desc' }
      ],
      take: limit
    })

    return courses.map(course => ({
      ...course,
      averageRating: course.averageRating || 0,
      totalReviews: course.totalReviews || 0,
      totalStudents: course.totalStudents || 0,
      categoryName: course.category?.name || ''
    }))

  } catch (error) {
    console.error('Error fetching popular courses:', error)
    return []
  }
}

// Поиск курсов
export async function searchCourses(query: string, limit = 10) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { excerpt: { contains: query } },
          { tags: { contains: query } }
        ]
      },
      include: {
        category: true,
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
      orderBy: { totalStudents: 'desc' },
      take: limit
    })

    return courses.map(course => ({
      ...course,
      averageRating: course.averageRating || 0,
      totalReviews: course.totalReviews || 0,
      totalStudents: course.totalStudents || 0,
      categoryName: course.category?.name || ''
    }))

  } catch (error) {
    console.error('Error searching courses:', error)
    return []
  }
}

// Получить курсы инструктора
export async function getInstructorCourses(instructorId: string) {
  try {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            enrollments: true,
            chapters: {
              where: {
                lessons: {
                  some: {}
                }
              }
            }
          }
        },
        chapters: {
          include: {
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return courses.map(course => ({
      ...course,
      averageRating: course.averageRating || 0,
      totalReviews: course.totalReviews || 0,
      totalStudents: course.totalStudents || 0,
      totalLessons: course.chapters?.reduce((sum, chapter) => sum + chapter._count.lessons, 0) || 0,
      totalChapters: course._count.chapters || 0,
      categoryName: course.category?.name || ''
    }))

  } catch (error) {
    console.error('Error fetching instructor courses:', error)
    return []
  }
}

// ПРОСТАЯ ВЕРСИЯ - ВСЕ курсы
export async function getSimpleCourses() {
  try {
    // Убрали take для получения всех курсов
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        instructor: {
          select: {
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return {
      courses: courses.map(c => ({
        id: c.id,
        title: c.title || 'Без названия',
        description: c.description || '',
        category: c.category?.name || 'Без категории',
        price: c.price || 0,
        isFree: c.isFree || false,
        averageRating: c.averageRating || 0,
        totalStudents: c.totalStudents || 0,
        totalReviews: c.totalReviews || 0,
        instructor: c.instructor ? {
          username: c.instructor.username || 'Не указан',
          firstName: c.instructor.firstName || '',
          lastName: c.instructor.lastName || ''
        } : { username: 'Не указан', firstName: '', lastName: '' }
      })),
      total: courses.length
    };
  } catch (error) {
    console.error('Simple courses error:', error);
    return { courses: [], total: 0 };
  }
}

// Получить полный список категорий с информацией
export async function getFullCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { courses: true }
        }
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ]
    })
    
    return {
      success: true,
      categories
    }

  } catch (error) {
    console.error('Error fetching full categories:', error)
    return { 
      success: false, 
      error: 'Не удалось загрузить категории' 
    }
  }
}

// Функция для получения иерархических категорий
export async function getHierarchicalCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              include: {
                _count: {
                  select: { courses: true }
                }
              }
            },
            _count: {
              select: { courses: true }
            }
          }
        },
        _count: {
          select: { courses: true }
        }
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    // Фильтруем только родительские категории (у которых нет parentId)
    const rootCategories = categories.filter(cat => !cat.parentId)

    // Форматируем в нужную структуру
    const formatCategory = (cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count?.courses || 0,
      children: cat.children?.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        count: child._count?.courses || 0,
        children: child.children?.map(grandChild => ({
          id: grandChild.id,
          name: grandChild.name,
          slug: grandChild.slug,
          count: grandChild._count?.courses || 0
        })) || []
      })) || []
    })

    return rootCategories.map(formatCategory)

  } catch (error) {
    console.error('Error fetching hierarchical categories:', error)
    return []
  }
}