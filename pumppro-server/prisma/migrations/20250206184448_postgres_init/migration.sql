/*
  Warnings:

  - You are about to drop the column `fuel_type` on the `Pump` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pump" DROP COLUMN "fuel_type",
ADD COLUMN     "fuelid" INTEGER;

-- AddForeignKey
ALTER TABLE "Pump" ADD CONSTRAINT "Pump_fuelid_fkey" FOREIGN KEY ("fuelid") REFERENCES "Fuel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
