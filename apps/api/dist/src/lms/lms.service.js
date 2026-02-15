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
exports.LmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LmsService = class LmsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enroll(userId, courseId) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            throw new common_1.BadRequestException('Course not found');
        return this.prisma.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: {},
            create: { userId, courseId },
        });
    }
    async assertEnrolled(userId, courseId) {
        const enr = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enr)
            throw new common_1.ForbiddenException('Not enrolled');
    }
    async myCourses(userId) {
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
    async getOutline(userId, courseId) {
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
    async getNextLesson(userId, courseId) {
        await this.assertEnrolled(userId, courseId);
        const lessons = await this.prisma.lesson.findMany({
            where: { module: { courseId } },
            orderBy: [{ module: { orderIdx: 'asc' } }, { orderIdx: 'asc' }],
            include: { module: true },
        });
        if (lessons.length === 0)
            throw new common_1.BadRequestException('No lessons');
        const prog = await this.prisma.progress.findMany({
            where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
        });
        const completed = new Set(prog.filter((p) => p.status === 'COMPLETED').map((p) => p.lessonId));
        const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[lessons.length - 1];
        return { lessonId: next.id, title: next.title, type: next.type };
    }
    async getLesson(userId, lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: true, assessment: true },
        });
        if (!lesson)
            throw new common_1.BadRequestException('Lesson not found');
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
    async updateProgress(userId, lessonId, input) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
        if (!lesson)
            throw new common_1.BadRequestException('Lesson not found');
        await this.assertEnrolled(userId, lesson.module.courseId);
        const percent = Math.max(0, Math.min(100, input.percent ?? 0));
        const lastSecond = Math.max(0, input.lastSecond ?? 0);
        const status = input.completed || percent >= 95
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
    async maybeIssueCertificate(userId, courseId) {
        const lessons = await this.prisma.lesson.findMany({
            where: { module: { courseId } },
            select: { id: true },
        });
        if (lessons.length === 0)
            return;
        const prog = await this.prisma.progress.findMany({
            where: { userId, lessonId: { in: lessons.map(l => l.id) } },
            select: { lessonId: true, status: true },
        });
        const completed = new Set(prog.filter(p => p.status === 'COMPLETED').map(p => p.lessonId));
        if (completed.size !== lessons.length)
            return;
        const assessments = await this.prisma.assessment.findMany({
            where: { lesson: { module: { courseId } } },
            select: { id: true },
        });
        let overall = null;
        if (assessments.length) {
            const attempts = await this.prisma.attempt.findMany({
                where: { userId, assessmentId: { in: assessments.map(a => a.id) }, status: 'SUBMITTED' },
                select: { assessmentId: true, score: true },
            });
            const bestBy = new Map();
            for (const a of attempts) {
                if (a.score == null)
                    continue;
                bestBy.set(a.assessmentId, Math.max(bestBy.get(a.assessmentId) ?? 0, a.score));
            }
            const vals = [...bestBy.values()];
            overall = vals.length ? vals.reduce((s, n) => s + n, 0) / vals.length : null;
        }
        const pass = overall == null ? true : overall >= 70;
        if (!pass)
            return;
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course)
            return;
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
};
exports.LmsService = LmsService;
exports.LmsService = LmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LmsService);
//# sourceMappingURL=lms.service.js.map