// actions/dashboard.actions.ts
'use server'

import { prisma } from '@/prisma/lib/prisma'

export async function getDashboardStats() {
  try {
    const [
      totalUsers,
      activeSkills,
      ongoingProjects,
      totalStudyTime,
      recentUsers,
      popularSkills
    ] = await Promise.all([
      prisma.user.count(),
      prisma.userSkill.count({ where: { isLearning: true } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.studySession.aggregate({ _sum: { duration: true } }),
      
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { skills: true }
          }
        }
      }),
      
      prisma.skill.findMany({
        take: 5,
        orderBy: {
          userSkills: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { userSkills: true }
          }
        }
      })
    ]);

    return {
      totalUsers: totalUsers.toLocaleString(),
      activeSkills: activeSkills.toLocaleString(),
      ongoingProjects: ongoingProjects.toLocaleString(),
      studyHours: Math.round((totalStudyTime._sum.duration || 0) / 60).toLocaleString(),
      recentUsers: recentUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        `${user._count.skills} skills`,
        'Active'
      ]),
      popularSkills: popularSkills.map(skill => [
        skill.name,
        skill.category,
        `${skill._count.userSkills} learners`,
        skill.difficulty
      ])
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}