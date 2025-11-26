// actions/user.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createUser(data: {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  timezone?: string
  dailyGoal?: number
  isPublic?: boolean
  role?: UserRole
}) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password, // В реальном приложении нужно хешировать!
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        bio: data.bio,
        timezone: data.timezone,
        dailyGoal: data.dailyGoal,
        isPublic: data.isPublic,
        role: data.role,
      },
    })
    revalidatePath('/users')
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(id: string, data: {
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  timezone?: string
  dailyGoal?: number
  isPublic?: boolean
  role?: UserRole
}) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    revalidatePath('/users')
    revalidatePath(`/users/${id}`)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        projects: true,
        learningPaths: true,
        stats: true,
      },
    })
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Failed to fetch user' }
  }
}

// Алиас для getUser с другим именем для совместимости
export async function getUserById(id: string) {
  return getUser(id)
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        stats: true,
        _count: {
          select: {
            skills: true,
            projects: true,
            sessions: true,
            goals: true,
            learningPaths: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, users }
  } catch (error) {
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function getUserProfile(id: string) {
  try {
    console.log('Fetching user profile for ID:', id);
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        stats: true,
        skills: {
          include: {
            skill: true,
          },
        },
        projects: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        learningPaths: {
          include: {
            milestones: {
              include: {
                skill: true
              }
            }
          }
        },
        sessions: {
          orderBy: { date: 'desc' },
          take: 10
        },
        goals: {
          where: {
            isCompleted: false
          },
          include: {
            skill: true
          }
        },
        settings: true,
        notificationSettings: true,
        privacySettings: true,
        appearanceSettings: true,
        learningPreferences: true,
        securitySettings: true,
        _count: {
          select: {
            skills: true,
            projects: true,
            sessions: true,
            goals: true,
            learningPaths: true,
            communityMemberships: true,
            communityPosts: true,
          }
        }
      },
    })

    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: 'Failed to fetch user profile: ' + error.message }
  }
}