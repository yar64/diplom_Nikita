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
            take: 3
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

    // Форматируем данные для User Growth Chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthKey = months[date.getMonth()];
      
      const monthData = userGrowthData.find(item => 
        item.createdAt.getMonth() === date.getMonth() && 
        item.createdAt.getFullYear() === date.getFullYear()
      );
      
      return {
        month: monthKey,
        users: monthData?._count._all || 0
      };
    });

    // Форматируем данные для Study Activity Chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const studyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayKey = days[date.getDay()];
      
      const dayData = studyActivityData.find(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === date.toDateString();
      });
      
      // Конвертируем минуты в часы с одним decimal
      const hours = dayData?._sum.duration ? Math.round((dayData._sum.duration / 60) * 10) / 10 : 0;
      
      return {
        date: dayKey,
        hours: hours
      };
    });

    // Форматируем данные для Skill Distribution Chart
    const skillDistribution = skillDistributionData.map(item => ({
      skill: item.category,
      count: item._count._all
    }));

    return {
      // Основная статистика (числа, а не строки)
      totalUsers: totalUsers,
      activeSkills: activeSkills,
      ongoingProjects: ongoingProjects,
      studyHours: Math.round((totalStudyTime._sum.duration || 0) / 60),
      
      // Табличные данные
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