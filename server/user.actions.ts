// server/user.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

// Добавляем функцию для регистрации пользователя
export async function registerUser(data: {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  avatar?: string
}) {
  try {
    // Проверяем существование пользователя
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      return {
        success: false,
        error: existingUser.email === data.email
          ? 'Пользователь с таким email уже существует'
          : 'Пользователь с таким именем уже существует'
      }
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        role: UserRole.USER,
        isPublic: true,
        dailyGoal: 30,
        timezone: 'Europe/Moscow',

        // Создаем связанные настройки
        settings: {
          create: {
            emailNotifications: true,
            pushNotifications: true,
            goalReminders: true,
            weeklyReports: true,
            defaultDifficulty: 'BEGINNER',
            preferredResourceType: 'VIDEO'
          }
        },
        notificationSettings: {
          create: {
            emailFrequency: 'DAILY',
            digestFrequency: 'WEEKLY',
            notifyNewMessages: true,
            notifyGoalDue: true
          }
        },
        privacySettings: {
          create: {
            profileVisibility: 'PUBLIC',
            showEmail: false,
            showRealName: true,
            showStudySessions: true
          }
        },
        appearanceSettings: {
          create: {
            theme: 'LIGHT',
            accentColor: 'blue',
            fontSize: 'MEDIUM'
          }
        },
        learningPreferences: {
          create: {
            learningStyle: 'MIXED',
            preferredDifficulty: 'BEGINNER',
            dailyStudyGoal: 60,
            weeklyStudyGoal: 300
          }
        },
        securitySettings: {
          create: {
            twoFactorEnabled: false,
            loginAlerts: true,
            dataExportEnabled: true
          }
        },

        // Создаем статистику
        stats: {
          create: {
            totalStudyTime: 0,
            completedGoals: 0,
            skillsLearned: 0,
            currentStreak: 0,
            longestStreak: 0
          }
        }
      },
      include: {
        settings: true,
        stats: true
      }
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Ошибка при регистрации пользователя'
    }
  }
}

// Обновляем функцию createUser для админки
export async function createUser(data: {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  timezone?: string
  dailyGoal?: number
  isPublic?: boolean
  role?: UserRole
}) {
  try {
    // Проверяем существование пользователя
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь с таким email или именем уже существует'
      }
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        bio: data.bio,
        timezone: data.timezone,
        dailyGoal: data.dailyGoal,
        isPublic: data.isPublic,
        role: data.role,

        // Создаем связанные записи
        settings: {
          create: {}
        },
        notificationSettings: {
          create: {}
        },
        privacySettings: {
          create: {}
        },
        appearanceSettings: {
          create: {}
        },
        learningPreferences: {
          create: {}
        },
        securitySettings: {
          create: {}
        },
        stats: {
          create: {}
        }
      },
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось создать пользователя: ' + (error as Error).message
    }
  }
}

// Функция для входа пользователя
export async function loginUser(data: {
  email: string
  password: string
}) {
  try {
    // Ищем пользователя по email или username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.email }
        ]
      },
      include: {
        settings: true,
        stats: true
      }
    })

    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      }
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(data.password, user.password)

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Неверный пароль'
      }
    }

    // Возвращаем пользователя без пароля
    const { password, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Ошибка при входе'
    }
  }
}

// Обновляем функцию updateUser для работы с паролями
export async function updateUser(id: string, data: {
  email?: string
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  timezone?: string
  dailyGoal?: number
  isPublic?: boolean
  role?: UserRole
}) {
  try {
    const updateData: any = { ...data }

    // Если есть пароль, хешируем его
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${id}`)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Не удалось обновить пользователя' }
  }
}

// Добавляем функцию для получения текущего пользователя
export async function getCurrentUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
        stats: true,
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!user) {
      return { success: false, error: 'Пользователь не найден' }
    }

    const { password, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: 'Ошибка получения пользователя' }
  }
}

// Остальные функции оставляем без изменений
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Не удалось удалить пользователя' }
  }
}

export async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        projects: true,
        learningPaths: true,
        stats: true,
      },
    })
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Не удалось получить пользователя' }
  }
}

export async function getUserById(id: string) {
  return getUser(id)
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        stats: true,
        _count: {
          select: {
            skills: true,
            projects: true,
            sessions: true,
            goals: true,
            learningPaths: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, users }
  } catch (error) {
    return { success: false, error: 'Не удалось получить пользователей' }
  }
}

export async function getUserProfile(id: string) {
  try {
    console.log('Fetching user profile for ID:', id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        stats: true,
        skills: {
          include: {
            skill: true,
          },
        },
        projects: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        learningPaths: {
          include: {
            milestones: {
              include: {
                skill: true
              }
            }
          }
        },
        sessions: {
          orderBy: { date: 'desc' },
          take: 10
        },
        goals: {
          where: {
            isCompleted: false
          },
          include: {
            skill: true
          }
        },
        settings: true,
        notificationSettings: true,
        privacySettings: true,
        appearanceSettings: true,
        learningPreferences: true,
        securitySettings: true,
        _count: {
          select: {
            skills: true,
            projects: true,
            sessions: true,
            goals: true,
            learningPaths: true,
            communityMemberships: true,
            communityPosts: true,
          }
        }
      },
    })

    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return { success: false, error: 'Пользователь не найден' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: 'Не удалось получить профиль пользователя: ' + error.message }
  }
}