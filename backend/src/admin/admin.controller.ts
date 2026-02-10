import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async stats() {
    return this.adminService.stats();
  }

  @Get('orders')
  async recentOrders(@Query('limit') limit?: string) {
    return this.adminService.recentOrders(limit ? parseInt(limit, 10) : 10);
  }
}
