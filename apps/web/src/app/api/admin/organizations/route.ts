import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

async function getAdmin(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const orgs = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true, moduleAssignments: true } } },
  })
  return NextResponse.json({ orgs })
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin || !['SUPER_ADMIN', 'CONSULTANT'].includes(admin.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, industry, sizeRange } = body
  if (!name) return NextResponse.json({ message: 'Name required' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const existing = await prisma.organization.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const org = await prisma.organization.create({ data: { name, slug: finalSlug, industry, sizeRange } })
  return NextResponse.json({ org }, { status: 201 })
}
