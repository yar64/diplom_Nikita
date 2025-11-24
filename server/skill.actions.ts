// actions/skill.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { Difficulty } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createSkill(data: {
  name: string
  description?: string
  category: string
  icon?: string
  difficulty?: Difficulty
}) {
  try {
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
        difficulty: data.difficulty,
      },
    })
    revalidatePath('/skills')
    return { success: true, skill }
  } catch (error) {
    return { success: false, error: 'Failed to create skill' }
  }
}

export async function updateSkill(id: string, data: {
  name?: string
  description?: string
  category?: string
  icon?: string
  difficulty?: Difficulty
}) {
  try {
    const skill = await prisma.skill.update({
      where: { id },
      data,
    })
    revalidatePath('/skills')
    revalidatePath(`/skills/${id}`)
    return { success: true, skill }
  } catch (error) {
    return { success: false, error: 'Failed to update skill' }
  }
}

export async function deleteSkill(id: string) {
  try {
    await prisma.skill.delete({
      where: { id },
    })
    revalidatePath('/skills')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete skill' }
  }
}

export async function getSkill(id: string) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        userSkills: true,
        learningResources: true,
      },
    })
    return { success: true, skill }
  } catch (error) {
    return { success: false, error: 'Failed to fetch skill' }
  }
}

export async function getSkills() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        _count: {
          select: {
            userSkills: true,
            learningResources: true,
          },
        },
      },
    })
    return { success: true, skills }
  } catch (error) {
    return { success: false, error: 'Failed to fetch skills' }
  }
}