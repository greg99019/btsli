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

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')

  const where: Record<string, unknown> = {}
  if (!ADMIN_ROLES.includes(user.role)) where.OR = [{ orgId: user.orgId }, { orgId: null }]
  if (orgId) where.orgId = orgId

  const announcements = await prisma.announcement.findMany({
    where,
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 20,
    include: { author: { select: { name: true } }, org: { select: { name: true } } },
  })
  return NextResponse.json({ announcements })
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const { title, body, type, orgId, pinned } = await req.json()
  if (!title || !body) return NextResponse.json({ message: 'title and body required' }, { status: 400 })

  const ann = await prisma.announcement.create({
    data: { title, body, type: type ?? 'info', orgId: orgId ?? null, authorId: user.id, pinned: pinned ?? false },
    include: { author: { select: { name: true } } },
  })
  return NextResponse.json({ announcement: ann }, { status: 201 })
}
