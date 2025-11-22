// actions/study-session.actions.ts
'use server'

import { prisma } from '@/prisma/lib/prisma'
import { SessionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createStudySession(data: {
  duration: number
  description?: string
  date?: Date
  sessionType?: SessionType
  efficiency?: number
  userId: string
  userSkillId: string
}) {
  try {
    const session = await prisma.studySession.create({
      data: {
        duration: data.duration,
        description: data.description,
        date: data.date,
        sessionType: data.sessionType,
        efficiency: data.efficiency,
        userId: data.userId,
        userSkillId: data.userSkillId,
      },
    })

    // Обновляем статистику пользователя
    await updateUserStats(data.userId)

    revalidatePath('/sessions')
    revalidatePath(`/users/${data.userId}/sessions`)
    return { success: true, session }
  } catch (error) {
    return { success: false, error: 'Failed to create study session' }
  }
}

export async function updateUserStats(userId: string) {
  try {
    const stats = await prisma.studySession.aggregate({
      where: { userId },
      _sum: {
        duration: true,
      },
      _count: {
        id: true,
      },
    })

    await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalStudyTime: stats._sum.duration || 0,
      },
      update: {
        totalStudyTime: stats._sum.duration || 0,
      },
    })
  } catch (error) {
    console.error('Failed to update user stats:', error)
  }
}

export async function getUserSessions(userId: string) {
  try {
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      include: {
        userSkill: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
    return { success: true, sessions }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user sessions' }
  }
}