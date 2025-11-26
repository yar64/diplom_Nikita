// actions/admin.actions.js
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

// Получение статистики системы
export async function getSystemStats() {
  try {
    const [
      usersCount,
      skillsCount,
      projectsCount,
      communitiesCount,
      sessionsCount,
      goalsCount,
      resourcesCount,
      learningPathsCount,
      reviewsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.community.count(),
      prisma.studySession.count(),
      prisma.goal.count(),
      prisma.learningResource.count(),
      prisma.learningPath.count(),
      prisma.review.count()
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
    
    const [recentSessions, newUsers] = await Promise.all([
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
      })
    ])

    // Статистика по настройкам пользователей
    const usersWithSettings = await prisma.userSettings.count()
    const usersWithNotifications = await prisma.userNotificationSettings.count()

    return {
      success: true,
      stats: {
        users: usersCount,
        skills: skillsCount,
        projects: projectsCount,
        communities: communitiesCount,
        sessions: sessionsCount,
        goals: goalsCount,
        resources: resourcesCount,
        learningPaths: learningPathsCount,
        reviews: reviewsCount,
        usersByRole,
        recentActivity: recentSessions,
        newUsers,
        usersWithSettings,
        usersWithNotifications
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
            communityMemberships: true
          }
        },
        stats: true,
        settings: true,
        notificationSettings: true,
        privacySettings: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function updateUserRole(userId, role) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
    revalidatePath('/admin')
    revalidatePath('/admin/settings')
    return { success: true, user }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'Failed to update user role' }
  }
}

export async function deleteUser(userId) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    revalidatePath('/admin')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
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
    }, {})

    return { success: true, settings: formattedSettings }
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return { success: false, error: 'Failed to fetch system settings' }
  }
}

export async function updateSystemSettings(key, value) {
  try {
    const setting = await prisma.systemSettings.update({
      where: { key },
      data: { value }
    })
    revalidatePath('/admin/settings')
    return { success: true, setting }
  } catch (error) {
    console.error('Error updating system setting:', error)
    return { success: false, error: 'Failed to update system setting' }
  }
}

export async function createSystemSetting(settingData) {
  try {
    const setting = await prisma.systemSettings.create({
      data: settingData
    })
    revalidatePath('/admin/settings')
    return { success: true, setting }
  } catch (error) {
    console.error('Error creating system setting:', error)
    return { success: false, error: 'Failed to create system setting' }
  }
}

// Аудит и логи
export async function getAuditLogs(page = 1, limit = 50) {
  try {
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
export async function getUserSettings(userId) {
  try {
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

export async function updateUserSettings(userId, settingsType, data) {
  try {
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

    revalidatePath('/admin/users')
    return { success: true, result }
  } catch (error) {
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
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const [deletedSessions, deletedNotifications] = await Promise.all([
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
      })
    ])

    return {
      success: true,
      result: {
        deletedSessions: deletedSessions.count,
        deletedNotifications: deletedNotifications.count
      }
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error)
    return { success: false, error: 'Failed to cleanup old data' }
  }
}

// Резервное копирование данных (заглушка)
export async function backupData() {
  try {
    // Здесь должна быть логика создания бэкапа
    // Пока возвращаем заглушку
    const backupInfo = {
      timestamp: new Date().toISOString(),
      size: '0 MB',
      status: 'completed'
    }

    // Логируем действие
    await prisma.auditLog.create({
      data: {
        action: 'BACKUP_CREATED',
        resource: 'system',
        userId: 'system', // или ID администратора
        newValues: backupInfo
      }
    })

    return { success: true, backup: backupInfo }
  } catch (error) {
    console.error('Error creating backup:', error)
    return { success: false, error: 'Failed to create backup' }
  }
}