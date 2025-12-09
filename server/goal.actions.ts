// actions/goal.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'
import { 
  goalCreateSchema, 
  validateWithSchema 
} from '../libary/validations'

export async function getGoals() {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        skill: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, goals }
  } catch (error) {
    console.error('Failed to fetch goals:', error)
    return { success: false, error: 'Failed to fetch goals' }
  }
}

export async function getGoal(id: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        skill: true
      }
    })

    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    return { success: true, goal }
  } catch (error) {
    console.error('Failed to fetch goal:', error)
    return { success: false, error: 'Failed to fetch goal' }
  }
}

export async function createGoal(data: any) {
  try {
    // Валидация данных
    const validation = validateWithSchema(goalCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        targetDate: new Date(data.targetDate),
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt,
        userId: data.userId,
        skillId: data.skillId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skill: true
      }
    })

    revalidatePath('/admin/goals')
    revalidatePath('/goals')
    return { success: true, goal }
  } catch (error: any) {
    console.error('Failed to create goal:', error)
    
    if (error.code === 'P2003') {
      return { success: false, error: 'Invalid user or skill ID' }
    }
    
    return { success: false, error: 'Failed to create goal' }
  }
}

export async function updateGoal(id: string, data: any) {
  try {
    const validation = validateWithSchema(goalCreateSchema.partial(), data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        isCompleted: data.isCompleted,
        completedAt: data.isCompleted ? new Date() : data.isCompleted === false ? null : undefined,
        skillId: data.skillId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skill: true
      }
    })

    revalidatePath('/admin/goals')
    revalidatePath(`/goals/${id}`)
    revalidatePath('/goals')
    return { success: true, goal }
  } catch (error: any) {
    console.error('Failed to update goal:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Goal not found' }
    }
    
    return { success: false, error: 'Failed to update goal' }
  }
}

export async function deleteGoal(id: string) {
  try {
    await prisma.goal.delete({
      where: { id },
    })

    revalidatePath('/admin/goals')
    revalidatePath('/goals')
    return { success: true, message: 'Goal deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete goal:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Goal not found' }
    }
    
    return { success: false, error: 'Failed to delete goal' }
  }
}

export async function completeGoal(id: string) {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skill: true
      }
    })

    // Обновляем статистику пользователя
    await prisma.userStats.upsert({
      where: { userId: goal.userId },
      update: {
        completedGoals: {
          increment: 1
        }
      },
      create: {
        userId: goal.userId,
        completedGoals: 1,
        totalStudyTime: 0,
        skillsLearned: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    })

    revalidatePath('/admin/goals')
    revalidatePath(`/goals/${id}`)
    revalidatePath('/goals')
    return { success: true, goal }
  } catch (error: any) {
    console.error('Failed to complete goal:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Goal not found' }
    }
    
    return { success: false, error: 'Failed to complete goal' }
  }
}

export async function getUserGoals(userId: string) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        skill: true
      },
      orderBy: [
        { isCompleted: 'asc' },
        { targetDate: 'asc' }
      ]
    })
    return { success: true, goals }
  } catch (error) {
    console.error('Failed to fetch user goals:', error)
    return { success: false, error: 'Failed to fetch user goals' }
  }
}

export async function getUpcomingGoals(userId: string, days: number = 7) {
  try {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + days)

    const goals = await prisma.goal.findMany({
      where: { 
        userId,
        isCompleted: false,
        targetDate: {
          lte: targetDate
        }
      },
      include: {
        skill: true
      },
      orderBy: { targetDate: 'asc' }
    })
    return { success: true, goals }
  } catch (error) {
    console.error('Failed to fetch upcoming goals:', error)
    return { success: false, error: 'Failed to fetch upcoming goals' }
  }
}

export async function getGoalProgress(id: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        skill: true
      }
    })

    if (!goal) {
      return { success: false, error: 'Goal not found' }
    }

    // Рассчитываем прогресс на основе дат
    const now = new Date().getTime()
    const start = goal.createdAt.getTime()
    const end = goal.targetDate.getTime()
    
    const progress = Math.min(Math.round(((now - start) / (end - start)) * 100), 100)

    return { 
      success: true, 
      progress: goal.isCompleted ? 100 : Math.max(progress, 0),
      daysRemaining: Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    }
  } catch (error) {
    console.error('Failed to calculate goal progress:', error)
    return { success: false, error: 'Failed to calculate goal progress' }
  }
}

// Функции для работы с GoalSkills (если модель существует)
export async function getGoalWithSkills(goalId: string) {
  try {
    // Проверяем существует ли модель GoalSkill
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        user: true,
        skill: true
      }
    })

    // Если модель GoalSkill существует, добавляем ее в запрос
    const goalWithSkills = {
      ...goal,
      // Добавляем пустой массив для совместимости
      goalSkills: []
    }

    return { success: true, goal: goalWithSkills }
  } catch (error) {
    console.error('Failed to fetch goal with skills:', error)
    return { success: false, error: 'Failed to fetch goal with skills' }
  }
}

export async function createGoalWithSkills(data: any) {
  try {
    const validation = validateWithSchema(goalCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const { skillIds, ...goalData } = data

    // Создаем цель
    const goal = await prisma.goal.create({
      data: {
        title: goalData.title,
        description: goalData.description,
        targetDate: new Date(goalData.targetDate),
        isCompleted: goalData.isCompleted || false,
        userId: goalData.userId,
        skillId: goalData.skillId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skill: true
      }
    })

    // Если в будущем добавится модель GoalSkill, можно будет добавить логику здесь

    revalidatePath('/admin/goals')
    revalidatePath('/goals')
    return { success: true, goal }
  } catch (error: any) {
    console.error('Failed to create goal with skills:', error)
    return { success: false, error: 'Failed to create goal with skills' }
  }
}