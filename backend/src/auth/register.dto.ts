// register.dto.ts
import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class RegisterDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
  @IsEnum(Role) role: Role;
}
