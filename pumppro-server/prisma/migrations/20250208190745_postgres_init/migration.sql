/*
  Warnings:

  - You are about to drop the column `fuel_type` on the `FuelCount` table. All the data in the column will be lost.
  - Added the required column `fuel_type` to the `Fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel_id` to the `FuelCount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fuel" ADD COLUMN     "fuel_type" "FuelType" NOT NULL;

-- AlterTable
ALTER TABLE "FuelCount" DROP COLUMN "fuel_type",
ADD COLUMN     "fuel_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FuelCount" ADD CONSTRAINT "FuelCount_fuel_id_fkey" FOREIGN KEY ("fuel_id") REFERENCES "Fuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
