// actions/goal.actions.ts
'use server'

import { prisma } from '@/prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createGoal(data: {
  title: string
  description?: string
  targetDate: Date
  userId: string
  skillId: string
}) {
  try {
    const goal = await prisma.goal.create({
      data,
      include: {
        user: true,
        skill: true,
      },
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/users/${data.userId}/goals`)
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to create goal' }
  }
}

export async function updateGoal(id: string, data: {
  title?: string
  description?: string
  targetDate?: Date
  skillId?: string
}) {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data,
      include: {
        user: true,
        skill: true,
      },
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/goals/${id}`)
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to update goal' }
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
        user: true,
        skill: true,
      },
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/users/${goal.userId}/goals`)
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to complete goal' }
  }
}

export async function deleteGoal(id: string) {
  try {
    const goal = await prisma.goal.delete({
      where: { id },
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/users/${goal.userId}/goals`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete goal' }
  }
}

export async function getGoal(id: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        user: true,
        skill: true,
      },
    })
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to fetch goal' }
  }
}

export async function getGoals() {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        user: true,
        skill: true,
      },
      orderBy: { targetDate: 'asc' }
    })
    return { success: true, goals }
  } catch (error) {
    return { success: false, error: 'Failed to fetch goals' }
  }
}

export async function getUserGoals(userId: string) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        skill: true,
      },
      orderBy: { targetDate: 'asc' }
    })
    return { success: true, goals }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user goals' }
  }
}