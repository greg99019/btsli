import { PrismaService } from '../prisma/prisma.service';
export declare class AssessmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAssessmentForStudent(userId: string, assessmentId: string): Promise<{
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
    startAttempt(userId: string, assessmentId: string): Promise<{
        id: string;
        status: string;
        score: number | null;
        userId: string;
        assessmentId: string;
        startedAt: Date;
        submittedAt: Date | null;
    }>;
    saveAnswer(userId: string, attemptId: string, input: {
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
    submit(userId: string, attemptId: string): Promise<{
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
