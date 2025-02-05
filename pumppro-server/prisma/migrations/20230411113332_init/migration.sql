/*
  Warnings:

  - You are about to drop the column `quantity` on the `Fuel` table. All the data in the column will be lost.
  - Added the required column `quantity_actual` to the `Fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_theory` to the `Fuel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fuel" DROP COLUMN "quantity",
ADD COLUMN     "quantity_actual" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity_theory" DOUBLE PRECISION NOT NULL;
