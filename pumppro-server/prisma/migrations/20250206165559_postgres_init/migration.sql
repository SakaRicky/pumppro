/*
  Warnings:

  - You are about to alter the column `purchase_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `selling_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "purchase_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "selling_price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SaleDetail" ALTER COLUMN "unit_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "salary" SET DATA TYPE DOUBLE PRECISION;
