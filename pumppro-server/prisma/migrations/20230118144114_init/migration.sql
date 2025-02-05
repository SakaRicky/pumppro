/*
  Warnings:

  - You are about to drop the column `salesPersonId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SalesPerson` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - Added the required column `salesPerson_id` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SalesPerson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_salesPersonId_fkey";

-- DropForeignKey
ALTER TABLE "SalesPerson" DROP CONSTRAINT "SalesPerson_userId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "salesPersonId",
ADD COLUMN     "salesPerson_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalesPerson" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
DROP COLUMN "profilePicture",
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "profile_picture" TEXT;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_salesPerson_id_fkey" FOREIGN KEY ("salesPerson_id") REFERENCES "SalesPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPerson" ADD CONSTRAINT "SalesPerson_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
