import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@Controller('booking')
export class BookingController {
  constructor(private booking: BookingService) {}

  @Get('coaches')
  async coachesByService(@Query('serviceId') serviceId: string) {
    return this.booking.listCoachesByService(serviceId);
  }

  @Get('coaches/:coachId/availability')
  async availability(
    @Param('coachId') coachId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.booking.getAvailableSlots(coachId, from, to);
  }

  @Get('coach/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH)
  async mySlots(@Req() req: any) {
    return this.booking.listMySlots(req.user.id);
  }

  @Post('coach/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH)
  async createSlot(@Req() req: any, @Body() body: { startAt: string; endAt: string }) {
    return this.booking.createCoachSlot(req.user.id, body);
  }

  @Delete('coach/slots/:slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COACH)
  async deleteSlot(@Req() req: any, @Param('slotId') slotId: string) {
    return this.booking.deleteCoachSlot(req.user.id, slotId);
  }

  @Post('appointments')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() body: { coachId: string; serviceId: string; startAt: string; endAt: string }) {
    return this.booking.book(req.user.id, body);
  }

  @Get('me/appointments')
  @UseGuards(JwtAuthGuard)
  async mine(@Req() req: any) {
    return this.booking.myAppointments(req.user.id);
  }
}
