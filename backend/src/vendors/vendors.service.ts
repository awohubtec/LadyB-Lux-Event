import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class VendorsService {
  private prisma: any = new (PrismaClient as any)();

  async createVendor(userId: string, data: any) {
    return this.prisma.vendor.create({
      data: {
        userId,
        category: data.category,
        businessName: data.businessName,
        location: data.location,
      },
    });
  }

  async findById(id: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async list() {
    return this.prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async verifyVendor(id: string) {
    return this.prisma.vendor.update({ where: { id }, data: { verified: true } });
  }
}
