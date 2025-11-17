import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard to protect routes with JWT authentication
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * protectedRoute(@CurrentUser() user: User) { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
