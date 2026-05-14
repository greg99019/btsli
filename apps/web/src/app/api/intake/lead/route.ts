import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tagChallenge, scoreLead, routeFromIntake } from '@/lib/intake-helpers';

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json();

    const challengeTags = tagChallenge(dto.mainChallenge, dto.whatIsBreaking);
    const leadScore = scoreLead(dto);
    const suggestedPath = routeFromIntake(dto, challengeTags);

    const lead = await prisma.leadCapture.create({
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
        preferredTime: Array.isArray(dto.preferredTime)
          ? dto.preferredTime.join(', ')
          : (dto.preferredTime ?? null),
        additionalNotes: dto.additionalNotes ?? null,
        leadScore,
        suggestedPath,
        status: 'NEW',
      },
    });

    return NextResponse.json({ id: lead.id, suggestedPath, leadScore });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[intake/lead POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
