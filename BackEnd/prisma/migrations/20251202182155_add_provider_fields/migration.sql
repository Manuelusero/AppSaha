-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN "criminalRecord" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "dniDocument" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "dniNumber" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "facebook" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "instagram" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "profilePhoto" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "videoUrls" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "website" TEXT;
ALTER TABLE "ProviderProfile" ADD COLUMN "workPhotos" TEXT;

-- CreateTable
CREATE TABLE "ProviderReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderReference_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProviderReference_providerId_idx" ON "ProviderReference"("providerId");
