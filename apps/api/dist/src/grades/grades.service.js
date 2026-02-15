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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradesService = class GradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCourseGrade(userId, courseId) {
        const enr = await this.prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
        if (!enr)
            throw new common_1.ForbiddenException('Not enrolled');
        const assessments = await this.prisma.assessment.findMany({
            where: { lesson: { module: { courseId } } },
            select: { id: true, title: true },
        });
        if (assessments.length === 0)
            return { courseId, overallScorePct: null, items: [] };
        const attempts = await this.prisma.attempt.findMany({
            where: { userId, assessmentId: { in: assessments.map(a => a.id) }, status: 'SUBMITTED' },
            select: { assessmentId: true, score: true },
        });
        const byAssessment = new Map();
        for (const a of attempts) {
            if (a.score == null)
                continue;
            const arr = byAssessment.get(a.assessmentId) ?? [];
            arr.push(a.score);
            byAssessment.set(a.assessmentId, arr);
        }
        const items = assessments.map((a) => {
            const scores = byAssessment.get(a.id) ?? [];
            const best = scores.length ? Math.max(...scores) : null;
            return { assessmentId: a.id, title: a.title, bestScorePct: best };
        });
        const scored = items.map(i => i.bestScorePct).filter((x) => typeof x === 'number');
        const overall = scored.length ? scored.reduce((s, n) => s + n, 0) / scored.length : null;
        return { courseId, overallScorePct: overall, items };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map