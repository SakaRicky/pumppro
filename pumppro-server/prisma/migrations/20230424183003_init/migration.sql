/*
  Warnings:

  - Added the required column `title` to the `MessageNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageNotification" ADD COLUMN     "title" TEXT NOT NULL;
