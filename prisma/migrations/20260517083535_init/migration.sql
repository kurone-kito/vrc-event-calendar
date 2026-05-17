-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('PARTY', 'MUSIC', 'ART', 'GAME', 'SOCIAL', 'OTHER');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "category" "EventCategory" NOT NULL,
    "worldId" TEXT,
    "worldName" TEXT,
    "creatorToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
