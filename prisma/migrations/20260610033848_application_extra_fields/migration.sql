-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT,
    "roleType" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "certifications" TEXT NOT NULL DEFAULT '',
    "availability" TEXT NOT NULL DEFAULT '',
    "coverNote" TEXT NOT NULL DEFAULT '',
    "workAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "hasLicense" BOOLEAN NOT NULL DEFAULT false,
    "languages" TEXT NOT NULL DEFAULT '',
    "salaryExpectation" TEXT NOT NULL DEFAULT '',
    "resumeName" TEXT,
    "resumeType" TEXT,
    "resumeData" BLOB,
    "stage" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("availability", "certifications", "coverNote", "createdAt", "email", "firstName", "id", "jobId", "lastName", "location", "phone", "resumeData", "resumeName", "resumeType", "roleType", "stage", "updatedAt", "yearsExperience") SELECT "availability", "certifications", "coverNote", "createdAt", "email", "firstName", "id", "jobId", "lastName", "location", "phone", "resumeData", "resumeName", "resumeType", "roleType", "stage", "updatedAt", "yearsExperience" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
