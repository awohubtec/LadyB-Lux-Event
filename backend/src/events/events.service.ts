import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { CreateEventDto } from './create-event.dto';

@Injectable()
export class EventsService {
  private prisma: any = new (PrismaClient as any)();

  async createEvent(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        userId,
        title: dto.title,
        eventDate: dto.eventDate,
        location: dto.location,
      },
    });
  }

  async getEvents(userId: string) {
    return this.prisma.event.findMany({
      where: { userId },
    });
  }

  async getEvent(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { orders: true },
    });
  }
}
