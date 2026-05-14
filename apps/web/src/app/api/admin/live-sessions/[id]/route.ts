import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN']

async function getUser(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const { title, description, scheduledAt, durationMin, joinUrl, orgId } = await req.json()
  const session = await prisma.liveSession.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      ...(durationMin && { durationMin: Number(durationMin) }),
      ...(joinUrl !== undefined && { joinUrl }),
      ...(orgId !== undefined && { orgId: orgId || null }),
    },
    include: { host: { select: { name: true } }, org: { select: { name: true } } },
  })
  return NextResponse.json({ session })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  await prisma.liveSession.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
