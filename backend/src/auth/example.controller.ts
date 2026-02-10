import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from './guards/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Role } from '../../generated/prisma/enums';

@Controller('example')
export class ExampleController {
  @Post('admin-only')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminEndpoint() {
    return { ok: true, message: 'Admin access granted' };
  }
}
