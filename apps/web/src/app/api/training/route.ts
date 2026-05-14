import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken, getRequestToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getRequestToken(req)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await verifyAuthToken(token)

  // Get all published modules + user's progress for each
  const [modules, progressList] = await Promise.all([
    prisma.trainingModule.findMany({
      where: { isPublished: true },
      orderBy: [{ isRequired: 'desc' }, { orderIdx: 'asc' }],
      select: { id: true, title: true, description: true, category: true, estimatedMinutes: true, isRequired: true, thumbnailUrl: true, _count: { select: { questions: true } } },
    }),
    prisma.moduleProgress.findMany({
      where: { userId: user.id },
      select: { moduleId: true, watchedPct: true, quizScore: true, completed: true, completedAt: true },
    }),
  ])

  const progressMap = new Map(progressList.map(p => [p.moduleId, p]))

  const result = modules.map(m => ({
    ...m,
    progress: progressMap.get(m.id) ?? null,
  }))

  return NextResponse.json({ modules: result })
}
