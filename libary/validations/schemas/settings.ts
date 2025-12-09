// lib/validations/schemas/settings.ts
import { z } from 'zod';
import { 
  difficultySchema, 
  resourceTypeSchema 
} from './learning';

// Убедитесь, что все z.enum() имеют массив строк
export const profileVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY', 'SKILL_SPECIFIC']);
export const themeSchema = z.enum(['LIGHT', 'DARK', 'AUTO']);
export const fontSizeSchema = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']);
export const frequencySchema = z.enum(['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY']);
export const learningStyleSchema = z.enum(['VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC', 'MIXED']);

// Остальной код остается без изменений...
export const userSettingsSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  email: z.string().email('Некорректный email').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Некорректный URL').optional(),
  company: z.string().optional(),
  occupation: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  goalReminders: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  mentorNotifications: z.boolean().optional(),
  communityUpdates: z.boolean().optional(),
  defaultDifficulty: difficultySchema.optional(),
  preferredResourceType: resourceTypeSchema.optional(),
  autoGenerateGoals: z.boolean().optional(),
  studyReminders: z.boolean().optional(),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Некорректное время').optional()
});


export const userLearningPreferencesSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  learningStyle: learningStyleSchema.optional(),
  preferredDifficulty: difficultySchema.optional(),
  dailyStudyGoal: z.number().int().min(5).max(480).optional(),
  weeklyStudyGoal: z.number().int().min(30).max(2000).optional(),
  maxSessionDuration: z.number().int().min(10).max(480).optional(),
  preferredResourceTypes: z.array(resourceTypeSchema).optional(),
  videoPlaybackSpeed: z.number().min(0.5).max(3.0).optional(),
  autoPlayVideos: z.boolean().optional(),
  showTranscripts: z.boolean().optional(),
  enableSubtitles: z.boolean().optional(),
  sessionReminders: z.boolean().optional(),
  breakReminders: z.boolean().optional(),
  sessionLength: z.number().int().min(5).max(120).optional(),
  breakLength: z.number().int().min(1).max(30).optional(),
  longBreakLength: z.number().int().min(5).max(60).optional(),
  sessionsBeforeLongBreak: z.number().int().min(2).max(8).optional(),
  autoGoalAdjustment: z.boolean().optional(),
  showProgressCharts: z.boolean().optional(),
  celebrateMilestones: z.boolean().optional(),
  shareAchievements: z.boolean().optional(),
  topicsOfInterest: z.array(z.string()).optional()
});

export const userNotificationSettingsSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  emailFrequency: frequencySchema.optional(),
  digestFrequency: frequencySchema.optional(),
  notifyNewMessages: z.boolean().optional(),
  notifyGoalDue: z.boolean().optional(),
  notifyMentions: z.boolean().optional(),
  notifySkillSuggestions: z.boolean().optional(),
  notifyCommunityActivity: z.boolean().optional(),
  notifyStudyReminders: z.boolean().optional(),
  notifyProgressUpdates: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Некорректное время').optional(),
  quietHoursEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Некорректное время').optional(),
  preferredSendTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Некорректное время').optional()
});

export const userPrivacySettingsSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  profileVisibility: profileVisibilitySchema.optional(),
  showEmail: z.boolean().optional(),
  showRealName: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  showOccupation: z.boolean().optional(),
  showStudySessions: z.boolean().optional(),
  showCurrentProjects: z.boolean().optional(),
  showSkillLevels: z.boolean().optional(),
  showLearningPaths: z.boolean().optional(),
  showAchievements: z.boolean().optional(),
  showGoals: z.boolean().optional(),
  showStats: z.boolean().optional(),
  dataSharing: z.boolean().optional(),
  analyticsTracking: z.boolean().optional(),
  personalizedAds: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  blockedUsers: z.array(z.string().cuid('Некорректный ID пользователя')).optional()
});

export const userAppearanceSettingsSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  theme: themeSchema.optional(),
  accentColor: z.string().optional(),
  fontSize: fontSizeSchema.optional(),
  reducedMotion: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  sidebarCollapsed: z.boolean().optional(),
  showAvatars: z.boolean().optional(),
  compactView: z.boolean().optional(),
  denseTables: z.boolean().optional()
});

export const userSecuritySettingsSchema = z.object({
  userId: z.string().cuid('Некорректный ID пользователя'),
  twoFactorEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional(),
  backupCodes: z.array(z.string()).optional(),
  lastPasswordChange: z.string().datetime('Некорректная дата').optional(),
  loginAlerts: z.boolean().optional(),
  currentSessions: z.array(z.object({
    id: z.string(),
    device: z.string(),
    ip: z.string(),
    lastActive: z.string().datetime()
  })).optional(),
  trustedDevices: z.array(z.string()).optional(),
  dataExportEnabled: z.boolean().optional(),
  accountDeletionDate: z.string().datetime('Некорректная дата').optional()
});

// Типы для экспорта
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type UserLearningPreferencesInput = z.infer<typeof userLearningPreferencesSchema>;
export type UserNotificationSettingsInput = z.infer<typeof userNotificationSettingsSchema>;
export type UserPrivacySettingsInput = z.infer<typeof userPrivacySettingsSchema>;
export type UserAppearanceSettingsInput = z.infer<typeof userAppearanceSettingsSchema>;
export type UserSecuritySettingsInput = z.infer<typeof userSecuritySettingsSchema>;
export type ProfileVisibility = z.infer<typeof profileVisibilitySchema>;
export type Theme = z.infer<typeof themeSchema>;
export type FontSize = z.infer<typeof fontSizeSchema>;
export type Frequency = z.infer<typeof frequencySchema>;
export type LearningStyle = z.infer<typeof learningStyleSchema>;