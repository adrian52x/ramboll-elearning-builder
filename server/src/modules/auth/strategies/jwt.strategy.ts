import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import * as dotenv from 'dotenv';
import { AuthUser, JwtPayload } from 'src/common/interfaces/auth.interface';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  /**
   * Called automatically by Passport when JWT is valid
   * The return value is attached to request.user
   */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    return this.authService.validateUser(payload);
  }
}
