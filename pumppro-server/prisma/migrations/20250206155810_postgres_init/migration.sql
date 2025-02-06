/*
  Warnings:

  - You are about to drop the column `start_count_fuel_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_fuel_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_fuel_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_gasoil_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_gasoil_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_gasoil_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_count_gaz` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_fuel_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_fuel_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_fuel_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_gasoil_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_gasoil_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_gasoil_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_count_gaz` on the `DailySale` table. All the data in the column will be lost.
  - You are about to alter the column `purchase_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `selling_price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "start_count_fuel_1",
DROP COLUMN "start_count_fuel_2",
DROP COLUMN "start_count_fuel_3",
DROP COLUMN "start_count_gasoil_1",
DROP COLUMN "start_count_gasoil_2",
DROP COLUMN "start_count_gasoil_3",
DROP COLUMN "start_count_gaz",
DROP COLUMN "stop_count_fuel_1",
DROP COLUMN "stop_count_fuel_2",
DROP COLUMN "stop_count_fuel_3",
DROP COLUMN "stop_count_gasoil_1",
DROP COLUMN "stop_count_gasoil_2",
DROP COLUMN "stop_count_gasoil_3",
DROP COLUMN "stop_count_gaz";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "purchase_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "selling_price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "FuelCount" (
    "id" SERIAL NOT NULL,
    "daily_sale_id" INTEGER NOT NULL,
    "fuel_type" "FuelType" NOT NULL,
    "start_count" INTEGER NOT NULL,
    "stop_count" INTEGER NOT NULL,

    CONSTRAINT "FuelCount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FuelCount" ADD CONSTRAINT "FuelCount_daily_sale_id_fkey" FOREIGN KEY ("daily_sale_id") REFERENCES "DailySale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
