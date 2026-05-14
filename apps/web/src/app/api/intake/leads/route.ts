import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET not set');
  return new TextEncoder().encode(s);
}

async function requireCoach(req: NextRequest): Promise<{ role: string } | null> {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    const role = (payload as { role?: string }).role ?? '';
    if (!['COACH', 'SUPER_ADMIN'].includes(role)) return null;
    return { role };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = await requireCoach(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leads = await prisma.leadCapture.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assessment: { select: { totalScore: true, weakestAreas: true, createdAt: true } },
        briefing: { select: { recommendedService: true, riskLevel: true } },
      },
    });
    return NextResponse.json(leads);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[intake/leads GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
