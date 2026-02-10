import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class AdminService {
  private prisma: any = new (PrismaClient as any)();

  async stats() {
    const users = await this.prisma.user.count();
    const vendors = await this.prisma.vendor.count();
    const orders = await this.prisma.order.count();
    const payments = await this.prisma.payment.count();

    return { users, vendors, orders, payments };
  }

  async recentOrders(limit = 10) {
    return this.prisma.order.findMany({ take: limit, orderBy: { createdAt: 'desc' } });
  }
}
