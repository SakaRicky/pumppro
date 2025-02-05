/*
  Warnings:

  - You are about to drop the column `amount` on the `SaleDetail` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SaleDetail" DROP COLUMN "amount",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DailySale" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "expected_amount" DOUBLE PRECISION NOT NULL,
    "amount_given" DOUBLE PRECISION NOT NULL,
    "difference" DOUBLE PRECISION NOT NULL,
    "start_index" INTEGER NOT NULL,
    "stop_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailySale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetrolSale" (
    "id" SERIAL NOT NULL,
    "pertol_price" INTEGER NOT NULL,
    "gasoil_price" INTEGER NOT NULL,
    "stock_petrol" INTEGER NOT NULL,
    "stock_gasoil" INTEGER NOT NULL,

    CONSTRAINT "PetrolSale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailySale" ADD CONSTRAINT "DailySale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
