/*
  Warnings:

  - You are about to drop the column `date_of_sale` on the `DailySale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "date_of_sale",
ADD COLUMN     "date_of_sale_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_of_sale_stop" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
