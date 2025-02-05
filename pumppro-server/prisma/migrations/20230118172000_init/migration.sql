/*
  Warnings:

  - You are about to drop the column `salesPerson_id` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `SalesPerson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_salesPerson_id_fkey";

-- DropForeignKey
ALTER TABLE "SalesPerson" DROP CONSTRAINT "SalesPerson_user_id_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "salesPerson_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "SalesPerson";

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
