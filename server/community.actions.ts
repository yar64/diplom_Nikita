// actions/community.actions.js
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCommunities() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true
              }
            }
          },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, communities }
  } catch (error) {
    return { success: false, error: 'Failed to fetch communities' }
  }
}

export async function getCommunity(id) {
  try {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        posts: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    })
    return { success: true, community }
  } catch (error) {
    return { success: false, error: 'Failed to fetch community' }
  }
}

export async function createCommunity(data) {
  try {
    const community = await prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        avatar: data.avatar,
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    })
    revalidatePath('/admin/community')
    return { success: true, community }
  } catch (error) {
    return { success: false, error: 'Failed to create community' }
  }
}

export async function updateCommunity(id, data) {
  try {
    const community = await prisma.community.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        avatar: data.avatar,
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    })
    revalidatePath('/admin/community')
    revalidatePath(`/community/${id}`)
    return { success: true, community }
  } catch (error) {
    return { success: false, error: 'Failed to update community' }
  }
}

export async function deleteCommunity(id) {
  try {
    await prisma.community.delete({
      where: { id },
    })
    revalidatePath('/admin/community')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete community' }
  }
}

export async function getCommunityMembers(communityId) {
  try {
    const members = await prisma.communityMember.findMany({
      where: { communityId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            firstName: true,
            lastName: true,
            bio: true
          }
        }
      },
      orderBy: { role: 'desc' }
    })
    return { success: true, members }
  } catch (error) {
    return { success: false, error: 'Failed to fetch community members' }
  }
}

export async function updateMemberRole(communityId, userId, role) {
  try {
    const member = await prisma.communityMember.update({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      },
      data: { role },
      include: {
        user: true
      }
    })
    revalidatePath('/admin/community')
    revalidatePath(`/community/${communityId}`)
    return { success: true, member }
  } catch (error) {
    return { success: false, error: 'Failed to update member role' }
  }
}

export async function removeMember(communityId, userId) {
  try {
    await prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      }
    })
    revalidatePath('/admin/community')
    revalidatePath(`/community/${communityId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove member' }
  }
}

export async function getCommunityPosts(communityId) {
  try {
    const posts = await prisma.communityPost.findMany({
      where: { communityId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, posts }
  } catch (error) {
    return { success: false, error: 'Failed to fetch community posts' }
  }
}

export async function deleteCommunityPost(id) {
  try {
    await prisma.communityPost.delete({
      where: { id },
    })
    revalidatePath('/admin/community')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete post' }
  }
}