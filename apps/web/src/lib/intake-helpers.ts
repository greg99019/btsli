// Pure helper functions – no Prisma imports, no side effects

export function tagChallenge(mainChallenge = '', whatIsBreaking = ''): string[] {
  const text = `${mainChallenge} ${whatIsBreaking}`.toLowerCase();
  const tags: string[] = [];
  if (/sop|process|procedure|document|written/.test(text)) tags.push('documentation');
  if (/train|onboard|orient|learning|skill/.test(text)) tags.push('training');
  if (/communicat|message|inform|update|notify/.test(text)) tags.push('communication');
  if (/leadership|leader|director|executive|align|vision/.test(text)) tags.push('leadership');
  if (/metric|track|measure|kpi|data|report|analyt/.test(text)) tags.push('metrics');
  if (/accountab|follow.through|commit|responsib/.test(text)) tags.push('accountability');
  if (/coordinat|collaborat|department|team|handoff/.test(text)) tags.push('coordination');
  if (tags.length === 0) tags.push('general');
  return [...new Set(tags)];
}

export function scoreLead(dto: Record<string, unknown>): number {
  let score = 0;
  const urgencyMap: Record<string, number> = { CRITICAL: 40, HIGH: 30, MEDIUM: 15, LOW: 5 };
  score += urgencyMap[dto.urgencyLevel as string] ?? 0;

  const budgetMap: Record<string, number> = {
    OVER_60K: 30, THIRTY_TO_60K: 25, FIFTEEN_TO_30K: 20,
    FIVE_TO_15K: 15, UNDER_5K: 5, NOT_SURE: 0,
  };
  score += budgetMap[dto.budgetRange as string] ?? 0;

  const teamMap: Record<string, number> = {
    '200+': 20, '51-200': 15, '26-50': 10, '11-25': 5, '1-10': 0,
  };
  score += teamMap[dto.teamSize as string] ?? 0;

  const deptCount = (dto.departmentsInvolved as string[] | undefined ?? []).length;
  if (deptCount >= 5) score += 15;
  else if (deptCount >= 3) score += 10;

  return Math.min(score, 100);
}

export function routeFromIntake(dto: Record<string, unknown>, tags: string[]): string {
  const isUrgent = ['HIGH', 'CRITICAL'].includes(dto.urgencyLevel as string);
  if (tags.includes('documentation') && isUrgent) return 'SOP Sprint';
  if (tags.includes('training')) return 'Training System Buildout';
  if (tags.includes('leadership')) return 'Strategy & Systems Assessment';
  if (tags.includes('metrics')) return 'Measurement Framework';
  return 'Full Systems Audit';
}

export interface SectionScores {
  communication: number;
  trainingOnboarding: number;
  accountability: number;
  documentation: number;
  teamCoordination: number;
  performanceTracking: number;
  leadershipAlignment: number;
}

export function calcSectionScores(dto: Record<string, unknown>): SectionScores {
  const avg = (arr: unknown) =>
    Array.isArray(arr) && arr.length
      ? arr.reduce((a: number, b: unknown) => a + Number(b), 0) / arr.length
      : 0;

  return {
    communication: avg(dto.communication),
    trainingOnboarding: avg(dto.trainingOnboarding),
    accountability: avg(dto.accountability),
    documentation: avg(dto.documentation),
    teamCoordination: avg(dto.teamCoordination),
    performanceTracking: avg(dto.performanceTracking),
    leadershipAlignment: avg(dto.leadershipAlignment),
  };
}

export function routeFromAssessment(lead: Record<string, unknown>, scores: SectionScores): string {
  const isUrgent = ['HIGH', 'CRITICAL'].includes(lead.urgencyLevel as string);
  const lowCount = Object.values(scores).filter((s) => s <= 2.5).length;
  if (lowCount >= 4) return 'Full Systems Audit';
  if (scores.documentation <= 2.5 && isUrgent) return 'SOP Sprint';
  if (scores.trainingOnboarding <= 2.5) return 'Training System Buildout';
  if (scores.leadershipAlignment <= 2.5) return 'Strategy & Systems Assessment';
  if (scores.performanceTracking <= 2.5) return 'Measurement Framework';
  if (lowCount >= 2) return 'Full Systems Audit';
  return 'Systems Health Check';
}

export function buildSystemsSnapshot(
  scores: SectionScores,
  weakAreas: string[],
  lead: Record<string, unknown>,
): string {
  const labels: Record<string, string> = {
    communication: 'Communication Systems',
    trainingOnboarding: 'Training & Onboarding',
    accountability: 'Accountability Structures',
    documentation: 'Documentation & SOPs',
    teamCoordination: 'Team Coordination',
    performanceTracking: 'Performance Tracking',
    leadershipAlignment: 'Leadership Alignment',
  };

  const lines: string[] = [
    `Systems Snapshot — ${lead.orgName}`,
    `Date: ${new Date().toLocaleDateString()}`,
    '',
    'Section Scores (1–5 scale):',
  ];

  for (const [key, score] of Object.entries(scores) as [string, number][]) {
    const filled = '█'.repeat(Math.round(score));
    const empty = '░'.repeat(5 - Math.round(score));
    lines.push(`  ${(labels[key] ?? key).padEnd(28)} ${filled}${empty}  ${score.toFixed(1)}`);
  }

  const avg2 = Object.values(scores).reduce((a, b) => a + b, 0) / 7;
  lines.push('', `Overall Score: ${avg2.toFixed(1)} / 5.0`);

  if (weakAreas.length > 0) {
    lines.push('', 'Priority Areas for Improvement:');
    weakAreas.forEach((a, i) => lines.push(`  ${i + 1}. ${labels[a] ?? a}`));
  }

  return lines.join('\n');
}

export function generateBriefing(
  lead: Record<string, unknown>,
  scores: SectionScores,
  dto: Record<string, unknown>,
  recommendedService: string,
) {
  const riskLevel =
    lead.urgencyLevel === 'CRITICAL' ? 'HIGH'
    : (lead.leadScore as number) > 60 ? 'MEDIUM'
    : 'LOW';

  const mainPainPoints = [lead.mainChallenge, lead.whatIsBreaking].filter(Boolean) as string[];
  const likelyRootCauses = inferRootCauses(scores);
  const suggestedQuestions = buildSuggestedQuestions(lead, scores, recommendedService);
  const draftKpis = buildKpis(dto, recommendedService);
  const weakArea = labelWeakArea(scores);
  const webUrl = process.env.WEB_URL ?? 'https://btsli.vercel.app';

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
    `The ${recommendedService} engagement will provide structured, behavioral systems support that directly addresses the documented gaps.`,
    '',
    `KEY VALUE PROPOSITIONS:`,
    `• Evidence-informed, behavioral systems methodology`,
    `• Tailored to ${orgTypeLabel(lead.orgType as string)} organizations`,
    `• Clear accountability structures built into every phase`,
    `• Measurable outcomes aligned to stated goals`,
  ].join('\n');

  return {
    clientSummary: `${lead.contactName}, ${lead.role} at ${lead.orgName} (${orgTypeLabel(lead.orgType as string)}, ${lead.teamSize} staff). Challenge: "${lead.mainChallenge}". Urgency: ${lead.urgencyLevel}. Budget: ${budgetLabel(lead.budgetRange as string)}. Desired outcome: "${lead.desiredOutcome}".`,
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

function inferRootCauses(scores: SectionScores): string[] {
  const causes: string[] = [];
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

function buildSuggestedQuestions(
  lead: Record<string, unknown>,
  scores: SectionScores,
  path: string,
): string[] {
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

function buildKpis(dto: Record<string, unknown>, path: string): string[] {
  const kpis: string[] = [];
  if (dto.successIn30Days) kpis.push(`30-day: ${dto.successIn30Days}`);
  if (dto.successIn60Days) kpis.push(`60-day: ${dto.successIn60Days}`);
  if (dto.successIn90Days) kpis.push(`90-day: ${dto.successIn90Days}`);

  const pathKpis: Record<string, string[]> = {
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

export function labelWeakArea(scores: SectionScores): string {
  const entries = Object.entries(scores) as [string, number][];
  const weakest = entries.sort(([, a], [, b]) => a - b)[0];
  const labels: Record<string, string> = {
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

export function orgTypeLabel(orgType: string): string {
  const map: Record<string, string> = {
    NONPROFIT: 'nonprofit', GOVERNMENT: 'government', CORPORATE: 'corporate',
    SMALL_BUSINESS: 'small business', EDUCATION: 'education',
    HEALTHCARE: 'healthcare', OTHER: 'mission-driven',
  };
  return map[orgType] ?? orgType?.toLowerCase() ?? '';
}

export function budgetLabel(budget: string): string {
  const map: Record<string, string> = {
    UNDER_5K: 'Under $5K', FIVE_TO_15K: '$5K–$15K', FIFTEEN_TO_30K: '$15K–$30K',
    THIRTY_TO_60K: '$30K–$60K', OVER_60K: 'Over $60K', NOT_SURE: 'Not yet determined',
  };
  return map[budget] ?? budget;
}
