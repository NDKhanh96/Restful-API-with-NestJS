/*
  Warnings:

  - You are about to drop the column `userID` on the `notes` table. All the data in the column will be lost.
  - Added the required column `userId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_userID_fkey";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "userID",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
