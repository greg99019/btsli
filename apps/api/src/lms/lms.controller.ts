import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { LmsService } from './lms.service';

@Controller('lms')
@UseGuards(JwtAuthGuard)
export class LmsController {
  constructor(private lms: LmsService) {}

  @Get('me/courses')
  myCourses(@Req() req: any) {
    return this.lms.myCourses(req.user.id);
  }

  @Post('courses/:courseId/enroll')
  enroll(@Req() req: any, @Param('courseId') courseId: string) {
    return this.lms.enroll(req.user.id, courseId);
  }

  @Get('courses/:courseId/outline')
  outline(@Req() req: any, @Param('courseId') courseId: string) {
    return this.lms.getOutline(req.user.id, courseId);
  }

  @Get('courses/:courseId/next')
  next(@Req() req: any, @Param('courseId') courseId: string) {
    return this.lms.getNextLesson(req.user.id, courseId);
  }

  @Get('lessons/:lessonId')
  lesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.lms.getLesson(req.user.id, lessonId);
  }

  @Post('lessons/:lessonId/progress')
  progress(
    @Req() req: any,
    @Param('lessonId') lessonId: string,
    @Body() body: { percent?: number; lastSecond?: number; completed?: boolean },
  ) {
    return this.lms.updateProgress(req.user.id, lessonId, body);
  }
}
