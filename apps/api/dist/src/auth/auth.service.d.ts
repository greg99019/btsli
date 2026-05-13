import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(input: {
        name: string;
        email: string;
        password: string;
        role?: Role;
    }): Promise<{
        user: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            email: string;
        };
        token: string;
    }>;
    login(input: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        token: string;
    }>;
    sign(user: {
        id: string;
        email: string;
        role: Role;
    }): string;
}
