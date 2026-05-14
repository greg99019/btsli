import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  const [modules, progressList, announcements, sessions, notifications, certs] = await Promise.all([
    prisma.trainingModule.count({ where: { isPublished: true } }),
    prisma.moduleProgress.findMany({
      where: { userId: user.id },
      select: { moduleId: true, watchedPct: true, completed: true, quizScore: true },
    }),
    prisma.announcement.findMany({
      where: { OR: [{ orgId: user.orgId }, { orgId: null }] },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      take: 5,
      include: { author: { select: { name: true } } },
    }),
    prisma.liveSession.findMany({
      where: { scheduledAt: { gte: new Date() }, OR: [{ orgId: user.orgId }, { orgId: null }] },
      orderBy: { scheduledAt: 'asc' },
      take: 3,
      include: { host: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { userId: user.id, read: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.workplaceCertificate.count({ where: { userId: user.id } }),
  ])

  const completed = progressList.filter(p => p.completed).length
  const inProgress = progressList.filter(p => !p.completed && p.watchedPct > 0).length
  const notStarted = modules - completed - inProgress

  return NextResponse.json({
    stats: { total: modules, completed, inProgress, notStarted, certificates: certs },
    announcements,
    upcomingSessions: sessions,
    notifications,
    progress: progressList,
  })
}
