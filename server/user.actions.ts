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
            mentorNotifications: true,          // добавьте это
            communityUpdates: true,            // добавьте это
            autoGenerateGoals: false,          // добавьте это
            studyReminders: true,              // добавьте это
            reminderTime: "20:00" 
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

// server/user.actions.ts
export async function deleteUser(id: string) {
  try {
    console.log('🔄 Удаление пользователя:', id);
    
    // 1. Сначала находим пользователя для информации
    const user = await prisma.user.findUnique({
      where: { id },
      select: { username: true, email: true }
    });
    
    if (!user) {
      return { 
        success: false, 
        error: 'Пользователь не найден' 
      };
    }
    
    console.log(`Удаляем пользователя: ${user.username}`);
    
    // 2. ОБРАБАТЫВАЕМ КУРСЫ, где пользователь инструктор
    try {
      // Способ 1: Передаем курсы другому пользователю
      const adminUser = await prisma.user.findFirst({
        where: { 
          id: { not: id }, // Не текущий пользователь
          role: { in: ['ADMIN', 'MENTOR'] } 
        }
      });
      
      if (adminUser) {
        // Передаем курсы администратору
        await prisma.course.updateMany({
          where: { instructorId: id },
          data: { instructorId: adminUser.id }
        });
        console.log(`✅ Курсы переданы ${adminUser.username}`);
      } else {
        // Способ 2: Обнуляем инструктора
        await prisma.course.updateMany({
          where: { instructorId: id },
          data: { instructorId: null }
        });
        console.log(`✅ Инструктор обнулен для курсов`);
      }
    } catch (courseError) {
      console.log('⚠️ Ошибка при обработке курсов:', courseError.message);
      // Продолжаем удаление даже если не удалось обработать курсы
    }
    
    // 3. Теперь удаляем пользователя
    await prisma.user.delete({
      where: { id },
    });
    
    console.log('✅ Пользователь успешно удален');
    
    revalidatePath('/admin/users');
    return { 
      success: true, 
      message: `Пользователь ${user.username} удален` 
    };
    
  } catch (error) {
    console.error('❌ Ошибка при удалении:', error);
    
    // Более детальный анализ ошибки
    let errorMessage = 'Не удалось удалить пользователя';
    
    if (error.code === 'P2003') {
      errorMessage = 'Пользователь связан с другими данными. Нужно обновить схему Prisma.';
    } else if (error.message.includes('foreign key constraint')) {
      errorMessage = 'Ошибка внешнего ключа. Пользователь является инструктором курсов.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code,
      details: error.message 
    };
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

export async function isUserAdmin(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        role: true,
        email: true,
        username: true 
      }
    });
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    const isAdmin = user.role === 'ADMIN';
    console.log(`Проверка администратора: ${user.email}, роль: ${user.role}, isAdmin: ${isAdmin}`);
    
    return {
      success: true,
      isAdmin,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
    
  } catch (error) {
    console.error('Error checking admin status:', error);
    return {
      success: false,
      isAdmin: false,
      error: 'Ошибка проверки прав администратора'
    };
  }
}

/**
 * Получает первого администратора из системы
 */
export async function getFirstAdminUser() {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    if (!admin) {
      throw new Error('В системе нет администраторов');
    }
    
    return {
      success: true,
      user: admin
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return {
      success: false,
      error: 'Не удалось найти администратора'
    };
  }
}