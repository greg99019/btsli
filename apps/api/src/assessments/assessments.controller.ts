import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AssessmentsService } from './assessments.service';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private svc: AssessmentsService) {}

  @Get(':assessmentId')
  get(@Req() req: any, @Param('assessmentId') assessmentId: string) {
    return this.svc.getAssessmentForStudent(req.user.id, assessmentId);
  }

  @Post(':assessmentId/start')
  start(@Req() req: any, @Param('assessmentId') assessmentId: string) {
    return this.svc.startAttempt(req.user.id, assessmentId);
  }

  @Post('attempts/:attemptId/answer')
  answer(
    @Req() req: any,
    @Param('attemptId') attemptId: string,
    @Body() body: { questionId: string; choiceId?: string; textAnswer?: string },
  ) {
    return this.svc.saveAnswer(req.user.id, attemptId, body);
  }

  @Post('attempts/:attemptId/submit')
  submit(@Req() req: any, @Param('attemptId') attemptId: string) {
    return this.svc.submit(req.user.id, attemptId);
  }
}
