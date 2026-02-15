import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new BadRequestException('Course not found');

    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    });
  }

  async assertEnrolled(userId: string, courseId: string) {
    const enr = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enr) throw new ForbiddenException('Not enrolled');
  }

  async myCourses(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });

    return enrollments.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      description: e.course.description,
      published: e.course.published,
    }));
  }

  async getOutline(userId: string, courseId: string) {
    await this.assertEnrolled(userId, courseId);

    const modules = await this.prisma.module.findMany({
      where: { courseId },
      orderBy: { orderIdx: 'asc' },
      include: { lessons: { orderBy: { orderIdx: 'asc' } } },
    });

    const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
    const progress = await this.prisma.progress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
    });
    const pMap = new Map(progress.map((p) => [p.lessonId, p]));

    return modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        orderIdx: l.orderIdx,
        progress: pMap.get(l.id) ?? null,
      })),
    }));
  }

  async getNextLesson(userId: string, courseId: string) {
    await this.assertEnrolled(userId, courseId);

    const lessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      orderBy: [{ module: { orderIdx: 'asc' } }, { orderIdx: 'asc' }],
      include: { module: true },
    });

    if (lessons.length === 0) throw new BadRequestException('No lessons');

    const prog = await this.prisma.progress.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    });
    const completed = new Set(prog.filter((p) => p.status === 'COMPLETED').map((p) => p.lessonId));

    const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[lessons.length - 1];

    return { lessonId: next.id, title: next.title, type: next.type };
  }

  async getLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true, assessment: true },
    });
    if (!lesson) throw new BadRequestException('Lesson not found');

    await this.assertEnrolled(userId, lesson.module.courseId);

    const progress = await this.prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    return {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      videoUrl: lesson.videoUrl,
      readingHtml: lesson.readingHtml,
      moduleId: lesson.moduleId,
      courseId: lesson.module.courseId,
      assessmentId: lesson.assessment?.id ?? null,
      progress: progress ?? null,
    };
  }

  async updateProgress(
    userId: string,
    lessonId: string,
    input: { percent?: number; lastSecond?: number; completed?: boolean },
  ) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
    if (!lesson) throw new BadRequestException('Lesson not found');

    await this.assertEnrolled(userId, lesson.module.courseId);

    const percent = Math.max(0, Math.min(100, input.percent ?? 0));
    const lastSecond = Math.max(0, input.lastSecond ?? 0);

    const status =
      input.completed || percent >= 95
        ? 'COMPLETED'
        : percent > 0 || lastSecond > 0
          ? 'IN_PROGRESS'
          : 'LOCKED';

    const saved = await this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { percent, lastSecond, status },
      create: { userId, lessonId, percent, lastSecond, status },
    });

    await this.maybeIssueCertificate(userId, lesson.module.courseId);
    return saved;
  }

  async maybeIssueCertificate(userId: string, courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });
    if (lessons.length === 0) return;

    const prog = await this.prisma.progress.findMany({
      where: { userId, lessonId: { in: lessons.map(l => l.id) } },
      select: { lessonId: true, status: true },
    });
    const completed = new Set(prog.filter(p => p.status === 'COMPLETED').map(p => p.lessonId));
    if (completed.size !== lessons.length) return;

    const assessments = await this.prisma.assessment.findMany({
      where: { lesson: { module: { courseId } } },
      select: { id: true },
    });

    let overall: number | null = null;
    if (assessments.length) {
      const attempts = await this.prisma.attempt.findMany({
        where: { userId, assessmentId: { in: assessments.map(a => a.id) }, status: 'SUBMITTED' },
        select: { assessmentId: true, score: true },
      });
      const bestBy = new Map<string, number>();
      for (const a of attempts) {
        if (a.score == null) continue;
        bestBy.set(a.assessmentId, Math.max(bestBy.get(a.assessmentId) ?? 0, a.score));
      }
      const vals = [...bestBy.values()];
      overall = vals.length ? vals.reduce((s, n) => s + n, 0) / vals.length : null;
    }

    const pass = overall == null ? true : overall >= 70;
    if (!pass) return;

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return;

    await this.prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { scorePct: overall ?? undefined },
      create: {
        userId,
        courseId,
        title: `${course.title} Certificate of Completion`,
        scorePct: overall ?? undefined,
      },
    });
  }
}
