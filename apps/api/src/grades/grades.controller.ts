import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GradesService } from './grades.service';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private grades: GradesService) {}

  @Get('courses/:courseId/me')
  me(@Req() req: any, @Param('courseId') courseId: string) {
    return this.grades.getMyCourseGrade(req.user.id, courseId);
  }
}
