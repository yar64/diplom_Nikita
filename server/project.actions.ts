// actions/project.actions.ts
'use server'

import { prisma } from '@/prisma/lib/prisma'
import { ProjectStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createProject(data: {
  title: string
  description?: string
  repository?: string
  demoUrl?: string
  status?: ProjectStatus
  userId: string
  startDate?: Date
  endDate?: Date
  skillIds?: string[]
}) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repository: data.repository,
        demoUrl: data.demoUrl,
        status: data.status,
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        skills: data.skillIds ? {
          create: data.skillIds.map(skillId => ({
            skillId: skillId,
          })),
        } : undefined,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    })
    revalidatePath('/projects')
    revalidatePath(`/users/${data.userId}/projects`)
    return { success: true, project }
  } catch (error) {
    return { success: false, error: 'Failed to create project' }
  }
}

export async function updateProject(id: string, data: {
  title?: string
  description?: string
  repository?: string
  demoUrl?: string
  status?: ProjectStatus
  startDate?: Date
  endDate?: Date
  skillIds?: string[]
}) {
  try {
    // Сначала обновляем основные данные проекта
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        repository: data.repository,
        demoUrl: data.demoUrl,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    })

    // Если переданы skillIds, обновляем связи
    if (data.skillIds) {
      // Удаляем существующие связи
      await prisma.projectSkill.deleteMany({
        where: { projectId: id },
      })

      // Создаем новые связи
      await prisma.projectSkill.createMany({
        data: data.skillIds.map(skillId => ({
          projectId: id,
          skillId: skillId,
        })),
      })
    }

    revalidatePath('/projects')
    revalidatePath(`/projects/${id}`)
    return { success: true, project }
  } catch (error) {
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.delete({
      where: { id },
    })
    revalidatePath('/projects')
    revalidatePath(`/users/${project.userId}/projects`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function getUserProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    })
    return { success: true, projects }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user projects' }
  }
}