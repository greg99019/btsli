"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntakeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
let IntakeService = class IntakeService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    async submitLead(dto) {
        const challengeTags = this.tagChallenge(dto.mainChallenge, dto.whatIsBreaking);
        const leadScore = this.scoreLead(dto);
        const suggestedPath = this.routeFromIntake(dto, challengeTags);
        const lead = await this.prisma.leadCapture.create({
            data: {
                orgName: dto.orgName,
                contactName: dto.contactName,
                contactEmail: dto.contactEmail,
                contactPhone: dto.contactPhone ?? null,
                role: dto.role,
                orgType: dto.orgType,
                teamSize: dto.teamSize,
                departmentsInvolved: dto.departmentsInvolved ?? [],
                mainChallenge: dto.mainChallenge,
                challengeTags,
                whatIsBreaking: dto.whatIsBreaking,
                desiredOutcome: dto.desiredOutcome,
                urgencyLevel: dto.urgencyLevel,
                currentSystems: dto.currentSystems ?? [],
                budgetRange: dto.budgetRange,
                preferredTime: dto.preferredTime ?? null,
                additionalNotes: dto.additionalNotes ?? null,
                leadScore,
                suggestedPath,
                status: 'NEW',
            },
        });
        await this.email.sendConfirmation(lead);
        await this.email.sendLeadNotification(lead);
        return { id: lead.id, suggestedPath, leadScore };
    }
    async submitAssessment(leadId, dto) {
        const lead = await this.prisma.leadCapture.findUnique({ where: { id: leadId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const avg = (arr) => Array.isArray(arr) && arr.length ? arr.reduce((a, b) => a + Number(b), 0) / arr.length : 0;
        const scores = {
            communication: avg(dto.communication),
            trainingOnboarding: avg(dto.trainingOnboarding),
            accountability: avg(dto.accountability),
            documentation: avg(dto.documentation),
            teamCoordination: avg(dto.teamCoordination),
            performanceTracking: avg(dto.performanceTracking),
            leadershipAlignment: avg(dto.leadershipAlignment),
        };
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
        const weakestAreas = Object.entries(scores)
            .filter(([, s]) => s <= 2.5)
            .sort(([, a], [, b]) => a - b)
            .map(([section]) => section);
        const systemsSnapshot = this.buildSystemsSnapshot(scores, weakestAreas, lead);
        const assessment = await this.prisma.systemsAssessment.create({
            data: {
                leadId,
                ...scores,
                answers: dto,
                totalScore,
                weakestAreas,
                systemsSnapshot,
            },
        });
        const refinedPath = this.routeFromAssessment(lead, scores);
        await this.prisma.leadCapture.update({
            where: { id: leadId },
            data: { suggestedPath: refinedPath, status: 'ASSESSMENT_SENT' },
        });
        const briefingData = this.generateBriefing(lead, scores, dto, refinedPath);
        await this.prisma.consultantBriefing.upsert({
            where: { leadId },
            update: briefingData,
            create: { leadId, ...briefingData },
        });
        await this.email.sendBriefingNotification({ ...lead, suggestedPath: refinedPath }, briefingData);
        return { assessmentId: assessment.id, refinedPath, totalScore, weakestAreas };
    }
    async listLeads() {
        return this.prisma.leadCapture.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                assessment: { select: { totalScore: true, weakestAreas: true, createdAt: true } },
                briefing: { select: { recommendedService: true, riskLevel: true } },
            },
        });
    }
    async getLead(id) {
        const lead = await this.prisma.leadCapture.findUnique({
            where: { id },
            include: { assessment: true, briefing: true },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    tagChallenge(mainChallenge = '', whatIsBreaking = '') {
        const text = `${mainChallenge} ${whatIsBreaking}`.toLowerCase();
        const tags = [];
        if (/sop|process|procedure|document|written/.test(text))
            tags.push('documentation');
        if (/train|onboard|orient|learning|skill/.test(text))
            tags.push('training');
        if (/communicat|message|inform|update|notify/.test(text))
            tags.push('communication');
        if (/leadership|leader|director|executive|align|vision/.test(text))
            tags.push('leadership');
        if (/metric|track|measure|kpi|data|report|analyt/.test(text))
            tags.push('metrics');
        if (/accountab|follow.through|commit|responsib/.test(text))
            tags.push('accountability');
        if (/coordinat|collaborat|department|team|handoff/.test(text))
            tags.push('coordination');
        if (tags.length === 0)
            tags.push('general');
        return [...new Set(tags)];
    }
    scoreLead(dto) {
        let score = 0;
        const urgencyMap = { CRITICAL: 40, HIGH: 30, MEDIUM: 15, LOW: 5 };
        score += urgencyMap[dto.urgencyLevel] ?? 0;
        const budgetMap = {
            OVER_60K: 30, THIRTY_TO_60K: 25, FIFTEEN_TO_30K: 20,
            FIVE_TO_15K: 15, UNDER_5K: 5, NOT_SURE: 0,
        };
        score += budgetMap[dto.budgetRange] ?? 0;
        const teamMap = {
            '200+': 20, '51-200': 15, '26-50': 10, '11-25': 5, '1-10': 0,
        };
        score += teamMap[dto.teamSize] ?? 0;
        const deptCount = (dto.departmentsInvolved ?? []).length;
        if (deptCount >= 5)
            score += 15;
        else if (deptCount >= 3)
            score += 10;
        return Math.min(score, 100);
    }
    routeFromIntake(dto, tags) {
        const isUrgent = ['HIGH', 'CRITICAL'].includes(dto.urgencyLevel);
        if (tags.includes('documentation') && isUrgent)
            return 'SOP Sprint';
        if (tags.includes('training'))
            return 'Training System Buildout';
        if (tags.includes('leadership'))
            return 'Strategy & Systems Assessment';
        if (tags.includes('metrics'))
            return 'Measurement Framework';
        return 'Full Systems Audit';
    }
    routeFromAssessment(lead, scores) {
        const isUrgent = ['HIGH', 'CRITICAL'].includes(lead.urgencyLevel);
        const lowCount = Object.values(scores).filter((s) => s <= 2.5).length;
        if (lowCount >= 4)
            return 'Full Systems Audit';
        if (scores.documentation <= 2.5 && isUrgent)
            return 'SOP Sprint';
        if (scores.trainingOnboarding <= 2.5)
            return 'Training System Buildout';
        if (scores.leadershipAlignment <= 2.5)
            return 'Strategy & Systems Assessment';
        if (scores.performanceTracking <= 2.5)
            return 'Measurement Framework';
        if (lowCount >= 2)
            return 'Full Systems Audit';
        return 'Systems Health Check';
    }
    buildSystemsSnapshot(scores, weakAreas, lead) {
        const labels = {
            communication: 'Communication Systems',
            trainingOnboarding: 'Training & Onboarding',
            accountability: 'Accountability Structures',
            documentation: 'Documentation & SOPs',
            teamCoordination: 'Team Coordination',
            performanceTracking: 'Performance Tracking',
            leadershipAlignment: 'Leadership Alignment',
        };
        const lines = [
            `Systems Snapshot — ${lead.orgName}`,
            `Date: ${new Date().toLocaleDateString()}`,
            '',
            'Section Scores (1–5 scale):',
        ];
        for (const [key, score] of Object.entries(scores)) {
            const filled = '█'.repeat(Math.round(score));
            const empty = '░'.repeat(5 - Math.round(score));
            lines.push(`  ${(labels[key] ?? key).padEnd(28)} ${filled}${empty}  ${score.toFixed(1)}`);
        }
        const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 7;
        lines.push('', `Overall Score: ${avg.toFixed(1)} / 5.0`);
        if (weakAreas.length > 0) {
            lines.push('', 'Priority Areas for Improvement:');
            weakAreas.forEach((a, i) => lines.push(`  ${i + 1}. ${labels[a] ?? a}`));
        }
        return lines.join('\n');
    }
    generateBriefing(lead, scores, dto, recommendedService) {
        const riskLevel = lead.urgencyLevel === 'CRITICAL' ? 'HIGH'
            : lead.leadScore > 60 ? 'MEDIUM'
                : 'LOW';
        const mainPainPoints = [lead.mainChallenge, lead.whatIsBreaking].filter(Boolean);
        const likelyRootCauses = this.inferRootCauses(scores);
        const suggestedQuestions = this.buildSuggestedQuestions(lead, scores, recommendedService);
        const draftKpis = this.buildKpis(dto, recommendedService);
        const weakArea = this.labelWeakArea(scores);
        const webUrl = process.env.WEB_URL ?? 'https://btsli.com';
        const draftFollowUpEmail = [
            `Dear ${lead.contactName},`,
            '',
            `Thank you for completing the BTSLI™ Systems Fit Assessment for ${lead.orgName}.`,
            '',
            `Based on your responses, we've identified "${lead.mainChallenge}" as your primary area of friction, with particular breakdown in ${weakArea}.`,
            '',
            `Our recommended engagement path is the **${recommendedService}**, which is specifically designed to address the gaps you described and create measurable, sustainable improvement.`,
            '',
            `I'd like to schedule a focused consultation call to walk through your assessment and outline a clear path forward tailored to your organization.`,
            '',
            `[Book your consultation: ${webUrl}/schedule]`,
            '',
            `Warm regards,`,
            `The BTSLI™ Team`,
            `Beyond The Surface Leadership Institute™, LLC`,
        ].join('\n');
        const draftProposalAngle = [
            `PROPOSAL BRIEF — ${lead.orgName}`,
            `Contact: ${lead.contactName} (${lead.role})`,
            `Recommended Service: ${recommendedService}`,
            '',
            `SITUATION:`,
            `${lead.orgName} is experiencing organizational friction centered around "${lead.mainChallenge}". ${lead.contactName} reports that "${lead.whatIsBreaking}" is creating operational challenges for their team of ${lead.teamSize}.`,
            '',
            `DESIRED OUTCOME:`,
            `"${lead.desiredOutcome}"`,
            '',
            `RECOMMENDED APPROACH:`,
            `The ${recommendedService} engagement will provide structured, behavioral systems support that directly addresses the documented gaps. The engagement will include phased milestones with measurable outcomes at 30, 60, and 90 days.`,
            '',
            `KEY VALUE PROPOSITIONS:`,
            `• Evidence-informed, behavioral systems methodology`,
            `• Tailored to ${this.orgTypeLabel(lead.orgType)} organizations`,
            `• Clear accountability structures built into every phase`,
            `• Measurable outcomes aligned to stated goals`,
        ].join('\n');
        return {
            clientSummary: `${lead.contactName}, ${lead.role} at ${lead.orgName} (${this.orgTypeLabel(lead.orgType)}, ${lead.teamSize} staff). Challenge: "${lead.mainChallenge}". Urgency: ${lead.urgencyLevel}. Budget: ${this.budgetLabel(lead.budgetRange)}. Desired outcome: "${lead.desiredOutcome}".`,
            mainPainPoints,
            riskLevel,
            likelyRootCauses,
            suggestedQuestions,
            recommendedService,
            draftFollowUpEmail,
            draftProposalAngle,
            draftKpis,
        };
    }
    inferRootCauses(scores) {
        const causes = [];
        if (scores.documentation <= 2.5)
            causes.push('Lack of documented processes creates inconsistency and reliance on institutional memory.');
        if (scores.leadershipAlignment <= 2.5)
            causes.push('Leadership misalignment creates competing priorities and unclear direction for teams.');
        if (scores.accountability <= 2.5)
            causes.push('Absence of accountability structures allows performance gaps to persist without correction.');
        if (scores.trainingOnboarding <= 2.5)
            causes.push('Insufficient onboarding infrastructure causes inconsistent performance across staff.');
        if (scores.performanceTracking <= 2.5)
            causes.push('Without reliable performance data, the organization cannot identify problems early or course-correct effectively.');
        if (scores.communication <= 2.5)
            causes.push('Communication gaps create misaligned expectations and reduce operational efficiency.');
        if (scores.teamCoordination <= 2.5)
            causes.push('Poor cross-team coordination leads to duplicated effort and execution breakdowns.');
        if (causes.length === 0)
            causes.push('Organizational friction appears multi-systemic. A comprehensive audit is recommended to prioritize improvements.');
        return causes;
    }
    buildSuggestedQuestions(lead, scores, path) {
        const q = [
            `Walk me through what a typical week looks like for your team — where does friction usually show up?`,
            `When did "${lead.mainChallenge}" first become a serious problem?`,
            `What have you already tried to address this? What worked, and what didn't?`,
        ];
        if (scores.documentation <= 2.5)
            q.push(`Do your team members know where to find documented processes — and do they trust those documents are accurate?`);
        if (scores.leadershipAlignment <= 2.5)
            q.push(`How aligned is your leadership team on the top 3 priorities for this year?`);
        if (scores.accountability <= 2.5)
            q.push(`When someone doesn't follow through on a commitment, what typically happens?`);
        if (scores.trainingOnboarding <= 2.5)
            q.push(`What does onboarding look like for a new hire today — and how long until they're fully productive?`);
        if (scores.performanceTracking <= 2.5)
            q.push(`How do you currently know if things are going well — what signals do you rely on?`);
        if (path === 'SOP Sprint')
            q.push(`Which 3–5 processes, if documented and consistently followed, would create the most immediate relief?`);
        if (path === 'Full Systems Audit')
            q.push(`If you had to rank your systems from most broken to most functional, where would you start?`);
        return q;
    }
    buildKpis(dto, path) {
        const kpis = [];
        if (dto.successIn30Days)
            kpis.push(`30-day: ${dto.successIn30Days}`);
        if (dto.successIn60Days)
            kpis.push(`60-day: ${dto.successIn60Days}`);
        if (dto.successIn90Days)
            kpis.push(`90-day: ${dto.successIn90Days}`);
        const pathKpis = {
            'SOP Sprint': [
                '# of core processes documented and accessible',
                '% of staff who can locate and apply key SOPs',
                'Reduction in repeated questions and execution errors',
            ],
            'Training System Buildout': [
                'Onboarding completion rate',
                'Time-to-proficiency for new hires',
                'Staff confidence rating (pre/post)',
            ],
            'Strategy & Systems Assessment': [
                'Leadership alignment score (survey)',
                '# of strategic decisions made with shared framework',
                'Reduction in escalated conflicts',
            ],
            'Measurement Framework': [
                '# of KPIs defined and actively tracked',
                'Dashboard adoption rate',
                'Frequency of data-informed reviews',
            ],
            'Full Systems Audit': [
                'Baseline systems health score',
                '# of priority gaps addressed per quarter',
                'Overall operational efficiency rating',
            ],
            'Systems Health Check': [
                'Identified improvement areas per system',
                'Stakeholder alignment score',
                'Implementation readiness rating',
            ],
        };
        return [...kpis, ...(pathKpis[path] ?? pathKpis['Full Systems Audit'])];
    }
    labelWeakArea(scores) {
        const entries = Object.entries(scores);
        const weakest = entries.sort(([, a], [, b]) => a - b)[0];
        const labels = {
            communication: 'communication systems',
            trainingOnboarding: 'training and onboarding',
            accountability: 'accountability structures',
            documentation: 'documentation and SOPs',
            teamCoordination: 'team coordination',
            performanceTracking: 'performance tracking',
            leadershipAlignment: 'leadership alignment',
        };
        return labels[weakest?.[0]] ?? 'operational systems';
    }
    orgTypeLabel(orgType) {
        const map = {
            NONPROFIT: 'nonprofit', GOVERNMENT: 'government', CORPORATE: 'corporate',
            SMALL_BUSINESS: 'small business', EDUCATION: 'education',
            HEALTHCARE: 'healthcare', OTHER: 'mission-driven',
        };
        return map[orgType] ?? orgType.toLowerCase();
    }
    budgetLabel(budget) {
        const map = {
            UNDER_5K: 'Under $5K', FIVE_TO_15K: '$5K–$15K', FIFTEEN_TO_30K: '$15K–$30K',
            THIRTY_TO_60K: '$30K–$60K', OVER_60K: 'Over $60K', NOT_SURE: 'Not yet determined',
        };
        return map[budget] ?? budget;
    }
};
exports.IntakeService = IntakeService;
exports.IntakeService = IntakeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], IntakeService);
//# sourceMappingURL=intake.service.js.map