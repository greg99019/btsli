import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  calcSectionScores,
  routeFromAssessment,
  buildSystemsSnapshot,
  generateBriefing,
} from '@/lib/intake-helpers';

export async function POST(
  req: NextRequest,
  { params }: { params: { leadId: string } },
) {
  try {
    const leadId = params.leadId;
    const dto = await req.json();

    const lead = await prisma.leadCapture.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const scores = calcSectionScores(dto);
    const totalScore =
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    const weakestAreas = (Object.entries(scores) as [string, number][])
      .filter(([, s]) => s <= 2.5)
      .sort(([, a], [, b]) => a - b)
      .map(([section]) => section);

    const systemsSnapshot = buildSystemsSnapshot(scores, weakestAreas, lead as unknown as Record<string, unknown>);

    const assessment = await prisma.systemsAssessment.create({
      data: {
        leadId,
        ...scores,
        answers: dto,
        totalScore,
        weakestAreas,
        systemsSnapshot,
      },
    });

    const refinedPath = routeFromAssessment(lead as unknown as Record<string, unknown>, scores);

    await prisma.leadCapture.update({
      where: { id: leadId },
      data: { suggestedPath: refinedPath, status: 'ASSESSMENT_SENT' },
    });

    const briefingData = generateBriefing(
      lead as unknown as Record<string, unknown>,
      scores,
      dto,
      refinedPath,
    );

    await prisma.consultantBriefing.upsert({
      where: { leadId },
      update: briefingData,
      create: { leadId, ...briefingData },
    });

    return NextResponse.json({
      assessmentId: assessment.id,
      refinedPath,
      totalScore,
      weakestAreas,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[intake/assessment POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
