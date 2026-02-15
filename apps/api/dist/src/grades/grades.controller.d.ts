import { GradesService } from './grades.service';
export declare class GradesController {
    private grades;
    constructor(grades: GradesService);
    me(req: any, courseId: string): Promise<{
        courseId: string;
        overallScorePct: number;
        items: {
            assessmentId: string;
            title: string;
            bestScorePct: number;
        }[];
    }>;
}
