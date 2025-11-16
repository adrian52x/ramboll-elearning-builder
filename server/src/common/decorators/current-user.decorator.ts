import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Mock current user decorator
 * TODO: Replace with real JWT authentication
 * 
 * For now, returns a mock user with universeId from query param or default
 * Later this will extract user info from JWT token
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Mock user - replace this with real JWT payload extraction
    return {
      id: 1,
      username: 'mock.user@ramboll.com',
      role: 'user',
      unitId: 1,
      universeId: 1, // This will come from the user's unit->universe relation
    };
  },
);

/**
 * Type for the current user data
 */
export interface CurrentUserData {
  id: number;
  username: string;
  role: string;
  unitId: number;
  universeId: number;
}
