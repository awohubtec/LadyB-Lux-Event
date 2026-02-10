// auth.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '../../generated/prisma/client';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  private prisma: any = new (PrismaClient as any)();

  constructor(private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role: dto.role,
      },
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  private signToken(user: any) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
      user,
    };
  }
}
