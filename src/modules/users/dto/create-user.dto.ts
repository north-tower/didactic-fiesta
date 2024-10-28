// src/modules/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/common/enums/app.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.EMPLOYEE;
}
