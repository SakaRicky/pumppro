-- DropForeignKey
ALTER TABLE "Fuel" DROP CONSTRAINT "Fuel_tank_id_fkey";

-- AlterTable
ALTER TABLE "Fuel" ALTER COLUMN "tank_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Fuel" ADD CONSTRAINT "Fuel_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
