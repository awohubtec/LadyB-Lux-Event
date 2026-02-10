import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class ReceiptsService {
  private prisma: any = new (PrismaClient as any)();

  async generateReceipt(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
        event: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const items = order.items.map(item => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));

    return this.prisma.receipt.create({
      data: {
        orderId,
        userId: order.userId,
        totalAmount: order.totalAmount,
        items,
      },
    });
  }

  async getReceipt(receiptId: string) {
    const receipt = await this.prisma.receipt.findUnique({ where: { id: receiptId } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  async getOrderReceipt(orderId: string) {
    return this.prisma.receipt.findUnique({ where: { orderId } });
  }

  async getUserReceipts(userId: string) {
    return this.prisma.receipt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
