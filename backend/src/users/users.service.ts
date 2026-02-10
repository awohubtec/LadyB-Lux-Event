import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  private prisma: any = new (PrismaClient as any)();

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateRole(id: string, role: string) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }
}
