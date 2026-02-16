import { PrismaService } from '../prisma/prisma.service';
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    seedData(): Promise<{
        success: boolean;
        message: string;
        stats: {
            courses: number;
            modules: number;
            lessons: number;
            enrollments: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        stats?: undefined;
    }>;
}
