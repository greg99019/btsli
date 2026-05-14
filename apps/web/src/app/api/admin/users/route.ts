import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN']

async function getAdmin(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return null
  try { return await verifyAuthToken(token) } catch { return null }
}

export async function GET(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin || !ADMIN_ROLES.includes(admin.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')
  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const isSuperOrConsultant = admin.role === 'SUPER_ADMIN' || admin.role === 'CONSULTANT'
  const where: Record<string, unknown> = {}
  if (!isSuperOrConsultant) where.orgId = admin.orgId ?? undefined
  if (orgId && isSuperOrConsultant) where.orgId = orgId
  if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }]

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, orgId: true, jobTitle: true, department: true, isActive: true, createdAt: true, org: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin(req)
  if (!admin || !ADMIN_ROLES.includes(admin.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, email, password, role, orgId, jobTitle, department } = body
  if (!name || !email || !password) return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ message: 'Email already exists' }, { status: 409 })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role ?? 'PARTICIPANT', orgId: orgId ?? null, jobTitle, department },
    select: { id: true, name: true, email: true, role: true, orgId: true, jobTitle: true, department: true, isActive: true, createdAt: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}
