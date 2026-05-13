import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { IntakeService } from './intake.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('intake')
export class IntakeController {
  constructor(private intake: IntakeService) {}

  /** Public: submit initial consultation form */
  @Post('lead')
  submitLead(@Body() body: any) {
    return this.intake.submitLead(body);
  }

  /** Public: submit systems assessment (linked to lead via leadId) */
  @Post('assessment/:leadId')
  submitAssessment(@Param('leadId') leadId: string, @Body() body: any) {
    return this.intake.submitAssessment(leadId, body);
  }

  /** Admin: list all leads with summary */
  @Get('leads')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH', 'SUPER_ADMIN')
  listLeads() {
    return this.intake.listLeads();
  }

  /** Admin: get single lead with full assessment and briefing */
  @Get('lead/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH', 'SUPER_ADMIN')
  getLead(@Param('id') id: string) {
    return this.intake.getLead(id);
  }
}
