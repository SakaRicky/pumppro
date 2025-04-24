/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Fuel` table. All the data in the column will be lost.
  - You are about to alter the column `quantity_actual` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `quantity_theory` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `purchase_price` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `selling_price` on the `Fuel` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `updatedAt` on the `MessageNotification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `purchase_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `selling_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `updatedAt` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `fuelid` on the `Pump` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `SaleDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SaleDetail` table. All the data in the column will be lost.
  - You are about to alter the column `unit_price` on the `SaleDetail` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `updatedAt` on the `Tank` table. All the data in the column will be lost.
  - You are about to drop the column `CNI_number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `salary` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `DailySale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FuelCount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tank` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tank_id` on table `Fuel` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `MessageNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_price` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cni_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SYSTEM_USER', 'WORKER');

-- DropForeignKey
ALTER TABLE "DailySale" DROP CONSTRAINT "DailySale_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Fuel" DROP CONSTRAINT "Fuel_tank_id_fkey";

-- DropForeignKey
ALTER TABLE "FuelCount" DROP CONSTRAINT "FuelCount_daily_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "FuelCount" DROP CONSTRAINT "FuelCount_fuel_id_fkey";

-- DropForeignKey
ALTER TABLE "Pump" DROP CONSTRAINT "Pump_fuelid_fkey";

-- DropForeignKey
ALTER TABLE "SaleDetail" DROP CONSTRAINT "SaleDetail_product_id_fkey";

-- AlterTable
ALTER TABLE "Fuel" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "tank_id" SET NOT NULL,
ALTER COLUMN "quantity_actual" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "quantity_theory" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "purchase_price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "selling_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "MessageNotification" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "read" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "purchase_price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "selling_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Pump" DROP COLUMN "fuelid",
ADD COLUMN     "fuel_id" INTEGER;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "updatedAt",
ADD COLUMN     "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "purchase_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "total_amount",
DROP COLUMN "updatedAt",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SaleDetail" DROP COLUMN "total_amount",
DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Tank" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "CNI_number",
DROP COLUMN "updatedAt",
ADD COLUMN     "cni_number" TEXT NOT NULL,
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'WORKER',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "salary" SET DATA TYPE DECIMAL(65,30);

-- DropTable
DROP TABLE "DailySale";

-- DropTable
DROP TABLE "FuelCount";

-- CreateTable
CREATE TABLE "DailySalesSummary" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_sold" DECIMAL(65,30) NOT NULL,
    "amount_given" DECIMAL(65,30) NOT NULL,
    "date_of_sale_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_of_sale_stop" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySalesSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelSale" (
    "id" SERIAL NOT NULL,
    "fuel_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "start_reading" DECIMAL(65,30) NOT NULL,
    "end_reading" DECIMAL(65,30) NOT NULL,
    "quantity_sold" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedCost" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FixedCost_month_year_name_key" ON "FixedCost"("month", "year", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "Sale_user_id_idx" ON "Sale"("user_id");

-- CreateIndex
CREATE INDEX "SaleDetail_sale_id_idx" ON "SaleDetail"("sale_id");

-- CreateIndex
CREATE INDEX "SaleDetail_product_id_idx" ON "SaleDetail"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tank_name_key" ON "Tank"("name");

-- AddForeignKey
ALTER TABLE "SaleDetail" ADD CONSTRAINT "SaleDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySalesSummary" ADD CONSTRAINT "DailySalesSummary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fuel" ADD CONSTRAINT "Fuel_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelSale" ADD CONSTRAINT "FuelSale_fuel_id_fkey" FOREIGN KEY ("fuel_id") REFERENCES "Fuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelSale" ADD CONSTRAINT "FuelSale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pump" ADD CONSTRAINT "Pump_fuel_id_fkey" FOREIGN KEY ("fuel_id") REFERENCES "Fuel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
