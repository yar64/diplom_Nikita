/*
  Warnings:

  - You are about to drop the `learning_resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `denseTables` on the `user_appearance_settings` table. All the data in the column will be lost.
  - You are about to drop the column `preferredResourceTypes` on the `user_learning_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `preferredResourceType` on the `user_settings` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "learning_resources";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "reviews";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "excerpt" TEXT,
    "thumbnailUrl" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER NOT NULL DEFAULT 0,
    "price" REAL,
    "originalPrice" REAL,
    "discountPercent" INTEGER,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "level" TEXT NOT NULL DEFAULT 'BEGINNER',
    "language" TEXT NOT NULL DEFAULT 'ru',
    "duration" INTEGER,
    "instructorId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_chapters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_chapters_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "chapterId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'VIDEO',
    "videoUrl" TEXT,
    "duration" INTEGER,
    "content" TEXT,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_lessons_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "course_chapters" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" REAL NOT NULL DEFAULT 0,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studyPlanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_enrollments_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "study_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "course_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "course_enrollments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "course_skills_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "course_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "goal_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "targetLevel" TEXT,
    CONSTRAINT "goal_skills_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "goal_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "level_systems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT,
    "level" TEXT NOT NULL,
    "minExperience" INTEGER NOT NULL,
    "description" TEXT,
    CONSTRAINT "level_systems_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "study_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "skillId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "passScore" INTEGER NOT NULL DEFAULT 70,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "courseId" TEXT,
    "lessonId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quizzes_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quizzes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" JSONB NOT NULL,
    "timeSpent" INTEGER,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "study_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userSkillId" TEXT NOT NULL,
    "lessonId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "study_notes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_lessons" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "study_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "study_notes_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES "user_skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "skillId" TEXT,
    "courseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "goals_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "goals_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_goals" ("completedAt", "createdAt", "description", "id", "isCompleted", "skillId", "targetDate", "title", "updatedAt", "userId") SELECT "completedAt", "createdAt", "description", "id", "isCompleted", "skillId", "targetDate", "title", "updatedAt", "userId" FROM "goals";
DROP TABLE "goals";
ALTER TABLE "new_goals" RENAME TO "goals";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "id", "isRead", "message", "title", "type", "userId") SELECT "createdAt", "id", "isRead", "message", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_study_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionType" TEXT NOT NULL DEFAULT 'PRACTICE',
    "efficiency" INTEGER,
    "userId" TEXT NOT NULL,
    "userSkillId" TEXT NOT NULL,
    "courseEnrollmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "study_sessions_courseEnrollmentId_fkey" FOREIGN KEY ("courseEnrollmentId") REFERENCES "course_enrollments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "study_sessions_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES "user_skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "study_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_study_sessions" ("createdAt", "date", "description", "duration", "efficiency", "id", "sessionType", "updatedAt", "userId", "userSkillId") SELECT "createdAt", "date", "description", "duration", "efficiency", "id", "sessionType", "updatedAt", "userId", "userSkillId" FROM "study_sessions";
DROP TABLE "study_sessions";
ALTER TABLE "new_study_sessions" RENAME TO "study_sessions";
CREATE TABLE "new_user_appearance_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'LIGHT',
    "accentColor" TEXT NOT NULL DEFAULT 'blue',
    "fontSize" TEXT NOT NULL DEFAULT 'MEDIUM',
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "highContrast" BOOLEAN NOT NULL DEFAULT false,
    "sidebarCollapsed" BOOLEAN NOT NULL DEFAULT false,
    "showAvatars" BOOLEAN NOT NULL DEFAULT true,
    "compactView" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_appearance_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_appearance_settings" ("accentColor", "compactView", "createdAt", "fontSize", "highContrast", "id", "reducedMotion", "showAvatars", "sidebarCollapsed", "theme", "updatedAt", "userId") SELECT "accentColor", "compactView", "createdAt", "fontSize", "highContrast", "id", "reducedMotion", "showAvatars", "sidebarCollapsed", "theme", "updatedAt", "userId" FROM "user_appearance_settings";
DROP TABLE "user_appearance_settings";
ALTER TABLE "new_user_appearance_settings" RENAME TO "user_appearance_settings";
CREATE UNIQUE INDEX "user_appearance_settings_userId_key" ON "user_appearance_settings"("userId");
CREATE TABLE "new_user_learning_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "learningStyle" TEXT NOT NULL DEFAULT 'VISUAL',
    "preferredDifficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "dailyStudyGoal" INTEGER NOT NULL DEFAULT 60,
    "weeklyStudyGoal" INTEGER NOT NULL DEFAULT 300,
    "maxSessionDuration" INTEGER NOT NULL DEFAULT 120,
    "videoPlaybackSpeed" REAL NOT NULL DEFAULT 1.0,
    "autoPlayVideos" BOOLEAN NOT NULL DEFAULT true,
    "showTranscripts" BOOLEAN NOT NULL DEFAULT true,
    "enableSubtitles" BOOLEAN NOT NULL DEFAULT false,
    "sessionReminders" BOOLEAN NOT NULL DEFAULT true,
    "breakReminders" BOOLEAN NOT NULL DEFAULT true,
    "sessionLength" INTEGER NOT NULL DEFAULT 25,
    "breakLength" INTEGER NOT NULL DEFAULT 5,
    "longBreakLength" INTEGER NOT NULL DEFAULT 15,
    "sessionsBeforeLongBreak" INTEGER NOT NULL DEFAULT 4,
    "autoGoalAdjustment" BOOLEAN NOT NULL DEFAULT true,
    "showProgressCharts" BOOLEAN NOT NULL DEFAULT true,
    "celebrateMilestones" BOOLEAN NOT NULL DEFAULT true,
    "shareAchievements" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_learning_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_learning_preferences" ("autoGoalAdjustment", "autoPlayVideos", "breakLength", "breakReminders", "celebrateMilestones", "createdAt", "dailyStudyGoal", "enableSubtitles", "id", "learningStyle", "longBreakLength", "maxSessionDuration", "preferredDifficulty", "sessionLength", "sessionReminders", "sessionsBeforeLongBreak", "shareAchievements", "showProgressCharts", "showTranscripts", "updatedAt", "userId", "videoPlaybackSpeed", "weeklyStudyGoal") SELECT "autoGoalAdjustment", "autoPlayVideos", "breakLength", "breakReminders", "celebrateMilestones", "createdAt", "dailyStudyGoal", "enableSubtitles", "id", "learningStyle", "longBreakLength", "maxSessionDuration", "preferredDifficulty", "sessionLength", "sessionReminders", "sessionsBeforeLongBreak", "shareAchievements", "showProgressCharts", "showTranscripts", "updatedAt", "userId", "videoPlaybackSpeed", "weeklyStudyGoal" FROM "user_learning_preferences";
DROP TABLE "user_learning_preferences";
ALTER TABLE "new_user_learning_preferences" RENAME TO "user_learning_preferences";
CREATE UNIQUE INDEX "user_learning_preferences_userId_key" ON "user_learning_preferences"("userId");
CREATE TABLE "new_user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "company" TEXT,
    "occupation" TEXT,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "goalReminders" BOOLEAN NOT NULL DEFAULT true,
    "weeklyReports" BOOLEAN NOT NULL DEFAULT true,
    "mentorNotifications" BOOLEAN NOT NULL DEFAULT true,
    "communityUpdates" BOOLEAN NOT NULL DEFAULT true,
    "defaultDifficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "autoGenerateGoals" BOOLEAN NOT NULL DEFAULT false,
    "studyReminders" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT DEFAULT '20:00',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_settings" ("autoGenerateGoals", "communityUpdates", "company", "createdAt", "defaultDifficulty", "email", "emailNotifications", "goalReminders", "id", "location", "mentorNotifications", "occupation", "phone", "pushNotifications", "reminderTime", "studyReminders", "updatedAt", "userId", "website", "weeklyReports") SELECT "autoGenerateGoals", "communityUpdates", "company", "createdAt", "defaultDifficulty", "email", "emailNotifications", "goalReminders", "id", "location", "mentorNotifications", "occupation", "phone", "pushNotifications", "reminderTime", "studyReminders", "updatedAt", "userId", "website", "weeklyReports" FROM "user_settings";
DROP TABLE "user_settings";
ALTER TABLE "new_user_settings" RENAME TO "user_settings";
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");
CREATE TABLE "new_user_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalStudyTime" INTEGER NOT NULL DEFAULT 0,
    "completedGoals" INTEGER NOT NULL DEFAULT 0,
    "skillsLearned" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "weeklyProgress" REAL NOT NULL DEFAULT 0,
    "monthlyProgress" REAL NOT NULL DEFAULT 0,
    "badgesEarned" INTEGER NOT NULL DEFAULT 0,
    "quizzesPassed" INTEGER NOT NULL DEFAULT 0,
    "coursesEnrolled" INTEGER NOT NULL DEFAULT 0,
    "coursesCompleted" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_stats" ("completedGoals", "currentStreak", "id", "longestStreak", "monthlyProgress", "skillsLearned", "totalStudyTime", "updatedAt", "userId", "weeklyProgress") SELECT "completedGoals", "currentStreak", "id", "longestStreak", "monthlyProgress", "skillsLearned", "totalStudyTime", "updatedAt", "userId", "weeklyProgress" FROM "user_stats";
DROP TABLE "user_stats";
ALTER TABLE "new_user_stats" RENAME TO "user_stats";
CREATE UNIQUE INDEX "user_stats_userId_key" ON "user_stats"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "course_reviews_userId_courseId_key" ON "course_reviews"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_userId_courseId_key" ON "course_enrollments"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_enrollmentId_lessonId_key" ON "course_progress"("enrollmentId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "course_skills_courseId_skillId_key" ON "course_skills"("courseId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "goal_skills_goalId_skillId_key" ON "goal_skills"("goalId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "level_systems_skillId_level_key" ON "level_systems"("skillId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");
