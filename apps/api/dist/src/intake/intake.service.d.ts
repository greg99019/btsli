import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
export declare class IntakeService {
    private prisma;
    private email;
    constructor(prisma: PrismaService, email: EmailService);
    submitLead(dto: any): Promise<{
        id: string;
        suggestedPath: string;
        leadScore: number;
    }>;
    submitAssessment(leadId: string, dto: any): Promise<{
        assessmentId: string;
        refinedPath: string;
        totalScore: number;
        weakestAreas: string[];
    }>;
    listLeads(): Promise<({
        assessment: {
            createdAt: Date;
            totalScore: number;
            weakestAreas: string[];
        };
        briefing: {
            riskLevel: string;
            recommendedService: string;
        };
    } & {
        id: string;
        createdAt: Date;
        orgName: string;
        contactName: string;
        contactEmail: string;
        contactPhone: string | null;
        role: string;
        orgType: import(".prisma/client").$Enums.OrgType;
        teamSize: string;
        departmentsInvolved: string[];
        mainChallenge: string;
        challengeTags: string[];
        whatIsBreaking: string;
        desiredOutcome: string;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        currentSystems: string[];
        budgetRange: import(".prisma/client").$Enums.BudgetRange;
        preferredTime: string | null;
        additionalNotes: string | null;
        leadScore: number;
        suggestedPath: string | null;
        status: string;
    })[]>;
    getLead(id: string): Promise<{
        assessment: {
            id: string;
            createdAt: Date;
            communication: number;
            trainingOnboarding: number;
            accountability: number;
            documentation: number;
            teamCoordination: number;
            performanceTracking: number;
            leadershipAlignment: number;
            answers: import("@prisma/client/runtime/library").JsonValue;
            totalScore: number;
            weakestAreas: string[];
            systemsSnapshot: string;
            leadId: string;
        };
        briefing: {
            id: string;
            createdAt: Date;
            leadId: string;
            clientSummary: string;
            mainPainPoints: string[];
            riskLevel: string;
            likelyRootCauses: string[];
            suggestedQuestions: string[];
            recommendedService: string;
            draftFollowUpEmail: string;
            draftProposalAngle: string;
            draftKpis: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        orgName: string;
        contactName: string;
        contactEmail: string;
        contactPhone: string | null;
        role: string;
        orgType: import(".prisma/client").$Enums.OrgType;
        teamSize: string;
        departmentsInvolved: string[];
        mainChallenge: string;
        challengeTags: string[];
        whatIsBreaking: string;
        desiredOutcome: string;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        currentSystems: string[];
        budgetRange: import(".prisma/client").$Enums.BudgetRange;
        preferredTime: string | null;
        additionalNotes: string | null;
        leadScore: number;
        suggestedPath: string | null;
        status: string;
    }>;
    private tagChallenge;
    private scoreLead;
    private routeFromIntake;
    private routeFromAssessment;
    private buildSystemsSnapshot;
    private generateBriefing;
    private inferRootCauses;
    private buildSuggestedQuestions;
    private buildKpis;
    private labelWeakArea;
    private orgTypeLabel;
    private budgetLabel;
}
