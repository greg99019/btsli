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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdfkit_1 = require("pdfkit");
let CertificatesService = class CertificatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateMyCertificatePdf(userId, courseId) {
        const enr = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enr)
            throw new common_1.ForbiddenException('Not enrolled');
        const cert = await this.prisma.certificate.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        const doc = new pdfkit_1.default({ size: 'LETTER', margin: 50 });
        const chunks = [];
        doc.on('data', (c) => chunks.push(c));
        const done = new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });
        doc.fontSize(22).text('Certificate', { align: 'center' });
        doc.moveDown(1);
        if (!cert) {
            doc.fontSize(14).text('Certificate not issued yet.', { align: 'center' });
            doc.moveDown(1);
            doc.fontSize(12).text('Complete the course requirements and pass any required assessments.', { align: 'center' });
            doc.end();
            return done;
        }
        doc.fontSize(16).text('Certificate of Completion', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(12).text('This certifies that', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(20).text(user?.name ?? 'Participant', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).text('has successfully completed', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).text(course?.title ?? 'Course', { align: 'center' });
        doc.moveDown(1);
        if (typeof cert.scorePct === 'number') {
            doc.fontSize(12).text(`Overall Score: ${Math.round(cert.scorePct)}%`, { align: 'center' });
            doc.moveDown(0.5);
        }
        doc.fontSize(12).text(`Issued: ${new Date(cert.issuedAt).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(3);
        doc.fontSize(10).text('Beyond the Surface Leadership Institute LLC', { align: 'center' });
        doc.end();
        return done;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map