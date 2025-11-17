import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from 'src/common/interfaces/auth.interface';


/**
 * Decorator to get current authenticated user from request
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthUser) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
