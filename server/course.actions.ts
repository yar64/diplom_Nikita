'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

// Типы
export type CourseFilters = {
  category?: string
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
  category: string
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
      category,
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
    if (category) where.category = category
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
    
    // Поиск (без mode: 'insensitive' для SQLite)
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
        totalChapters: course._count.chapters
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
    throw new Error('Не удалось загрузить курсы')
  }
}

// Получить курс по slug
export async function getCourseBySlug(slug: string, userId?: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
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

    const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)
    const totalDuration = course.chapters.reduce((sum, chapter) => {
      return sum + chapter.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0)
    }, 0)

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
      skills: course.courseSkills.map(cs => cs.skill)
    }

  } catch (error) {
    console.error('Error fetching course:', error)
    throw new Error('Не удалось загрузить курс')
  }
}

// Получить курс по ID
export async function getCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
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

    return course

  } catch (error) {
    console.error('Error fetching course by id:', error)
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

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        excerpt: data.excerpt,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
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
        instructorId,
        ...(data.skillIds && data.skillIds.length > 0 && {
          courseSkills: {
            create: data.skillIds.map(skillId => ({ skillId }))
          }
        })
      },
      include: {
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

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        excerpt: data.excerpt,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        tags: data.tags,
        price: data.isFree !== undefined ? (data.isFree ? null : data.price) : undefined,
        originalPrice: data.originalPrice,
        discountPercent: data.discountPercent,
        isFree: data.isFree,
        level: data.level,
        language: data.language,
        duration: data.duration,
        status: data.status,
        isFeatured: data.isFeatured,
        slug: data.slug,
        ...(data.skillIds !== undefined && {
          courseSkills: {
            deleteMany: {},
            create: data.skillIds.map(skillId => ({ skillId }))
          }
        })
      },
      include: {
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

// Получить категории курсов
export async function getCourseCategories() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { category: true }
    })

    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))].sort()
    
    return categories

  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
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
            reviews: true,
            enrollments: true
          }
        }
      },
      orderBy: [
        { enrollments: { _count: 'desc' } },
        { averageRating: 'desc' }
      ],
      take: limit
    })

    // Получить рейтинги отдельно
    const courseIds = courses.map(c => c.id)
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        courseId: true,
        rating: true
      }
    })

    const courseRatings = reviews.reduce((acc, review) => {
      if (!acc[review.courseId]) {
        acc[review.courseId] = { sum: 0, count: 0 }
      }
      acc[review.courseId].sum += review.rating
      acc[review.courseId].count += 1
      return acc
    }, {} as Record<string, { sum: number; count: number }>)

    return courses.map(course => {
      const ratings = courseRatings[course.id]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      return {
        ...course,
        averageRating,
        totalReviews: course._count.reviews,
        totalStudents: course._count.enrollments
      }
    })

  } catch (error) {
    console.error('Error fetching popular courses:', error)
    return []
  }
}

// Получить рекомендуемые курсы для пользователя
export async function getRecommendedCourses(userId: string, limit = 6) {
  try {
    // Получить курсы пользователя
    const userEnrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            courseSkills: {
              include: {
                skill: true
              }
            }
          }
        }
      }
    })

    // Получить навыки из пройденных курсов
    const userSkillIds = new Set<string>()
    userEnrollments.forEach(enrollment => {
      enrollment.course.courseSkills.forEach(cs => {
        userSkillIds.add(cs.skillId)
      })
    })

    // Рекомендовать курсы с похожими навыками
    const recommendedCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        id: { notIn: userEnrollments.map(e => e.courseId) },
        ...(userSkillIds.size > 0 && {
          courseSkills: {
            some: {
              skillId: { in: Array.from(userSkillIds) }
            }
          }
        })
      },
      include: {
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
            reviews: true,
            enrollments: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { enrollments: { _count: 'desc' } }
      ],
      take: limit
    })

    // Получить рейтинги
    const courseIds = recommendedCourses.map(c => c.id)
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        courseId: true,
        rating: true
      }
    })

    const courseRatings = reviews.reduce((acc, review) => {
      if (!acc[review.courseId]) {
        acc[review.courseId] = { sum: 0, count: 0 }
      }
      acc[review.courseId].sum += review.rating
      acc[review.courseId].count += 1
      return acc
    }, {} as Record<string, { sum: number; count: number }>)

    return recommendedCourses.map(course => {
      const ratings = courseRatings[course.id]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      return {
        ...course,
        averageRating,
        totalReviews: course._count.reviews,
        totalStudents: course._count.enrollments
      }
    })

  } catch (error) {
    console.error('Error fetching recommended courses:', error)
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
          { tags: { contains: query } },
          { category: { contains: query } }
        ]
      },
      include: {
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
            reviews: true,
            enrollments: true
          }
        }
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: limit
    })

    // Получить рейтинги
    const courseIds = courses.map(c => c.id)
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        courseId: true,
        rating: true
      }
    })

    const courseRatings = reviews.reduce((acc, review) => {
      if (!acc[review.courseId]) {
        acc[review.courseId] = { sum: 0, count: 0 }
      }
      acc[review.courseId].sum += review.rating
      acc[review.courseId].count += 1
      return acc
    }, {} as Record<string, { sum: number; count: number }>)

    return courses.map(course => {
      const ratings = courseRatings[course.id]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      return {
        ...course,
        averageRating,
        totalReviews: course._count.reviews,
        totalStudents: course._count.enrollments
      }
    })

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

    // Получить рейтинги и рассчитать статистику
    const courseIds = courses.map(c => c.id)
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        courseId: true,
        rating: true
      }
    })

    const courseRatings = reviews.reduce((acc, review) => {
      if (!acc[review.courseId]) {
        acc[review.courseId] = { sum: 0, count: 0 }
      }
      acc[review.courseId].sum += review.rating
      acc[review.courseId].count += 1
      return acc
    }, {} as Record<string, { sum: number; count: number }>)

    return courses.map(course => {
      const ratings = courseRatings[course.id]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter._count.lessons, 0)

      return {
        ...course,
        averageRating,
        totalReviews: course._count.reviews,
        totalStudents: course._count.enrollments,
        totalLessons,
        totalChapters: course._count.chapters
      }
    })

  } catch (error) {
    console.error('Error fetching instructor courses:', error)
    return []
  }
}

// Обновить статистику курса
export async function updateCourseStats(courseId: string) {
  try {
    const [reviews, enrollments, chapters] = await Promise.all([
      prisma.courseReview.findMany({
        where: { courseId },
        select: { rating: true }
      }),
      prisma.courseEnrollment.findMany({
        where: { courseId }
      }),
      prisma.courseChapter.findMany({
        where: { courseId },
        include: {
          lessons: true
        }
      })
    ])

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 
      ? parseFloat((totalRating / reviews.length).toFixed(1))
      : 0

    const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)

    await prisma.course.update({
      where: { id: courseId },
      data: {
        averageRating,
        totalReviews: reviews.length,
        totalStudents: enrollments.length,
        totalLessons
      }
    })

    return { success: true }

  } catch (error) {
    console.error('Error updating course stats:', error)
    throw new Error('Не удалось обновить статистику курса')
  }
}

// ПРОСТАЯ ВЕРСИЯ - ВСЕ курсы (без фильтра по статусу)
export async function getSimpleCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {}, // ← ПУСТОЙ where, БЕЗ ФИЛЬТРА ПО СТАТУСУ!
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        price: true,
        isFree: true,
        averageRating: true,
        totalStudents: true,
        instructor: {
          select: {
            username: true,
            firstName: true,
            lastName: true
          }
        }
      },
      take: 10 // ограничиваем для теста
    });

    return {
      courses: courses.map(c => ({
        id: c.id,
        title: c.title || 'Без названия',
        description: c.description || '',
        category: c.category || 'Без категории',
        price: c.price || 0,
        isFree: c.isFree || false,
        averageRating: c.averageRating || 0,
        totalStudents: c.totalStudents || 0,
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