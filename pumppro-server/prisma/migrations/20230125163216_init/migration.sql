/*
  Warnings:

  - Made the column `godfather_phone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CNI_number` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "godfather_phone" SET NOT NULL,
ALTER COLUMN "CNI_number" SET NOT NULL;
