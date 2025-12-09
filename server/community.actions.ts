// server/community.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'
import { revalidatePath } from 'next/cache'
import { 
  communityCreateSchema, 
  communityPostCreateSchema,
  validateWithSchema 
} from '../libary/validations'

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
    console.error('Failed to fetch communities:', error)
    return { success: false, error: 'Failed to fetch communities' }
  }
}

export async function getCommunity(id: string) {
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
                avatar: true,
                firstName: true,
                lastName: true,
                bio: true
              }
            }
          },
          orderBy: { role: 'desc' }
        },
        posts: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
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

    if (!community) {
      return { success: false, error: 'Community not found' }
    }

    return { success: true, community }
  } catch (error) {
    console.error('Failed to fetch community:', error)
    return { success: false, error: 'Failed to fetch community' }
  }
}

export async function createCommunity(data: any) {
  try {
    // Валидация данных
    const validation = validateWithSchema(communityCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const community = await prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic ?? true,
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

    revalidatePath('/communities')
    revalidatePath('/admin/communities')
    return { success: true, community }
  } catch (error: any) {
    console.error('Failed to create community:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Community name already exists' }
    }
    
    return { success: false, error: 'Failed to create community' }
  }
}

export async function updateCommunity(id: string, data: any) {
  try {
    const validation = validateWithSchema(communityCreateSchema.partial(), data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

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

    revalidatePath('/communities')
    revalidatePath('/admin/communities')
    revalidatePath(`/community/${id}`)
    return { success: true, community }
  } catch (error: any) {
    console.error('Failed to update community:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Community not found' }
    }
    
    return { success: false, error: 'Failed to update community' }
  }
}

export async function deleteCommunity(id: string) {
  try {
    await prisma.community.delete({
      where: { id },
    })

    revalidatePath('/communities')
    revalidatePath('/admin/communities')
    return { success: true, message: 'Community deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete community:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Community not found' }
    }
    
    return { success: false, error: 'Failed to delete community' }
  }
}

export async function joinCommunity(communityId: string, userId: string) {
  try {
    const member = await prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: 'MEMBER' as any
      },
      include: {
        community: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    revalidatePath('/communities')
    revalidatePath(`/community/${communityId}`)
    return { success: true, member }
  } catch (error: any) {
    console.error('Failed to join community:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Already a member of this community' }
    }
    
    return { success: false, error: 'Failed to join community' }
  }
}

export async function leaveCommunity(communityId: string, userId: string) {
  try {
    await prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      }
    })

    revalidatePath('/communities')
    revalidatePath(`/community/${communityId}`)
    return { success: true, message: 'Left community successfully' }
  } catch (error: any) {
    console.error('Failed to leave community:', error)
    return { success: false, error: 'Failed to leave community' }
  }
}

export async function getCommunityMembers(communityId: string) {
  try {
    const members = await prisma.communityMember.findMany({
      where: { communityId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
            bio: true
          }
        }
      },
      orderBy: [{ role: 'desc' }]
    })
    return { success: true, members }
  } catch (error) {
    console.error('Failed to fetch community members:', error)
    return { success: false, error: 'Failed to fetch community members' }
  }
}

export async function updateMemberRole(communityId: string, userId: string, role: string) {
  try {
    const member = await prisma.communityMember.update({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      },
      data: { role: role as any },
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

    revalidatePath('/admin/communities')
    revalidatePath(`/community/${communityId}`)
    return { success: true, member }
  } catch (error: any) {
    console.error('Failed to update member role:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Member not found' }
    }
    
    return { success: false, error: 'Failed to update member role' }
  }
}

export async function removeMember(communityId: string, userId: string) {
  try {
    await prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      }
    })

    revalidatePath('/admin/communities')
    revalidatePath(`/community/${communityId}`)
    return { success: true, message: 'Member removed successfully' }
  } catch (error: any) {
    console.error('Failed to remove member:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Member not found' }
    }
    
    return { success: false, error: 'Failed to remove member' }
  }
}

export async function getCommunityPosts(communityId: string) {
  try {
    const posts = await prisma.communityPost.findMany({
      where: { communityId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
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
    console.error('Failed to fetch community posts:', error)
    return { success: false, error: 'Failed to fetch community posts' }
  }
}

export async function createCommunityPost(data: any) {
  try {
    const validation = validateWithSchema(communityPostCreateSchema, data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const post = await prisma.communityPost.create({
      data: {
        title: data.title,
        content: data.content,
        communityId: data.communityId,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    revalidatePath(`/community/${data.communityId}`)
    return { success: true, post }
  } catch (error: any) {
    console.error('Failed to create community post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updateCommunityPost(id: string, data: any) {
  try {
    const validation = validateWithSchema(communityPostCreateSchema.partial(), data)
    if (!validation.success) {
      return { success: false, error: (validation as any).errors.join(', ') }
    }

    const post = await prisma.communityPost.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    revalidatePath(`/community/${post.communityId}`)
    return { success: true, post }
  } catch (error: any) {
    console.error('Failed to update community post:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Post not found' }
    }
    
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deleteCommunityPost(id: string) {
  try {
    const post = await prisma.communityPost.delete({
      where: { id },
    })

    revalidatePath('/admin/communities')
    revalidatePath(`/community/${post.communityId}`)
    return { success: true, message: 'Post deleted successfully' }
  } catch (error: any) {
    console.error('Failed to delete post:', error)
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Post not found' }
    }
    
    return { success: false, error: 'Failed to delete post' }
  }
}

export async function getUserCommunities(userId: string) {
  try {
    const memberships = await prisma.communityMember.findMany({
      where: { userId },
      include: {
        community: {
          include: {
            _count: {
              select: {
                members: true,
                posts: true
              }
            }
          }
        }
      }
    })

    const communities = memberships.map(membership => membership.community)
    return { success: true, communities }
  } catch (error) {
    console.error('Failed to fetch user communities:', error)
    return { success: false, error: 'Failed to fetch user communities' }
  }
}

export async function searchCommunities(query: string) {
  try {
    const communities = await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      },
      take: 10
    })
    return { success: true, communities }
  } catch (error) {
    console.error('Failed to search communities:', error)
    return { success: false, error: 'Failed to search communities' }
  }
}