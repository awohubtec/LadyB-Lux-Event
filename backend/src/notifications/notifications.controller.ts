import { Controller, Get, Patch, Delete, Param, UseGuards, Req, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req: any, @Query('unread') unread?: string) {
    return this.notificationsService.getNotifications(
      req.user.id,
      unread === 'true',
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('all/read')
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
