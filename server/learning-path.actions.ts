// actions/learning-path.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'
import { 
  learningPathCreateSchema, 
  validateWithSchema 
} from '../libary/validations'

export async function createLearningPath(data: {
  title: string
  description?: string
  isPublic?: boolean
  userId: string
}) {
  try {
    // Валидация данных
    const validation = validateWithSchema(learningPathCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic ?? false,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
    })
    
    revalidatePath('/admin/learning-paths')
    revalidatePath(`/users/${data.userId}/learning-paths`)
    revalidatePath('/learning-paths')
    return { success: true, learningPath }
  } catch (error: any) {
    console.error('Failed to create learning path:', error)
    return { success: false, error: 'Failed to create learning path' }
  }
}

export async function updateLearningPath(id: string, data: {
  title?: string
  description?: string
  isPublic?: boolean
}) {
  try {
    const validation = validateWithSchema(learningPathCreateSchema.partial(), data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const learningPath = await prisma.learningPath.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
    })
    
    revalidatePath('/admin/learning-paths')
    revalidatePath(`/learning-paths/${id}`)
    revalidatePath(`/users/${learningPath.userId}/learning-paths`)
    return { success: true, learningPath }
  } catch (error: any) {
    console.error('Failed to update learning path:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Learning path not found' }
    }
    
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
    revalidatePath('/learning-paths')
    return { success: true, message: 'Learning path deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete learning path:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Learning path not found' }
    }
    
    return { success: false, error: 'Failed to delete learning path' }
  }
}

export async function getLearningPath(id: string) {
  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true
          }
        },
        milestones: {
          include: { 
            skill: true 
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
    })

    if (!learningPath) {
      return { success: false, error: 'Learning path not found' }
    }

    return { success: true, learningPath }
  } catch (error) {
    console.error('Failed to fetch learning path:', error)
    return { success: false, error: 'Failed to fetch learning path' }
  }
}

export async function getLearningPaths() {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, learningPaths }
  } catch (error) {
    console.error('Failed to fetch learning paths:', error)
    return { success: false, error: 'Failed to fetch learning paths' }
  }
}

export async function getUserLearningPaths(userId: string) {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId },
      include: {
        milestones: {
          include: { 
            skill: true 
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, learningPaths }
  } catch (error) {
    console.error('Failed to fetch user learning paths:', error)
    return { success: false, error: 'Failed to fetch user learning paths' }
  }
}

export async function getPublicLearningPaths() {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            milestones: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, learningPaths }
  } catch (error) {
    console.error('Failed to fetch public learning paths:', error)
    return { success: false, error: 'Failed to fetch public learning paths' }
  }
}

export async function createMilestone(data: {
  title: string
  description?: string
  order: number
  learningPathId: string
  skillId: string
}) {
  try {
    const milestone = await prisma.learningMilestone.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order,
        learningPathId: data.learningPathId,
        skillId: data.skillId,
      },
      include: {
        skill: true,
        learningPath: {
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

    revalidatePath(`/learning-paths/${data.learningPathId}`)
    revalidatePath('/admin/learning-paths')
    return { success: true, milestone }
  } catch (error: any) {
    console.error('Failed to create milestone:', error)
    return { success: false, error: 'Failed to create milestone' }
  }
}

export async function updateMilestone(id: string, data: {
  title?: string
  description?: string
  order?: number
  skillId?: string
  isCompleted?: boolean
}) {
  try {
    const milestone = await prisma.learningMilestone.update({
      where: { id },
      data: {
        ...data,
        completedAt: data.isCompleted ? new Date() : data.isCompleted === false ? null : undefined
      },
      include: {
        skill: true,
        learningPath: {
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

    revalidatePath(`/learning-paths/${milestone.learningPathId}`)
    revalidatePath('/admin/learning-paths')
    return { success: true, milestone }
  } catch (error: any) {
    console.error('Failed to update milestone:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Milestone not found' }
    }
    
    return { success: false, error: 'Failed to update milestone' }
  }
}

export async function deleteMilestone(id: string) {
  try {
    const milestone = await prisma.learningMilestone.delete({
      where: { id },
    })

    revalidatePath(`/learning-paths/${milestone.learningPathId}`)
    revalidatePath('/admin/learning-paths')
    return { success: true, message: 'Milestone deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete milestone:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Milestone not found' }
    }
    
    return { success: false, error: 'Failed to delete milestone' }
  }
}

export async function completeMilestone(id: string) {
  try {
    const milestone = await prisma.learningMilestone.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
      include: {
        skill: true,
        learningPath: {
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

    revalidatePath(`/learning-paths/${milestone.learningPathId}`)
    revalidatePath('/admin/learning-paths')
    return { success: true, milestone }
  } catch (error: any) {
    console.error('Failed to complete milestone:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Milestone not found' }
    }
    
    return { success: false, error: 'Failed to complete milestone' }
  }
}

export async function reorderMilestones(learningPathId: string, milestones: { id: string, order: number }[]) {
  try {
    // Обновляем порядок всех milestone'ов
    const updatePromises = milestones.map(milestone =>
      prisma.learningMilestone.update({
        where: { id: milestone.id },
        data: { order: milestone.order }
      })
    )

    await Promise.all(updatePromises)

    const updatedLearningPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: {
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    revalidatePath(`/learning-paths/${learningPathId}`)
    revalidatePath('/admin/learning-paths')
    return { success: true, learningPath: updatedLearningPath }
  } catch (error) {
    console.error('Failed to reorder milestones:', error)
    return { success: false, error: 'Failed to reorder milestones' }
  }
}

export async function getLearningPathProgress(learningPathId: string) {
  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: {
        milestones: true
      }
    })

    if (!learningPath) {
      return { success: false, error: 'Learning path not found' }
    }

    const totalMilestones = learningPath.milestones.length
    const completedMilestones = learningPath.milestones.filter(m => m.isCompleted).length
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

    return {
      success: true,
      progress,
      completedMilestones,
      totalMilestones,
      isCompleted: progress === 100
    }
  } catch (error) {
    console.error('Failed to calculate learning path progress:', error)
    return { success: false, error: 'Failed to calculate learning path progress' }
  }
}

export async function duplicateLearningPath(learningPathId: string, userId: string) {
  try {
    const originalPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: {
        milestones: {
          include: {
            skill: true
          }
        }
      }
    })

    if (!originalPath) {
      return { success: false, error: 'Learning path not found' }
    }

    // Создаем копию learning path
    const duplicatedPath = await prisma.learningPath.create({
      data: {
        title: `${originalPath.title} (Copy)`,
        description: originalPath.description,
        isPublic: false, // Копии по умолчанию приватные
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    // Копируем milestones
    if (originalPath.milestones.length > 0) {
      await prisma.learningMilestone.createMany({
        data: originalPath.milestones.map(milestone => ({
          title: milestone.title,
          description: milestone.description,
          order: milestone.order,
          learningPathId: duplicatedPath.id,
          skillId: milestone.skillId,
          isCompleted: false, // Сбрасываем статус выполнения
          completedAt: null
        }))
      })
    }

    const completeDuplicatedPath = await prisma.learningPath.findUnique({
      where: { id: duplicatedPath.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        milestones: {
          include: {
            skill: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    revalidatePath(`/users/${userId}/learning-paths`)
    revalidatePath('/learning-paths')
    return { success: true, learningPath: completeDuplicatedPath }
  } catch (error) {
    console.error('Failed to duplicate learning path:', error)
    return { success: false, error: 'Failed to duplicate learning path' }
  }
}