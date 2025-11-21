// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Очистка базы данных (осторожно!)
  await prisma.communityPost.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.learningResource.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.learningMilestone.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.projectSkill.deleteMany()
  await prisma.project.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.userStats.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Database cleaned')

  // 1. Создаем пользователей
  const users = await prisma.user.createMany({
    data: [
      {
        id: 'user-1',
        email: 'alex@example.com',
        username: 'alex_dev',
        password: '$2b$10$K7V6.8V9Z2W8V7N6K5J3M.O', // хеш пароля "password123"
        firstName: 'Alex',
        lastName: 'Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Full-stack developer passionate about React and Node.js',
        dailyGoal: 60,
        isPublic: true,
        role: 'USER'
      },
      {
        id: 'user-2',
        email: 'sarah@example.com',
        username: 'sarah_codes',
        password: '$2b$10$K7V6.8V9Z2W8V7N6K5J3M.O',
        firstName: 'Sarah',
        lastName: 'Miller',
        avatar: 'https://i.pravatar.cc/150?img=2',
        bio: 'Frontend developer specializing in React and TypeScript',
        dailyGoal: 45,
        isPublic: true,
        role: 'USER'
      },
      {
        id: 'user-3',
        email: 'mike@example.com',
        username: 'mike_mentor',
        password: '$2b$10$K7V6.8V9Z2W8V7N6K5J3M.O',
        firstName: 'Mike',
        lastName: 'Davis',
        avatar: 'https://i.pravatar.cc/150?img=3',
        bio: 'Senior developer and mentor with 10+ years experience',
        dailyGoal: 90,
        isPublic: true,
        role: 'MENTOR'
      },
      {
        id: 'user-4',
        email: 'admin@example.com',
        username: 'admin',
        password: '$2b$10$K7V6.8V9Z2W8V7N6K5J3M.O',
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://i.pravatar.cc/150?img=4',
        bio: 'System administrator',
        dailyGoal: 30,
        isPublic: false,
        role: 'ADMIN'
      }
    ]
  })

  console.log('👥 Users created')

  // 2. Создаем навыки
  const skills = await prisma.skill.createMany({
    data: [
      {
        id: 'skill-1',
        name: 'JavaScript',
        description: 'Programming language for web development',
        category: 'Programming',
        icon: '🚀',
        difficulty: 'INTERMEDIATE'
      },
      {
        id: 'skill-2',
        name: 'React',
        description: 'JavaScript library for building user interfaces',
        category: 'Frontend',
        icon: '⚛️',
        difficulty: 'INTERMEDIATE'
      },
      {
        id: 'skill-3',
        name: 'Node.js',
        description: 'JavaScript runtime environment',
        category: 'Backend',
        icon: '📦',
        difficulty: 'ADVANCED'
      },
      {
        id: 'skill-4',
        name: 'TypeScript',
        description: 'Typed JavaScript',
        category: 'Programming',
        icon: '📘',
        difficulty: 'INTERMEDIATE'
      },
      {
        id: 'skill-5',
        name: 'PostgreSQL',
        description: 'Relational database',
        category: 'Database',
        icon: '🐘',
        difficulty: 'BEGINNER'
      },
      {
        id: 'skill-6',
        name: 'Python',
        description: 'Versatile programming language',
        category: 'Programming',
        icon: '🐍',
        difficulty: 'BEGINNER'
      },
      {
        id: 'skill-7',
        name: 'Docker',
        description: 'Containerization platform',
        category: 'DevOps',
        icon: '🐳',
        difficulty: 'ADVANCED'
      },
      {
        id: 'skill-8',
        name: 'GraphQL',
        description: 'Query language for APIs',
        category: 'Backend',
        icon: '📊',
        difficulty: 'INTERMEDIATE'
      }
    ]
  })

  console.log('💪 Skills created')

  // 3. Создаем UserSkills (связь пользователей с навыками)
  const userSkills = await prisma.userSkill.createMany({
    data: [
      // Alex's skills
      {
        id: 'user-skill-1',
        userId: 'user-1',
        skillId: 'skill-1',
        level: 'PROFICIENT',
        experience: 120,
        isLearning: false,
        progress: 85
      },
      {
        id: 'user-skill-2',
        userId: 'user-1',
        skillId: 'skill-2',
        level: 'COMPETENT',
        experience: 80,
        isLearning: true,
        goalLevel: 'EXPERT',
        goalDate: new Date('2024-12-31'),
        progress: 65
      },
      {
        id: 'user-skill-3',
        userId: 'user-1',
        skillId: 'skill-3',
        level: 'BEGINNER',
        experience: 20,
        isLearning: true,
        progress: 30
      },
      // Sarah's skills
      {
        id: 'user-skill-4',
        userId: 'user-2',
        skillId: 'skill-2',
        level: 'EXPERT',
        experience: 200,
        isLearning: false,
        progress: 95
      },
      {
        id: 'user-skill-5',
        userId: 'user-2',
        skillId: 'skill-4',
        level: 'PROFICIENT',
        experience: 90,
        isLearning: true,
        progress: 75
      },
      // Mike's skills
      {
        id: 'user-skill-6',
        userId: 'user-3',
        skillId: 'skill-1',
        level: 'EXPERT',
        experience: 500,
        isLearning: false,
        progress: 98
      },
      {
        id: 'user-skill-7',
        userId: 'user-3',
        skillId: 'skill-3',
        level: 'EXPERT',
        experience: 400,
        isLearning: false,
        progress: 96
      }
    ]
  })

  console.log('🎯 UserSkills created')

  // 4. Создаем проекты
  const projects = await prisma.project.createMany({
    data: [
      {
        id: 'project-1',
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce application with React and Node.js',
        repository: 'https://github.com/alex_dev/ecommerce-platform',
        demoUrl: 'https://ecommerce-demo.com',
        status: 'COMPLETED',
        userId: 'user-1',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-20')
      },
      {
        id: 'project-2',
        title: 'Task Management App',
        description: 'React Native task management application',
        repository: 'https://github.com/sarah_codes/task-manager',
        status: 'IN_PROGRESS',
        userId: 'user-2',
        startDate: new Date('2024-03-01')
      },
      {
        id: 'project-3',
        title: 'API Gateway',
        description: 'Microservices API gateway with Node.js',
        repository: 'https://github.com/mike_mentor/api-gateway',
        status: 'COMPLETED',
        userId: 'user-3',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-15')
      }
    ]
  })

  console.log('🚀 Projects created')

  // 5. Создаем связи проектов с навыками
  const projectSkills = await prisma.projectSkill.createMany({
    data: [
      { id: 'ps-1', projectId: 'project-1', skillId: 'skill-1' },
      { id: 'ps-2', projectId: 'project-1', skillId: 'skill-2' },
      { id: 'ps-3', projectId: 'project-1', skillId: 'skill-3' },
      { id: 'ps-4', projectId: 'project-2', skillId: 'skill-2' },
      { id: 'ps-5', projectId: 'project-2', skillId: 'skill-4' },
      { id: 'ps-6', projectId: 'project-3', skillId: 'skill-3' },
      { id: 'ps-7', projectId: 'project-3', skillId: 'skill-8' }
    ]
  })

  console.log('🔗 ProjectSkills created')

  // 6. Создаем пути обучения
  const learningPaths = await prisma.learningPath.createMany({
    data: [
      {
        id: 'path-1',
        title: 'Full-Stack JavaScript Developer',
        description: 'Complete path to become a full-stack JavaScript developer',
        isPublic: true,
        userId: 'user-1'
      },
      {
        id: 'path-2',
        title: 'React Mastery',
        description: 'Master React and modern frontend development',
        isPublic: true,
        userId: 'user-2'
      }
    ]
  })

  console.log('🛣️ LearningPaths created')

  // 7. Создаем этапы обучения
  const milestones = await prisma.learningMilestone.createMany({
    data: [
      {
        id: 'milestone-1',
        title: 'JavaScript Fundamentals',
        description: 'Learn basic JavaScript concepts and syntax',
        order: 1,
        isCompleted: true,
        completedAt: new Date('2024-01-30'),
        learningPathId: 'path-1',
        skillId: 'skill-1'
      },
      {
        id: 'milestone-2',
        title: 'React Basics',
        description: 'Learn React components and state management',
        order: 2,
        isCompleted: true,
        completedAt: new Date('2024-02-28'),
        learningPathId: 'path-1',
        skillId: 'skill-2'
      },
      {
        id: 'milestone-3',
        title: 'Node.js Backend',
        description: 'Build server-side applications with Node.js',
        order: 3,
        isCompleted: false,
        learningPathId: 'path-1',
        skillId: 'skill-3'
      },
      {
        id: 'milestone-4',
        title: 'Advanced React Patterns',
        description: 'Learn advanced React patterns and best practices',
        order: 1,
        isCompleted: true,
        completedAt: new Date('2024-03-15'),
        learningPathId: 'path-2',
        skillId: 'skill-2'
      }
    ]
  })

  console.log('🎯 LearningMilestones created')

  // 8. Создаем учебные сессии
  const studySessions = await prisma.studySession.createMany({
    data: [
      {
        id: 'session-1',
        duration: 120,
        description: 'Learning React hooks and context API',
        date: new Date('2024-03-20'),
        sessionType: 'PRACTICE',
        efficiency: 4,
        userId: 'user-1',
        userSkillId: 'user-skill-2'
      },
      {
        id: 'session-2',
        duration: 90,
        description: 'Node.js express framework practice',
        date: new Date('2024-03-19'),
        sessionType: 'THEORY',
        efficiency: 3,
        userId: 'user-1',
        userSkillId: 'user-skill-3'
      },
      {
        id: 'session-3',
        duration: 180,
        description: 'TypeScript advanced types',
        date: new Date('2024-03-18'),
        sessionType: 'PRACTICE',
        efficiency: 5,
        userId: 'user-2',
        userSkillId: 'user-skill-5'
      }
    ]
  })

  console.log('📚 StudySessions created')

  // 9. Создаем цели
  const goals = await prisma.goal.createMany({
    data: [
      {
        id: 'goal-1',
        title: 'Master React Performance',
        description: 'Learn React optimization techniques and best practices',
        targetDate: new Date('2024-12-31'),
        isCompleted: false,
        userId: 'user-1',
        skillId: 'skill-2'
      },
      {
        id: 'goal-2',
        title: 'Learn TypeScript Advanced Features',
        description: 'Master advanced TypeScript types and patterns',
        targetDate: new Date('2024-08-31'),
        isCompleted: false,
        userId: 'user-2',
        skillId: 'skill-4'
      },
      {
        id: 'goal-3',
        title: 'Build Microservices with Node.js',
        description: 'Create a microservices architecture project',
        targetDate: new Date('2024-10-31'),
        isCompleted: true,
        completedAt: new Date('2024-05-15'),
        userId: 'user-3',
        skillId: 'skill-3'
      }
    ]
  })

  console.log('🎯 Goals created')

  // 10. Создаем ресурсы для обучения
  const learningResources = await prisma.learningResource.createMany({
    data: [
      {
        id: 'resource-1',
        title: 'React Official Documentation',
        description: 'Complete React documentation with examples',
        url: 'https://reactjs.org/docs',
        type: 'DOCUMENTATION',
        difficulty: 'BEGINNER',
        duration: 360,
        rating: 4.8,
        skillId: 'skill-2'
      },
      {
        id: 'resource-2',
        title: 'Node.js Design Patterns',
        description: 'Advanced Node.js patterns and best practices',
        url: 'https://example.com/nodejs-patterns',
        type: 'BOOK',
        difficulty: 'ADVANCED',
        duration: 1200,
        rating: 4.5,
        skillId: 'skill-3'
      },
      {
        id: 'resource-3',
        title: 'TypeScript in 50 Lessons',
        description: 'Video course covering TypeScript fundamentals',
        url: 'https://example.com/typescript-course',
        type: 'VIDEO',
        difficulty: 'INTERMEDIATE',
        duration: 480,
        rating: 4.7,
        skillId: 'skill-4'
      }
    ]
  })

  console.log('📖 LearningResources created')

  // 11. Создаем отзывы
  const reviews = await prisma.review.createMany({
    data: [
      {
        id: 'review-1',
        title: 'Excellent Mentor!',
        content: 'Mike provided great guidance on my Node.js project. Highly recommended!',
        rating: 5,
        reviewerId: 'user-1',
        revieweeId: 'user-3'
      },
      {
        id: 'review-2',
        title: 'Very Helpful',
        content: 'Sarah helped me understand React hooks better. Great teacher!',
        rating: 4,
        reviewerId: 'user-2',
        revieweeId: 'user-1'
      }
    ]
  })

  console.log('⭐ Reviews created')

  // 12. Создаем уведомления
  const notifications = await prisma.notification.createMany({
    data: [
      {
        id: 'notif-1',
        title: 'Goal Reminder',
        message: 'Your goal "Master React Performance" is due in 30 days',
        type: 'GOAL_REMINDER',
        isRead: false,
        userId: 'user-1'
      },
      {
        id: 'notif-2',
        title: 'Weekly Progress',
        message: 'You completed 85% of your weekly study goal!',
        type: 'WEEKLY_PROGRESS',
        isRead: true,
        userId: 'user-2'
      },
      {
        id: 'notif-3',
        title: 'Milestone Achieved',
        message: 'Congratulations! You completed "JavaScript Fundamentals"',
        type: 'MILESTONE_ACHIEVED',
        isRead: true,
        userId: 'user-1'
      }
    ]
  })

  console.log ('🔔 Notifications created')

  // 13. Создаем статистику пользователей
  const userStats = await prisma.userStats.createMany({
    data: [
      {
        id: 'stats-1',
        userId: 'user-1',
        totalStudyTime: 1560,
        completedGoals: 2,
        skillsLearned: 3,
        currentStreak: 7,
        longestStreak: 21,
        weeklyProgress: 65,
        monthlyProgress: 85
      },
      {
        id: 'stats-2',
        userId: 'user-2',
        totalStudyTime: 2340,
        completedGoals: 5,
        skillsLearned: 4,
        currentStreak: 14,
        longestStreak: 30,
        weeklyProgress: 90,
        monthlyProgress: 75
      },
      {
        id: 'stats-3',
        userId: 'user-3',
        totalStudyTime: 5820,
        completedGoals: 12,
        skillsLearned: 8,
        currentStreak: 45,
        longestStreak: 120,
        weeklyProgress: 95,
        monthlyProgress: 88
      }
    ]
  })

  console.log('📊 UserStats created')

  // 14. Создаем сообщества
  const communities = await prisma.community.createMany({
    data: [
      {
        id: 'community-1',
        name: 'JavaScript Developers',
        description: 'Community for JavaScript enthusiasts and professionals',
        isPublic: true,
        avatar: 'https://example.com/js-community.jpg'
      },
      {
        id: 'community-2',
        name: 'React Learners',
        description: 'Learn React together and share knowledge',
        isPublic: true,
        avatar: 'https://example.com/react-community.jpg'
      }
    ]
  })

  console.log('👥 Communities created')

  // 15. Создаем участников сообществ
  const communityMembers = await prisma.communityMember.createMany({
    data: [
      { id: 'cm-1', communityId: 'community-1', userId: 'user-1', role: 'MEMBER' },
      { id: 'cm-2', communityId: 'community-1', userId: 'user-2', role: 'MEMBER' },
      { id: 'cm-3', communityId: 'community-1', userId: 'user-3', role: 'ADMIN' },
      { id: 'cm-4', communityId: 'community-2', userId: 'user-1', role: 'MODERATOR' },
      { id: 'cm-5', communityId: 'community-2', userId: 'user-2', role: 'MEMBER' }
    ]
  })

  console.log('👥 CommunityMembers created')

  // 16. Создаем посты в сообществах
  const communityPosts = await prisma.communityPost.createMany({
    data: [
      {
        id: 'post-1',
        title: 'Best practices for React performance?',
        content: 'What are your favorite React performance optimization techniques?',
        communityId: 'community-2',
        authorId: 'user-1'
      },
      {
        id: 'post-2',
        title: 'JavaScript ES2024 Features',
        content: 'Let\'s discuss the new features coming in ES2024!',
        communityId: 'community-1',
        authorId: 'user-3'
      },
      {
        id: 'post-3',
        title: 'Node.js vs Deno - which to choose?',
        content: 'Looking for advice on choosing between Node.js and Deno for a new project.',
        communityId: 'community-1',
        authorId: 'user-2'
      }
    ]
  })

  console.log('📝 CommunityPosts created')

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })