import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import * as crypto from 'crypto';

export class ConfirmPaymentDto {
  reference: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // E1: Initiate Paystack payment
  @Post('initiate')
  @UseGuards(JwtGuard)
  async initiatePayment(@Body() body: { orderId: string }) {
    return this.paymentsService.initiatePaystackPayment(body.orderId);
  }

  // E1: Verify payment from frontend
  @Post('verify')
  async verifyPayment(@Body() body: { reference: string }) {
    return this.paymentsService.verifyPaystackPayment(body.reference);
  }

  // E1: Webhook from Paystack
  @Post('webhook/paystack')
  async handlePaystackWebhook(
    @Body() payload: any,
    @Req() req: RawBodyRequest<any>,
  ) {
    // Verify webhook signature - CRITICAL for security
    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) {
      throw new BadRequestException('PAYSTACK_SECRET not configured');
    }

    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');

    const signature = Array.isArray(req.headers['x-paystack-signature'])
      ? req.headers['x-paystack-signature'][0]
      : req.headers['x-paystack-signature'];

    if (!signature || hash !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process the webhook
    return this.paymentsService.handlePaystackWebhook(payload);
  }

  // Legacy endpoints
  @Post(':orderId/initiate')
  @UseGuards(JwtGuard)
  async initiatePaymentLegacy(
    @Param('orderId') orderId: string,
    @Body() body: { provider?: string },
  ) {
    return this.paymentsService.createPayment(orderId, body.provider || 'paystack');
  }

  @Post(':orderId/confirm')
  async confirmPayment(
    @Param('orderId') orderId: string,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(orderId, dto.reference);
  }

  @Post(':orderId/fail')
  async failPayment(
    @Param('orderId') orderId: string,
    @Body() body?: { reference?: string },
  ) {
    return this.paymentsService.failPayment(orderId, body?.reference);
  }

  @Get(':orderId')
  @UseGuards(JwtGuard)
  async getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPayment(orderId);
  }
}
