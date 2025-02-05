-- DropForeignKey
ALTER TABLE "SaleDetail" DROP CONSTRAINT "SaleDetail_Sale_id_fkey";

-- AddForeignKey
ALTER TABLE "SaleDetail" ADD CONSTRAINT "SaleDetail_Sale_id_fkey" FOREIGN KEY ("Sale_id") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
