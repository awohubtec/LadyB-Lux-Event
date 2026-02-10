import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { ProductType, OrderStatus } from '../../generated/prisma/enums';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  private prisma: any = new (PrismaClient as any)();

  constructor(private productsService: ProductsService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let total = 0;

    // Validate all items and calculate total
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      // C7: FOOD ORDER LOGIC - Only requires deliveryDate, no date range
      if (product.type === ProductType.FOOD) {
        if (!item.deliveryDate) {
          throw new BadRequestException(
            `${product.name} requires deliveryDate`,
          );
        }

        // Optional daily capacity check for food items
        if (product.dailyCapacity) {
          const deliveryDate = new Date(item.deliveryDate);
          const startOfDay = new Date(deliveryDate.setHours(0, 0, 0, 0));
          const endOfDay = new Date(deliveryDate.setHours(23, 59, 59, 999));

          // Count existing orders for this food item on the same day
          const existingOrders = await this.prisma.orderItem.aggregate({
            where: {
              productId: item.productId,
              deliveryDate: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            _sum: {
              quantity: true,
            },
          });

          const currentQuantity = existingOrders._sum.quantity || 0;
          if (currentQuantity + item.quantity > product.dailyCapacity) {
            throw new BadRequestException(
              `${product.name} exceeds daily capacity of ${product.dailyCapacity} on ${item.deliveryDate}`,
            );
          }
        }
      } else {
        // For rentals & services, check availability with date range
        if (!item.startDate || !item.endDate) {
          throw new BadRequestException(
            `${product.name} requires startDate and endDate`,
          );
        }

        const available = await this.productsService.checkAvailability(
          product.id,
          item.startDate,
          item.endDate,
          item.quantity,
        );

        if (!available) {
          throw new BadRequestException(
            `${product.name} not available for the requested dates`,
          );
        }
      }

      total += product.price * item.quantity;
    }

    // Create the order with items (provisional, not confirmed yet)
    return this.prisma.order.create({
      data: {
        userId,
        eventId: dto.eventId,
        totalAmount: total,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
          })),
        },
      },
      include: {
        items: true,
        user: true,
        event: true,
      },
    });
  }

  async confirmOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Lock in availability for rentals/services
    for (const item of order.items) {
      if (item.startDate && item.endDate) {
        await this.prisma.availability.create({
          data: {
            productId: item.productId,
            startDate: item.startDate,
            endDate: item.endDate,
            quantity: item.quantity,
          },
        });
      }
    }

    // Update order status to PAID
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
      include: { items: true, payment: true },
    });
  }

  async getOrder(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        event: true,
        payment: true,
      },
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        event: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // C8: ORDER STATUS LIFECYCLE with role-based authorization
  async updateOrderStatus(
    orderId: string,
    status: string,
    userId: string,
    userRole: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, event: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    const validTransition = this.isValidStatusTransition(
      order.status,
      status,
    );
    if (!validTransition) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    // Check authorization based on role and target status
    if (status === OrderStatus.CANCELLED) {
      // C8: Only admin can cancel after payment
      if (order.status !== OrderStatus.PENDING && userRole !== 'ADMIN') {
        throw new ForbiddenException(
          'Only admins can cancel paid orders',
        );
      }
      if (userRole !== 'ADMIN') {
        throw new ForbiddenException(
          'Only admins can cancel orders',
        );
      }
    } else if (status === OrderStatus.IN_PROGRESS) {
      // C8: Vendor can mark IN_PROGRESS
      const vendorIds = order.items.map((item) => item.product.vendorId);
      const isVendor = userRole === 'VENDOR' && vendorIds.includes(userId);
      if (!isVendor && userRole !== 'ADMIN') {
        throw new ForbiddenException(
          'Only vendors for this order can mark it as IN_PROGRESS',
        );
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } }, payment: true },
    });
  }

  private isValidStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): boolean {
    const validTransitions: { [key: string]: string[] } = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [
        OrderStatus.IN_PROGRESS,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // C8: System marks COMPLETED after event date (call this from a cron job or scheduler)
  async markCompletedAfterEventDate() {
    const now = new Date();
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.IN_PROGRESS,
        event: {
          eventDate: { lte: now },
        },
      },
      include: { event: true },
    });

    for (const order of orders) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.COMPLETED },
      });
    }

    return orders;
  }

  // C9: VENDOR VIEW - Get orders for a specific vendor's products
  async getVendorOrders(vendorId: string) {
    return this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId: vendorId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: true,
              },
            },
          },
        },
        user: true,
        event: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
