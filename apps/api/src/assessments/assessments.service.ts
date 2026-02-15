import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async getAssessmentForStudent(userId: string, assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        lesson: { include: { module: true } },
        questions: { include: { choices: true } },
      },
    });
    if (!assessment) throw new BadRequestException('Assessment not found');

    const courseId = assessment.lesson.module.courseId;
    const enr = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enr) throw new ForbiddenException('Not enrolled');

    return {
      id: assessment.id,
      title: assessment.title,
      timeLimitMin: assessment.timeLimitMin,
      attemptsAllowed: assessment.attemptsAllowed,
      passingScore: assessment.passingScore,
      questions: assessment.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        points: q.points,
        choices: q.choices.map((c) => ({
          id: c.id,
          text: c.text,
        })),
      })),
    };
  }

  async startAttempt(userId: string, assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { lesson: { include: { module: true } } },
    });
    if (!assessment) throw new BadRequestException('Assessment not found');

    const courseId = assessment.lesson.module.courseId;
    const enr = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enr) throw new ForbiddenException('Not enrolled');

    const existingCount = await this.prisma.attempt.count({
      where: { assessmentId, userId, status: { in: ['IN_PROGRESS', 'SUBMITTED'] } },
    });
    if (existingCount >= assessment.attemptsAllowed) {
      throw new BadRequestException('Attempts limit reached');
    }

    return this.prisma.attempt.create({ data: { assessmentId, userId } });
  }

  async saveAnswer(
    userId: string,
    attemptId: string,
    input: { questionId: string; choiceId?: string; textAnswer?: string },
  ) {
    const attempt = await this.prisma.attempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new BadRequestException('Attempt not found');
    if (attempt.userId !== userId) throw new ForbiddenException();
    if (attempt.status !== 'IN_PROGRESS') throw new BadRequestException('Attempt not editable');

    const q = await this.prisma.question.findUnique({ where: { id: input.questionId } });
    if (!q || q.assessmentId !== attempt.assessmentId) throw new BadRequestException('Invalid question');

    // upsert via composite unique
    const existing = await this.prisma.answer.findUnique({
      where: { attemptId_questionId: { attemptId, questionId: input.questionId } },
    });

    if (existing) {
      return this.prisma.answer.update({
        where: { id: existing.id },
        data: { choiceId: input.choiceId, textAnswer: input.textAnswer },
      });
    }

    return this.prisma.answer.create({
      data: { attemptId, questionId: input.questionId, choiceId: input.choiceId, textAnswer: input.textAnswer },
    });
  }

  async submit(userId: string, attemptId: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: { include: { questions: { include: { choices: true } } } },
        answers: true,
      },
    });
    if (!attempt) throw new BadRequestException('Attempt not found');
    if (attempt.userId !== userId) throw new ForbiddenException();
    if (attempt.status !== 'IN_PROGRESS') throw new BadRequestException('Already submitted');

    const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));
    let earned = 0;
    let possible = 0;

    for (const q of attempt.assessment.questions) {
      possible += q.points;
      const a = answerMap.get(q.id);
      if (!a) continue;

      const t = (q.type || '').toUpperCase();
      if (t === 'MCQ' || t === 'TRUE_FALSE') {
        const correct = q.choices.find((c) => c.isCorrect);
        const isCorrect = !!correct && a.choiceId === correct.id;
        const pts = isCorrect ? q.points : 0;
        earned += pts;

        await this.prisma.answer.update({
          where: { id: a.id },
          data: { pointsAwarded: pts, feedback: isCorrect ? 'Correct' : 'Incorrect' },
        });
      } else {
        await this.prisma.answer.update({
          where: { id: a.id },
          data: { feedback: 'Pending manual review' },
        });
      }
    }

    const scorePct = possible > 0 ? (earned / possible) * 100 : 0;

    const updated = await this.prisma.attempt.update({
      where: { id: attemptId },
      data: { status: 'SUBMITTED', submittedAt: new Date(), score: scorePct },
    });

    return { attempt: updated, scorePct, earned, possible };
  }
}
