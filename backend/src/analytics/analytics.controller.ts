import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(Role.VENDOR, Role.ADMIN)
  async getDashboard(@Req() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const vendorId = req.user.role === 'VENDOR' ? req.user.vendorId : undefined;
    return this.analyticsService.getDashboardMetrics(
      vendorId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('top-vendors')
  @Roles(Role.ADMIN)
  async getTopVendors(@Query('limit') limit?: string) {
    return this.analyticsService.getTopVendors(limit ? parseInt(limit) : 10);
  }

  @Get('order-trends')
  @Roles(Role.ADMIN)
  async getOrderTrends(@Query('days') days?: string) {
    return this.analyticsService.getOrderTrends(days ? parseInt(days) : 30);
  }

  @Get('product-popularity')
  @Roles(Role.ADMIN)
  async getProductPopularity(@Query('limit') limit?: string) {
    return this.analyticsService.getProductPopularity(limit ? parseInt(limit) : 10);
  }

  @Get('category-metrics')
  @Roles(Role.ADMIN)
  async getCategoryMetrics() {
    return this.analyticsService.getCategoryMetrics();
  }
}
