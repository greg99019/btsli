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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireCoach(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lead = await prisma.leadCapture.findUnique({
      where: { id: params.id },
      include: { assessment: true, briefing: true },
    });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[intake/lead/:id GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
