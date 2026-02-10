import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class ProductsService {
  private prisma: any = new (PrismaClient as any)();

  async checkAvailability(
    productId: string,
    startDate: string | Date,
    endDate: string | Date,
    qty: number,
  ): Promise<boolean> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find all availability records that overlap with the requested date range
    const bookings = await this.prisma.availability.findMany({
      where: {
        productId,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    // Sum up booked quantity
    const bookedQty = bookings.reduce((sum: number, b: any) => sum + b.quantity, 0);

    // Get the product to check total quantity
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return false;
    }

    // Check if available quantity meets the request
    return product.quantity! - bookedQty >= qty;
  }

  async getProduct(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
        orderItems: true,
        availabilities: true,
      },
    });
  }

  async getProductsByVendor(vendorId: string) {
    return this.prisma.product.findMany({
      where: { vendorId },
      include: { availabilities: true },
    });
  }

  async bookAvailability(
    productId: string,
    startDate: string | Date,
    endDate: string | Date,
    qty: number,
  ) {
    // First check if availability exists
    const isAvailable = await this.checkAvailability(productId, startDate, endDate, qty);
    if (!isAvailable) {
      throw new Error('Product not available for the requested dates and quantity');
    }

    // Create availability record
    return this.prisma.availability.create({
      data: {
        productId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        quantity: qty,
      },
    });
  }
}
