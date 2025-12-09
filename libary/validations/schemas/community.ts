// lib/validations/schemas/community.ts
import { z } from 'zod';
import { VALIDATION_CONSTANTS } from '../../../libary/validations/constants/index';

export const communityRoleSchema = z.enum(['MEMBER', 'MODERATOR', 'ADMIN']);
export const notificationTypeSchema = z.enum(['GOAL_REMINDER', 'MILESTONE_ACHIEVED', 'NEW_SKILL_SUGGESTION', 'WEEKLY_PROGRESS', 'COMMUNITY_INVITE', 'MENTOR_FEEDBACK', 'GOAL_COMPLETED', 'STREAK_REMINDER', 'NEW_MESSAGE', 'SYSTEM_ALERT', 'BADGE_EARNED', 'QUIZ_COMPLETED']);

export const communityCreateSchema = z.object({
  name: z.string()
    .min(VALIDATION_CONSTANTS.COMMUNITY.NAME.MIN, 'Название сообщества слишком короткое')
    .max(VALIDATION_CONSTANTS.COMMUNITY.NAME.MAX, 'Название сообщества слишком длинное'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.COMMUNITY.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  isPublic: z.boolean().optional(),
  avatar: z.string().url('Некорректный URL аватара').optional()
});

export const communityPostCreateSchema = z.object({
  communityId: z.string().cuid('Некорректный ID сообщества'),
  authorId: z.string().cuid('Некорректный ID автора'),
  title: z.string()
    .min(VALIDATION_CONSTANTS.COMMUNITY.POST.TITLE.MIN, 'Заголовок слишком короткий')
    .max(VALIDATION_CONSTANTS.COMMUNITY.POST.TITLE.MAX, 'Заголовок слишком длинный'),
  content: z.string()
    .min(VALIDATION_CONSTANTS.COMMUNITY.POST.CONTENT.MIN, 'Содержание слишком короткое')
    .max(VALIDATION_CONSTANTS.COMMUNITY.POST.CONTENT.MAX, 'Содержание слишком длинное')
});

export const reviewCreateSchema = z.object({
  reviewerId: z.string().cuid('Некорректный ID рецензента'),
  revieweeId: z.string().cuid('Некорректный ID получателя'),
  title: z.string()
    .min(VALIDATION_CONSTANTS.REVIEW.TITLE.MIN, 'Заголовок отзыва слишком короткий')
    .max(VALIDATION_CONSTANTS.REVIEW.TITLE.MAX, 'Заголовок отзыва слишком длинный'),
  content: z.string()
    .min(VALIDATION_CONSTANTS.REVIEW.CONTENT.MIN, 'Содержание отзыва слишком короткое')
    .max(VALIDATION_CONSTANTS.REVIEW.CONTENT.MAX, 'Содержание отзыва слишком длинное'),
  rating: z.number()
    .int()
    .min(VALIDATION_CONSTANTS.REVIEW.RATING.MIN, 'Рейтинг должен быть не менее 1')
    .max(VALIDATION_CONSTANTS.REVIEW.RATING.MAX, 'Рейтинг должен быть не более 5')
});

export const notificationCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  title: z.string().min(1, 'Заголовок обязателен'),
  message: z.string().min(1, 'Сообщение обязательно'),
  type: notificationTypeSchema
});