/*
  Warnings:

  - You are about to drop the column `updateedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "updateedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
