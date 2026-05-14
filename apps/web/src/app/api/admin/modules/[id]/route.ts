import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN']

async function getUser(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const mod = await prisma.trainingModule.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { orderIdx: 'asc' }, include: { choices: true } }, _count: { select: { completions: true, progress: true } } },
  })
  if (!mod) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ module: mod })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user || !ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { questions, ...fields } = body

  const mod = await prisma.trainingModule.update({
    where: { id: params.id },
    data: fields,
    include: { questions: { include: { choices: true } } },
  })
  return NextResponse.json({ module: mod })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(req)
  if (!user || !['SUPER_ADMIN', 'CONSULTANT'].includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  await prisma.trainingModule.update({ where: { id: params.id }, data: { isPublished: false } })
  return NextResponse.json({ ok: true })
}
