// actions/goal.actions.js
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

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
            lastName: true
          }
        },
        skill: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, goals }
  } catch (error) {
    return { success: false, error: 'Failed to fetch goals' }
  }
}

export async function getGoal(id) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        user: true,
        skill: true
      }
    })
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to fetch goal' }
  }
}

export async function createGoal(data) {
  try {
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        targetDate: data.targetDate,
        isCompleted: data.isCompleted || false,
        completedAt: data.completedAt,
        userId: data.userId,
        skillId: data.skillId,
      },
      include: {
        user: true,
        skill: true
      }
    })
    revalidatePath('/admin/goals')
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to create goal' }
  }
}

export async function updateGoal(id, data) {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        targetDate: data.targetDate,
        isCompleted: data.isCompleted,
        completedAt: data.isCompleted ? new Date() : null,
        skillId: data.skillId,
      },
      include: {
        user: true,
        skill: true
      }
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/goals/${id}`)
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to update goal' }
  }
}

export async function deleteGoal(id) {
  try {
    await prisma.goal.delete({
      where: { id },
    })
    revalidatePath('/admin/goals')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete goal' }
  }
}

export async function completeGoal(id) {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
      include: {
        user: true,
        skill: true
      }
    })
    revalidatePath('/admin/goals')
    revalidatePath(`/goals/${id}`)
    return { success: true, goal }
  } catch (error) {
    return { success: false, error: 'Failed to complete goal' }
  }
}