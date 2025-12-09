// lib/validations/index.ts
export * from './schemas/user';
export * from './schemas/skill';
export * from './schemas/learning';
export * from './schemas/community';
export * from './schemas/settings';
export * from '../../libary/validations/constants';
export * from './utils';

// Явно реэкспортируем схемы чтобы избежать конфликтов
export {
  difficultySchema,
  resourceTypeSchema,
  sessionTypeSchema,
  projectStatusSchema
} from './schemas/learning';

export {
  skillLevelSchema
} from './schemas/skill';

// userRoleSchema находится в user.ts, а не в skill.ts
export {
  userRoleSchema
} from './schemas/user';

export {
  profileVisibilitySchema,
  themeSchema,
  fontSizeSchema,
  frequencySchema,
  learningStyleSchema
} from './schemas/settings';

// Типы для использования в приложении
export type {
  UserCreateInput,
  UserUpdateInput,
  UserLoginInput
} from './schemas/user';

export type {
  StudySessionCreateInput,
  ProjectCreateInput,
  GoalCreateInput
} from './schemas/learning';

export type {
  UserSettingsInput,
  UserLearningPreferencesInput
} from './schemas/settings';