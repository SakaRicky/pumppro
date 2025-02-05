/*
  Warnings:

  - Added the required column `name` to the `Tank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tank" ADD COLUMN     "name" TEXT NOT NULL;
