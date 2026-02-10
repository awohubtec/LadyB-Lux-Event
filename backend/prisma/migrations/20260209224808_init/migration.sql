-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
