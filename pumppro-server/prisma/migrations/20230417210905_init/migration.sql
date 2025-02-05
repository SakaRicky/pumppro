/*
  Warnings:

  - You are about to drop the column `price` on the `Fuel` table. All the data in the column will be lost.
  - Added the required column `purchase_price` to the `Fuel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selling_price` to the `Fuel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fuel" DROP COLUMN "price",
ADD COLUMN     "purchase_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "selling_price" DOUBLE PRECISION NOT NULL;
