"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingService = class BookingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listCoachesByService(serviceId) {
        if (!serviceId)
            throw new common_1.BadRequestException('serviceId required');
        const links = await this.prisma.coachService.findMany({
            where: { serviceId },
            include: { coach: { include: { user: true } } },
        });
        return links.map((l) => ({
            id: l.coach.id,
            name: l.coach.user.name,
            timezone: l.coach.timezone,
        }));
    }
    async getAvailableSlots(coachId, fromIso, toIso) {
        const from = new Date(fromIso);
        const to = new Date(toIso);
        if (!(from < to))
            throw new common_1.BadRequestException('Invalid from/to');
        const slots = await this.prisma.availabilitySlot.findMany({
            where: { coachId, startAt: { gte: from }, endAt: { lte: to } },
            orderBy: { startAt: 'asc' },
        });
        const booked = await this.prisma.appointment.findMany({
            where: {
                coachId,
                status: 'BOOKED',
                startAt: { gte: from },
                endAt: { lte: to },
            },
            select: { startAt: true, endAt: true },
        });
        const bookedKey = new Set(booked.map((b) => `${b.startAt.toISOString()}|${b.endAt.toISOString()}`));
        return slots
            .filter((s) => !bookedKey.has(`${s.startAt.toISOString()}|${s.endAt.toISOString()}`))
            .map((s) => ({ id: s.id, startAt: s.startAt.toISOString(), endAt: s.endAt.toISOString() }));
    }
    async listMySlots(userId) {
        const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
        if (!coach)
            throw new common_1.BadRequestException('Coach profile not found');
        const slots = await this.prisma.availabilitySlot.findMany({
            where: { coachId: coach.id },
            orderBy: { startAt: 'asc' },
        });
        return slots.map((s) => ({ id: s.id, startAt: s.startAt.toISOString(), endAt: s.endAt.toISOString() }));
    }
    async createCoachSlot(userId, input) {
        const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
        if (!coach)
            throw new common_1.BadRequestException('Coach profile not found');
        const startAt = new Date(input.startAt);
        const endAt = new Date(input.endAt);
        if (!(startAt < endAt))
            throw new common_1.BadRequestException('Invalid time range');
        const overlap = await this.prisma.availabilitySlot.findFirst({
            where: {
                coachId: coach.id,
                startAt: { lt: endAt },
                endAt: { gt: startAt },
            },
        });
        if (overlap)
            throw new common_1.BadRequestException('Overlapping availability slot exists');
        return this.prisma.availabilitySlot.create({
            data: { coachId: coach.id, startAt, endAt },
        });
    }
    async deleteCoachSlot(userId, slotId) {
        const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
        if (!coach)
            throw new common_1.BadRequestException('Coach profile not found');
        const slot = await this.prisma.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot)
            throw new common_1.BadRequestException('Slot not found');
        if (slot.coachId !== coach.id)
            throw new common_1.ForbiddenException();
        const booked = await this.prisma.appointment.findFirst({
            where: { coachId: coach.id, status: 'BOOKED', startAt: slot.startAt, endAt: slot.endAt },
        });
        if (booked)
            throw new common_1.BadRequestException('Slot is booked; cannot delete');
        return this.prisma.availabilitySlot.delete({ where: { id: slotId } });
    }
    async book(clientId, input) {
        const startAt = new Date(input.startAt);
        const endAt = new Date(input.endAt);
        if (!(startAt < endAt))
            throw new common_1.BadRequestException('Invalid time range');
        const coach = await this.prisma.coachProfile.findUnique({ where: { id: input.coachId } });
        if (!coach)
            throw new common_1.BadRequestException('Coach not found');
        const slot = await this.prisma.availabilitySlot.findFirst({
            where: { coachId: input.coachId, startAt, endAt },
        });
        if (!slot)
            throw new common_1.BadRequestException('Selected slot not found');
        const collision = await this.prisma.appointment.findFirst({
            where: { coachId: input.coachId, status: 'BOOKED', startAt, endAt },
        });
        if (collision)
            throw new common_1.BadRequestException('Time slot already booked');
        return this.prisma.appointment.create({
            data: {
                clientId,
                coachId: input.coachId,
                serviceId: input.serviceId,
                startAt,
                endAt,
            },
        });
    }
    myAppointments(userId) {
        return this.prisma.appointment.findMany({
            where: { clientId: userId },
            include: { service: true, coach: { include: { user: true } } },
            orderBy: { startAt: 'desc' },
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingService);
//# sourceMappingURL=booking.service.js.map