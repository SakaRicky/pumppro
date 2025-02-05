/*
  Warnings:

  - Added the required column `unit_price` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleDetail" ADD COLUMN     "unit_price" INTEGER NOT NULL;
