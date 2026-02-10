import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PaymentStatus } from '../../generated/prisma/enums';
import { OrdersService } from '../orders/orders.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private prisma: any = new (PrismaClient as any)();
  private paystackBaseUrl = 'https://api.paystack.co';
  private paystackSecret = process.env.PAYSTACK_SECRET;

  constructor(private ordersService: OrdersService) {}

  async createPayment(orderId: string, provider: string = 'paystack') {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.payment.create({
      data: {
        orderId,
        provider,
        status: PaymentStatus.INITIATED,
      },
    });
  }

  // E1: Initialize Paystack payment
  async initiatePaystackPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Create or update payment record
    await this.createPayment(orderId, 'paystack');

    // Initialize Paystack transaction
    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email: order.user.email,
          amount: Math.round(order.totalAmount * 100), // Convert to kobo
          callback_url: `${process.env.FRONTEND_URL}/checkout/success`,
          metadata: {
            orderId: orderId,
            userId: order.userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to initialize payment'
      );
    }
  }

  async confirmPayment(orderId: string, reference: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status to SUCCESS
    const updatedPayment = await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.SUCCESS,
        reference,
      },
    });

    // Confirm the order (lock availability)
    await this.ordersService.confirmOrder(orderId);

    return updatedPayment;
  }

  // E1: Webhook handler for Paystack
  async handlePaystackWebhook(payload: any) {
    const event = payload.event;

    if (event === 'charge.success') {
      const { metadata, reference } = payload.data;
      const { orderId } = metadata;

      // Confirm payment
      await this.confirmPayment(orderId, reference);

      return {
        success: true,
        message: 'Payment confirmed and order locked',
      };
    }

    return { success: false, message: 'Event not handled' };
  }

  // Verify payment from frontend
  async verifyPaystackPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecret}`,
          },
        }
      );

      if (response.data.data.status === 'success') {
        const { orderId } = response.data.data.metadata;
        await this.confirmPayment(orderId, reference);
        return { success: true, data: response.data.data };
      }

      return { success: false, message: 'Payment verification failed' };
    } catch (error: any) {
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async failPayment(orderId: string, reference?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.FAILED,
        reference,
      },
    });
  }

  async getPayment(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }
}

