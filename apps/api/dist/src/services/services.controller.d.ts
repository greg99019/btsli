import { ServicesService } from './services.service';
export declare class ServicesController {
    private services;
    constructor(services: ServicesService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        slug: string;
        category: import(".prisma/client").$Enums.ServiceCategory;
        description: string;
        priceMin: number;
        priceMax: number;
        durationMin: number;
        unitLabel: string;
        focusAreas: string[];
        active: boolean;
    }[]>;
    get(slug: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        slug: string;
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
