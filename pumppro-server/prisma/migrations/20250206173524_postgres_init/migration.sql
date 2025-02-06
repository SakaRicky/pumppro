/*
  Warnings:

  - You are about to alter the column `total_amount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "total_amount" SET DATA TYPE DOUBLE PRECISION;
