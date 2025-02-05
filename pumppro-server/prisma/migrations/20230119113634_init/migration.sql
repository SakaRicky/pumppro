/*
  Warnings:

  - Added the required column `godfather_phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localisation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "godfather_phone" TEXT NOT NULL,
ADD COLUMN     "localisation" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
