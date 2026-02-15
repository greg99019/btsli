import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async listCoachesByService(serviceId: string) {
    if (!serviceId) throw new BadRequestException('serviceId required');

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

  async getAvailableSlots(coachId: string, fromIso: string, toIso: string) {
    const from = new Date(fromIso);
    const to = new Date(toIso);
    if (!(from < to)) throw new BadRequestException('Invalid from/to');

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

  async listMySlots(userId: string) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new BadRequestException('Coach profile not found');

    const slots = await this.prisma.availabilitySlot.findMany({
      where: { coachId: coach.id },
      orderBy: { startAt: 'asc' },
    });

    return slots.map((s) => ({ id: s.id, startAt: s.startAt.toISOString(), endAt: s.endAt.toISOString() }));
  }

  async createCoachSlot(userId: string, input: { startAt: string; endAt: string }) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new BadRequestException('Coach profile not found');

    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);
    if (!(startAt < endAt)) throw new BadRequestException('Invalid time range');

    const overlap = await this.prisma.availabilitySlot.findFirst({
      where: {
        coachId: coach.id,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });
    if (overlap) throw new BadRequestException('Overlapping availability slot exists');

    return this.prisma.availabilitySlot.create({
      data: { coachId: coach.id, startAt, endAt },
    });
  }

  async deleteCoachSlot(userId: string, slotId: string) {
    const coach = await this.prisma.coachProfile.findUnique({ where: { userId } });
    if (!coach) throw new BadRequestException('Coach profile not found');

    const slot = await this.prisma.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new BadRequestException('Slot not found');
    if (slot.coachId !== coach.id) throw new ForbiddenException();

    const booked = await this.prisma.appointment.findFirst({
      where: { coachId: coach.id, status: 'BOOKED', startAt: slot.startAt, endAt: slot.endAt },
    });
    if (booked) throw new BadRequestException('Slot is booked; cannot delete');

    return this.prisma.availabilitySlot.delete({ where: { id: slotId } });
  }

  async book(clientId: string, input: { coachId: string; serviceId: string; startAt: string; endAt: string }) {
    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);
    if (!(startAt < endAt)) throw new BadRequestException('Invalid time range');

    const coach = await this.prisma.coachProfile.findUnique({ where: { id: input.coachId } });
    if (!coach) throw new BadRequestException('Coach not found');

    const slot = await this.prisma.availabilitySlot.findFirst({
      where: { coachId: input.coachId, startAt, endAt },
    });
    if (!slot) throw new BadRequestException('Selected slot not found');

    const collision = await this.prisma.appointment.findFirst({
      where: { coachId: input.coachId, status: 'BOOKED', startAt, endAt },
    });
    if (collision) throw new BadRequestException('Time slot already booked');

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

  myAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { clientId: userId },
      include: { service: true, coach: { include: { user: true } } },
      orderBy: { startAt: 'desc' },
    });
  }
}
