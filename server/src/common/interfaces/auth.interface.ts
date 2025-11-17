export interface JwtPayload {
    userId: number;  
    username: string;
    role: string;
    unitId: number;
}

// User data without sensitive info
export interface AuthUser {
    id: number;
    username: string;
    role: string;
    unit: {
        id: number;
        name: string;
    };
    universe: {
        id: number;
        name: string;
    };
}