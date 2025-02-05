/*
  Warnings:

  - You are about to drop the `FuelSale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FuelSale";

-- CreateTable
CREATE TABLE "Fuel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tank" (
    "id" SERIAL NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fuel_tank_id_key" ON "Fuel"("tank_id");

-- AddForeignKey
ALTER TABLE "Fuel" ADD CONSTRAINT "Fuel_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
