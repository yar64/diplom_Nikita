// lib/validations/schemas/skill.ts
import { z } from 'zod';
import { VALIDATION_CONSTANTS } from '../../../libary/validations/constants/index';

export const difficultySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);
export const skillLevelSchema = z.enum(['NOVICE', 'BEGINNER', 'COMPETENT', 'PROFICIENT', 'EXPERT', 'MASTER']);

export const skillCreateSchema = z.object({
  name: z.string()
    .min(VALIDATION_CONSTANTS.SKILL.NAME.MIN, 'Название навыка слишком короткое')
    .max(VALIDATION_CONSTANTS.SKILL.NAME.MAX, 'Название навыка слишком длинное'),
  description: z.string()
    .max(VALIDATION_CONSTANTS.SKILL.DESCRIPTION.MAX, 'Описание слишком длинное')
    .optional(),
  category: z.string()
    .min(VALIDATION_CONSTANTS.SKILL.CATEGORY.MIN, 'Категория слишком короткая')
    .max(VALIDATION_CONSTANTS.SKILL.CATEGORY.MAX, 'Категория слишком длинная'),
  icon: z.string().optional(),
  difficulty: difficultySchema.optional()
});

export const skillUpdateSchema = skillCreateSchema.partial().extend({
  id: z.string().cuid('Некорректный ID навыка')
});

export const userSkillCreateSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  skillId: z.string().cuid('Некорректный ID навыка'),
  level: skillLevelSchema.optional(),
  experience: z.number().int().min(0, 'Опыт не может быть отрицательным').optional(),
  isLearning: z.boolean().optional(),
  goalLevel: skillLevelSchema.optional(),
  goalDate: z.string().datetime('Некорректная дата цели').optional(),
  progress: z.number().min(0).max(100, 'Прогресс не может превышать 100%').optional()
});

export const userSkillUpdateSchema = userSkillCreateSchema
  .omit({ userId: true, skillId: true })
  .partial()
  .extend({
    id: z.string().cuid('Некорректный ID связи пользователя и навыка')
  });

export const levelSystemSchema = z.object({
  skillId: z.string().cuid('Некорректный ID навыка').optional(),
  level: skillLevelSchema,
  minExperience: z.number().int().min(0, 'Опыт не может быть отрицательным'),
  description: z.string().optional()
});