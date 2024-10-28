// src/modules/auth/dto/auth-response.dto.ts
export class AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: AuthTokensDto;
  msg?: string;
}
