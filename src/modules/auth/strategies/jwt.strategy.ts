// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Check if token is blacklisted
    if (this.tokenBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Verify token type is ACCESS
    if (payload.type !== 'ACCESS') {
      throw new UnauthorizedException('Invalid token type');
    }

    return user;
  }
}
