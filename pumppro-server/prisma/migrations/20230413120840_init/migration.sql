/*
  Warnings:

  - You are about to drop the column `start_index_fuel_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_fuel_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_fuel_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_gasoil_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_gasoil_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_gasoil_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `start_index_gaz` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_fuel_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_fuel_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_fuel_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_gasoil_1` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_gasoil_2` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_gasoil_3` on the `DailySale` table. All the data in the column will be lost.
  - You are about to drop the column `stop_index_gaz` on the `DailySale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "start_index_fuel_1",
DROP COLUMN "start_index_fuel_2",
DROP COLUMN "start_index_fuel_3",
DROP COLUMN "start_index_gasoil_1",
DROP COLUMN "start_index_gasoil_2",
DROP COLUMN "start_index_gasoil_3",
DROP COLUMN "start_index_gaz",
DROP COLUMN "stop_index_fuel_1",
DROP COLUMN "stop_index_fuel_2",
DROP COLUMN "stop_index_fuel_3",
DROP COLUMN "stop_index_gasoil_1",
DROP COLUMN "stop_index_gasoil_2",
DROP COLUMN "stop_index_gasoil_3",
DROP COLUMN "stop_index_gaz",
ADD COLUMN     "start_count_fuel_1" INTEGER,
ADD COLUMN     "start_count_fuel_2" INTEGER,
ADD COLUMN     "start_count_fuel_3" INTEGER,
ADD COLUMN     "start_count_gasoil_1" INTEGER,
ADD COLUMN     "start_count_gasoil_2" INTEGER,
ADD COLUMN     "start_count_gasoil_3" INTEGER,
ADD COLUMN     "start_count_gaz" INTEGER,
ADD COLUMN     "stop_count_fuel_1" INTEGER,
ADD COLUMN     "stop_count_fuel_2" INTEGER,
ADD COLUMN     "stop_count_fuel_3" INTEGER,
ADD COLUMN     "stop_count_gasoil_1" INTEGER,
ADD COLUMN     "stop_count_gasoil_2" INTEGER,
ADD COLUMN     "stop_count_gasoil_3" INTEGER,
ADD COLUMN     "stop_count_gaz" INTEGER;
