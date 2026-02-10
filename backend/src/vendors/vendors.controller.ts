import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createVendor(@Req() req: any, @Body() body: any) {
    return this.vendorsService.createVendor(req.user.id, body);
  }

  @Get()
  async listVendors() {
    return this.vendorsService.list();
  }

  @Get(':id')
  async getVendor(@Param('id') id: string) {
    return this.vendorsService.findById(id);
  }

  @Post(':id/verify')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async verify(@Param('id') id: string) {
    return this.vendorsService.verifyVendor(id);
  }
}
