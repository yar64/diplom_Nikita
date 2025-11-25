// actions/dashboard.actions.ts
'use server'

import { prisma } from '../prisma/lib/prisma'

export async function getDashboardStats() {
  try {
    const [
      totalUsers,
      activeSkills,
      ongoingProjects,
      totalStudyTime,
      recentUsers,
      popularSkills,
      userGrowthData,
      studyActivityData,
      skillDistributionData
    ] = await Promise.all([
      // Основная статистика
      prisma.user.count(),
      prisma.userSkill.count({ where: { isLearning: true } }),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.studySession.aggregate({ 
        _sum: { duration: true },
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Недавние пользователи
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          skills: {
            include: {
              skill: true
            },
            take: 2
          }
        }
      }),
      
      // Популярные навыки
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
      }),

      // Данные для графиков
      // User Growth (последние 6 месяцев)
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        _count: {
          _all: true
        }
      }),

      // Study Activity (последние 7 дней)
      prisma.studySession.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        },
        _sum: {
          duration: true
        }
      }),

      // Skill Distribution по категориям
      prisma.skill.groupBy({
        by: ['category'],
        _count: {
          _all: true
        }
      })
    ]);

    // Форматируем данные для графиков
    const userGrowth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthKey = date.toLocaleString('en', { month: 'short' });
      
      const monthData = userGrowthData.find(item => 
        item.createdAt.getMonth() === date.getMonth() && 
        item.createdAt.getFullYear() === date.getFullYear()
      );
      
      return {
        month: monthKey,
        users: monthData?._count._all || 0
      };
    });

    const studyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayKey = date.toLocaleString('en', { weekday: 'short' });
      
      const dayData = studyActivityData.find(item => 
        item.createdAt.toDateString() === date.toDateString()
      );
      
      return {
        date: dayKey,
        hours: Math.round((dayData?._sum.duration || 0) / 60 * 10) / 10 // Конвертируем минуты в часы
      };
    });

    const skillDistribution = skillDistributionData.map(item => ({
      category: item.category,
      count: item._count._all
    }));

    return {
      // Основная статистика
      totalUsers: totalUsers.toLocaleString(),
      activeSkills: activeSkills.toLocaleString(),
      ongoingProjects: ongoingProjects.toLocaleString(),
      studyHours: Math.round((totalStudyTime._sum.duration || 0) / 60).toLocaleString(),
      
      // Табличные данные (только данные, без JSX)
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        skills: user.skills.map(us => ({
          id: us.skill.id,
          name: us.skill.name
        }))
      })),
      
      popularSkills: popularSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        difficulty: skill.difficulty,
        userCount: skill._count.userSkills
      })),

      // Данные для графиков
      chartData: {
        userGrowth,
        studyActivity,
        skillDistribution
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}