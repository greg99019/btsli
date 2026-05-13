import { PrismaService } from '../prisma/prisma.service';
export declare class BookingService {
    private prisma;
    constructor(prisma: PrismaService);
    listCoachesByService(serviceId: string): Promise<{
        id: string;
        name: string;
        timezone: string;
    }[]>;
    getAvailableSlots(coachId: string, fromIso: string, toIso: string): Promise<{
        id: string;
        startAt: string;
        endAt: string;
    }[]>;
    listMySlots(userId: string): Promise<{
        id: string;
        startAt: string;
        endAt: string;
    }[]>;
    createCoachSlot(userId: string, input: {
        startAt: string;
        endAt: string;
    }): Promise<{
        id: string;
        coachId: string;
        startAt: Date;
        endAt: Date;
    }>;
    deleteCoachSlot(userId: string, slotId: string): Promise<{
        id: string;
        coachId: string;
        startAt: Date;
        endAt: Date;
    }>;
    book(clientId: string, input: {
        coachId: string;
        serviceId: string;
        startAt: string;
        endAt: string;
    }): Promise<{
        id: string;
        status: string;
        coachId: string;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        clientId: string;
        notes: string | null;
    }>;
    myAppointments(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        service: {
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
        };
        coach: {
            user: {
                id: string;
                createdAt: Date;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                email: string;
                passwordHash: string;
            };
        } & {
            id: string;
            userId: string;
            bio: string | null;
            timezone: string;
        };
    } & {
        id: string;
        status: string;
        coachId: string;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        clientId: string;
        notes: string | null;
    })[]>;
}
