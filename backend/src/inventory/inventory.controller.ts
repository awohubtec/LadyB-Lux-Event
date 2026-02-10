import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('inventory')
@UseGuards(JwtGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.VENDOR)
  async addMaterial(@Req() req: any, @Body() body: any) {
    return this.inventoryService.addMaterial(req.user.vendorId, body);
  }

  @Get(':vendorId')
  async getVendorMaterials(@Param('vendorId') vendorId: string) {
    return this.inventoryService.getVendorMaterials(vendorId);
  }

  @Patch(':id')
  @Roles(Role.VENDOR)
  async updateMaterial(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.updateMaterial(id, body);
  }

  @Delete(':id')
  @Roles(Role.VENDOR)
  async deleteMaterial(@Param('id') id: string) {
    return this.inventoryService.deleteMaterial(id);
  }
}
