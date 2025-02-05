/*
  Warnings:

  - You are about to drop the column `date` on the `DailySale` table. All the data in the column will be lost.
  - Added the required column `date_of_sale` to the `DailySale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailySale" DROP COLUMN "date",
ADD COLUMN     "date_of_sale" TIMESTAMP(3) NOT NULL;
