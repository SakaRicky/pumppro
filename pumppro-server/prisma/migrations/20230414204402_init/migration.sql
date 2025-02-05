/*
  Warnings:

  - You are about to drop the column `expected_amount` on the `DailySale` table. All the data in the column will be lost.
  - Added the required column `amount_sold` to the `DailySale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "expected_amount",
ADD COLUMN     "amount_sold" DOUBLE PRECISION NOT NULL;
