import { PrismaService } from '../prisma/prisma.service';
export declare class LmsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        courseId: string;
    }>;
    assertEnrolled(userId: string, courseId: string): Promise<void>;
    myCourses(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        published: boolean;
    }[]>;
    getOutline(userId: string, courseId: string): Promise<{
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            type: import(".prisma/client").$Enums.LessonType;
            orderIdx: number;
            progress: {
                id: string;
                userId: string;
                status: import(".prisma/client").$Enums.ProgressStatus;
                lessonId: string;
                percent: number;
                lastSecond: number;
            };
        }[];
    }[]>;
    getNextLesson(userId: string, courseId: string): Promise<{
        lessonId: string;
        title: string;
        type: import(".prisma/client").$Enums.LessonType;
    }>;
    getLesson(userId: string, lessonId: string): Promise<{
        id: string;
        title: string;
        type: import(".prisma/client").$Enums.LessonType;
        videoUrl: string;
        readingHtml: string;
        moduleId: string;
        courseId: string;
        assessmentId: string;
        progress: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.ProgressStatus;
            lessonId: string;
            percent: number;
            lastSecond: number;
        };
    }>;
    updateProgress(userId: string, lessonId: string, input: {
        percent?: number;
        lastSecond?: number;
        completed?: boolean;
    }): Promise<{
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.ProgressStatus;
        lessonId: string;
        percent: number;
        lastSecond: number;
    }>;
    maybeIssueCertificate(userId: string, courseId: string): Promise<void>;
}
