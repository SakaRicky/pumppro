/*
  Warnings:

  - You are about to drop the column `fuelType` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index` on the `DailySale` table. All the data in the column will be lost.
  - Added the required column `price` to the `Fuel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "fuelType",
DROP COLUMN "start_index",
DROP COLUMN "stop_index",
ADD COLUMN     "start_index_fuel_1" INTEGER,
ADD COLUMN     "start_index_fuel_2" INTEGER,
ADD COLUMN     "start_index_fuel_3" INTEGER,
ADD COLUMN     "start_index_gasoil_1" INTEGER,
ADD COLUMN     "start_index_gasoil_2" INTEGER,
ADD COLUMN     "start_index_gasoil_3" INTEGER,
ADD COLUMN     "start_index_gaz" INTEGER,
ADD COLUMN     "stop_index_fuel_1" INTEGER,
ADD COLUMN     "stop_index_fuel_2" INTEGER,
ADD COLUMN     "stop_index_fuel_3" INTEGER,
ADD COLUMN     "stop_index_gasoil_1" INTEGER,
ADD COLUMN     "stop_index_gasoil_2" INTEGER,
ADD COLUMN     "stop_index_gasoil_3" INTEGER,
ADD COLUMN     "stop_index_gaz" INTEGER;

-- AlterTable
ALTER TABLE "Fuel" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
