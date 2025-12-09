// lib/validations/schemas/learning.ts
import { z } from 'zod';
import { VALIDATION_CONSTANTS } from '../../../libary/validations/constants/index';

// Добавляем difficultySchema который отсутствовал
export const difficultySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);
export const sessionTypeSchema = z.enum(['THEORY', 'PRACTICE', 'PROJECT', 'REVIEW', 'EXAM']);
export const projectStatusSchema = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']);
export const resourceTypeSchema = z.enum(['ARTICLE', 'VIDEO', 'COURSE', 'DOCUMENTATION', 'BOOK', 'TUTORIAL', 'EXERCISE', 'PODCAST', 'CHEATSHEET']);

export const studySessionCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  userSkillId: z.string().cuid('Некорректный ID навыка пользователя'),
  duration: z.number()
    .int()
    .min(1, 'Длительность должна быть не менее 1 минуты')
    .max(VALIDATION_CONSTANTS.LEARNING.DURATION.MAX, 'Длительность не может превышать 8 часов'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.LEARNING.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  notes: z.string().optional(),
  date: z.string().datetime('Некорректная дата').optional(),
  sessionType: sessionTypeSchema.optional(),
  efficiency: z.number()
    .int()
    .min(VALIDATION_CONSTANTS.LEARNING.EFFICIENCY.MIN, 'Эффективность не может быть отрицательной')
    .max(VALIDATION_CONSTANTS.LEARNING.EFFICIENCY.MAX, 'Эффективность не может превышать 100%')
    .optional(),
  tags: z.array(z.string()).optional(),
  mood: z.number().int().min(1).max(5).optional()
});

export const studySessionUpdateSchema = studySessionCreateSchema
  .omit({ userId: true })
  .partial()
  .extend({
    id: z.string().cuid('Некорректный ID сессии')
  });

export const projectCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  title: z.string()
    .min(VALIDATION_CONSTANTS.PROJECT.TITLE.MIN, 'Название проекта слишком короткое')
    .max(VALIDATION_CONSTANTS.PROJECT.TITLE.MAX, 'Название проекта слишком длинное'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.PROJECT.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  repository: z.string().url('Некорректный URL репозитория').optional(),
  demoUrl: z.string().url('Некорректный URL демо').optional(),
  status: projectStatusSchema.optional(),
  startDate: z.string().datetime('Некорректная дата начала').optional(),
  endDate: z.string().datetime('Некорректная дата окончания').optional(),
  skillIds: z.array(z.string().cuid('Некорректный ID навыка')).optional()
});

export const learningPathCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  title: z.string()
    .min(VALIDATION_CONSTANTS.LEARNING.TITLE.MIN, 'Название пути слишком короткое')
    .max(VALIDATION_CONSTANTS.LEARNING.TITLE.MAX, 'Название пути слишком длинное'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.LEARNING.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  isPublic: z.boolean().optional()
});

export const goalCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  title: z.string()
    .min(VALIDATION_CONSTANTS.LEARNING.TITLE.MIN, 'Название цели слишком короткое')
    .max(VALIDATION_CONSTANTS.LEARNING.TITLE.MAX, 'Название цели слишком длинное'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.LEARNING.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  targetDate: z.string().datetime('Некорректная дата цели'),
  skillId: z.string().cuid('Некорректный ID навыка').optional(),
  skillIds: z.array(z.string().cuid('Некорректный ID навыка')).optional() // Для комплексных целей
});

export const studyPlanCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  userSkillId: z.string().cuid('Некорректный ID навыка пользователя').optional(),
  title: z.string()
    .min(VALIDATION_CONSTANTS.LEARNING.TITLE.MIN, 'Название плана слишком короткое')
    .max(VALIDATION_CONSTANTS.LEARNING.TITLE.MAX, 'Название плана слишком длинное'),
  description: z.string().optional(),
  startTime: z.string().datetime('Некорректное время начала'),
  endTime: z.string().datetime('Некорректное время окончания')
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'Время окончания должно быть после времени начала',
  path: ['endTime']
});

// Добавляем схемы для квизов
export const quizCreateSchema = z.object({
  title: z.string()
    .min(3, 'Название квиза слишком короткое')
    .max(100, 'Название квиза слишком длинное'),
  description: z.string().max(500, 'Описание слишком длинное').optional(),
  skillId: z.string().cuid('Некорректный ID навыка'),
  difficulty: difficultySchema.optional(),
  questions: z.array(z.object({
    question: z.string().min(1, 'Вопрос обязателен'),
    type: z.enum(['multiple_choice', 'true_false', 'text']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1, 'Правильный ответ обязателен'),
    explanation: z.string().optional()
  })).min(1, 'Должен быть хотя бы один вопрос'),
  passScore: z.number().int().min(0).max(100).optional(),
  timeLimit: z.number().int().min(1).max(300).optional(),
  maxAttempts: z.number().int().min(1).max(10).optional()
});

export const quizAttemptCreateSchema = z.object({
  quizId: z.string().cuid('Некорректный ID квиза'),
  userId: z.string().cuid('Некорректный ID пользователя'),
  answers: z.array(z.object({
    questionId: z.string().min(1, 'ID вопроса обязательно'),
    answer: z.string().min(1, 'Ответ обязателен')
  })),
  timeSpent: z.number().int().min(0).optional()
});

// Типы для экспорта
export type StudySessionCreateInput = z.infer<typeof studySessionCreateSchema>;
export type StudySessionUpdateInput = z.infer<typeof studySessionUpdateSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type LearningPathCreateInput = z.infer<typeof learningPathCreateSchema>;
export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type StudyPlanCreateInput = z.infer<typeof studyPlanCreateSchema>;
export type QuizCreateInput = z.infer<typeof quizCreateSchema>;
export type QuizAttemptCreateInput = z.infer<typeof quizAttemptCreateSchema>;