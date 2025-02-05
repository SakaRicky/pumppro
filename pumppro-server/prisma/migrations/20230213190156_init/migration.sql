/*
  Warnings:

  - You are about to drop the `PetrolSale` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "image" DROP DEFAULT;

-- DropTable
DROP TABLE "PetrolSale";

-- CreateTable
CREATE TABLE "FuelSale" (
    "id" SERIAL NOT NULL,
    "pertol_price" INTEGER NOT NULL,
    "gasoil_price" INTEGER NOT NULL,
    "gas_price" INTEGER NOT NULL,
    "stock_petrol" INTEGER NOT NULL,
    "stock_gasoil" INTEGER NOT NULL,
    "stock_gas" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelSale_pkey" PRIMARY KEY ("id")
);
