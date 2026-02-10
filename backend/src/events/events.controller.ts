import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './create-event.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.createEvent(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getEvents(@Req() req: any) {
    return this.eventsService.getEvents(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getEvent(@Param('id') id: string) {
    return this.eventsService.getEvent(id);
  }
}
