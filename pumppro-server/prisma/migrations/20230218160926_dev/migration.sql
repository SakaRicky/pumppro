-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('FUEL', 'GASOIL', 'PETROL', 'GAS_BOTTLE');

-- AlterTable
ALTER TABLE "DailySale" ADD COLUMN     "fuelType" "FuelType";
