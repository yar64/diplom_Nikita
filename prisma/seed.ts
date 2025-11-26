// prisma/seed.ts
import { PrismaClient, SkillLevel, ProjectStatus, SessionType, LearningStyle } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Очистка базы данных
  await prisma.auditLog.deleteMany()
  await prisma.systemSettings.deleteMany()
  await prisma.userSecuritySettings.deleteMany()
  await prisma.userLearningPreferences.deleteMany()
  await prisma.userAppearanceSettings.deleteMany()
  await prisma.userPrivacySettings.deleteMany()
  await prisma.userNotificationSettings.deleteMany()
  await prisma.userSettings.deleteMany()
  await prisma.communityPost.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.review.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.userStats.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.learningMilestone.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.learningResource.deleteMany()
  await prisma.projectSkill.deleteMany()
  await prisma.project.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.user.deleteMany()

  // Создание навыков на разные темы
  console.log('🎯 Creating skills...')
  const skills = await prisma.skill.createMany({
    data: [
      // Программирование
      {
        name: 'JavaScript',
        description: 'Язык программирования для веб-разработки',
        category: 'Программирование',
        icon: '💻',
        difficulty: 'INTERMEDIATE'
      },
      {
        name: 'Python',
        description: 'Универсальный язык программирования',
        category: 'Программирование',
        icon: '🐍',
        difficulty: 'BEGINNER'
      },
      {
        name: 'React',
        description: 'Библиотека для создания пользовательских интерфейсов',
        category: 'Frontend',
        icon: '⚛️',
        difficulty: 'INTERMEDIATE'
      },
      {
        name: 'Node.js',
        description: 'Серверная платформа на JavaScript',
        category: 'Backend',
        icon: '📦',
        difficulty: 'ADVANCED'
      },
      
      // Дизайн
      {
        name: 'UI/UX Design',
        description: 'Дизайн пользовательских интерфейсов и опыта',
        category: 'Дизайн',
        icon: '🎨',
        difficulty: 'INTERMEDIATE'
      },
      {
        name: 'Figma',
        description: 'Инструмент для дизайна интерфейсов',
        category: 'Дизайн',
        icon: '🎯',
        difficulty: 'BEGINNER'
      },
      
      // Языки
      {
        name: 'Английский язык',
        description: 'Английский язык для IT-специалистов',
        category: 'Языки',
        icon: '🇬🇧',
        difficulty: 'INTERMEDIATE'
      },
      {
        name: 'Испанский язык',
        description: 'Изучение испанского языка',
        category: 'Языки',
        icon: '🇪🇸',
        difficulty: 'BEGINNER'
      },
      
      // Музыка
      {
        name: 'Игра на гитаре',
        description: 'Обучение игре на акустической гитаре',
        category: 'Музыка',
        icon: '🎸',
        difficulty: 'BEGINNER'
      },
      {
        name: 'Сольфеджио',
        description: 'Основы музыкальной теории',
        category: 'Музыка',
        icon: '🎵',
        difficulty: 'INTERMEDIATE'
      },
      
      // Кулинария
      {
        name: 'Итальянская кухня',
        description: 'Приготовление итальянских блюд',
        category: 'Кулинария',
        icon: '🍝',
        difficulty: 'BEGINNER'
      },
      {
        name: 'Выпечка',
        description: 'Искусство приготовления хлеба и десертов',
        category: 'Кулинария',
        icon: '🍰',
        difficulty: 'INTERMEDIATE'
      },
      
      // Фотография
      {
        name: 'Портретная фотография',
        description: 'Съемка портретов и работа с моделью',
        category: 'Фотография',
        icon: '📷',
        difficulty: 'INTERMEDIATE'
      },
      {
        name: 'Обработка в Lightroom',
        description: 'Профессиональная обработка фотографий',
        category: 'Фотография',
        icon: '✨',
        difficulty: 'BEGINNER'
      },
      
      // Спорт
      {
        name: 'Йога',
        description: 'Практика йоги для начинающих',
        category: 'Спорт',
        icon: '🧘',
        difficulty: 'BEGINNER'
      },
      {
        name: 'Силовые тренировки',
        description: 'Тренировки с отягощениями',
        category: 'Спорт',
        icon: '💪',
        difficulty: 'INTERMEDIATE'
      },
      
      // Бизнес
      {
        name: 'Маркетинг',
        description: 'Основы цифрового маркетинга',
        category: 'Бизнес',
        icon: '📈',
        difficulty: 'BEGINNER'
      },
      {
        name: 'Управление проектами',
        description: 'Методологии управления проектами',
        category: 'Бизнес',
        icon: '📊',
        difficulty: 'INTERMEDIATE'
      }
    ]
  })

  const createdSkills = await prisma.skill.findMany()

  // Создание пользователей
  console.log('👥 Creating users...')
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        username: 'admin',
        password: 'hashed_password_123',
        firstName: 'Алексей',
        lastName: 'Петров',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Системный администратор и ментор. Люблю помогать другим развиваться.',
        timezone: 'Europe/Moscow',
        dailyGoal: 120,
        isPublic: true,
        role: 'ADMIN'
      },
      {
        email: 'maria@example.com',
        username: 'maria_design',
        password: 'hashed_password_123',
        firstName: 'Мария',
        lastName: 'Иванова',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'UI/UX дизайнер. Создаю красивые и удобные интерфейсы.',
        timezone: 'Europe/Moscow',
        dailyGoal: 90,
        isPublic: true,
        role: 'USER'
      },
      {
        email: 'dmitry@example.com',
        username: 'dmitry_dev',
        password: 'hashed_password_123',
        firstName: 'Дмитрий',
        lastName: 'Сидоров',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Full-stack разработчик. Увлекаюсь React и Node.js.',
        timezone: 'Europe/Kiev',
        dailyGoal: 180,
        isPublic: true,
        role: 'USER'
      },
      {
        email: 'anna@example.com',
        username: 'anna_music',
        password: 'hashed_password_123',
        firstName: 'Анна',
        lastName: 'Кузнецова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Музыкант и преподаватель. Играю на гитаре 5 лет.',
        timezone: 'Europe/London',
        dailyGoal: 60,
        isPublic: false,
        role: 'USER'
      },
      {
        email: 'sergey@example.com',
        username: 'sergey_photo',
        password: 'hashed_password_123',
        firstName: 'Сергей',
        lastName: 'Васильев',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Профессиональный фотограф. Специализация - портретная съемка.',
        timezone: 'Europe/Berlin',
        dailyGoal: 45,
        isPublic: true,
        role: 'MENTOR'
      },
      {
        email: 'olga@example.com',
        username: 'olga_cook',
        password: 'hashed_password_123',
        firstName: 'Ольга',
        lastName: 'Смирнова',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Шеф-повар и кулинарный блогер. Люблю итальянскую кухню.',
        timezone: 'Europe/Paris',
        dailyGoal: 30,
        isPublic: true,
        role: 'USER'
      },
      {
        email: 'ivan@example.com',
        username: 'ivan_sport',
        password: 'hashed_password_123',
        firstName: 'Иван',
        lastName: 'Попов',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        bio: 'Фитнес-тренер. Помогаю достигать спортивных целей.',
        timezone: 'Europe/Moscow',
        dailyGoal: 75,
        isPublic: true,
        role: 'MENTOR'
      },
      {
        email: 'ekaterina@example.com',
        username: 'kate_business',
        password: 'hashed_password_123',
        firstName: 'Екатерина',
        lastName: 'Новикова',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        bio: 'Бизнес-аналитик. Специализируюсь на управлении проектами.',
        timezone: 'Europe/London',
        dailyGoal: 100,
        isPublic: true,
        role: 'USER'
      }
    ]
  })

  const createdUsers = await prisma.user.findMany()

  // Создание статистики пользователей
  console.log('📊 Creating user stats...')
  const userStats = await Promise.all(
    createdUsers.map(user => 
      prisma.userStats.create({
        data: {
          userId: user.id,
          totalStudyTime: Math.floor(Math.random() * 5000) + 1000,
          completedGoals: Math.floor(Math.random() * 20) + 5,
          skillsLearned: Math.floor(Math.random() * 8) + 2,
          currentStreak: Math.floor(Math.random() * 30) + 1,
          longestStreak: Math.floor(Math.random() * 60) + 15,
          weeklyProgress: Math.random() * 100,
          monthlyProgress: Math.random() * 100
        }
      })
    )
  )

  // Создание навыков пользователей
  console.log('🔗 Creating user skills...')
  const userSkills = []
  for (const user of createdUsers) {
    const userSkillCount = Math.floor(Math.random() * 5) + 2
    const shuffledSkills = [...createdSkills].sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < userSkillCount && i < shuffledSkills.length; i++) {
      const skill = shuffledSkills[i]
      const skillLevels: SkillLevel[] = ['NOVICE', 'BEGINNER', 'COMPETENT', 'PROFICIENT', 'EXPERT']
      const goalLevels: SkillLevel[] = ['BEGINNER', 'COMPETENT', 'PROFICIENT']
      
      const userSkill = await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
          level: skillLevels[Math.floor(Math.random() * skillLevels.length)],
          experience: Math.floor(Math.random() * 1000) + 100,
          isLearning: Math.random() > 0.3,
          progress: Math.random() * 100,
          goalLevel: goalLevels[Math.floor(Math.random() * goalLevels.length)],
          goalDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        }
      })
      userSkills.push(userSkill)
    }
  }

  // Создание проектов
  console.log('🚀 Creating projects...')
  const projects = []
  for (const user of createdUsers) {
    const projectCount = Math.floor(Math.random() * 3) + 1
    
    const projectTemplates = [
      {
        title: 'Персональный сайт-портфолио',
        description: 'Создание современного сайта-портфолио с использованием React и Node.js',
        repository: `https://github.com/${user.username}/portfolio`,
        demoUrl: `https://${user.username}-portfolio.vercel.app`,
        status: 'COMPLETED' as ProjectStatus
      },
      {
        title: 'Мобильное приложение для трекинга привычек',
        description: 'Разработка кроссплатформенного приложения на React Native',
        repository: `https://github.com/${user.username}/habit-tracker`,
        demoUrl: null,
        status: 'IN_PROGRESS' as ProjectStatus
      },
      {
        title: 'API для социальной сети',
        description: 'REST API с аутентификацией и реальным временем',
        repository: `https://github.com/${user.username}/social-api`,
        demoUrl: null,
        status: 'IN_PROGRESS' as ProjectStatus
      },
      {
        title: 'Интернет-магазин мебели',
        description: 'Полнофункциональный интернет-магазин на Next.js',
        repository: `https://github.com/${user.username}/furniture-store`,
        demoUrl: `https://${user.username}-furniture.vercel.app`,
        status: 'COMPLETED' as ProjectStatus
      },
      {
        title: 'Приложение для изучения языков',
        description: 'Интерактивное приложение для изучения иностранных языков',
        repository: null,
        demoUrl: null,
        status: 'PLANNED' as ProjectStatus
      }
    ]

    for (let i = 0; i < projectCount; i++) {
      const template = projectTemplates[Math.floor(Math.random() * projectTemplates.length)]
      const project = await prisma.project.create({
        data: {
          title: template.title,
          description: template.description,
          repository: template.repository,
          demoUrl: template.demoUrl,
          status: template.status,
          userId: user.id,
          startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          endDate: template.status === 'COMPLETED' ? new Date() : null
        }
      })
      projects.push(project)
    }
  }

  // Создание связей проектов с навыками
  console.log('🔗 Linking projects with skills...')
  for (const project of projects) {
    const skillCount = Math.floor(Math.random() * 3) + 1
    const shuffledSkills = [...createdSkills].sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < skillCount && i < shuffledSkills.length; i++) {
      await prisma.projectSkill.create({
        data: {
          projectId: project.id,
          skillId: shuffledSkills[i].id
        }
      })
    }
  }

  // Создание учебных сессий
  console.log('📚 Creating study sessions...')
  const studySessions = []
  for (const userSkill of userSkills) {
    const sessionCount = Math.floor(Math.random() * 15) + 5
    
    for (let i = 0; i < sessionCount; i++) {
      const sessionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      const sessionTypes: SessionType[] = ['THEORY', 'PRACTICE', 'PROJECT', 'REVIEW']
      
      const session = await prisma.studySession.create({
        data: {
          duration: Math.floor(Math.random() * 120) + 15,
          description: ['Практика аккордов', 'Изучение новых слов', 'Создание компонента', 'Работа над проектом', 'Чтение документации'][Math.floor(Math.random() * 5)],
          date: sessionDate,
          sessionType: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
          efficiency: Math.floor(Math.random() * 40) + 60,
          userId: userSkill.userId,
          userSkillId: userSkill.id
        }
      })
      studySessions.push(session)
    }
  }

  // Создание целей
  console.log('🎯 Creating goals...')
  const goals = []
  for (const user of createdUsers) {
    const userUserSkills = userSkills.filter(us => us.userId === user.id)
    const goalCount = Math.floor(Math.random() * 4) + 1
    
    for (let i = 0; i < goalCount && i < userUserSkills.length; i++) {
      const userSkill = userUserSkills[i]
      const skill = createdSkills.find(s => s.id === userSkill.skillId)
      
      const goal = await prisma.goal.create({
        data: {
          title: `Освоить ${skill?.name} на уровне ${userSkill.goalLevel}`,
          description: `Достичь уровня ${userSkill.goalLevel} в навыке ${skill?.name} к установленной дате`,
          targetDate: userSkill.goalDate!,
          isCompleted: Math.random() > 0.7,
          completedAt: Math.random() > 0.7 ? new Date() : null,
          userId: user.id,
          skillId: userSkill.skillId
        }
      })
      goals.push(goal)
    }
  }

  // Создание учебных ресурсов
  console.log('📖 Creating learning resources...')
  const learningResources = await prisma.learningResource.createMany({
    data: [
      {
        title: 'Полный курс JavaScript',
        description: 'От основ до продвинутых тем JavaScript',
        url: 'https://learnjavascript.com/course',
        type: 'COURSE',
        difficulty: 'BEGINNER',
        duration: 4800,
        rating: 4.8,
        skillId: createdSkills.find(s => s.name === 'JavaScript')!.id
      },
      {
        title: 'React документация',
        description: 'Официальная документация по React',
        url: 'https://reactjs.org/docs',
        type: 'DOCUMENTATION',
        difficulty: 'INTERMEDIATE',
        duration: 360,
        rating: 4.9,
        skillId: createdSkills.find(s => s.name === 'React')!.id
      },
      {
        title: 'Основы UI/UX дизайна',
        description: 'Видеокурс по основам дизайна интерфейсов',
        url: 'https://designcourse.com/basics',
        type: 'VIDEO',
        difficulty: 'BEGINNER',
        duration: 1800,
        rating: 4.6,
        skillId: createdSkills.find(s => s.name === 'UI/UX Design')!.id
      },
      {
        title: 'Английский для IT',
        description: 'Специализированный курс английского для айтишников',
        url: 'https://english4it.com/course',
        type: 'COURSE',
        difficulty: 'INTERMEDIATE',
        duration: 5400,
        rating: 4.7,
        skillId: createdSkills.find(s => s.name === 'Английский язык')!.id
      },
      {
        title: 'Игра на гитаре для начинающих',
        description: 'Пошаговое руководство по игре на гитаре',
        url: 'https://guitarlessons.com/beginners',
        type: 'TUTORIAL',
        difficulty: 'BEGINNER',
        duration: 2400,
        rating: 4.5,
        skillId: createdSkills.find(s => s.name === 'Игра на гитаре')!.id
      }
    ]
  })

  // Создание сообществ
  console.log('👥 Creating communities...')
  const communities = await prisma.community.createMany({
    data: [
      {
        name: 'JavaScript Developers',
        description: 'Сообщество разработчиков на JavaScript',
        isPublic: true,
        avatar: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&h=200&fit=crop'
      },
      {
        name: 'UI/UX Designers',
        description: 'Сообщество дизайнеров интерфейсов',
        isPublic: true,
        avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop'
      },
      {
        name: 'Музыканты',
        description: 'Сообщество музыкантов и любителей музыки',
        isPublic: true,
        avatar: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop'
      },
      {
        name: 'Фотографы',
        description: 'Профессиональное сообщество фотографов',
        isPublic: true,
        avatar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
      },
      {
        name: 'Кулинары',
        description: 'Сообщество любителей готовить',
        isPublic: true,
        avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'
      }
    ]
  })

  const createdCommunities = await prisma.community.findMany()

  // Добавление пользователей в сообщества
  console.log('🔗 Adding users to communities...')
  for (const user of createdUsers) {
    const communityCount = Math.floor(Math.random() * 3) + 1
    const shuffledCommunities = [...createdCommunities].sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < communityCount && i < shuffledCommunities.length; i++) {
      await prisma.communityMember.create({
        data: {
          communityId: shuffledCommunities[i].id,
          userId: user.id,
          role: i === 0 ? 'ADMIN' : 'MEMBER'
        }
      })
    }
  }

  // Создание постов в сообществах
  console.log('💬 Creating community posts...')
  const communityPosts = []
  for (const community of createdCommunities) {
    const members = await prisma.communityMember.findMany({
      where: { communityId: community.id }
    })
    
    const postCount = Math.floor(Math.random() * 5) + 2
    
    for (let i = 0; i < postCount && i < members.length; i++) {
      const member = members[i]
      const post = await prisma.communityPost.create({
        data: {
          title: `Пост в сообществе ${community.name}`,
          content: `Это пример поста в сообществе ${community.name}. Здесь можно делиться опытом, задавать вопросы и обсуждать интересные темы.`,
          communityId: community.id,
          authorId: member.userId
        }
      })
      communityPosts.push(post)
    }
  }

  // Создание отзывов
  console.log('⭐ Creating reviews...')
  const reviews = []
  for (let i = 0; i < 10; i++) {
    const reviewer = createdUsers[Math.floor(Math.random() * createdUsers.length)]
    let reviewee = createdUsers[Math.floor(Math.random() * createdUsers.length)]
    
    // Убедимся, что reviewer и reviewee - разные пользователи
    while (reviewer.id === reviewee.id) {
      reviewee = createdUsers[Math.floor(Math.random() * createdUsers.length)]
    }
    
    const review = await prisma.review.create({
      data: {
        title: 'Отличный ментор!',
        content: 'Очень помог в освоении нового навыка. Рекомендую!',
        rating: Math.floor(Math.random() * 2) + 4, // 4 или 5
        reviewerId: reviewer.id,
        revieweeId: reviewee.id
      }
    })
    reviews.push(review)
  }

  // Создание уведомлений
  console.log('🔔 Creating notifications...')
  const notifications = await Promise.all(
    createdUsers.map(user =>
      prisma.notification.create({
        data: {
          title: 'Добро пожаловать в Skills Tracker!',
          message: 'Мы рады приветствовать вас в нашем приложении. Начните свой путь к новым навыкам прямо сейчас!',
          type: 'SYSTEM_ALERT',
          isRead: Math.random() > 0.5,
          userId: user.id
        }
      })
    )
  )

  // Создание настроек пользователей
  console.log('⚙️ Creating user settings...')
  for (const user of createdUsers) {
    // Основные настройки
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        email: user.email,
        location: ['Москва', 'Санкт-Петербург', 'Киев', 'Лондон', 'Берлин'][Math.floor(Math.random() * 5)],
        occupation: ['Разработчик', 'Дизайнер', 'Фотограф', 'Музыкант', 'Повар'][Math.floor(Math.random() * 5)],
        emailNotifications: true,
        pushNotifications: true,
        goalReminders: true,
        weeklyReports: Math.random() > 0.3,
        defaultDifficulty: 'BEGINNER',
        preferredResourceType: 'VIDEO'
      }
    })

    // Настройки уведомлений
    await prisma.userNotificationSettings.create({
      data: {
        userId: user.id,
        emailFrequency: 'DAILY',
        digestFrequency: 'WEEKLY',
        notifyNewMessages: true,
        notifyGoalDue: true,
        notifyMentions: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00'
      }
    })

    // Настройки приватности
    await prisma.userPrivacySettings.create({
      data: {
        userId: user.id,
        profileVisibility: 'PUBLIC',
        showEmail: false,
        showRealName: true,
        showStudySessions: true,
        showCurrentProjects: true,
        showSkillLevels: true
      }
    })

    // Настройки внешнего вида
    await prisma.userAppearanceSettings.create({
      data: {
        userId: user.id,
        theme: Math.random() > 0.5 ? 'LIGHT' : 'DARK',
        accentColor: ['blue', 'green', 'purple', 'red'][Math.floor(Math.random() * 4)],
        fontSize: 'MEDIUM',
        showAvatars: true
      }
    })

    // Настройки обучения
    const learningStyles: LearningStyle[] = ['VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC', 'MIXED']
    await prisma.userLearningPreferences.create({
      data: {
        userId: user.id,
        learningStyle: learningStyles[Math.floor(Math.random() * learningStyles.length)],
        preferredDifficulty: 'BEGINNER',
        dailyStudyGoal: user.dailyGoal || 60,
        sessionLength: 25,
        breakLength: 5
      }
    })

    // Настройки безопасности
    await prisma.userSecuritySettings.create({
      data: {
        userId: user.id,
        twoFactorEnabled: Math.random() > 0.7,
        loginAlerts: true,
        dataExportEnabled: true
      }
    })
  }

  // Создание системных настроек
  console.log('🔧 Creating system settings...')
  const systemSettings = await prisma.systemSettings.createMany({
    data: [
      {
        key: 'site_name',
        value: 'Skills Tracker',
        description: 'Название сайта',
        category: 'GENERAL',
        isPublic: true,
        dataType: 'STRING'
      },
      {
        key: 'allow_registrations',
        value: 'true',
        description: 'Разрешить регистрацию новых пользователей',
        category: 'SECURITY',
        isPublic: false,
        dataType: 'BOOLEAN'
      },
      {
        key: 'max_file_size',
        value: '10',
        description: 'Максимальный размер загружаемых файлов (MB)',
        category: 'SYSTEM',
        isPublic: false,
        dataType: 'NUMBER'
      },
      {
        key: 'default_timezone',
        value: 'Europe/Moscow',
        description: 'Часовой пояс по умолчанию',
        category: 'GENERAL',
        isPublic: true,
        dataType: 'STRING'
      }
    ]
  })

  // Создание логов аудита
  console.log('📝 Creating audit logs...')
  const auditLogs = await prisma.auditLog.createMany({
    data: [
      {
        action: 'USER_REGISTERED',
        resource: 'User',
        resourceId: createdUsers[0].id,
        userId: createdUsers[0].id,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        action: 'PROJECT_CREATED',
        resource: 'Project',
        resourceId: projects[0].id,
        userId: projects[0].userId,
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        action: 'SKILL_ADDED',
        resource: 'UserSkill',
        resourceId: userSkills[0].id,
        userId: userSkills[0].userId,
        ipAddress: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
      }
    ]
  })

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   👥 ${createdUsers.length} users`)
  console.log(`   🎯 ${createdSkills.length} skills`)
  console.log(`   🔗 ${userSkills.length} user skills`)
  console.log(`   🚀 ${projects.length} projects`)
  console.log(`   📚 ${studySessions.length} study sessions`)
  console.log(`   🎯 ${goals.length} goals`)
  console.log(`   👥 ${createdCommunities.length} communities`)
  console.log(`   💬 ${communityPosts.length} community posts`)
  console.log(`   ⭐ ${reviews.length} reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })