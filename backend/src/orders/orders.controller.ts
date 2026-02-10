import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PrismaClient } from '../../generated/prisma/client';

@Controller('orders')
export class OrdersController {
  private prisma: any = new (PrismaClient as any)();

  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  // C9: Get vendor's orders - filtered by vendor's products (must be before :id route)
  @Get('vendor/orders')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('VENDOR')
  async getVendorOrders(@Req() req: any) {
    // Get vendor ID from vendor relationship (vendor.userId = user.id)
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.ordersService.getVendorOrders(vendor.id);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOrder(@Param('id') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getUserOrders(@Req() req: any) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard)
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Query('status') status: string,
    @Req() req: any,
  ) {
    return this.ordersService.updateOrderStatus(
      orderId,
      status,
      req.user.id,
      req.user.role,
    );
  }

  // C8: Mark order as IN_PROGRESS (vendor endpoint)
  @Patch(':id/in-progress')
  @UseGuards(JwtGuard)
  async markInProgress(
    @Param('id') orderId: string,
    @Req() req: any,
  ) {
    return this.ordersService.updateOrderStatus(
      orderId,
      'IN_PROGRESS',
      req.user.id,
      req.user.role,
    );
  }
}

