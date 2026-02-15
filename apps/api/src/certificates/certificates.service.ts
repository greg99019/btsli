import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generateMyCertificatePdf(userId: string, courseId: string): Promise<Buffer> {
    const enr = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enr) throw new ForbiddenException('Not enrolled');

    const cert = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));

    const done = new Promise<Buffer>((resolve) => {
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
}
