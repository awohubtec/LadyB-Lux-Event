import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class InventoryService {
  private prisma: any = new (PrismaClient as any)();

  async addMaterial(vendorId: string, data: any) {
    return this.prisma.material.create({
      data: {
        vendorId,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        price: data.price,
        category: data.category,
      },
    });
  }

  async getVendorMaterials(vendorId: string) {
    return this.prisma.material.findMany({ where: { vendorId } });
  }

  async updateMaterial(id: string, data: any) {
    return this.prisma.material.update({ where: { id }, data });
  }

  async deleteMaterial(id: string) {
    return this.prisma.material.delete({ where: { id } });
  }
}
