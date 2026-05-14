import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN']

async function getUser(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const sessions = await prisma.liveSession.findMany({
    where: ADMIN_ROLES.includes(user.role) ? {} : { OR: [{ orgId: user.orgId }, { orgId: null }] },
    orderBy: { scheduledAt: 'asc' },
    include: { host: { select: { name: true } }, org: { select: { name: true } } },
  })
  return NextResponse.json({ sessions })
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const { title, description, scheduledAt, durationMin, joinUrl, orgId } = await req.json()
  if (!title || !scheduledAt) return NextResponse.json({ message: 'title and scheduledAt required' }, { status: 400 })

  const session = await prisma.liveSession.create({
    data: { title, description, scheduledAt: new Date(scheduledAt), durationMin: durationMin ?? 60, joinUrl, orgId: orgId ?? null, hostId: user.id },
  })
  return NextResponse.json({ session }, { status: 201 })
}
