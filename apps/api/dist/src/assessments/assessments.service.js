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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssessmentsService = class AssessmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAssessmentForStudent(userId, assessmentId) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                lesson: { include: { module: true } },
                questions: { include: { choices: true } },
            },
        });
        if (!assessment)
            throw new common_1.BadRequestException('Assessment not found');
        const courseId = assessment.lesson.module.courseId;
        const enr = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enr)
            throw new common_1.ForbiddenException('Not enrolled');
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
    async startAttempt(userId, assessmentId) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: { lesson: { include: { module: true } } },
        });
        if (!assessment)
            throw new common_1.BadRequestException('Assessment not found');
        const courseId = assessment.lesson.module.courseId;
        const enr = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enr)
            throw new common_1.ForbiddenException('Not enrolled');
        const existingCount = await this.prisma.attempt.count({
            where: { assessmentId, userId, status: { in: ['IN_PROGRESS', 'SUBMITTED'] } },
        });
        if (existingCount >= assessment.attemptsAllowed) {
            throw new common_1.BadRequestException('Attempts limit reached');
        }
        return this.prisma.attempt.create({ data: { assessmentId, userId } });
    }
    async saveAnswer(userId, attemptId, input) {
        const attempt = await this.prisma.attempt.findUnique({ where: { id: attemptId } });
        if (!attempt)
            throw new common_1.BadRequestException('Attempt not found');
        if (attempt.userId !== userId)
            throw new common_1.ForbiddenException();
        if (attempt.status !== 'IN_PROGRESS')
            throw new common_1.BadRequestException('Attempt not editable');
        const q = await this.prisma.question.findUnique({ where: { id: input.questionId } });
        if (!q || q.assessmentId !== attempt.assessmentId)
            throw new common_1.BadRequestException('Invalid question');
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
    async submit(userId, attemptId) {
        const attempt = await this.prisma.attempt.findUnique({
            where: { id: attemptId },
            include: {
                assessment: { include: { questions: { include: { choices: true } } } },
                answers: true,
            },
        });
        if (!attempt)
            throw new common_1.BadRequestException('Attempt not found');
        if (attempt.userId !== userId)
            throw new common_1.ForbiddenException();
        if (attempt.status !== 'IN_PROGRESS')
            throw new common_1.BadRequestException('Already submitted');
        const answerMap = new Map(attempt.answers.map((a) => [a.questionId, a]));
        let earned = 0;
        let possible = 0;
        for (const q of attempt.assessment.questions) {
            possible += q.points;
            const a = answerMap.get(q.id);
            if (!a)
                continue;
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
            }
            else {
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
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map