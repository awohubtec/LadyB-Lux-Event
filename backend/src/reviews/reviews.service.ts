import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class ReviewsService {
  private prisma: any = new (PrismaClient as any)();

  async createReview(userId: string, vendorId: string, data: any) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.review.create({
      data: {
        userId,
        vendorId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async getVendorReviews(vendorId: string) {
    return this.prisma.review.findMany({
      where: { vendorId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVendorRating(vendorId: string) {
    const reviews = await this.prisma.review.findMany({ where: { vendorId } });
    if (reviews.length === 0) return null;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return {
      averageRating: parseFloat(avgRating.toFixed(2)),
      totalReviews: reviews.length,
      ratingBreakdown: {
        '5': reviews.filter(r => r.rating === 5).length,
        '4': reviews.filter(r => r.rating === 4).length,
        '3': reviews.filter(r => r.rating === 3).length,
        '2': reviews.filter(r => r.rating === 2).length,
        '1': reviews.filter(r => r.rating === 1).length,
      },
    };
  }

  async deleteReview(reviewId: string) {
    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}
