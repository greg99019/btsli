import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async getMyCourseGrade(userId: string, courseId: string) {
    const enr = await this.prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
    if (!enr) throw new ForbiddenException('Not enrolled');

    const assessments = await this.prisma.assessment.findMany({
      where: { lesson: { module: { courseId } } },
      select: { id: true, title: true },
    });

    if (assessments.length === 0) return { courseId, overallScorePct: null, items: [] };

    const attempts = await this.prisma.attempt.findMany({
      where: { userId, assessmentId: { in: assessments.map(a => a.id) }, status: 'SUBMITTED' },
      select: { assessmentId: true, score: true },
    });

    const byAssessment = new Map<string, number[]>();
    for (const a of attempts) {
      if (a.score == null) continue;
      const arr = byAssessment.get(a.assessmentId) ?? [];
      arr.push(a.score);
      byAssessment.set(a.assessmentId, arr);
    }

    const items = assessments.map((a) => {
      const scores = byAssessment.get(a.id) ?? [];
      const best = scores.length ? Math.max(...scores) : null;
      return { assessmentId: a.id, title: a.title, bestScorePct: best };
    });

    const scored = items.map(i => i.bestScorePct).filter((x): x is number => typeof x === 'number');
    const overall = scored.length ? scored.reduce((s, n) => s + n, 0) / scored.length : null;

    return { courseId, overallScorePct: overall, items };
  }
}
