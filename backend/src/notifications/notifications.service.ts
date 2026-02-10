import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class NotificationsService {
  private prisma: any = new (PrismaClient as any)();

  async sendNotification(
    userId: string,
    type: any,
    title: string,
    message: string,
    data?: any,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
      },
    });
  }

  async getNotifications(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly && { read: false }) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async deleteNotification(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
