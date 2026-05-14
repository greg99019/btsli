import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

async function getAdmin(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const org = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      users: { select: { id: true, name: true, email: true, role: true, jobTitle: true, isActive: true } },
      moduleAssignments: { include: { module: { select: { id: true, title: true, category: true } } } },
      announcements: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })
  if (!org) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json({ org })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin || !['SUPER_ADMIN', 'CONSULTANT'].includes(admin.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, industry, sizeRange, isActive } = body
  const org = await prisma.organization.update({ where: { id: params.id }, data: { name, industry, sizeRange, isActive } })
  return NextResponse.json({ org })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin || admin.role !== 'SUPER_ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  await prisma.organization.update({ where: { id: params.id }, data: { isActive: false } })
  return NextResponse.json({ ok: true })
}
