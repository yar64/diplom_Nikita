// lib/validations/schemas/user.ts
import { z } from 'zod';
import { VALIDATION_CONSTANTS } from '../../../libary/validations/constants/index';

export const userRoleSchema = z.enum(['USER', 'ADMIN', 'MENTOR']);

export const userCreateSchema = z.object({
  email: z.string()
    .email('Некорректный email')
    .max(VALIDATION_CONSTANTS.USER.EMAIL.MAX, 'Email слишком длинный'),
  username: z.string()
    .min(VALIDATION_CONSTANTS.USER.USERNAME.MIN, 'Имя пользователя слишком короткое')
    .max(VALIDATION_CONSTANTS.USER.USERNAME.MAX, 'Имя пользователя слишком длинное')
    .regex(VALIDATION_CONSTANTS.USER.USERNAME.REGEX, 'Имя пользователя может содержать только буквы, цифры и подчеркивания'),
  password: z.string()
    .min(VALIDATION_CONSTANTS.USER.PASSWORD.MIN, 'Пароль должен содержать минимум 8 символов')
    .max(VALIDATION_CONSTANTS.USER.PASSWORD.MAX, 'Пароль слишком длинный'),
  firstName: z.string()
    .min(1, 'Имя обязательно')
    .max(50, 'Имя слишком длинное')
    .optional(),
  lastName: z.string()
    .min(1, 'Фамилия обязательна')
    .max(50, 'Фамилия слишком длинная')
    .optional(),
  avatar: z.string().url('Некорректный URL аватара').optional(),
  bio: z.string()
    .max(VALIDATION_CONSTANTS.USER.BIO.MAX, 'Биография слишком длинная')
    .optional(),
  timezone: z.string().optional(),
  dailyGoal: z.number()
    .min(VALIDATION_CONSTANTS.USER.DAILY_GOAL.MIN, 'Цель должна быть не менее 5 минут')
    .max(VALIDATION_CONSTANTS.USER.DAILY_GOAL.MAX, 'Цель не может превышать 8 часов')
    .optional(),
  isPublic: z.boolean().optional(),
  role: userRoleSchema.optional()
});

export const userUpdateSchema = userCreateSchema
  .partial()
  .extend({
    id: z.string().cuid('Некорректный ID пользователя')
  })
  .refine(data => Object.keys(data).length > 1, {
    message: 'Необходимо указать хотя бы одно поле для обновления'
  });

export const userLoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен')
});

export const userChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
  newPassword: z.string()
    .min(VALIDATION_CONSTANTS.USER.PASSWORD.MIN, 'Пароль должен содержать минимум 8 символов')
    .max(VALIDATION_CONSTANTS.USER.PASSWORD.MAX, 'Пароль слишком длинный')
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;