/*
  Warnings:

  - Changed the type of `fuel_type` on the `Pump` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pump" DROP COLUMN "fuel_type",
ADD COLUMN     "fuel_type" "FuelType" NOT NULL;
