// src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsUUID,
} from 'class-validator';
import { UserRole } from 'src/common/enums/app.enum';

export class RegisterDto {
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
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.EMPLOYEE)
  @IsUUID()
  @IsString()
  companyId: string;

  @ValidateIf((o) => o.role === UserRole.EMPLOYEE)
  @IsString()
  employeeId?: string;
}

export class RegisterResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: {
    id: string;
    name: string;
  };
  message: string;
}
