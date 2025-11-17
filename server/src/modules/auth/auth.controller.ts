import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthUser } from 'src/common/interfaces/auth.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * POST /api/auth/login
   * Body: { username: string, password: string }
   * Returns: { access_token: string, user: {...} }
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user profile (protected route example)
   * GET /api/auth/me
   * Headers: Authorization: Bearer <token>
   * Returns: User object
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    //console.log(user);
    
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      unit: user.unit,
      universe: user.universe,
    };
  }
}
