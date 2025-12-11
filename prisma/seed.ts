// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начало заполнения базы данных...')

  // Очищаем базу данных (осторожно!)
  await prisma.courseProgress.deleteMany()
  await prisma.courseEnrollment.deleteMany()
  await prisma.courseReview.deleteMany()
  await prisma.courseSkill.deleteMany()
  await prisma.courseLesson.deleteMany()
  await prisma.courseChapter.deleteMany()
  await prisma.course.deleteMany()
  await prisma.studyNote.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.studyPlan.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.goalSkill.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.communityPost.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.learningMilestone.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.projectSkill.deleteMany()
  await prisma.project.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.levelSystem.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.userStats.deleteMany()
  await prisma.userSecuritySettings.deleteMany()
  await prisma.userLearningPreferences.deleteMany()
  await prisma.userAppearanceSettings.deleteMany()
  await prisma.userPrivacySettings.deleteMany()
  await prisma.userNotificationSettings.deleteMany()
  await prisma.userSettings.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ База данных очищена')

  // 1. Создаем пользователей (инструкторов и студентов)
  const passwordHash = await hash('password123', 10)
  
  const instructor1 = await prisma.user.create({
    data: {
      email: 'instructor1@example.com',
      username: 'john_doe',
      password: passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'Senior Frontend разработчик с 8-летним опытом. Специализируюсь на React, TypeScript и современных веб-технологиях.',
      role: 'MENTOR',
      timezone: 'Europe/Moscow',
      dailyGoal: 60,
      isPublic: true,
    }
  })

  const instructor2 = await prisma.user.create({
    data: {
      email: 'instructor2@example.com',
      username: 'alex_smith',
      password: passwordHash,
      firstName: 'Alex',
      lastName: 'Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: 'Full-stack разработчик и DevOps инженер. Эксперт в Node.js, Docker и облачных технологиях.',
      role: 'MENTOR',
      timezone: 'Europe/Moscow',
      dailyGoal: 45,
      isPublic: true,
    }
  })

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      username: 'mike_jones',
      password: passwordHash,
      firstName: 'Mike',
      lastName: 'Jones',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      bio: 'Начинающий разработчик, учусь программированию. Цель - стать frontend разработчиком.',
      role: 'USER',
      timezone: 'Europe/Moscow',
      dailyGoal: 30,
      isPublic: true,
    }
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      username: 'anna_wilson',
      password: passwordHash,
      firstName: 'Anna',
      lastName: 'Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      bio: 'Дизайнер UX/UI, изучаю веб-разработку чтобы создавать полноценные продукты.',
      role: 'USER',
      timezone: 'Europe/Moscow',
      dailyGoal: 40,
      isPublic: true,
    }
  })

  console.log('👥 Пользователи созданы')

  // 2. Создаем настройки для пользователей
  await Promise.all([
    prisma.userSettings.create({
      data: {
        userId: instructor1.id,
        email: 'instructor1@example.com',
        emailNotifications: true,
        pushNotifications: true,
        goalReminders: true,
      }
    }),
    prisma.userStats.create({
      data: {
        userId: instructor1.id,
        totalStudyTime: 2500,
        completedGoals: 12,
        skillsLearned: 8,
        currentStreak: 15,
        longestStreak: 45,
        coursesEnrolled: 5,
        coursesCompleted: 3,
      }
    }),
    prisma.userSettings.create({
      data: {
        userId: student1.id,
        email: 'student1@example.com',
        emailNotifications: true,
        pushNotifications: true,
      }
    }),
    prisma.userStats.create({
      data: {
        userId: student1.id,
        totalStudyTime: 120,
        completedGoals: 2,
        skillsLearned: 3,
        currentStreak: 5,
        coursesEnrolled: 2,
      }
    }),
  ])

  console.log('⚙️ Настройки пользователей созданы')

  // 3. Создаем навыки
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'JavaScript',
        description: 'Язык программирования для веб-разработки',
        category: 'Программирование',
        icon: 'js',
        difficulty: 'INTERMEDIATE',
      }
    }),
    prisma.skill.create({
      data: {
        name: 'React',
        description: 'Библиотека JavaScript для создания пользовательских интерфейсов',
        category: 'Frontend',
        icon: 'react',
        difficulty: 'INTERMEDIATE',
      }
    }),
    prisma.skill.create({
      data: {
        name: 'TypeScript',
        description: 'Типизированное надмножество JavaScript',
        category: 'Программирование',
        icon: 'ts',
        difficulty: 'ADVANCED',
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Node.js',
        description: 'Среда выполнения JavaScript на стороне сервера',
        category: 'Backend',
        icon: 'node',
        difficulty: 'INTERMEDIATE',
      }
    }),
    prisma.skill.create({
      data: {
        name: 'HTML/CSS',
        description: 'Основы веб-разработки и стилизации',
        category: 'Frontend',
        icon: 'html',
        difficulty: 'BEGINNER',
      }
    }),
    prisma.skill.create({
      data: {
        name: 'Python',
        description: 'Высокоуровневый язык программирования общего назначения',
        category: 'Программирование',
        icon: 'python',
        difficulty: 'BEGINNER',
      }
    }),
  ])

  console.log('🎯 Навыки созданы')

  // 4. Создаем курсы
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'React с нуля до PRO',
        description: 'Полный курс по React для начинающих и опытных разработчиков. Изучите хуки, контекст, Redux и современные практики разработки.',
        excerpt: 'Научитесь создавать современные веб-приложения с React',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
        category: 'Программирование',
        tags: 'React,JavaScript,Frontend,Веб-разработка',
        price: 12900,
        originalPrice: 18900,
        discountPercent: 32,
        isFree: false,
        level: 'BEGINNER',
        language: 'ru',
        duration: 1560, // 26 часов
        status: 'PUBLISHED',
        isFeatured: true,
        slug: 'react-from-zero-to-pro',
        instructorId: instructor1.id,
        averageRating: 4.8,
        totalReviews: 1250,
        totalStudents: 3500,
        totalLessons: 45,
        publishedAt: new Date('2024-01-15'),
      }
    }),
    prisma.course.create({
      data: {
        title: 'JavaScript для начинающих',
        description: 'Основы JavaScript для тех, кто начинает свой путь в программировании. От переменных до асинхронного кода.',
        excerpt: 'Изучите основы JavaScript с нуля',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w-800&auto=format&fit=crop',
        category: 'Программирование',
        tags: 'JavaScript,Основы,Программирование,Новичок',
        price: 8900,
        originalPrice: null,
        discountPercent: null,
        isFree: false,
        level: 'BEGINNER',
        language: 'ru',
        duration: 900, // 15 часов
        status: 'PUBLISHED',
        isFeatured: false,
        slug: 'javascript-for-beginners',
        instructorId: instructor1.id,
        averageRating: 4.6,
        totalReviews: 850,
        totalStudents: 2100,
        totalLessons: 30,
        publishedAt: new Date('2024-02-10'),
      }
    }),
    prisma.course.create({
      data: {
        title: 'TypeScript: Продвинутые техники',
        description: 'Изучите продвинутые возможности TypeScript: дженерики, утилитарные типы, декораторы и архитектурные паттерны.',
        excerpt: 'Продвинутый курс по TypeScript для опытных разработчиков',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
        category: 'Программирование',
        tags: 'TypeScript,Продвинутый,Type System,Архитектура',
        price: 14900,
        originalPrice: null,
        discountPercent: null,
        isFree: false,
        level: 'ADVANCED',
        language: 'ru',
        duration: 1200, // 20 часов
        status: 'PUBLISHED',
        isFeatured: true,
        slug: 'typescript-advanced-techniques',
        instructorId: instructor2.id,
        averageRating: 4.9,
        totalReviews: 420,
        totalStudents: 950,
        totalLessons: 35,
        publishedAt: new Date('2024-01-20'),
      }
    }),
    prisma.course.create({
      data: {
        title: 'Node.js и Express: Backend разработка',
        description: 'Создавайте RESTful API и серверные приложения с Node.js и Express. Базы данных, аутентификация, деплой.',
        excerpt: 'Полный курс по backend разработке на Node.js',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
        category: 'Backend',
        tags: 'Node.js,Express,Backend,API,REST',
        price: 0,
        originalPrice: null,
        discountPercent: null,
        isFree: true,
        level: 'INTERMEDIATE',
        language: 'ru',
        duration: 1800, // 30 часов
        status: 'PUBLISHED',
        isFeatured: true,
        slug: 'nodejs-express-backend',
        instructorId: instructor2.id,
        averageRating: 4.7,
        totalReviews: 680,
        totalStudents: 4500,
        totalLessons: 50,
        publishedAt: new Date('2024-01-05'),
      }
    }),
    prisma.course.create({
      data: {
        title: 'Введение в Python для анализа данных',
        description: 'Основы Python с акцентом на анализ данных. Изучите pandas, numpy и matplotlib для работы с данными.',
        excerpt: 'Начните работать с данными в Python',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec1?w=800&auto=format&fit=crop',
        category: 'Data Science',
        tags: 'Python,Анализ данных,Data Science,Наука о данных',
        price: 11900,
        originalPrice: 14900,
        discountPercent: 20,
        isFree: false,
        level: 'BEGINNER',
        language: 'ru',
        duration: 960, // 16 часов
        status: 'DRAFT',
        isFeatured: false,
        slug: 'python-data-analysis-intro',
        instructorId: instructor1.id,
        averageRating: 0,
        totalReviews: 0,
        totalStudents: 0,
        totalLessons: 0,
      }
    }),
  ])

  console.log('📚 Курсы созданы')

  // 5. Связываем курсы с навыками
  const courseSkillsData = [
    { course: courses[0], skills: [skills[0], skills[1], skills[2]] }, // React -> JS, React, TS
    { course: courses[1], skills: [skills[0], skills[4]] }, // JS для начинающих -> JS, HTML/CSS
    { course: courses[2], skills: [skills[2], skills[0]] }, // TypeScript -> TS, JS
    { course: courses[3], skills: [skills[3], skills[0]] }, // Node.js -> Node.js, JS
    { course: courses[4], skills: [skills[5]] }, // Python -> Python
  ]

  for (const { course, skills } of courseSkillsData) {
    for (const skill of skills) {
      await prisma.courseSkill.create({
        data: {
          courseId: course.id,
          skillId: skill.id,
        }
      })
    }
  }

  console.log('🔗 Навыки привязаны к курсам')

  // 6. Создаем главы и уроки для первого курса (React)
  const reactCourse = courses[0]
  
  // Глава 1
  const chapter1 = await prisma.courseChapter.create({
    data: {
      title: 'Введение в React',
      description: 'Основные концепции и настройка окружения',
      order: 1,
      courseId: reactCourse.id,
    }
  })

  await Promise.all([
    prisma.courseLesson.create({
      data: {
        title: 'Что такое React и зачем он нужен',
        description: 'Обзор библиотеки, ее преимущества и сравнение с другими технологиями',
        order: 1,
        chapterId: chapter1.id,
        contentType: 'VIDEO',
        videoUrl: 'https://example.com/videos/react-intro.mp4',
        duration: 25,
        content: 'React - это библиотека JavaScript для создания пользовательских интерфейсов...',
        isPreview: true,
      }
    }),
    prisma.courseLesson.create({
      data: {
        title: 'Настройка окружения разработки',
        description: 'Установка Node.js, создание первого приложения с Create React App',
        order: 2,
        chapterId: chapter1.id,
        contentType: 'ARTICLE',
        duration: 40,
        content: '# Настройка окружения\n\n1. Установите Node.js с официального сайта...',
        isPreview: false,
      }
    }),
  ])

  // Глава 2
  const chapter2 = await prisma.courseChapter.create({
    data: {
      title: 'Основы JSX и компоненты',
      description: 'Синтаксис JSX и создание первых компонентов',
      order: 2,
      courseId: reactCourse.id,
    }
  })

  await Promise.all([
    prisma.courseLesson.create({
      data: {
        title: 'Синтаксис JSX',
        description: 'Изучение синтаксиса JSX и его отличий от HTML',
        order: 1,
        chapterId: chapter2.id,
        contentType: 'VIDEO',
        videoUrl: 'https://example.com/videos/jsx-syntax.mp4',
        duration: 30,
        isPreview: true,
      }
    }),
    prisma.courseLesson.create({
      data: {
        title: 'Создание функциональных компонентов',
        description: 'Основы создания и использования функциональных компонентов',
        order: 2,
        chapterId: chapter2.id,
        contentType: 'VIDEO',
        videoUrl: 'https://example.com/videos/functional-components.mp4',
        duration: 35,
        isPreview: false,
      }
    }),
  ])

  console.log('📖 Главы и уроки созданы')

  // 7. Создаем записи на курсы (enrollments)
  await Promise.all([
    prisma.courseEnrollment.create({
      data: {
        userId: student1.id,
        courseId: reactCourse.id,
        progress: 35.5,
        completedLessons: 8,
        isCompleted: false,
        purchasedAt: new Date('2024-02-15'),
      }
    }),
    prisma.courseEnrollment.create({
      data: {
        userId: student1.id,
        courseId: courses[1].id, // JavaScript для начинающих
        progress: 100,
        completedLessons: 30,
        isCompleted: true,
        completedAt: new Date('2024-03-10'),
        purchasedAt: new Date('2024-01-20'),
      }
    }),
    prisma.courseEnrollment.create({
      data: {
        userId: student2.id,
        courseId: reactCourse.id,
        progress: 15.2,
        completedLessons: 3,
        isCompleted: false,
        purchasedAt: new Date('2024-03-01'),
      }
    }),
  ])

  console.log('🎓 Записи на курсы созданы')

  // 8. Создаем отзывы на курсы
  await Promise.all([
    prisma.courseReview.create({
      data: {
        rating: 5,
        title: 'Отличный курс!',
        content: 'Курс полностью оправдал ожидания. Инструктор объясняет очень понятно, много практических примеров.',
        userId: student1.id,
        courseId: reactCourse.id,
        isVerified: true,
      }
    }),
    prisma.courseReview.create({
      data: {
        rating: 4,
        title: 'Хороший курс для начинающих',
        content: 'Много полезной информации, но некоторые темы можно было бы раскрыть подробнее.',
        userId: student2.id,
        courseId: reactCourse.id,
        isVerified: true,
      }
    }),
    prisma.courseReview.create({
      data: {
        rating: 5,
        title: 'Лучший курс по JavaScript',
        content: 'Прошел много курсов, но этот самый структурированный и понятный.',
        userId: student1.id,
        courseId: courses[1].id,
        isVerified: true,
      }
    }),
  ])

  console.log('⭐ Отзывы созданы')

  // 9. Создаем пользовательские навыки
  await Promise.all([
    prisma.userSkill.create({
      data: {
        userId: student1.id,
        skillId: skills[0].id, // JavaScript
        level: 'BEGINNER',
        experience: 450,
        isLearning: true,
        goalLevel: 'COMPETENT',
        progress: 45,
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: student1.id,
        skillId: skills[1].id, // React
        level: 'NOVICE',
        experience: 120,
        isLearning: true,
        goalLevel: 'BEGINNER',
        progress: 30,
      }
    }),
    prisma.userSkill.create({
      data: {
        userId: student2.id,
        skillId: skills[5].id, // Python
        level: 'BEGINNER',
        experience: 320,
        isLearning: true,
        goalLevel: 'COMPETENT',
        progress: 64,
      }
    }),
  ])

  console.log('🎯 Пользовательские навыки созданы')

  // 10. Создаем цели
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Изучить основы React',
        description: 'Пройти первые 5 глав курса по React',
        targetDate: new Date('2024-04-30'),
        isCompleted: false,
        userId: student1.id,
        skillId: skills[1].id, // React
        courseId: reactCourse.id,
      }
    }),
    prisma.goal.create({
      data: {
        title: 'Освоить JavaScript до уровня Intermediate',
        description: 'Завершить курс JavaScript для начинающих и выполнить все проекты',
        targetDate: new Date('2024-03-31'),
        isCompleted: true,
        completedAt: new Date('2024-03-10'),
        userId: student1.id,
        skillId: skills[0].id, // JavaScript
        courseId: courses[1].id,
      }
    }),
  ])

  console.log('🎯 Цели созданы')

  // 11. Создаем учебные сессии
  await Promise.all([
    prisma.studySession.create({
      data: {
        duration: 45,
        description: 'Изучение хуков useState и useEffect',
        notes: 'Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах',
        date: new Date('2024-03-20T18:30:00Z'),
        sessionType: 'PRACTICE',
        efficiency: 85,
        userId: student1.id,
        userSkillId: (await prisma.userSkill.findFirst({ where: { userId: student1.id, skillId: skills[1].id } }))!.id,
        courseEnrollmentId: (await prisma.courseEnrollment.findFirst({ where: { userId: student1.id, courseId: reactCourse.id } }))!.id,
      }
    }),
    prisma.studySession.create({
      data: {
        duration: 60,
        description: 'Практика с функциями высшего порядка',
        notes: 'map, filter, reduce - основные методы работы с массивами',
        date: new Date('2024-03-19T17:00:00Z'),
        sessionType: 'PRACTICE',
        efficiency: 90,
        userId: student1.id,
        userSkillId: (await prisma.userSkill.findFirst({ where: { userId: student1.id, skillId: skills[0].id } }))!.id,
      }
    }),
  ])

  console.log('⏱️ Учебные сессии созданы')

  // 12. Создаем проекты
  const project = await prisma.project.create({
    data: {
      title: 'Трекер привычек',
      description: 'Приложение для отслеживания ежедневных привычек на React',
      repository: 'https://github.com/mikejones/habit-tracker',
      demoUrl: 'https://habittracker.demo.com',
      status: 'IN_PROGRESS',
      userId: student1.id,
      startDate: new Date('2024-02-01'),
      skills: {
        create: [
          { skillId: skills[0].id }, // JavaScript
          { skillId: skills[1].id }, // React
        ]
      }
    }
  })

  console.log('🚀 Проекты созданы')

  // 13. Создаем уведомления
  await prisma.notification.create({
    data: {
      title: 'Новый урок доступен',
      message: 'В курсе "React с нуля до PRO" добавлен новый урок: "Работа с формами"',
      type: 'COURSE_ENROLLMENT',
      isRead: false,
      userId: student1.id,
      courseId: reactCourse.id,
    }
  })

  console.log('🔔 Уведомления созданы')

  // 14. Создаем сообщество
  const community = await prisma.community.create({
    data: {
      name: 'React Developers Russia',
      description: 'Сообщество React разработчиков в России. Обсуждаем лучшие практики, делимся опытом и помогаем новичкам.',
      isPublic: true,
      avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop',
    }
  })

  await prisma.communityMember.create({
    data: {
      communityId: community.id,
      userId: student1.id,
      role: 'MEMBER',
    }
  })

  await prisma.communityPost.create({
    data: {
      title: 'Как начать изучать React в 2024?',
      content: 'Привет всем! Хочу начать изучать React, с чего посоветуете начать? Какие ресурсы самые актуальные?',
      communityId: community.id,
      authorId: student1.id,
    }
  })

  console.log('👥 Сообщество создано')

  // 15. Создаем баджи
  const badge = await prisma.badge.create({
    data: {
      name: 'Первый курс пройден',
      description: 'Награда за успешное завершение первого курса',
      icon: '🏆',
      criteria: { completedCourses: 1 },
      category: 'COURSE',
      rarity: 'COMMON',
    }
  })

  await prisma.userBadge.create({
    data: {
      userId: student1.id,
      badgeId: badge.id,
      earnedAt: new Date('2024-03-10'),
    }
  })

  console.log('🏆 Бейджи созданы')

  // 16. Создаем заметки
  await prisma.studyNote.create({
    data: {
      title: 'Основные хуки React',
      content: 'useState - для состояния\nuseEffect - для побочных эффектов\nuseContext - для контекста',
      userId: student1.id,
      userSkillId: (await prisma.userSkill.findFirst({ where: { userId: student1.id, skillId: skills[1].id } }))!.id,
      lessonId: (await prisma.courseLesson.findFirst({ where: { chapter: { courseId: reactCourse.id } } }))!.id,
    }
  })

  console.log('📝 Заметки созданы')

  // 17. Создаем уровень систему для навыков
  await Promise.all([
    prisma.levelSystem.create({
      data: {
        skillId: skills[0].id, // JavaScript
        level: 'NOVICE',
        minExperience: 0,
        description: 'Основы синтаксиса, переменные, типы данных',
      }
    }),
    prisma.levelSystem.create({
      data: {
        skillId: skills[0].id, // JavaScript
        level: 'BEGINNER',
        minExperience: 200,
        description: 'Функции, массивы, объекты, циклы',
      }
    }),
    prisma.levelSystem.create({
      data: {
        skillId: skills[0].id, // JavaScript
        level: 'COMPETENT',
        minExperience: 800,
        description: 'Асинхронное программирование, ООП, ES6+',
      }
    }),
  ])

  console.log('📊 Уровневая система создана')

  console.log('✅ База данных успешно заполнена!')
  console.log(`\n📊 Статистика:
  • Пользователей: 4
  • Курсов: ${courses.length}
  • Навыков: ${skills.length}
  • Отзывов: 3
  • Записей на курсы: 3
  • Проектов: 1
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })