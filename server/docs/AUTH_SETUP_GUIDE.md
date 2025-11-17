# Simple JWT Authentication - Setup Complete! ✅

## What Was Installed

```bash
@nestjs/jwt          # JWT token generation and verification
@nestjs/passport     # NestJS integration with Passport
passport             # Authentication middleware
passport-jwt         # JWT strategy for Passport
bcrypt               # Password hashing
```

---

## Project Structure

```
src/modules/auth/
├── dto/
│   └── login.dto.ts              # Login request validation
├── guards/
│   └── jwt-auth.guard.ts         # Protect routes with JWT
├── strategies/
│   └── jwt.strategy.ts           # JWT validation logic
├── decorators/
│   └── current-user.decorator.ts # Get current user in controllers
├── auth.controller.ts            # Login & profile endpoints
├── auth.service.ts               # Authentication logic
└── auth.module.ts                # Module configuration
```

---

## How It Works

### 1. **Login Flow**
```typescript
POST /api/auth/login
Body: { username: "admin@ramboll.com", password: "password123" }

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin@ramboll.com",
    "role": "incept-admin",
    "unit": {
      "id": 1,
      "name": "Copenhagen Office",
      "universe": {
        "id": 1,
        "name": "Ramboll Denmark"
      }
    }
  }
}
```

### 2. **Protected Routes**
```typescript
// In any controller:
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)  // ← Protect this route
@Get('protected')
protectedRoute(@CurrentUser() user: User) {  // ← Get current user
  return {
    message: 'This is protected!',
    userId: user.id,
    username: user.username,
    role: user.role
  };
}
```

### 3. **Frontend Usage**
```typescript
// 1. Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { access_token, user } = await response.json();

// 2. Store token
localStorage.setItem('token', access_token);

// 3. Use token for protected requests
const data = await fetch('http://localhost:3000/api/e-learnings', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## Testing with Postman

### Step 1: Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin@ramboll.com",
  "password": "password123"
}
```

**Copy the `access_token` from response**

### Step 2: Use Token
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Or set `{{jwt_token}}` variable in Postman environment.

---

## Available Endpoints

| Endpoint | Method | Protected | Description |
|----------|--------|-----------|-------------|
| `/api/auth/login` | POST | ❌ | Login with username/password |
| `/api/auth/me` | GET | ✅ | Get current user profile |
| `/api/e-learnings` | GET | ⚪ Optional | List e-learnings (can be protected) |
| `/api/e-learnings/:id` | GET | ⚪ Optional | Get e-learning details |
| `/api/e-learnings` | POST | ✅ Should protect | Create e-learning |

---

## Next Steps

### Protect E-Learning Creation
```typescript
// src/modules/e-learnings/e-learnings.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/e-learnings')
export class ELearningsController {
  
  @UseGuards(JwtAuthGuard)  // ← Add this
  @Post()
  create(
    @Body() dto: CreateELearningDto,
    @CurrentUser() user: User  // ← Add this to know who created it
  ) {
    console.log(`E-learning created by: ${user.username}`);
    return this.eLearningsService.create(dto);
  }
}
```

### Filter E-Learnings by User's Universe
```typescript
// Instead of mock universeId query param, use JWT:
@UseGuards(JwtAuthGuard)
@Get()
findAll(@CurrentUser() user: User) {
  // User's universe ID is in: user.unit.universe.id
  const universeId = user.unit.universe.id;
  return this.eLearningsService.findAllByUniverseId(universeId);
}
```

---

## Security Notes

### ✅ What's Secure:
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with secret key
- Tokens expire after 7 days
- Tokens validated on every protected request

### ⚠️ For Production:
1. Change `JWT_SECRET` in `.env` to a long random string (32+ chars)
2. Use HTTPS in production
3. Consider shorter token expiry (1-2 days)
4. Add refresh token mechanism for longer sessions
5. Add rate limiting to login endpoint

---

## Troubleshooting

### "Unauthorized" error:
- Check token is in `Authorization: Bearer <token>` header
- Check token hasn't expired (7 days)
- Check JWT_SECRET matches in .env

### "Invalid credentials":
- Check password is correct
- Check user exists in database
- Check password was hashed when user was created

### Can't access user.unit.universe:
- Check populate option in JwtStrategy: `{ populate: ['unit.universe'] }`
- Check User entity has @ManyToOne relationship to Unit

---

## Database Users for Testing

Run the seeder to create test users:
```bash
npm run seed
```

**Test Credentials:**
```
Username: admin@ramboll.com
Password: password123
Role: incept-admin

Username: user@ramboll.com  
Password: password123
Role: user
```

---

## What's Different from Better Auth?

| Feature | Simple JWT | Better Auth |
|---------|------------|-------------|
| Setup time | ✅ 30 min | ⏰ 2-3 hours |
| Code files | ✅ ~7 files | ❌ 15+ files |
| DB tables | ✅ 0 new tables | ❌ 4+ new tables |
| Features | ✅ Login only | ⚪ Login + OAuth + 2FA + ... |
| Learning curve | ✅ Easy | ⚠️ Moderate |
| Overkill? | ✅ No | ⚠️ Yes (for your project) |

---

## Summary

You now have:
- ✅ Login endpoint (`/api/auth/login`)
- ✅ JWT token generation
- ✅ Protected routes with `@UseGuards(JwtAuthGuard)`
- ✅ Current user access with `@CurrentUser()`
- ✅ Password hashing with bcrypt
- ✅ Token expiry (7 days)
- ✅ Postman collection updated

**Total code:** ~200 lines
**Total time:** ~30 minutes
**Complexity:** Low

Perfect for your bachelor project focus on e-learning features! 🎓
