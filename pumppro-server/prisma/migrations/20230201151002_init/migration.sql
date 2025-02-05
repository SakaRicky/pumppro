/*
  Warnings:

  - You are about to drop the column `description` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `reorder_point` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `selling_price` on the `Purchase` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Purchase_name_key";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "purchase_price",
DROP COLUMN "reorder_point",
DROP COLUMN "selling_price";
