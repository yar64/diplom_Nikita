// actions/project.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'
import { 
  projectCreateSchema, 
  validateWithSchema 
} from '../libary/validations'

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
            lastName: true,
            avatar: true
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
    console.error('Failed to fetch projects:', error)
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
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
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    return { success: true, project }
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function createProject(data: any) {
  try {
    // Валидация данных
    const validation = validateWithSchema(projectCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const { skillIds, ...projectData } = data

    // Создаем проект
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        repository: projectData.repository,
        demoUrl: projectData.demoUrl,
        status: projectData.status || 'IN_PROGRESS',
        userId: projectData.userId,
        startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
        endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    // Добавляем навыки если они предоставлены
    if (skillIds && skillIds.length > 0) {
      await prisma.projectSkill.createMany({
        data: skillIds.map((skillId: string) => ({
          projectId: project.id,
          skillId: skillId
        }))
      })

      // Получаем обновленный проект с навыками
      const updatedProject = await prisma.project.findUnique({
        where: { id: project.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          skills: {
            include: {
              skill: true
            }
          }
        }
      })

      revalidatePath('/admin/projects')
      revalidatePath('/projects')
      return { success: true, project: updatedProject }
    }

    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    return { success: true, project }
  } catch (error: any) {
    console.error('Failed to create project:', error)
    
    if (error.code === 'P2003') {
      return { success: false, error: 'Invalid user ID' }
    }
    
    return { success: false, error: 'Failed to create project' }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const validation = validateWithSchema(projectCreateSchema.partial(), data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const { skillIds, ...projectData } = data

    // Обновляем основную информацию проекта
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: projectData.title,
        description: projectData.description,
        repository: projectData.repository,
        demoUrl: projectData.demoUrl,
        status: projectData.status,
        startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
        endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    // Обновляем связанные навыки если предоставлены
    if (skillIds) {
      // Удаляем существующие связи
      await prisma.projectSkill.deleteMany({
        where: { projectId: id }
      })

      // Создаем новые связи
      if (skillIds.length > 0) {
        await prisma.projectSkill.createMany({
          data: skillIds.map((skillId: string) => ({
            projectId: id,
            skillId: skillId
          }))
        })
      }

      // Получаем обновленный проект
      const updatedProject = await prisma.project.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          skills: {
            include: {
              skill: true
            }
          }
        }
      })

      revalidatePath('/admin/projects')
      revalidatePath(`/projects/${id}`)
      revalidatePath('/projects')
      return { success: true, project: updatedProject }
    }

    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${id}`)
    revalidatePath('/projects')
    return { success: true, project }
  } catch (error: any) {
    console.error('Failed to update project:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Project not found' }
    }
    
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    return { success: true, message: 'Project deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete project:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Project not found' }
    }
    
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function addSkillToProject(projectId: string, skillId: string) {
  try {
    const projectSkill = await prisma.projectSkill.create({
      data: {
        projectId,
        skillId,
      },
      include: {
        skill: true,
        project: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    })

    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/projects')
    return { success: true, projectSkill }
  } catch (error: any) {
    console.error('Failed to add skill to project:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Skill already added to this project' }
    }
    
    if (error.code === 'P2003') {
      return { success: false, error: 'Invalid project or skill ID' }
    }
    
    return { success: false, error: 'Failed to add skill to project' }
  }
}

export async function removeSkillFromProject(projectId: string, skillId: string) {
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
    revalidatePath('/projects')
    return { success: true, message: 'Skill removed from project' }
  } catch (error: any) {
    console.error('Failed to remove skill from project:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Project skill not found' }
    }
    
    return { success: false, error: 'Failed to remove skill from project' }
  }
}

export async function getUserProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
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
    console.error('Failed to fetch user projects:', error)
    return { success: false, error: 'Failed to fetch user projects' }
  }
}

export async function getProjectsByStatus(status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED') {
  try {
    const projects = await prisma.project.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
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
    console.error('Failed to fetch projects by status:', error)
    return { success: false, error: 'Failed to fetch projects by status' }
  }
}

export async function updateProjectStatus(id: string, status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED') {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        }
      }
    })

    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${id}`)
    revalidatePath('/projects')
    return { success: true, project }
  } catch (error: any) {
    console.error('Failed to update project status:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Project not found' }
    }
    
    return { success: false, error: 'Failed to update project status' }
  }
}

export async function getProjectStats() {
  try {
    const [
      totalProjects,
      completedProjects,
      inProgressProjects,
      plannedProjects,
      projectsByStatus
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'PLANNED' } }),
      prisma.project.groupBy({
        by: ['status'],
        _count: {
          _all: true
        }
      })
    ])

    return {
      success: true,
      stats: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        plannedProjects,
        completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
        projectsByStatus: projectsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count._all
          return acc
        }, {} as Record<string, number>)
      }
    }
  } catch (error) {
    console.error('Failed to fetch project stats:', error)
    return { success: false, error: 'Failed to fetch project statistics' }
  }
}

export async function searchProjects(query: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
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
      take: 10
    })
    return { success: true, projects }
  } catch (error) {
    console.error('Failed to search projects:', error)
    return { success: false, error: 'Failed to search projects' }
  }
}