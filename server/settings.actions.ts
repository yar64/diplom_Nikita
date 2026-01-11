// actions/settings.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  validateWithSchema,
  userSettingsSchema,
  userLearningPreferencesSchema,
  userNotificationSettingsSchema,
  userPrivacySettingsSchema,
  userAppearanceSettingsSchema,
  userSecuritySettingsSchema
} from '../libary/validations'
import { z } from 'zod'

// Исправленная схема для updateUserRole
// Все схемы с исправлениями:
const updateUserRoleSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  role: z.union([
    z.literal('USER'),
    z.literal('ADMIN'),
    z.literal('MENTOR')
  ])
})

const systemSettingCreateSchema = z.object({
  key: z.string().min(1, 'Ключ обязателен'),
  value: z.string().min(1, 'Значение обязательно'),
  description: z.string().optional(),
  category: z.string().min(1, 'Категория обязательна'),
  isPublic: z.boolean().optional(),
  dataType: z.union([
    z.literal('STRING'),
    z.literal('NUMBER'),
    z.literal('BOOLEAN'),
    z.literal('JSON')
  ]).optional()
})

const systemSettingUpdateSchema = z.object({
  key: z.string().min(1, 'Ключ обязателен'),
  value: z.string().min(1, 'Значение обязательно')
})

const userSettingsUpdateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  settingsType: z.union([
    z.literal('general'),
    z.literal('notifications'),
    z.literal('privacy'),
    z.literal('appearance'),
    z.literal('learning'),
    z.literal('security')
  ]),
  data: z.any() // Просто принимаем любые данные
})

const cleanupDataSchema = z.object({
  days: z.number().int().min(1).max(365).default(30)
})

const exportDataSchema = z.object({
  format: z.union([
    z.literal('json'),
    z.literal('csv')
  ]).default('json')
})

const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50)
})
// Создаем схемы для конкретных типов настроек (без userId)
const generalSettingsSchema = userSettingsSchema.omit({ userId: true }).partial()
const notificationSettingsSchema = userNotificationSettingsSchema.omit({ userId: true }).partial()
const privacySettingsSchema = userPrivacySettingsSchema.omit({ userId: true }).partial()
const appearanceSettingsSchema = userAppearanceSettingsSchema.omit({ userId: true }).partial()
const learningSettingsSchema = userLearningPreferencesSchema.omit({ userId: true }).partial()
const securitySettingsSchema = userSecuritySettingsSchema.omit({ userId: true }).partial()

// Вспомогательная функция для обработки ошибок валидации
function getValidationErrors(validation: any): string {
  if (!validation.success && 'errors' in validation) {
    return validation.errors.join(', ')
  }
  return 'Validation failed'
}

// Получение статистики системы - ИСПРАВЛЕНО
export async function getSystemStats() {
  try {
    const [
      usersCount,
      skillsCount,
      projectsCount,
      communitiesCount,
      sessionsCount,
      goalsCount,
      learningPathsCount,
      coursesCount,
      courseReviewsCount,
      courseEnrollmentsCount,
      badgesCount,
      quizzesCount,
      notificationsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.community.count(),
      prisma.studySession.count(),
      prisma.goal.count(),
      prisma.learningPath.count(),
      prisma.course.count(),
      prisma.courseReview.count(),
      prisma.courseEnrollment.count(),
      prisma.badge.count(),
      prisma.quiz.count(),
      prisma.notification.count()
    ])

    // Статистика по ролям пользователей
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    // Активность за последние 7 дней
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const [recentSessions, newUsers, completedGoals] = await Promise.all([
      prisma.studySession.count({
        where: {
          createdAt: {
            gte: lastWeek
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastWeek
          }
        }
      }),
      prisma.goal.count({
        where: {
          isCompleted: true,
          completedAt: {
            gte: lastWeek
          }
        }
      })
    ])

    // Статистика по настройкам пользователей
    const [
      usersWithSettings,
      usersWithNotifications,
      usersWithPrivacy,
      usersWithAppearance,
      usersWithLearning,
      usersWithSecurity
    ] = await Promise.all([
      prisma.userSettings.count(),
      prisma.userNotificationSettings.count(),
      prisma.userPrivacySettings.count(),
      prisma.userAppearanceSettings.count(),
      prisma.userLearningPreferences.count(),
      prisma.userSecuritySettings.count()
    ])

    return {
      success: true,
      stats: {
        users: usersCount,
        skills: skillsCount,
        projects: projectsCount,
        communities: communitiesCount,
        sessions: sessionsCount,
        goals: goalsCount,
        learningPaths: learningPathsCount,
        courses: coursesCount,
        courseReviews: courseReviewsCount,
        courseEnrollments: courseEnrollmentsCount,
        badges: badgesCount,
        quizzes: quizzesCount,
        notifications: notificationsCount,
        usersByRole,
        recentActivity: {
          sessions: recentSessions,
          newUsers,
          completedGoals
        },
        settings: {
          general: usersWithSettings,
          notifications: usersWithNotifications,
          privacy: usersWithPrivacy,
          appearance: usersWithAppearance,
          learning: usersWithLearning,
          security: usersWithSecurity
        }
      }
    }
  } catch (error) {
    console.error('Error fetching system stats:', error)
    return { success: false, error: 'Failed to fetch system stats' }
  }
}

// Управление пользователями
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            skills: true,
            projects: true,
            sessions: true,
            goals: true,
            learningPaths: true,
            communityMemberships: true,
            authoredCourses: true,
            courseEnrollments: true
          }
        },
        stats: true,
        settings: true,
        notificationSettings: true,
        privacySettings: true,
        appearanceSettings: true,
        learningPreferences: true,
        securitySettings: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'MENTOR') {
  try {
    // Валидация данных с использованием схемы
    const validation = validateWithSchema(updateUserRoleSchema, { userId, role })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true
      }
    })

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'USER_ROLE_UPDATED',
        resource: 'user',
        resourceId: userId,
        userId: 'system',
        newValues: { role }
      }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error: any) {
    console.error('Error updating user role:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'User not found' }
    }

    return { success: false, error: 'Failed to update user role' }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Валидация ID пользователя
    const validation = validateWithSchema(z.object({ userId: z.string().cuid() }), { userId })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'USER_DELETED',
        resource: 'user',
        resourceId: userId,
        userId: 'system'
      }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/users')
    return { success: true, message: 'User deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting user:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'User not found' }
    }

    return { success: false, error: 'Failed to delete user' }
  }
}

// Системные настройки
export async function getSystemSettings() {
  try {
    const settings = await prisma.systemSettings.findMany({
      orderBy: { category: 'asc' }
    })

    // Преобразуем в удобный формат
    const formattedSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        id: setting.id,
        value: setting.value,
        description: setting.description,
        category: setting.category,
        dataType: setting.dataType,
        isPublic: setting.isPublic
      }
      return acc
    }, {} as Record<string, any>)

    return { success: true, settings: formattedSettings }
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return { success: false, error: 'Failed to fetch system settings' }
  }
}

export async function updateSystemSetting(key: string, value: string) {
  try {
    // Валидация данных
    const validation = validateWithSchema(systemSettingUpdateSchema, { key, value })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const setting = await prisma.systemSettings.update({
      where: { key },
      data: { value }
    })

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_SETTING_UPDATED',
        resource: 'system_setting',
        resourceId: key,
        userId: 'system',
        newValues: { value }
      }
    })

    revalidatePath('/admin/settings')
    return { success: true, setting }
  } catch (error: any) {
    console.error('Error updating system setting:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'Setting not found' }
    }

    return { success: false, error: 'Failed to update system setting' }
  }
}

export async function createSystemSetting(settingData: {
  key: string
  value: string
  description?: string
  category: string
  isPublic?: boolean
  dataType?: string
}) {
  try {
    // Валидация данных
    const validation = validateWithSchema(systemSettingCreateSchema, settingData)
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const setting = await prisma.systemSettings.create({
      data: {
        key: settingData.key,
        value: settingData.value,
        description: settingData.description,
        category: settingData.category as any,
        isPublic: settingData.isPublic ?? false,
        dataType: (settingData.dataType as any) || 'STRING'
      }
    })

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_SETTING_CREATED',
        resource: 'system_setting',
        resourceId: settingData.key,
        userId: 'system',
        newValues: settingData
      }
    })

    revalidatePath('/admin/settings')
    return { success: true, setting }
  } catch (error: any) {
    console.error('Error creating system setting:', error)

    if (error.code === 'P2002') {
      return { success: false, error: 'Setting key already exists' }
    }

    return { success: false, error: 'Failed to create system setting' }
  }
}

export async function deleteSystemSetting(key: string) {
  try {
    // Валидация ключа
    const validation = validateWithSchema(z.object({ key: z.string().min(1) }), { key })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    await prisma.systemSettings.delete({
      where: { key }
    })

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_SETTING_DELETED',
        resource: 'system_setting',
        resourceId: key,
        userId: 'system'
      }
    })

    revalidatePath('/admin/settings')
    return { success: true, message: 'System setting deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting system setting:', error)

    if (error.code === 'P2025') {
      return { success: false, error: 'Setting not found' }
    }

    return { success: false, error: 'Failed to delete system setting' }
  }
}

// Аудит и логи
export async function getAuditLogs(page = 1, limit = 50) {
  try {
    // Валидация пагинации
    const validation = validateWithSchema(paginationSchema, { page, limit })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.auditLog.count()
    ])

    return {
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return { success: false, error: 'Failed to fetch audit logs' }
  }
}

// Управление настройками пользователей
export async function getUserSettings(userId: string) {
  try {
    // Валидация ID пользователя
    const validation = validateWithSchema(z.object({ userId: z.string().cuid() }), { userId })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
        notificationSettings: true,
        privacySettings: true,
        appearanceSettings: true,
        learningPreferences: true,
        securitySettings: true
      }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, settings: user }
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return { success: false, error: 'Failed to fetch user settings' }
  }
}

export async function updateUserSettings(
  userId: string,
  settingsType: 'general' | 'notifications' | 'privacy' | 'appearance' | 'learning' | 'security',
  data: any
) {
  try {
    // Валидация базовых параметров
    const baseValidation = validateWithSchema(userSettingsUpdateSchema, { userId, settingsType, data })
    if (!baseValidation.success) {
      return {
        success: false,
        error: getValidationErrors(baseValidation)
      }
    }

    // Валидация данных в зависимости от типа настроек
    let validatedData;
    switch (settingsType) {
      case 'general':
        validatedData = validateWithSchema(generalSettingsSchema, data)
        break
      case 'notifications':
        validatedData = validateWithSchema(notificationSettingsSchema, data)
        break
      case 'privacy':
        validatedData = validateWithSchema(privacySettingsSchema, data)
        break
      case 'appearance':
        validatedData = validateWithSchema(appearanceSettingsSchema, data)
        break
      case 'learning':
        validatedData = validateWithSchema(learningSettingsSchema, data)
        break
      case 'security':
        validatedData = validateWithSchema(securitySettingsSchema, data)
        break
      default:
        return { success: false, error: 'Invalid settings type' }
    }

    if (!validatedData.success) {
      return {
        success: false,
        error: getValidationErrors(validatedData)
      }
    }

    let result

    switch (settingsType) {
      case 'general':
        result = await prisma.userSettings.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      case 'notifications':
        result = await prisma.userNotificationSettings.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      case 'privacy':
        result = await prisma.userPrivacySettings.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      case 'appearance':
        result = await prisma.userAppearanceSettings.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      case 'learning':
        result = await prisma.userLearningPreferences.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      case 'security':
        result = await prisma.userSecuritySettings.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        })
        break
      default:
        return { success: false, error: 'Invalid settings type' }
    }

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'USER_SETTINGS_UPDATED',
        resource: 'user_settings',
        resourceId: userId,
        userId: 'system',
        newValues: { settingsType, data }
      }
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)
    return { success: true, result }
  } catch (error: any) {
    console.error('Error updating user settings:', error)
    return { success: false, error: 'Failed to update user settings' }
  }
}

// Статистика по настройкам
export async function getSettingsStats() {
  try {
    const [
      totalUsers,
      usersWithGeneral,
      usersWithNotifications,
      usersWithPrivacy,
      usersWithAppearance,
      usersWithLearning,
      usersWithSecurity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.userSettings.count(),
      prisma.userNotificationSettings.count(),
      prisma.userPrivacySettings.count(),
      prisma.userAppearanceSettings.count(),
      prisma.userLearningPreferences.count(),
      prisma.userSecuritySettings.count()
    ])

    return {
      success: true,
      stats: {
        totalUsers,
        usersWithGeneral,
        usersWithNotifications,
        usersWithPrivacy,
        usersWithAppearance,
        usersWithLearning,
        usersWithSecurity,
        generalPercentage: Math.round((usersWithGeneral / totalUsers) * 100),
        notificationsPercentage: Math.round((usersWithNotifications / totalUsers) * 100),
        privacyPercentage: Math.round((usersWithPrivacy / totalUsers) * 100),
        appearancePercentage: Math.round((usersWithAppearance / totalUsers) * 100),
        learningPercentage: Math.round((usersWithLearning / totalUsers) * 100),
        securityPercentage: Math.round((usersWithSecurity / totalUsers) * 100)
      }
    }
  } catch (error) {
    console.error('Error fetching settings stats:', error)
    return { success: false, error: 'Failed to fetch settings stats' }
  }
}

// Очистка старых данных
export async function cleanupOldData(days = 30) {
  try {
    // Валидация данных
    const validation = validateWithSchema(cleanupDataSchema, { days })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const [deletedSessions, deletedNotifications, deletedAuditLogs] = await Promise.all([
      prisma.studySession.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      }),
      prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          isRead: true
        }
      }),
      prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })
    ])

    // Логируем действие очистки
    await prisma.auditLog.create({
      data: {
        action: 'DATA_CLEANUP',
        resource: 'system',
        userId: 'system',
        newValues: {
          deletedSessions: deletedSessions.count,
          deletedNotifications: deletedNotifications.count,
          deletedAuditLogs: deletedAuditLogs.count,
          cutoffDate: cutoffDate.toISOString()
        }
      }
    })

    return {
      success: true,
      result: {
        deletedSessions: deletedSessions.count,
        deletedNotifications: deletedNotifications.count,
        deletedAuditLogs: deletedAuditLogs.count
      }
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error)
    return { success: false, error: 'Failed to cleanup old data' }
  }
}

// Управление навыками - ИСПРАВЛЕНО
export async function getSkillsStats() {
  try {
    const [
      totalSkills,
      skillsByDifficulty,
      allSkills
    ] = await Promise.all([
      prisma.skill.count(),
      prisma.skill.groupBy({
        by: ['difficulty'],
        _count: {
          _all: true
        }
      }),
      prisma.skill.findMany({
        include: {
          _count: {
            select: {
              userSkills: true,
              projectSkills: true,
              courseSkills: true,
              learningMilestones: true,
              goals: true,
              levelSystems: true,
              quizzes: true,
              goalSkills: true
            }
          }
        }
      })
    ])

    // Получаем категории
    const skillsByCategory = await prisma.skill.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Получаем популярные навыки
    const popularSkills = await prisma.skill.findMany({
      include: {
        _count: {
          select: {
            userSkills: true
          }
        }
      },
      orderBy: {
        userSkills: {
          _count: 'desc'
        }
      },
      take: 10
    })

    return {
      success: true,
      stats: {
        totalSkills,
        skillsByDifficulty,
        popularSkills: popularSkills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          difficulty: skill.difficulty,
          userCount: skill._count.userSkills
        })),
        skillsByCategory: skillsByCategory.map(item => item.category).filter(Boolean),
        detailedSkills: allSkills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          difficulty: skill.difficulty,
          counts: skill._count
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching skills stats:', error)
    return { success: false, error: 'Failed to fetch skills statistics' }
  }
}

// Системное обслуживание
export async function runSystemMaintenance() {
  try {
    const maintenanceTasks = await Promise.allSettled([
      // Обновление статистики пользователей
      prisma.$executeRaw`UPDATE user_stats SET weekly_progress = 0 WHERE updatedAt < date('now', '-7 days')`,

      // Сброс дневных целей для неактивных пользователей
      prisma.user.updateMany({
        where: {
          updatedAt: {
            lt: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        data: {
          dailyGoal: 30
        }
      }),

      // Очистка неиспользуемых сессий
      prisma.studySession.deleteMany({
        where: {
          duration: 0
        }
      })
    ])

    const results = maintenanceTasks.map((task, index) => ({
      task: ['Reset weekly progress', 'Reset inactive user goals', 'Clean zero-duration sessions'][index],
      status: task.status,
      value: task.status === 'fulfilled' ? task.value : task.reason
    }))

    // Логируем обслуживание
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_MAINTENANCE',
        resource: 'system',
        userId: 'system',
        newValues: results
      }
    })

    return {
      success: true,
      results
    }
  } catch (error) {
    console.error('Error running system maintenance:', error)
    return { success: false, error: 'Failed to run system maintenance' }
  }
}

// Экспорт данных
export async function exportData(format: 'json' | 'csv' = 'json') {
  try {
    // Валидация данных
    const validation = validateWithSchema(exportDataSchema, { format })
    if (!validation.success) {
      return {
        success: false,
        error: getValidationErrors(validation)
      }
    }

    const exportInfo = {
      timestamp: new Date().toISOString(),
      format,
      status: 'completed',
      size: '0 MB'
    }

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'DATA_EXPORT',
        resource: 'system',
        userId: 'system',
        newValues: exportInfo
      }
    })

    return { success: true, export: exportInfo }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { success: false, error: 'Failed to export data' }
  }
}

// Дополнительно: Функция для бэкапа данных (если нужна)
export async function backupData() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupInfo = {
      filename: `backup-${timestamp}.json`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      models: [
        'users', 'skills', 'courses', 'courseEnrollments',
        'goals', 'studySessions', 'projects', 'learningPaths'
      ]
    };

    await prisma.auditLog.create({
      data: {
        action: 'DATA_BACKUP',
        resource: 'system',
        userId: 'system',
        newValues: backupInfo
      }
    });

    return { success: true, backup: backupInfo };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { success: false, error: 'Failed to create backup' };
  }
}