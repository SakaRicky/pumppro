/*
  Warnings:

  - You are about to drop the column `quantity` on the `Tank` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Tank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fuel" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Tank" DROP COLUMN "quantity",
ADD COLUMN     "capacity" INTEGER NOT NULL;
