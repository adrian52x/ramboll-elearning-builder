import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthUser, JwtPayload } from 'src/common/interfaces/auth.interface';


@Injectable()
export class AuthService {
    constructor(
        private readonly em: EntityManager,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Validate user credentials and return JWT token
     */
    async login(loginDto: LoginDto) {
        // Find user by username
        const user = await this.em.findOne(User, { username: loginDto.username }, { populate: ['unit.universe'] });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Create JWT payload
        const payload: JwtPayload = {
            userId: user.id,
            username: user.username,
            role: user.role,
            unitId: user.unit.id,
        };

        // Generate token
        const token = this.jwtService.sign(payload);

        // Return token and user info (without password)
        return {
            access_token: token,
            // user: {
            //     id: user.id,
            //     username: user.username,
            //     role: user.role,
            //     unit: {
            //     id: user.unit.id,
            //     name: user.unit.name,
            //     universe: {
            //         id: user.unit.universe.id,
            //         name: user.unit.universe.name,
            //     },
            //     },
            // },
        };
    }

    /**
     * Validate JWT payload and return user
     * Called by JWT strategy during authentication
     */
    async validateUser(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.em.findOne(User, { id: payload.userId }, { populate: ['unit.universe'] });
        
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Return clean data instead of full entity
        return {
            id: user.id,
            username: user.username,
            role: user.role,
            unit: {
                id: user.unit.id,
                name: user.unit.name,
            },
            universe: {
                id: user.unit.universe.id,
                name: user.unit.universe.name,
            },
        };
    }

    /**
     * Hash password for user creation/update
     */
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
