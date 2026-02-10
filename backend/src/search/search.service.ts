import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class SearchService {
  private prisma: any = new (PrismaClient as any)();

  async searchProducts(
    query?: string,
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    vendorId?: string,
  ) {
    return this.prisma.product.findMany({
      where: {
        AND: [
          query ? { OR: [{ name: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } }] } : {},
          type ? { type } : {},
          minPrice !== undefined ? { price: { gte: minPrice } } : {},
          maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
          category ? { vendor: { category } } : {},
          vendorId ? { vendorId } : {},
        ],
      },
      include: { vendor: true },
      take: 50,
    });
  }

  async searchVendors(
    query?: string,
    category?: string,
    verifiedOnly = false,
  ) {
    return this.prisma.vendor.findMany({
      where: {
        AND: [
          query ? { OR: [{ businessName: { contains: query, mode: 'insensitive' } }, { location: { contains: query, mode: 'insensitive' } }] } : {},
          category ? { category } : {},
          verifiedOnly ? { verified: true } : {},
        ],
      },
      include: { products: true, _count: { select: { products: true, reviews: true } } },
      take: 50,
    });
  }

  async searchEvents(
    query?: string,
    userId?: string,
  ) {
    return this.prisma.event.findMany({
      where: {
        AND: [
          query ? { title: { contains: query, mode: 'insensitive' } } : {},
          userId ? { userId } : {},
        ],
      },
      include: { user: { select: { name: true } }, orders: true },
      take: 50,
    });
  }

  async advancedSearch(
    type: 'products' | 'vendors' | 'events',
    filters: any,
  ) {
    if (type === 'products') {
      return this.searchProducts(
        filters.query,
        filters.type,
        filters.minPrice,
        filters.maxPrice,
        filters.category,
        filters.vendorId,
      );
    } else if (type === 'vendors') {
      return this.searchVendors(filters.query, filters.category, filters.verifiedOnly);
    } else {
      return this.searchEvents(filters.query, filters.userId);
    }
  }
}
