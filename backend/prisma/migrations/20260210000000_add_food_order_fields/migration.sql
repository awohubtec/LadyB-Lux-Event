-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "deliveryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "dailyCapacity" INTEGER;
