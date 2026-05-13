import { AssessmentsService } from './assessments.service';
export declare class AssessmentsController {
    private svc;
    constructor(svc: AssessmentsService);
    get(req: any, assessmentId: string): Promise<{
        id: string;
        title: string;
        timeLimitMin: number;
        attemptsAllowed: number;
        passingScore: number;
        questions: {
            id: string;
            prompt: string;
            type: string;
            points: number;
            choices: {
                id: string;
                text: string;
            }[];
        }[];
    }>;
    start(req: any, assessmentId: string): Promise<{
        id: string;
        status: string;
        score: number | null;
        userId: string;
        assessmentId: string;
        startedAt: Date;
        submittedAt: Date | null;
    }>;
    answer(req: any, attemptId: string, body: {
        questionId: string;
        choiceId?: string;
        textAnswer?: string;
    }): Promise<{
        id: string;
        questionId: string;
        attemptId: string;
        choiceId: string | null;
        textAnswer: string | null;
        pointsAwarded: number | null;
        feedback: string | null;
    }>;
    submit(req: any, attemptId: string): Promise<{
        attempt: {
            id: string;
            status: string;
            score: number | null;
            userId: string;
            assessmentId: string;
            startedAt: Date;
            submittedAt: Date | null;
        };
        scorePct: number;
        earned: number;
        possible: number;
    }>;
}
