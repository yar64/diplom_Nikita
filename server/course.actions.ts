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
  title: string
  description?: string
  excerpt?: string
  thumbnailUrl?: string
  categoryId?: string // Теперь это ID категории
  tags: string
  price?: number
  originalPrice?: number
  discountPercent?: number
  isFree: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  language: string
  duration?: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured: boolean
  slug: string
  skillIds?: string[]
}

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
      status = 'PUBLISHED',
      search,
      page = 1,
      limit = 12
    } = filters || {}

    const skip = (page - 1) * limit
    
    const where: any = {}

    // Фильтры
    if (categoryId) where.categoryId = categoryId
    if (level) where.level = level
    if (isFeatured !== undefined) where.isFeatured = isFeatured
    if (isFree !== undefined) where.isFree = isFree
    if (status) where.status = status
    
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
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
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
    // Проверить, существует ли slug
    const existingCourse = await prisma.course.findUnique({
      where: { slug: data.slug }
    })

    if (existingCourse) {
      throw new Error('Курс с таким URL уже существует')
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
      slug: data.slug,
      instructorId
    }

    // Если указана категория, добавляем связь
    if (data.categoryId) {
      courseData.category = {
        connect: { id: data.categoryId }
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
    
    return course

  } catch (error: any) {
    console.error('Error creating course:', error)
    throw new Error(error.message || 'Не удалось создать курс')
  }
}

// Обновить курс
export async function updateCourse(id: string, data: Partial<CourseFormData>, instructorId: string) {
  try {
    // Проверить владельца курса
    const course = await prisma.course.findUnique({
      where: { id }
    })

    if (!course) {
      throw new Error('Курс не найден')
    }

    if (course.instructorId !== instructorId) {
      throw new Error('У вас нет прав для редактирования этого курса')
    }

    // Если обновляется slug, проверить уникальность
    if (data.slug && data.slug !== course.slug) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug: data.slug }
      })

      if (existingCourse) {
        throw new Error('Курс с таким URL уже существует')
      }
    }

    // Подготовка данных для обновления
    const updateData: any = {}

    // Базовые поля
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.level !== undefined) updateData.level = data.level
    if (data.language !== undefined) updateData.language = data.language
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.status !== undefined) updateData.status = data.status
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.slug !== undefined) updateData.slug = data.slug

    // Цена
    if (data.isFree !== undefined) {
      updateData.isFree = data.isFree
      if (data.isFree) {
        updateData.price = null
      } else if (data.price !== undefined) {
        updateData.price = data.price
      }
    }

    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice
    if (data.discountPercent !== undefined) updateData.discountPercent = data.discountPercent

    // Категория
    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        updateData.category = {
          connect: { id: data.categoryId }
        }
      } else {
        // Удалить связь с категорией
        updateData.category = {
          disconnect: true
        }
      }
    }

    // Навыки
    if (data.skillIds !== undefined) {
      updateData.courseSkills = {
        deleteMany: {},
        create: data.skillIds.map(skillId => ({ skillId }))
      }
    }

    const updatedCourse = await prisma.course.update({
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
    })

    revalidatePath('/courses')
    revalidatePath(`/course/${updatedCourse.slug}`)
    revalidatePath(`/instructor/courses`)
    revalidatePath(`/instructor/courses/${id}`)

    return updatedCourse

  } catch (error: any) {
    console.error('Error updating course:', error)
    throw new Error(error.message || 'Не удалось обновить курс')
  }
}

// Удалить курс
export async function deleteCourse(id: string, instructorId: string) {
  try {
    // Проверить владельца курса
    const course = await prisma.course.findUnique({
      where: { id }
    })

    if (!course) {
      throw new Error('Курс не найден')
    }

    if (course.instructorId !== instructorId) {
      throw new Error('У вас нет прав для удаления этого курса')
    }

    await prisma.course.delete({
      where: { id }
    })

    revalidatePath('/courses')
    revalidatePath(`/instructor/courses`)
    
    return { success: true }

  } catch (error: any) {
    console.error('Error deleting course:', error)
    throw new Error(error.message || 'Не удалось удалить курс')
  }
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
      },
      take: 10
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