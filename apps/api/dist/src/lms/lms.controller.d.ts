import { LmsService } from './lms.service';
export declare class LmsController {
    private lms;
    constructor(lms: LmsService);
    myCourses(req: any): Promise<{
        id: string;
        title: string;
        description: string;
        published: boolean;
    }[]>;
    enroll(req: any, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        courseId: string;
        userId: string;
    }>;
    outline(req: any, courseId: string): Promise<{
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            type: import(".prisma/client").$Enums.LessonType;
            orderIdx: number;
            progress: {
                id: string;
                status: import(".prisma/client").$Enums.ProgressStatus;
                userId: string;
                lessonId: string;
                percent: number;
                lastSecond: number;
            };
        }[];
    }[]>;
    next(req: any, courseId: string): Promise<{
        lessonId: string;
        title: string;
        type: import(".prisma/client").$Enums.LessonType;
    }>;
    lesson(req: any, lessonId: string): Promise<{
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
            status: import(".prisma/client").$Enums.ProgressStatus;
            userId: string;
            lessonId: string;
            percent: number;
            lastSecond: number;
        };
    }>;
    progress(req: any, lessonId: string, body: {
        percent?: number;
        lastSecond?: number;
        completed?: boolean;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ProgressStatus;
        userId: string;
        lessonId: string;
        percent: number;
        lastSecond: number;
    }>;
}
