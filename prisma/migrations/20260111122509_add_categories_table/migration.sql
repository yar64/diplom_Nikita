/*
  Warnings:

  - You are about to drop the column `category` on the `courses` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "coursesCount" INTEGER NOT NULL DEFAULT 0,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "excerpt" TEXT,
    "thumbnailUrl" TEXT,
    "categoryId" TEXT,
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
    CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("averageRating", "createdAt", "description", "discountPercent", "duration", "excerpt", "id", "instructorId", "isFeatured", "isFree", "language", "level", "originalPrice", "price", "publishedAt", "slug", "status", "tags", "thumbnailUrl", "title", "totalLessons", "totalReviews", "totalStudents", "updatedAt") SELECT "averageRating", "createdAt", "description", "discountPercent", "duration", "excerpt", "id", "instructorId", "isFeatured", "isFree", "language", "level", "originalPrice", "price", "publishedAt", "slug", "status", "tags", "thumbnailUrl", "title", "totalLessons", "totalReviews", "totalStudents", "updatedAt" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
