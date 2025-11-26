-- CreateTable
CREATE TABLE "user_settings" (
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
    "preferredResourceType" TEXT NOT NULL DEFAULT 'VIDEO',
    "autoGenerateGoals" BOOLEAN NOT NULL DEFAULT false,
    "studyReminders" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" TEXT DEFAULT '20:00',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_notification_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "emailFrequency" TEXT NOT NULL DEFAULT 'DAILY',
    "digestFrequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "notifyNewMessages" BOOLEAN NOT NULL DEFAULT true,
    "notifyGoalDue" BOOLEAN NOT NULL DEFAULT true,
    "notifyMentions" BOOLEAN NOT NULL DEFAULT true,
    "notifySkillSuggestions" BOOLEAN NOT NULL DEFAULT true,
    "notifyCommunityActivity" BOOLEAN NOT NULL DEFAULT false,
    "notifyStudyReminders" BOOLEAN NOT NULL DEFAULT true,
    "notifyProgressUpdates" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" TEXT DEFAULT '22:00',
    "quietHoursEnd" TEXT DEFAULT '08:00',
    "preferredSendTime" TEXT DEFAULT '18:00',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_privacy_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profileVisibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showRealName" BOOLEAN NOT NULL DEFAULT false,
    "showLocation" BOOLEAN NOT NULL DEFAULT false,
    "showOccupation" BOOLEAN NOT NULL DEFAULT false,
    "showStudySessions" BOOLEAN NOT NULL DEFAULT true,
    "showCurrentProjects" BOOLEAN NOT NULL DEFAULT true,
    "showSkillLevels" BOOLEAN NOT NULL DEFAULT true,
    "showLearningPaths" BOOLEAN NOT NULL DEFAULT true,
    "showAchievements" BOOLEAN NOT NULL DEFAULT true,
    "showGoals" BOOLEAN NOT NULL DEFAULT true,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "dataSharing" BOOLEAN NOT NULL DEFAULT false,
    "analyticsTracking" BOOLEAN NOT NULL DEFAULT true,
    "personalizedAds" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "blockedUsers" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_privacy_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_appearance_settings" (
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
    "denseTables" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_appearance_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_learning_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "learningStyle" TEXT NOT NULL DEFAULT 'VISUAL',
    "preferredDifficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "dailyStudyGoal" INTEGER NOT NULL DEFAULT 60,
    "weeklyStudyGoal" INTEGER NOT NULL DEFAULT 300,
    "maxSessionDuration" INTEGER NOT NULL DEFAULT 120,
    "preferredResourceTypes" JSONB,
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

-- CreateTable
CREATE TABLE "user_security_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "backupCodes" JSONB,
    "lastPasswordChange" DATETIME,
    "loginAlerts" BOOLEAN NOT NULL DEFAULT true,
    "currentSessions" JSONB,
    "trustedDevices" JSONB,
    "dataExportEnabled" BOOLEAN NOT NULL DEFAULT true,
    "accountDeletionDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_security_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "dataType" TEXT NOT NULL DEFAULT 'STRING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "userId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_settings_userId_key" ON "user_notification_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_privacy_settings_userId_key" ON "user_privacy_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_appearance_settings_userId_key" ON "user_appearance_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_preferences_userId_key" ON "user_learning_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_security_settings_userId_key" ON "user_security_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");
