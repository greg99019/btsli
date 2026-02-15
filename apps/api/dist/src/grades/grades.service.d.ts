import { PrismaService } from '../prisma/prisma.service';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyCourseGrade(userId: string, courseId: string): Promise<{
        courseId: string;
        overallScorePct: number;
        items: {
            assessmentId: string;
            title: string;
            bestScorePct: number;
        }[];
    }>;
}
