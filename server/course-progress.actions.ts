'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

// Типы
export type LessonProgressData = {
  lessonId: string
  isCompleted: boolean
  timeSpent?: number
}

// Записаться на курс
export async function enrollInCourse(courseId: string, userId: string) {
  try {
    // Проверить, не записан ли уже
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    })

    if (existingEnrollment) {
      throw new Error('Вы уже записаны на этот курс')
    }

    // Проверить курс
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'PUBLISHED' }
    })

    if (!course) {
      throw new Error('Курс не найден или недоступен')
    }

    // Создать запись
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        purchasedAt: new Date()
      }
    })

    // Обновить статистику курса
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalStudents: { increment: 1 }
      }
    })

    revalidatePath(`/course/${course.slug}`)
    revalidatePath('/my-courses')
    revalidatePath('/dashboard')

    return enrollment

  } catch (error: any) {
    console.error('Error enrolling in course:', error)
    throw new Error(error.message || 'Не удалось записаться на курс')
  }
}

// Отписаться от курса
export async function cancelEnrollment(enrollmentId: string, userId: string) {
  try {
    // Проверить владение записью
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId }
    })

    if (!enrollment) {
      throw new Error('Запись не найдена')
    }

    if (enrollment.userId !== userId) {
      throw new Error('У вас нет прав для отмены этой записи')
    }

    await prisma.courseEnrollment.delete({
      where: { id: enrollmentId }
    })

    // Обновить статистику курса
    await prisma.course.update({
      where: { id: enrollment.courseId },
      data: {
        totalStudents: { decrement: 1 }
      }
    })

    revalidatePath('/my-courses')
    revalidatePath('/dashboard')

    return { success: true }

  } catch (error: any) {
    console.error('Error canceling enrollment:', error)
    throw new Error(error.message || 'Не удалось отписаться от курса')
  }
}

// Получить мои курсы
export async function getMyCourses(userId: string, filters?: {
  isCompleted?: boolean
}) {
  try {
    const where: any = { userId }
    
    if (filters?.isCompleted !== undefined) {
      where.isCompleted = filters.isCompleted
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where,
      include: {
        course: {
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
                reviews: true
              }
            }
          }
        }
      },
      orderBy: { purchasedAt: 'desc' }
    })

    // Получить рейтинги отдельно
    const courseIds = enrollments.map(e => e.courseId)
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

    return enrollments.map(enrollment => {
      const ratings = courseRatings[enrollment.courseId]
      const averageRating = ratings 
        ? parseFloat((ratings.sum / ratings.count).toFixed(1))
        : 0

      return {
        ...enrollment,
        course: {
          ...enrollment.course,
          averageRating,
          totalReviews: enrollment.course._count.reviews
        }
      }
    })

  } catch (error) {
    console.error('Error fetching user courses:', error)
    return []
  }
}

// Получить прогресс по курсу
export async function getCourseProgress(courseId: string, userId: string) {
  try {
    const [enrollment, lessons, progress] = await Promise.all([
      prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      }),
      prisma.courseLesson.findMany({
        where: {
          chapter: {
            courseId
          }
        },
        select: { id: true }
      }),
      prisma.courseProgress.findMany({
        where: {
          enrollment: {
            userId,
            courseId
          }
        }
      })
    ])

    if (!enrollment) {
      throw new Error('Вы не записаны на этот курс')
    }

    const totalLessons = lessons.length
    const completedLessons = progress.filter(p => p.isCompleted).length
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return {
      enrollment,
      progress: progressPercent,
      completedLessons,
      totalLessons,
      lessonProgress: progress
    }

  } catch (error: any) {
    console.error('Error fetching course progress:', error)
    throw new Error(error.message || 'Не удалось загрузить прогресс')
  }
}

// Отметить урок как пройденный
export async function markLessonComplete(data: LessonProgressData, userId: string) {
  try {
    const { lessonId, isCompleted, timeSpent = 0 } = data

    // Найти урок и его курс
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      throw new Error('Урок не найден')
    }

    // Найти запись на курс
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.chapter.course.id
        }
      }
    })

    if (!enrollment) {
      throw new Error('Вы не записаны на этот курс')
    }

    // Создать или обновить прогресс
    const progress = await prisma.courseProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId
        }
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        timeSpent: { increment: timeSpent }
      },
      create: {
        userId,
        lessonId,
        enrollmentId: enrollment.id,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        timeSpent
      }
    })

    // Обновить прогресс в записи на курс
    const totalLessons = await prisma.courseLesson.count({
      where: {
        chapter: {
          courseId: lesson.chapter.course.id
        }
      }
    })

    const completedLessons = await prisma.courseProgress.count({
      where: {
        enrollmentId: enrollment.id,
        isCompleted: true
      }
    })

    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    const isCourseCompleted = progressPercent === 100

    await prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercent,
        completedLessons,
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : null
      }
    })

    revalidatePath(`/course/${lesson.chapter.course.slug}/learn`)
    revalidatePath('/my-courses')
    revalidatePath('/dashboard')

    return progress

  } catch (error: any) {
    console.error('Error marking lesson complete:', error)
    throw new Error(error.message || 'Не удалось обновить прогресс')
  }
}

// Получить последний пройденный урок
export async function getLastLesson(userId: string, courseId: string) {
  try {
    const progress = await prisma.courseProgress.findFirst({
      where: {
        enrollment: {
          userId,
          courseId
        },
        isCompleted: true
      },
      include: {
        lesson: {
          include: {
            chapter: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    return progress

  } catch (error) {
    console.error('Error fetching last lesson:', error)
    return null
  }
}

// Получить статистику обучения
export async function getLearningStats(userId: string) {
  try {
    const [enrollments, progress] = await Promise.all([
      prisma.courseEnrollment.findMany({
        where: { userId },
        include: {
          course: true
        }
      }),
      prisma.courseProgress.findMany({
        where: { userId },
        include: {
          lesson: true
        }
      })
    ])

    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(e => e.isCompleted).length
    const inProgressCourses = totalCourses - completedCourses
    
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0)
    const completedLessons = progress.filter(p => p.isCompleted).length

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent,
      completedLessons,
      averageProgress: totalCourses > 0 
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
        : 0
    }

  } catch (error) {
    console.error('Error fetching learning stats:', error)
    return {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalTimeSpent: 0,
      completedLessons: 0,
      averageProgress: 0
    }
  }
}

// Получить детальный прогресс по всем урокам курса
export async function getDetailedCourseProgress(courseId: string, userId: string) {
  try {
    const [enrollment, chapters, progress] = await Promise.all([
      prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId }
        }
      }),
      prisma.courseChapter.findMany({
        where: { courseId },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              order: true,
              duration: true
            }
          }
        },
        orderBy: { order: 'asc' }
      }),
      prisma.courseProgress.findMany({
        where: {
          enrollment: {
            userId,
            courseId
          }
        }
      })
    ])

    if (!enrollment) {
      throw new Error('Вы не записаны на этот курс')
    }

    // Создаем карту прогресса по урокам
    const progressMap = new Map(progress.map(p => [p.lessonId, p]))

    // Добавляем информацию о прогрессе к каждому уроку
    const chaptersWithProgress = chapters.map(chapter => ({
      ...chapter,
      lessons: chapter.lessons.map(lesson => ({
        ...lesson,
        progress: progressMap.get(lesson.id) || null
      }))
    }))

    // Считаем общую статистику
    const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0)
    const completedLessons = progress.filter(p => p.isCompleted).length
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return {
      enrollment,
      progress: progressPercent,
      completedLessons,
      totalLessons,
      chapters: chaptersWithProgress,
      lastActivity: enrollment.updatedAt
    }

  } catch (error: any) {
    console.error('Error fetching detailed course progress:', error)
    throw new Error(error.message || 'Не удалось загрузить детальный прогресс')
  }
}

// Получить активные курсы (текущие, незавершенные)
export async function getActiveCourses(userId: string) {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId,
        isCompleted: false
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return enrollments

  } catch (error) {
    console.error('Error fetching active courses:', error)
    return []
  }
}

// Получить завершенные курсы
export async function getCompletedCourses(userId: string) {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId,
        isCompleted: true
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    return enrollments

  } catch (error) {
    console.error('Error fetching completed courses:', error)
    return []
  }
}

// Получить рекомендации для продолжения обучения
export async function getLearningRecommendations(userId: string, limit = 3) {
  try {
    // Получить пройденные курсы пользователя
    const completedEnrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId,
        isCompleted: true
      },
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

    // Собрать навыки из пройденных курсов
    const completedSkillIds = new Set<string>()
    completedEnrollments.forEach(enrollment => {
      enrollment.course.courseSkills.forEach(cs => {
        completedSkillIds.add(cs.skillId)
      })
    })

    // Получить курсы, которые развивают эти навыки дальше
    const recommendedCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        id: { notIn: completedEnrollments.map(e => e.courseId) },
        courseSkills: {
          some: {
            skillId: { in: Array.from(completedSkillIds) }
          }
        }
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
    console.error('Error fetching learning recommendations:', error)
    return []
  }
}

// Обновить время, проведенное на уроке
export async function updateLessonTimeSpent(lessonId: string, userId: string, timeSpent: number) {
  try {
    // Найти урок и его курс
    const lesson = await prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      throw new Error('Урок не найден')
    }

    // Найти запись на курс
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.chapter.course.id
        }
      }
    })

    if (!enrollment) {
      throw new Error('Вы не записаны на этот курс')
    }

    // Обновить или создать прогресс (без lastViewedAt)
    await prisma.courseProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId
        }
      },
      update: {
        timeSpent: { increment: timeSpent }
      },
      create: {
        userId,
        lessonId,
        enrollmentId: enrollment.id,
        timeSpent
      }
    })

    return { success: true }

  } catch (error: any) {
    console.error('Error updating lesson time spent:', error)
    throw new Error(error.message || 'Не удалось обновить время урока')
  }
}

// Проверить, записан ли пользователь на курс
export async function checkEnrollment(courseId: string, userId: string) {
  try {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    })

    return {
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    }

  } catch (error) {
    console.error('Error checking enrollment:', error)
    return {
      isEnrolled: false,
      enrollment: null
    }
  }
}

// Получить прогресс по всем курсам для дашборда
export async function getDashboardProgress(userId: string) {
  try {
    const [enrollments, stats] = await Promise.all([
      getMyCourses(userId),
      getLearningStats(userId)
    ])

    // Получить курсы с самым высоким прогрессом
    const sortedByProgress = [...enrollments].sort((a, b) => b.progress - a.progress).slice(0, 5)

    // Получить недавно начатые курсы
    const recentCourses = [...enrollments]
      .filter(e => !e.isCompleted)
      .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
      .slice(0, 3)

    return {
      overallStats: stats,
      topProgressCourses: sortedByProgress,
      recentCourses,
      totalEnrollments: enrollments.length
    }

  } catch (error) {
    console.error('Error fetching dashboard progress:', error)
    return {
      overallStats: {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalTimeSpent: 0,
        completedLessons: 0,
        averageProgress: 0
      },
      topProgressCourses: [],
      recentCourses: [],
      totalEnrollments: 0
    }
  }
}

// Получить следующую рекомендацию для обучения
export async function getNextLessonRecommendation(userId: string) {
  try {
    // Получить активные курсы
    const activeCourses = await getActiveCourses(userId)
    
    if (activeCourses.length === 0) {
      return null
    }

    // Для каждого активного курса найти следующий непройденный урок
    const recommendations = []
    
    for (const enrollment of activeCourses) {
      const detailedProgress = await getDetailedCourseProgress(enrollment.courseId, userId)
      
      // Найти первый непройденный урок
      for (const chapter of detailedProgress.chapters) {
        for (const lesson of chapter.lessons) {
          if (!lesson.progress || !lesson.progress.isCompleted) {
            recommendations.push({
              course: enrollment.course,
              chapter,
              lesson,
              enrollmentProgress: enrollment.progress
            })
            break
          }
        }
        if (recommendations.length > 0) break
      }
    }

    // Вернуть первую рекомендацию
    return recommendations.length > 0 ? recommendations[0] : null

  } catch (error) {
    console.error('Error getting next lesson recommendation:', error)
    return null
  }
}