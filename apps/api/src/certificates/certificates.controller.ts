import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private certs: CertificatesService) {}

  @Get('courses/:courseId/me/pdf')
  async myPdf(@Req() req: any, @Param('courseId') courseId: string, @Res() res: Response) {
    const pdf = await this.certs.generateMyCertificatePdf(req.user.id, courseId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${courseId}.pdf"`);
    res.send(pdf);
  }
}
