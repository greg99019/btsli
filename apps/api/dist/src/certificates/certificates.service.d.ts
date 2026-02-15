import { PrismaService } from '../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateMyCertificatePdf(userId: string, courseId: string): Promise<Buffer>;
}
