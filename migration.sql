-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'DEF', 'MID', 'FWD');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'FINISHED', 'POSTPONED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('YELLOW', 'RED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "SeasonStatus" NOT NULL DEFAULT 'UPCOMING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "captainName" TEXT,
    "coachName" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "number" INTEGER,
    "position" "Position",
    "photoUrl" TEXT,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "round" INTEGER,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "refereeId" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "mvpPlayerId" TEXT,
    "fullVideoUrl" TEXT,
    "highlightsVideoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchLineup" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "isStarting" BOOLEAN NOT NULL DEFAULT true,
    "isCaptainForMatch" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MatchLineup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "scorerId" TEXT NOT NULL,
    "assistId" TEXT,
    "minute" INTEGER NOT NULL,
    "isOwnGoal" BOOLEAN NOT NULL DEFAULT false,
    "isPenalty" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "minute" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamApplication" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT,
    "teamName" TEXT NOT NULL,
    "captainName" TEXT NOT NULL,
    "captainPhone" TEXT NOT NULL,
    "city" TEXT,
    "comment" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_key" ON "Season"("slug");

-- CreateIndex
CREATE INDEX "Team_seasonId_idx" ON "Team"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_seasonId_slug_key" ON "Team"("seasonId", "slug");

-- CreateIndex
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamId_slug_key" ON "Player"("teamId", "slug");

-- CreateIndex
CREATE INDEX "Match_seasonId_idx" ON "Match"("seasonId");

-- CreateIndex
CREATE INDEX "Match_homeTeamId_idx" ON "Match"("homeTeamId");

-- CreateIndex
CREATE INDEX "Match_awayTeamId_idx" ON "Match"("awayTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchLineup_matchId_playerId_key" ON "MatchLineup"("matchId", "playerId");

-- CreateIndex
CREATE INDEX "Goal_matchId_idx" ON "Goal"("matchId");

-- CreateIndex
CREATE INDEX "Card_matchId_idx" ON "Card"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Referee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_mvpPlayerId_fkey" FOREIGN KEY ("mvpPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineup" ADD CONSTRAINT "MatchLineup_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineup" ADD CONSTRAINT "MatchLineup_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineup" ADD CONSTRAINT "MatchLineup_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_scorerId_fkey" FOREIGN KEY ("scorerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assistId_fkey" FOREIGN KEY ("assistId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamApplication" ADD CONSTRAINT "TeamApplication_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

