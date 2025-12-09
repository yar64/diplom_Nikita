// lib/validations/utils.ts
import { z } from 'zod';

export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Используем result.error.issues вместо result.error.errors
    const errors = result.error.issues.map(issue => 
      `${issue.path.join('.')}: ${issue.message}`
    );
    return { success: false, errors };
  }
};

// Для создания частичного валидатора нужно использовать правильный тип
export const createPartialValidator = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return schema.partial();
};

// Альтернативный вариант для любых схем
export const createPartialSchema = <T>(schema: z.ZodSchema<T>) => {
  if (schema instanceof z.ZodObject) {
    return schema.partial();
  }
  // Для других типов схем возвращаем как есть или создаем partial по-другому
  return schema;
};

export const validateId = (id: string) => {
  return z.string().cuid('Некорректный ID').parse(id);
};

export const validateIds = (ids: string[]) => {
  return z.array(z.string().cuid('Некорректный ID')).parse(ids);
};

// Дополнительные утилиты для удобства
export const validateEmail = (email: string) => {
  return z.string().email('Некорректный email').parse(email);
};

export const validatePassword = (password: string) => {
  return z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100, 'Пароль слишком длинный')
    .parse(password);
};

export const validateNumberRange = (value: number, min: number, max: number) => {
  return z.number()
    .min(min, `Значение должно быть не менее ${min}`)
    .max(max, `Значение должно быть не более ${max}`)
    .parse(value);
};

// Утилита для преобразования ошибок в читаемый формат
export const formatValidationErrors = (error: z.ZodError) => {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }));
};

// Утилита для безопасного парсинга с дефолтными значениями
export const safeParseWithDefault = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T => {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
};