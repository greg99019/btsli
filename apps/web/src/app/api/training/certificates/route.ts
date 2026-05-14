import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  const certs = await prisma.workplaceCertificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: 'desc' },
    include: { module: { select: { title: true, category: true } }, user: { select: { name: true, org: { select: { name: true } } } } },
  })

  return NextResponse.json({ certificates: certs })
}
