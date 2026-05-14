import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

const ADMIN_ROLES = ['SUPER_ADMIN', 'CONSULTANT', 'ORG_ADMIN', 'MANAGER']

export async function GET(req: NextRequest) {
  try {
    const token = getRequestToken(req)
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const user = await verifyAuthToken(token)
    if (!ADMIN_ROLES.includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const isSuperOrConsultant = user.role === 'SUPER_ADMIN' || user.role === 'CONSULTANT'
    const orgFilter = isSuperOrConsultant ? {} : { orgId: user.orgId ?? undefined }

    const [totalUsers, totalModules, totalOrgs, totalCompletions, recentCompletions, totalCerts] = await Promise.all([
      prisma.user.count({ where: { isActive: true, ...orgFilter } }),
      prisma.trainingModule.count({ where: { isPublished: true } }),
      isSuperOrConsultant ? prisma.organization.count({ where: { isActive: true } }) : Promise.resolve(1),
      prisma.moduleCompletion.count(),
      prisma.moduleCompletion.findMany({
        take: 5,
        orderBy: { completedAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, module: { select: { title: true } } },
      }),
      prisma.workplaceCertificate.count(),
    ])

    // Module completion rates
    const modules = await prisma.trainingModule.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, category: true, _count: { select: { completions: true, progress: true } } },
    })

    return NextResponse.json({
      totalUsers,
      totalModules,
      totalOrgs,
      totalCompletions,
      totalCerts,
      recentCompletions,
      modules,
    })
  } catch {
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 })
  }
}
