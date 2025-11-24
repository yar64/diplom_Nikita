// actions/user-skill.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { SkillLevel } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createUserSkill(data: {
  userId: string
  skillId: string
  level?: SkillLevel
  experience?: number
  isLearning?: boolean
  goalLevel?: SkillLevel
  goalDate?: Date
  progress?: number
}) {
  try {
    const userSkill = await prisma.userSkill.create({
      data: {
        userId: data.userId,
        skillId: data.skillId,
        level: data.level,
        experience: data.experience,
        isLearning: data.isLearning,
        goalLevel: data.goalLevel,
        goalDate: data.goalDate,
        progress: data.progress,
      },
    })
    revalidatePath('/user-skills')
    revalidatePath(`/users/${data.userId}`)
    return { success: true, userSkill }
  } catch (error) {
    return { success: false, error: 'Failed to create user skill' }
  }
}

export async function updateUserSkill(id: string, data: {
  level?: SkillLevel
  experience?: number
  isLearning?: boolean
  goalLevel?: SkillLevel
  goalDate?: Date
  progress?: number
}) {
  try {
    const userSkill = await prisma.userSkill.update({
      where: { id },
      data,
    })
    revalidatePath('/user-skills')
    revalidatePath(`/user-skills/${id}`)
    return { success: true, userSkill }
  } catch (error) {
    return { success: false, error: 'Failed to update user skill' }
  }
}

export async function deleteUserSkill(id: string) {
  try {
    const userSkill = await prisma.userSkill.delete({
      where: { id },
    })
    revalidatePath('/user-skills')
    revalidatePath(`/users/${userSkill.userId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete user skill' }
  }
}

export async function getUserSkills(userId: string) {
  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
        sessions: true,
      },
    })
    return { success: true, userSkills }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user skills' }
  }
}