import { Controller, Get, Param, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../generated/prisma/enums';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.usersService.updateRole(id, body.role as unknown as string);
  }
}
