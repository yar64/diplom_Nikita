// actions/learning-path.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createLearningPath(data: {
  title: string
  description?: string
  isPublic?: boolean
  userId: string
}) {
  try {
    const learningPath = await prisma.learningPath.create({
      data,
      include: {
        user: true,
        milestones: true,
      },
    })
    revalidatePath('/admin/learning-paths')
    revalidatePath(`/users/${data.userId}/learning-paths`)
    return { success: true, learningPath }
  } catch (error) {
    return { success: false, error: 'Failed to create learning path' }
  }
}

export async function updateLearningPath(id: string, data: {
  title?: string
  description?: string
  isPublic?: boolean
}) {
  try {
    const learningPath = await prisma.learningPath.update({
      where: { id },
      data,
      include: {
        user: true,
        milestones: true,
      },
    })
    revalidatePath('/admin/learning-paths')
    revalidatePath(`/learning-paths/${id}`)
    return { success: true, learningPath }
  } catch (error) {
    return { success: false, error: 'Failed to update learning path' }
  }
}

export async function deleteLearningPath(id: string) {
  try {
    const learningPath = await prisma.learningPath.delete({
      where: { id },
    })
    revalidatePath('/admin/learning-paths')
    revalidatePath(`/users/${learningPath.userId}/learning-paths`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete learning path' }
  }
}

export async function getLearningPath(id: string) {
  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        user: true,
        milestones: {
          include: { skill: true },
          orderBy: { order: 'asc' }
        },
      },
    })
    return { success: true, learningPath }
  } catch (error) {
    return { success: false, error: 'Failed to fetch learning path' }
  }
}

export async function getLearningPaths() {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        user: true,
        milestones: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, learningPaths }
  } catch (error) {
    return { success: false, error: 'Failed to fetch learning paths' }
  }
}

export async function getUserLearningPaths(userId: string) {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId },
      include: {
        milestones: {
          include: { skill: true },
          orderBy: { order: 'asc' }
        },
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, learningPaths }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user learning paths' }
  }
}