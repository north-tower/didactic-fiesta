// src/modules/auth/services/token-blacklist.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(private readonly jwtService: JwtService) {}

  addToBlacklist(token: string): void {
    this.blacklistedTokens.add(this.normalizeToken(token));
  }

  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(this.normalizeToken(token));
  }

  private normalizeToken(token: string): string {
    // Remove 'Bearer ' if present
    return token.replace('Bearer ', '');
  }

  removeExpiredTokens(): void {
    for (const token of this.blacklistedTokens) {
      try {
        const decoded = this.jwtService.decode(token);
        if (decoded && typeof decoded === 'object' && decoded.exp) {
          if (Date.now() >= decoded.exp * 1000) {
            this.blacklistedTokens.delete(token);
          }
        }
      } catch (error) {
        // If token is invalid, remove it
        this.blacklistedTokens.delete(token);
      }
    }
  }
}
