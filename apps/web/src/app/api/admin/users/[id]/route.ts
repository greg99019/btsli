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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin || !ADMIN_ROLES.includes(admin.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, role, orgId, jobTitle, department, isActive, password } = body

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name
  if (role !== undefined) data.role = role
  if (orgId !== undefined) data.orgId = orgId || null
  if (jobTitle !== undefined) data.jobTitle = jobTitle
  if (department !== undefined) data.department = department
  if (isActive !== undefined) data.isActive = isActive
  if (password) data.passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, orgId: true, jobTitle: true, department: true, isActive: true },
  })
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdmin(req)
  if (!admin || admin.role !== 'SUPER_ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  await prisma.user.update({ where: { id: params.id }, data: { isActive: false } })
  return NextResponse.json({ ok: true })
}
