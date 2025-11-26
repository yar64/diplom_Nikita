// actions/project.actions.js
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
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
        skills: {
          include: {
            skill: true
          }
        },
        _count: {
          select: {
            skills: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, projects }
  } catch (error) {
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProject(id) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
        skills: {
          include: {
            skill: true
          }
        }
      }
    })
    return { success: true, project }
  } catch (error) {
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function createProject(data) {
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
            skill: { connect: { id: skillId } }
          }))
        } : undefined
      },
      include: {
        user: true,
        skills: {
          include: {
            skill: true
          }
        }
      }
    })
    revalidatePath('/admin/projects')
    return { success: true, project }
  } catch (error) {
    return { success: false, error: 'Failed to create project' }
  }
}

export async function updateProject(id, data) {
  try {
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
      include: {
        user: true,
        skills: {
          include: {
            skill: true
          }
        }
      }
    })
    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${id}`)
    return { success: true, project }
  } catch (error) {
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(id) {
  try {
    await prisma.project.delete({
      where: { id },
    })
    revalidatePath('/admin/projects')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function addSkillToProject(projectId, skillId) {
  try {
    const projectSkill = await prisma.projectSkill.create({
      data: {
        projectId,
        skillId,
      },
      include: {
        skill: true
      }
    })
    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${projectId}`)
    return { success: true, projectSkill }
  } catch (error) {
    return { success: false, error: 'Failed to add skill to project' }
  }
}

export async function removeSkillFromProject(projectId, skillId) {
  try {
    await prisma.projectSkill.delete({
      where: {
        projectId_skillId: {
          projectId,
          skillId
        }
      }
    })
    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove skill from project' }
  }
}