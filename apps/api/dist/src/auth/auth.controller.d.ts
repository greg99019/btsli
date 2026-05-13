import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(body: {
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
    login(body: {
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
    me(req: any): {
        user: any;
    };
}
