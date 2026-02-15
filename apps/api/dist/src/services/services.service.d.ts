import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        slug: string;
        name: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        description: string;
        priceMin: number;
        priceMax: number;
        durationMin: number;
        unitLabel: string;
        focusAreas: string[];
        active: boolean;
    }[]>;
    getBySlug(slug: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        slug: string;
        name: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        description: string;
        priceMin: number;
        priceMax: number;
        durationMin: number;
        unitLabel: string;
        focusAreas: string[];
        active: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
