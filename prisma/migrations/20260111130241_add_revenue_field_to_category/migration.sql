-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "coursesCount" INTEGER NOT NULL DEFAULT 0,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_categories" ("color", "coursesCount", "createdAt", "description", "icon", "id", "isActive", "name", "order", "seoDescription", "seoTitle", "slug", "studentsCount", "updatedAt") SELECT "color", "coursesCount", "createdAt", "description", "icon", "id", "isActive", "name", "order", "seoDescription", "seoTitle", "slug", "studentsCount", "updatedAt" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
