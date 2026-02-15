import { BookingService } from './booking.service';
export declare class BookingController {
    private booking;
    constructor(booking: BookingService);
    coachesByService(serviceId: string): Promise<{
        id: string;
        name: string;
        timezone: string;
    }[]>;
    availability(coachId: string, from: string, to: string): Promise<{
        id: string;
        startAt: string;
        endAt: string;
    }[]>;
    mySlots(req: any): Promise<{
        id: string;
        startAt: string;
        endAt: string;
    }[]>;
    createSlot(req: any, body: {
        startAt: string;
        endAt: string;
    }): Promise<{
        id: string;
        coachId: string;
        startAt: Date;
        endAt: Date;
    }>;
    deleteSlot(req: any, slotId: string): Promise<{
        id: string;
        coachId: string;
        startAt: Date;
        endAt: Date;
    }>;
    create(req: any, body: {
        coachId: string;
        serviceId: string;
        startAt: string;
        endAt: string;
    }): Promise<{
        id: string;
        coachId: string;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        clientId: string;
        status: string;
        notes: string | null;
    }>;
    mine(req: any): Promise<({
        service: {
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
        };
        coach: {
            user: {
                id: string;
                name: string;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            };
        } & {
            id: string;
            userId: string;
            bio: string | null;
            timezone: string;
        };
    } & {
        id: string;
        coachId: string;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        clientId: string;
        status: string;
        notes: string | null;
    })[]>;
}
